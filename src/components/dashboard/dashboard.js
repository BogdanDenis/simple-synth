import Vue from 'vue';
import {
  mapState,
  mapActions,
} from 'vuex';

import './dashboard.sass';

const template = `
  <div class="dashboard">
    <div class="dashboard__keyboard-speed dashboard-item">
      <p class="dashboard__keyboard-speed__title">Animation speed: </p>
      <input
        type="number"
        min="1"
        v-bind:value="animationSpeed"
        v-on:change="handleSpeedChange"
      />
    </div>
    <div class="dashboard__keyboard-speed dashboard-item">
      <p class="dashboard__keyboard-speed__title">Base note: </p>
      <input
        type="text"
        v-bind:value="baseNote"
        v-on:change="handleBaseNoteChange"
      />
    </div>
  </div>
`;

export const Dashboard = Vue.component('dashboard', {
  name: 'dashboard',
  template,
  computed: {
    ...mapState([
      'animationSpeed',
      'baseNote',
    ]),
  },
  methods: {
    handleSpeedChange: function(e) {
      const speed = parseFloat(e.target.value);
      this.setKeyboardSpeed(speed);
    },
    handleBaseNoteChange: function(e) {
      const baseNote = e.target.value;
      this.setBaseNote(baseNote);
    },
    ...mapActions([
      'setKeyboardSpeed',
      'setBaseNote',
    ]),
  },
});
