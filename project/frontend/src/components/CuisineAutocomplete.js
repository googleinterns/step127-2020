import './CuisineAutocomplete.css';

import React from 'react';

import Autocomplete, {
  createFilterOptions,
} from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

/**
 * Validates a cuisine input. A valid cuisine string must meet the following
 * criteria:
 * - Have a length greater than 0 and less than 25.
 * - Be composed only of letters and spaces.
 * - Be unique.
 *
 * @param {string} input The input string to be considered.
 * @param {!Array<string>} options The complete list of cuisine options.
 */
function inputIsNewAndValid(input, options) {
  const trimmedInput = input.trim();
  return (
    trimmedInput !== '' &&
      trimmedInput.length < 25 &&
      // RegEx to make sure input is only chars and spaces.
    /^[a-z\s]+$/i.test(trimmedInput) &&
      // Make sure we don't display duplicates.
    !(options.includes(trimmedInput) && options.includes(input))
  );
};

/**
 * A Material-UI Autocomplete component to be used for selecting cuisine types.
 * @see https://material-ui.com/api/autocomplete/
 * 
 * @param {!Array<string>} props.cuisineOptions The complete list of cuisine options.
 * @param {function(Array<string>): undefined} props.setCuisine A state setter function
 *     with which the selected cuisine types may be updated from this component.
 */
function CuisineAutocomplete(props) {
  const { cuisineOptions, setCuisine } = props;

  const filter = createFilterOptions();
  
  return (
    <Autocomplete
      name='cuisine'
      id='cuisine'
      options={cuisineOptions}
      multiple
      fullWidth={true}
      autoHighlight={true}
      onChange={(_event, newCuisineList) => {
        setCuisine(newCuisineList);
      }}
      filterSelectedOptions={true}
      filterOptions={(options, state) => {
        const filtered = filter(options, state);
        if (inputIsNewAndValid(state.inputValue, options)) {
          filtered.push(state.inputValue.trim());
        }
        return filtered;
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          variant='standard'
          placeholder='Select Cuisine Types'
        />
      )}
      classes={{
        root: 'autocomplete-root',
        focused: 'autocomplete-root-focused',
        inputRoot: 'autocomplete-input-root',
        input: 'autocomplete-input',
        endAdornment: 'autocomplete-end-adornment',
        tag: 'autocomplete-tag',
        listbox: 'autocomplete-listbox',
      }}
    />
  );
}

export default CuisineAutocomplete;
