package SUITS2025Backend.PoiList;

import SUITS2025Backend.db.PoiDbController;
import SUITS2025Backend.db.PoiResponse;
import SUITS2025Backend.db.PoiResponseJson;
import io.javalin.Javalin;
import io.javalin.http.Context;

import java.util.List;

public class PoiController {
    private static final PoiDbController poiDbController = new PoiDbController();

    public static void setup(Javalin app) {
        app.get("/poi", PoiController::getPois);
        app.post("/poi", PoiController::addPoi);
        app.delete("/poi/{name}", PoiController::removePoi);
        app.get("/poi/tag/{tag}", PoiController::getPoisByTag);
        app.get("/poi/area", PoiController::getPoisInArea);
        app.post("/audio", poiDbController::submitAudio);
        app.get("/audio/{id}", poiDbController::getAudio);
        app.delete("/poi", poiDbController::deletePois);
        app.post("/poi/addVoiceNote", poiDbController::addVoiceNote);
        app.delete("/poi/{id}", poiDbController::deletePoi);
        app.post("/poi/updateTags/{id}", poiDbController::updateTags);
    }

    private static void getPois(Context ctx) {
        PoiResponseJson resp = poiDbController.getPois();
        
        ctx.json(resp);
    }

    private static void addPoi(Context ctx) {
        PoiResponse poi = ctx.bodyAsClass(PoiResponse.class);
        PoiResponse resp = poiDbController.addPoi(poi);
        ctx.json(resp);
    }

    private static void removePoi(Context ctx) {
        String name = ctx.pathParam("name");
        poiDbController.deletePoi(name);
        ctx.result("Successfully deleted POI");
    }

    private static void getPoisByTag(Context ctx) {
        String tag = ctx.pathParam("tag");
        List<PoiResponse> resp = poiDbController.getPoisByTag(tag);
        ctx.json(resp);
    }

    private static void getPoisInArea(Context ctx) {
        double minLat = Double.parseDouble(ctx.queryParam("minLat"));
        double maxLat = Double.parseDouble(ctx.queryParam("maxLat"));
        double minLon = Double.parseDouble(ctx.queryParam("minLon"));
        double maxLon = Double.parseDouble(ctx.queryParam("maxLon"));
        
        List<PoiResponse> resp = poiDbController.getPoisInArea(minLat, maxLat, minLon, maxLon);
        ctx.json(resp);
    }
    
}
