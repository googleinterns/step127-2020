import './CuisineAutocomplete.css';

import React, { useState } from 'react';

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
function inputIsNewAndValid(input, options, numSelected) {
  const trimmedInput = input.trim();
  return (
    trimmedInput !== '' &&
    trimmedInput.length < 25 &&
    // RegEx to make sure input is only chars and spaces.
    /^[a-z\s]+$/i.test(trimmedInput) &&
    // Make sure we don't display duplicates.
    !(options.includes(trimmedInput) && options.includes(input))
  );
}

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
  const [numSelected, setNumSelected] = useState(0);

  const filter = createFilterOptions();
  const maxNumCuisines = 10;

  return (
    <Autocomplete
      name='cuisine'
      id='cuisine'
      options={cuisineOptions}
      multiple
      limitTags={10}
      fullWidth={true}
      autoHighlight={true}
      onChange={(_event, newCuisineList) => {
        setNumSelected(newCuisineList.length);
        setCuisine(newCuisineList);
      }}
      filterSelectedOptions={true}
      filterOptions={(options, state) => {
        if (numSelected >= maxNumCuisines) {
          return [];
        }
        const filtered = filter(options, state);
        if (inputIsNewAndValid(state.inputValue, options, numSelected)) {
          filtered.push(state.inputValue.trim());
        }
        return filtered;
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={`${numSelected}/${maxNumCuisines}`}
          variant='outlined'
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
