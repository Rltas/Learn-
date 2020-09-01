  let mixin = {
    created() {
      this.hello()
    },
    data() {
      return {
        msg: '混入'
      }
    },
    methods: {
      hello() {
        console.log('hello')
      }
    }
  }

  export default mixin