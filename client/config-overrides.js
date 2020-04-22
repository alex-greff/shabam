const path = require("path");
const { addWebpackAlias, useEslintRc } = require("customize-cra");


module.exports = function override(config, env) {
    config = addWebpackAlias({
        ["@"]: path.resolve(__dirname, "src")
    })(config);

    // https://github.com/timarney/react-app-rewired/issues/396
    config = useEslintRc(path.resolve(__dirname, '.eslintrc.js'))(config);

    return config;
}