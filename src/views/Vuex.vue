<template>
  <div id="vuex">
    vuex
    {{$store.state.token}}
    {{token}}
    <span @click="test(4)">{{$store.state.count}}</span>
    <span @click="addCount(3)">{{count}}</span>
    <ul>
      <li v-for="(item, index) in $store.getters.todoList" :key="index">{{item}}</li>
    </ul>
    <ul>
      <li v-for="(item, index) in todoList" :key="index">{{item}}</li>
    </ul>
    <ul>
      <li v-for="(item, index) in list(2)" :key="index">{{item}}</li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapMutations, mapGetters } from 'vuex'
export default {
  data() {
    return {

    }
  },
  created() {
    console.log(this.list(2))
  },
  computed: {
    ...mapState(['token', 'count']),
    ...mapGetters({
      list: 'idTodoList',
      todoList: 'todoList'
    })
  },
  methods: {
    ...mapMutations(['increment']),
    addCount(n) {
      // this.$store.commit('increment', n)
      this.increment(n)
    },
    test(n) {
      this.$store.dispatch('increment', 4).then((res) => {
        console.log(res)
      })
    }
  }
}
</script>

<style lang="less" scoped>
  
</style>