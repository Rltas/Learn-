<template>
  <div id="event">
      <p @click="addId">{{id}}</p>
      <p>{{name}}</p>
      <slot></slot>
  </div>
</template>

<script>
  export default {
    props: ['id', 'name'],
    data() {
      return {

      }
    },
    methods: {
      addId() {
        this.id++;
        console.log(this.id)
      }
    }
  }
</script>

<style lang="less">
  
</style>