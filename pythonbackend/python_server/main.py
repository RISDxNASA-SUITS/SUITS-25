import uvicorn
from fastapi import FastAPI
from fastapi.responses
import socket
import struct
import time

app = FastAPI()

TSS_HOST = "10.37.129.2"
TSS_PORT = 14141

def send_rover_command(command_num: int, value: float):
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as sock:
            timestamp = int(time.time())
            msg = struct.pack('>IIf', timestamp, command_num, value)
            sock.sendto(msg, (TSS_HOST, TSS_PORT))
    except Exception as e:
        print(f"Error sending command: {e}")

@app.get("/")
async def root():
    return "Go to 0.0.0.0/8000/docs"

@app.post("/move_forward")
async def move_forward():
    try:
        send_rover_command(1107, 0.0)  # Release brakes
        time.sleep(0.3)  # Small delay
        send_rover_command(1109, 30.0)  # Set throttle
        return {"message": "Moving forward"}
    except Exception as e:
        return {"message": f"Error: {str(e)}"}

@app.post("/stop")
async def stop():
    try:
        send_rover_command(1109, 0.0)  # Set throttle to zero
        time.sleep(0.3)  # Small delay
        send_rover_command(1107, 1.0) 
        return {"message": "Stopped and brakes engaged"}
    except Exception as e:
        return {"message": f"Error: {str(e)}"}

if __name__ == "__main__":
    # uvicorn.run("python_server:main:app", host="0.0.0.0", port=8000, reload=True)  # Not sure why this doesn't work
    uvicorn.run(app, host="0.0.0.0", port=8000)