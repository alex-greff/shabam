const path = require("path");
const { addWebpackAlias } = require("customize-cra");

module.exports = function override(config, env) {
    config = addWebpackAlias({
        ["@"]: path.resolve(__dirname, "src")
    })(config);

    return config;
}