import { Component } from "react";
import Plot from "react-plotly.js";

class Graph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      month: 1
    };
  }

  render() {
    return (
      <Plot
        data={this.props.data}
        layout={this.props.layout}
        config={{scrollZoom: true}}
      />
    );
  }
}

export default Graph;
