package com.google.sps.data;

import java.util.logging.Level;
import java.util.logging.Logger;
import org.apache.commons.math3.stat.descriptive.DescriptiveStatistics;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public final class RestaurantScorer {
  private static final int MAX_RATING = 5;
  private static final int MID_RATING = 3;
  private static final Logger LOGGER = Logger.getLogger(RestaurantScorer.class.getName());
  /** Class should not be instantiated. */
  private RestaurantScorer() {}

  /** Returns the percent match for a restaurant to a set of user preferences. */
  public static double score(Restaurant restaurant, JSONObject preferences,
      DescriptiveStatistics statistics) throws JSONException {
    int preferredPriceLevel = preferences.getJSONObject("priceLevel").getInt("pref");
    String preferredDiningExp = preferences.getJSONObject("diningExp").getString("pref");
    int priceLevelWeight = preferences.getJSONObject("priceLevel").getInt("weight");
    int diningExpWeight = preferences.getJSONObject("diningExp").getInt("weight");
    int maxPoints = priceLevelWeight + diningExpWeight + 1;
    double score = 0;
    double restaurantRating = restaurant.getAvgRating();
    if (restaurant.getPriceLevel() == preferredPriceLevel) {
      score += priceLevelWeight;
    }
    if (restaurant.getPlaceTypes().contains(preferredDiningExp)) {
      score += diningExpWeight;
    }
    // Adds points to the score if the rating is > MID_RATING, subtracts points if rating is <
    // MID_RATING.
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