package com.google.sps.data;

import org.json.JSONException;
import org.json.JSONObject;

public final class RestaurantScorer {
  /** Class should not be instantiated. */
  private RestaurantScorer() {}

  public static double score(Restaurant restaurant, JSONObject preferences) throws JSONException {
    int preferredPriceLevel = preferences.getJSONObject("priceLevel").getInt("pref");
    String preferredDiningExp = preferences.getJSONObject("diningExp").getString("pref");
    int priceLevelWeight = preferences.getJSONObject("priceLevel").getInt("weight");
    int diningExpWeight = preferences.getJSONObject("diningExp").getInt("weight");
    double score = 0;
    double restaurantRating = restaurant.getAvgRating();
    if (restaurant.getPriceLevel() == preferredPriceLevel) {
      score += priceLevelWeight;
    }
    if (restaurant.getPlaceTypes().contains(preferredDiningExp)) {
      score += diningExpWeight;
    }
    if (restaurantRating >= 3) {
      score += restaurantRating / 5;
    } else if (restaurantRating > 0) {
      // Subtract more points from score for lower rating. This calculation will be improved.
      score -= (0.6 - restaurantRating / 5);
    }
    return score;
  }
}