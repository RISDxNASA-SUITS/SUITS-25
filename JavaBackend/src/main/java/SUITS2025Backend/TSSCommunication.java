package SUITS2025Backend;

import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.util.Date;

public class TSSCommunication {
    private String address = "127.0.0.1";
    private int port = 14141;
    
    public int[] sendCommands(int startCommand, int endCommand) {        
        int[] data = new int[endCommand - startCommand];
        
        try {
            DatagramSocket socket = new DatagramSocket();
            InetAddress serverAddress = InetAddress.getByName(address);
            int serverPort = port;

            for (int i = startCommand; i < endCommand + 1; i++) {
                long timestamp = new Date().getTime() / 1000; // Current timestamp in seconds

                ByteBuffer buffer = ByteBuffer.allocate(8);
                buffer.order(ByteOrder.BIG_ENDIAN);
                buffer.putInt((int) timestamp);
                buffer.putInt(i);

                byte[] message = buffer.array();
                DatagramPacket packet = new DatagramPacket(message, message.length, serverAddress, serverPort);
                socket.send(packet);
            
                byte[] receiveData = new byte[12];
                DatagramPacket receivePacket = new DatagramPacket(receiveData, receiveData.length);
                socket.receive(receivePacket);
                ByteBuffer receivedBuffer = ByteBuffer.wrap(receivePacket.getData());
                receivedBuffer.order(ByteOrder.BIG_ENDIAN);

                // Extract components
                long _ = receivedBuffer.getInt() & 0xFFFFFFFFL; // Convert to unsigned
                int _ = receivedBuffer.getInt();
                int outputData = receivedBuffer.getInt();
                
                data[i - startCommand] = outputData;
            }
            
            socket.close();

            return data;
        } catch (Exception e) {
            e.printStackTrace();
            return new int[0];
        }
    }

    public int[] getEVA1DCUSwitchStates() {
        return sendCommands(2, 7);
    }

    public int[] getEVA2DCUSwitchStates() {
        return sendCommands(8, 13);
    }

    public int[] getERRORStates() {
        return sendCommands(14, 16);
    }

    public int[] getEVA1IMUStates() {
        return sendCommands(17, 19);
    }

    public int[] getEVA2IMUStates() {
        return sendCommands(20, 22);
    }

    public int[] getROVERStates() {
        return sendCommands(23, 25);
    }

    public int[] getEVA1SPECStates() {
        return sendCommands(26, 36);
    }

    public int[] getEVA2SPECStates() {
        return sendCommands(37, 47);
    }

    public int[] getUIAStates() {
        return sendCommands(48, 57);
    }

    public int[] getCurrentEVATime() {
        return sendCommands(58, 58);
    }

    public int[] getEVA1TELEMETRYStates() {
        return sendCommands(59, 80);
    }

    public int[] getEVA2TELEMETRYStates() {
        return sendCommands(81, 102);
    }

    public int[] getEVAStates() {
        return sendCommands(103, 118);
    }

    public int[] getPressurizedRoverStates() {
        return sendCommands(119, 166);
    }
}
