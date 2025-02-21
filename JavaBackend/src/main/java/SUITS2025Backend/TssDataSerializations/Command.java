package SUITS2025Backend.TssDataSerializations;

public enum Command {
    ROVER_LIDAR(1),    // Example: Rover sending status update
    ROVER_TELEMETRY(2),   // Example: Command being sent to rover
    // TODO: Add more commands, we will eventually need all commands
    ;

    private final int id;

    Command(int id) {
        this.id = id;
    }

    public int getId() {
        return id;
    }

    public static Command fromId(int id) {
        for (Command cmd : values()) {
            if (cmd.getId() == id) return cmd;
        }
        throw new IllegalArgumentException("Unknown command id: " + id);
    }
}