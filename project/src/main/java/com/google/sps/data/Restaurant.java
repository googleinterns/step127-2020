package com.google.sps.data;

import com.google.gson.Gson;
import java.lang.Iterable;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/** Represents a restaurant with it's relevant information. */
public class Restaurant {
  /** Represents a price level for the restaurant. */
  public enum PriceLevel { FREE, LOW, MED, HIGH, VERYHIGH, UNKNOWN }
  ;

  private final String name;
  private final String cuisineType;
  private final String address;
  private final Map<String, Double> latLngCoords;
  private final double avgRating;
  private final int numRatings;
  private final PriceLevel priceLevel;
  private final String id;
  private final List<String> placeTypes;

  public Restaurant(String name, String cuisineType, String address,
      Map<String, Double> latLngCoords, double avgRating, int numRatings, int priceNum, String id) {
    this.name = name;
    this.cuisineType = cuisineType;
    this.address = address;
    this.avgRating = avgRating;
    this.numRatings = numRatings;
    if (priceNum >= 0) {
      priceLevel = PriceLevel.values()[priceNum];
    } else {
      priceLevel = PriceLevel.UNKNOWN;
    }
    this.latLngCoords = latLngCoords;
    this.id = id;
    placeTypes = new ArrayList<>();
  }

  public void addType(String type) {
    placeTypes.add(type);
  }

  public String getId() {
    return id;
  }

  @Override
  public int hashCode() {
    return id.hashCode();
  }

  @Override
  public boolean equals(Object other) {
    if (other == this) {
      return true;
    }
    if (!(other instanceof Restaurant)) {
      return false;
    }
    return this.id.equals(((Restaurant) other).getId());
  }

  public String toString() {
    return "name: " + name + ", cuisineType: " + cuisineType + ", address: " + address
        + ", avgRating: " + avgRating + ", numRatings: " + numRatings
        + ", priceLevel: " + priceLevel + ", id: " + id;
  }

  /** Creates and returns a new Restaurant object from a JSON object. */
  public static Restaurant fromJson(JSONObject jsonRestaurant, String cuisineType) throws JSONException {
    String name = jsonRestaurant.getString("name");
    String address = jsonRestaurant.getString("formatted_address");
    String stringifiedLocation =
    jsonRestaurant.getJSONObject("geometry").getJSONObject("location").toString();
    Map<String, Double> latLngCoords = new Gson().fromJson(stringifiedLocation, HashMap.class);
    double rating = jsonRestaurant.has("rating") ? jsonRestaurant.getDouble("rating") : -1;
    int numRatings =
    jsonRestaurant.has("user_ratings_total") ? jsonRestaurant.getInt("user_ratings_total") : -1;
    int price = jsonRestaurant.has("price_level") ? jsonRestaurant.getInt("price_level") : -1;
    String id = jsonRestaurant.getString("id");
    Restaurant restaurant =
        new Restaurant(name, cuisineType, address, latLngCoords, rating, numRatings, price, id);
    JSONArray allTypes = jsonRestaurant.getJSONArray("types");
    for (int j = 0; j < allTypes.length(); j++) {
      String type = allTypes.getString(j);
      if (type.equals("restaurant") || type.equals("meal_delivery")
          || type.equals("meal_takeaway")) {
        restaurant.addType(type);
      }
    }
    return restaurant;
  }
}