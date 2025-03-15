package SUITS2025Backend;

import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.util.Date;

import SUITS2025Backend.TssDataSerializations.TssDataHandler;
import io.javalin.Javalin;
import io.javalin.websocket.WsConfig;

public class Server {
    public static void main(String[] args) {
        TssDataHandler handler = new TssDataHandler();
        
        Javalin app = Javalin.create(config -> {
            // Configure CORS if needed
            // config.enableCorsForAllOrigins();
        })
        .get("/", ctx -> sendCommand2())
        .ws("/websocket", ws -> {
            ws.onConnect(ctx -> {
                System.out.println("Connected: " + ctx.sessionId());
                // sendUdpMessage();
                // TODO: Handle new connection
                // - Store session
                // - Initialize client state
                // - Send initial data if needed
            });

            ws.onMessage(ctx -> {
                System.out.println("Received message from: " + ctx.sessionId());
                String message = ctx.message();
                System.out.println(message);
                // TODO: Handle incoming message
                // - Parse message
                // - Update state
                // - Broadcast to other clients if needed
                // ByteBuffer byteBuffer = ByteBuffer.wrap(message.getBytes());
                // this function should do the bulk of message handling.
                // handler.handle(byteBuffer);
            });

            ws.onClose(ctx -> {
                System.out.println("Closed: " + ctx.sessionId());
                // TODO: Handle connection close
                // - Clean up session
                // - Update other clients if needed
            });

            ws.onError(ctx -> {
                System.out.println("Error: " + ctx.sessionId());
                // TODO: Handle error
                // - Log error
                // - Clean up if needed
                // - Notify client
            });
        })
        .start(7070);
    }

    public static void sendCommand2() {
        sendUdpMessage(2);
    }
    
    public static void sendCommand3() {
        sendUdpMessage(3);
    }
    
    public static void sendCommand4() {
        sendUdpMessage(4);
    }
    
    public static void sendCommand5() {
        sendUdpMessage(5);
    }
    
    public static void sendCommand6() {
        sendUdpMessage(6);
    }
    
    public static void sendCommand7() {
        sendUdpMessage(7);
    }
    
    public static void sendCommand8() {
        sendUdpMessage(8);
    }
    
    public static void sendCommand9() {
        sendUdpMessage(9);
    }
    
    public static void sendCommand10() {
        sendUdpMessage(10);
    }
    
    public static void sendCommand11() {
        sendUdpMessage(11);
    }
    
    public static void sendCommand12() {
        sendUdpMessage(12);
    }
    
    public static void sendCommand13() {
        sendUdpMessage(13);
    }
    
    public static void sendCommand14() {
        sendUdpMessage(14);
    }
    
    public static void sendCommand15() {
        sendUdpMessage(15);
    }
    
    public static void sendCommand16() {
        sendUdpMessage(16);
    }
    
    public static void sendCommand17() {
        sendUdpMessage(17);
    }
    
    public static void sendCommand18() {
        sendUdpMessage(18);
    }
    
    public static void sendCommand19() {
        sendUdpMessage(19);
    }
    
    public static void sendCommand20() {
        sendUdpMessage(20);
    }
    
    public static void sendCommand21() {
        sendUdpMessage(21);
    }
    
    public static void sendCommand22() {
        sendUdpMessage(22);
    }
    
    public static void sendCommand23() {
        sendUdpMessage(23);
    }
    
    public static void sendCommand24() {
        sendUdpMessage(24);
    }
    
    public static void sendCommand25() {
        sendUdpMessage(25);
    }
    
    public static void sendCommand26() {
        sendUdpMessage(26);
    }
    
    public static void sendCommand27() {
        sendUdpMessage(27);
    }
    
    public static void sendCommand28() {
        sendUdpMessage(28);
    }
    
    public static void sendCommand29() {
        sendUdpMessage(29);
    }
    
    public static void sendCommand30() {
        sendUdpMessage(30);
    }
    
    public static void sendCommand31() {
        sendUdpMessage(31);
    }
    
