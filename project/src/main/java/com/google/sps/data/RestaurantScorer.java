package com.google.sps.data;

import com.google.gson.Gson;
import java.util.HashMap;
import java.util.Map;
import org.json.JSONException;
import org.json.JSONObject;

public final class RestaurantScorer {
  private static final double EARTH_RADIUS = 6371000; // meters
  private static final int MAX_RATING = 5;
  private static final int MID_RATING = 3;
  /** Class should not be instantiated. */
  private RestaurantScorer() {}

  /** Returns the percent match for a restaurant to a set of user preferences. */
  public static double score(Restaurant restaurant, JSONObject preferences) throws JSONException {
    int priceLevelWeight = preferences.getJSONObject("priceLevel").getInt("weight");
    int diningExpWeight = preferences.getJSONObject("diningExp").getInt("weight");
    int radiusWeight = preferences.getJSONObject("radius").getInt("weight");
    int maxPoints = priceLevelWeight + diningExpWeight + radiusWeight + 1;
    Map<String, Double> currLocation = new Gson().fromJson(preferences.getJSONObject("currLocation").toString(), HashMap.class);
    double score = 0;
    double restaurantRating = restaurant.getAvgRating();

    if (restaurant.getPriceLevel() == preferences.getJSONObject("priceLevel").getInt("pref")) {
      score += priceLevelWeight;
    }
    if (restaurant.getPlaceTypes().contains(preferences.getJSONObject("diningExp").getString("pref"))) {
      score += diningExpWeight;
    }
    if (distanceInMeters(currLocation, restaurant.getLatLngCoords()) <= preferences.getJSONObject("radius").getInt("pref")) {
      score += radiusWeight;
    }
    // Adds points to the score if the rating is > MID_RATING, subtracts points if 
    // rating is < MID_RATING.
    boolean hasRating = restaurantRating != -1;
    if (hasRating) {
      score += (restaurantRating / MAX_RATING) - (MID_RATING / MAX_RATING);
    }
    double percentMatch = score / maxPoints;
    return percentMatch;
  }

  /** Calculates the distance in meters between two sets of lat long coordinates. */
  public static double distanceInMeters(Map<String,Double> currCoords, Map<String,Double> placeCoords) {
    double latDiff = Math.toRadians(placeCoords.get("lat") - currCoords.get("lat"));
    double lngDiff = Math.toRadians(placeCoords.get("lng") - currCoords.get("lng"));
    double a = Math.sin(latDiff/2) * Math.sin(latDiff/2) +
        Math.cos(Math.toRadians(currCoords.get("lat"))) * Math.cos(Math.toRadians(placeCoords.get("lat"))) *
        Math.sin(lngDiff/2) * Math.sin(lngDiff/2);
    double distInRadians = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    double distInMeters = EARTH_RADIUS * distInRadians;
    return distInMeters;
  }
}