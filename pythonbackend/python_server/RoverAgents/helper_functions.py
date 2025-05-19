import math, sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from commands import (
    TSS_HOST, TSS_PORT,
    LIDAR_CMD, BRAKE_CMD, THROTTLE_CMD, STEERING_CMD,
    ROVER_X_CMD, ROVER_Y_CMD, ROVER_ALT_CMD,
    ROVER_HEADING_CMD, ROVER_PITCH_CMD, ROVER_ROLL_CMD,
    ROVER_SPEED_CMD,
)
from main import Pipeline
from typing import Tuple, List, Dict
# from Node import Node
import requests
import json

Point = Tuple[float, float]
BASE_URL = "http://localhost:7070"
pipeline = Pipeline(TSS_HOST, TSS_PORT)

def get_lidar():
    try:
        response = requests.get(f"{BASE_URL}/lidar")
        if response.status_code == 200:
            return response.json()
    except (requests.exceptions.RequestException, json.JSONDecodeError) as e:
        print(f"Error getting telemetry from server: {e}")
    # response = pipeline.send_receive(LIDAR_CMD)
    # if not response:
    #     return []
    # _, _, *lidar_data = response
    # returnObject = {'data': lidar_data}
    # return returnObject

def get_rover_location() -> Dict[str, float]:
    x_data = pipeline.send_receive(ROVER_X_CMD)
    y_data = pipeline.send_receive(ROVER_Y_CMD)
    alt_data = pipeline.send_receive(ROVER_ALT_CMD)
    if not (x_data and y_data and alt_data):
        return {}
    return {
        "x":    x_data[2],
        "y":    y_data[2],
        "altitute":  alt_data[2],
    }

def get_rover_orientation() -> Dict[str, float]:
    heading_data = pipeline.send_receive(ROVER_HEADING_CMD)
    pitch_data = pipeline.send_receive(ROVER_PITCH_CMD)
    roll_data = pipeline.send_receive(ROVER_ROLL_CMD)
    if not (heading_data and pitch_data and roll_data):
        return {}
    return {
        "heading":    heading_data[2],
        "pitch":    pitch_data[2],
        "roll":  roll_data[2],
    }
def get_speed():
    speed_data = pipeline.send_receive(ROVER_SPEED_CMD)
    return speed_data[2] if speed_data else 0.0

def get_telemetry() -> Dict[str, object]:
    try:
        response = requests.get(f"{BASE_URL}/telemetry")
        if response.status_code == 200:
            return response.json()
    except (requests.exceptions.RequestException, json.JSONDecodeError) as e:
        print(f"Error getting telemetry from server: {e}")
    
    # Fallback to direct telemetry gathering
    # location = get_rover_location()
    # orientation = get_rover_orientation()
    # speed = get_speed()
    # return {
    #     'currentPosX': location['x'],
    #     'currentPosY': location['y'],
    #     'heading': orientation['heading'],
    #     'speed': speed
    # }

def post_brakes(brake_input: float):
    payload = {"brakeInput": brake_input}
    response = requests.post(f"{BASE_URL}/brakes", json=payload)
    return response.status_code, response.text
    # pipeline.send_instructions(BRAKE_CMD, brake_input)
    # print(f"brake set to {brake_input}")

def post_throttle(throttle_input: float):
    payload = {"throttleInput": throttle_input}
    response = requests.post(f"{BASE_URL}/throttle", json=payload)
    return response.status_code, response.text
    # pipeline.send_instructions(THROTTLE_CMD, throttle_input)
    # print(f"throttle set to {throttle_input}")


def post_steering(steering_input: float):
    payload = {"steeringInput": steering_input}
    response = requests.post(f"{BASE_URL}/steering", json=payload)
    return response.status_code, response.text
    # pipeline.send_instructions(STEERING_CMD, steering_input)
    # print(f"steering set to {steering_input}")


def euclidean_distance(pos_a : Point, pos_b : Point) -> float:
    '''
    Gets the Euclidean Distance between 2 positions
    '''
    return math.sqrt((pos_a[0] - pos_b[0]) ** 2 + (pos_a[1] - pos_b[1])**2)

def path_function(point_a : Point, point_b : Point) -> float:
    '''
    A-star Cost Function between two points. Currently simple Euclidean function
    '''
    return euclidean_distance(point_a, point_b)
# def trace_path(final_node : Node) -> List[Point]:
#     '''
#     Traces the path leading from the first node in a tree to the final node in the tree
#     '''
#     path = []
#     cur_node = final_node
#     while cur_node is not None:
#         path.append(cur_node.position)
#         cur_node = cur_node.parent_node
#     return path[::-1]


def obstacle_path_distance(obstacle : Point, path_start : Point, path_end : Point) -> float:
    """
    Calculate the shortest distance from a obstacle to a path.
    
    Args:
    obstacle: (x, y) of the obstacle
    path_start: (x, y) of the path's start point
    path_end: (x, y) of the path's end point
    
    Returns:
    Shortest distance from the obstacle and the closest point on the path
    """
    path_vec = (path_end[0] - path_start[0], path_end[1] - path_start[1])
    point_vec = (obstacle[0] - path_start[0], obstacle[1] - path_start[1])
    
    path_len_sq = path_vec[0]**2 + path_vec[1]**2
    if path_len_sq == 0:
        return euclidean_distance(obstacle, path_start)
    
    t = max(0, min(1, (point_vec[0]*path_vec[0] + point_vec[1]*path_vec[1]) / path_len_sq))
    
    closest = (
        path_start[0] + t * path_vec[0],
        path_start[1] + t * path_vec[1]
    )
    
    return euclidean_distance(obstacle, closest)