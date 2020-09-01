<template>
  <div id="introduce">
    <span :title="message">
      {{message}}
    </span>
    <div id="hidden-set">
      <div id="hidden-child">

      </div>
    </div>
    <ol>
      <li @click="ReverseMessage">ReverseMessage</li>
      <li><input type="text" v-model="message"></li>
    </ol>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        message: '信息'
      }
    },
    
    created() {

    },
    methods: {
      ReverseMessage() {
        // this.message = [...this.message].reverse().join('');
        this.message = this.message.split('').reverse().join('');
      }
    }
  }
</script>

<style lang="less" scoped>
  #introduce {
    color: @color;
    font-size: @font;
    #hidden-set {
      width: 1rem;
      height: 1rem;
      border: 0.01rem solid hotpink;
      display: none;
      #hidden-child {
        width: 0.5rem;
        height: 0.5rem;
        background: black;
      }
    }
  }
</style>