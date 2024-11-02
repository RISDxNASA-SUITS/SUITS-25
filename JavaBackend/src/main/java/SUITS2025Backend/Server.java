package SUITS2025Backend;

import io.javalin.Javalin;

public class Server {
    public static void main(String[] args) {
        Javalin app = Javalin.create(/*config*/)
                .get("/", ctx -> ctx.result("Hello World"))
                .start(7070);
    }
}