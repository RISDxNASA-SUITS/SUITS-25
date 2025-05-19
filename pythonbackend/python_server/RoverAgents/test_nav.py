from Navigator import Navigator
# from rover_navigation import rover_control_loop
test_Nav = Navigator(15, 300)
test_Nav.end = [-5868.10, -10016.10]
A = [-5855.60, -10168.60]
B = [-5868.10, -10016.10]
C = [-5745.90, -9977.30]
test_Nav.follow_path(A)
print("A finished")
test_Nav.follow_path(B)
print("B finished")
test_Nav.follow_path(C)
print("C finished")
test_Nav.follow_path([-5664.0, -10080.10])
# rover_control_loop((-5664.0, -10200.10))
print("Finished")
