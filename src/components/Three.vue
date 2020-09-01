<template>
  <div id="three">
    孙子组件
    <span @click="grandSon">{{name}}</span>
  </div>
</template>

<script>
export default {
  props: ['name'],
  data() {
    return {

    }
  },
  methods: {
    grandSon() {
      this.$emit('grandSon')
    }
  }
}
</script>

<style lang="less">
  
</style>