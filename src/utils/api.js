import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

async function getSelections(abortSignal) {
  const response = await axios.get(`${API_BASE_URL}/choices`, {
    signal: abortSignal,
  });
  return response.data;
}

// AXIOS FUNCTIONALITY //
async function getStats(cheeseKey, abortSignal) {
  const response = await axios.get(`${API_BASE_URL}/analyze`, {
    params: {
      cheeseKey: cheeseKey,
    },
    signal: abortSignal,
  });
  return response.data;
}

async function getText(choiceData, abortSignal) {
  choiceData = { data: choiceData };
  try {
    const response = await fetch(`${API_BASE_URL}/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(choiceData),
      signal: abortSignal,
    });
    const responseBody = await response.json();
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

async function addSelections(data, abortSignal) {
  try {
    const response = await axios.put(`${API_BASE_URL}/analyze`, data, {
      signal: abortSignal,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

async function fetchHasPlayedToday(userId, abortSignal) {
  const response = await axios.get(`${API_BASE_URL}/choices/hasPlayedToday`, {
    params: {
      userId: userId,
    },
    signal: abortSignal,
  });
  return response;
}

async function saveHasPlayedToday(userId, choices, abortSignal) {
  console.log("saveHasPlayedToday in api called with userId", userId);
  try {
    const response = await axios.post(
      `${API_BASE_URL}/choices/hasPlayedToday`,
      { data: { userId, choices } },
      {
        signal: abortSignal,
      }
    );
    return response;
  } catch (error) {
    console.error(error);
  }
}

export {
  getSelections,
  getStats,
  getText,
  addSelections,
  fetchHasPlayedToday,
  saveHasPlayedToday,
};