    public static void sendCommand32() {
        sendUdpMessage(32);
    }
    
    public static void sendCommand33() {
        sendUdpMessage(33);
    }
    
    public static void sendCommand34() {
        sendUdpMessage(34);
    }
    
    public static void sendCommand35() {
        sendUdpMessage(35);
    }
    
    public static void sendCommand36() {
        sendUdpMessage(36);
    }
    
    public static void sendCommand37() {
        sendUdpMessage(37);
    }
    
    public static void sendCommand38() {
        sendUdpMessage(38);
    }
    
    public static void sendCommand39() {
        sendUdpMessage(39);
    }
    
    public static void sendCommand40() {
        sendUdpMessage(40);
    }
    
    public static void sendCommand41() {
        sendUdpMessage(41);
    }
    
    public static void sendCommand42() {
        sendUdpMessage(42);
    }
    
    public static void sendCommand43() {
        sendUdpMessage(43);
    }
    
    public static void sendCommand44() {
        sendUdpMessage(44);
    }
    
    public static void sendCommand45() {
        sendUdpMessage(45);
    }
    
    public static void sendCommand46() {
        sendUdpMessage(46);
    }
    
    public static void sendCommand47() {
        sendUdpMessage(47);
    }
    
    public static void sendCommand48() {
        sendUdpMessage(48);
    }
    
    public static void sendCommand49() {
        sendUdpMessage(49);
    }
    
    public static void sendCommand50() {
        sendUdpMessage(50);
    }
    
    public static void sendCommand51() {
        sendUdpMessage(51);
    }
    
    public static void sendCommand52() {
        sendUdpMessage(52);
    }
    
    public static void sendCommand53() {
        sendUdpMessage(53);
    }
    
    public static void sendCommand54() {
        sendUdpMessage(54);
    }
    
    public static void sendCommand55() {
        sendUdpMessage(55);
    }
    
    public static void sendCommand56() {
        sendUdpMessage(56);
    }
    
    public static void sendCommand57() {
        sendUdpMessage(57);
    }
    
    public static void sendCommand58() {
        sendUdpMessage(58);
    }
    
    public static void sendCommand59() {
        sendUdpMessage(59);
    }
    
    public static void sendCommand60() {
        sendUdpMessage(60);
    }
    
    public static void sendCommand61() {
        sendUdpMessage(61);
    }
    
    public static void sendCommand62() {
        sendUdpMessage(62);
    }
    
    public static void sendCommand63() {
        sendUdpMessage(63);
    }
    
    public static void sendCommand64() {
        sendUdpMessage(64);
    }
    
    public static void sendCommand65() {
        sendUdpMessage(65);
    }
    
    public static void sendCommand66() {
        sendUdpMessage(66);
    }
    
    public static void sendCommand67() {
        sendUdpMessage(67);
    }
    
    public static void sendCommand68() {
        sendUdpMessage(68);
    }
    
    public static void sendCommand69() {
        sendUdpMessage(69);
    }
    
    public static void sendCommand70() {
        sendUdpMessage(70);
    }
    
    public static void sendCommand71() {
        sendUdpMessage(71);
    }
    
    public static void sendCommand72() {
        sendUdpMessage(72);
    }
    
    public static void sendCommand73() {
        sendUdpMessage(73);
    }
    
    public static void sendCommand74() {
        sendUdpMessage(74);
    }
    
    public static void sendCommand75() {
        sendUdpMessage(75);
    }
    
    public static void sendCommand76() {
        sendUdpMessage(76);
    }
    
    public static void sendCommand77() {
        sendUdpMessage(77);
    }
    
    public static void sendCommand78() {
        sendUdpMessage(78);
    }
    
    public static void sendCommand79() {
        sendUdpMessage(79);
    }
    
    public static void sendCommand80() {
        sendUdpMessage(80);
    }
    
    public static void sendCommand81() {
        sendUdpMessage(81);
    }
    
    public static void sendCommand82() {
        sendUdpMessage(82);
    }
    
