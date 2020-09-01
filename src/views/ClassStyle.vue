<template>
  <div id="class-style">
    class-style
    <p :class="[{test_1: test}, 'test_2']">数组模式</p>
    <p :style="testStyle">style变量模式</p>
    <p :style= "[testStyle_1, testStyle_2]">style数组模式</p>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        test: true,
        testStyle: {
          color: 'blue'
        },
        testStyle_1: {
          fontSize: '0.21rem',
          color: 'hotpink'
        },
        testStyle_2: {
          background: 'blue'
        }
      }
    }
  }
</script>

<style lang="less">
  .test_1 {
    color: @color;
  }

  .test_2 {
    font-size: @font;
  }
</style>