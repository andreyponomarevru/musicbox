import React, { Component } from "react";
import MyTable from "./MyTable";


class MyApp extends Component {
  constructor(props) {
    super(props);
    this.deleteRow = this.deleteRow.bind(this);

    this.state = {
      tasks: [
        "Buy the food", 
        "Walk the dog", 
        "Pay the bills", 
        "Clean the room"
      ]
    };


  }

  componentDidMount() {
    console.log("this function runs after the component output has been rendered to the DOM. ");

    // document.querySelector('html').style.backgroundColor = 'red';
  }

  componentWillUnmount() {
    console.log("this function runs after the comoponent's nodes has been removed from the DOM (as far as I understand)");

    
  }

  deleteRow(index) {
    this.setState((state, props) => {
      return {
        tasks: state.tasks.filter((task, i) => index !== i)
      };
    });
  }

  render() {
    const { tasks } = this.state;
    console.log(this.state.tasks);

    return (
      <div className="container">
        <MyTable taskList={tasks} deleteRow={this.deleteRow} />
      </div>
    );
  }
}

export default MyApp;