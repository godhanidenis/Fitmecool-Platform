export function arraysHaveSameValues(arr1, arr2) {
  if (arr1.length !== arr2.length) {
    return false; // Arrays have different lengths, so they can't have the same values.
  }
  const set2 = new Set(arr2);

  // Check if the sets have the same size and all elements in set1 are in set2
  return arr1.length === arr2.length && arr1.every(value => set2.has(value));
}

export function formatDate(inputDateStr) {
  const options = {year: 'numeric', month: 'short', day: '2-digit'};
  const date = new Date(inputDateStr);
  return date.toLocaleDateString('en-US', options);
}

export const getReviewedTimeString = updatedAt => {
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
      return `Reviewed ${days} day${days !== 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `Reviewed ${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else if (minutes > 0) {
      return `Reviewed ${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else {
      return 'Reviewed just now';
    }
  } else if (diffInMonths === 1) {
    return 'Reviewed 1 month ago';
  } else {
    return `Reviewed ${diffInMonths} months ago`;
  }
};

export const generateRandomNumberString = length => {
  let result = '';
  const characters = '0123456789';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }
  return result;
};

export const refactorPrice = data => {
  if (Number.isInteger(Number(data))) {
    return Number(data);
  } else {
    return Number(Number(data).toFixed(2));
  }
};

export const isFileOfType = (fileName, fileTypes) => {
  const extension = fileName.split('.').pop();
  return fileTypes.includes(extension.toLowerCase());
};
