import uvicorn
from fastapi import FastAPI
from fastapi.responses import RedirectResponse
import socket
import struct
import time
from threading import Thread
from queue import Queue
from commands import (
    TSS_HOST, TSS_PORT,
    LIDAR_CMD, BRAKE_CMD, THROTTLE_CMD, STEERING_CMD,
    ROVER_X_CMD, ROVER_Y_CMD, ROVER_ALT_CMD,
    ROVER_HEADING_CMD, ROVER_PITCH_CMD, ROVER_ROLL_CMD,
    ROVER_SPEED_CMD,
)
"""
TODO: 
1) Make a utils file, e.g. euclidean distance function is created twice
2) Change file structure, TreeNode class should be it's own file not within the Astar file
3) File names can be improved (sampling, driving)
4) Test RRT functions
5) Implement driving functions, tested with the simulator
6) Implement SLAM in RRT, (possibly as a seperate class, as obstacles are used in driving as well)
"""
app = FastAPI()

class Pipeline():
    def __init__(self, host, port):
        self.address = (host, port)
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        self.sock.connect(self.address)
        
    def _send_packet(self, command_num : int, value : float = None):
        try:
            timestamp = int(time.time())
            msg = struct.pack('>II', timestamp, command_num)
            if(value):
                msg = struct.pack('>IIf', timestamp, command_num, value)
            self.sock.send(msg)
        except Exception as e:
            print(f"Error sending command: {e}")

    def send_instructions(self, command_num, value):
        self._send_packet(command_num, value)

    def send_receive(self, command_num):
        self._send_packet(command_num)
        data = self.sock.recv(1024)
        print(len(data))
        if(command_num == LIDAR_CMD):#if lidar
            #if you look in their codebase, 167(lol, this is the command for lidar - Eric) doesn't actually exist as a command... I don't really know what to put here
            return struct.unpack('>IIfffffffffffff', data)
        else:
            return struct.unpack('>IIf', data)
    
    def close(self):
        self.sock.close()

def start():
    pipeline = Pipeline(TSS_HOST, TSS_PORT)
    #pipeline.send_instructions(command_num = 1109, value = 0.9)
    
    pipeline.send_instructions(THROTTLE_CMD, 0)
    pipeline.send_instructions(BRAKE_CMD, 1)
    pipeline.send_instructions(STEERING_CMD, 0)
    
    pipeline.close()

start()

    
    

    