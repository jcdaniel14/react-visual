import Select from "react-select";

const VisHeader = ({ options, onChange }) => {
  return (
    <div className="vis-container">
      <div className="vis-h1">Series de Tiempo</div>
      <Select
        className="vis-h2"
        options={options}
        defaultValue={options[0]}
        onChange={onChange}
      ></Select>
    </div>
  );
};

export default VisHeader;
