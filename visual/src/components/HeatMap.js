import { Component } from "react";
import Plot from "react-plotly.js";
const HOST = "http://localhost";

class Graph extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      layout: {
        title:{
          text: "Correlacion entre variables",
          font:{
            family: "Quicksand Bold"
          }
        },
        autosize: true,
        width: 800,
        height: 400,
        margin: {
          l: 100,
          r: 100,
          b: 50,
          t: 25,
          pad: 1,
        },
        paper_bgcolor: "#f6f8fa",
        font: { family: "Quicksand" },
        showlegend: true,
        annotations: []
        // legend: { orientation: "h" },
      }
    };
  }

  setAnnotations(data){
    console.log("Anotated");
  }

  componentDidMount() {
    const setAnnotations = (xval, yval, zval)=>{
      let myLayout = {...this.state.layout}
      for ( var i = 0; i < yval.length; i++ ) {
        for ( var j = 0; j < xval.length; j++ ) {
          let textColor = "black"
          let currentValue = zval[i][j];
          if (currentValue > 0.0)
            textColor = 'white';
          
          let result = {
            xref: 'x1',
            yref: 'y1',
            x: xval[j],
            y: yval[i],
            text: zval[i][j].toFixed(2),
            font: {
              family: 'Arial',
              size: 12,
              color: textColor
            },
            showarrow: false,
          };
          myLayout.annotations.push(result);
        }
      }

      this.setState({layout: myLayout});
    };
    
    fetch(`${HOST}/api/getHeatMap`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ show: true }),
    })
    .then((res) => res.json())
    .then((data) => {
      this.setState({
        data: [{z:data.z, x:data.x, y:data.y, type:"heatmap", hoverongaps:false, colorscale: 'YlGnBu', reversescale:true}]
      }, setAnnotations(data.x, data.y, data.z))
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

export default Graph;
