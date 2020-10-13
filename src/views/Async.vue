<template>
  <div id="async">
    处理
  </div>
</template>

<script>
  export default {
    data() {
      return {

      }
    },
    created() {
      this.timeOut();
      this.readTime();
      this.last();
    },
    mounted() {
      console.log('已进入mounted')
      this.$api.getLoginState().then(res => {
        console.log(res, '错误前提')
      }).catch((value) => {
        console.log('错误错误错误')
      })
    },
    methods: {
      // getInfo() {
      //   return new Promise((resolve, reject) => {
      //     this.$api.getIndexInfo().then(res => {
      //       resolve(res)
      //     })
      //   })
      // },
      async getInfo() {
        return this.$api.getIndexInfo().then(res => {
          return res
        })
      },
      async timeOut() {
        let res = await this.getInfo();
        console.log(res)
      },
      async waitTime(num) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve(num * 2);
          }, 2000)
        })
      },
      async readTime() {
        let result = await this.waitTime(60);
        let result_1 = await this.waitTime(10);
        let result_2 = await this.waitTime(5);
        return result + result_1 + result_2
      },
      async last() {
        let last = await this.readTime();
        console.log(last, '最后执行的结果')
      }
    }
  }
</script>

<style lang="less">

</style>