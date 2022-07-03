import React from "react";
import logo from "../../src/logo.png";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  return (
    <>
      <nav className="navbar navbar-primary">
        <div className="container-fluid">
          <Link to="/" className="navbar-item">
            Home
          </Link>
          <Link to="/">
            <img src={logo} className="logo" />
          </Link>
          <Link to="/search" className="navbar-button">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </Link>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
