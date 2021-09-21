import "./App.css";
import { Component } from "react";
// import {useState, useEffect} from 'react';
import Header from "./components/Header";
import Cards from "./components/Cards";
import Opts from "./components/Opts";
import Graph from "./components/Graph";
import VisHeader from "./components/VisHeader";

const HOST = "http://localhost";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      mean: 0,
      max: 0,

      ts: [],
      ts1: [],
      ts2: [],
      ts3: [],
      ts4: [],
      ts5: [],
      ts6: [],
      options: [
        { value: "1", label: "Energía activa" },
        { value: "2", label: "Energía activa sin factor" },
        { value: "3", label: "Energía reactiva" },
        { value: "4", label: "Energía reactiva sin factor" },
        { value: "5", label: "Demanda activa" },
        { value: "6", label: "Demanda reactiva" },
      ],
      datepick: [
        { value: "hour", label: "Por hora" },
        { value: "day", label: "Por dia" },
        { value: "month", label: "Por mes" },
      ],
      loadingModel: false,
      grouper: "hour",
      selectedChart: "1",
    };
  }

  componentDidMount() {
    fetch(`${HOST}/api/getTimeSeries`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ grouper: this.state.grouper }),
    })
      .then((res) => res.json())
      .then((data) =>
        this.setState({
          count: data.count,
          max: data.max,
          mean: data.mean,
          ts: data.ts,
          ts1: data.ts,
          ts2: data.ts2,
          ts3: data.ts3,
          ts4: data.ts4,
          ts5: data.ts5,
          ts6: data.ts6,
        })
      );
  }

  render() {
    const ts = this.state.ts;
    const meta = {
      active: this.state.count,
      mean: this.state.mean,
      max: this.state.max,
    };
    const datepick = this.state.datepick;
    const loadingModel = this.state.loadingModel;

    const onChangeDatePick = (e) => {
      console.log(`datepicked: ${e.value}`);
      this.setState({ grouper: e.value });
    };

    const onClickModel = (e) => {
      this.setState({ loadingModel: !this.state.loadingModel });
      fetch(`${HOST}/api/getTimeSeries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ grouper: this.state.grouper }),
      })
        .then((res) => res.json())
        .then((data) => {
          this.setState(
            {
              count: data.count,
              max: data.max,
              mean: data.mean,
              ts1: data.ts,
              ts2: data.ts2,
              ts3: data.ts3,
              ts4: data.ts4,
              ts5: data.ts5,
              ts6: data.ts6,
            },
            () => {
              this.setState(
                { loadingModel: !this.state.loadingModel },
                updateChart
              );
            }
          );
        });
    };

    const updateChart = () => {
      console.log(`Updating chart to ${this.state.selectedChart}`);
      if (this.state.selectedChart === "1")
        this.setState({ ts: this.state.ts1 });
      else if (this.state.selectedChart === "2")
        this.setState({ ts: this.state.ts2 });
      else if (this.state.selectedChart === "3")
        this.setState({ ts: this.state.ts3 });
      else if (this.state.selectedChart === "4")
        this.setState({ ts: this.state.ts4 });
      else if (this.state.selectedChart === "5")
        this.setState({ ts: this.state.ts5 });
      else this.setState({ ts: this.state.ts6 });
    };

    const onChange = (e) => {
      this.setState({ selectedChart: e.value }, updateChart);
    };

    return (
      <div className="container">
        <Header></Header>
        <Cards meta={meta}></Cards>
        <Opts
          datepick={datepick}
          onChangeDatePick={onChangeDatePick}
          onClickModel={onClickModel}
          loading={loadingModel}
        ></Opts>
        <div className="graph-container">
          <div className="vis">
            <VisHeader
              options={this.state.options}
              onChange={onChange}
            ></VisHeader>
            <Graph ts={ts}></Graph>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
