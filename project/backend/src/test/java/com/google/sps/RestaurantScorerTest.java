package com.google.sps;

import static com.google.common.truth.Truth.assertThat;
import com.google.sps.data.Restaurant;
import com.google.sps.data.RestaurantScorer;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.apache.commons.math3.stat.descriptive.DescriptiveStatistics;
import org.json.JSONException;
import org.json.JSONObject;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

@RunWith(JUnit4.class)
public final class RestaurantScorerTest {
  
  private static final int PRICE_LEVEL = 2;
  private static final int NUM_RATINGS = 75;
  private static final double RATING = 3.78;
  private static final List<String> ALL_TYPES = Arrays.asList(new String[] {"meal_takeaway", "meal_delivery", "restaurant"});
  private static final String RESTAURANT_NAME = "RESTAURANT_A";
  private static final String PLACE_ID = "A12345";
  private static final String VICINITY = "10 Main Street";
  private static final int MAX_RATING = 5;
  private static final int MID_RATING = 3;
  private static final Map<String, Double> COORDS = new HashMap<String, Double>() {{
    put("lat", 10.0);
    put("lng", 20.0);
  }};
  private static final DescriptiveStatistics STATS = new DescriptiveStatistics(new double[] {10, 30, 50, 60, 90, 100});
  private static final Restaurant RESTAURANT_ALL_FIELDS = Restaurant.create(
      PLACE_ID, RESTAURANT_NAME, VICINITY, COORDS, RATING, NUM_RATINGS, PRICE_LEVEL, ALL_TYPES);

  @Test
  public void noOptionalPrefFieldsPresent_useRatingScore() throws JSONException {
    JSONObject preferences = new JSONObject()
      .put("currLocation", new JSONObject().put("lat", COORDS.get("lat")).put("lng", COORDS.get("lng")));
    double actual = RestaurantScorer.score(RESTAURANT_ALL_FIELDS, preferences, STATS);
    int numInitialRatings = (int) Math.round(STATS.getMean() / 5);
    double weightedRating = (numInitialRatings * MID_RATING + NUM_RATINGS * RATING) / (NUM_RATINGS + numInitialRatings);
    double expected = (weightedRating - MID_RATING) / (MAX_RATING - MID_RATING);
    assertThat(actual).isEqualTo(expected);
  }

  @Test
  public void allPrefFieldsPresentAndMatching() throws JSONException {
    JSONObject preferences = new JSONObject()
      .put("currLocation", new JSONObject().put("lat", COORDS.get("lat")).put("lng", COORDS.get("lng")))
      .put("priceLevel", new JSONObject().put("pref", PRICE_LEVEL).put("weight", 2))
      .put("diningExp", new JSONObject().put("pref", "meal_takeaway").put("weight", 3))
      .put("radius", new JSONObject().put("pref", 10000).put("weight", 4));
    double actual = RestaurantScorer.score(RESTAURANT_ALL_FIELDS, preferences, STATS);
    int numInitialRatings = (int) Math.round(STATS.getMean() / 5);
    double weightedRating = (numInitialRatings * MID_RATING + NUM_RATINGS * RATING) / (NUM_RATINGS + numInitialRatings);
    double ratingScore = (weightedRating - MID_RATING) / (MAX_RATING - MID_RATING);
    double expected = (ratingScore + 9) / 10;
    assertThat(actual).isEqualTo(expected);
  }
}