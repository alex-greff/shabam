import { Component, Vue } from 'vue-property-decorator';

import NavBar from "@/components/NavBar/NavBar.vue";

@Component({
    components: {
        NavBar
    }
})
export default class App extends Vue {

}