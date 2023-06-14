import React, { useEffect } from "react";
import createCheeseComboKey from "./utils/createCheeseComboKey";
import { addSelections, getStats } from "./utils/api";

function OverlayStatPage({ choices, onStartOver, cheeses }) {
  // let cheeseNames = [];
  // Object.entries(choices).map(([cheese, action]) => {
  //   cheeseNames.push(cheese);
  // });
  // console.log("cheeses is", cheeses);
  // const cheeseKey = createCheeseComboKey(cheeseNames);
  // console.log("cheeseKey is", cheeseKey);
  // let selectionData = {};
  // selectionData[cheeseKey] = {};
  const choiceElements = Object.entries(choices).map(([cheese, action]) => {
    // cheeseNames.push(cheese);
    // selectionData[cheeseKey][action] = cheese;
    return <p key={cheese}>{`${action}: ${cheese}`}</p>;
  });

  // console.log("selectionData is", selectionData);
  // console.log("choices", choices);
  // console.log("cheeseNames", cheeseNames);

  // console.log("cheeseKey is", cheeseKey);
  console.log("choices starts as", choices);

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
    // getStats(abortController.signal).then(console.log);
    addSelections(selectionData, abortController.signal)
      .then(() => {
        if (!abortController.signal.aborted) {
          return getStats(abortController.signal);
        }
      })
      .then((stats) => {
        if (!abortController.signal.aborted) {
          console.log(stats);
        }
      })
      .catch((error) => {
        if (!abortController.signal.aborted) {
          console.error(error);
        }
      });
    // const addSelectionsPromise = addSelections(
    //   selectionData,
    //   abortController.signal
    // );
    // const getStatsPromise = getStats(abortController.signal);

    // // Execute the two promises in parallel, but make sure both of them finish before you proceed
    // Promise.all([addSelectionsPromise, getStatsPromise])
    //   .then(([_, stats]) => {
    //     if (!abortController.signal.aborted) {
    //       console.log(stats);
    //     }
    //   })
    //   .catch((error) => {
    //     if (!abortController.signal.aborted) {
    //       console.error(error);
    //     }
    //   });

    return () => {
      console.log("choices is", choices);
      abortController.abort();
    };
  }, [choices]);

  return (
    <div className="overlay-stat-page">
      <h2>Results</h2>
      {/* Display your choice stats here */}
      {choiceElements}
      <button className="btn btn-outline-secondary" onClick={onStartOver}>
        Start Over
      </button>
    </div>
  );
}

export default OverlayStatPage;
