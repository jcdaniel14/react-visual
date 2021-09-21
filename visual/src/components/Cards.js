const Cards = ({ meta }) => {
  return (
    <div className="card-container">
      <div className="card-count">
        <div
          style={{
            fontSize: "0.9rem",
            color: "#666",
            margin: "1rem 1rem 0.35rem 1rem",
          }}
        >
          Total de observaciones
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "1.75rem",
            paddingRight: "1rem",
          }}
        >
          <div className="icon-count"></div>
          <div style={{ color: "#333" }}>{meta.active}</div>
        </div>
      </div>
      <div className="card-mean">
        <div
          style={{
            fontSize: "0.9rem",
            color: "#666",
            margin: "1rem 1rem 0.35rem 1rem",
          }}
        >
          Promedio
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "1.75rem",
          }}
        >
          <div className="icon-mean"></div>
          <div style={{ color: "#333" }}>{meta.mean} kWh</div>
        </div>
      </div>
      <div className="card-max">
        <div
          style={{
            fontSize: "0.9rem",
            color: "#666",
            margin: "1rem 1rem 0.35rem 1rem",
          }}
        >
          Máximo
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "1.75rem",
          }}
        >
          <div className="icon-max"></div>
          <div style={{ color: "#333" }}>{meta.max} kWh</div>
        </div>
      </div>
    </div>
  );
};

export default Cards;
