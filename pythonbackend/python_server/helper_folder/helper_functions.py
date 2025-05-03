import math
from typing import Tuple, List, Dict
from Node import Node

Point = Tuple[float, float]
import requests

BASE_URL = "http://localhost:7070"

def get_lidar():
    response = requests.post(f"{BASE_URL}/lidar")
    return response.json()

def get_telemetry():
    response = requests.get(f"{BASE_URL}/telemetry")
    return response.json()

def post_brakes(brake_input: float):
    payload = {"brakeInput": brake_input}
    response = requests.post(f"{BASE_URL}/brakes", json=payload)
    return response.status_code, response.text

def post_throttle(throttle_input: float):
    payload = {"throttleInput": throttle_input}
    response = requests.post(f"{BASE_URL}/throttle", json=payload)
    return response.status_code, response.text

def post_steering(steering_input: float):
    payload = {"steeringInput": steering_input}
    response = requests.post(f"{BASE_URL}/steering", json=payload)
    return response.status_code, response.text


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
def trace_path(final_node : Node) -> List[Point]:
    '''
    Traces the path leading from the first node in a tree to the final node in the tree
    '''
    path = []
    cur_node = final_node
    while cur_node is not None:
        path.append(cur_node.position)
        cur_node = cur_node.parent_node
    return path[::-1]


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