import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBasketball,
  faMusic,
  faMasksTheater,
  faFilm,
} from "@fortawesome/free-solid-svg-icons";
import EventsList from "../Components/EventsList";
import LocationSearch from "../Components/LocationSearch";
import { EventsContext } from "../Helpers/EventsContext";

const Home = () => {
  const { locationSearch, setLoading, geoPointSearch, setEvents, setAllPages } =
    useContext(EventsContext);

  useEffect(() => {
    setLoading(true);
    axios
      .get(
        `https://app.ticketmaster.com/discovery/v2/events?apikey=${
          process.env.REACT_APP_TICKETMASTER_API_KEY
        }&locale=*&sort=relevance,desc${
          geoPointSearch && "&geoPoint=" + geoPointSearch
        }`
      )
      .then((response) => {
        const eventsData = response.data;
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
        setLoading(false);
      });
  }, []);

  return (
    <div className="container">
      <h1 className="py-4">
        Popular near <span>{locationSearch}</span>
      </h1>
      <LocationSearch />
      <section className="card text-center my-4 p-3">
        <h2 className="pb-2">Categories</h2>
        <div className="row">
          <div className="col-lg-6">
            <div className="category-link">
              <div className="row align-items-center">
                <div className="col-3">
                  <div className="f-icon">
                    <FontAwesomeIcon icon={faBasketball} />
                  </div>
                </div>
                <div className="col-9">
                  <Link to="/category/sports">Sports</Link>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="category-link">
              <div className="row align-items-center">
                <div className="col-3">
                  <div className="f-icon">
                    <FontAwesomeIcon icon={faMusic} />
                  </div>
                </div>
                <div className="col-9">
                  <Link to="/category/music">Music</Link>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="category-link">
              <div className="row align-items-center">
                <div className="col-3">
                  <div className="f-icon">
                    <FontAwesomeIcon icon={faMasksTheater} />
                  </div>
                </div>
                <div className="col-9">
                  <Link to="/category/arts-theatre">Arts & Theatre</Link>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="category-link">
              <div className="row align-items-center">
                <div className="col-3">
                  <div className="f-icon">
                    <FontAwesomeIcon icon={faFilm} />
                  </div>
                </div>
                <div className="col-9">
                  <Link to="/category/film">Film</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <EventsList />
    </div>
  );
};

export default Home;
