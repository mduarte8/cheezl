import axios from "axios";

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

export { getStats, addSelections };
