<template>
  <div id="one">
    祖父{{msg}}
    <Two v-bind="list" @son="son" @grandSon="grandSon"></Two>
    <van-button type="default" v-once @click="goDynamic">默认按钮</van-button>
  </div>
</template>

<script>
  import Two from 'components/Two'
  export default {
    components: {
      Two
    },
    created() {
      let _this = this
      this.$bus.$on('testBus',(val) => {
        console.log(val)
        this.msg = val
        console.log(this.msg,'数据')
      })
    },
    mounted() {
      window.addEventListener('resize', this.mustom, false)
    },
    data() {
      return {
        list: {
          name: '今夜？',
          age: 27
        },
        msg: '123',
        obj: {
          count: 0
        }
      }
    },
    provide: {
      foo: '这是一个高阶组件',
      highOrder() {
        return this.obj
      }
    },
    watch: {
      'obj.count': {
        handler(val) {
          console.log(val)
        }
      }
    },
    methods: {
      son() {
        console.log('son')
      },
      grandSon() {
        this.obj.count++
      },
      goDynamic() {
        this.$router.push('/dynamic/1')
      }
    },
    beforeDestroy() {
      this.$bus.$off('testBus')
    },
    mustom() {
      let i = 0
      setInterval(() => {
        console.log(i++)
      },100)
    },
  }
</script>

<style lang="less" scoped>
  #one {
    .van-button--default {
      color: blue;
    }
  }
</style>