#https://docs.pydantic.dev/latest/why/#type-hints

from pydantic import BaseModel, Field
from ..sampler import GraphSampler
from Astar import astar
from Nevigator import AStarNavigator

class OutputData(BaseModel):
    breaks:bool
    steering: float = Field(ge=-1, le=1),
    throttle: float = Field(ge=-100, le=100),


class RoverAgentAbstract(BaseModel):
    # TODO: Make sure this actually functions as intended
    class Config:
        abstract = True

    def process_telemetry(self) -> OutputData:
        """Process telemetry data from the rover"""
        raise NotImplementedError("Subclasses must implement process_telemetry()")



class RoverAgentBasic(RoverAgentAbstract):
    #TODO Implement VERY BASIC rover agent, drives in a straight line, or something similarly simplistic
    """
    Start of initial implementation, the Rover currently will continue in the loop until it reaches the goal
    
    TODO: Should functions be restructured to give output direction each time it is called, or should the driving class determine all movement
    SHOULD DISCUSS, this version wouldn't return until the destination is reached
    """
    def process_telemetry(self, start, goal) -> OutputData:
        RRT_graph = GraphSampler(current_point=start, goal_point=goal)
        while start != goal:
            lidar_reading = None #TODO: Need to get lidar data from TSS
            RRT_graph.add_obstacle(lidar_reading)
            RRT_graph.get_graph()
            astar_path = astar(RRT_graph.graph_start, RRT_graph.graph_start.position, RRT_graph.graph_goal.position)
            #TODO: Need to change astar inputs to start and goal nodes
            reached_goal = AStarNavigator.follow_astar_path(astar_path)
            if reached_goal == True:
                return
            else:
                current_position = None #Get position from TSS
                RRT_graph.reset_graph(current_position)
        return
    

