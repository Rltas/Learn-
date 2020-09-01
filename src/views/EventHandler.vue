<template>
  <div id="event-handler">
    event-handler
    <button @click="test($event,123)">Click Me</button>
    <form v-on:submit.prevent="onSubmit" action="www.baidu.com">
      <input type="submit" value="提交">
    </form>
    <button @click.prevent.left="ceshi">鼠标事件</button>
    <input type="text" v-model.lazy="testInput" @input="lazyInput">
  </div>
</template>

<script>
  export default {
    data() {
      return {
        testInput: '测试懒输入'
      }
    },
    methods: {
      test(event, val) {
        console.log(event.target, val)
      },
      onSubmit() {

      },
      ceshi() {
        console.log(123)
      },
      lazyInput() {
        console.log(this.testInput)
      }
    }
  }
</script>

<style lang="less" scoped>

</style>