const path = require("path");
const { DefinePlugin } = require("webpack");
const VueLoaderPlugin = require("vue-loader/lib/plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const { getIfUtils } = require("webpack-config-utils");
const { truncate } = require("fs");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");
const stylesHandler = MiniCssExtractPlugin.loader;

const __context = path.resolve(__dirname, "..");
module.exports = (env) => {
    const NODE_ENV = process.env.NODE_ENV;
    const envJson = JSON.parse(JSON.stringify(env));
    if(NODE_ENV){
        envJson[NODE_ENV] = true;
    }
    const { ifProduction, ifDev } = getIfUtils(envJson);
    return {
        cache: {
            type: "filesystem",
            buildDependencies: {
                config: [__filename],
            },
        },
        context: __context,
        devtool: ifProduction(
            "cheap-module-source-map",
            "eval-cheap-module-source-map"
        ),
        // Js入口配置，可配置多个实现多入口（多页）应用
        entry: {
            main: ["./src/main.js"],
        },
        mode: ifProduction("production", "development"),
        devServer: {
            static: {
                directory: path.resolve(__context, "public"),
            },
            hot: true,
            compress: true,
        },
        // 打包输出配置
        output: {
            path: path.resolve(__context, "dist"),
            publicPath: "/",
            clean: true,
            ...ifProduction(
                {
                    filename: "dist/js/[name].[chunkhash:8].js",
                    chunkFilename: "dist/js/[id].[chunkhash:8].js",
                },
                {
                    filename: "dist/js/[name].js",
                    chunkFilename: "dist/js/[name].js",
                }
            ),
        },
        // 引用路径的解析配置
        resolve: {
            extensions: [".js", ".jsx", ".vue"],
            // enforceExtension: true, // 强制要求开发者提供明确的模块后缀名，这种做法侵入性太强，不太推荐
            modules: ["node_modules"],// [path.resolve(__dirname, 'node_modules')]主动关闭逐层搜索功能 | 开启逐层搜索功能 ["node_modules"],
            alias: {
                vue: "vue/dist/vue.esm.js",
                "@": path.resolve("src"),
                "@rs": path.resolve("src/assets"),
            },
            fallback: {
                "crypto": require.resolve("crypto-browserify"),
                "buffer": require.resolve("buffer/"),
                "stream": require.resolve("stream-browserify"),
                "fs": false
            }
        },
        performance: {
            maxEntrypointSize: 50000000,
            maxAssetSize: 50000000,
        },
        optimization: {
            // chunkIds: ifProduction("deterministic", "named"),
            // moduleIds: ifProduction("deterministic", "named"),
            usedExports: true, // 只导出那些外部使用了的那些成员
            concatenateModules: true,
            sideEffects: true,
            minimize: false, //ifProduction(true, false),
            minimizer: [
                // `...`, //继承内部默认的压缩插件
                new TerserPlugin({ // 用于压缩打包后的js代码
                    parallel: 2,
                }),
                new CssMinimizerPlugin(), //Css压缩插件
            ],
            splitChunks: {
                cacheGroups: {
                    // 主要依赖
                    main: {
                        name: "vendor.main",
                        chunks: "all",
                        test: /[\\/]node_modules[\\/](vue|vue-router|vuex|axios)/,
                        reuseExistingChunk: true,
                        priority: 2,
                    },
                    iview: {
                        name: "vendor.iview",
                        chunks: "all",
                        test: /[\\/]node_modules[\\/](view-design)/,
                        reuseExistingChunk: true,
                        priority: 2,
                    },
                    videojs: {
                        name: "vendor.videojs",
                        chunks: "all",
                        test: /[\\/]node_modules[\\/](video\.js|vue-video-player)/,
                        reuseExistingChunk: true,
                        priority: 2,
                    },
                    area: {
                        name: "vendor.area",
                        chunks: "all",
                        test: /[\\/]node_modules[\\/](iview-area)/,
                        reuseExistingChunk: true,
                        priority: 2,
                    },
                    jquery: {
                        name: "vendor.jquery",
                        chunks: "all",
                        test: /[\\/]node_modules[\\/](jquery|jquery.actual)/,
                        reuseExistingChunk: true,
                        priority: 2,
                    },
                    echarts: {
                        name: "vendor.echarts",
                        chunks: "all",
                        test: /[\\/]node_modules[\\/](echarts|echarts-gl)/,
                        reuseExistingChunk: true,
                        priority: 2,
                    },
                    vendor: {
                        name: "vendor",
                        chunks: "all",
                        test: /[\\/]node_modules[\\/]/,
                        reuseExistingChunk: true,
                        priority: 1,
                    },
                },
            },
            runtimeChunk: {
                name: (entrypoint) => `${entrypoint.name}.rt`,
            },
        },
        externals: {
            './cptable': 'var cptable'
        },
        // externals: {
        //     echarts: "echarts",
        //     "view-design": "iview",
        // },
        // 插件
        plugins: [
            // Vue
            new VueLoaderPlugin(),
            // Web应用的关键，与模块（lib）打包不同，Web应用需要Html页承载。
            // 可配置多个来实现多页应用。
            new HtmlWebpackPlugin({
                template: "public/index.html",
                filename: "index.html",
                // 引用url加上Hash参数，解决浏览器缓存问题
                // hash: true,
                // 指定入口
                chunks: ["main"],
            }),
            // //环境变量
            new DefinePlugin({
                "process.env": {
                    BASE_URL: '"/"',
                    BRAND_CODE: JSON.stringify(process.env.BRAND_CODE)
                },
            }),
            ...ifProduction(
                [
                    //生产环境才需要拷贝静态资源
                    new CopyPlugin({
                        patterns: [
                            {
                                from: "public",
                                to: "./",
                                toType: "dir",
                                globOptions: {
                                    dot: true,
                                    gitignore: true,
                                    ignore: ["**/.DS_Store", "**/index.html"],
                                },
                            },
                        ],
                    }),
                    //生产环境才独立打包css文件
                    new MiniCssExtractPlugin({
                        ignoreOrder: true,
                        filename: "css/[name].[contenthash:8].css",
                        chunkFilename: "css/[id].[contenthash:8].css",
                    }),
                    // new BundleAnalyzerPlugin()
                ],
                []
            ),
            new NodePolyfillPlugin()
        ],
        module: {
            // noParse: /vue|lodash|react/,
            rules: [
                {
                    test: /\.mjs$/,
                    type: "javascript/auto",
                    include: /node_modules/,
                },
                {
                    test: /\.(js|jsx)$/i,
                    exclude: /(node_modules|bower_components)/,
                    use: [
                        "thread-loader",
                        {
                            loader: "babel-loader",
                            options: {
                                cacheDirectory: true,
                            },
                        },
                    ],
                },
                {
                    test: /\.vue$/i,
                    use: [
                        "thread-loader",
                        "vue-loader",
                    ],
                },
                {
                    test: /\.less$/i,
                    use: [
                        ifProduction(stylesHandler, "vue-style-loader"),
                        "css-loader",
                        "postcss-loader",
                        {
                            loader: "less-loader",
                            options: {
                                lessOptions: {
                                    javascriptEnabled: true,
                                    strictMath: false,
                                }
                            }
                        }
                        
                    ],
                },
                {
                    test: /\.css$/i,
                    use: [
                        ifProduction(stylesHandler, "vue-style-loader"),
                        "css-loader",
                        "postcss-loader",
                    ],
                },
                {
                    test: /\.(png|jpg|gif)$/i,
                    type: "asset/resource",
                    generator: {
                        filename: "assets/images/[name][ext]",
                    },
                },
                {
                    test: /\.(eot|svg|ttf|woff|woff2)$/i,
                    type: "asset/resource",
                    generator: {
                        filename: "assets/fonts/[name][ext]",
                    },
                },
                {
                    test: /\.swf$/,
                    type: "asset/resource",
                    generator: {
                        filename: "assets/media/[name][ext]",
                    },
                },
            ],
        },
        watchOptions: {
            ignored: /node_modules/ // 忽略这些文件webpack 监听
        }
    };
};