module.exports = {
    devServer: {
        disableHostCheck: true,
        watchOptions: {
            poll: true
        },
    },
    lintOnSave: false,
    // browser: {
    //     "fs": false
    // },
    configureWebpack: {
        module: {
            // rules: [
            //     // Emscripten JS files define a global. With `exports-loader` we can 
            //     // load these files correctly (provided the global’s name is the same
            //     // as the file name).
            //     {
            //         test: /fibonacci\.js$/,
            //         loader: "exports-loader"
            //     },
            //     // wasm files should not be processed but just be emitted and we want
            //     // to have their public URL.
            //     {
            //         test: /fibonacci\.wasm$/,
            //         type: "javascript/auto",
            //         loader: "file-loader",
            //         options: {
            //             publicPath: "dist/"
            //         }
            //     }
            // ]



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
