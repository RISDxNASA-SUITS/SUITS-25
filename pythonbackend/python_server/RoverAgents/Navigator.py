import time
from helper_functions import euclidean_distance, get_lidar, get_telemetry, post_brakes, post_steering, post_throttle
import math

class Navigator:
    def __init__(self, angle = 15, wall_threshold = 500):
        self.angle = angle
        self.wall_threshold = wall_threshold
        self.forward = 1
        self.start = None
        self.end = None
        self.wall_found = False
        self.accelerating_count = 0
        self.returning = False
        self.lidar_weights = {
            0: 3,  # Front left wheel (30° left)
            1: 2.5,  # Front left (20° left)
            2: 2.5,  # Front center
            3: 2.5,  # Front right (20° right)
            4: 3,  # Front right wheel (30° right)
            5: 0.45,  # Front left downward
            6: 0.45,  # Front right downward
            7: 0.2,  # Center left downward
            8: 0.2,  # Center right downward
            9: 0.0001 ,  # Back left wheel
            10: 0.0001, # Rear left
            11: 0.0001, # Rear right
            12: 0.0001, # Back right wheel
        }
        pass

    def follow_path(self, end) -> bool:
        '''
        path: The straight line path
        max_run_time: max running time before timeout
        '''
        finished = False
        while not finished:
            telemetry = get_telemetry()
            while telemetry is None:
                post_throttle(0)
                time.sleep(1)
                telemetry = get_telemetry()
            current_position = [telemetry['currentPosX'], telemetry['currentPosY']]
            distance_from_base = euclidean_distance(current_position, end)
            if distance_from_base < 10:
                post_throttle(0)
                post_steering(0)
                return True
            else:
                print("Distance from base: ", distance_from_base)
                self.start = current_position
            self.start = current_position
            self.end = end
            y_difference =  self.start[1] - self.end[1]
            x_difference = self.start[0] - self.end[0]
            print(current_position)
            

            get_lidar_resp = get_lidar()
            while get_lidar_resp is None:
                post_throttle(0)
                time.sleep(1)
                get_lidar_resp = get_lidar()
            lidar = get_lidar_resp['data']
            for i in range(len(lidar)):
                if lidar[i] < 1:
                    lidar[i] = 1500
                else:
                    lidar[i] = lidar[i] * 1/self.lidar_weights[i]
            print(lidar)
            telemetry = get_telemetry()
            while telemetry is None:
                post_throttle(0)
                time.sleep(1)
                telemetry = get_telemetry()
            if min(lidar) <= self.wall_threshold:
                # self.wall_found = True
                post_steering(0)
                post_throttle(0)
                time.sleep(0.2)
                
                if lidar[2] <= self.wall_threshold:
                    print("Forward")
                    self.wall_following('forward')
                elif min(lidar[0], lidar[1], lidar[5], lidar[7]) <= self.wall_threshold and min(lidar[0], lidar[1], lidar[5], lidar[7]) < min(lidar[3], lidar[4], lidar[6], lidar[8]):
                    if min(lidar[0], lidar[1], lidar[5], lidar[7]) <= 0.5*self.wall_threshold:
                        post_steering(-1)
                        post_throttle(-30)
                        time.sleep(2)
                        post_throttle(0)
                    self.wall_following('left')
                elif min(lidar[3], lidar[4], lidar[6], lidar[8]) <= self.wall_threshold:
                    if min(lidar[3], lidar[4], lidar[6], lidar[8]) <= 0.5*self.wall_threshold:
                        post_steering(1)
                        post_throttle(-30)
                        time.sleep(2)
                        post_throttle(0)
                    self.wall_following('right')
                else:
                    print("Forward")
                    self.wall_following('forward')
            else:        
                angle = -math.atan2(y_difference, x_difference) + math.pi/2
                if angle > math.pi:
                    angle -= 2*math.pi
                print(f"Angle: {angle}")
                print(f"Heading: {telemetry['heading']/180 * math.pi}")
                steer = self.set_dir(angle, telemetry['heading']) # definetly need to test this with the telemetry
                post_steering(steer/math.pi)
                print(f"Steer: {steer/math.pi}")
                print(f"Heading to point {end}...")
            if telemetry['speed'] > 5:
                post_throttle(0)
                time.sleep(0.3)
                post_throttle(23)
            elif telemetry['speed'] > 2:
                post_throttle(1)
            else:
                post_throttle(23)
            post_brakes(0)
            time.sleep(0.1)
            if telemetry['speed'] == 0.0:
                self.accelerating_count = 0
        

    def set_dir(self, angle_goal, heading):
        '''
        Set the steering direction based on current heading and goal angle.
        Returns steering value between -1 (full right) and 1 (full left).
        '''
        # Normalize both angles to be between 0 and 360
        heading = heading/180 * math.pi
        a = (heading - angle_goal) % (2*math.pi)
        b = (angle_goal - heading) % (2*math.pi)
        return -a if a < b else b
        
        
    def wall_following(self, strategy):
        '''
        Simple obstacle avoidance:
        1. Turn 90 degrees to the left
        2. Move forward for 1-2 seconds
        3. Turn 90 degrees to the right 
        4. Continue if path is clear, or repeat
        
        strategy: 'left' or 'right' (direction of initial turn)
        '''
        print(f"Starting simple obstacle avoidance maneuver")
        
        if strategy == 'left':
            print("Left")
            post_steering(1)
            post_throttle(30)
            time.sleep(0.4)
            post_throttle(0)
            time.sleep(0.4)
        elif strategy == 'right':
            print("Right")
            post_steering(-1)
            post_throttle(30)
            time.sleep(0.4)
            post_throttle(0)
            time.sleep(0.4)
        else:
            print("Forward")
            post_throttle(0)
            post_steering(0)
            get_lidar_resp = get_lidar()
            diff = 0
            diff_abs = 0
            while get_lidar_resp is None:
                post_throttle(0)
                time.sleep(1)
                get_lidar_resp = get_lidar()
            lidar = get_lidar_resp['data']
            for i in range(len(lidar)):
                if lidar[i] < 1:
                    lidar[i] = 1500
                else:
                    lidar[i] = lidar[i] * 1/self.lidar_weights[i]
            diff = min(lidar[0], lidar[1], lidar[5], lidar[7]) - min(lidar[3], lidar[4], lidar[6], lidar[8])
            diff_abs = abs(diff)
            post_throttle(-35)
            time.sleep(3)
            post_throttle(0)
            time.sleep(0.5)
            get_lidar_resp = get_lidar()
            diff2 = 0
            diff2_abs = 0
            while get_lidar_resp is None:
                post_throttle(0)
                time.sleep(1)
                get_lidar_resp = get_lidar()
            lidar = get_lidar_resp['data']
            for i in range(len(lidar)):
                if lidar[i] < 1:
                    lidar[i] = 1500
                else:
                    lidar[i] = lidar[i] * 1/self.lidar_weights[i]
            diff2 = min(lidar[0], lidar[1], lidar[5], lidar[7]) - min(lidar[3], lidar[4], lidar[6], lidar[8])
            diff2_abs = abs(diff2)
            if diff2_abs > diff_abs:
                if diff2 > 0:
                    post_steering(1)
                else:
                    post_steering(-1)
            else:
                if diff > 0:
                    post_steering(1)
                else:
                    post_steering(-1)
            post_throttle(50)
            time.sleep(3)
            post_steering(0)
            time.sleep(3)
            post_throttle(0)
            time.sleep(1.5)