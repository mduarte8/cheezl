import React from "react";

function CheeseSelection({ cheese, onSelect, choice }) {
  const { name, imagePath } = cheese;
  console.log(`${process.env.PUBLIC_URL}${imagePath}`);
  const imageUrl = `${process.env.PUBLIC_URL}${imagePath}`;

  const handleClick = () => {
    if (!choice) {
      // only allow selection if there's no current choice
      onSelect(cheese.name);
    }
  };

  return (
    <div className="parent-container" onClick={handleClick}>
      <div
        className={`image-container ${choice ? "grayed-out" : ""}`}
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        {choice && <div className="choice-overlay">{choice}</div>}
      </div>
      <div className="cheese-name">{cheese.name}</div>
    </div>
  );
}

export default CheeseSelection;
