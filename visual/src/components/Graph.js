import { Component } from "react";
import Plot from "react-plotly.js";

class Graph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      month: 1,
      layout: {
        yaxis: {
          title: "Energia activa",
          fixedrange: true
        },
        title:{
          text: this.props.title,
          font:{
            family: "Quicksand Bold"
          }
        },
        xaxis: {
          title: "Fecha"
        },
        width: 1280,
        height: 600,
        margin: {
          l: 100,
          r: 100,
          b: 50,
          t: 25,
          pad: 1,
        },
        paper_bgcolor: "#f6f8fa",
        plot_bgcolor: "#f6f8fa",
        font: { family: "Quicksand" },
        showlegend: true,
      }
    };
  }

  render() {
    return (
      <Plot
        data={this.props.data}
        layout={this.state.layout}
        config={{scrollZoom: true}}
      />
    );
  }
}

export default Graph;
