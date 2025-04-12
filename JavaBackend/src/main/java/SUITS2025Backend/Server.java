package SUITS2025Backend;

import java.net.DatagramPacket;
import java.net.DatagramSocket;
import java.net.InetAddress;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.util.Date;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.module.kotlin.KotlinModule;

import SUITS2025Backend.PoiList.PoiController;
import SUITS2025Backend.TaskList.TaskController;
import SUITS2025Backend.PythonCommunication.PythonCommunicationHandler;
import io.javalin.Javalin;

public class Server {
    public static void main(String[] args) {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new KotlinModule.Builder()
            .build());
        
        Javalin app = Javalin.create(config -> {
            config.jsonMapper(new io.javalin.json.JavalinJackson(mapper, false));
            // Configure CORS if needed
            // config.enableCorsForAllOrigins();
        })
        .get("/command/{num}", ctx -> {
            int num = Integer.parseInt(ctx.pathParam("num"));
            String result = String.valueOf(sendUdpMessage(num));
            ctx.result(result);
        })

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
        TaskController.setup(app);
        PoiController.setup(app);
        PythonCommunicationHandler.setup(app);
    }
}