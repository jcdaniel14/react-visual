import React, { Component } from "react";
import Cards from './Cards.js';
import {styled} from "@mui/material/styles";
import Button from "@mui/material/Button";
import Graph from "./Graph.js";
const HOST = "http://localhost";

class Prediction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      ts: []
    };
  }

  render() {
    const Btn = styled(Button)({
      backgroundColor: "#001e3c",
      fontFamily: "Quicksand, Roboto",
      textTransform: "none",
      borderColor: "#001e3c",
      fontWeight: "bold"
    });

    const predictModel = () => {
      this.setState({ loadingModel: !this.state.loadingModel });
      fetch(`${HOST}/api/getPredictedTS`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ option: "show" }),
      })
        .then((res) => res.json())
        .then((data) => { this.setState({ts: data.ts}); });
    };

    return (
      <div className="pred-container">
        <div style={{display:"flex", alignItems: "center"}}>
          <Cards/>
          <Btn variant="contained" className={`${this.state.loading ? "card-btn-disabled" : "card-btn"}`} onClick={predictModel}
               disabled={this.state.loading}>
            Pronosticar
          </Btn>
        </div>

        <div style={{marginTop:"1rem", display:"flex"}}>
          <Graph ts={this.state.ts}/>
        </div>
      </div>
    );
  }
}
export default Prediction;