import React, { useEffect, useState } from "react";
import createCheeseComboKey from "./utils/createCheeseComboKey";
import { addSelections, getStats } from "./utils/api";

function OverlayStatPage({ choices, onStartOver, cheeses }) {
  const [stats, setStats] = useState(null);
  const [userChoices, setUserChoices] = useState(choices);
  const choiceElements = Object.entries(choices).map(([cheese, action]) => {
    return <p key={cheese}>{`${action}: ${cheese}`}</p>;
  });

  // console.log("choices starts as", choices);

  useEffect(() => {
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
          setStats(fetchedStats.data);
        }
      })
      .catch((error) => {
        if (!abortController.signal.aborted) {
          console.error(error);
        }
      });

    return () => {
      // console.log("choices is", choices);
      abortController.abort();
    };
  }, [choices]);

  return (
    <div className="overlay-stat-page">
      <h2>Results</h2>
      <div className="grid-container">
        <div></div>
        <div>Kill</div>
        <div>Fuck</div>
        <div>Marry</div>
        {cheeses.map((cheese) => {
          return (
            <React.Fragment key={cheese.name}>
              <div>{cheese.name}</div>
              {["Kill", "Fuck", "Marry"].map((choice) => (
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
      {/* {choiceElements} */}
      <button
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
      </button>
    </div>
  );
}

export default OverlayStatPage;
