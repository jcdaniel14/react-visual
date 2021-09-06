import "./App.css";
import { Component } from "react";
// import {useState, useEffect} from 'react';
import Header from "./components/Header";
import Cards from "./components/Cards";
import Graph from "./components/Graph";
import VisHeader from "./components/VisHeader";

// Data from API
// const fetchTS = async () => {
//   const res = await fetch();
//   const data = await res.json();
//   return data;
// }

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ts: [],
      ts1: [],
      ts2: [],
      ts3: [],
      options: [
        { value: "1", label: "Energía activa" },
        { value: "2", label: "Energía reactiva" },
        { value: "3", label: "Energía total" },
      ],
    };
  }

  componentDidMount() {
    fetch("http://localhost:80/api/getTimeSeries", { method: "POST" })
      .then((res) => res.json())
      .then((data) =>
        this.setState({
          ts: data.ts,
          ts1: data.ts,
          ts2: data.ts2,
          ts3: data.ts3,
        })
      );
  }

  render() {
    const ts = this.state.ts;
    const meta = { active: 278903, mean: 250, max: 1252 };

    const onChange = (e) => {
      if (e.value === "1") this.setState({ ts: this.state.ts1 });
      else if (e.value === "2") this.setState({ ts: this.state.ts2 });
      else this.setState({ ts: this.state.ts3 });
    };

    return (
      <div className="container">
        <Header></Header>
        <Cards meta={meta}></Cards>
        <div className="graph">
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
