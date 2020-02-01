import React, { Component } from "react";
//import Table from "./Table";
/*
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      characters: [
        {
          name: "Charlie",
          job: "Janitor"
        },
        {
          name: "Mac",
          job: "Bouncer"
        },
        {
          name: "Dee",
          job: "Aspiring actress"
        },
        {
          name: "Dennis",
          job: "Bartender"
        }
      ]
    };
    
  }

  removeCharacter(index) {
    console.log(this.state); // undefind
    console.log(this)
    const { characters } = this.state;
  
    this.setState({
      characters: characters.filter((character, i) => {
        return i !== index;
      }),
    })
  }

  render() {
    const { characters } = this.state;

    // what is the value of 'this' inside JSX expression
    return (
      <div className='container'>
        <Table characterData={characters} removeCharacter={this.removeCharacter} />
      </div>
    );
  }
}
*/

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "in progress"
    }

  }

  handleClick() {
    console.log(this.state.text);
    this.setState({
      text: 'done'
    });
    console.log(this, this.props.name, this.state.text);
  }

  render() {
    return <h1 className="app" onClick={this.handleClick.bind(this)}>{this.state.text}</h1>;
  }
}


export default App;
