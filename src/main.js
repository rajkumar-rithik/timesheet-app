import Vue from "vue";
import App from "./App.vue";
import router from './router'
import vuetify from "./plugins/vuetify";
import VCalendar from 'v-calendar';

Vue.config.productionTip = false;

Vue.use(VCalendar, {
    componentPrefix: 'vc', // Use <vc-calendar /> instead of <v-calendar />
});

new Vue({
    router,
    vuetify,
    render: h => h(App)
}).$mount("#app");