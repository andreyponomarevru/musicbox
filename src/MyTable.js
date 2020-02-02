import React, { Component, Fragment } from "react";
import Input from "./Input";

const TableHeader = () => {
  return (
    <thead>
      <tr>
        <td>#</td>
        <td>Task</td>
        <td></td>
      </tr>
    </thead>    
  );
};

const TableBody = props => {  
  const rows = props.taskList.map((task, index) => {
    return (
      <tr key={index}>
        <td>{index}</td>
        <td>{task}</td>
        <td>
          <button onClick={() => props.deleteRow(index)}>Delete</button>
        </td>
      </tr>
    );
  });
  
  return (
    <tbody>{rows}</tbody>
  );
};

const MyTable = props => {
  return (
    <React.Fragment>
      <table>
        <TableHeader />
        <TableBody taskList={props.taskList} deleteRow={props.deleteRow} />
      </table>
      <Input />
    </React.Fragment>
  );
};

export default MyTable;

