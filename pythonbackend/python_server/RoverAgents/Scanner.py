import time
from .helper_functions import euclidean_distance, get_lidar, get_telemetry, post_brakes, post_steering, post_throttle
import math

class Scanner:
    def __init__(self):
        self.phase = 0
        self.wall_threshold = 100
        self.lidar_x = {
            0: 170.0,
            1: 200.0,
            2: 200.0,
            3: 200.0,
            4: 170.0,
            5: 200.0,
            6: 200.0,
            7: 0.0,
            8: 0.0,
            9: -135.0,
            10: -180.0,
            11: -180.0,
            12: -135.0,
        }
        self.lidar_y = {
            0: -150.0,
            1: -40.0,
            2: 0.0,
            3: 40.0,
            4: 150.0,
            5: -40.0,
            6: 40.0,
            7: -100.0,
            8: 100.0,
            9: -160.0,
            10: -60.0,
            11: 60.0,
            12: 160.0,
        }
        self.lidar_angles = {
            0: -30.0,
            1: -20.0,
            2: 0.0,
            3: 20.0,
            4: 30.0,
            5: 0.0,
            6: 0.0,
            7: -90.0,
            8: 90.0,
            9: 140.0,
            10: 180.0,
            11: 180.0,
            12: -140.0,
        }

    def scan(self):
        ret_dict = get_lidar_telemetry()
        lidar = ret_dict['lidar']
        current_position = ret_dict['current_position']
        heading = ret_dict['heading']
        return_list = []
        self.get_surroundings(lidar, return_list, current_position, heading)
        counter = 0
        while min(lidar[3], lidar[4], lidar[6]) > self.wall_threshold and counter < 30: # forward right
            ret_dict = get_lidar_telemetry()
            lidar = ret_dict['lidar']
            current_position = ret_dict['current_position']
            heading = ret_dict['heading']
            # print(counter, 'counter')
            post_steering(1)
            post_throttle(30)
            time.sleep(0.4)
            post_throttle(0)
            time.sleep(0.1)
            return_list = self.get_surroundings(lidar, return_list, current_position, heading)
            counter += 1
        
        while counter > 0: # reset position
            post_throttle(-30)
            time.sleep(0.4)
            post_throttle(0)
            time.sleep(0.1)
            counter -= 1
        print(lidar, "lidar")
        while counter < 30 and min(lidar[10], lidar[11], lidar[12]) > self.wall_threshold: # backward right
            # print(counter, 'counterb')
            ret_dict = get_lidar_telemetry()
            lidar = ret_dict['lidar']
            current_position = ret_dict['current_position']
            heading = ret_dict['heading']
            post_steering(1)
            post_throttle(-30)
            time.sleep(0.4)
            post_throttle(0)
            time.sleep(0.1)
            return_list = self.get_surroundings(lidar, return_list, current_position, heading)
            counter += 1
        while counter > 0: # reset position
            post_throttle(30)
            time.sleep(0.4)
            post_throttle(0)
            time.sleep(0.1)
            counter -= 1
        while min(lidar[0], lidar[1], lidar[5]) > self.wall_threshold and counter < 30: # forward left
            # print(counter, 'counter2')
            ret_dict = get_lidar_telemetry()
            lidar = ret_dict['lidar']
            current_position = ret_dict['current_position']
            heading = ret_dict['heading']
            post_steering(-1)
            post_throttle(30)
            time.sleep(0.4)
            post_throttle(0)
            time.sleep(0.1)
            return_list = self.get_surroundings(lidar, return_list, current_position, heading)
            counter += 1
        while counter > 0: # reset position
            post_throttle(-30)
            time.sleep(0.4)
            post_throttle(0)
            time.sleep(0.1)
            counter -= 1
        while counter < 30 and min(lidar[10], lidar[11], lidar[12]) > self.wall_threshold: # backward left
            # print(counter, 'counter2b')
            ret_dict = get_lidar_telemetry()
            lidar = ret_dict['lidar']
            current_position = ret_dict['current_position']
            heading = ret_dict['heading']
            post_steering(-1)
            post_throttle(-30)
            time.sleep(0.4)
            post_throttle(0)
            time.sleep(0.1)
            return_list = self.get_surroundings(lidar, return_list, current_position, heading)
            counter += 1
        while counter > 0: # reset position
            post_throttle(30)
            time.sleep(0.4)
            post_throttle(0)
            time.sleep(0.1)
            counter -= 1
        return return_list   
            
    def get_surroundings(self, lidar, return_list, current_position, heading):
        for i in range(len(lidar)):
            if i == 5 or i == 6 or lidar[i] == 1500 or i == 7 or i == 8:
                continue
            x = self.lidar_x[i]*0.01 + current_position[0]
            y = self.lidar_y[i]*0.01 + current_position[1]
            angle = self.lidar_angles[i] + heading
            x += lidar[i]*0.01 * math.sin(angle)
            y += lidar[i]*0.01 * math.cos(angle)
            if [x, y] not in return_list:
                return_list.append([x, y])
                print(x, y, lidar[i], i)
        
        return return_list
    
def get_lidar_telemetry():
    get_lidar_resp = get_lidar()
    while get_lidar_resp is None:
        post_throttle(0)
        time.sleep(1)
        get_lidar_resp = get_lidar()
    lidar = get_lidar_resp['data']
    for i in range(len(lidar)):
        if lidar[i] == -1:
            lidar[i] = 1500
    telemetry = get_telemetry()
    while telemetry is None:
        post_throttle(0)
        time.sleep(1)
        telemetry = get_telemetry()
    current_position = [telemetry['currentPosX'], telemetry['currentPosY']]
    heading = telemetry['heading']
    return {'lidar': lidar, 'current_position': current_position, 'heading': heading}

# test = Scanner()
# print(test.scan())

