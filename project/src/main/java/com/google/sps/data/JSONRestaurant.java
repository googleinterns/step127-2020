package com.google.sps.data;

import com.google.gson.Gson;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class JSONRestaurant {

  /** Parses a JSON object to a Restaurant object. */
  public static Restaurant toRestaurant(JSONObject body) throws JSONException {
    String name = body.getString("name");
    String address = body.getString("formatted_address");
    String stringifiedLocation =
        body.getJSONObject("geometry").getJSONObject("location").toString();
    Map<String, Double> latLngCoords = new Gson().fromJson(stringifiedLocation, HashMap.class);
    double avgRating = body.has("rating") ? body.getDouble("rating") : -1;
    int numRatings =
        body.has("user_ratings_total") ? body.getInt("user_ratings_total") : -1;
    int priceLevel = body.has("price_level") ? body.getInt("price_level") : -1;
    String id = body.getString("id");
    List<String> placeTypes = getTypes(body.getJSONArray("types"));
    return Restaurant.create(name, address, latLngCoords, avgRating, numRatings, priceLevel, id, placeTypes);
  }

  private static List<String> getTypes(JSONArray allTypes) throws JSONException {
    List<String> placeTypes = new ArrayList<>();
    for (int i = 0; i < allTypes.length(); i++) {
      String type = allTypes.getString(i);
      if (type.equals("restaurant") || type.equals("meal_delivery")
          || type.equals("meal_takeaway")) {
        placeTypes.add(type);
      }
    }
    return placeTypes;
  }
}