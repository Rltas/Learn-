import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: 'Rlats',
    count: 0,
    lists: [1, , 2, 3, 4, 5, 6],
    idList: [{
      id: 1,
      name: 'Java'
    }, {
      id: 2,
      name: 'JavaScript'
    }]
  },
  mutations: {
    increment(state, n) {
      setTimeout(() => {
        state.count += n
        console.log(state.count)
      }, 2000)
    }
  },
  getters: {
    todoList(state) {
      return state.lists.filter((value, index, array) => {
        return value % 2 == 0
      })
    },
    idTodoList: state => n => {
      return state.idList.find((value, index, array) => {
        return value.id == n
      })
    }
  },
  actions: {
    increment({commit}, n) {
      return new Promise((resolve, reject) => {
        commit('increment', n)
        resolve(123)
      })
    }
  }
})
