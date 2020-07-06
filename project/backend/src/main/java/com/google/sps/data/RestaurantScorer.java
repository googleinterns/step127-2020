package com.google.sps.data;

import java.util.logging.Level;
import java.util.logging.Logger;
import org.apache.commons.math3.stat.descriptive.DescriptiveStatistics;
import org.json.JSONArray;
import com.google.gson.Gson;
import java.util.HashMap;
import java.util.Map;
import org.json.JSONException;
import org.json.JSONObject;

public final class RestaurantScorer {
  private static final double EARTH_RADIUS_METERS = 6371000;
  private static final int MAX_RATING = 5;
  private static final int MID_RATING = 3;
  private static final Logger LOGGER = Logger.getLogger(RestaurantScorer.class.getName());
  // Number of "dummy ratings" that will be used to calculate the rating score.
  // Arbitrary value will be replaced by a value based on the average num ratings.
  private static final int NUM_INITIAL_RATINGS = 20;
  private static final Gson GSON = new Gson();
  /** Class should not be instantiated. */
  private RestaurantScorer() {}

  /** Returns the percent match for a restaurant to a set of user preferences. */
  public static double score(Restaurant restaurant, JSONObject preferences,
      DescriptiveStatistics statistics) throws JSONException {
    int preferredPriceLevel = preferences.getJSONObject("priceLevel").getInt("pref");
    String preferredDiningExp = preferences.getJSONObject("diningExp").getString("pref");
    int priceLevelWeight = preferences.getJSONObject("priceLevel").getInt("weight");
    int diningExpWeight = preferences.getJSONObject("diningExp").getInt("weight");
    int radiusWeight = preferences.getJSONObject("radius").getInt("weight");
    int maxPoints = priceLevelWeight + diningExpWeight + radiusWeight
        + 1; // add 1 because rating score has an upper bound of 1
    Map<String, Double> currLocation =
        GSON.fromJson(preferences.getJSONObject("currLocation").toString(), HashMap.class);
    double score = 0;
    double restaurantRating = restaurant.getAvgRating();
    double distMeters = distanceInMeters(currLocation, restaurant.getLatLngCoords());
    double prefDistMeters = preferences.getJSONObject("radius").getDouble("pref");

    if (restaurant.getPriceLevel() == preferences.getJSONObject("priceLevel").getInt("pref")) {
      score += priceLevelWeight;
    }
    if (restaurant.getPlaceTypes().contains(
            preferences.getJSONObject("diningExp").getString("pref"))) {
      score += diningExpWeight;
    }
    if (distMeters <= prefDistMeters) {
      score += radiusWeight;
    } else {
      double percentDistDiff = (roundMetersToMiles(distMeters) - roundMetersToMiles(prefDistMeters))
          / roundMetersToMiles(prefDistMeters);
      score -= percentDistDiff * radiusWeight;
    }
    // Adds points to the score if the rating is > MID_RATING, subtracts points if
    // rating is < MID_RATING.
    boolean hasRating = restaurantRating != -1;
    if (hasRating) {
      score += calculateRatingScore(restaurantRating, restaurant.getNumRatings(), statistics);
    }
    double percentMatch = score / maxPoints;
    return percentMatch;
  }

  /**
   * Creates and returns a DescriptiveStatistics object containing all the values for number of
   * ratings for each restaurant.
   */
  public static DescriptiveStatistics createDescriptiveStatistics(JSONArray restaurantList) {
    DescriptiveStatistics statistics = new DescriptiveStatistics();
    for (int i = 0; i < restaurantList.length(); i++) {
      try {
        // int numRatings = restaurantList.getJSONObject(i).has("user_ratings_total") ?
        // restaurantList.getJSONObject(i).getInt("user_ratings_total") : 0;
        // statistics.addValue(numRatings);
        statistics.addValue(restaurantList.getJSONObject(i).getInt("user_ratings_total"));
      } catch (JSONException e) {
        // LOGGER.log("Error parsing JSON: " + e.getMessage());
        statistics.addValue(0);
      }
    }
    return statistics;
  }
  
  /**
   * Calculates the distance in meters between two sets of lat long coordinates using the Haversine
   * formula.
   */
  private static double distanceInMeters(
      Map<String, Double> currCoords, Map<String, Double> placeCoords) {
    double latDiff = Math.toRadians(placeCoords.get("lat") - currCoords.get("lat"));
    double lngDiff = Math.toRadians(placeCoords.get("lng") - currCoords.get("lng"));
    double point = Math.pow(Math.sin(latDiff / 2), 2)
        + Math.cos(Math.toRadians(currCoords.get("lat")))
            * Math.cos(Math.toRadians(placeCoords.get("lat"))) * Math.pow(Math.sin(lngDiff / 2), 2);
    double angleInRadians = 2 * Math.atan2(Math.sqrt(point), Math.sqrt(1 - point));
    double distInMeters = EARTH_RADIUS_METERS * angleInRadians;
    return distInMeters;
  }

  /** Converts meters to miles and rounds to the nearest mile. */
  private static long roundMetersToMiles(double numMeters) {
    return Math.round(numMeters / 1609.34);
  }

  /** Skews ratings so that ratings with a lower number of ratings are weighed less. */
  private static double calculateRatingScore(
      double avgRating, int numRatings, DescriptiveStatistics statistics) {
    int numInitialRatings = (int) Math.round(statistics.getPercentile(25));
    int totalRatings = numInitialRatings + numRatings;
    double totalPoints = numInitialRatings * MID_RATING + avgRating * numRatings;
    double weightedRating = totalPoints / totalRatings;
    return (weightedRating - MID_RATING) / MAX_RATING;
  }
}
