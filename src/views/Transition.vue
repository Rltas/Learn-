<template>
  <div id="transition">
    过渡效果
    <button @click="show = !show">
      toggle
    </button>
    <transition name="fade">
      <p v-if="show">Hello World</p>
    </transition>
    <input type="number" v-model.number="num" v-focus v-pin="200">
    <span @click="testBus">{{message | cas}}</span>
    <ul>
      <li v-for="(item, index) in lists" :key="index">{{item}}</li>
    </ul>
    <Sun :id="1"></Sun>
    <van-button type="default">默认按钮</van-button>
  </div>
</template>

<script>
  // import mixin from 'utils/mixin'
  export default {
    customOption: 'foo',
    data() {
      return {
        show: true,
        num: '',
        message: 'abcd',
        lists: ['上', '善', '若', '水']
      }
    },
    provide: {
      foo: 'bar'
    },
    // mixins: [mixin],
    created() {
      // this.hello()
      // console.log(this.msg)
      this.$nextTick(() => {
        console.log(123)
      })
      console.log(this.$options.data.call(this))
      this.$set(this.lists, 4, 'test')
      this.$delete(this.lists, 3)
      console.log(this.$options.customOption, '数据')
      console.log(this.$slots, '插槽')
    },
    mounted() {
      console.log(this.$el)
    },
    directives: {
      focus: {
        inserted(el) {
          el.focus()
        }
      },
      pin: {
        bind(el, binding, vnode) {
          el.style.position = 'fixed',
            el.style.top = binding.value + 'px'
        }
      }
    },
    filters: {
      //   cas: (value) => {
      //     return value.charAt(0).toUpperCase() + value.slice(1)
      //   }
    },
    methods: {
      testBus() {
        this.$nextTick(() => {
          this.$bus.$emit('testBus', this.message)
        })
        this.$router.push('/one')
      }
    },
    beforeDestroy() {
      this.$bus.$emit('testBus', this.message)
    }
  }
</script>

<style lang="less">
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity .5s;
  }

  .fade-enter,
  .fade-leave-to

  /* .fade-leave-active below version 2.1.8 */
    {
    opacity: 0;
  }
</style>