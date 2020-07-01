import React from "react"
import ReactDOM from "react-dom"

class PreferenceForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = { cuisine: "" }
    this.changeState = this.changeState.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  // Updates the state of the input element so it holds the chosen value.
  changeState(event) {
    this.setState({ cuisine: event.target.value })
  }

  handleSubmit(event) {
    alert("the cuisine you chose is: " + this.state.cuisine)
  }

  render() {
    const cuisines = ["italian", "mexican", "indian"]
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          What cuisine?
          <select
            name="cuisine"
            id="cuisine"
            onChange={changeState}
            value={this.state.cuisine}
          >
            {cuisines.map((cuisine) => (
              <option value={cuisine}>
                {cuisine[0].toUpperCase() + cuisine.slice(1)}
              </option>
            ))}
            ;
          </select>
        </label>
        <button type="submit">Submit</button>
      </form>
    )
  }
}
