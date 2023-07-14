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

  const kdm = ["Kill", "Date", "Marry"];

  useEffect(() => {
    const abortController = new AbortController();
    let userId = localStorage.getItem("userId");
    if (!userId) {
      userId = uuidv4();
      localStorage.setItem("userId", userId);
    }
    console.log("userId in frontend is", userId);

    // let pastChoices = localStorage.getItem("choices");
    // let pastCheeses = localStorage.getItem("cheeses");

    // if (pastChoices && pastCheeses) {
    //   setChoices(JSON.parse(pastChoices));
    //   setThreeCheeses(JSON.parse(pastCheeses));
    //   setHasSubmitted(true);
    // }

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

        const playedToday = await fetchHasPlayedToday(
          userId,
          abortController.signal
        ); // You can replace 'YourUserID' with actual user id
        console.log(
          "playedToday.data.hasPlayedToday is",
          playedToday.data.hasPlayedToday
        );
        if (playedToday.data.hasPlayedToday) {
          // alert(playedToday.data.message); // Alert user they've already played today
          setHasSubmitted(true);
          setHasPlayedToday(true);
          // setChoices(playedToday.data.choices);
          setChoices(playedToday.data.choices, () => {
            // Now this will only be executed after `choices` are updated
            setHasSubmitted(true);
            // setRefreshToggle(!refreshToggle);
          });
          console.log("choices are", choices);
          console.log(
            "fetchHasPlayedToday response.status and response.data is",
            playedToday.status,
            playedToday.data
          );
          console.log("playedToday is", playedToday);
          return; // Don't fetch the game data
        }

        // const cheeseResponse = await getSelections(abortController.signal);
        // if (!abortController.signal.aborted) {
        //   console.log("cheeseResponse.data is", cheeseResponse.data);
        //   setThreeCheeses(
        //     cheeses.filter((cheese) =>
        //       cheeseResponse.data.includes(cheese.name)
        //     )
        //   );
        // }
      } catch (error) {
        // Handle error if the request fails
        console.error("Error fetching cheese data:", error);
      }
    };

    fetchData();

    // Cleanup function to abort the API request when the component is unmounted.
    return () => abortController.abort();
  }, []);

  // const startOver = async () => {
  //   const dailyCheeses = await getSelections().data;
  //   const selectedCheeses = [...cheeses]
  //     .sort(() => 0.5 - Math.random())
  //     .slice(0, 3);
  //   setThreeCheeses(selectedCheeses);
  //   setChoices({});
  //   setChoiceTracker(0);
  //   setShowResults(false);
  // };

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
    console.log("choices after submit are:", choices);
    // localStorage.setItem("choices", JSON.stringify(choices));
    // localStorage.setItem("cheeses", JSON.stringify(threeCheeses));
    let userId = localStorage.getItem("userId");
    console.log("handleSubmit userId is", userId);
    console.log("attempting to saveHasPlayed");
    // If there's a userId, call the function to save the play status in the DB
    saveHasPlayedToday(userId, choices, abortController.signal).then(() => {
      setShowResults(true);
      setHasSubmitted(true);
    });
    // setHasPlayedToday(true);
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
          // onStartOver={() => {
          //   // setHasSubmitted(false);
          //   // startOver();
          //   console.log("You can only play once per day");
          // }}
          cheeses={threeCheeses}
          hasPlayedToday={hasPlayedToday}
        />
      )}
    </div>
  );
}

export default App;
