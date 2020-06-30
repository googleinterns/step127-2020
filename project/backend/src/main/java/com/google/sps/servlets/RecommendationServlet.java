package com.google.sps.servlets;

import com.google.gson.Gson;
import com.google.sps.data.JsonToRestaurantParser;
import com.google.sps.data.Restaurant;
import java.io.BufferedReader;
import java.io.IOException;
import java.util.ArrayList;
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

  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
    Set<Restaurant> restaurantSet = new HashSet<>();
    BufferedReader reader = request.getReader();
    String body = reader.readLine();
    try {
      addRestaurantsToSet(body, restaurantSet);
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

  /** Creates Restaurant objects for each restaurant in the body and adds them to restaurantSet. */
  private static void addRestaurantsToSet(String body, Set<Restaurant> restaurantSet)
      throws JSONException {
    JSONObject reqBody = new JSONObject(body);
    String cuisineType = reqBody.getString("cuisineType");
    JSONArray restaurantList = reqBody.getJSONArray("restaurants");
    for (int i = 0; i < restaurantList.length(); i++) {
      Restaurant restaurantObj =
          JsonToRestaurantParser.toRestaurant(restaurantList.getJSONObject(i));
      restaurantSet.add(restaurantObj);
    }
  }
}