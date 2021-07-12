const webpack = require('webpack');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');
const config = require('./dev-server');
const path = require('path');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const portfinder = require('portfinder');
const utils = require('./utils');

const devWebpackConfig = merge(webpackBaseConfig, {
  mode: 'development',
  devtool: '#cheap-module-eval-source-map',
  output: {
    publicPath: '/', // if you don't put the "/" here, you get this error: Uncaught SyntaxError: Unexpected token <"
    filename: '[name].[hash:8].js'
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          'thread-loader',
          'cache-loader',
          'vue-style-loader',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true
            }
          },
          'less-loader'
        ]
      }
    ]
  },
  devServer: {
    // clientLogLevel: 'warning',
    inline: true,
    hot: true,
    contentBase: './',
    compress: true,
    host: config.dev.host,
    port: config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay,
    quiet: true,
    historyApiFallback: {
      rewrites: [
        {
          from: /.*/,
          to: path.posix.join(config.dev.assetsPublicPath, 'index.html')
        }
      ]
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin()
  ]
});

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
          compilationSuccessInfo: {
              messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
          },
          onErrors: config.dev.notifyOnErrors ?
              utils.createNotifierCallback() :
              undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
