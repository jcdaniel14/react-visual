import { Component } from "react";
import Plot from "react-plotly.js";
import MenuItem from "@mui/material/MenuItem"
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
const HOST = "http://localhost";

class Facets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      month: 1,
      data: [],
      payload: {},
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
        showlegend: true,
      }
    };
  }

  componentDidMount() {
    fetch(`${HOST}/api/getFacets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ show: true }),
    })
      .then((res) => res.json())
      .then((data) => {
        this.setState({ payload: data.msg}, ()=>{this.setState({data: this.state.payload[this.state.month]})})
      });
  }

  render() {
    const handleChange = (e) => {
      this.setState({month: e.target.value});
      this.setState({data: this.state.payload[e.target.value]});
    }

    return (
      <div style={{display: "flex"}}>
        <Plot
          data={this.state.data}
          layout={this.state.layout}
        />
        <Box sx={{ minWidth: 120, margin: "1rem 0 0 2rem"}}>
          <FormControl fullWidth>

            <InputLabel id={"month-l"}>Mes</InputLabel>
            <Select
              value={this.state.month}
              onChange={handleChange}
              label={"Mes"}
              id={"month-l"}
            >
              <MenuItem value={1}>Enero</MenuItem>
              <MenuItem value={2}>Febrero</MenuItem>
              <MenuItem value={3}>Marzo</MenuItem>
              <MenuItem value={4}>Abril</MenuItem>
              <MenuItem value={5}>Mayo</MenuItem>
              <MenuItem value={6}>Junio</MenuItem>
              <MenuItem value={7}>Julio</MenuItem>
              <MenuItem value={8}>Agosto</MenuItem>
              <MenuItem value={9}>Septiembre</MenuItem>
              <MenuItem value={10}>Octubre</MenuItem>
              <MenuItem value={11}>Noviembre</MenuItem>
              <MenuItem value={12}>Diciembre</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </div>

    );
  }
}

export default Facets;
