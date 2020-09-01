<template>
  <div id="computed-watch">
    Computed-Watch
    <span class="msg">{{msg}}</span>
    <p class="msg">{{reMsg}}</p>
    <p class="msg">{{numMonye}}</p>
    <input type="text" v-model="inputMsg.a">
  </div>
</template>

<script>
  export default {
    data() {
      return {
        msg: "Rltas",
        num: 156897451.235,
        inputMsg: {
          a: '数据'
        },
      }
    },
    watch: {
      testA: {
        handler(val, old) {
          console.log(val)
        },
        immediate: true,
      },
      '$route': 'ceshi'
    },
    computed: {
      reMsg() {
        return [...this.msg].reverse().join('');
      },
      numMonye() {
        // return this.num.toLocaleString()
        return this.num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
        // return this.formatCash(this.num)
      },
      testA() {
        return this.inputMsg.a
      }
    },
    mounted() {
      window.addEventListener('click', _.debounce(this.test, 2000), false)
      this.con().then(res => {
        console.log(res)
      })
      console.log('123456')
    //  this.timeout().then(res => {
    //    console.log(res)
    //  })
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        if (vm.msg == 'Rltas') {
          // vm.$router.go(-1)
        }
      })
    },
    methods: {
      formatCash(str) {
        str = str.toString()
        return str.split('').reverse().reduce((prev, next, index) => {
          return ((index % 3) ? next : (next + ',')) + prev
        })
      },
      test() {
        console.log(123)
      },
      ceshi() {
        console.log('我过来了')
      },
      async con() {
        return 'Hello World'
      },
      async timeout() {
        for (let index = 0; index < 3; index++) {
          console.log('async ' + index);
        }
      },
    }
  }
</script>

<style lang="less" scoped>
  #computed-watch {
    .msg {
      color: @color;
      font-variant: small-caps;
    }
  }
</style>