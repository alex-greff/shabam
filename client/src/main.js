import Vue from "vue";
import VueAxios from "vue-axios";
import VueWasm from "@/plugins/VueWasm";
import axios from "axios";

// App imports
import App from "@/App.vue";
import router from "@/router";
import store from "@/store";

// Wasm modules
import MainModuleJS from "@WASM/main-wasm.js";
import MainModuleWASM from "@WASM/main-wasm.wasm";

// Note 1: this aysnc function closure is needed for the WASM modules to load before the app is initialized
// Note 2: This will probably be changed in the future in order to display a loading page
(async function() {
    // Load WASM modules
    await VueWasm(Vue, {
        modules: {
            main: {
                js: MainModuleJS,
                wasm: MainModuleWASM,
                // Format: target to rename
                exports: { "_test": "test" }
            }
        }
    });

    Vue.config.productionTip = false;

    new Vue({
        router,
        store,
        render: h => h(App)
    }).$mount('#app');

    // Setup axios
    Vue.use(VueAxios, axios);

    // Setup audio context
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
})();