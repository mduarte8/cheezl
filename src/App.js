import "./App.css";
import CheeseSelection from "./cheese/CheeseSelection";
import ChoicesHeader from "./ChoicesHeader";
import cheeses from "./data/cheeses.js";
import React, { useState, useEffect } from "react";
import undoIcon from "./undo-button.png";
import OverlayStatPage from "./OverlayStatPage";
import { getSelections } from "./utils/api";

function App() {
  const [choiceTracker, setChoiceTracker] = useState(0);
  const [choices, setChoices] = useState({});
  const [threeCheeses, setThreeCheeses] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const kdm = ["Kill", "Date", "Marry"];

  useEffect(() => {
    const abortController = new AbortController();

    const fetchData = async () => {
      try {
        const cheeseResponse = await getSelections(abortController.signal);
        if (!abortController.signal.aborted) {
          console.log("cheeseResponse.data is", cheeseResponse.data);
          setThreeCheeses(
            cheeses.filter((cheese) =>
              cheeseResponse.data.includes(cheese.name)
            )
          );
        }
      } catch (error) {
        // Handle error if the request fails
        console.error("Error fetching cheese data:", error);
      }
    };

    fetchData();

    // Cleanup function to abort the API request when the component is unmounted.
    return () => abortController.abort();
  }, []);

  const startOver = async () => {
    const dailyCheeses = await getSelections().data;
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
      setChoices({ ...choices, [cheeseName]: kdm[choiceTracker] });
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

  return (
    <div className="App">
      {threeCheeses ? (
        <React.Fragment>
          <div className="container h-100 d-flex flex-column justify-content-between">
            <div className="row">
              <ChoicesHeader choice={kdm[choiceTracker]} />
            </div>
            {threeCheeses.map((cheese) => (
              <div className="row" key={cheese.name}>
                <CheeseSelection
                  cheese={cheese}
                  choices={choices}
                  setChoices={setChoices}
                  choiceTracker={choiceTracker}
                  setChoiceTracker={setChoiceTracker}
                  kdm={kdm}
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
            onClick={() => {
              setHasSubmitted(true);
            }}
          >
            Submit
          </button>
        </React.Fragment>
      ) : (
        <div>Loading...</div>
      )}
      {hasSubmitted && (
        <OverlayStatPage
          choices={choices}
          onStartOver={() => {
            // setHasSubmitted(false);
            // startOver();
            console.log("You can only play once per day");
          }}
          cheeses={threeCheeses}
        />
      )}
    </div>
  );
}

export default App;
