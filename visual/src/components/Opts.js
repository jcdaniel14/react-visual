import React, { Component } from "react";
import Select, { components } from "react-select";

const { ValueContainer, Placeholder } = components;

const CustomValueContainer = ({ children, ...props }) => {
  return (
    <ValueContainer {...props}>
      <Placeholder {...props} isFocused={true}>
        {props.selectProps.placeholder}
      </Placeholder>
      {React.Children.map(children, (child) =>
        child && child.type !== Placeholder ? child : null
      )}
    </ValueContainer>
  );
};

class Opts extends Component {
  render() {
    return (
      <div className="opts-container">
        <div className="card-date">
          <Select
            className="card-h1"
            options={this.props.datepick}
            defaultValue={this.props.datepick[0]}
            onChange={this.props.onChangeDatePick}
            placeholder="GroupBy"
            styles={{
              container: (provided, state) => ({
                ...provided,
                marginTop: 50,
              }),
              valueContainer: (provided, state) => ({
                ...provided,
                overflow: "visible",
              }),
              placeholder: (provided, state) => ({
                ...provided,
                position: "absolute",
                top:
                  state.hasValue || state.selectProps.inputValue ? -15 : "50%",
                transition: "top 0.1s, font-size 0.1s",
                fontSize:
                  (state.hasValue || state.selectProps.inputValue) && 13,
              }),
            }}
            components={{
              ValueContainer: CustomValueContainer,
            }}
          ></Select>
        </div>
        <button
          className={`${this.props.loading ? "card-btn-disabled" : "card-btn"}`}
          onClick={this.props.onClickModel}
          disabled={this.props.loading}
        >
          Pronosticar
        </button>
      </div>
    );
  }
}

export default Opts;
