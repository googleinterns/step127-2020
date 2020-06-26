package com.google.sps.data;

import com.google.auto.value.AutoValue;
import java.util.List;
import java.util.Map;

@AutoValue
public abstract class Restaurant {
  public abstract String getId();
  public abstract String getName();
  public abstract String getAddress();
  /** Example map: "lat" : 12.3, "lng" : 45.6 */ 
  public abstract Map<String, Double> getLatLngCoords();
  public abstract double getAvgRating();
  public abstract int getNumRatings();
  public abstract int getPriceLevel();
  public abstract List<String> getPlaceTypes();

  public static Restaurant create(String id, String name, String address,
      Map<String, Double> latLngCoords, double avgRating, int numRatings, int priceNum,
      List<String> placeTypes) {
    return new AutoValue_Restaurant(
        id, name, address, latLngCoords, avgRating, numRatings, priceNum, placeTypes);
  }
}