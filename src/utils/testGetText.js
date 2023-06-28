// import the necessary functions
const { getText } = require("./apiTest");

// create a test data and abortSignal
let testData = { data: { scooby: "dooby" } };
let abortSignal = null;

// call the getText function with the test data and abortSignal
getText(testData, abortSignal)
  .then((response) => {
    console.log("Response:", response);
  })
  .catch((err) => {
    console.error("Error:", err);
  });
