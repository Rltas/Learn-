<template>
  <div>
    <button @click="test">父子组件双向绑定</button>
    <p>{{onProps}}</p>
  </div>
</template>

<script>
export default {
  porps: {
    onProps: {
      type: String
    }
  },

  data() {
    return {

    }
  },

  methods: {
    test() {
      this.$emit('update:onProps', '测试父子组件双向绑定')
    }
  }
}
</script>