import Vue from 'vue';

import { Keyboard } from './components';

import './App.sass';

const template = `
	<div id="app">
		<keyboard></keyboard>
	</div>
`;

export default Vue.component('app', {
	name: 'App',
	template,
	components: { Keyboard },
});
