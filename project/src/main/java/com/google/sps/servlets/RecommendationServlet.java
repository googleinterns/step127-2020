package com.google.sps.servlets;

import com.google.gson.Gson;
import com.google.sps.data.JsonToRestaurantParser;
import com.google.sps.data.Restaurant;
import com.google.sps.data.RestaurantScorer;
import java.io.BufferedReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
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
  private static Set<Restaurant> restaurantSet;
  private static Map<Restaurant, Double> restaurantScores;

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    restaurantSet = new HashSet<>();
    restaurantScores = new HashMap<>();
    BufferedReader reader = request.getReader();
    String body = reader.readLine();
    try {
      JSONObject reqBody = new JSONObject(body);
      JSONArray restaurantList = reqBody.getJSONArray("restaurants");
      addRestaurantsToSet(restaurantList);
      JSONObject preferences = reqBody.getJSONObject("preferences");
      scoreRestaurants(preferences);
    } catch (JSONException e) {
      LOGGER.log(Level.WARNING, "Error parsing JSON: " + e.getMessage());
    }

    // Sort restaurant entries by highest score and write list of entries to the response.
    List<Map.Entry<Restaurant, Double>> sortedRestaurants =
        new ArrayList(restaurantScores.entrySet());
    sortedRestaurants.sort(Map.Entry.comparingByValue(Collections.reverseOrder()));
    response.setContentType("application/json");
    response.getWriter().println(gson.toJson(sortedRestaurants));
  }

  /** Creates Restaurant objects for each restaurant in the body and adds them to restaurantSet. */
  private static void addRestaurantsToSet(JSONArray restaurantList) throws JSONException {
    for (int i = 0; i < restaurantList.length(); i++) {
      Restaurant restaurantObj =
          JsonToRestaurantParser.toRestaurant(restaurantList.getJSONObject(i));
      restaurantSet.add(restaurantObj);
    }
  }

  /**
   * Maps each restaurant to a score. A restaurant earns points for matching price level/type and
   * having good ratings.
   */
  private static void scoreRestaurants(JSONObject preferences) throws JSONException {
    for (Restaurant restaurant : restaurantSet) {
      restaurantScores.put(restaurant, RestaurantScorer.score(restaurant, preferences));
    }
  }
}