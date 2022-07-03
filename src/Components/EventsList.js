import React, { useContext } from "react";
import axios from "axios";
import { EventsContext } from "../Helpers/EventsContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

const EventsList = ({ searching = null, category = null }) => {
  const {
    loading,
    events,
    currentPage,
    geoPointSearch,
    allPages,
    setLoading,
    setEvents,
    setCurrentPage,
  } = useContext(EventsContext);

  const eventImageUrl = (images) => {
    let imagesSorted = images.sort((a, b) => b.width - a.width); // sort by width for best image quality
    let eventImages = imagesSorted.filter((image) => !image.fallback); //filter particular event image

    if (eventImages.length > 0) {
      return eventImages[0].url;
    } else {
      return imagesSorted[0].url;
    }
  };

  const pageNavigation = (pageNumber) => {
    setLoading(true);
    axios
      .get(
        searching
          ? `https://app.ticketmaster.com/discovery/v2/events?apikey=${process.env.REACT_APP_TICKETMASTER_API_KEY}&locale=*&sort=relevance,desc&page=${pageNumber}&keyword=${searching}`
          : `https://app.ticketmaster.com/discovery/v2/events?apikey=${
              process.env.REACT_APP_TICKETMASTER_API_KEY
            }&locale=*&sort=relevance,desc&page=${pageNumber}${
              geoPointSearch && "&geoPoint=" + geoPointSearch
            }${category ? "&classificationId=" + category : ""}`
      )
      .then((response) => {
        const eventsData = response.data;
        setEvents(eventsData._embedded.events);
        setCurrentPage(pageNumber + 1);
        setLoading(false);
      });
  };

  const shortText = (str) => {
    if (str <= 200) return str;
    return str.substr(0, str.lastIndexOf(" ", 100));
  };

  return (
    <>
      <div className={loading ? "lds-dual-ring active" : "lds-dual-ring"}></div>
      <div className={loading ? "section-events d-none" : "section-events"}>
        <div className="row mw-100 mx-auto">
          {events.length > 0 ? (
            events.map((event) => (
              <div className="col-lg-3 mb-4" key={event.id}>
                <div className="card-body rounded border">
                  <img
                    src={eventImageUrl(event.images)}
                    alt={event.name}
                    className="img-event"
                  />
                  <div className="card-body">
                    <h3>{event.name}</h3>
                    {event._embedded && event._embedded.venues ? (
                      <h5>{event._embedded.venues[0].name}</h5>
                    ) : null}
                    <span className="event-date">
                      {event.dates.start.localDate}
                      {event.dates.start.localTime}
                    </span>
                    <p>
                      {shortText(
                        event.description
                          ? event.description
                          : event.info
                          ? event.info
                          : "No description available."
                      )}
                    </p>
                    <span className="url-event">
                      <a href={event.url} target="_blank">
                        Buy Tickets
                        <FontAwesomeIcon
                          icon={faArrowRight}
                          className="f-icon"
                        />
                      </a>
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <h3>No hay eventos que mostrar...</h3>
          )}
          {allPages.length > 1 && (
            <div className="col-12">
              <nav aria-label="Page navigation events">
                <ul className="pagination justify-content-center">
                  {currentPage === 1 ? (
                    <li className="page-item disabled">
                      <button className="page-link">Previous</button>
                    </li>
                  ) : (
                    <li className="page-item">
                      <button
                        className="page-link"
                        onClick={() => pageNavigation(currentPage - 2)}
                      >
                        Previous
                      </button>
                    </li>
                  )}

                  {allPages.map((pageNumber) =>
                    pageNumber === currentPage ? (
                      <li className="page-item active" key={pageNumber}>
                        <button className="page-link">{pageNumber}</button>
                      </li>
                    ) : (
                      <li className="page-item" key={pageNumber}>
                        <button
                          className="page-link"
                          onClick={() => pageNavigation(pageNumber - 1)}
                        >
                          {pageNumber}
                        </button>
                      </li>
                    )
                  )}
                  {allPages.length === currentPage ? (
                    <li className="page-item disabled">
                      <button className="page-link">Next</button>
                    </li>
                  ) : (
                    <li className="page-item">
                      <button
                        className="page-link"
                        onClick={() => pageNavigation(currentPage)}
                      >
                        Next
                      </button>
                    </li>
                  )}
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default EventsList;
