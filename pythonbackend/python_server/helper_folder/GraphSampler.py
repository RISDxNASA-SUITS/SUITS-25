import numpy as np
from typing import Tuple, List, Set
from numpy.typing import NDArray
import helper_functions
from Node import Node
from helper_functions import Point

from Astar import astar


class GraphSampler():
    def __init__(self, 
                 path_width : float = 500, 
                 xbound : Tuple[float, float]= (-4000, 4000), 
                 ybound : Tuple[float ,float]= (-4000, 4000),
                 sample_points : int= 1000,
                 current_point : Point = (0, 0),
                 end_goal : Point = (2000, 2000)):
        self.xbound : Tuple[float, float] = xbound
        self.ybound : Tuple[float, float] = ybound
        self.sample_points : int = sample_points
        self.current_node : Node = Node(current_point)
        self.node_to_traverse_to : Node = None
        self.end_goal : Point= end_goal
        self.path_width : float = path_width
        self.known_obstacles : List[Point]= []
        self.list_of_nodes : List[Node] = [self.current_node]
        self._lidar_angles : List[float]= [30, 20, 0, -20, -30, 0, 0, 90, -90, 140, 180, 180, 220]
        self._sensor_offsets : List[List[float]]= [[170, -150, 15], [200, -40, 20], [200, 0, 20], [200, 40, 20], [170, 150, 15], [200, -40, 20], [200, 40, 20], [0, -100, 0], [0, 100, 0], [-135, -160, 15], [-180, -60, 15], [-180, 60, 15], [-135, 160, 15]]
    def _sample(self) -> NDArray:
        '''
        Generates N sample points in the graph
        '''
        sample = np.random.rand(self.sample_points, 2)
        samples = []
        for s in sample:
            s[0] = s[0] * (self.xbound[1] - self.xbound[0]) + self.xbound[0]
            s[1] = s[1] * (self.ybound[1] - self.ybound[0]) + self.ybound[0]
            samples.append(s)
        return samples
    
    def check_valid_path(self, start : Point, end : Point) -> bool:
        """
        Identifies whether a straight line path can connect two given points given known obstacles
        
        Args:
        start: (x,y) of the path's start
        end: (x,y) of the path's end
        
        Returns:
        True or False whether path exists or not
        """
        for obstacle in self.known_obstacles:
            obstacle_dist_to_path = helper_functions.obstacle_path_distance(obstacle, start, end)
            obstacle_dist_to_start = helper_functions.euclidean_distance(obstacle, start)
            obstacle_dist_to_end = helper_functions.euclidean_distance(obstacle, end)
            
            if (obstacle_dist_to_path <= self.path_width or 
                obstacle_dist_to_start <= self.path_width or 
                obstacle_dist_to_end <= self.path_width):
                return False
        return True
    def get_nearest_node(self, point : Point) -> Node:
        """
        Finds the nearest node in the graph
        
        UNTESTED
        
        Args:
        point: the query location in x and y
        Returns:
        The nearest node in the tree
        """
        closest_node = self.current_node
        for node in self.list_of_nodes:
            if(helper_functions.path_function(closest_node.position, point) > helper_functions.path_function(node.position, point)):
                closest_node = node
        return closest_node

    def add_obstacle(self, lidar_reading : List[float]) -> None:
        """
        Adds an obstacle to known obstacle list
        
        UNTESTED
        
        Args:
        lidar_reading: list of length 13 with lidar readings
        Returns:
        Nothing, updates internal map in known_obstacles
        """
        # TODO: Make this use SLAM, temporary for basic first implementation
        # This is a basic obstacle point map, in future we can use slam to generate a map that is updated as we move
        assert(len(lidar_reading) == 13)
        for i in range(len(lidar_reading)):
            if lidar_reading[i] != -1:
                location_x = lidar_reading[i]*np.cos(self._lidar_angles[i]*2*np.pi/360) + self._sensor_offsets[i][0] + self.current_node.position[0]
                location_y = lidar_reading[i]*np.sin(self._lidar_angles[i]*2*np.pi/360) + self._sensor_offsets[i][1] + self.current_node.position[1]
                self.known_obstacles.append([location_x, location_y])

    def get_graph(self) -> None:
        """
        Generates a new graph, starting at the graph_start node and replaces self.graph_goal with the closest point to the goal
        TODO: If a sampled point is too close to the nearest node, skip
        
        UNTESTED
        
        Args: None
        Returns: None
        """
        sample = self._sample()
        for new_point in sample:
            new_point = tuple(new_point)
            nearest_node = self.get_nearest_node(new_point)
            if self.check_valid_path(nearest_node.position, new_point):
                #creating a new node
                if(self.node_to_traverse_to is None):
                    self.node_to_traverse_to = self.current_node
                new_node = Node(new_point)
                new_node.g = nearest_node.g + helper_functions.path_function(nearest_node.position, new_point)#initialize some g before AStar is called
                new_node.h = self.heuristic_function(new_point)
                new_node.f = new_node.g + new_node.h
                new_node.parent_node = nearest_node
                if helper_functions.euclidean_distance(new_point, self.end_goal) < helper_functions.euclidean_distance(self.node_to_traverse_to.position, self.end_goal):
                    self.node_to_traverse_to = new_node
                    if helper_functions.euclidean_distance(new_point, self.end_goal) <= 10:
                        return
                    
                #bidirectional graph behavior
                new_node.add_neighbor(nearest_node)
                nearest_node.add_neighbor(new_node)

                self.list_of_nodes.append(new_node)
        return
    
    
    def heuristic_function(self, point : Point) -> float:
        '''
        Heuristic Function for estimating the value of a point in the graph. Currently simple Euclidean function.
        '''
        return helper_functions.euclidean_distance(point, self.end_goal)
    def reset_graph(self, current_point : Point = (0,0)):
        """
        Resets the graph with a start at current point
        (TODO: RECURSIVELY DELETE THE OLD GRAPH)
        
        Args:
        current_point: the start of the new graph
        Returns: None
        """
        # TODO: Need to destroy previous tree in memory when we start, will include adding a recursive delete function
        self.current_node = Node(current_point)
        self.node_to_traverse_to = None
        self.list_of_nodes = [self.current_node]

def main():
    print("TEST CASE")
    sampler = GraphSampler(sample_points = 5, end_goal = (1000, 1500))
    sampler.get_graph()
    path = astar(sampler.list_of_nodes[0], sampler.list_of_nodes[4])
    print("NODES: ")
    for i in sampler.list_of_nodes:
        print(i)
    print("\n")
    print(f"PATH FROM {sampler.list_of_nodes[0]} to {sampler.list_of_nodes[4]}: {path}")
    

if __name__ == "__main__":
    main()
