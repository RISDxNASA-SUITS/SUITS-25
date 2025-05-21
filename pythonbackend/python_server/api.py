from flask import Flask, request, jsonify
from RoverAgents.Navigator import Navigator
from RoverAgents.Scanner import Scanner
from RoverAgents.helper_functions import get_telemetry
import math
import time
import threading

app = Flask(__name__)

# Initialize the agents
navigator = Navigator(15, 300)
scanner = Scanner()

# Global variables to store the current navigation thread and its result
current_navigation_thread = None

def get_rover_pos():
    # Get current rover position from telemetry
    telemetry = get_telemetry()
    while telemetry is None:
        time.sleep(1)
        telemetry = get_telemetry()
    return [telemetry['currentPosX'], telemetry['currentPosY']]

def cluster_points(points, max_threshold, rover_pos):
    if not points:
        return []
    
    clusters = []
    used_points = set()
    
    for i, point in enumerate(points):
        if i in used_points:
            continue
            
        # Start a new cluster with this point
        cluster = [point]
        used_points.add(i)
        
        # Find all points that can be included in this cluster
        for j, other_point in enumerate(points):
            if j in used_points:
                continue
                
            # Calculate distance between points
            distance = math.sqrt((point[0] - other_point[0])**2 + (point[1] - other_point[1])**2)
            
            # Check if adding this point would keep the cluster within max_threshold
            # and if the cluster doesn't contain the rover position
            if distance <= max_threshold:
                # Calculate center of the new potential cluster
                center_x = sum(p[0] for p in cluster + [other_point]) / (len(cluster) + 1)
                center_y = sum(p[1] for p in cluster + [other_point]) / (len(cluster) + 1)
                
                # Check if rover is too close to the cluster center
                rover_distance = math.sqrt((center_x - rover_pos[0])**2 + (center_y - rover_pos[1])**2)
                if rover_distance > max_threshold:
                    # Check if all points in the new cluster would be within max_threshold of the center
                    max_point_distance = max(
                        math.sqrt((p[0] - center_x)**2 + (p[1] - center_y)**2)
                        for p in cluster + [other_point]
                    )
                    
                    if max_point_distance <= max_threshold:
                        cluster.append(other_point)
                        used_points.add(j)
        
        # Calculate the final center of the cluster
        center_x = sum(p[0] for p in cluster) / len(cluster)
        center_y = sum(p[1] for p in cluster) / len(cluster)
        
        # Add just the center to the clusters list
        clusters.append([center_x, center_y])
    
    return clusters

@app.route('/navigate', methods=['POST'])
def navigate_to_point():
    try:
        global current_navigation_thread
        
        # Stop any existing navigation
        if current_navigation_thread and current_navigation_thread.is_alive():
            navigator.stop_driving = True
            print("Stopping navigation")
            current_navigation_thread.join(timeout=2.0)  # Wait for thread to finish
        else:
            print("No navigation to stop")
        data = request.get_json()
        if not data or 'x' not in data or 'y' not in data:
            return jsonify({'error': 'Missing coordinates'}), 400
        
        x = float(data['x'])
        y = float(data['y'])
        print("Navigating to: ", x, y)
        
        # Create and start new navigation thread
        def navigation_task():
            global navigation_result
            navigation_result = navigator.follow_path([x, y])
        
        navigation_result = None
        current_navigation_thread = threading.Thread(target=navigation_task)
        current_navigation_thread.start()
        
        # Wait for the thread to complete
        current_navigation_thread.join()
        
        return jsonify({
            'success': navigation_result,
            'message': 'Navigation completed' if navigation_result else 'Navigation failed'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/scan', methods=['GET'])
def scan_area():
    try:
        global current_navigation_thread
        
        # Stop any existing navigation
        if current_navigation_thread and current_navigation_thread.is_alive():
            navigator.stop_driving = True
            current_navigation_thread.join(timeout=2.0)  # Wait for thread to finish
        
        # Get rover's current position
        rover_pos = get_rover_pos()
        
        # Perform scan at current location
        scan_results = scanner.scan()
        
        # Cluster the points with a maximum threshold of 50 units
        clustered_results = cluster_points(scan_results, 50, rover_pos)
        # print("Scan results: ", len(scan_results))
        # print(scan_results)
        # print("Clustered results: ", len(clustered_results))
        # print(clustered_results)
        return jsonify({
            'success': True,
            'points': clustered_results
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=4000)