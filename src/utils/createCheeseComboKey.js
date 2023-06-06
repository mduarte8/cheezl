function createCheeseComboKey(cheeses) {
  return cheeses
    .map((cheese) => cheese.replace(/\s+/g, "_"))
    .sort()
    .join("-");
}

export default createCheeseComboKey;
