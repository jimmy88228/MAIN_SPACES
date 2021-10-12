const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.base.config.js');
const path = require('path');
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const smp = new SpeedMeasurePlugin();

const config = merge(webpackBaseConfig, {
    mode: 'production',
    output: {
      publicPath: '/',
      filename: 'dist/js/[name].[chunkhash:8].js',
    },
    module: {
      rules: [
        {
          test: /\.less$/,
          use: [
            MiniCssExtractPlugin.loader,
            'cache-loader',
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
    plugins: [
        new webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: '"production"'
          }
        }),
        new MiniCssExtractPlugin({
          filename: 'dist/css/[name].[contenthash:8].css'
        })
    ],
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /node_modules/,
            chunks: 'initial',
            name: 'vendor'
          }
        }
      },
      runtimeChunk: true
    }
});
module.exports = config;
module.exports = smp.wrap(config);
