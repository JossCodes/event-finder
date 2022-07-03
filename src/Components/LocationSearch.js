import React, { useContext } from "react";
import axios from "axios";
import Geohash from "latlon-geohash";
import GooglePlacesAutocomplete, {
  geocodeByPlaceId,
} from "react-google-places-autocomplete";
import { EventsContext } from "../Helpers/EventsContext";

const LocationSearch = () => {
  const {
    setLoading,
    setGeoPointSearch,
    setLocationSearch,
    setEvents,
    setCurrentPage,
  } = useContext(EventsContext);

  const getEventsByLocation = (geopoint) => {
    setLoading(true);
    axios
      .get(
        `https://app.ticketmaster.com/discovery/v2/events?apikey=${process.env.REACT_APP_TICKETMASTER_API_KEY}&locale=*&sort=relevance,desc&geoPoint=${geopoint}`
      )
      .then((response) => {
        const eventsData = response.data;
        setEvents(eventsData._embedded.events);
        setCurrentPage(1);
        setLoading(false);
      });
  };
  const onChangeLocationInput = (location) => {
    let locationSearchCity = location.value.terms.slice(-3)[0].value;
    setLocationSearch(locationSearchCity);
    geocodeByPlaceId(location.value.place_id)
      .then((results) => {
        let lat = results[0].geometry.location.lat();
        let lng = results[0].geometry.location.lng();

        let geopoint = Geohash.encode(lat, lng, 9);
        getEventsByLocation(geopoint);
        setGeoPointSearch(geopoint);
      })
      .catch((error) => console.error(error));
  };
  return (
    <GooglePlacesAutocomplete
      apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
      selectProps={{
        placeholder: "Select your location",
        onChange: onChangeLocationInput,
        styles: {
          input: (provided) => ({
            ...provided,
            color: "black",
          }),
          option: (provided) => ({
            ...provided,
            color: "black",
          }),
        },
      }}
    />
  );
};

export default LocationSearch;
