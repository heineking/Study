const path = require('path');
const webpack = require('webpack');

module.exports = {
  cache: true,
  mode: "development",
  entry: path.join(__dirname, 'src/index.ts'),
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          { loader: 'babel-loader' },
          { loader: 'ts-loader' }, 
        ],
      }
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development')
      }
    }),
  ],
  resolve: {
    alias: {
      '@': path.join(__dirname, 'src'),
    },
    modules: [
      'node_modules',
    ],
    extensions: ['.ts', '.js', '.json'],
  },
}