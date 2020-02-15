import WASMLoader from "@/loaders/WASMLoader";

const install = async (Vue, options = {}) => {
    // Initialize the $wasm extension to the Vue object
    Vue.prototype.$wasm = {};

    await Promise.all(
        // Load each WASM module
        Object.entries(options.modules).map(([moduleName, { js: jsLinkageModule, wasm: wasmModule, exports: exportMappings }]) => {
            return new Promise((resolve, reject) => {
                WASMLoader(jsLinkageModule, wasmModule, (err, loadedModule) => {
                    if (err) return reject(err);

                    Vue.prototype.$wasm[moduleName] = loadedModule;

                    resolve();
                });
            });
        })
    );

    await Vue.nextTick();
};

export default install;
