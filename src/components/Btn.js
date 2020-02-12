import React, { Component } from "react";
import styled from 'styled-components';

class Btn extends Component {
  render() {
    return (
      <Div type="button">Click me!</Div>
    );
  }
}

const Div = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: black;
  color: white;
  max-width: 10em;
  height: 3em;
  border-radius: 4px;
  cursor: pointer;
`;



export default Btn;