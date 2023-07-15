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
    // console.log("choices in OverlayStagePage is", choices);
    // console.log("cheeses are", cheeses);
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

    const fetchData = async () => {
      try {
        if (!hasPlayedToday) {
          await addSelections(selectionData, abortController.signal);
        }

        if (!abortController.signal.aborted) {
          const fetchedStats = await getStats(
            cheeseKey,
            abortController.signal
          );
          setStats(fetchedStats.data);

          let dataForPrompt =
            "Cheese choices are " + JSON.stringify(selectionData[cheeseKey]);
          dataForPrompt +=
            " and user statistics for cheese selections for that combination are " +
            JSON.stringify(fetchedStats.data);

          const response = await getText(dataForPrompt, abortController.signal);
          setSummaryText(response);
        }
      } catch (error) {
        if (!abortController.signal.aborted) {
          console.error(error);
        }
      }
    };

    fetchData();

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
                      ? `${stats[cheese.name][choice]}%`
                      : "Loading..."}
                  </span>
                </div>
              ))}
            </React.Fragment>
          );
        })}
      </div>

      <h3>Come back mañana 🧀 🥳 !!! </h3>
    </div>
  );
}

export default OverlayStatPage;
