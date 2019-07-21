import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import App from "@/App.vue";
import router from "@/router";
import store from "@/store";

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
