import Todo from "./components/Todo";
import { Component } from "react";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render(){
    return (
      <div>
        <Todo/>
      </div>
    )
  };
}

export default App;