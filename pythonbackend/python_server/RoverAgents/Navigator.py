import time
from helper_folder.helper_functions import euclidean_distance, get_lidar, get_telemetry, post_brakes, post_steering, post_throttle
import math
class Navigator:
    def __init__(self, angle = 15, wall_threshold = 500):
        self.angle = angle
        self.wall_threshold = wall_threshold
        self.forward = 1
        self.start = None
        self.end = None
        self.returning = False
        pass

    def follow_path(self, start, end) -> bool:
        '''
        path: The straight line path
        max_run_time: max running time before timeout
        '''
        current_position = [telemetry.current_x, telemetry.current_y]
        if current_position == end:
            return True
        else:
            self.start = current_position
        self.start = start
        self.end = end
        y_difference = self.end[1] - self.start[1]
        x_difference = self.end[0] - self.start[0]
        angle = math.atan2(y_difference, x_difference)
        self.set_dir(angle, telemetry.imu) # definetly need to test this with the telemetry
        print(f"Heading to point {end}...")
        lidar = get_lidar()
        telemetry = get_telemetry()
        if self.angle >= 0.25: # Turning left
            if min(lidar[0], lidar[1], lidar[2], lidar[5], lidar[7]) <= self.wall_threshold:
                self.wall_following('left')
        elif self.angle <= -0.25: # Turning right
            if min(lidar[3], lidar[4], lidar[6], lidar[8], lidar[2]) <= self.wall_threshold:
                self.wall_following('right')
        else:
            if min(lidar[0], lidar[1], lidar[2], lidar[3], lidar[4]) <= self.wall_threshold:
                if self.returning == True:
                    self.wall_following('left')
                else:
                    self.wall_following('right')
        post_throttle(65)
        post_brakes(0)
        time.sleep(1)
        return self.follow_path(self.start, self.end)

    def wall_following(self, strategy):
        '''
        Follow the obstacle on a particular side until we realign with the path
        strategy: 'left' or 'right'
        next_node: the x and y coordinate we are trying to reach again
        angle: The adjustment for each turn in degrees
        '''
        side_sensor = 7 if strategy == 'left' else 8
        while True:
            telemetry = get_telemetry()
            lidar = get_lidar()
            self.start = [telemetry.current_x, telemetry.current_y]
            y_difference = self.end[1] - self.start[1]
            x_difference = self.end[0] - self.start[0]
            angle = math.atan2(y_difference, x_difference)
            self.set_dir(angle, telemetry.imu)
            
            if self.angle < 0.2 and self.angle > -0.2:
                if min(lidar[3], lidar[1], lidar[2]) > self.wall_threshold*2:
                    return
            elif self.angle < 0.2:
                if min(lidar[3], lidar[1], lidar[2], lidar[6], lidar[8]) > self.wall_threshold*2:
                    return
            else:
                if min(lidar[3], lidar[1], lidar[2], lidar[7], lidar[5]) > self.wall_threshold*2:
                    return
            
            if lidar[side_sensor] <= self.wall_threshold and min(lidar[2], lidar[1], lidar[3]) >= self.wall_threshold:
                post_steering(0)
                post_throttle(20)
                post_brakes(0)
            elif lidar[side_sensor] > self.wall_threshold:
                if strategy == 'left':
                    post_steering(0.5)
                else:
                    post_steering(-0.5)
                post_throttle(20)
                post_brakes(0)
            else:
                if strategy == 'left':
                    post_steering(-0.5)
                else:
                    post_steering(0.5)
                post_throttle(20)
                post_brakes(0)
            
            time.sleep(0.5)

    def set_dir(self, dir, angle):
        '''
        set the steering direction.
        '''
        #TODO: Need to test how steering value affects facing angle, send TSS direction
        dir -= angle
        if dir > 180 or dir < 0:
            self.forward = -1
            if dir < 0:
                dir += 180
            else:
                dir -= 180
        else:
            self.forward = 1
        
        self.angle = (dir - 90)/90
        post_steering(self.angle)