    public static void sendCommand83() {
        sendUdpMessage(83);
    }
    
    public static void sendCommand84() {
        sendUdpMessage(84);
    }
    
    public static void sendCommand85() {
        sendUdpMessage(85);
    }
    
    public static void sendCommand86() {
        sendUdpMessage(86);
    }
    
    public static void sendCommand87() {
        sendUdpMessage(87);
    }
    
    public static void sendCommand88() {
        sendUdpMessage(88);
    }
    
    public static void sendCommand89() {
        sendUdpMessage(89);
    }
    
    public static void sendCommand90() {
        sendUdpMessage(90);
    }
    
    public static void sendCommand91() {
        sendUdpMessage(91);
    }
    
    public static void sendCommand92() {
        sendUdpMessage(92);
    }
    
    public static void sendCommand93() {
        sendUdpMessage(93);
    }
    
    public static void sendCommand94() {
        sendUdpMessage(94);
    }
    
    public static void sendCommand95() {
        sendUdpMessage(95);
    }
    
    public static void sendCommand96() {
        sendUdpMessage(96);
    }
    
    public static void sendCommand97() {
        sendUdpMessage(97);
    }
    
    public static void sendCommand98() {
        sendUdpMessage(98);
    }
    
    public static void sendCommand99() {
        sendUdpMessage(99);
    }
    
    public static void sendCommand100() {
        sendUdpMessage(100);
    }
    
    public static void sendCommand101() {
        sendUdpMessage(101);
    }
    
    public static void sendCommand102() {
        sendUdpMessage(102);
    }
    
    public static void sendCommand103() {
        sendUdpMessage(103);
    }
    
    public static void sendCommand104() {
        sendUdpMessage(104);
    }
    
    public static void sendCommand105() {
        sendUdpMessage(105);
    }
    
    public static void sendCommand106() {
        sendUdpMessage(106);
    }
    
    public static void sendCommand107() {
        sendUdpMessage(107);
    }
    
    public static void sendCommand108() {
        sendUdpMessage(108);
    }
    
    public static void sendCommand109() {
        sendUdpMessage(109);
    }
    
    public static void sendCommand110() {
        sendUdpMessage(110);
    }
    
    public static void sendCommand111() {
        sendUdpMessage(111);
    }
    
    public static void sendCommand112() {
        sendUdpMessage(112);
    }
    
    public static void sendCommand113() {
        sendUdpMessage(113);
    }
    
    public static void sendCommand114() {
        sendUdpMessage(114);
    }
    
    public static void sendCommand115() {
        sendUdpMessage(115);
    }
    
    public static void sendCommand116() {
        sendUdpMessage(116);
    }
    
    public static void sendCommand117() {
        sendUdpMessage(117);
    }
    
    public static void sendCommand118() {
        sendUdpMessage(118);
    }
    
    public static void sendCommand119() {
        sendUdpMessage(119);
    }
    
    public static void sendCommand120() {
        sendUdpMessage(120);
    }
    
    public static void sendCommand121() {
        sendUdpMessage(121);
    }
    
    public static void sendCommand122() {
        sendUdpMessage(122);
    }
    
    public static void sendCommand123() {
        sendUdpMessage(123);
    }
    
    public static void sendCommand124() {
        sendUdpMessage(124);
    }
    
    public static void sendCommand125() {
        sendUdpMessage(125);
    }
    
    public static void sendCommand126() {
        sendUdpMessage(126);
    }
    
    public static void sendCommand127() {
        sendUdpMessage(127);
    }
    
    public static void sendCommand128() {
        sendUdpMessage(128);
    }
    
    public static void sendCommand129() {
        sendUdpMessage(129);
    }
    
    public static void sendCommand130() {
        sendUdpMessage(130);
    }
    
    public static void sendCommand131() {
        sendUdpMessage(131);
    }
    
    public static void sendCommand132() {
        sendUdpMessage(132);
    }
    
    public static void sendCommand133() {
        sendUdpMessage(133);
    }
    
