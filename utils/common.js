export const colorsList = [
  "red",
  "pink",
  "yellow",
  "wine",
  "purple",
  "blue",
  "orange",
  "green",
  "white",
  "black",
];

export function formatDate(inputDateStr) {
  const options = { year: "numeric", month: "short", day: "2-digit" };
  const date = new Date(inputDateStr);
  return date.toLocaleDateString("en-US", options);
}

export const getReviewedTimeString = (updatedAt) => {
  const now = new Date();
  const updatedDate = new Date(parseInt(updatedAt));
  const timeDiff = now - updatedDate;

  const seconds = Math.floor(timeDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  const diffInMonths = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 30));

  if (diffInMonths === 0) {
    if (days > 0) {
      return `Reviewed ${days} day${days !== 1 ? "s" : ""} ago`;
    } else if (hours > 0) {
      return `Reviewed ${hours} hour${hours !== 1 ? "s" : ""} ago`;
    } else if (minutes > 0) {
      return `Reviewed ${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    } else {
      return "Reviewed just now";
    }
  } else if (diffInMonths === 1) {
    return "Reviewed 1 month ago";
  } else {
    return `Reviewed ${diffInMonths} months ago`;
  }
};
