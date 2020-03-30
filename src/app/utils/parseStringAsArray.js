module.exports = function parseStringAsArray(arrayAsString) {
  return arrayAsString.split(',').map((necessity) => necessity.trim());
};
