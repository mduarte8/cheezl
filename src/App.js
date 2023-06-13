import "./App.css";
import CheeseSelection from "./cheese/CheeseSelection";
import ChoicesHeader from "./ChoicesHeader";
import cheeses from "./data/cheeses.js";
import React, { useState, useEffect } from "react";
import undoIcon from "./undo-button.png";
import OverlayStatPage from "./OverlayStatPage";

function App() {
  const [choiceTracker, setChoiceTracker] = useState(0);
  const [choices, setChoices] = useState({});
  const [threeCheeses, setThreeCheeses] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const kfm = ["Kill", "Fuck", "Marry"];

  useEffect(() => {
    startOver();
  }, []);

  const startOver = () => {
    const selectedCheeses = [...cheeses]
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    setThreeCheeses(selectedCheeses);
    setChoices({});
    setChoiceTracker(0);
    setShowResults(false);
  };

  const handleCheeseSelection = (cheeseName) => {
    if (choiceTracker < 3) {
      setChoices({ ...choices, [cheeseName]: kfm[choiceTracker] });
      setChoiceTracker(choiceTracker + 1);
    }
  };

  const undoLastSelection = () => {
    const selectedCheeses = Object.keys(choices);
    if (selectedCheeses.length > 0) {
      const lastSelected = selectedCheeses[selectedCheeses.length - 1];
      const newChoices = { ...choices };
      delete newChoices[lastSelected];
      setChoices(newChoices);
      setChoiceTracker(choiceTracker - 1);
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  if (showResults) {
    return <OverlayStatPage choices={choices} onStartOver={startOver} />;
  }

  return (
    <div className="App">
      <div className="container h-100 d-flex flex-column justify-content-between">
        <div className="row">
          <ChoicesHeader choice={kfm[choiceTracker]} />
        </div>
        {threeCheeses.map((cheese) => (
          <div className="row" key={cheese.name}>
            <CheeseSelection
              cheese={cheese}
              choices={choices}
              setChoices={setChoices}
              choiceTracker={choiceTracker}
              setChoiceTracker={setChoiceTracker}
              kfm={kfm}
              onSelect={handleCheeseSelection}
              choice={choices[cheese.name]}
            />
          </div>
        ))}
      </div>
      <img
        src={undoIcon}
        alt="undo"
        className="undo-button"
        onClick={undoLastSelection}
      />
      <button
        className="submit-button"
        disabled={Object.keys(choices).length < 3}
        onClick={() => setHasSubmitted(true)}
      >
        Submit
      </button>
      {hasSubmitted && (
        <OverlayStatPage
          choices={choices}
          onStartOver={() => {
            setHasSubmitted(false);
            startOver();
          }}
          cheeses={threeCheeses}
        />
      )}
    </div>
  );
}

export default App;
