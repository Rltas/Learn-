<template>
    <div id="template-syntax">
      <span v-once v-show="msg ? true : false">message: {{msg}} {{Math.max(4,3,5,6)}}</span>
      <p class="dynamic-order" @[someAttr] = "doSomeThing">动态指令</p>
      <ol>
        <li>1</li>
        <li>This is test Jinye ni hui bu hui lai？ </li>
      </ol>
    </div>
</template>

<script>
export default {
  data() {
    return {
      msg: '模板',
      someAttr: 'click'
    }
  },
  created() {
      // setTimeout(this.doSomeThing,2000,'ceshi')
  },
  mounted() {
    this.msg = '语法';
    window.addEventListener('scroll', _.debounce(this.doSomeThing,1000), false)
  },
  methods: {
    doSomeThing(val) {
      console.log(123)
    }
  }
}
</script>

<style lang="less" scoped>
  #template-syntax {
    width: 85%;
    height: 11568px;
    ol {
      > li {
        color: blue;
        font-variant: small-caps;
      }
    }
  }
</style>