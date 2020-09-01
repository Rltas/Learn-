<template>
  <div id="login">
    <span @click="login">登录</span>
  </div>
</template>
<script>
export default {
  data() {
    return {

    }
  },
  methods: {
    login() {
      this.$router.push('/')
    }
  }
}
</script>