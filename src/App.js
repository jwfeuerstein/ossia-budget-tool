import "./App.css";
import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import logo from "./images/logo.png";
import Measured from "./Measured";
import NavHeader from "./NavHeader";
import FivePointEight from "./5.8GHz";
import TwoPointFour from "./2.4GHz";
import "../node_modules/react-vis/dist/style.css";

function App() {
  const [adminMode, setAdminMode] = useState(false);
  const [show, setShow] = useState(false);
  const [key, setKey] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleSubmit = (e) => {
    setShow(false);

    if (key == "Ossia" || key == "ossia") {
      setAdminMode(true);
      alert("Admin mode activated");
    } else {
      alert("Incorrect admin key");
    }
  };

  const handleKey = (e) => {
    setKey(e.target.value);
  };

  const handleDisable = (e) => {
    setAdminMode(false);
    alert("Admin mode disabled");
  };

  return (
    <div className="App">
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
            //href="/settings/"
            style={{ color: "black" }}
            onClick={handleShow}
          >
            Settings
          </Nav.Link>
          <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
              <Modal.Title>Settings</Modal.Title>
            </Modal.Header>
            {adminMode ? (
              <Modal.Body>
                <h5>Disable Admin Mode:</h5>
                <Button
                  variant="primary"
                  style={{ backgroundColor: "#cc0000", borderColor: "#cc0000" }}
                  onClick={handleDisable}
                >
                  Disable
                </Button>
              </Modal.Body>
            ) : (
              <Modal.Body>
                <h5>Enter Admin Mode:</h5>
                <InputGroup style={{ maxWidth: "400px" }} className="mb-3">
                  <FormControl
                    type="password"
                    aria-label="TX-Width"
                    aria-describedby="inputGroup-sizing-default"
                    placeholder="Enter key to activate admin mode"
                    onChange={handleKey}
                  />
                </InputGroup>
              </Modal.Body>
            )}

            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" type="submit" onClick={handleSubmit}>
                Submit
              </Button>
            </Modal.Footer>
          </Modal>
        </Navbar>
      </div>
      <br />
      <Tabs
        className="Tabs-Control"
        defaultActiveKey="2.4"
        id="uncontrolled-tab-example"
      >
        <Tab eventKey="2.4" title="Cota 2.4 GHz">
          <TwoPointFour adminMode={adminMode} />
          <br />
          <br />
        </Tab>
        <Tab eventKey="5.8" title="Cota 5.8 GHz">
          <FivePointEight adminMode={adminMode} />
          <br />
          <br />
        </Tab>
        <Tab eventKey="measured" title="Measured 2.4 to 5.8 GHz">
          <Measured />
        </Tab>
      </Tabs>
    </div>
  );
}

export default App;
