package com.google.sps.data;

import org.json.JSONException;
import org.json.JSONObject;

public final class RestaurantScorer {
  private static final int MAX_RATING = 5;
  private static final int MID_RATING = 3;
  // Number of "dummy ratings" that will be used to calculate the rating score.
  // Arbitrary value will be replaced by a value based on the average num ratings.
  private static final int NUM_INITIAL_RATINGS = 20;
  /** Class should not be instantiated. */
  private RestaurantScorer() {}

  /** Returns the percent match for a restaurant to a set of user preferences. */
  public static double score(Restaurant restaurant, JSONObject preferences) throws JSONException {
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
      score += calculateRatingScore(restaurantRating, restaurant.getNumRatings());
    }
    double percentMatch = score / maxPoints;
    return percentMatch;
  }

  /** Skews ratings so that ratings with a lower number of ratings are weighed less. */
  private static double calculateRatingScore(double avgRating, int numRatings) {
    int totalRatings = NUM_INITIAL_RATINGS + numRatings;
    double totalPoints = NUM_INITIAL_RATINGS * MID_RATING + avgRating * numRatings;
    double weightedRating = totalPoints / totalRatings;
    return (weightedRating - MID_RATING) / MAX_RATING;
  }
}