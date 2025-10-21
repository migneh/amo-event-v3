module.exports = {
  randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  },

  delay(ms) {
    return new Promise(res => setTimeout(res, ms));
  },
};
