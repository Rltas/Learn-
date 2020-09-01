<template>
  <div id="condition-render">
    condition-render
    <p v-if="Math.random() > 0.5">条件渲染为真</p>
    <p v-else>条件渲染为假</p>
    <template v-if="loginType">
      <label>UserName</label>
      <input type="text" placeholder="输入姓名" v-model="name" key="name">
    </template>
    <template v-else>
      <label>Phone</label>
      <input type="text" placeholder="请输入电话" v-model="phone" key="phone">
    </template>
    <button @click="toggleType">toggle loginType</button>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        loginType: true,
        name: '',
        phone: ''
      }
    },
    methods: {
      toggleType() {
        this.loginType = !this.loginType
      }
    }
  }
</script>

<style lang="less" scoped>
  button {
    -webkit-appearance: none
  }
</style>