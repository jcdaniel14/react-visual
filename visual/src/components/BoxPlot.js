import { Component } from "react";
import Plot from "react-plotly.js";
const HOST = "http://localhost";

class BoxPlot extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      type: this.props.name,
      layout: {
        yaxis: {
          title: this.props.title
        },
        title:{
          text: this.props.title,
          font:{
            family: "Quicksand Bold"
          }
        },
        xaxis: {
          title: "Meses"
        },
        width: 800,
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
        showlegend: false,
      }
    };
  }

  componentDidMount() {
    fetch(`${HOST}/api/getBoxPlot${this.state.type}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ show: true }),
    })
    .then((res) => res.json())
    .then((data) => {
      this.setState({ data: data.msg })
    });
  }

  render() {
    return (
      <Plot
        data={this.state.data}
        layout={this.state.layout}
      />
    );
  }
}

export default BoxPlot;
