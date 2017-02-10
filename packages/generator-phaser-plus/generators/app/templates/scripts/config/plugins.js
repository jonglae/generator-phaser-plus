/*
 * `plugins` module
 * ================
 *
 * General Webpack plugin configuration.
 */

'use strict';

const webpack = require('webpack');
const HTML = require('html-webpack-plugin');

module.exports = () =>
  [
    new webpack.DefinePlugin({
      CANVAS_RENDERER: true,
      WEBGL_RENDERER: true
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'manifest']
    }),
    new HTML({
      title: `<%= title %>`,
      template: './index.html'
    })
  ];
