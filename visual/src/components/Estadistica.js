import React, { Component } from "react";
import Carousel from "react-elastic-carousel";
import HeatMap from "./HeatMap.js";
import BoxPlot from "./BoxPlot.js";
import Facets from "./Facets.js";
import Graph from "./Graph.js";
const HOST = "http://localhost";

class Estadistica extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      layout: {
        yaxis: {
          title: "Energia activa",
          autorange: true,
          fixedrange: true,
        },
        title:{
          text: "Energía activa (Línea base)",
          font:{
            family: "Quicksand Bold"
          }
        },
        xaxis: {
          title: "Fecha",
          autorange: true
        },
        width: 1280,
        height: 500,
        margin: {
          l: 50,
          r: 50,
          b: 50,
          t: 25,
          pad: 1,
        },
        paper_bgcolor: "#f6f8fa",
        plot_bgcolor: "#f6f8fa",
        font: { family: "Quicksand" },
        showlegend: true,
      },
    };
  }

  getRawEE() {
    fetch(`${HOST}/api/getRawEE`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ show: true }),
    })
      .then((res) => res.json())
      .then((data) =>
        this.setState({
          data: data.msg
        })
      );
  }

  componentDidMount() {
    this.getRawEE();
  }

  render() {
    return (
        <Carousel>
            <BoxPlot name={"EE"} title={"Boxplot de Energia Activa"}/>
            <BoxPlot name={"T"} title={"Boxplot de Temperatura °C"}/>
            <BoxPlot name={"HR"} title={"Humedad relativa"}/>
            <BoxPlot name={"V"} title={"Direccion del viento"}/>
            <HeatMap title={"Correlacion entre variables"}/>
            <Facets title={"Energia Activa Promedio por Año"}/>
            <Graph data={this.state.data} layout={this.state.layout}/>
        </Carousel>
    );
  }
}
export default Estadistica;
