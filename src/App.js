import logo from "./logo.svg";
import "./App.css";
import CheeseSelection from "./cheese/CheeseSelection";
import ChoicesHeader from "./ChoicesHeader";
import cheeses from "./data/cheeses.js";

function App() {
  return (
    <div className="App">
      <div className="container h-100 d-flex flex-column justify-content-between">
        <div className="row">
          <ChoicesHeader />
        </div>
        <div className="row">
          <CheeseSelection cheese={cheeses[0]} />
        </div>
        <div className="row">
          <CheeseSelection cheese={cheeses[1]} />
        </div>
        <div className="row">
          <CheeseSelection cheese={cheeses[2]} />
        </div>
      </div>
    </div>
  );
}

export default App;
