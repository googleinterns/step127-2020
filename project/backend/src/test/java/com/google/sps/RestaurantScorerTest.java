package com.google.sps;

import static com.google.common.truth.Truth.assertThat;
import com.google.sps.data.Restaurant;
import com.google.sps.data.RestaurantScorer;
import java.util.Arrays;
import java.lang.ExceptionInInitializerError;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.apache.commons.math3.stat.descriptive.DescriptiveStatistics;
import org.json.JSONException;
import org.json.JSONObject;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

@RunWith(JUnit4.class)
public final class RestaurantScorerTest {
  
  private static final List<String> SOME_TYPES = Arrays.asList(new String[]{"meal_takeaway", "restaurant"});
  private static final String RESTAURANT_NAME = "RESTAURANT_A";
  private static final String PLACE_ID = "A12345";
  private static final String VICINITY = "10 Main Street";
  private static final int MISSING_FIELD = -1;
  private static final int PRICE_LEVEL = 2;
  private static final double AVG_RATING = 4.78;
  private static final int NUM_RATINGS = 75;
  private static final double MAX_RATING = 5;
  private static final double MID_RATING = 3;
  private static final DescriptiveStatistics STATS = new  DescriptiveStatistics(new double[] {10, 30, 50, 60, 90, 100});
  private static final double AVG_NUM_RATINGS = STATS.getMean();
  private static final int WEIGHT_2 = 2;
  private static final int WEIGHT_3 = 3;
  private static final int WEIGHT_4 = 4;
  private static final double EXPECTED_RATING_SCORE = 
      (Math.round(AVG_NUM_RATINGS / 5) * MID_RATING + NUM_RATINGS * AVG_RATING) / 
      ((NUM_RATINGS + Math.round(AVG_NUM_RATINGS / 5)) * (MAX_RATING - MID_RATING)) - 
      MID_RATING / (MAX_RATING - MID_RATING);
  private static final Map<String, Double> COORDS = new HashMap<String, Double>() {{
    put("lat", 10.0);
    put("lng", 20.0);
  }};
  private static final Restaurant RESTAURANT_ALL_FIELDS = Restaurant.create(
      PLACE_ID, RESTAURANT_NAME, VICINITY, COORDS, AVG_RATING, NUM_RATINGS, PRICE_LEVEL, SOME_TYPES);
  private static final JSONObject PREFS_ALL_FIELDS = new JSONObject();

  @Before
  public void setPrefs() throws JSONException {
    PREFS_ALL_FIELDS
      .put("currLocation", new JSONObject().put("lat", COORDS.get("lat")).put("lng", COORDS.get("lng")))
      .put("priceLevel", new JSONObject().put("pref", PRICE_LEVEL).put("weight", WEIGHT_2))
      .put("diningExp", new JSONObject().put("pref", "meal_takeaway").put("weight", WEIGHT_3))
      .put("radius", new JSONObject().put("pref", 10).put("weight", WEIGHT_4));
  }

  @Test
  public void noOptionalPrefFieldsPresent_useRatingScore() throws JSONException {
    JSONObject preferences = new JSONObject()
      .put("currLocation", new JSONObject().put("lat", COORDS.get("lat")).put("lng", COORDS.get("lng")));

    double actualScore = RestaurantScorer.score(RESTAURANT_ALL_FIELDS, preferences, STATS);
    assertThat(actualScore).isEqualTo(EXPECTED_RATING_SCORE);
  }

  @Test
  public void allPrefFieldsPresentAndMatching() throws JSONException {
    double actualScore = RestaurantScorer.score(RESTAURANT_ALL_FIELDS, PREFS_ALL_FIELDS, STATS);
    double expectedScore = 1.0; //(EXPECTED_RATING_SCORE + WEIGHT_2 + WEIGHT_3 + WEIGHT_4) / 
      // (1 + WEIGHT_2 + WEIGHT_3 + WEIGHT_4);
    assertThat(actualScore).isEqualTo(expectedScore);
  }

