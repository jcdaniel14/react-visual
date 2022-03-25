import React, { Component } from "react";
import Cards from "./Cards.js";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Graph from "./Graph.js";
import { CircularProgress } from "@mui/material";
const HOST = "http://localhost";

class Prediction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: this.props.count,
      mean: this.props.mean,
      max: this.props.max,
      loading: false,
      uploading: false,
      ts: [],
    };
  }
  getFileStatus(filename){
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
          mean: data.mean
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
      "&:hover":{
        backgroundColor: "#003263"
      }
    });
    const BtnG = styled(Button)({
      backgroundColor: "#004225",
      fontFamily: "Quicksand, Roboto",
      textTransform: "none",
      borderColor: "#001e3c",
      fontWeight: "bold",
      "&:hover":{
        backgroundColor: "#00693b"
      }
    });
    const Input = styled("input")({
      display: "none"
    });

    const uploadDataset = (e) => {
      console.log("Uploading...");
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
        if(result.msg === "ok")
          this.getFileStatus("dataset_prueba.csv");
      })
      .catch((err)=> {
        console.log(err);
      });
    };

    const predictModel = () => {
      this.setState({ loadingModel: !this.state.loadingModel });
      fetch(`${HOST}/api/getPredictedTS`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ option: "show" }),
      })
        .then((res) => res.json())
        .then((data) => {
          this.setState({ ts: data.ts });
        });
    };

    return (
      <div className="pred-container">
        <div style={{ display: "flex", alignItems: "center" }}>
          <Cards count={this.state.count} mean={this.state.mean} max={this.state.max}/>
          <Box sx={{position:"relative"}}>
            <label>
              <Input accept="text/csv" id="upfile" type="file" name="dataset_prueba.csv" onChange={uploadDataset}/>
              <BtnG variant="contained" component="span" disabled={this.state.uploading} style={{ marginRight: "1rem" }}>
                Subir dataset
              </BtnG>
              {this.state.uploading && (
                <CircularProgress size={24} sx={{ position: "absolute", top: "50%", left: "50%", marginTop: "-12px", marginLeft: "-12px" }}/>
              )}
            </label>
          </Box>
          <Btn variant="contained" onClick={predictModel} disabled={this.state.loading}>
            Pronosticar
          </Btn>
        </div>

        <div style={{ marginTop: "1rem", display: "flex" }}>
          <Graph ts={this.state.ts} />
        </div>
      </div>
    );
  }
}
export default Prediction;
