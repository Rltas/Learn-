<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/computedWatch">About</router-link>
    </div>
    <router-view />
  </div>
</template>

<script>
  import axios from 'service/axios'
  export default {
    data() {
      return {
        time: '2020-06-06 14:14:26'
      }
    },
    created() {
      this.deployRem(document, window);
      axios.defaults.headers.common['Authorization'] = 'wuguang'
      this.$api.getIndexInfo().then(res => {
        console.log(res);
      })
      this.$api.getDemo()
      this.testOnce()
      
    },
    mounted() {
     
    },
    
    beforeDestroy() {
      console.log('生命周期退出页面')
    },
    destroyed() {
      console.log('退出页面destroyed')
    },
    methods: {
      deployRem(doc, win) {
        let docEl = doc.documentElement,
            getRem = () => {
              let width = docEl.getBoundingClientRect().width
              let rem = width/375 *100
              docEl.style.fontSize = rem + 'px'
              let actualSize = parseFloat(win.getComputedStyle(docEl,['font-size']))
              if(rem !== actualSize) {
                let remScaled = rem/(actualSize/rem)
                docEl.style.fontSize = remScaled + 'px'
              }
            } 
          win.addEventListener('resize', getRem, false)
          doc.addEventListener('ready', getRem, false)
          if(!doc.addEventListener) {
            return
          } else {
            getRem()
          }
      },
      testOnce() {
        // let timer = setInterval(() => {
        //   console.log(123)
        // }, 500)
        // this.$once("hook:beforeDestroy", () => {
        //   console.log("退出程序")
        //   clearInterval(timer)
        //   timer = null
        // })
      }
    }
  }
</script>
<style lang="less">
  html,body {
    font-size: .16rem;
  }
  #app {
    font-size: .2rem;
  }
  #nprogress .bar {
    background: red !important;
  }
</style>
