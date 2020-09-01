<template>
  <div id="parent">
    <router-link role="checkbox" aria-checked="true" to="/classStyle">测试</router-link>
    <Sun>
      <template #[ceshi]>
        <h2>实质头部</h2>
      </template>
      <template #default>
        <div>
          实质内容
        </div>
      </template>
      <template v-slot:footer>
        <h3 @click="resolve">实质底部</h3>
      </template>
      <template #scope="{user}">
        <ul>
          <li v-for="(item,index) in user" :key="index">{{item.name}}</li>
        </ul>
      </template>
      <!-- <template slot-scope="{user}" slot="scope">
        <ul>
          <li v-for="(item,index) in user" :key="index">{{item.age}}</li>
        </ul>
      </template> -->
    </Sun>
    <input type="text" v-model="obj.a">
    <input type="text" v-model="surname">
    <input type="button" @click="test" value="Click Me">
  </div>
</template>

<script>
  const path = require('path')
  const files = require.context('@/components', false, /\.vue$/)
  console.log(files)
  const modules = {}
  files.keys().forEach(key => {
    const name = path.basename(key, '.vue')
    modules[name] = files(key).default || files(key)
  })
  // import Sun from 'components/Sun'
  export default {
    components: modules,
    data() {
      return {
        ceshi: 'header',
        obj: {
          a: '测试重置'
        },
        surname: '姓',
        name: ''
      }
    },
    computed: {
      multipleVal() {
        let { obj: {a}, surname} = this
        return {
          a,
          surname
        }
      }
    },
    mounted() {
      this.intervalFlow(this.call, 1000)
      console.log(this.multipleVal,"多个值")
    },
    methods: {
      intervalFlow(fn, wait) {
        let timer = setInterval(fn, wait);
        this.$once("hook:beforeDestroy", () => {
          clearInterval(timer)
        })
      },
      call() {
        console.log(123)
      },
      test() {
        // this.obj = this.$options.data.obj
        this.obj = this.$options.data.call(this).obj
      },
      resolve() {
        let {
          href
        } = this.$router.resolve('/transition')
        window.open(href, '_blank')
      },
      intervalFlow(fn, wait) {
        let timer = setInterval(fn, wait)
        this.$once("hook:beforeDestroy", () => {
          clearInterval(timer)
        })
      }
    }
  }
</script>

<style lang="less" scoped>

</style>