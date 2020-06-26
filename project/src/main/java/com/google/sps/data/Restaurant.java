package com.google.sps.data;

import com.google.auto.value.AutoValue;
import java.util.List;
import java.util.Map;

@AutoValue
public abstract class Restaurant {
  public abstract String getName();
  public abstract String getAddress();
  public abstract Map<String, Double> getLatLngCoords();
  public abstract double getRating();
  public abstract int getNumRatings();
  public abstract int getPriceLevel();
  public abstract String getId();
  public abstract List<String> getPlaceTypes();

  public static Restaurant create(String name, String address, Map<String, Double> latLngCoords,
      double avgRating, int numRatings, int priceNum, String id, List<String> placeTypes) {
    return new AutoValue_Restaurant(
        name, address, latLngCoords, avgRating, numRatings, priceNum, id, placeTypes);
  }
}