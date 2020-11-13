import React, { Component } from "react";
import ReactDOM from "react-dom";
import { hot } from "react-hot-loader/root";
//import App from "./components/App/App";
import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";

// Global styles
import "./components/reset.scss";
import "./components/page/page.scss";
import "./components/link/link.scss";

interface AppProps extends React.HTMLAttributes<HTMLDivElement> {}

interface AppState {}

const rootEl = document.getElementById("root");

class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
  }

  render() {
    return <div className="App">Hello!</div>;
  }
}

ReactDOM.render(
  <ErrorBoundary>
    <App className="App" />,
  </ErrorBoundary>,
  rootEl
);

export default hot(App);
