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
import java.util.List;
import java.util.Map;
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

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    String body = request.getReader().readLine();
    response.setContentType("application/json");
    try {
      JSONObject reqBody = new JSONObject(body);
      Map<Restaurant, Double> restaurantScores = scoreRestaurants(
          reqBody.getJSONArray("restaurants"), reqBody.getJSONObject("preferences"));
      // Sort restaurant entries by highest score and write list of entries to the response.
      List<Map.Entry<Restaurant, Double>> sortedRestaurants =
          new ArrayList(restaurantScores.entrySet());
      sortedRestaurants.sort(Map.Entry.comparingByValue(Collections.reverseOrder()));
      response.getWriter().println(gson.toJson(sortedRestaurants));
    } catch (JSONException e) {
      response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Maps each restaurant to a score. A restaurant earns points for matching price level/type and
   * having good ratings.
   */
  private static Map<Restaurant, Double> scoreRestaurants(
      JSONArray restaurantList, JSONObject preferences) {
    Map<Restaurant, Double> restaurantScores = new HashMap<>();
    for (int i = 0; i < restaurantList.length(); i++) {
      try {
        Restaurant restaurant =
            JsonToRestaurantParser.toRestaurant(restaurantList.getJSONObject(i));
        restaurantScores.put(restaurant, RestaurantScorer.score(restaurant, preferences));
      } catch (JSONException e) {
        LOGGER.log(Level.WARNING, "Error parsing JSON: " + e.getMessage());
      }
    }
    return restaurantScores;
  }
}