  @Test
  public void restaurantMissingField_doNotConsider() throws JSONException {
    Restaurant restaurantMissingField = Restaurant.create(
      PLACE_ID, RESTAURANT_NAME, VICINITY, COORDS, AVG_RATING, NUM_RATINGS, 
      /* priceNum= */ MISSING_FIELD, SOME_TYPES);

    double actualScore = RestaurantScorer.score(restaurantMissingField, PREFS_ALL_FIELDS, STATS);
    double expectedScore = (EXPECTED_RATING_SCORE + WEIGHT_3 + WEIGHT_4 + 0.4) / (1 + WEIGHT_3 + WEIGHT_4);
    expectedScore = expectedScore > 1 ? 1.0 : expectedScore;
    assertThat(actualScore).isEqualTo(expectedScore);
  }

  // @Test
  // public void restaurantOutOfBounds_subtractFromScore() throws JSONException {
  //   JSONObject preferences = new JSONObject()
  //     .put("currLocation", new JSONObject().put("lat", COORDS.get("lat") + 0.25).put("lng", COORDS.get("lng") + 0.25))
  //     .put("radius", new JSONObject().put("pref", 10).put("weight", WEIGHT_4));
  //     // Distance calculated using Haversine formula calculator: http://www.movable-type.co.uk/scripts/latlong.html
  //     double percentDistDiff = 1.423969;

  //     double actualScore = RestaurantScorer.score(RESTAURANT_ALL_FIELDS, preferences, STATS);
  //     double expectedScore = (EXPECTED_RATING_SCORE - percentDistDiff * WEIGHT_4) / (1 + WEIGHT_4);
  //     // Account for margin of error in rounding from online calculator.
  //     assertThat(actualScore).isWithin(0.001).of(expectedScore);
  // }

  @Test
  public void restaurantMissingRating() throws JSONException {
    Restaurant restaurantWithoutRatings = Restaurant.create(
      PLACE_ID, RESTAURANT_NAME, VICINITY, COORDS, /* avgRating= */ MISSING_FIELD, 
      /** numRatings= */ MISSING_FIELD, PRICE_LEVEL, SOME_TYPES);

    double actualScore = RestaurantScorer.score(restaurantWithoutRatings, PREFS_ALL_FIELDS, STATS);
    double expectedScore = (double) (WEIGHT_2 + WEIGHT_3 + WEIGHT_4 + 0.5) / (1 + WEIGHT_2 + WEIGHT_3 + WEIGHT_4);
    expectedScore = expectedScore > 1 ? 1.0 : expectedScore;
    assertThat(actualScore).isEqualTo(expectedScore);
  }

  @Test
  public void prefDiningExpNotMatching() throws JSONException {
    JSONObject preferences = PREFS_ALL_FIELDS; 
    preferences.getJSONObject("diningExp").put("pref", "meal_delivery");

    double actualScore = RestaurantScorer.score(RESTAURANT_ALL_FIELDS, preferences, STATS);
    double expectedScore = (EXPECTED_RATING_SCORE + WEIGHT_2 + WEIGHT_4 + 0.5) / (1 + WEIGHT_2 + WEIGHT_3 + WEIGHT_4);
    assertThat(actualScore).isEqualTo(expectedScore);
  }

  @Test
  public void confidenceScoreIsTiebreaker_lowerRatingScoresHigher() throws JSONException {
    Restaurant restaurantWithHigherRating = Restaurant.create( PLACE_ID, RESTAURANT_NAME, VICINITY, COORDS, 
      /* avgRating= */ 5, /* numRatings= */ 5, PRICE_LEVEL, SOME_TYPES);

    double lowerScore = RestaurantScorer.score(restaurantWithHigherRating, PREFS_ALL_FIELDS, STATS);
    double higherScore = RestaurantScorer.score(RESTAURANT_ALL_FIELDS, PREFS_ALL_FIELDS, STATS);
    assertThat(higherScore).isGreaterThan(lowerScore);
  }
}