package SUITS2025Backend.TssDataSerializations;

import java.nio.ByteBuffer;

public interface TssData {
    /**
     * Converts the data object to a ByteBuffer for transmission
     * this shold handle sending in the tss, it should be 8 bytes
     * @return ByteBuffer containing the serialized data
     */
    ByteBuffer toByteBuffer();

    /**
     * Creates a data object from a ByteBuffer
     * This should handle RECEIVING data from the tss it should be 12 bytes
     * @param buffer ByteBuffer containing the serialized data
     * @return The deserialized data object
     * @throws IllegalArgumentException if the buffer size is incorrect
     */
    static TssData fromByteBuffer(ByteBuffer buffer) {
        throw new UnsupportedOperationException("This method must be implemented by concrete classes");
    }
} 