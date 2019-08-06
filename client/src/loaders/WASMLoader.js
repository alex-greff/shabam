// A helper function used for converting an exports mapping array to the object form
function generateExportsMappings(i_aExportsMapping) {
    return i_aExportsMapping.reduce((acc, i_sExportName) => ({
        ...acc,
        [i_sExportName]: i_sExportName
    }), {});
}

// Takes the given js linkage module and wasm module and attempts to load and return the given export mappings
export default (jsLinkageModule, wasmModule, exportMappings) => {
    return new Promise((resolve, reject) => {
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
                // TODO: might want to tighten validation with Yup
                if (typeof exportMappings !== "object") {
                    throw new Error("Export mappings must be an object or array");
                }

                // Get the correct export mapping format
                // If exportMappings is an array then we need to convert it to the proper object form 
                let oExportMappings = (Array.isArray(exportMappings)) ? generateExportsMappings(exportMappings) : exportMappings;
                
                // Get the export mappings
                const oExports = Object.entries(oExportMappings).reduce((acc, [i_sMappingTarget, i_sMappingName]) => {
                    return {
                        ...acc,
                        [i_sMappingName]: loadedModule[i_sMappingTarget]
                    }
                }, {});

                return resolve(oExports);
            };
        } catch(err) {
            return reject(err);
        }
    });
};