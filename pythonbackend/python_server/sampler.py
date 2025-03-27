import numpy as np
import math
from RoverAgents.Astar import TreeNode
class GraphSampler():
    def __init__(self, path_width = 500, 
                 xbound = (-4000, 4000), ybound = (-4000, 4000),
                 sample_points = 1000,
                 current_point = (0, 0),
                 goal_point = (2000, 2000)):
        self.xbound = xbound
        self.ybound = ybound
        self.sample_points = sample_points
        self.graph_start = TreeNode(current_point)
        self.graph_goal = None
        self.current_point = current_point
        self.goal_point = goal_point
        self.path_width = path_width
        self.known_obstacles = []
        self.lidar_angles = [30, 20, 0, -20, -30, 0, 0, 90, -90, 140, 180, 180, 220]
        self.sensor_offsets = [[170, -150, 15], [200, -40, 20], [200, 0, 20], [200, 40, 20], [170, 150, 15], [200, -40, 20], [200, 40, 20], [0, -100, 0], [0, 100, 0], [-135, -160, 15], [-180, -60, 15], [-180, 60, 15], [-135, 160, 15]]
    def _sample(self):
        sample = np.random.rand((self.sample_points, 2))
        sample[0] = sample[0] * (self.xbound[1] - self.xbound[0]) + self.xbound[0]
        sample[1] = sample[1] * (self.ybound[1] - self.ybound[0]) + self.ybound[0]
        return sample
    def obstacle_path_distance(self, obstacle, path_start, path_end):
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
            return self._euclidean(obstacle, path_start)
        
        t = max(0, min(1, (point_vec[0]*path_vec[0] + point_vec[1]*path_vec[1]) / path_len_sq))
        
        closest = (
            path_start[0] + t * path_vec[0],
            path_start[1] + t * path_vec[1]
        )
        
        return self._euclidean(obstacle, closest)
    
    def check_valid_path(self, start, end):
        """
        Identifies whether a straight line path can connect two given points
        
        Args:
        start: (x,y) of the path's start
        end: (x,y) of the path's end
        
        Returns:
        True or False whether path exists or not
        """
        for obstacle in self.known_obstacles:
            dist_to_path = self.obstacle_path_distance(obstacle, start, end)
            
            dist_to_start = self._euclidean(obstacle, start)
            dist_to_end = self._euclidean(obstacle, end)
            
            if (dist_to_path <= self.path_width or 
                dist_to_start <= self.path_width or 
                dist_to_end <= self.path_width):
                return False
        
        return True
    def _euclidean(self, point1, point2):
        return math.sqrt((point1[0] - point2[0])**2 + (point1[1] - point2[1])**2)
    def nearest_nodes(self, point) -> TreeNode:
        """
        Finds the nearest node in the graph (currently brute force DFS)
        
        UNTESTED
        
        Args:
        point: the query location in x and y
        Returns:
        The nearest node in the tree
        """
        # DFS for nearst node, done through brute force approach
        current_node = self.graph_start
        nearest_node, _ = self.check_node(current_node, self._euclidean(current_node.position, point), current_node, point)
        return nearest_node
        
    
    def check_node(self, node, nearest_distance, nearest_node, point):
        """
        DFS search through graph
        
        UNTESTED
        
        Args:
        node: current node to search
        nearest_distance: the current closest distance
        nearest_node: the current nearest node
        point: query point
        Returns:
        nearest_node and the nearest_distance
        """
        for child in node.children:
            current_position = child.position
            if self._euclidean(current_position, point) < nearest_distance:
                nearest_distance = self._euclidean(current_position, point)
                nearest_node = child
            nearest_node, nearest_distance = self.check_node(child, nearest_distance, nearest_node, point)
        return nearest_node, nearest_distance            
        
    def add_obstacle(self, lidar_reading) -> None:
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
                location_x = lidar_reading[i]*np.cos(self.lidar_angles[i]*2*np.pi/360) + self.sensor_offsets[i][0] + self.current_point[0]
                location_y = lidar_reading[i]*np.sin(self.lidar_angles[i]*2*np.pi/360) + self.sensor_offsets[i][1] + self.current_point[1]
                self.known_obstacles.append([location_x, location_y])

    def get_graph(self):
        """
        Generates a new graph, starting at the graph_start node and replaces self.graph_goal with the closest point to the goal
        TODO: If a sampled point is too close to the nearest node, skip
        
        UNTESTED
        
        Args: None
        Returns: None
        """
        sample = self._sample()
        for point in sample:
            nearest_nodes = self.nearest_nodes(point)
            if self.check_valid_path(nearest_nodes.position, point):
                weight = self._euclidean(nearest_nodes.position, point)
                g = nearest_nodes.f
                new_node = TreeNode(point, nearest_nodes)
                new_node.g = g
                new_node.h = weight
                new_node.f = g+weight
                nearest_nodes.add_child(new_node)
                if self.graph_goal == None:
                    self.graph_goal = self.graph_start
                if self._euclidean(point, self.goal_point) < self._euclidean(self.graph_goal.position, self.goal_point):
                    self.goal_point = new_node
                    if self._euclidean(point, self.goal_point) <= 200:
                        return
        return
                
    def reset_graph(self, current_point = (0,0)):
        """
        Resets the graph with a start at current point
        (TODO: RECURSIVELY DELETE THE OLD GRAPH)
        
        Args:
        current_point: the start of the new graph
        Returns: None
        """
        # TODO: Need to destroy previous tree in memory when we start, will include adding a recursive delete function
        self.graph_start = TreeNode(current_point)
        self.goal_point = None