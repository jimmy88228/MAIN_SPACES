const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const AutoDllPlugin = require('autodll-webpack-plugin');
// const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

const config = {
    stats: 'errors-only',
    entry: {
      main: path.join(__dirname, '../src/main.js')
    },
    output: {
      path: path.join(__dirname, '../dist')
    },
    module: {
      rules: [
          // 关闭语法检测
          // {
          //     test: /\.(vue|js|jsx)$/,
          //     loader: 'eslint-loader',
          //     include: /src/,
          //     enforce: 'pre'
          // },
          {
              test: /\.vue$/,
              use: ['thread-loader', 'cache-loader', 'vue-loader']
          },
          {
            test: /\.(jsx|js)$/,
            use: ['babel-loader?cacheDirectory'],
            exclude: /node_modules/
          },
          {
            test: /iview.src.*?js$/,
            use: ['babel-loader?cacheDirectory'],
            exclude: /node_modules/
          },
          {
            test: /\.css$/,
            use: ['vue-style-loader', 'css-loader', 'postcss-loader']
          },
          {
            test: /\.(gif|jpg|png)\??.*$/,
            loader: 'url-loader',
            options: {
              esModule: false,
              limit: 1024,
              name: 'dist/resources/images/[name].[ext]'
            }
          },
          {
            test: /\.(woff|svg|eot|ttf)\??.*$/,
            loader: 'url-loader',
            options: {
              limit: 1024,
              name: 'dist/resources/fonts/[name].[ext]'
            }
          },
		  {
			  test: /\.swf$/,
			  loader: 'url-loader',
			  options:{
				  limit: 10000
			  }
		  }
      ]
    },
    plugins: [
      new VueLoaderPlugin(),
      // new HardSourceWebpackPlugin(),
      // new HardSourceWebpackPlugin.ExcludeModulePlugin([{
      //     test: /mini-css-extract-plugin[\\/]dist[\\/]loader/
      //   }
      // ])
      // new AutoDllPlugin({
      //   inject: true,
      //   filename: '[name].dll.js',
      //   context: path.resolve(__dirname, '../'),
      //   path: 'dist/js/dll',
      //   entry: {
      //     vendor: [
      //       'vue',
      //       'view-design'
      //     ]
      //   }
      // }),
      new HtmlWebpackPlugin({
        title: '管理后台',
        favicon: path.join(__dirname, '../icon.ico'),
        template: path.join(__dirname, 'index.html')
      })
    ],
    resolve: {
        extensions: ['.js', '.vue'],
        alias: {
            'vue': 'vue/dist/vue.esm.js',
            '@': path.join(__dirname, '../src'),
            '@rs': path.join(__dirname, '../static')
        }
    }
};
module.exports = config;
