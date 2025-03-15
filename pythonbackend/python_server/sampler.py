import numpy as np
import math
class GraphSampler():
    def __init__(self, unpassable_threshold = 5, 
                 xbound = (0, 400), ybound = (0, 400),
                 sample_points = 1000,
                 current_point = (0, 0),
                 goal_point = (400, 400)):
        self.unpassable_threshold = unpassable_threshold
        self.xbound = xbound
        self.ybound = ybound
        self.sample_points = sample_points
        self.graph = []
        self.current_point = current_point
        self.goal_point = goal_point
    def _sample(self):
        sample = np.random.rand((self.sample_points, 2))
        sample[0] = sample[0] * (self.xbound[1] - self.xbound[0]) + self.xbound[0]
        sample[1] = sample[1] * (self.ybound[1] - self.ybound[0]) + self.ybound[0]
        return sample
    def _confirm(self, point1, point2):
        #returns whether point 1 and point 2 can be connected
        return (np.rand(1) >= 0.5)
    def _euclidean(self, point1, point2):
        return math.sqrt((point1[0] - point2[0])**2 + (point1[1] - point2[1])**2)
    def nearest_nodes(self, point):
        #returns the nearest K nodes to "point"
        pass

    def get_graph(self):
        sample = self._sample()
        for point in sample:
            nearest_nodes = self.nearest_nodes(point)
            if(nearest_nodes):#if the nearest node exists, add a graph
                self.graph.append((nearest_nodes, point))
    def reset_graph(self, current_point = (0,0)):
        self.graph = [(current_point, self.goal_point)]