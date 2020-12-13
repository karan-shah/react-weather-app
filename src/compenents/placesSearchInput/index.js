import React, { useState, useEffect } from 'react';
import { Input } from 'reactstrap';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { LoadScript } from '@react-google-maps/api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import { lightTheme, darkTheme } from '../../theme';
import './styles.scss'

const libraries = ["places"];

const PlacesSearchInput = (props) => {

  const [address, setAddress] = useState('')

  const handleChange = address => {
    setAddress(address);
  };

  const handleSelect = address => {
    props.setCurrentCity({ address })
    props.getWeatherDataByCity(address)
  };
  const searchOptions = { types: ['(cities)'] }

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_KEY} libraries={libraries}>
      <PlacesAutocomplete
        value={address}
        onChange={handleChange}
        onSelect={handleSelect}
        searchOptions={searchOptions}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div>
            <input
              {...getInputProps({
                placeholder: 'Type city name to get weather forecast',
                className: 'location-search-input',
              })}
            />
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions.map((suggestion, index) => {
                const className = suggestion.active ? 'suggestion-item--active' : 'suggestion-item';
                const style = { backgroundColor: `${props.theme === 'dark' ? 'black' : 'white'}` };
                return (
                  <div key={index}
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style
                    })}
                  >
                    <span>{suggestion.description}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    </LoadScript>
  );
}

export default PlacesSearchInput