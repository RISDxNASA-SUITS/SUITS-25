from typing import List, Tuple

Point = Tuple[float, float]
class Node:
    '''
    position: (row, col)
    g: cost from start
    h: heuristic cost to the goal
    f: total cost(g + h)
    neighbors: list of neighboring nodes
    '''
    def __init__(self, position, parent = None):
        self.position : Point = position
        self.g : float= 0
        self.h : float= 0
        self.f :float = 0
        self.neighbors : List[Node] = []
        self.parent_node : Node = parent#only really used in A-Star

    def get_neighbors(self):
        return self.neighbors
    def add_neighbor(self, neighbor_node):
        '''
        Adds a neighboring node
        '''
        self.neighbors.append(neighbor_node)
    
    # Magic method, used for priorityQueue comparison
    def __lt__(self, other):
        return self.f < other.f

    def __eq__(self, other):
        if not isinstance(other, Node):
            return False
        return self.position == other.position
    
    def __hash__(self):
        return hash(self.position)
    
    def __str__(self):
        return f"Node @ {self.position}"
    