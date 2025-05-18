from helper_functions import get_lidar, get_telemetry, post_steering, post_brakes, post_throttle

def print_data():
    try:
        lidar = get_lidar()
        telemetry = get_telemetry()
        print("LIDAR:", lidar)
        print("Telemetry:", telemetry)
    except Exception as e:
        print("Error getting data:", e)

def main():
    print("Enter commands: t <float>, b <float>, s <float>, i (inspect), e (exit)")
    while True:
        try:
            line = input(">>> ").strip()
            if not line:
                continue

            parts = line.split()

            cmd = parts[0].lower()

            if cmd == 'e':
                print("Exiting.")
                break

            elif cmd == 'i':
                print_data()

            elif cmd in {'t', 'b', 's'}:
                if len(parts) != 2:
                    print("Expected format: <cmd> <float>")
                    continue
                try:
                    value = float(parts[1])
                except ValueError:
                    print("Invalid number format.")
                    continue

                if cmd == 't':
                    res = post_throttle(value)
                elif cmd == 'b':
                    res = post_brakes(value)
                elif cmd == 's':
                    res = post_steering(value)

                print(f"{cmd.upper()} command sent. Status: {res.status_code}")
                print_data()

            else:
                print("Unknown command.")

        except KeyboardInterrupt:
            print("\nExiting.")
            break
        except Exception as ex:
            print("Error:", ex)

if __name__ == "__main__":
    main()
