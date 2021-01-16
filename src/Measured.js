import "./App.css";
import React, { useState } from "react";
import InputGroup from "react-bootstrap/InputGroup";
import ListGroup from "react-bootstrap/ListGroup";
import FormControl from "react-bootstrap/FormControl";

function Measured() {
  const [userInput, setUserInput] = useState(30.0);

  const userInputW = (10 ** (userInput / 10) / 1000).toFixed(2);
  const calculatedW = (userInputW * 0.95 * (5.8 / 2.4) ** 2).toFixed(2);
  const calculatedDbm = (10 * Math.log10(calculatedW * 1000)).toFixed(2);

  const handleChange = (e) => {
    if (!isNaN(e.target.value) && e.target.value != 0) {
      setUserInput(e.target.value);
    }
  };

  return (
    <div>
      <div className="row">
        <div
          className="col"
          style={{
            maxWidth: "700px",
            padding: "50px",
            marginLeft: "60px",
          }}
        >
          <h5>
            Enter measured Received RF Power for 2.4 GHz Cota system (Venus or
            Orion)
          </h5>
          <InputGroup
            style={{
              maxWidth: "200px",
              marginLeft: "auto",
              marginRight: "auto",
            }}
            className="mb-3"
          >
            <FormControl
              placeholder="User Entered"
              aria-label="rfPower"
              id="rfPower"
              aria-describedby="basic-addon1"
              defaultValue="30.0"
              onChange={handleChange}
            />
            <InputGroup.Append>
              <InputGroup.Text id="basic-addon1">dBm</InputGroup.Text>
            </InputGroup.Append>
          </InputGroup>
          <br />
          <h2>↓</h2>
          <br />
          <h5>
            Resulting expected Received RF Power for 5.8 GHz Cota system (Mars)
          </h5>
          <h3>{calculatedDbm} dBm</h3>
          <label>Estimated</label>
        </div>
        <div
          className="col"
          style={{
            maxWidth: "600px",
            padding: "50px",
            marginTop: "10px",
          }}
        >
          <br />
          <br />

          <h3>
            {" "}
            =<span style={{ color: "white" }}>____________</span>
            {userInputW} Watts
          </h3>
          <label style={{ marginLeft: "180px" }}>Calculated</label>
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <h3>
            {" "}
            =<span style={{ color: "white" }}>____________</span>
            {calculatedW} Watts
          </h3>
          <label style={{ marginLeft: "180px" }}>Estimated</label>
        </div>
      </div>
      <div style={{ marginLeft: "35%" }} className="row">
        <h5 style={{ marginRight: "10px", marginTop: "20px" }}>Assumptions:</h5>
        <ul>
          <li style={{ textAlign: "left" }}>Same transmitter size</li>
          <li style={{ textAlign: "left" }}>Same receiver antenna size</li>
          <li style={{ textAlign: "left" }}>Same overall transmit power</li>
        </ul>
      </div>
    </div>
  );
}

export default Measured;
