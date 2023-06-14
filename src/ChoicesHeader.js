import React from "react";

function ChoicesHeader({ choice }) {
  // console.log(choice);
  let currentOption = choice;

  return (
    <div className="choices-header">
      <div className="header-option">
        <span
          className={currentOption === "Kill" ? "current-option" : "option"}
        >
          Kill
        </span>
      </div>
      <div className="header-option">
        <span
          className={currentOption === "Fuck" ? "current-option" : "option"}
        >
          Fuck
        </span>
      </div>
      <div className="header-option">
        <span
          className={currentOption === "Marry" ? "current-option" : "option"}
        >
          Marry
        </span>
      </div>
    </div>
  );
}

export default ChoicesHeader;
