export function capitalizeString(str) {
  var words = str.split(' '); // Split the string into words
  for (var i = 0; i < words.length; i++) {
    words[i] = words[i][0].toUpperCase() + words[i].slice(1).toLowerCase();
  }
  return words.join(' '); // Join the words back together with spaces
}
