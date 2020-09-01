<template>
  <div class="home">
      123
      <div id="ceshi"></div>
  </div>
</template>

<script>
// @ is an alias to /src
import { Observer } from '../utils/true'
export default {
  name: 'home',
  components: {
    
  },
  created() {
    this.$api.getLoginState().then(res => {
        console.log(res);
      })
    class Test extends Observer {
      constructor(price, ...args) {
        super(...args)
        this.price = price
      }
      con() {
        console.log(this.price, this.walk, this.val.name)
      }
    }
    let p = new Test(1000, {
      name: 'BenZ',
      color: 'black'
    });
    p.con()
    let ts = false && true
    console.log(ts, 'ts')
  }
}
</script>

<style lang="less">
  #ceshi {
    width: 375rem;
    height: 50rem;
    background: red;
  }
</style>
