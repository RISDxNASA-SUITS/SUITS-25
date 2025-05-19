package SUITS2025Backend.db

import org.jetbrains.exposed.dao.IntEntity
import org.jetbrains.exposed.dao.IntEntityClass
import org.jetbrains.exposed.dao.id.EntityID
import org.jetbrains.exposed.dao.id.IntIdTable
import org.jetbrains.exposed.sql.Column
import org.jetbrains.exposed.*
import org.jetbrains.exposed.sql.javatime.*
import java.time.LocalDateTime
import io.javalin.Javalin
import io.javalin.http.Context
import org.jetbrains.exposed.sql.transactions.transaction 
import io.javalin.http.bodyAsClass
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.SupervisorJob
import SUITS2025Backend.TssDataSerializations.TssComms
import SUITS2025Backend.TssDataSerializations.SpecState
import kotlinx.coroutines.delay
import org.jetbrains.exposed.sql.SchemaUtils
data class GeoResponse(
    val id: Int,
    val createdAt: String,
    val sio2: Float,
    val al2o3: Float,
    val mno: Float,
    val cao: Float,
    val p2o3: Float,
    val tio2: Float,
    val feo: Float,
    val mgo: Float,
    val k2o: Float,
    val other: Float
)

object Geos : IntIdTable() {
    /** Uses the kotlinx-datetime LocalDateTime type */
    val createdAt = datetime("created_at").defaultExpression(CurrentDateTime)
    
    val sio2 = float("sio2")
    val al2o3 = float("al2o3")
    val mno = float("mno")
    val cao = float("cao")
    val p2o3 = float("p2o3")
    val tio2 = float("tio2")
    val feo = float("feo")
    val mgo = float("mgo")
    val k2o = float("k2o")
    val other = float("other")
}



class Geo(id: EntityID<Int>) : IntEntity(id) {
    companion object : IntEntityClass<Geo>(Geos)

    var createdAt: LocalDateTime by Geos.createdAt
    
    var sio2 by Geos.sio2
    var al2o3 by Geos.al2o3
    var mno by Geos.mno
    var cao by Geos.cao
    var p2o3 by Geos.p2o3
    var tio2 by Geos.tio2
    var feo by Geos.feo
    var mgo by Geos.mgo
    var k2o by Geos.k2o
    var other by Geos.other

    fun toResponse(): GeoResponse {
        return GeoResponse(
            id = id.value,
            createdAt = createdAt.toString(),
            sio2 = sio2,
            al2o3 = al2o3,
            mno = mno,
            cao = cao,
            p2o3 = p2o3,
            tio2 = tio2,
            feo = feo,
            mgo = mgo,
            k2o = k2o,
            other = other
        )
    }
}

object GeoDbController {
    
  private val bgScope = CoroutineScope(SupervisorJob() + Dispatchers.IO)
    @JvmStatic
    fun setup(app: Javalin) {
        transaction {
            SchemaUtils.create(Geos)
        }
        bgScope.launch {
            coroutineGeoCheck()
          }
       app.get("/geo"){
        getSamples(it)
       }
       app.post("/geo"){
        addSample(it)
       }
        
    }

    suspend fun coroutineGeoCheck(){
        val channel = Channel<SpecState>()
        val tssKt = TssComms
         
        bgScope.launch {
            while(true){
                val spec = tssKt.getSpecStateBackend()
                if(spec.id != 0f){
                    channel.send(spec)
                }
                delay(1000)
            }
        }
        bgScope.launch {
            while(true){
                val spec = tssKt.getSpecState2Backend()
                if(spec.id != 0f){
                    channel.send(spec)
                }
                
                delay(1000)
            }
        }
        bgScope.launch {
            while(true){
                val sample = channel.receive()
               transaction {
                    Geo.findById(sample.id.toInt())
                    ?: run {
                        Geo.new { 
                            createdAt = LocalDateTime.now()
                            sio2 = sample.sio2
                            al2o3 = sample.al2o3
                            mno = sample.mno
                            cao = sample.cao
                            p2o3 = sample.p2o3
                            tio2 = sample.tio2
                            feo = sample.feo
                            mgo = sample.mgo
                            k2o = sample.k2o
                            other = sample.other
                        }
                    }
                }
               
                
            }
        }
        
       
    }


    fun getSamples(ctx: Context) {
       transaction { 
            val samples = Geo.all().map { it.toResponse() }
            ctx.json(samples)
        }
    }

    fun addSample(ctx: Context) {
        val sample = ctx.bodyAsClass(GeoResponse::class.java)
        transaction {
            Geo.new {
                createdAt = LocalDateTime.now()
                sio2 = sample.sio2
                al2o3 = sample.al2o3
                mno = sample.mno
                cao = sample.cao
                p2o3 = sample.p2o3
                tio2 = sample.tio2
                feo = sample.feo
                mgo = sample.mgo
                k2o = sample.k2o
                other = sample.other
            }
        }
        ctx.result("Successfully added sample")
    }
}