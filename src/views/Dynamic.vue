<template>
  <div id="dynamic">
    动态参数{{id}}
    <ul>
      <li v-for="(item, index) in list" :key="index" @click="changeParams(item)">{{item}}</li>
    </ul>
    <div id="surname"></div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        id: '',
        list: [2, 3, 4]
      }
    },
    created() {
      this.id = this.$route.params.id;
      console.log(this.$router.currentRoute)
      console.log(this.$router.history.current.path)
      console.log(this.$router)
      console.log(this.$route)
    },
    methods: {
      changeParams(item) {
        this.$router.push({
          name: 'dynamic',
          params: {
            id: item
          }
        })
      }
    },
    watch: {
      '$route'(to, from) {
         this.id = this.$route.params.id
         //当参数改变时，执行某些东西
         console.log(to)
      }
    }
  }
</script>

<style lang="less" scoped>
  #surname {
    width: 3.75rem;
    height: 26rem;
    background: red;
  }
</style>