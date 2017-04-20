const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ngAnnotatePlugin = require('ng-annotate-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const buildFolder = 'www';
// const buildFolder = 'android_asset/www';

const VENDOR_LIBS = [
  'angular',
  'angular-ui-router',
  'angular-ui-router.stateHelper',
  'ng-file-upload'
];

module.exports = {
  entry: {
    vendor: VENDOR_LIBS,
    bundle: './src/app/index.module.js',
  },
  output: {
    path: path.join(__dirname, buildFolder),
    filename: '[name].[chunkhash].js',
    // publicPath: 'file:///android_asset/www/',
  },
  module: {
    rules: [
      {
        use: ['babel-loader'],
        test: /\.js$/,
        exclude: /node_modules/
      },
    ]
  },
  plugins: [
    new CleanWebpackPlugin([buildFolder], {
      root: __dirname
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.html',
      title: 'Eyes'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest']
    }),
    new ngAnnotatePlugin({
        add: true,
    }),
    new CopyWebpackPlugin([
      {
        context: 'src',
        from: 'app/**/*.html',
        to: path.join(__dirname, buildFolder)
      },
    ])
  ]
};
