import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
      cartNum: '',
      money_sign: '',
      fix: null
  },
  mutations: {
      // cartNumCount(state) {
      //    state.cartNum = localStorage.cartInfo ? JSON.parse(localStorage.cartInfo).length : ''
      // }
  },
  getters: {
      // cartNumCount: state => {
      //    return state.cartNum = localStorage.cartInfo ? JSON.parse(localStorage.cartInfo).length : ''
      // }
  },
  actions: {

  }
})
