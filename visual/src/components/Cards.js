const Cards = ({ meta }) => {
  return (
    <div className="card-container">
      <div className="card-count">{meta.active}</div>
      <div className="card-mean">{meta.mean}</div>
      <div className="card-max">{meta.max}</div>
    </div>
  );
};

export default Cards;
