import React from "react"
import ReactDOM from "react-dom"

class PreferenceForm extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    const cuisines = ["Italian", "Mexican", "Indian"]
    return (
      <form id="restaurant-prefs">
        <label for="cuisine">What cuisine?</label>
        <select name="cuisine" id="cuisine">
          <option value="Italian">Italian</option>
          <option value="Mexican">Mexican</option>
          <option value="Indian">Indian</option>
        </select>
        <label for="distance">Distance</label>
        <select name="distance" id="distance">
          <option value="1 mile">1 mile</option>
          <option value="5 miles">5 miles</option>
          <option value="10 miles">10 miles</option>
          <option value="25 miles">25 miles</option>
        </select>
        <br />
        <label for="dining-experience">Dining Experience</label>
        <select name="dining-experience" id="dining-experience">
          <option value="takeout">Takeout</option>
          <option value="delivery">Delivery</option>
          <option value="dine-in">Dine-In</option>
        </select>
        <br />
        <label for="price-level">Price</label>
        <select name="price-level" id="price-level">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <br />
        <label for="latitude">Latitude</label>
        <input type="number" name="latitude" id="latitude" />
        <br />
        <label for="longitude">Longitude</label>
        <input type="number" name="longitide" id="longitude" />
        <br />
        <button type="submit">Submit</button>
      </form>
    )
  }
}
ReactDOM.render(PreferenceForm, document.getElementById("root"))
