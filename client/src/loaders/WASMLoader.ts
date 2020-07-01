
// @ts-ignore
import MainModuleJS from "@WASM/main-wasm.js";
// @ts-ignore
import MainModuleWASM from "@WASM/main-wasm.wasm";

// const MainModuleJS = require("@WASM/main-wasm.js");

type ModuleType = "main";

// console.log(MainModuleJS);

export const loadWasmModule = async (module: ModuleType) => {
    console.log(MainModuleJS);

    _loadWasmModule(MainModuleJS, MainModuleWASM, (err, module) => {
        if (err) {
            console.error(err);
        } else {
            console.log("Wasm Module", module);
            module._test(5);
        }
    });
};

function _loadWasmModule(jsLinkageModule: (options: any) => any, wasmModule: any, cb: (err: any, module: any) => unknown) {
    try {
        const loadedModule = jsLinkageModule({
            locateFile(path: any) {
                if (path.endsWith(".wasm")) {
                    return wasmModule;
                }
                return path;
            }
        });

        loadedModule.onRuntimeInitialized = () => {
            cb(null, loadedModule);
        }
    } catch(err) {
        cb(err, null);
    }
}