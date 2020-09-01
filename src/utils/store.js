import Vue from 'vue'

 export const store = Vue.observable({
  userInfo: {},
  count: 0
})

export const mutations = {
  setUserInfo(val) {
    store.userInfo = val
  }
}