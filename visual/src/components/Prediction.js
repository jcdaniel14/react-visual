import React, { Component } from "react";
import Cards from "./Cards.js";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Graph from "./Graph.js";
import Error from "./Error.js";
import { CircularProgress } from "@mui/material";
const HOST = "http://localhost";

class Prediction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      layout: {},
      defaultLayout: {
        yaxis: {
          title: "Energia activa",
          autorange: true,
          fixedrange: true,
        },
        title:{
          text: this.props.title,
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

      error: false,
      errMsg: "",
      dataset: "Default",
      count: this.props.count,
      mean: this.props.mean,
      max: this.props.max,
      loading: false,
      uploading: false,
    };
  }
  getFileStatus(filename) {
    fetch(`${HOST}/api/getFileStatus`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: filename }),
    })
      .then((res) => res.json())
      .then((data) =>
        this.setState({
          count: data.count,
          max: data.max,
          mean: data.mean,
        })
      );
  }
  componentDidMount() {
    this.getFileStatus();
  }

  render() {
    const Btn = styled(Button)({
      backgroundColor: "#001e3c",
      fontFamily: "Quicksand, Roboto",
      textTransform: "none",
      borderColor: "#001e3c",
      fontWeight: "bold",
      "&:hover": {
        backgroundColor: "#003263",
      },
    });
    const BtnG = styled(Button)({
      backgroundColor: "#004225",
      fontFamily: "Quicksand, Roboto",
      textTransform: "none",
      borderColor: "#001e3c",
      fontWeight: "bold",
      "&:hover": {
        backgroundColor: "#00693b",
      },
    });
    const Input = styled("input")({
      display: "none",
    });

    const uploadDataset = (e) => {
      console.log("Uploading...");
      this.setState({ uploading: true });
      const formData = new FormData();
      console.log(e.target.files[0]);
      formData.append("dataset", e.target.files[0]);
      fetch(`${HOST}/api/uploadDataset`, {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((result) => {
          console.log(result.msg);
          if (result.status === "ok") {
            this.getFileStatus("dataset_prueba.csv");
            this.setState({ dataset: "Uploaded" });
          } else {
            this.setState({ error: true , errMsg: result.msg});
          }

          this.setState({ uploading: false });
        })
        .catch((err) => {
          console.log(err);
          
          this.setState({ loading: false });
          this.setState({ uploading: false });
        });
    };

    const predictModel = () => {
      this.setState({ loading: true, data: []});
      fetch(`${HOST}/api/getPrediction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uploaded: this.state.dataset === "Uploaded" }),
      })
        .then((res) => res.json())
        .then((data) => {
          this.setState({ data: data.msg, layout: this.state.defaultLayout});

          this.setState({ loading: false });
        })
        .catch((err) => {
          console.log(err);
          this.setState({ error: true , errMsg: err});
          this.setState({ loading: false });
        });
    };

    const closeError = () => {
      this.setState({error: false});
    }

    return (
      <div className="pred-container">
        <div style={{ display: "flex", alignItems: "center" }}>
          <Cards dataset={this.state.dataset} count={this.state.count} mean={this.state.mean} max={this.state.max} />
          <Box sx={{ position: "relative" }}>
            <label>
              <Input accept="text/csv" id="upfile" type="file" name="dataset_prueba.csv" onChange={uploadDataset} />
              <BtnG
                variant="contained"
                component="span"
                disabled={this.state.uploading || this.state.loading}
                style={{ marginRight: "1rem" }}
              >
                Subir dataset
              </BtnG>
              {this.state.uploading && (
                <CircularProgress
                  size={24}
                  sx={{ position: "absolute", top: "50%", left: "50%", marginTop: "-12px", marginLeft: "-12px" }}
                />
              )}
            </label>
          </Box>
          <Box sx={{ position: "relative" }}>
            <Btn variant="contained" onClick={predictModel} disabled={this.state.loading || this.state.uploading}>
              Pronosticar
            </Btn>
            {this.state.loading && (
              <CircularProgress
                size={24}
                sx={{ position: "absolute", top: "50%", left: "50%", marginTop: "-12px", marginLeft: "-12px" }}
              />
            )}
          </Box>
        </div>

        <div style={{ marginTop: "1rem", display: "flex" }}>
          <Graph data={this.state.data} layout={this.state.layout} title={"Energía activa · Modelo LSTM"} />
        </div>

        <Error open={this.state.error} closeError={closeError} title={"Error"} msg={this.state.errMsg}/>
      </div>
    );
  }
}
export default Prediction;
