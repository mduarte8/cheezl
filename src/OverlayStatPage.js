import React from "react";
import createCheeseComboKey from "./utils/createCheeseComboKey";

function OverlayStatPage({ choices, onStartOver, cheeses }) {
  let cheeseNames = [];
  const choiceElements = Object.entries(choices).map(([cheese, action]) => {
    cheeseNames.push(cheese);
    return <p key={cheese}>{`${action}: ${cheese}`}</p>;
  });

  console.log("choices", choices);
  console.log("cheeseNames", cheeseNames);

  const cheeseKey = createCheeseComboKey(cheeseNames);
  console.log("cheeseKey is", cheeseKey);

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
