import React from "react";

function OverlayStatPage({ choices, onStartOver }) {
  const choiceElements = Object.entries(choices).map(([cheese, action]) => (
    <p key={cheese}>{`${action}: ${cheese}`}</p>
  ));
  return (
    <div className="overlay-stat-page">
      <h2>Results</h2>
      {/* Display your choice stats here */}
      {choiceElements}
      <button onClick={onStartOver}>Start Over</button>
    </div>
  );
}

export default OverlayStatPage;
