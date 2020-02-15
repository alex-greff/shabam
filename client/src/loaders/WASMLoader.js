// Takes the given js linkage module and wasm module and attempts to load and return the given export mappings
// Note: for some reason a promise can't be used here as calling resolve(loadedModule)
// hangs the entire chrome instance (I suspect that its trying to make a copy of the 
// module or something)
export default (jsLinkageModule, wasmModule, cb) => {
    try {
        const loadedModule = jsLinkageModule({
            locateFile(path) {
                if(path.endsWith('.wasm')) {
                    return wasmModule;
                }
                return path;
            }
        });

        loadedModule.onRuntimeInitialized = () => {
            return cb(null, loadedModule);
        };
    } catch(err) {
        cb(err, null);
    }
};