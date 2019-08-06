import WASMLoader from "@/loaders/WASMLoader";

const install = async (Vue, options = {}) => {
    // Initialize the $wasm extension to the Vue object
    Vue.prototype.$wasm = {};

    await Promise.all(
        Object.entries(options.modules).map(async ([moduleName, { js: jsLinkage, wasm: wasmModule, exports: exportMappings }]) => {
            const loadedModule = await WASMLoader(jsLinkage, wasmModule, exportMappings);
            Vue.prototype.$wasm[moduleName] = loadedModule
        })
    );

    await Vue.nextTick();
};

export default install;
