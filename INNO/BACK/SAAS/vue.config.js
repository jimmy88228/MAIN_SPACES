const path = require("path");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
function resolve(dir) {
    return path.join(__dirname, dir);
}
module.exports = {
    baseUrl: process.env.NODE_ENV === "production" ? "./" : "/",
    lintOnSave: false,
    productionSourceMap: false,
    css: {
        sourceMap: true
    },
    devServer: {
        port: 8080, // 端口号
        host: "0.0.0.0"
    },
    configureWebpack: config => {
        config.externals = {
            ...(config.externals || {}),
            vue: "Vue",
            iview: "iView"
        };
        if (process.env.NODE_ENV === "production") {
            config.plugins.push(
                new UglifyJsPlugin({
                    uglifyOptions: {
                        compress: {
                            warnings: false,
                            drop_debugger: true,
                            drop_console: true
                        }
                    },
                    sourceMap: false,
                    parallel: true
                })
            );
        } else {
            config.devtool = "eval-source-map";
        }
    },
    chainWebpack: config => {
        config.resolve.alias.set("@", resolve("src")).set("assets", resolve("src/assets"));
    }
};
