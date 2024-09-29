import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/Navbar";
import SingleQRPage from "./pages/SingleQRPage";
import MultipleQRPage from "./pages/MultipleQRPage";

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Switch>
          <Route exact path="/" component={SingleQRPage} />
          <Route path="/multiple" component={MultipleQRPage} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
