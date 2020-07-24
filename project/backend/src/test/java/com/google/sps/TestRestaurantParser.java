package com.google.sps;

import com.google.sps.data.JsonToRestaurantParser;
import com.google.sps.data.Restaurant;
import java.util.ArrayList;
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
public final class TestRestaurantParser {

  private static final int MISSING_FIELD = -1;
  private static final List<String> EMPTY_TYPES = new ArrayList<>();
  private static final String RESTAURANT_A = "RESTAURANT_A";
  private static final String PLACE_ID_A = "A12345";
  private static final String VICINITY_A = "10 Main Street";
  private static final Map<String, Double> COORDS_A = Map.ofEntries(
    Map.entry("lat", 10.0),
    Map.entry("lng", 20.0)
  );

  @Test
  public void noOptionalFields() throws JSONException {
    JSONObject body = new JSONObject();
    JSONObject geometry = new JSONObject();
    geometry.put("location", COORDS_A);
    body.put("place_id", PLACE_ID_A);
    body.put("name", RESTAURANT_A);
    body.put("vicinity", VICINITY_A);
    body.put("types", EMPTY_TYPES);
    body.put("geometry", geometry);
    
    Restaurant expected = Restaurant.create(
      PLACE_ID_A, RESTAURANT_A, VICINITY_A, COORDS_A, -1, -1, -1, EMPTY_TYPES);
    Restaurant result = JsonToRestaurantParser.toRestaurant(body);
    Assert.assertEquals(result, expected);
  }
}