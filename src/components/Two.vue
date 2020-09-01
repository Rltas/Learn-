<template>
  <div id="two">
    子组件
    <Three v-bind="$attrs" v-on="$listeners"></Three>
    <span @click="son">{{age}}</span>
    <span>{{foo}}</span>
  </div>
</template>

<script>
  import Three from './Three.vue'
  export default {
    props: ['age'],
    inject: ['foo', 'highOrder'],
    components: {
      Three
    },
    data() {
      return {

      }
    },
    mounted() {
      console.log(this.$attrs,'值')
      console.log(this.highOrder())
    },
    methods: {
      son() {
        this.$emit('son')
      }
    }
  }
</script>

<style lang="less">

</style>