    public static void sendCommand134() {
        sendUdpMessage(134);
    }
    
    public static void sendCommand135() {
        sendUdpMessage(135);
    }
    
    public static void sendCommand136() {
        sendUdpMessage(136);
    }
    
    public static void sendCommand137() {
        sendUdpMessage(137);
    }
    
    public static void sendCommand138() {
        sendUdpMessage(138);
    }
    
    public static void sendCommand139() {
        sendUdpMessage(139);
    }
    
    public static void sendCommand140() {
        sendUdpMessage(140);
    }
    
    public static void sendCommand141() {
        sendUdpMessage(141);
    }
    
    public static void sendCommand142() {
        sendUdpMessage(142);
    }
    
    public static void sendCommand143() {
        sendUdpMessage(143);
    }
    
    public static void sendCommand144() {
        sendUdpMessage(144);
    }
    
    public static void sendCommand145() {
        sendUdpMessage(145);
    }
    
    public static void sendCommand146() {
        sendUdpMessage(146);
    }
    
    public static void sendCommand147() {
        sendUdpMessage(147);
    }
    
    public static void sendCommand148() {
        sendUdpMessage(148);
    }
    
    public static void sendCommand149() {
        sendUdpMessage(149);
    }
    
    public static void sendCommand150() {
        sendUdpMessage(150);
    }
    
    public static void sendCommand151() {
        sendUdpMessage(151);
    }
    
    public static void sendCommand152() {
        sendUdpMessage(152);
    }
    
    public static void sendCommand153() {
        sendUdpMessage(153);
    }
    
    public static void sendCommand154() {
        sendUdpMessage(154);
    }
    
    public static void sendCommand155() {
        sendUdpMessage(155);
    }
    
    public static void sendCommand156() {
        sendUdpMessage(156);
    }
    
    public static void sendCommand157() {
        sendUdpMessage(157);
    }
    
    public static void sendCommand158() {
        sendUdpMessage(158);
    }
    
    public static void sendCommand159() {
        sendUdpMessage(159);
    }
    
    public static void sendCommand160() {
        sendUdpMessage(160);
    }
    
    public static void sendCommand161() {
        sendUdpMessage(161);
    }
    
    public static void sendCommand162() {
        sendUdpMessage(162);
    }
    
    public static void sendCommand163() {
        sendUdpMessage(163);
    }
    
    public static void sendCommand164() {
        sendUdpMessage(164);
    }
    
    public static void sendCommand165() {
        sendUdpMessage(165);
    }
    
    public static void sendCommand166() {
        sendUdpMessage(166);
    }
    
    private static void sendUdpMessage(int commandNumber) {
        try {
            DatagramSocket socket = new DatagramSocket();
            InetAddress serverAddress = InetAddress.getByName("10.1.77.147");
            int serverPort = 14141;

            long timestamp = new Date().getTime() / 1000; // Current timestamp in seconds

            ByteBuffer buffer = ByteBuffer.allocate(8);
            buffer.order(ByteOrder.BIG_ENDIAN);
            buffer.putInt((int) timestamp);
            buffer.putInt(commandNumber);

            byte[] message = buffer.array();
            DatagramPacket packet = new DatagramPacket(message, message.length, serverAddress, serverPort);
            socket.send(packet);
            System.out.println("Sent command: " + commandNumber);
            
            byte[] receiveData = new byte[12]; 
            DatagramPacket receivePacket = new DatagramPacket(receiveData, receiveData.length);
            socket.receive(receivePacket);
            
            ByteBuffer receivedBuffer = ByteBuffer.wrap(receivePacket.getData());
            receivedBuffer.order(ByteOrder.BIG_ENDIAN);

            // Extract components
            long receivedTimestamp = receivedBuffer.getInt() & 0xFFFFFFFFL; // Convert to unsigned
            int receivedCommand = receivedBuffer.getInt();
            int outputData = receivedBuffer.getInt();

            // Print the received components
            System.out.println("Received data: " + outputData);

            socket.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}