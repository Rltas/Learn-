<template>
  <div id="sun">
    <slot name="header">
      默认头部
    </slot>
    <slot>
      默认内容
    </slot>
    <slot name="footer">
      默认底部
    </slot>
    <slot :user="user" name="scope">
      默认作用域
    </slot>
    {{id}}
  </div>
</template>

<script>
  export default {
    props: {
      id: {
        type: Number,
        default: 1,
        required: true,
        validator: (val) => {
          return val > 0
        }
      }
    },
    inject: ['foo'],
    data() {
      return {
        user: [{
          name: 'Wujie',
          age: '26'
        }, {
          name: 'Kiy',
          age: '27'
        }]
      }
    },
    created() {
      console.log(this.foo)
    }
  }
</script>