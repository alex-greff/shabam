
interface JsLinkageModule {
    default: (Module: any) => any;
}

interface WasmModule {
    default: any;
}

type ModuleLoadedCb = (err: any, module: any) => unknown;

/**
 * A wrapper class for loading WebAssembly modules.
 */
export class WasmModuleWrapper<M = any> {
    private jsLinkageModule: Promise<JsLinkageModule>;
    private wasmModule: Promise<JsLinkageModule>;

    private _loaderPromise: Promise<void> | null;
    private _err: any | null;
    private _module: M | null;
    private _status: "uninitialized" | "loading" | "load-succeeded" | "load-failed";

    constructor(jsLinkageModule: Promise<JsLinkageModule>, wasmModule: Promise<WasmModule>) {
        this.jsLinkageModule = jsLinkageModule;
        this.wasmModule = wasmModule;
        this._loaderPromise = null;
        this._err = null;
        this._module = null;
        this._status = "uninitialized";
    }

    /**
     * Initializes the WebAssembly module. Returns a promise that resolves when
     * the module is loaded or rejects if an error occurred.
     */
    public async initialize(): Promise<void> {
        this._status = "loading";

        this._loaderPromise = new Promise((resolve, reject) => {
            loadWasmModule(this.jsLinkageModule, this.wasmModule, (err, module) => {
                if (err) {
                    this._err = err;
                    this._status = "load-failed";
                    reject();
                } else {
                    this._module = module;
                    this._status = "load-succeeded";
                    resolve();
                }
            });
        });

        return this._loaderPromise;
    }

    /**
     * The error message, if encountered.
     */
    get error() {
        return this._err;
    }

    /**
     * The WebAssembly module instance, if loaded.
     */
    get module() {
        return this._module;
    }

    /**
     * Returns the loading status of the module.
     */
    get status() {
        return this._status;
    }

    /**
     * The loader promise.
     */
    get loaderPromise() {
        return this._loaderPromise;
    }
}

/**
 * Loads a WebAssembly file generated by emscripten. Calls the callback with the
 * module when done loading.
 * 
 * @param jsLinkageModule The linkage JS file generated by emscripten.
 * @param wasmModule The wasm binary.
 * @param cb The callback.
 */
export async function loadWasmModule(
    jsLinkageModule: Promise<JsLinkageModule>, 
    wasmModule: Promise<WasmModule>, 
    cb: ModuleLoadedCb) 
{

    const jsLinkageFunc = (await jsLinkageModule).default;
    const wasmFile = (await wasmModule).default;

    try {
        const loadedModule = jsLinkageFunc({
            locateFile(path: any) {
                if (path.endsWith(".wasm")) {
                    return wasmFile;
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
