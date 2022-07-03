import React, { useContext, useState } from "react";
import EventsList from "../Components/EventsList";
import axios from "axios";
import { EventsContext } from "../Helpers/EventsContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const Search = () => {
  const [search, setSearch] = useState("");
  const { setLoading, setAllPages, setEvents } = useContext(EventsContext);

  const handleSearch = (searching) => {
    setSearch(searching);
    console.log();
    setLoading(true);
    axios
      .get(
        `https://app.ticketmaster.com/discovery/v2/events?apikey=${process.env.REACT_APP_TICKETMASTER_API_KEY}&locale=*&sort=relevance,desc&keyword=${searching}`
      )
      .then((response) => {
        const eventsData = response.data;
        if (eventsData._embedded) {
          let pagesListEvents = eventsData.page.totalPages;
          let arrayPages = [];
          if (pagesListEvents > 20) {
            for (let index = 1; index < 21; index++) {
              arrayPages.push(index);
            }
            setAllPages(arrayPages);
          } else {
            for (let index = 1; index < pagesListEvents + 1; index++) {
              arrayPages.push(index);
            }
            setAllPages(arrayPages);
          }
          setEvents(eventsData._embedded.events);
        } else {
          setAllPages([]);
          setEvents([]);
        }
        setLoading(false);
      });
  };

  return (
    <div className="container">
      <div className="search-box py-5">
        <input
          type="text"
          className="search-input"
          placeholder="Search Event.."
          onChange={(e) => handleSearch(e.target.value)}
        />

        <button className="search-button">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      </div>
      <h2>Searching {search && `"${search}"`}</h2>

      {search && <EventsList searching={search} />}
    </div>
  );
};

export default Search;
