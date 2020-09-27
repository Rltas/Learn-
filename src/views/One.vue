<template>
  <div id="one">
    祖父{{msg}}
    <Two v-bind="list" @son="son" @grandSon="grandSon" ref="two" :syncInfo.sync="syncInfo"></Two>
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
      console.log(this.$refs.two, '测试子组件数据', this.$root)
    },
    data() {
      return {
        list: {
          name: '今夜？',
          age: 27,
        },
        syncInfo: 'sync',
        msg: '123',
        obj: {
          count: 0
        },
        dataTest: this.fooAncestor
      }
    },
    beforeRouteEnter (to, from, next) {
      // ...
      setTimeout(() => {
        next()
      }, 3000)
    },
    provide: {
      fooAncestor: '这是祖先组件提供的一个data实例',
      ancestorMethod:()=> {
        // this.fooAncestor = '改变祖先实例'
       
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