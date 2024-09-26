// Initialize month names array
const month = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

// Optionally, initialize day names array if needed
const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Function to format the date from a timestamp
export const getDay = (timestamp) => {
  const date = new Date(timestamp);

  // Get the day and month names
  const day = date.getDate();
  const monthName = month[date.getMonth()];

  return `${day} ${monthName}`;
};

export const joinedAtFunc = (timestamp) => {
  const date = new Date(timestamp);
  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = date.toLocaleDateString("en-US", options);
  return formattedDate; // Output: August 27, 2024
};
