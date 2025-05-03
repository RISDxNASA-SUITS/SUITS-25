from main import Pipeline, TSS_HOST, TSS_PORT

def main():
    pipeline = Pipeline(TSS_HOST, TSS_PORT)
    
    # Command definitions
    BRAKE_CMD = 1107      # 0.0 or 1.0
    THROTTLE_CMD = 1109   # -100.0 to 100.0
    STEERING_CMD = 1110   # -1.0 to 1.0
    
    # Information commands
    LIDAR_CMD = 171
    ROVER_X_CMD = 133
    ROVER_Y_CMD = 134
    ROVER_ALT_CMD = 135
    ROVER_HEADING_CMD = 136
    ROVER_PITCH_CMD = 137
    ROVER_ROLL_CMD = 138
    ROVER_SPEED_CMD = 140
    
    print("=== Rover Control Interface ===")
    print("Commands:")
    print("  b: Apply brakes (0 = off, 1 = on)")
    print("  t: Set throttle (-100 to 100)")
    print("  s: Set steering (-1.0 to 1.0)")
    print("  i: Get rover information")
    print("  l: Get lidar data")
    print("  e: Exit")
    print("==============================")
    
    try:
        while True:
            command = input("\nEnter command (b/t/s/i/l/e): ").strip().lower()
            
            if command == 'e':
                print("Exiting...")
                break
                
            elif command == 'b':
                brake_val = float(input("Enter brake value (0 = off, 1 = on): "))
                if brake_val != 0 and brake_val != 1:
                    print("Error: Brake value must be 0 or 1")
                    continue
                pipeline.send_instructions(BRAKE_CMD, brake_val)
                print(f"Brakes {'applied' if brake_val == 1 else 'released'}")
                
            elif command == 't':
                throttle_val = float(input("Enter throttle value (-100 to 100): "))
                if throttle_val < -100 or throttle_val > 100:
                    print("Error: Throttle value must be between -100 and 100")
                    continue
                pipeline.send_instructions(THROTTLE_CMD, throttle_val)
                print(f"Throttle set to {throttle_val}")
                
            elif command == 's':
                steer_val = float(input("Enter steering value (-1.0 to 1.0): "))
                if steer_val < -1.0 or steer_val > 1.0:
                    print("Error: Steering value must be between -1.0 and 1.0")
                    continue
                pipeline.send_instructions(STEERING_CMD, steer_val)
                print(f"Steering set to {steer_val}")
                
            elif command == 'i':
                print("\n=== Rover Information ===")
                
                # Position
                x_data = pipeline.send_receive(ROVER_X_CMD)
                y_data = pipeline.send_receive(ROVER_Y_CMD)
                alt_data = pipeline.send_receive(ROVER_ALT_CMD)
                
                if x_data and y_data and alt_data:
                    print(f"Position: X={x_data[2]:.2f}, Y={y_data[2]:.2f}, Altitude={alt_data[2]:.2f}")
                
                # Orientation
                heading_data = pipeline.send_receive(ROVER_HEADING_CMD)
                pitch_data = pipeline.send_receive(ROVER_PITCH_CMD)
                roll_data = pipeline.send_receive(ROVER_ROLL_CMD)
                
                if heading_data and pitch_data and roll_data:
                    print(f"Orientation: Heading={heading_data[2]:.2f}°, Pitch={pitch_data[2]:.2f}°, Roll={roll_data[2]:.2f}°")
                
                # Speed
                speed_data = pipeline.send_receive(ROVER_SPEED_CMD)
                
                if speed_data:
                    print(f"Speed: {speed_data[2]:.2f} units/s")
                
                print("=========================")
                
            elif command == 'l':
                print("\n=== Lidar Data ===")
                lidar_data = pipeline.send_receive(LIDAR_CMD)
                
                if lidar_data:
                    print(f"Timestamp: {lidar_data[0]}")
                    print(f"Command: {lidar_data[1]}")
                    print(f"Lidar Data (13 points):")
                    
                    # Display all 13 lidar data points
                    for i in range(13):
                        print(f"  Point {i}: {lidar_data[i]:.4f}")
                
                print("=================")
                
            else:
                print("Unknown command. Please try again.")
    
    except KeyboardInterrupt:
        print("\nProgram interrupted by user")
    except Exception as e:
        print(f"\nError: {e}")
    finally:
        pipeline.close()

if __name__ == "__main__":
    main()