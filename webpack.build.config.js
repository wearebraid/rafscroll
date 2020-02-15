const path = require('path');
const EsmWebpackPlugin = require("@purtuga/esm-webpack-plugin");

const legacy = {
  entry: './src/rafscroll.js',
  mode: 'production',
  output: {
    filename: 'rafscroll.min.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'rafscroll',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  }
}

const esModule = {
  entry: './src/rafscroll.js',
  mode: 'production',
  output: {
    filename: 'rafscroll.esm.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'rafscroll',
    libraryTarget: 'var'
  },
  plugins: [
    new EsmWebpackPlugin()
  ]
}

module.exports = [esModule, legacy]
