const webpack = require("webpack");
const path = require("path");

function resolve(dir) {
    return path.join(__dirname, dir);
}

module.exports = {
    devServer: {
        disableHostCheck: true,
        watchOptions: {
            poll: true
        },
    },
    lintOnSave: false,
    // chainWebpack: config => config.resolve.extensions.delete('.wasm'),
    configureWebpack: {
        // output: {
        //     path: path.resolve(__dirname, "dist"),
        // },
        // browser: { 
        //     "fs": false
        // },
        node: {
            fs: "empty"
        },
        module: {
            rules: [
                // {
                //     test: /\.wasm$/,
                //     loaders: ['wasm-loader']
                // },
                {
                    test: /.*main-wasm\.js$/,
                    loader: "exports-loader"
                },
                {
                    test: /.*main-wasm\.wasm$/,
                    type: "javascript/auto",
                    loader: "file-loader",
                    // options: {
                    //     publicPath: "public/"
                    // }
                }
            ],
            // Needed to get wasm-loader working properly
            // Source: https://github.com/webpack/webpack/issues/6725
            defaultRules: [
                {
                    type: 'javascript/auto',
                    resolve: {}
                },
                {
                    test: /\.json$/i,
                    type: 'json'
                }
            ]
        },
        // plugins: [new webpack.IgnorePlugin(/(fs)/)],
        resolve: {
            alias: {
                "@WASM": resolve('wasm'),
                "@TEST-DATA": resolve('tests/data')
            }
        }
    }
}
