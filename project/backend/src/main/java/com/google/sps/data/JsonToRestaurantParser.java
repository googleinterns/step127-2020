package com.google.sps.data;

import com.google.gson.Gson;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public final class JsonToRestaurantParser {
  /** Class should not be instantiated. */
  private JsonToRestaurantParser() {}

  /** Parses a JSON object to a Restaurant object. */
  public static Restaurant toRestaurant(JSONObject body) throws JSONException {
    String id = body.getString("place_id");
    String name = body.getString("name");
    String address = body.getString("vicinity");
    String stringifiedLocation =
        body.getJSONObject("geometry").getJSONObject("location").toString();
    Map<String, Double> latLngCoords = new Gson().fromJson(stringifiedLocation, HashMap.class);
    double avgRating = getDoubleOrDefault(body, "rating"); //body.has("rating") ? body.getDouble("rating") : -1;
    int numRatings = getIntOrDefault(body, "user_ratings_total");
    int priceLevel = getIntOrDefault(body, "price_level");
    List<String> placeTypes = getTypes(body.getJSONArray("types"));
    return Restaurant.create(
        id, name, address, latLngCoords, avgRating, numRatings, priceLevel, placeTypes);
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

  private static int getIntOrDefault(JSONObject body, String field) {
    try {
      return body.getInt(field);
    } catch (JSONException e) {
      return -1;
    }
  }

  private static double getDoubleOrDefault(JSONObject body, String field) {
    try {
      return body.getDouble(field);
    } catch (JSONException e) {
      return -1;
    }
  }
}
