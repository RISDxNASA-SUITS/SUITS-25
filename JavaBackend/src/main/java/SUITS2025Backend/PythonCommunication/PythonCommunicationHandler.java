package SUITS2025Backend.PythonCommunication;

import io.javalin.Javalin;
import io.javalin.http.Context;

import java.util.List;

public class PythonCommunicationHandler {
    public static void setup(Javalin app){
        app.get("/lidar", PythonCommunicationHandler::getLidar);
    }

    private static void getLidar(Context ctx) {
        return ;
    }
}
