package SUITS2025Backend.db

import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.*
import org.jetbrains.exposed.sql.transactions.transaction

object Pois : IntIdTable() {
    val name: Column<String> = varchar("name", 128).index()
    val latitude: Column<Double> = double("latitude")
    val longitude: Column<Double> = double("longitude")
    val tags: Column<String> = varchar("tags", 400)  // Storing tags as comma-separated string
    val description: Column<String> = varchar("description", 400)
}

class Poi(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<Poi>(Pois)

    var name by Pois.name
    var latitude by Pois.latitude
    var longitude by Pois.longitude
    var tags by Pois.tags
    var description by Pois.description

    fun asResponse(): PoiResponse {
        return PoiResponse(
            this.name,
            this.latitude,
            this.longitude,
            this.tags.split(",").filter { it.isNotEmpty() },
            this.description
        )
    }
}

data class PoiResponse(
    var name: String,
    var latitude: Double,
    var longitude: Double,
    var tags: List<String>,
    var description: String
)

class PoiDbController {
    init {
        Database.connect("jdbc:sqlite:sample.db", "org.sqlite.JDBC")
        // Create tables only once during initialization
        transaction {
            SchemaUtils.create(Pois)
        }
    }

    fun addPoi(poi: PoiResponse) {
        transaction {
            Poi.new {
                name = poi.name
                latitude = poi.latitude
                longitude = poi.longitude
                tags = poi.tags.joinToString(",")
                description = poi.description
            }
        }
    }

    fun getPois(): List<PoiResponse> {
        return transaction {
            Poi.all().map { it.asResponse() }
        }
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
                (Pois.latitude greaterEq minLat) and
                (Pois.latitude lessEq maxLat) and
                (Pois.longitude greaterEq minLon) and
                (Pois.longitude lessEq maxLon)
            }.map { it.asResponse() }
        }
    }
}