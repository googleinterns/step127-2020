package com.google.sps.servlets;

import com.google.gson.Gson;
import com.google.sps.data.Restaurant;
import java.io.BufferedReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.HashSet;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.Map;
import java.util.Set;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

/** Servlet that provides a restaurant recommendation. */
@WebServlet("/recommendation")
public class RecommendationServlet extends HttpServlet {

  private final Gson gson = new Gson();
  private static final Logger LOGGER = Logger.getLogger(RecommendationServlet.class.getName());
  private final Set<Restaurant> restaurantSet = new HashSet<>();

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    BufferedReader reader = request.getReader();
    String body = reader.readLine();
    try {
      addRestaurantsToSet(body);
    } catch (JSONException e) {
       LOGGER.log(Level.WARNING, "Error parsing JSON: " + e.getMessage());
    }
    // Write one random restaurant to response. This will be replaced by the picking algorithm.
    response.setContentType("application/json");
    for (Restaurant restaurant : restaurantSet) {
      response.getWriter().println(gson.toJson(restaurant));
      return;
    }
  }

  private void addRestaurantsToSet(String body) throws JSONException {
    JSONObject reqBody = new JSONObject(body);
    String cuisineType = reqBody.getString("cuisineType");
    JSONArray restaurantList = reqBody.getJSONArray("restaurants");
    for (int i = 0; i < restaurantList.length(); i++) {
      JSONObject restaurant = restaurantList.getJSONObject(i);
      String name = restaurant.getString("name");
      String address = restaurant.getString("formatted_address");
      String stringifiedLocation = restaurant.getJSONObject("geometry").getJSONObject("location").toString();
      Map<String, Double> latLngCoords = gson.fromJson(stringifiedLocation, HashMap.class);
      double rating = restaurant.has("rating") ? restaurant.getDouble("rating") : -1;
      int numRatings = restaurant.has("user_ratings_total") ? restaurant.getInt("user_ratings_total") : -1;
      int price = restaurant.has("price_level") ? restaurant.getInt("price_level") : -1;
      String id = restaurant.getString("id");
      Restaurant restaurantObj = new Restaurant(name, cuisineType, address, latLngCoords, rating, numRatings, price, id);
      JSONArray allTypes = restaurant.getJSONArray("types");
      for (int j = 0; j < allTypes.length(); j++) {
        String type = allTypes.getString(j);
        if (type.equals("restaurant") || type.equals("meal_delivery") || type.equals("meal_takeaway")) {
          restaurantObj.addType(type);
        }
      }
      restaurantSet.add(restaurantObj);
    }
  }
}