import "./App.css";
import CheeseSelection from "./cheese/CheeseSelection";
import ChoicesHeader from "./ChoicesHeader";
import cheeses from "./data/cheeses.js";
import React, { useState, useEffect } from "react";
import undoIcon from "./undo-button.png";
import OverlayStatPage from "./OverlayStatPage";
import {
  getSelections,
  fetchHasPlayedToday,
  saveHasPlayedToday,
} from "./utils/api";
import { v4 as uuidv4 } from "uuid"; // import the uuid library

function App() {
  const [choiceTracker, setChoiceTracker] = useState(0);
  const [choices, setChoices] = useState({});
  const [threeCheeses, setThreeCheeses] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [hasPlayedToday, setHasPlayedToday] = useState(false);
  const [error, setError] = useState(null);

  const kdm = ["Kill", "Date", "Marry"];

  useEffect(() => {
    const abortController = new AbortController();
    let userId = localStorage.getItem("userId");
    if (!userId) {
      userId = uuidv4();
      localStorage.setItem("userId", userId);
    }

    const fetchData = async () => {
      try {
        // Need to get the selections each time, to populate the already-played case
        const cheeseResponse = await getSelections(abortController.signal);
        if (!abortController.signal.aborted) {
          setThreeCheeses(
            cheeses.filter((cheese) =>
              cheeseResponse.data.includes(cheese.name)
            )
          );
        }

        const playedToday = await fetchHasPlayedToday(
          userId,
          abortController.signal
        );
        if (playedToday.data.hasPlayedToday) {
          // setHasSubmitted(true);
          setHasPlayedToday(true);
          setChoices(playedToday.data.choices);
          //   , () => {
          //   // This will only be executed after `choices` are updated
          //   setHasSubmitted(true);
          // });
        }
      } catch (error) {
        // Handle error if the request fails
        if (!abortController.signal.aborted) {
          console.log("This is the error", error);
          setError(error.message);
        }
        console.error("Error fetching cheese data:", error);
      }
    };

    fetchData();
    // Cleanup function to abort the API request when the component is unmounted.
    return () => abortController.abort();
  }, []);

  useEffect(() => {
    // Object.keys(choices).length === 3 &&
    if (hasPlayedToday) {
      setHasSubmitted(true);
    }
  }, [choices]);

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
    const abortController = new AbortController();
    let userId = localStorage.getItem("userId");
    // If there's a userId, call the function to save the play status in the DB
    saveHasPlayedToday(userId, choices, abortController.signal).then(() => {
      setShowResults(true); // need to wait 'til saveHasPlayed is finished being called otherwise OverlayStatPage will try to call db and they would get tangled
      setHasSubmitted(true);
    });
  };

  return (
    <div className="App">
      {error ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            textAlign: "center",
            padding: "20px",
          }}
        >
          <div>An Error Occurred. Please Try again Later.</div>
          <div>{error}</div>
        </div>
      ) : threeCheeses ? (
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
            onClick={handleSubmit}
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
          cheeses={threeCheeses}
          hasPlayedToday={hasPlayedToday}
        />
      )}
    </div>
  );
}

export default App;
