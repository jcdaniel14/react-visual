import React, { Component } from "react";
import Carousel from "react-elastic-carousel";
import HeatMap from "./Heatmap.js";
const HOST = "http://localhost";

class Prediction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  render() {
    return (
        <Carousel>
            <HeatMap/>
            <div> Item 2</div>
            <div> Item 3</div>
        </Carousel>
    );
  }
}
export default Prediction;
