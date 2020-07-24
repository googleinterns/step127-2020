package com.google.sps;

import com.google.sps.data.JsonToRestaurantParser;
import com.google.sps.data.Restaurant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import org.json.JSONException;
import org.json.JSONObject;
import org.junit.Assert;
import org.junit.Before;
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
  private static final Map<String, Double> COORDS = Map.ofEntries(
    Map.entry("lat", 10.0),
    Map.entry("lng", 20.0)
  );

  @Test
  public void allRequiredAndOptionalFields() throws JSONException {
    // JSON object has all required and all optional fields.
    // We should see a restaurant with all the values in the JSON object.
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
    Assert.assertEquals(actual, expected);
  }

  @Test
  public void extraneousTypes() throws JSONException {
    // JSON object has types that should be disregarded.
    // We should see a restaurant with only the three relevant types.
    List<String> randomTypes = Arrays.asList(new String[]{"type a", "meal_takeaway", "type b", "meal_delivery", "restaurant"});
    JSONObject geometry = new JSONObject().put("location", COORDS);
    JSONObject body = new JSONObject()
      .put("place_id", PLACE_ID)
      .put("name", RESTAURANT_NAME)
      .put("vicinity", VICINITY)
      .put("types", randomTypes)
      .put("geometry", geometry);

    Restaurant expected = Restaurant.create(
      PLACE_ID, RESTAURANT_NAME, VICINITY, COORDS, /* avgRating= */ -1, 
      /* numRatings= */ -1, /* priceNum= */ -1, ALL_TYPES);
    Restaurant actual = JsonToRestaurantParser.toRestaurant(body);
    Assert.assertTrue(actual.getPlaceTypes().size() == ALL_TYPES.size() 
      && actual.getPlaceTypes().containsAll(ALL_TYPES) && ALL_TYPES.containsAll(actual.getPlaceTypes()));
  }

  @Test
  public void noOptionalFields() throws JSONException {
    // JSON object has all required fields and no optional fields.
    // We should see a restaurant that has the required fields and 
    // default values for optional fields.
    JSONObject geometry = new JSONObject().put("location", COORDS);
    JSONObject body = new JSONObject()
      .put("place_id", PLACE_ID)
      .put("name", RESTAURANT_NAME)
      .put("vicinity", VICINITY)
      .put("types", EMPTY_TYPES)
      .put("geometry", geometry);

    Restaurant expected = Restaurant.create(
      PLACE_ID, RESTAURANT_NAME, VICINITY, COORDS, /* avgRating= */ -1, 
      /* numRatings= */ -1, /* priceNum= */ -1, EMPTY_TYPES);
    Restaurant actual = JsonToRestaurantParser.toRestaurant(body);
    Assert.assertEquals(actual, expected);
  }

  @Test(expected = JSONException.class)
  public void noFields() throws JSONException {
    // JSON object has no fields.
    // We should see a JSONException thrown.
    JSONObject body = new JSONObject();
    Restaurant actual = JsonToRestaurantParser.toRestaurant(body);
  }

  @Test(expected = JSONException.class)
  public void missingMandatoryField() throws JSONException {
    // JSON object is missing a required field.
    // We should see a JSONException thrown.
    JSONObject body = new JSONObject()
      .put("place_id", PLACE_ID)
      .put("name", RESTAURANT_NAME)
      .put("vicinity", VICINITY)
      .put("types", EMPTY_TYPES);
    Restaurant actual = JsonToRestaurantParser.toRestaurant(body);
  }
}