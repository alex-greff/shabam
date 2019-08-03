import Vue from "vue";
import VueAxios from "vue-axios";
import VueWasm from "vue-wasm";
import axios from "axios";

// App imports
import App from "@/App.vue";
import router from "@/router";
import store from "@/store";

// Wasm modules
import FingerprintModule from "@WASM/fingerprint.wasm";

// Note: this aysnc function closure is needed for the WASM modules to load before the app is initialized
(async function() {
    // Load WASM modules
    await VueWasm(Vue, {
        modules: {
            fingerprint: FingerprintModule
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