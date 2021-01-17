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
  DiscreteColorLegend,
} from "react-vis";

function FivePointEight(props) {
  /* 5.8 TX State Variables */
  const [frequency, setFrequency] = useState(5.845);
  const [period, setPeriod] = useState(171.086398);
  const [txWidth, setTxWidth] = useState(0.6);
  const [txHeight, setTxHeight] = useState(0.6);
  const [txAntEff, setTxAntEff] = useState(0.85);
  const [paEfficiency, setPaEfficiency] = useState(0.6);
  const [asicPout, setAsicPout] = useState((15.0).toFixed(2));
  const [filterLoss, setFilterLoss] = useState(1.5);
  //const [txAntPorts, setTxAntPorts] = useState(256);

  /* 2.4 TX State Variables */
  const [frequencyTF, setFrequencyTF] = useState(2.45);
  const [periodTF, setPeriodTF] = useState(408.163265);
  // const [txWidthTF, setTxWidthTF] = useState(0.6);
  // const [txHeightTF, setTxHeightTF] = useState(0.6);
  const [txAntEffTF, setTxAntEffTF] = useState(0.85);
  const [paEfficiencyTF, setPaEfficiencyTF] = useState(0.6);
  const [asicPoutTF, setAsicPoutTF] = useState(20.0);
  const [filterLossTF, setFilterLossTF] = useState(1);
  const [txAntPortsTF, setTxAntPortsTF] = useState(256);

  /* 5.8 RX State Variables */
  const [rxWidth, setRxWidth] = useState(0.05);
  const [rxHeight, setRxHeight] = useState(0.5);
  const [rxAntEff, setRxAntEff] = useState(0.8);
  const [beaconPout, setBeaconPout] = useState((12.0 * -1).toFixed(2));
  const [condLoss, setCondLoss] = useState((2.0).toFixed(2));

  /* 2.4 RX State Variables */
  // const [rxWidthTF, setRxWidthTF] = useState(0.05);
  // const [rxHeightTF, setRxHeightTF] = useState(0.5);
  const [rxAntEffTF, setRxAntEffTF] = useState(0.8);
  const [beaconPoutTF, setBeaconPoutTF] = useState(-12.0);
  const [condLossTF, setCondLossTF] = useState(2.0);

  /* 5.8 TX Calculated Variables */
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

  /* 2.4 TX Calculated Variables */
  const wavelengthTF = 300000000 / (frequencyTF * 10 ** 9);
  const txAntGainTF =
    10 *
    Math.log10(
      (4 * Math.PI * ((txWidth * txHeight) / (txAntPortsTF / 2)) * txAntEffTF) /
        wavelengthTF ** 2
    );
  const txGainTF =
    10 *
    Math.log10(
      (4 * Math.PI * (txWidth * txHeight) * txAntEffTF) / wavelengthTF ** 2
    );
  const pCondTF = asicPoutTF - filterLossTF;
  const txCondDbmTF =
    10 * Math.log10((10 ** (pCondTF / 10) / 1000) * txAntPortsTF) + 30;
  const txCondWTF = 10 ** (txCondDbmTF / 10) / 1000;
  const txRadWTF = txCondWTF * txAntEffTF;
  const txRadDbmTF = 10 * Math.log10(txRadWTF) + 30;
  const txEirpTF = txGainTF + txCondDbmTF;

  /* 5.8 RX Calculated Variables*/
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

  /* 2.4 RX Calculated Variables*/
  const rxGainTF =
    10 *
    Math.log10(
      (4 * Math.PI * (rxWidth * rxHeight) * rxAntEffTF) / wavelengthTF ** 2
    );
  const rxHpbwTF = Math.sqrt(
    32400 /
      ((4 * Math.PI * (rxWidth * rxHeight) * rxAntEffTF) / wavelengthTF ** 2)
  );
  const beaconPcondTF = beaconPoutTF - condLossTF;
  const rxEirpTF = rxGainTF + beaconPcondTF;

  const meters = [2.0, 2.25, 2.5, 2.75, 3.0, 4.0, 5.0];

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

  const Graph = () => {
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

    const graphDataTF = [
      {
        x: 2.0,
        y:
          10 **
          (((txCondDbmTF +
            txGainTF +
            rxGainTF -
            (20 * Math.log10(2.0) +
              20 * Math.log10(frequencyTF * 10 ** 9) -
              147.55) >
          txRadDbmTF
            ? txRadDbmTF
            : txCondDbmTF +
              txGainTF +
              rxGainTF -
              (20 * Math.log10(2.0) +
                20 * Math.log10(frequencyTF * 10 ** 9) -
                147.55)) -
            30) /
            10),
      },
      {
        x: 2.25,
        y:
          10 **
          (((txCondDbmTF +
            txGainTF +
            rxGainTF -
            (20 * Math.log10(2.25) +
              20 * Math.log10(frequencyTF * 10 ** 9) -
              147.55) >
          txRadDbmTF
            ? txRadDbmTF
            : txCondDbmTF +
              txGainTF +
              rxGainTF -
              (20 * Math.log10(2.25) +
                20 * Math.log10(frequencyTF * 10 ** 9) -
                147.55)) -
            30) /
            10),
      },
      {
        x: 2.5,
        y:
          10 **
          (((txCondDbmTF +
            txGainTF +
            rxGainTF -
            (20 * Math.log10(2.5) +
              20 * Math.log10(frequencyTF * 10 ** 9) -
              147.55) >
          txRadDbmTF
            ? txRadDbmTF
            : txCondDbmTF +
              txGainTF +
              rxGainTF -
              (20 * Math.log10(2.5) +
                20 * Math.log10(frequencyTF * 10 ** 9) -
                147.55)) -
            30) /
            10),
      },
      {
        x: 2.75,
        y:
          10 **
          (((txCondDbmTF +
            txGainTF +
            rxGainTF -
            (20 * Math.log10(2.75) +
              20 * Math.log10(frequency * 10 ** 9) -
              147.55) >
          txRadDbmTF
            ? txRadDbmTF
            : txCondDbmTF +
              txGainTF +
              rxGainTF -
              (20 * Math.log10(2.75) +
                20 * Math.log10(frequencyTF * 10 ** 9) -
                147.55)) -
            30) /
            10),
      },
      {
        x: 3.0,
        y:
          10 **
          (((txCondDbmTF +
            txGainTF +
            rxGainTF -
            (20 * Math.log10(3.0) +
              20 * Math.log10(frequencyTF * 10 ** 9) -
              147.55) >
          txRadDbmTF
            ? txRadDbmTF
            : txCondDbmTF +
              txGainTF +
              rxGainTF -
              (20 * Math.log10(3.0) +
                20 * Math.log10(frequencyTF * 10 ** 9) -
                147.55)) -
            30) /
            10),
      },
      {
        x: 4.0,
        y:
          10 **
          (((txCondDbmTF +
            txGainTF +
            rxGainTF -
            (20 * Math.log10(4.0) +
              20 * Math.log10(frequencyTF * 10 ** 9) -
              147.55) >
          txRadDbmTF
            ? txRadDbmTF
            : txCondDbmTF +
              txGainTF +
              rxGainTF -
              (20 * Math.log10(4.0) +
                20 * Math.log10(frequencyTF * 10 ** 9) -
                147.55)) -
            30) /
            10),
      },
      {
        x: 5.0,
        y:
          10 **
          (((txCondDbmTF +
            txGainTF +
            rxGainTF -
            (20 * Math.log10(5.0) +
              20 * Math.log10(frequencyTF * 10 ** 9) -
              147.55) >
          txRadDbmTF
            ? txRadDbmTF
            : txCondDbmTF +
              txGainTF +
              rxGainTF -
              (20 * Math.log10(5.0) +
                20 * Math.log10(frequencyTF * 10 ** 9) -
                147.55)) -
            30) /
            10),
      },
    ];

    const ITEMS = ["Cota 5.8GHz", "Cota 2.4GHz"];
    const COLORS = ["#429198", "#912a2a"];

    return (
      <XYPlot height={300} width={500}>
        <DiscreteColorLegend
          style={{ marginLeft: "25%" }}
          orientation="horizontal"
          height={200}
          width={300}
          items={ITEMS}
          colors={COLORS}
        />
        <VerticalGridLines />
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
        <LineSeries animation data={graphData} color="#429198" />
        <LineSeries animation data={graphDataTF} color="#912a2a" />
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

  const handleTxAntEff = (e) => {
    if (!isNaN(e.target.value) && e.target.value != 0) {
      setTxAntEff(e.target.value);
    }
  };
  const handleAsicPout = (e) => {
    if (!isNaN(e.target.value) && e.target.value != 0) {
      setAsicPout(e.target.value);
    }
  };
  const handleFilterLoss = (e) => {
    if (!isNaN(e.target.value) && e.target.value != 0) {
      setFilterLoss(e.target.value);
    }
  };
  const handleRxAntEff = (e) => {
    if (!isNaN(e.target.value) && e.target.value != 0) {
      setRxAntEff(e.target.value);
    }
  };
  const handleBeaconPout = (e) => {
    if (!isNaN(e.target.value) && e.target.value != 0) {
      setBeaconPout(e.target.value);
    }
  };
  const handleCondLoss = (e) => {
    if (!isNaN(e.target.value) && e.target.value != 0) {
      setCondLoss(e.target.value);
    }
  };

  return (
    <div className="row">
      <div className="col" style={{ padding: "50px", marginLeft: "10%" }}>
        <h4 style={{ float: "left" }}>Transmit</h4>
        <br />
        <br />
        <InputGroup style={{ maxWidth: "280px" }} className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text id="inputGroup-sizing-default">
              <b>TX Width</b>
            </InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            aria-label="TX-Width"
            aria-describedby="inputGroup-sizing-default"
            defaultValue={txWidth}
            onChange={handleTxWidth}
          />
          <InputGroup.Append>
            <InputGroup.Text id="inputGroup-sizing-default">m</InputGroup.Text>
          </InputGroup.Append>
        </InputGroup>
        <br />
        <InputGroup style={{ maxWidth: "280px" }} className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text id="inputGroup-sizing-default">
              <b>TX Height</b>
            </InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            aria-label="TX-Height"
            aria-describedby="inputGroup-sizing-default"
            defaultValue={txHeight}
            onChange={handleTxHeight}
          />
          <InputGroup.Append>
            <InputGroup.Text id="inputGroup-sizing-default">m</InputGroup.Text>
          </InputGroup.Append>
        </InputGroup>
        {props.adminMode ? (
          <div>
            <br />
            <InputGroup
              className="param"
              style={{ maxWidth: "280px" }}
              className="mb-3"
            >
              <InputGroup.Prepend>
                <InputGroup.Text id="inputGroup-sizing-default">
                  <b>TX Ant. Eff.</b>
                </InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                aria-label="TX-Ant-Eff"
                aria-describedby="inputGroup-sizing-default"
                defaultValue={txAntEff}
                onChange={handleTxAntEff}
              />
            </InputGroup>

            <br />
            <InputGroup style={{ maxWidth: "280px" }} className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text id="inputGroup-sizing-default">
                  <b>ASIC Pout</b>
                </InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                aria-label="ASIC-Pout"
                aria-describedby="inputGroup-sizing-default"
                defaultValue={asicPout}
                onChange={handleAsicPout}
              />
              <InputGroup.Append>
                <InputGroup.Text id="inputGroup-sizing-default">
                  dBm
                </InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
            <br />
            <InputGroup style={{ maxWidth: "280px" }} className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text id="inputGroup-sizing-default">
                  <b>Filter Loss</b>
                </InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                aria-label="Filter-Loss"
                aria-describedby="inputGroup-sizing-default"
                defaultValue={filterLoss}
                onChange={handleFilterLoss}
              />
              <InputGroup.Append>
                <InputGroup.Text id="inputGroup-sizing-default">
                  dB
                </InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
            <br />
          </div>
        ) : (
          <div></div>
        )}

        <br />
        <br />
        <h4 style={{ float: "left" }}>Receive</h4>
        <br />
        <br />
        <InputGroup style={{ maxWidth: "280px" }} className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text id="inputGroup-sizing-default">
              <b>RX Width</b>
            </InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            aria-label="RX-Width"
            aria-describedby="inputGroup-sizing-default"
            defaultValue={rxWidth}
            onChange={handleRxWidth}
          />
          <InputGroup.Append>
            <InputGroup.Text id="inputGroup-sizing-default">m</InputGroup.Text>
          </InputGroup.Append>
        </InputGroup>
        <br />
        <InputGroup style={{ maxWidth: "280px" }} className="mb-3">
          <InputGroup.Prepend>
            <InputGroup.Text id="inputGroup-sizing-default">
              <b>RX Height</b>
            </InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            aria-label="RX-Height"
            aria-describedby="inputGroup-sizing-default"
            defaultValue={rxHeight}
            onChange={handleRxHeight}
          />
          <InputGroup.Append>
            <InputGroup.Text id="inputGroup-sizing-default">m</InputGroup.Text>
          </InputGroup.Append>
        </InputGroup>
        {props.adminMode ? (
          <div>
            {" "}
            <br />
            <InputGroup style={{ maxWidth: "280px" }} className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text id="inputGroup-sizing-default">
                  <b>RX Ant. Eff.</b>
                </InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                aria-label="RX-Ant-Eff"
                aria-describedby="inputGroup-sizing-default"
                defaultValue={rxAntEff}
                onChange={handleRxAntEff}
              />
            </InputGroup>
            <br />
            <InputGroup style={{ maxWidth: "280px" }} className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text id="inputGroup-sizing-default">
                  <b>Beacon Pout</b>
                </InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                aria-label="Beacon-Pout"
                aria-describedby="inputGroup-sizing-default"
                defaultValue={beaconPout}
                onChange={handleBeaconPout}
              />
              <InputGroup.Append>
                <InputGroup.Text id="inputGroup-sizing-default">
                  dBm
                </InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
            <br />
            <InputGroup style={{ maxWidth: "280px" }} className="mb-3">
              <InputGroup.Prepend>
                <InputGroup.Text id="inputGroup-sizing-default">
                  <b>Cond. Loss</b>
                </InputGroup.Text>
              </InputGroup.Prepend>
              <FormControl
                aria-label="Cond-Loss"
                aria-describedby="inputGroup-sizing-default"
                defaultValue={condLoss}
                onChange={handleCondLoss}
                key="1"
              />
              <InputGroup.Append>
                <InputGroup.Text id="inputGroup-sizing-default">
                  dB
                </InputGroup.Text>
              </InputGroup.Append>
            </InputGroup>
            <br />
          </div>
        ) : (
          <div></div>
        )}
      </div>
      <div className="col" style={{ padding: "60px", marginRight: "10%" }}>
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
