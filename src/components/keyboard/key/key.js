import Vue from 'vue';

import './key.sass';

const template = `
	<li
		class="key"
		v-bind:class="classes"
		v-on:click="onClick(note)"
	>
		{{ note }}
	</li>
`;

export const Key = Vue.component('key', {
	name: 'key',
	template,
	props: ['note', 'onPlay'],
	computed: {
		classes: function() {
			return {
				sharp: this.note.indexOf('#') !== -1,
			};
		},
	},
	methods: {
		onClick: function(note) {
			this.onPlay(note);
		},
	},
});
