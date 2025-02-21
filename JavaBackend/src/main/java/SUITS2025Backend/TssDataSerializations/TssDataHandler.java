package SUITS2025Backend.TssDataSerializations;

import java.nio.ByteBuffer;

public class TssDataHandler {
    private static final int COMMAND_BYTES = 4; // First 4 bytes are command ID

    public static TssData handle(ByteBuffer buffer) {
        if (buffer.remaining() < COMMAND_BYTES) {
            throw new IllegalArgumentException("Buffer too small for command header");
        }

        int commandId = buffer.getInt();
        Command command = Command.fromId(commandId);

        
        ByteBuffer dataBuffer = buffer.slice();
         //TODO: Implement more command handling, start with lidar
        return switch (command) {
            case Command.ROVER_TELEMETRY -> RoverData.fromByteBuffer(dataBuffer);
            case Command.ROVER_LIDAR -> 
                throw new UnsupportedOperationException("Rover command handling not implemented");
            default -> 
                throw new IllegalArgumentException("Unhandled command type: " + command);
        };
    }
}
