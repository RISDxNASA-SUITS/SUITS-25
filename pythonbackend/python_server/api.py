from flask import Flask, request, jsonify
from flask_cors import CORS
from RoverAgents.Navigator import Navigator
from RoverAgents.Scanner import Scanner
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize the agents
navigator = Navigator(15, 300)
scanner = Scanner()

@app.route('/navigate', methods=['POST'])
def navigate_to_point():
    try:
        data = request.get_json()
        if not data or 'x' not in data or 'y' not in data:
            return jsonify({'error': 'Missing coordinates'}), 400
        
        x = float(data['x'])
        y = float(data['y'])
        
        # Navigate to the point
        success = navigator.follow_path([x, y])
        
        return jsonify({
            'success': success,
            'message': 'Navigation completed' if success else 'Navigation failed'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/scan', methods=['GET'])
def scan_area():
    try:
        print("Scan request received")
        # Perform scan at current location
        scan_results = scanner.scan()
        print(f"Scan completed with results: {scan_results}")
        
        return jsonify({
            'success': True,
            'points': scan_results
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=4000) 