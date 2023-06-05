import React from "react";

function CheeseSelection({ cheese }) {
  const { name, imagePath } = cheese;
  console.log(`${process.env.PUBLIC_URL}${imagePath}`);
  const imageUrl = `${process.env.PUBLIC_URL}${imagePath}`;
  return (
    <div>
      <img src={imageUrl} alt="cheddar cheese" className="img-fluid" />
      <div className="cheese-name">{name}</div>
    </div>
  );
}

export default CheeseSelection;
