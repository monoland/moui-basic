import Vue from 'vue';
import { markRaw } from 'vue';
import { createPinia, PiniaVuePlugin } from 'pinia';
import App from './App.vue';
import vuetify from '@plugins/vuetify';
import router from '@plugins/router';
import RequestPlugin, { RequestInstance } from '@plugins/request';
import StoragePlugin, { StorageInstance } from '@plugins/storage';
import registerWorker from '@workers/register-sw';

Vue.config.productionTip = false;
Vue.use(PiniaVuePlugin);
Vue.use(RequestPlugin);
Vue.use(StoragePlugin);

const pinia = createPinia();

pinia.use(({ pinia, store }) => {
    store.$http = markRaw(RequestInstance);
    store.$router = markRaw(router);
    store.$storage = markRaw(StorageInstance);
    store.$snackbar = ({ color, text }) => {
        pinia.state.value.system.snackbar.color = color ? color : 'error';
        pinia.state.value.system.snackbar.text = text;
        pinia.state.value.system.snackbar.state = true;
    };
});

const components = require.context('@components/desktop', true, /index.vue$/);
components.keys().forEach((component) => {
    const buffObject = components(component).default;

    Vue.component(
        buffObject.name, 
        () => import(/* webpackChunkName: "desktop" */ '@components/desktop/' + component.replace('./', ''))
    );
});

new Vue({
	vuetify,
	router,
	pinia,
	render: h => h(App)
}).$mount('#monoland');

if (process.env.NODE_ENV === 'production') {
    registerWorker();
}