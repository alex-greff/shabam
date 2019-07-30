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
        }
    }
}
