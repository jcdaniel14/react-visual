import { Component } from "react";
const HOST = "http://localhost";

class Cards extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      mean: 0,
      max: 0,
      filename: ""
    };
  }

  componentDidMount() {
    fetch(`${HOST}/api/getFileStatus`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ grouper: this.state.grouper }),
    })
      .then((res) => res.json())
      .then((data) =>
        this.setState({
          count: data.count,
          max: data.max,
          mean: data.mean,
          filename: data.filename
        })
      );
  }

  render() {
    return (
      <div className="card-container">
        <div className="card-count">
          <div style={{ fontSize: "0.9rem", color: "#666", margin: "1rem 1rem 0.35rem 1rem" }}>Total de observaciones</div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", fontSize: "1.75rem", paddingRight: "1rem" }}>
            <div className="icon-count"></div>
            <div style={{ color: "#333" }}>{this.state.count}</div>
          </div>
        </div>
        <div className="card-mean">
          <div style={{ fontSize: "0.9rem", color: "#666", margin: "1rem 1rem 0.35rem 1rem" }}>Promedio</div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", fontSize: "1.75rem" }}>
            <div className="icon-mean"></div>
            <div style={{ color: "#333" }}>{this.state.mean} kWh</div>
          </div>
        </div>
        <div className="card-max">
          <div style={{ fontSize: "0.9rem", color: "#666", margin: "1rem 1rem 0.35rem 1rem" }}>Máximo</div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", fontSize: "1.75rem" }}>
            <div className="icon-max"></div>
            <div style={{ color: "#333" }}>{this.state.max} kWh</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Cards;
