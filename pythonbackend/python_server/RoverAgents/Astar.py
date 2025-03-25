import heapq
import math
#Author: Hongwei Liao
#reference: https://medium.com/@nicholas.w.swift/easy-a-star-pathfinding-7e6689c7f7b2
class TreeNode:
    '''
    position: (row, col)
    g: cost from start
    h: heuristic cost to the goal
    f: total cost(g + h)
    parent: pointer to the node that generated it
    children: list of generated successors
    '''
    def __init__(self, position, parent=None):
        self.position = position
        self.parent = parent
        self.g = 0
        self.h = 0
        self.f = 0
        self.children = []

    # Magic method, used for priorityQueue comparison
    def __lt__(self, other):
        return self.f < other.f
    
    def add_child(self, child_node):
        self.children.append(child_node)

    def __eq__(self, other):
        if not isinstance(other, TreeNode):
            return False
        return self.position == other.position
    
def euclidean_distance(pos_a, pos_b):
    return math.sqrt((pos_a[0] - pos_b[0]) ** 2 + (pos_a[1] - pos_b[1])**2)

def astar(graph, start, goal):
    '''
    graph: the Tree for path
    positions: all nodes and their positions
    start: start node ex: ('A')
    goal: goal node ex: ('D')
    '''
    start_node = TreeNode(start)
    goal_node = TreeNode(goal)

    #Priority queue for path searching
    open_list = []
    heapq.heappush(open_list, start_node)

    #Closed set to track visited nodes
    closed_set = set()
    while open_list:
        cur_node = heapq.heappop(open_list)
        if(cur_node == goal_node):
            return generate_path(cur_node)
        
        closed_set.add(cur_node.position)

        for (neighbor_pos, cost) in graph.get(cur_node.position, []):
            if neighbor_pos in closed_set:
                continue

            neighbor_node = TreeNode(neighbor_pos, parent = cur_node)

            #Compute new cost
            update_g = cur_node.g + cost
            update_h = euclidean_distance(cur_node.position, goal_node.position)
            update_f = update_g + update_h

            #Check if this neighbor is alread yin the open list with a better cost
            better_path_found = False
            for open_node in open_list:
                if neighbor_node == open_node:
                    if update_g >= open_node.g:
                        better_path_found = True
                    break
            if not better_path_found:
                neighbor_node.g = update_g
                neighbor_node.h = update_h
                neighbor_node.f = update_f

                cur_node.add_child(neighbor_node)
                heapq.heappush(open_list, neighbor_node)
    return None

def generate_path(end_node):
    path = []
    cur = end_node
    while cur is not None:
        path.append(cur.position)
        cur = cur.parent
    return path[::-1]

#Sample tast case 
def main():
    # (0, 0) -> (0, 1) -> (0, 2) -> (0, 3) -> (0, 4)
    #                        |                  |
    #  (1, 0) -> (1, 1) -> (1, 2) <- (1,3)  <- (1, 4)
    graph = {
        (0,0): [((0,1), 1)],
        (0,1): [((0,0), 1), ((0,2), 1)],
        (0,2): [((0,1), 1), ((1, 2), 1), ((0, 3), 1)],
        (0,3): [((0, 2), 1), ((0, 4), 1)],
        (0,4): [((0, 3), 1), ((1, 4), 1)],
        (1,0): [((1,1), 1)],
        (1,1): [((1,0), 1), ((1,2), 1)],
        (1,2): [((0, 2), 1), ((1,1), 1),((1,3), 1)],
        (1,3): [((1, 2), 1), ((1, 4), 1)],
        (1,4): [((1, 3), 1), ((0, 4), 1)]
    }

    start = (0, 0)
    goal = (1, 3)

    path = astar(graph, start, goal)
    if path:
        print("Path found:", path)
    else:
        print("No path found.")

if __name__ == "__main__":
    main()
