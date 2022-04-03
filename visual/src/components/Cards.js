import { Component } from "react";

class Cards extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     count: this.props.count,
  //     mean: this.props.mean,
  //     max: this.props.max,
  //   };
  // }

  

  render() {
    return (
      <div className="card-container">
        <div className="card-dataset">
          <div style={{ fontSize: "0.9rem", color: "#666", margin: "1rem 1rem 0.35rem 1rem" }}>Dataset</div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", fontSize: "1.5rem", paddingRight: "1rem" }}>
            <div className="icon-dataset"></div>
            <div style={{ color: "#333" }}>{this.props.dataset}</div>
          </div>
        </div>
        <div className="card-count">
          <div style={{ fontSize: "0.9rem", color: "#666", margin: "1rem 1rem 0.35rem 1rem" }}>Total de observaciones</div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", fontSize: "1.5rem", paddingRight: "1rem" }}>
            <div className="icon-count"></div>
            <div style={{ color: "#333" }}>{this.props.count}</div>
          </div>
        </div>
        <div className="card-mean">
          <div style={{ fontSize: "0.9rem", color: "#666", margin: "1rem 1rem 0.35rem 1rem" }}>Promedio</div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", fontSize: "1.5rem" }}>
            <div className="icon-mean"></div>
            <div style={{ color: "#333" }}>{this.props.mean} kWh</div>
          </div>
        </div>
        <div className="card-max">
          <div style={{ fontSize: "0.9rem", color: "#666", margin: "1rem 1rem 0.35rem 1rem" }}>Máximo</div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", fontSize: "1.5rem" }}>
            <div className="icon-max"></div>
            <div style={{ color: "#333" }}>{this.props.max} kWh</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Cards;
