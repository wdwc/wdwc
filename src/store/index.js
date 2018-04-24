/* @flow */
import Vue from 'vue/dist/vue.js'
import Vuex from 'vuex'

// import globeCoordinateStore from './globeCoordinateStore';
import wikiDataStore from './QandPStore'
Vue.use(Vuex)

// import vuexCache from 'vuex-cache'

const debug = process.env.NODE_ENV !== 'production'

const getters = {
  pending () {
    return true
  }
}

export default new Vuex.Store({
  getters,
  plugins: [],
  modules: {
    wikiDataStore //    globeCoordinateStore
  },
  strict: debug
})
