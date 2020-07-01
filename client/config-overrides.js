const path = require("path");
const { 
    addWebpackAlias, 
    useEslintRc, 
    adjustStyleLoaders, 
    addWebpackModuleRule,
    addWebpackPlugin,
    addBabelPlugin, 
} = require("customize-cra");

const WorkerPlugin = require('worker-plugin');

function resolve(dir) {
    return path.join(__dirname, dir);
}

module.exports = function override(config, env) {
    config = addWebpackAlias({
        ["@"]: resolve("src"),
        ["@WASM"]: resolve("src/wasm/build")
    })(config);

    // https://github.com/timarney/react-app-rewired/issues/396
    config = useEslintRc(path.resolve(__dirname, '.eslintrc.js'))(config);

    // https://github.com/facebook/create-react-app/issues/7756
    // and this
    // https://github.com/arackaf/customize-cra/blob/master/api.md#adjuststyleloaderscallback
    config = adjustStyleLoaders(({ use }) => {
        const [, , , , sass] = use;

        if (sass) {
            sass.options.prependData = `@import "@/styling/global.scss";`;
        }
    })(config);

    config = addWebpackPlugin(new WorkerPlugin())(config);

    config = addWebpackModuleRule({
        test: /.js$/,
        include: [ // Only run in wasm build directory
            resolve("src/wasm/build")
        ],
        loader: "exports-loader",
        options: {
            exports: "default Module"
        }
    })(config);

    // TODO: remove and uninstall plugins
    // config = addBabelPlugin("@babel/plugin-syntax-import-meta")(config);
    // config = addBabelPlugin(["@babel/plugin-proposal-decorators", { "legacy": true }])(config);
    // config = addBabelPlugin(["@babel/plugin-proposal-class-properties", { "loose": true }])(config);

    config = addWebpackModuleRule({
        test: /.wasm$/,
        type: "javascript/auto",
        loader: "file-loader"
    })(config);

    return config;
}