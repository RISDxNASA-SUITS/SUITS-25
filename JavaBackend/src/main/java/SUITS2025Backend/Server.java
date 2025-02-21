package SUITS2025Backend;

import io.javalin.Javalin;
import io.javalin.websocket.WsConfig;

public class Server {
    public static void main(String[] args) {
        Javalin app = Javalin.create(config -> {
            // Configure CORS if needed
            // config.enableCorsForAllOrigins();
        })
        .get("/", ctx -> ctx.result("Hello World"))
        .ws("/websocket", ws -> {
            ws.onConnect(ctx -> {
                System.out.println("Connected: " + ctx.getSessionId());
                // TODO: Handle new connection
                // - Store session
                // - Initialize client state
                // - Send initial data if needed
            });

            ws.onMessage(ctx -> {
                System.out.println("Received message from: " + ctx.getSessionId());
                String message = ctx.message();
                // TODO: Handle incoming message
                // - Parse message
                // - Update state
                // - Broadcast to other clients if needed

                // this function should do the bulk of message handling.
                TssDataHandler.handle(message);
            });

            ws.onClose(ctx -> {
                System.out.println("Closed: " + ctx.getSessionId());
                // TODO: Handle connection close
                // - Clean up session
                // - Update other clients if needed
            });

            ws.onError(ctx -> {
                System.out.println("Error: " + ctx.getSessionId());
                // TODO: Handle error
                // - Log error
                // - Clean up if needed
                // - Notify client
            });
        })
        .start(7070);
    }
}