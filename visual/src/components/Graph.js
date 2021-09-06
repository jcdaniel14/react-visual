import { Component } from "react";
import Plotly from "plotly.js-basic-dist";
import createPlotlyComponent from "react-plotly.js/factory";
const Plot = createPlotlyComponent(Plotly);

class Graph extends Component {
  render() {
    const ts = this.props.ts;
    return (
      <Plot
        className="vis-plot"
        data={ts.data}
        layout={ts.layout}
        config={ts.config}
      />
    );
  }
}

export default Graph;
