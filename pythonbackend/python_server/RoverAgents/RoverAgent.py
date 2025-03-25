#https://docs.pydantic.dev/latest/why/#type-hints

from pydantic import BaseModel, Field

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
    def process_telemetry(self) -> OutputData:
        return OutputData(breaks=False, steering=0, throttle=100)

    

