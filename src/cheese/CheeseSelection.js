import React from "react";

function CheeseSelection({
  cheese,
  choices,
  setChoices,
  choiceTracker,
  setChoiceTracker,
  kfm,
  onSelect,
  choice,
}) {
  const { name, imagePath } = cheese;
  // console.log(`${process.env.PUBLIC_URL}${imagePath}`);
  const imageUrl = `${process.env.PUBLIC_URL}${imagePath}`;

  const handleClick = () => {
    // If cheese has been selected, unselect it
    if (choice && choice === kfm[choiceTracker - 1]) {
      // checks to see if the selection is the previous choice and can only undo if select was previous choice
      const newChoices = { ...choices };
      delete newChoices[cheese.name];
      setChoices(newChoices);
      setChoiceTracker(choiceTracker - 1);
    }
    // If cheese has not been selected, select it
    else if (!choice && choiceTracker < 3) {
      // makes sure that it doesn't change a previous selected choice to another choice
      setChoices({ ...choices, [cheese.name]: kfm[choiceTracker] });
      setChoiceTracker(choiceTracker + 1);
    }
  };

  return (
    <div className="parent-container">
      <div
        className={`image-container ${choice ? "grayed-out" : ""}`}
        style={{ backgroundImage: `url(${imageUrl})` }}
        onClick={handleClick}
      >
        {choice && <div className="choice-overlay">{choice}</div>}
      </div>
      <div className="cheese-name">{cheese.name}</div>
    </div>
  );
}

export default CheeseSelection;
