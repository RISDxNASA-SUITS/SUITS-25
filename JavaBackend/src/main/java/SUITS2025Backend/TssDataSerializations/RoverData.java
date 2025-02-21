package SUITS2025Backend.TssDataSerializations;

import java.nio.ByteBuffer;

// TODO: Make a version for this class that can be used to SEND commands to the tss
public class RoverData implements TssData {
    
    private static final int RECEIVE_SIZE = 12;
    private static final int SEND_SIZE = 8;
    
    // TODO Change these fields to match the tss :)
    private final float x;        // 4 bytes
    private final float y;        // 4 bytes
    private final int status;     // 4 bytes

    public final Command command = Command.ROVER_TELEMETRY;

    public RoverData(float x, float y, int status) {
        this.x = x;
        this.y = y;
        this.status = status;
    }

    // TODO: Match actual tss values 
    public static RoverData fromByteBuffer(ByteBuffer buffer) {
        if (buffer.remaining() != RECEIVE_SIZE) {
            throw new IllegalArgumentException(
                "Invalid buffer size. Expected " + RECEIVE_SIZE + 
                " bytes, got " + buffer.remaining());
        }

        float x = buffer.getFloat();
        float y = buffer.getFloat();
        int status = buffer.getInt();

        return new RoverData(x, y, status);
    }

    // Serialize to ByteBuffer
    @Override
    public ByteBuffer toByteBuffer() {
        ByteBuffer buffer = ByteBuffer.allocate(SEND_SIZE);
        buffer.putFloat(x);
        buffer.putFloat(y);
        buffer.putInt(status);
        buffer.flip();  // Prepare buffer for reading
        return buffer;
    }

    // Getters
    public float getX() { return x; }
    public float getY() { return y; }
    public int getStatus() { return status; }

    @Override
    public String toString() {
        return String.format("RoverData(x=%.2f, y=%.2f, status=%d)", x, y, status);
    }
}
