import Vue from 'vue';

import {
	Keyboard,
  Dashboard,
} from './components';

import './App.sass';

const template = `
	<div id="app">
	  <Dashboard />
		<keyboard />
	</div>
`;

export default Vue.component('app', {
	name: 'App',
	template,
	components: {
	  Keyboard,
    Dashboard,
  },
});
