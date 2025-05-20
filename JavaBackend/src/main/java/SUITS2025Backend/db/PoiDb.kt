package SUITS2025Backend.db

import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction   
import io.javalin.http.Context
import java.io.File
import io.javalin.http.UploadedFile



object Pois : IntIdTable() {
    val name: Column<String> = varchar("name", 128).index()
    val x: Column<Double> = double("x")
    val y: Column<Double> = double("y")
    val tags: Column<String> = varchar("tags", 400)  // Storing tags as comma-separated string
    val description: Column<String> = varchar("description", 400)
    val type: Column<String> = varchar("type", 128)
    val audio =  reference("audio_id", Audios).nullable()
    val radius = double("radius").nullable()
}

object Audios : IntIdTable(){
    val filename: Column<String> = varchar("filename", 128)
}

class Audio(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<Audio>(Audios)

    var filename by Audios.filename
    
    fun asResponse(): AudioResponse{
        return AudioResponse(
            filename=this.filename,
            id=this.id.value
        )
    }
}
data class AudioResponse(
    val filename: String,
    val id:Int,
)

data class PoiResponseJson(val data:List<PoiResponse>)

class Poi(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<Poi>(Pois)

    var name by Pois.name
    var x by Pois.x
    var y  by Pois.y
    var tags by Pois.tags
    var description by Pois.description
    var type by Pois.type
    var audio by Audio.optionalReferencedOn(Pois.audio)
    var radius by Pois.radius

    fun asResponse(): PoiResponse {
        return PoiResponse(
            this.id.value,
            this.name,
            this.x,
            this.y,
            this.tags.split(",").filter { it.isNotEmpty() },
            this.description,
            this.type,
            null,
            this.radius
        )
    }
}

data class PoiResponse(
    var id: Int?,
    var name: String,
    var x: Double,
    var y: Double,
    var tags: List<String>,
    var description: String,
    var type: String,
    var audioId: Int?,
    var radius :Double?
)

class PoiDbController {
    init {
        Database.connect("jdbc:sqlite:sample.db", "org.sqlite.JDBC")
        // Create tables only once during initialization
        transaction {
            SchemaUtils.create(Pois, Audios)
        }
    }
    
    data class AddVoiceNoteRequest(
        val poiId: Int,
        val voiceNote: Int
    )
    fun addVoiceNote(ctx: Context){
        val req = ctx.bodyAsClass(AddVoiceNoteRequest::class.java)
        transaction {
            Poi.findById(req.poiId) ?.let {
                it.audio = Audio.findById(req.voiceNote)  
            }
        }
        ctx.result("Voice note added")
    }

    fun addPoi(poi: PoiResponse): PoiResponse{
        return transaction {
            Poi.new {
                name = poi.name
                x = poi.x
                y = poi.y
                tags = poi.tags.joinToString(",")
                description = poi.description
                type = poi.type
                audio = poi.audioId?.let { id ->
                    transaction { Audio.findById(id) }
                }
                radius = poi.radius
            }

        }.asResponse()
    }
    
    fun getPois(): PoiResponseJson{
        val list = transaction {
            Poi.all().map { it.asResponse() }
        }
        return PoiResponseJson(list)
    }

    fun deletePoi(name: String) {
        transaction {
            Poi.find { Pois.name eq name }.forEach { it.delete() }
        }
    }


    fun getPoisByTag(tag: String): List<PoiResponse> {
        return transaction {
            Poi.find { Pois.tags like "%$tag%" }.map { it.asResponse() }
        }
    }

    fun getPoisInArea(minLat: Double, maxLat: Double, minLon: Double, maxLon: Double): List<PoiResponse> {
        return transaction {
            Poi.find {
                (Pois.x greaterEq minLat) and
                (Pois.x lessEq maxLat) and
                (Pois.y greaterEq minLon) and
                (Pois.x lessEq maxLon)
            }.map { it.asResponse() }
        }
    }
  

    fun submitAudio(ctx: Context): Context{
        val file: UploadedFile = ctx.uploadedFile("audio")
        ?: return ctx.status(400).result("No audio file uploaded")
        val uploadDir = File("uploads").apply { mkdirs() }

        if (file.contentType()?.startsWith("audio/") != true) {
            return ctx.status(415).result("Only audio files are accepted.")
            
        }
        val targetFile = File(uploadDir, file.filename())
        file.content().copyTo(targetFile.outputStream())
        val audio = transaction {
            Audio.new {
                filename = file.filename()
            }
            
        }
        return ctx.json(audio.asResponse())

        
    }


    fun getAudio(ctx: Context): Context{
        ctx.result("gg")
        val id = ctx.pathParam("id").toInt()
        val audio = transaction { Audio.findById(id) }
            ?: return ctx.status(404).result("Audio not found")
    
        val file = File("uploads/${audio.filename}")
        if (!file.exists()) {
            return ctx.status(404).result("File not found on disk")
        }
    
        // Guess MIME type (you can hardcode if needed)
        val mimeType = when (file.extension.lowercase()) {
            "mp3" -> "audio/mpeg"
            "wav" -> "audio/wav"
            "ogg" -> "audio/ogg"
            else -> "application/octet-stream"
        }
    
        ctx.contentType(mimeType)
        return ctx.result(file.inputStream())
    }


    fun deletePois(ctx: Context): Context{
     
        transaction {
            Pois.deleteAll()
            Audios.deleteAll()
        }
        return ctx.result("Successfully deleted POI")
    }
    fun deletePoi(ctx: Context): Context{
        val id = ctx.pathParam("id").toInt()
        transaction {
            Poi.findById(id)?.delete()
        }
        return ctx.result("Successfully deleted POI")
    }

}