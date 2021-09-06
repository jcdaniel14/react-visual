const Cards = ({ meta }) => {
  return (
    <div className="card-container">
      <div className="card-count">
        <div style={{ fontSize: "0.9rem", color: "#666", margin: "1rem" }}>
          Total de observaciones
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "1.5rem",
            fontSize: "2rem",
          }}
        >
          {meta.active}
        </div>
      </div>
      <div className="card-mean">
        <div style={{ fontSize: "0.9rem", color: "#666", margin: "1rem" }}>
          Promedio
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "1.5rem",
            fontSize: "2rem",
          }}
        >
          {meta.mean} kWh
        </div>
      </div>
      <div className="card-max">
        <div style={{ fontSize: "0.9rem", color: "#666", margin: "1rem" }}>
          Máximo
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "1.5rem",
            fontSize: "2rem",
          }}
        >
          {meta.max} kWh
        </div>
      </div>
    </div>
  );
};

export default Cards;
