import time
import requests
import sys


#simulated positions
pairs = [(-10033.67, -5673.19),
(-10032.39, -5673.09),
(-10029.74, -5672.30),
(-10027.78, -5672.11),
(-10025.82, -5671.91),
(-10023.89, -5671.71),
(-10021.89, -5671.71),
(-10018.06, -5669.16),
(-10015.51, -5668.97),
(-10014.83, -5668.42),
(-10013.85, -5668.38),
(-10012.83, -5667.21),
(-10010.98, -5666.55),
(-10008.94, -5667.30),
(-10006.58, -5666.91),
(-10004.26, -5665.53),
(-10002.26, -5665.53),
(-10000.99, -5662.20),
(-10000.11, -5661.12),
(-9999.32, -5695.55),
(-9999.32, -5695.55),
 (-10000.11, -5661.12),
 (-10000.99, -5662.20),
 (-10002.26, -5665.53),
 (-10004.26, -5665.53),
 (-10006.58, -5666.91),
 (-10008.94, -5667.30),
 (-10010.98, -5666.55),
 (-10012.83, -5667.21),
 (-10013.85, -5668.38),
 (-10014.83, -5668.42),
 (-10015.51, -5668.97),
 (-10018.06, -5669.16),
 (-10021.89, -5671.71),
 (-10023.89, -5671.71),
 (-10025.82, -5671.91),
 (-10027.78, -5672.11),
 (-10029.74, -5672.30),
 (-10032.39, -5673.09),
 (-10033.67, -5673.19)]

server = "http://" + sys.argv[1] + ":14141"


def simulate_pos():
    
    i = 0
    while True:
        #
        print("Position: ", pairs[i])
        rover_data_x = {'rover_posx': pairs[i][1]} #X correspnds to longitude which is 2nd
        rover_data_y = {'rover_posy': pairs[i][0]} #Y corresponds to latitude which is 1st

        eva1_data_x = {'imu_eva1_posx': pairs[i][1]} #X correspnds to longitude which is 2nd
        eva1_data_y = {'imu_eva1_posy': pairs[i][0]} #Y corresponds to latitude which is 1st

        eva2_data_x = {'imu_eva2_posx': pairs[i][1]} #X correspnds to longitude which is 2nd
        eva2_data_y = {'imu_eva2_posy': pairs[i][0]} #Y corresponds to latitude which is 1st


        #send the rover data to TSS
        r = requests.post(url = server, data = rover_data_x, timeout = 3)
        r = requests.post(url = server, data = rover_data_y, timeout = 3)

        #send eva1 data to TSS
        r = requests.post(url = server, data = eva1_data_x, timeout = 3)
        r = requests.post(url = server, data = eva1_data_y, timeout = 3)
        
        #send eva2 data to TSS
        r = requests.post(url = server, data = eva2_data_x, timeout = 3)
        r = requests.post(url = server, data = eva2_data_y, timeout = 3)

        #go back to start once were at the end if not just increment
        i = 0 if i == len(pairs) - 1 else i + 1

        #wait a little bit :)
        time.sleep(1)


#run script
simulate_pos()
