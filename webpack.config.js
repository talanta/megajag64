const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin =  require('copy-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
var phaserModule = path.join(__dirname, '/node_modules/phaser-ce/');
var phaser = path.join(phaserModule, 'build/custom/phaser-split.js'),
  pixi = path.join(phaserModule, 'build/custom/pixi.js'),
  p2 = path.join(phaserModule, 'build/custom/p2.js');

module.exports = {
  entry: { app : [pixi, p2, phaser, './src/app.ts']},
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.ts?$/,
        loader: 'ts-loader',
        exclude: /node_modules/
      },
      { test: /\.(jpe?g|png|gif|svg)$/, loader: 'file-loader' },
      { test: /pixi\.js/, loader: 'expose-loader?PIXI' },
      { test: /phaser-split\.js$/, loader: 'expose-loader?Phaser' },
      { test: /p2\.js/, loader: 'expose-loader?p2' },
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".jpg", "png"],
    alias: {
      'phaser': phaser,
      'pixi.js': pixi,
      'p2': p2,
      }
  },
  plugins: [
    new HtmlWebpackPlugin({title: 'MEGA JAG64', 
      // favicon: 'src/favicon.ico', 
      hash: true, template: 'src/index.html'
    }),
      new CopyWebpackPlugin([
        { context:'src', from: 'assets/**/*' },
      ]),
      new webpack.HotModuleReplacementPlugin(),
          new webpack.NoEmitOnErrorsPlugin()

  ]
};
