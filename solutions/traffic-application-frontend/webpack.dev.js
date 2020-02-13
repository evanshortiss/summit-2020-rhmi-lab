const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const { resolve } = require('path');
const apiMocker = require('mocker-api');

const HOST = process.env.HOST || '0.0.0.0';
const PORT = process.env.PORT || '9000';

module.exports = merge(common, {
  mode: 'development',
  devtool: 'eval-source-map',
  devServer: {
    before (app) {
      apiMocker(app, resolve(__dirname, 'mock-api-server/api.js'), {})
    },
    contentBase: './dist',
    host: HOST,
    port: PORT,
    compress: true,
    inline: true,
    historyApiFallback: true,
    disableHostCheck: true,
    hot: true,
    overlay: true,
    open: true
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        include: [
          path.resolve(__dirname, 'src'),
          path.resolve(__dirname, 'node_modules/patternfly'),
          path.resolve(__dirname, 'node_modules/@patternfly/patternfly'),
          path.resolve(__dirname, 'node_modules/@patternfly/react-styles/css'),
          path.resolve(__dirname, 'node_modules/@patternfly/react-core/dist/styles/base.css'),
          path.resolve(__dirname, 'node_modules/@patternfly/react-core/dist/esm/@patternfly/patternfly'),
          path.resolve(__dirname, 'node_modules/@patternfly/react-core/node_modules/@patternfly/react-styles/css')
        ],
        use: ['style-loader', 'css-loader']
      }
    ]
  }
});
