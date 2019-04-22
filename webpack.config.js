var path = require('path');

module.exports = {
  entry: "./src/app.js",
  output: {
    filename: "./bundle.js",
    path: path.resolve(__dirname),
  },
  mode: 'development',
  watch: true,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/app\/lib/, /node_modules/],
        use: ['babel-loader']
      },
      {
        test: /\.html$/,
        use: 'raw-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'eslint-loader']
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, './'),
    port: 8008,
    compress: true,
  }
}