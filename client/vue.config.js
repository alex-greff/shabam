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
        module: {
            rules: [
                {
                    test: /\.wasm$/,
                    loaders: ['wasm-loader']
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
        resolve: {
            alias: {
                "@WASM": resolve('wasm'),
                "@TEST-DATA": resolve('tests/data')
            }
        }
    }
}
