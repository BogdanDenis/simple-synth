import Vue from 'vue';

import App from './App';
import { store } from './store';

const vm = new Vue({
	el: '#root',
  store,
	template: '<App />',
	components: { App },
});
