package com.google.sps.data;

import org.json.JSONException;
import org.json.JSONObject;

public final class RestaurantScorer {
  private static final int MAX_RATING = 5;
  private static final int MID_RATING = 3;
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
    // This statement executes if a rating exists for the resturant.
    // Adds points to the score if the rating is > 3, subtracts points if rating is < 3.
    if (restaurantRating > 0) {
      score += (restaurantRating / MAX_RATING) - (MID_RATING / MAX_RATING);
    }

    double percentMatch = score / maxPoints;
    return percentMatch;
  }
}