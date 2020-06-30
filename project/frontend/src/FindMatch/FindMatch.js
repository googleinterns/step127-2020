import React from "react"
import ReactDOM from "react-dom"

class PreferenceForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {'cuisine': '', 'distance': '', 'dining-experience': '', 'price-level': '',
                    'latitude': '', 'longitude': ''};
    this.state = {formControls: {
      cuisine: {
        value: ''
      },
      distance: {
        value: ''
      },
      dining: {
        value: ''
      },
      price: {
        value: ''
      },
      latitude: {
        value: ''
      },
      longitude: {
        value: ''
      }
    }
   }
  }
  changeHandler = event => {
    const name = event.target.name;
    const value = event.target.value;

    this.setState({
      formControls: {...this.state.formControls, [
        name]: {
          ...this.state.formControls[name], 
          value
        }
      }
    });
  }

  render() {
    const cuisines = ["Italian", "Mexican", "Indian"];
    const distances = ["1 mile", "5 miles", "10 miles", "25 miles"];
    const dining_experiences = ["Takeout", "Delivery", "Dine-In"];
    const price_levels = ["Low", "Medium", "High"];
    return (
      <form id="restaurant-prefs">
        <label for="cuisine">What cuisine?</label>
        <select name="cuisine" id="cuisine">
          {cuisines.map(cuisine => <option value={cuisine}>{cuisine}</option>)};
        </select>
        <label for="distance">Distance</label>
        <select name="distance" id="distance">
          {distances.map(distance => <option value={distance}>{distance}</option>)};
        </select>
        <br />
        <label for="dining-experience">Dining Experience</label>
        <select name="dining-experience" id="dining-experience">
          {dining_experiences.map(experience => <option value={experience}>{experience}</option>)};
        </select>
        <br />
        <label for="price-level">Price</label>
        <select name="price-level" id="price-level">
          {price_levels.map(price => <option value={price}>{price}</option>)};
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
