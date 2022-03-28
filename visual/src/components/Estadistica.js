import React, { Component } from "react";
import Carousel from "react-elastic-carousel";
import HeatMap from "./HeatMap.js";
import BoxPlot from "./BoxPlot.js";
import Facets from "./Facets.js";

class Estadistica extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    };
  }

  render() {
    return (
        <Carousel>
            <BoxPlot name={"EE"} title={"Boxplot de Energia Activa"}/>
            <BoxPlot name={"T"} title={"Boxplot de Temperatura °C"}/>
            <HeatMap title={"Correlacion entre variables"}/>
            <Facets title={"Energia Activa Promedio por Año"}/>
        </Carousel>
    );
  }
}
export default Estadistica;
