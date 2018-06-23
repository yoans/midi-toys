const path = require('path');

  module.exports = {
  entry: './babel/index.js',
  output: {
    path: path.resolve(__dirname, "build"),
    filename: 'main.bundle.js'
  },
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  }
}; 