#https://docs.pydantic.dev/latest/why/#type-hints

from pydantic import BaseModel, Field
from ..helper_folder.GraphSampler import GraphSampler
from helper_folder.Astar import astar
from Navigator import AStarNavigator
import requests

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
    def process_telemetry(self) -> OutputData:
    
    
    def lidar(self):
        

