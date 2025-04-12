package SUITS2025Backend.db
import SUITS2025Backend.TaskList.Priority
import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.SqlExpressionBuilder.like
import org.jetbrains.exposed.sql.transactions.transaction


object Tasks :  IntIdTable() {
    val title: Column<String> = varchar("title", 128).index()
    val priority: Column<Priority> = enumeration("priority", Priority::class)
    val duration: Column<Int> = integer("duration")
    val description: Column<String> = varchar("description", 400);
}


class Task (id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<Task>(Tasks)

    var title by Tasks.title
    var priority by Tasks.priority
    var duration by Tasks.duration
    var description by Tasks.description

    fun asResponse():TaskResponse{
        return TaskResponse(this.title, this.priority, this.duration, this.description)
    }
}


data class TaskResponse(var title: String, var priority: Priority, var duration: Int, var description: String)


class TaskDbController {
    init {
        Database.connect("jdbc:sqlite:sample.db", "org.sqlite.JDBC")
        // Create tables only once during initialization
        transaction {
            SchemaUtils.create(Tasks)
        }
    }

    fun addTask(task:TaskResponse) {
        transaction {
            Task.new {
                title = task.title
                priority = task.priority
                duration = task.duration
                description = task.description
            }
        }
    }

    fun getTasks(): List<TaskResponse> {
        return transaction {
            Task.all().map { it.asResponse() }
        }
    }

    fun deleteTask(title: String){
        transaction {
            Task.find { Tasks.title eq title }.forEach { it.delete() }
        }
    }
}





