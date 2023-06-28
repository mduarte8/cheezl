const { axios } = require("axios");

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

// AXIOS FUNCTIONALITY //
async function getStats(cheeseKey, abortSignal) {
  // console.log("abort signal is", abortSignal);
  const response = await axios.get(`${API_BASE_URL}/analyze`, {
    params: {
      cheeseKey: cheeseKey,
    },
    signal: abortSignal,
  });
  return response.data;
}

// async function getText(choiceData, abortSignal) {
//   const myHeaders = new Headers();
//   myHeaders.append("Content-Type", "application/json");

//   const raw = JSON.stringify({
//     data: {
//       scooby: "dooby",
//     },
//   });

//   const requestOptions = {
//     method: "POST",
//     headers: myHeaders,
//     body: raw,
//     redirect: "follow",
//   };

//   return (
//     fetch(`${API_BASE_URL}/generate`, requestOptions)
//       .then((response) => response.text())
//       // .then((result) => console.log(result))
//       .catch((error) => console.log("error", error))
//   );
// }
async function getText(choiceData, abortSignal) {
  console.log("choiceData coming into api is", choiceData);
  choiceData = { data: { scooby: "dooby" } };
  console.log("choiceData in api is", choiceData);
  console.log("api_base_url is", API_BASE_URL);
  try {
    const response = await fetch(`${API_BASE_URL}/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(choiceData),
      signal: abortSignal,
    });
    console.log("response is", response);
    const responseBody = await response.json();
    console.log("responseBody is", responseBody); // Log the raw response from server
    return responseBody; // Parse it as JSON
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log("error.response.data", error.response.data);
      console.log("error.response.status", error.response.status);
      console.log("error.response.headers", error.response.headers);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log("error.request", error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error", error.message);
    }
    console.log("error.config", error.config);
  }
}

// async function getText(choiceData, abortSignal) {
//   console.log("choiceData in api is", choiceData);
//   console.log("api_base_url is", API_BASE_URL);
//   // return "called michael correctly";
//   try {
//     const response = await axios.post(`${API_BASE_URL}/generate`, choiceData, {
//       signal: abortSignal,
//     });
//     return response.data;
//   } catch (error) {
//     if (error.response) {
//       // The request was made and the server responded with a status code
//       // that falls out of the range of 2xx
//       console.log("error.response.data", error.response.data);
//       console.log("error.response.status", error.response.status);
//       console.log("error.response.headers", error.response.headers);
//     } else if (error.request) {
//       // The request was made but no response was received
//       // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
//       // http.ClientRequest in node.js
//       console.log("error.request", error.request);
//     } else {
//       // Something happened in setting up the request that triggered an Error
//       console.log("Error", error.message);
//     }
//     console.log("error.config", error.config);
//   }
// }

async function addSelections(data, abortSignal) {
  try {
    const response = await axios.put(`${API_BASE_URL}/analyze`, data, {
      signal: abortSignal,
    });
    return response.data;
  } catch (error) {
    // console.log("BEEEP ERROR!");
    console.error(error);
  }
}

// async function getStats(abortSignal) {
//   try {
//     const response = await fetch(`${API_BASE_URL}/analyze`, {
//       signal: abortSignal,
//     });
//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error(error);
//   }
// }

// async function addSelections(data, abortSignal) {
//   try {
//     const response = await fetch(`${API_BASE_URL}/analyze`, {
//       method: "PUT",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(data),
//       signal: abortSignal,
//     });
//     const responseData = await response.json();
//     return responseData;
//   } catch (error) {
//     console.error(error);
//   }
// }

module.exports = { getStats, getText, addSelections };
