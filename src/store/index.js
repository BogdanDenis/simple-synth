import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    animationSpeed: 1,
    baseNote: 'c3',
    keyboardSize: 24,
  },
  mutations: {
    setKeyboardSpeed (state, payload) {
      state.animationSpeed = payload;
    },
    setBaseNote (state, note) {
      state.baseNote = note;
    },
  },
  actions: {
    setKeyboardSpeed({ commit }, payload) {
      commit('setKeyboardSpeed', payload);
    },
    setBaseNote({ commit }, payload) {
      commit('setBaseNote', payload);
    }
  }
});
