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
    configureWebpack: {
        node: {
            fs: "empty"
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    include: [ // Only run in the wasm directory
                        resolve("wasm")
                    ],
                    // Export the "Module" variable from the JS file
                    loader: "exports-loader?Module" 
                },
                {
                    test: /\.wasm$/,
                    type: "javascript/auto",
                    loader: "file-loader"
                }
            ],
        },
        resolve: {
            alias: {
                "@WASM": resolve("wasm"),
                "@TEST-DATA": resolve("tests/data")
            }
        }
    }
}
