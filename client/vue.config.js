module.exports = {
    devServer: {
        // These flags allow for the dev server to accept the requests routed through the reverse proxy
        disableHostCheck: true,
        watchOptions: {
            poll: true
        },
        progress: false
    },
    lintOnSave: false
}
