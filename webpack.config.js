const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ngAnnotatePlugin = require('ng-annotate-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const buildFolder = 'www';

const VENDOR_LIBS = [
  'angular',
  'angular-ui-router',
  'angular-ui-router.stateHelper',
  'ng-file-upload',
  'angular-nvd3'
];

module.exports = {
  entry: {
    vendor: VENDOR_LIBS,
    bundle: './src/app/index.module.js',
  },
  output: {
    path: path.join(__dirname, buildFolder),
    filename: '[name].[chunkhash].js',
  },
  module: {
    rules: [
      {
        use: ['babel-loader'],
        test: /\.js$/,
        exclude: /node_modules/
      },
      {
        test: /\.less$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'less-loader'],
        })
      },
      {
        test: /\.css/,
        use: [ 'style-loader', 'css-loader' ]
      },
      {
        test: /\.(jpe|jpg|woff|woff2|eot|ttf|svg)(\?.*$|$)/,
        loader: 'url-loader?limit=100000&name=[name].[ext]'
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
    ]),
    new ExtractTextPlugin('styles.css')
  ]
};
