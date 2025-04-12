import heapq
import math
from typing import List
import helper_functions
from Node import Node
from helper_functions import Point

#Author: Hongwei Liao
#reference: https://medium.com/@nicholas.w.swift/easy-a-star-pathfinding-7e6689c7f7b2



def astar(start_node : Node, goal_node : Node) -> List[Point]:
    '''
    positions: all nodes and their positions
    start: start node
    goal: goal node
    '''

    #Priority queue for path searching
    open_list : List[Node]= []
    heapq.heappush(open_list, start_node)

    while open_list:
        cur_node : Node = heapq.heappop(open_list)
        if(cur_node == goal_node):
            return helper_functions.trace_path(cur_node)
        for neighbor_node in cur_node.get_neighbors():
            #Compute an updated g for neighbornode
            updated_g = cur_node.g + helper_functions.path_function(cur_node.position, neighbor_node.position)
            if(updated_g <= neighbor_node.g):
                neighbor_node.g = updated_g
                neighbor_node.f = neighbor_node.h + updated_g
                neighbor_node.parent_node = cur_node
                heapq.heappush(open_list, neighbor_node)
    return None

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
