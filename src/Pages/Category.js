import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { EventsContext } from "../Helpers/EventsContext";
import EventsList from "../Components/EventsList";

const Category = () => {
  let { category } = useParams();
  const [categoryName, setCategoryName] = useState("");
  const [catId, setCatId] = useState("");
  const {
    locationSearch,
    geoPointSearch,
    setLoading,
    setAllPages,
    setEvents,
    setCurrentPage,
  } = useContext(EventsContext);

  let navigate = useNavigate();

  useEffect(() => {
    switch (category) {
      case "sports":
        setCategoryName("Sports");
        getEventsByCategory("KZFzniwnSyZfZ7v7nE");
        break;
      case "music":
        setCategoryName("Music");
        getEventsByCategory("KZFzniwnSyZfZ7v7nJ");
        break;
      case "arts-theatre":
        setCategoryName("Arts & Theatre");
        getEventsByCategory("KZFzniwnSyZfZ7v7na");
        break;
      case "film":
        setCategoryName("Film");
        getEventsByCategory("KZFzniwnSyZfZ7v7nn");
        break;

      default:
        navigate("/");
        break;
    }
  }, []);

  const getEventsByCategory = (categoryId) => {
    setLoading(true);
    axios
      .get(
        `https://app.ticketmaster.com/discovery/v2/events?apikey=${
          process.env.REACT_APP_TICKETMASTER_API_KEY
        }&locale=*&sort=relevance,desc&classificationId=${categoryId}${
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
        setCurrentPage(1);
        setCatId(categoryId);
      });
  };

  return (
    <>
      <h1 className="py-4">
        Popular near <span>{locationSearch}</span>
      </h1>
      <h2>Category {categoryName}</h2>
      <EventsList category={catId} />
    </>
  );
};

export default Category;
