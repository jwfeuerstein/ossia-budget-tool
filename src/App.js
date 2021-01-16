import "./App.css";
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Measured from "./Measured";
import NavHeader from "./NavHeader";
import FivePointEight from "./5.8GHz";
import TwoPointFour from "./2.4GHz";
import "../node_modules/react-vis/dist/style.css";

function App() {
  return (
    <div className="App">
      <NavHeader />
      <br />
      <Tabs
        className="Tabs-Control"
        defaultActiveKey="2.4"
        id="uncontrolled-tab-example"
      >
        <Tab eventKey="2.4" title="Cota 2.4 GHz">
          <TwoPointFour />
          <br />
          <br />
        </Tab>
        <Tab eventKey="5.8" title="Cota 5.8 GHz">
          <FivePointEight />
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
