<template>
  <div id="list">
    {{item}}测试组件
    {{id}}
    <p @click="customEvent">
      测试自定义事件
    </p>
  </div>
</template>

<script>
export default {
  props: ['item', 'id'],
  methods: {
    customEvent() {
      this.$emit('customEvent')
    }
  }
}
</script>