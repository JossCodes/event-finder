import "./Styles/custom.css";
import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { EventsContext } from "./Helpers/EventsContext";
import Home from "./Pages/Home";
import Navbar from "./Components/Navbar";
import Category from "./Pages/Category";
import Search from "./Pages/Search";

function App() {
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [locationSearch, setLocationSearch] = useState("Worldwide");
  const [geoPointSearch, setGeoPointSearch] = useState("");
  const [allPages, setAllPages] = useState([]);

  return (
    <div className="App">
      <EventsContext.Provider
        value={{
          loading,
          events,
          allPages,
          currentPage,
          locationSearch,
          geoPointSearch,
          setLoading,
          setEvents,
          setAllPages,
          setCurrentPage,
          setLocationSearch,
          setGeoPointSearch,
        }}
      >
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/category/:category" element={<Category />} />
          </Routes>
        </Router>
      </EventsContext.Provider>
    </div>
  );
}

export default App;
