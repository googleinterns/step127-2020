package com.google.sps;

import static com.google.common.truth.Truth.assertThat;
import com.google.sps.data.JsonToRestaurantParser;
import com.google.sps.data.Restaurant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.json.JSONException;
import org.json.JSONObject;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.junit.runners.JUnit4;

@RunWith(JUnit4.class)
public final class JsonToRestaurantParserTest {

  private static final int MISSING_FIELD = -1;
  private static final int PRICE_LEVEL = 2;
  private static final int NUM_RATINGS = 415;
  private static final double RATING = 3.78;
  private static final List<String> EMPTY_TYPES = new ArrayList<>();
  private static final List<String> ALL_TYPES = Arrays.asList(new String[]{"meal_takeaway", "meal_delivery", "restaurant"});
  private static final String RESTAURANT_NAME = "RESTAURANT_A";
  private static final String PLACE_ID = "A12345";
  private static final String VICINITY = "10 Main Street";
  private static final Map<String, Double> COORDS = new HashMap<String, Double>() {{
    put("lat", 10.0);
    put("lng", 20.0);
  }};

  @Test
  public void allRequiredAndOptionalFields() throws JSONException {
    JSONObject geometry = new JSONObject().put("location", COORDS);
    JSONObject body = new JSONObject()
      .put("place_id", PLACE_ID)
      .put("name", RESTAURANT_NAME)
      .put("vicinity", VICINITY)
      .put("types", EMPTY_TYPES)
      .put("geometry", geometry)
      .put("rating", RATING)
      .put("user_ratings_total", NUM_RATINGS)
      .put("price_level", PRICE_LEVEL);

    Restaurant expected = Restaurant.create(
      PLACE_ID, RESTAURANT_NAME, VICINITY, COORDS, RATING, NUM_RATINGS,
      PRICE_LEVEL, EMPTY_TYPES);
    Restaurant actual = JsonToRestaurantParser.toRestaurant(body);
    assertThat(actual).isEqualTo(expected);
  }

  @Test
  public void extraneousTypes_onlyIncludeRelevantTypes() throws JSONException {
    List<String> randomTypes = Arrays.asList(new String[]{"type a", "meal_takeaway", "type b", "meal_delivery", "restaurant"});
    JSONObject geometry = new JSONObject().put("location", COORDS);
    JSONObject body = new JSONObject()
      .put("place_id", PLACE_ID)
      .put("name", RESTAURANT_NAME)
      .put("vicinity", VICINITY)
      .put("types", randomTypes)
      .put("geometry", geometry);

    Restaurant actual = JsonToRestaurantParser.toRestaurant(body);
    assertThat(actual.getPlaceTypes()).containsExactlyElementsIn(ALL_TYPES);
  }

  @Test
  public void noOptionalFields_useDefaultValues() throws JSONException {
    JSONObject geometry = new JSONObject().put("location", COORDS);
    JSONObject body = new JSONObject()
      .put("place_id", PLACE_ID)
      .put("name", RESTAURANT_NAME)
      .put("vicinity", VICINITY)
      .put("types", EMPTY_TYPES)
      .put("geometry", geometry);

    Restaurant expected = Restaurant.create(
      PLACE_ID, RESTAURANT_NAME, VICINITY, COORDS, /* avgRating= */ MISSING_FIELD, 
      /* numRatings= */ MISSING_FIELD, /* priceNum= */ MISSING_FIELD, EMPTY_TYPES);
    Restaurant actual = JsonToRestaurantParser.toRestaurant(body);
    assertThat(actual).isEqualTo(expected);
  }

  @Test(expected = JSONException.class)
  public void noFields() throws JSONException {
    JSONObject body = new JSONObject();
    Restaurant actual = JsonToRestaurantParser.toRestaurant(body);
  }

  @Test(expected = JSONException.class)
  public void missingMandatoryField() throws JSONException {
    JSONObject body = new JSONObject()
      .put("place_id", PLACE_ID)
      .put("name", RESTAURANT_NAME)
      .put("vicinity", VICINITY)
      .put("types", EMPTY_TYPES);
    Restaurant actual = JsonToRestaurantParser.toRestaurant(body);
  }
}