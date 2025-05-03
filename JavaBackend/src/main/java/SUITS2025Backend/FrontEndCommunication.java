package SUITS2025Backend;
import java.util.HashMap;
import SUITS2025Backend.Location;

public class FrontEndCommunication {
    HashMap<String, Location> pois = new HashMap<String, Location>();

    public void addPoi(String name, double latitude, double longitude) {
        Location location = new Location(latitude, longitude);
        pois.put(name, location);
    }

    public Location getPoi(String name) {
        return pois.get(name);
    }

    public Location removePoi(String name) {
        return pois.remove(name);
    }

    public HashMap<String, Location> getAllPois() {
        return pois;
    }

    public void clearPois() {
        pois.clear();
    }

    public boolean hasPoi(String name) {
        return pois.containsKey(name);
    }

    public int getPoiCount() {
        return pois.size();
    }
    public boolean isEmpty() {
        return pois.isEmpty();
    }
    
    public void updatePoi(String name, double latitude, double longitude) {
        if (pois.containsKey(name)) {
            Location location = new Location(latitude, longitude);
            pois.put(name, location);
        }
    }
}
