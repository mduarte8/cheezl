import React, { useEffect, useState } from "react";
import createCheeseComboKey from "./utils/createCheeseComboKey";
import { addSelections, getStats, getText } from "./utils/api";

function OverlayStatPage({ choices, cheeses, hasPlayedToday }) {
  const [stats, setStats] = useState(null);
  const [userChoices, setUserChoices] = useState(choices);
  const [summaryText, setSummaryText] = useState("");
  const choiceElements = Object.entries(choices).map(([cheese, action]) => {
    return <p key={cheese}>{`${action}: ${cheese}`}</p>;
  });

  useEffect(() => {
    console.log("choices in OverlayStagePage is", choices);
    console.log("cheeses are", cheeses);
    let cheeseNames = [];
    Object.entries(choices).forEach(([cheese, action]) => {
      cheeseNames.push(cheese);
    });
    let selectionData = {};
    const cheeseKey = createCheeseComboKey(cheeseNames);
    selectionData[cheeseKey] = {};

    Object.entries(choices).forEach(([cheese, action]) => {
      selectionData[cheeseKey][action] = cheese;
    });
    const abortController = new AbortController();
    setUserChoices(choices);

    addSelections(selectionData, abortController.signal)
      .then(() => {
        if (!abortController.signal.aborted) {
          return getStats(cheeseKey, abortController.signal);
        }
      })
      .then((fetchedStats) => {
        if (!abortController.signal.aborted) {
          // console.log("fetchedStats are", fetchedStats);
          // console.log("selectionData is", selectionData);
          setStats(fetchedStats.data);
          return fetchedStats;
        }
      })
      .then((fetchedStats) => {
        // console.log("selectionData is", selectionData);
        let dataForPrompt =
          "Cheese choices are " + JSON.stringify(selectionData[cheeseKey]);
        dataForPrompt +=
          " and user statistics for cheese selections for that combination are " +
          JSON.stringify(fetchedStats.data);
        // console.log("dataForPrompt is", dataForPrompt);
        return getText(dataForPrompt, abortController.signal);
      })
      .then((response) => {
        // console.log("response is", response);
        console.log("overlaystatpage hasPlayedToday is", hasPlayedToday);
        setSummaryText(response);
      })
      .catch((error) => {
        if (!abortController.signal.aborted) {
          console.error(error);
        }
      });

    return () => {
      abortController.abort();
    };
  }, [choices, hasPlayedToday]);

  return (
    <div className="overlay-stat-page">
      <h2>Results</h2>
      {hasPlayedToday && (
        <p>You've already played today. Come back tomorrow!</p>
      )}
      {summaryText ? summaryText.data.content : "Loading..."}
      <div className="grid-container">
        <div></div>
        <div>Kill</div>
        <div>Date</div>
        <div>Marry</div>
        {cheeses.map((cheese) => {
          return (
            <React.Fragment key={cheese.name}>
              <div>{cheese.name}</div>
              {["Kill", "Date", "Marry"].map((choice) => (
                <div key={choice}>
                  <span
                    className={
                      userChoices[cheese.name] === choice ? "highlight" : ""
                    }
                  >
                    {stats && stats[cheese.name]
                      ? stats[cheese.name][choice]
                      : "Loading..."}
                  </span>
                </div>
              ))}
            </React.Fragment>
          );
        })}
      </div>

      <h3>Come back mañana!!! </h3>

      {/* {choiceElements} */}
      {/* <button
        className="btn btn-outline-secondary mt-3"
        onClick={(e) => {
          onStartOver(e);
          if (typeof window.gtag === "function") {
            window.gtag("event", "click", {
              event_category: "Button",
              event_label: "Play Again",
            });
          }
        }}
      >
        Play Again
      </button> */}
    </div>
  );
}

export default OverlayStatPage;
