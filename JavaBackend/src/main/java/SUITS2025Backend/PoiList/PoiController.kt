package SUITS2025Backend.PoiList

import SUITS2025Backend.db.PoiDbController
import SUITS2025Backend.db.PoiResponse
import SUITS2025Backend.db.PoiResponseJson
import io.javalin.Javalin
import io.javalin.http.Context

/** Singleton controller that wires POI–related routes */
object PoiController {

    private val poiDbController = PoiDbController()

    /** Call from your Server.kt / main to register routes */
    fun setup(app: Javalin) = with(app) {

        // --- POI core -------------------------------------------------------
        get("/poi")                 { ctx -> getPois(ctx) }
        post("/poi")                { ctx -> addPoi(ctx) }
        put("/poi")                 { ctx -> updatePoi(ctx) }

        // --- Tags & areas ---------------------------------------------------
        get("/poi/tag/{tag}")       { ctx -> getPoisByTag(ctx) }
        get("/poi/area")            { ctx -> getPoisInArea(ctx) }
        post("/poi/updateTags/{id}"){ ctx -> poiDbController.updateTags(ctx) }

        // --- Audio & voice notes -------------------------------------------
        post("/audio")              { ctx -> poiDbController.submitAudio(ctx) }
        get("/audio/{id}")          { ctx -> poiDbController.getAudio(ctx) }
        post("/poi/addVoiceNote")   { ctx -> poiDbController.addVoiceNote(ctx) }

        // --- Delete helpers -------------------------------------------------
        delete("/poi")              { ctx -> poiDbController.deletePois(ctx) }
        delete("/poi/{id}")         { ctx -> poiDbController.deletePoi(ctx) }
    }

    // -----------------------------------------------------------------------
    // Handlers that delegate to the DB layer
    // -----------------------------------------------------------------------

    private fun getPois(ctx: Context) {
        val resp: PoiResponseJson = poiDbController.getPois()

        ctx.json(resp)
    }

    private fun addPoi(ctx: Context) {
        val poi = ctx.bodyAsClass(PoiResponse::class.java)
        val resp = poiDbController.addPoi(poi)
        ctx.json(resp)
    }



    private fun updatePoi(ctx: Context) {
        poiDbController.updatePoi(ctx)
    }

    private fun getPoisByTag(ctx: Context) {
        val tag = ctx.pathParam("tag")
        val resp = poiDbController.getPoisByTag(tag)
        ctx.json(resp)
    }

    private fun getPoisInArea(ctx: Context) {
        val minLat  = ctx.queryParam("minLat")!!.toDouble()
        val maxLat  = ctx.queryParam("maxLat")!!.toDouble()
        val minLon  = ctx.queryParam("minLon")!!.toDouble()
        val maxLon  = ctx.queryParam("maxLon")!!.toDouble()

        val resp = poiDbController.getPoisInArea(minLat, maxLat, minLon, maxLon)
        ctx.json(resp)
    }
}
