/* @flow */
import Vue from 'vue/dist/vue.js';

import Vuenut from 'vuenut';
// eslint-disable-next-line
import VuenutCSS from 'vuenut/dist/vuenut.css';

// eslint-disable-next-line
import App from './App.vue';
import './registerServiceWorker';
import store from './store';

Vue.config.productionTip = false;

Vue.use(Vuenut);

new Vue({
  render: h => h(App),
  store
}).$mount('#app');
