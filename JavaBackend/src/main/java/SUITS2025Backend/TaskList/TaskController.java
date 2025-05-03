package SUITS2025Backend.TaskList;


import SUITS2025Backend.db.TaskDbController;
import SUITS2025Backend.db.TaskResponse;
import io.javalin.Javalin;
import io.javalin.http.Context;

import java.util.List;

public class TaskController {
    private static final TaskDbController taskDbController = new TaskDbController();
    public static void setup(Javalin app) {
        app.get("/task", TaskController::getTasks);
        app.post("/task", TaskController::addTask);
        app.delete("/task", TaskController::removeTask);

    }

    private static void getTasks(Context ctx){
        List<TaskResponse> resp = taskDbController.getTasks();
        System.out.println(resp);
        ctx.json(resp);
    }

    private static void addTask(Context ctx){
        TaskResponse task = ctx.bodyAsClass(TaskResponse.class);
        taskDbController.addTask(task);
        ctx.result("Successfully added task");
    }

    private static void removeTask(Context ctx){
        var title = ctx.pathParam("title");
        taskDbController.deleteTask(title);
        ctx.result("Successfully deleted task");
    }
}
