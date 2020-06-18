const path = require("path");
const { 
    addWebpackAlias, 
    useEslintRc, 
    adjustStyleLoaders, 
    addWebpackModuleRule,
    addWebpackPlugin,
} = require("customize-cra");

const WorkerPlugin = require('worker-plugin');


module.exports = function override(config, env) {
    config = addWebpackAlias({
        ["@"]: path.resolve(__dirname, "src")
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

    return config;
}