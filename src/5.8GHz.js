import "./App.css";
import React, { useState, useEffect } from "react";
import "../node_modules/react-vis/dist/style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import {
  XYPlot,
  LineSeries,
  VerticalGridLines,
  HorizontalGridLines,
  ChartLabel,
  XAxis,
  YAxis,
} from "react-vis";

function FivePointEight() {
  /* TX State Variables */
  const [frequency, setFrequency] = useState(5.845);
  const [period, setPeriod] = useState(171.086398);
  const [txWidth, setTxWidth] = useState(0.6);
  const [txHeight, setTxHeight] = useState(0.6);
  const [txAntEff, setTxAntEff] = useState(0.85);
  const [paEfficiency, setPaEfficiency] = useState(0.6);
  const [asicPout, setAsicPout] = useState(15.0);
  const [filterLoss, setFilterLoss] = useState(1.5);
  //const [txAntPorts, setTxAntPorts] = useState(256);

  /* RX State Variables */
  const [rxWidth, setRxWidth] = useState(0.05);
  const [rxHeight, setRxHeight] = useState(0.5);
  const [rxAntEff, setRxAntEff] = useState(0.8);
  const [beaconPout, setBeaconPout] = useState(-12.0);
  const [condLoss, setCondLoss] = useState(2.0);

  const meters = [2.0, 2.25, 2.5, 2.75, 3.0, 4.0, 5.0];

  const wavelength = 300000000 / (frequency * 10 ** 9);
  const txAntPorts =
    2 *
    (txWidth / (wavelength / 2)).toFixed(0) *
    (txHeight / (wavelength / 2)).toFixed(0);
  const txAntGain =
    10 *
    Math.log10(
      (4 * Math.PI * ((txWidth * txHeight) / (txAntPorts / 2)) * txAntEff) /
        wavelength ** 2
    );
  const txGain =
    10 *
    Math.log10(
      (4 * Math.PI * (txWidth * txHeight) * txAntEff) / wavelength ** 2
    );
  const pCond = asicPout - filterLoss;

  const txCondDbm =
    10 * Math.log10((10 ** (pCond / 10) / 1000) * txAntPorts) + 30;
  const txCondW = 10 ** (txCondDbm / 10) / 1000;
  const txRadW = txCondW * txAntEff;
  const txRadDbm = 10 * Math.log10(txRadW) + 30;
  const txEirp = txGain + txCondDbm;

  const rxGain =
    10 *
    Math.log10(
      (4 * Math.PI * (rxWidth * rxHeight) * rxAntEff) / wavelength ** 2
    );
  const rxHpbw = Math.sqrt(
    32400 / ((4 * Math.PI * (rxWidth * rxHeight) * rxAntEff) / wavelength ** 2)
  );
  const beaconPcond = beaconPout - condLoss;
  const rxEirp = rxGain + beaconPcond;

  const Table = (props) => {
    const meters = props.meters;

    const tableItems = meters.map((number) => (
      <tr key={number.toString()}>
        <td>{number.toFixed(2)}</td>
        <td>{(number / 0.3048).toFixed(2)}</td>
        <td>
          {(
            20 * Math.log10(number) +
            20 * Math.log10(frequency * 10 ** 9) -
            147.55
          ).toFixed(1)}
        </td>
        <td>
          {(
            beaconPcond +
            rxGain +
            txAntGain -
            (20 * Math.log10(number) +
              20 * Math.log10(frequency * 10 ** 9) -
              147.55)
          ).toFixed(1)}
        </td>
        <td>
          {(txCondDbm +
            txGain +
            rxGain -
            (20 * Math.log10(number) +
              20 * Math.log10(frequency * 10 ** 9) -
              147.55) >
          txRadDbm
            ? txRadDbm
            : txCondDbm +
              txGain +
              rxGain -
              (20 * Math.log10(number) +
                20 * Math.log10(frequency * 10 ** 9) -
                147.55)
          ).toFixed(1)}
        </td>
        <td>
          {(
            10 **
            (((txCondDbm +
              txGain +
              rxGain -
              (20 * Math.log10(number) +
                20 * Math.log10(frequency * 10 ** 9) -
                147.55) >
            txRadDbm
              ? txRadDbm
              : txCondDbm +
                txGain +
                rxGain -
                (20 * Math.log10(number) +
                  20 * Math.log10(frequency * 10 ** 9) -
                  147.55)) -
              30) /
              10)
          ).toFixed(1)}
        </td>
        <td>
          {(
            10 **
              (((txCondDbm +
                txGain +
                rxGain -
                (20 * Math.log10(number) +
                  20 * Math.log10(frequency * 10 ** 9) -
                  147.55) >
              txRadDbm
                ? txRadDbm
                : txCondDbm +
                  txGain +
                  rxGain -
                  (20 * Math.log10(number) +
                    20 * Math.log10(frequency * 10 ** 9) -
                    147.55)) -
                30) /
                10) /
            txRadW
          ).toFixed(2)}
        </td>
        <td>0.65</td>
        <td>
          {(
            10 **
              (((txCondDbm +
                txGain +
                rxGain -
                (20 * Math.log10(number) +
                  20 * Math.log10(frequency * 10 ** 9) -
                  147.55) >
              txRadDbm
                ? txRadDbm
                : txCondDbm +
                  txGain +
                  rxGain -
                  (20 * Math.log10(number) +
                    20 * Math.log10(frequency * 10 ** 9) -
                    147.55)) -
                30) /
                10) *
            0.65
          ).toFixed(1)}
        </td>
      </tr>
    ));

    return (
      <table>
        <tr>
          <th colspan="2">Distance</th>
          <th rowspan="2">FSPL (dB)</th>
          <th>Beacon Prx</th>
          <th colspan="2">Power Prx</th>
          <th rowspan="2">RF-RF Efficiency</th>
          <th rowspan="2">Rect. Efficiency</th>
          <th>
            <span style={{ color: "white" }}>_</span>P
            <span style={{ color: "white" }}>_</span>DC
            <span style={{ color: "white" }}>_</span>
          </th>
        </tr>
        <tr>
          <th>Meters</th>
          <th>Feet</th>
          <th>dBm</th>
          <th>dBm</th>
          <th>
            <span style={{ color: "white" }}>_</span>W
            <span style={{ color: "white" }}>_</span>
          </th>
          <th>W</th>
        </tr>
        {tableItems}
      </table>
    );
  };

  const Graph = (props) => {
    const graphData = [
      {
        x: 2.0,
        y:
          10 **
          (((txCondDbm +
            txGain +
            rxGain -
            (20 * Math.log10(2.0) +
              20 * Math.log10(frequency * 10 ** 9) -
              147.55) >
          txRadDbm
            ? txRadDbm
            : txCondDbm +
              txGain +
              rxGain -
              (20 * Math.log10(2.0) +
                20 * Math.log10(frequency * 10 ** 9) -
                147.55)) -
            30) /
            10),
      },
      {
        x: 2.25,
        y:
          10 **
          (((txCondDbm +
            txGain +
            rxGain -
            (20 * Math.log10(2.25) +
              20 * Math.log10(frequency * 10 ** 9) -
              147.55) >
          txRadDbm
            ? txRadDbm
            : txCondDbm +
              txGain +
              rxGain -
              (20 * Math.log10(2.25) +
                20 * Math.log10(frequency * 10 ** 9) -
                147.55)) -
            30) /
            10),
      },
      {
        x: 2.5,
        y:
          10 **
          (((txCondDbm +
            txGain +
            rxGain -
            (20 * Math.log10(2.5) +
              20 * Math.log10(frequency * 10 ** 9) -
              147.55) >
          txRadDbm
            ? txRadDbm
            : txCondDbm +
              txGain +
              rxGain -
              (20 * Math.log10(2.5) +
                20 * Math.log10(frequency * 10 ** 9) -
                147.55)) -
            30) /
            10),
      },
      {
        x: 2.75,
        y:
          10 **
          (((txCondDbm +
            txGain +
            rxGain -
            (20 * Math.log10(2.75) +
              20 * Math.log10(frequency * 10 ** 9) -
              147.55) >
          txRadDbm
            ? txRadDbm
            : txCondDbm +
              txGain +
              rxGain -
              (20 * Math.log10(2.75) +
                20 * Math.log10(frequency * 10 ** 9) -
                147.55)) -
            30) /
            10),
      },
      {
        x: 3.0,
        y:
          10 **
          (((txCondDbm +
            txGain +
            rxGain -
            (20 * Math.log10(3.0) +
              20 * Math.log10(frequency * 10 ** 9) -
              147.55) >
          txRadDbm
            ? txRadDbm
            : txCondDbm +
              txGain +
              rxGain -
              (20 * Math.log10(3.0) +
                20 * Math.log10(frequency * 10 ** 9) -
                147.55)) -
            30) /
            10),
      },
      {
        x: 4.0,
        y:
          10 **
          (((txCondDbm +
            txGain +
            rxGain -
            (20 * Math.log10(4.0) +
              20 * Math.log10(frequency * 10 ** 9) -
              147.55) >
          txRadDbm
            ? txRadDbm
            : txCondDbm +
              txGain +
              rxGain -
              (20 * Math.log10(4.0) +
                20 * Math.log10(frequency * 10 ** 9) -
                147.55)) -
            30) /
            10),
      },
      {
        x: 5.0,
        y:
          10 **
          (((txCondDbm +
            txGain +
            rxGain -
            (20 * Math.log10(5.0) +
              20 * Math.log10(frequency * 10 ** 9) -
              147.55) >
          txRadDbm
            ? txRadDbm
            : txCondDbm +
              txGain +
              rxGain -
              (20 * Math.log10(5.0) +
                20 * Math.log10(frequency * 10 ** 9) -
                147.55)) -
            30) /
            10),
      },
    ];

    const twoPointFourData = [{ x: 2.0 }];
    return (
      <XYPlot height={300} width={500} color="black">
        <VerticalGridLines color="black" style={{ color: "black" }} />
        <HorizontalGridLines />
        <XAxis />
        <YAxis />
        <ChartLabel
          text="Distance (m)"
          className="alt-x-label"
          includeMargin={false}
          xPercent={0.025}
          yPercent={1.01}
        />

        <ChartLabel
          text="Power RF Received (W)"
          className="alt-y-label"
          includeMargin={false}
          xPercent={0.03}
          yPercent={0.3}
          style={{
            transform: "rotate(-90)",
            textAnchor: "end",
          }}
        />
        <LineSeries animation data={graphData} />
      </XYPlot>
    );
  };

  const handleTxWidth = (e) => {
    if (!isNaN(e.target.value) && e.target.value != 0) {
      setTxWidth(e.target.value);
    }
  };
  const handleTxHeight = (e) => {
    if (!isNaN(e.target.value) && e.target.value != 0) {
      setTxHeight(e.target.value);
    }
  };
  const handleRxWidth = (e) => {
    if (!isNaN(e.target.value) && e.target.value != 0) {
      setRxWidth(e.target.value);
    }
  };
  const handleRxHeight = (e) => {
    if (!isNaN(e.target.value) && e.target.value != 0) {
      setRxHeight(e.target.value);
    }
  };

  return (
    <div className="row">
      <div className="col" style={{ padding: "50px", marginLeft: "15%" }}>
        <h4 style={{ float: "left" }}>Transmit</h4>
        <br />
        <br />
        <InputGroup style={{ maxWidth: "250px" }} className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text id="inputGroup-sizing-default">
              <b>TX Width</b>
            </InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            aria-label="TX-Width"
            aria-describedby="inputGroup-sizing-default"
            defaultValue="0.6"
            onChange={handleTxWidth}
          />
          <InputGroup.Append>
            <InputGroup.Text id="inputGroup-sizing-default">m</InputGroup.Text>
          </InputGroup.Append>
        </InputGroup>
        <br />
        <InputGroup style={{ maxWidth: "250px" }} className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text id="inputGroup-sizing-default">
              <b>TX Height</b>
            </InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            aria-label="TX-Height"
            aria-describedby="inputGroup-sizing-default"
            defaultValue="0.6"
            onChange={handleTxHeight}
          />
          <InputGroup.Append>
            <InputGroup.Text id="inputGroup-sizing-default">m</InputGroup.Text>
          </InputGroup.Append>
        </InputGroup>
        <br />
        <br />
        <h4 style={{ float: "left" }}>Receive</h4>
        <br />
        <br />
        <InputGroup style={{ maxWidth: "250px" }} className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text id="inputGroup-sizing-default">
              <b>RX Width</b>
            </InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            aria-label="RX-Width"
            aria-describedby="inputGroup-sizing-default"
            defaultValue="0.05"
            onChange={handleRxWidth}
          />
          <InputGroup.Append>
            <InputGroup.Text id="inputGroup-sizing-default">m</InputGroup.Text>
          </InputGroup.Append>
        </InputGroup>
        <br />
        <InputGroup style={{ maxWidth: "250px" }} className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text id="inputGroup-sizing-default">
              <b>RX Height</b>
            </InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            aria-label="RX-Height"
            aria-describedby="inputGroup-sizing-default"
            defaultValue="0.5"
            onChange={handleRxHeight}
          />
          <InputGroup.Append>
            <InputGroup.Text id="inputGroup-sizing-default">m</InputGroup.Text>
          </InputGroup.Append>
        </InputGroup>
      </div>
      <div className="col" style={{ padding: "60px", marginRight: "15%" }}>
        <Table meters={meters}></Table>
        <br />
        <br />
        <h3 className="title">RF Power over Distance</h3>
        <Graph />
      </div>
    </div>
  );
}

export default FivePointEight;
