import Header from './Header.js';
import Vistas from './Vistas.js';

import { Component } from "react";

class Todo extends Component {
  render(){
    return (
      <div className="container">
        <Header/>
        <Vistas/>
      </div>
    );
  }
}
export default Todo;