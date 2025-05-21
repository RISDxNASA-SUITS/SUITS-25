package SUITS2025Backend

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.KotlinModule
import io.javalin.Javalin
import io.javalin.json.JavalinJackson
import SUITS2025Backend.PoiList.PoiController
import SUITS2025Backend.PythonCommunication.PythonCommunicationHandler
import SUITS2025Backend.TssDataSerializations.TssComms
import SUITS2025Backend.db.GeoDbController

/** Application entry-point */
object Server {

    @JvmStatic
    fun main(args: Array<String>) {

        /* ---------- Jackson mapper with Kotlin module ---------- */
        val mapper = ObjectMapper()
            .registerModule(KotlinModule.Builder().build())

        /* ---------- Javalin instance ---------- */
        val app = Javalin.create { cfg ->
            cfg.jsonMapper(JavalinJackson(mapper, false))
        }

        /* ---------- WebSocket handlers ---------- */
       

        /* ---------- REST controllers ---------- */
        PoiController.setup(app)
        PythonCommunicationHandler.setup(app)
        TssComms.setup(app)
        GeoDbController.setup(app)

        /* ---------- Start server ---------- */
        app.start(7070)
    }
}
