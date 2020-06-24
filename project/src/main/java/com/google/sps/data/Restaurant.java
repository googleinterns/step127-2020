package com.google.sps.data;

import java.lang.Iterable;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

  /** Represents a restaurant with it's relevant information. */
public class Restaurant {

  /** Represents a price level for the restaurant. */
  public enum PriceLevel {LOW, MED, HIGH, UNKNOWN};

  private final String name;
  private final String cuisineType;
  private final String address;
  private final Map<String, Double> latLngCoords;
  private final double avgRating;
  private final int numRatings;
  private final PriceLevel priceLevel;
  private final String id;
  private final List<String> placeTypes;

  public Restaurant(String name, String cuisineType, String address, Map<String, Double> latLngCoords, double avgRating, int numRatings, int priceNum , String id) {
    this.name = name;
    this.cuisineType = cuisineType;
    this.address = address;
    this.avgRating = avgRating;
    this.numRatings = numRatings;
    switch(priceNum) {
      case 0:
      case 1:
        priceLevel = PriceLevel.LOW;
        break;
      case 2:
        priceLevel = PriceLevel.MED;
        break;
      case 3:
      case 4:
        priceLevel = PriceLevel.HIGH;
        break;
      default:
        priceLevel = PriceLevel.UNKNOWN;
        break;
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
    return "name: " + name + ", cuisineType: " + cuisineType + ", address: " + address + ", avgRating: " + avgRating + ", numRatings: " + numRatings + ", priceLevel: " + priceLevel + ", id: " + id;
  }
}