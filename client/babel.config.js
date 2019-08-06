module.exports = {
    presets: [
        '@vue/app'
    ],
    // This fixes the "Cannot assign to read only property 'exports' of object '#<Object>'" error
    // Reference: https://stackoverflow.com/questions/42449999/webpack-import-module-exports-in-the-same-module-caused-error
    "sourceType": "unambiguous"
}
