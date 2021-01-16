import logo from "./images/logo.png";
import Navbar from "react-bootstrap/Navbar";
import React from "react";
import Nav from "react-bootstrap/Nav";
import "./NavHeader.css";

function NavHeader() {
  return (
    <div>
      <Navbar bg="light">
        <Navbar.Brand style={{ backgroundColor: "#f8f9fa" }}>
          <Nav.Link href="/">
            <img
              src={logo}
              height="40"
              style={{ margin: "20px", backgroundColor: "#f8f9fa" }}
              className="d-inline-block align-top"
              alt="Ossia Logo"
            />
          </Nav.Link>
        </Navbar.Brand>
        <Nav.Link className="PageLink" style={{ color: "black" }} href="/">
          Dashboard
        </Nav.Link>

        <Nav.Link
          className="PageLink"
          href="/settings/"
          style={{ color: "black" }}
        >
          Settings
        </Nav.Link>
      </Navbar>
    </div>
  );
}

export default NavHeader;
