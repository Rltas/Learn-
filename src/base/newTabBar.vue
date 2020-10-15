<template>

  <div class="tab-bar" v-show="type !== undefined">
      <nav class="m-tabBar">
        <router-link class="item" to="/" exact>
            <i class="icon" :class="{'home-icon': type == 0, 'home-outline-icon': type != 0}"></i>
            <span class="txt">首页</span>
        </router-link>

        <router-link class="item" to="/all-goods">
            <i class="icon" :class="{'classify-icon': type == 1, 'classify-outline-icon': type != 1}"></i>
            <span class="txt">分类</span>
        </router-link>

        <router-link class="item" to="/shopping-cart">
            <i class="icon" :class="{'car-icon': type == 2, 'car-outline-icon': type != 2}"></i>
            <span class="txt">购物车</span>
            <!-- <div>{{goodsListCount}}</div> -->
        </router-link>

        <router-link class="item" to="/personal">
            <i class="icon" :class="{'person-icon': type == 3, 'person-outline-icon': type != 3}"></i>
            <span class="txt">我</span>
        </router-link>
      </nav>
  </div>

</template>

<script>
export default {
  data() {
    return {
      type: 0, // tab索引
      routerListMap: { // tab map
        '/': 0,
        '/all-goods': 1,
        '/shopping-cart': 2,
        '/personal': 3
      },
      // goodsListCount:0
    };
  },
  watch: {
    '$route': 'routerChange'
  },
  created(){
    // this._goodscartData()
  },
  methods: {
    routerChange: function(){
      this.type = this.routerListMap[this.$route.path]
    },
    // _goodscartData(){
    //   this.goodsListCount = 0;
    //   this.api.post('getShoppingCartData',{seq:1}).then(res => {
    //     if(res.obj){
    //        res.obj.forEach((item,index) => {
    //         this.goodsListCount+=item.goodsList.length
    //       })
    //     }
    //   })
    // }
  }
};
</script>

<style lang="less" scoped>
@import '../common/css/variable.less';
.tab-bar {
  position: fixed;
  z-index: 100;
  left: 0;
  right: 0;
  bottom: 0;
  .m-tabBar {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: space-around;
    height: 0.5rem;
    background-color: #fff;
    border-top: 0.01rem solid #E1E1E1;
    .item {
      position: relative;
      text-align: center;
      padding: 0 0.16rem;
      .icon {
        display: inline-block;
        vertical-align: middle;
        width: 0.23rem;
        height: 0.23rem;
        background-size: 0.23rem 0.23rem;
      }
      .txt {
        display: block;
        margin-top: 0.04rem;
        font-size: 0.12rem;
        // transform: scale(0.85);
        color: #999999;
        line-height: 1;
      }
    }
    .router-link-exact-active,.router-link-active {
        color: #FF773A;
        .txt {
            color: #FF773A;
        }
    }
  }
}

//小图标

.home-icon{
  background: url('../common/images/newIndex/home_h.png') no-repeat;
}
.home-outline-icon{
  background: url('../common/images/newIndex/home.png') no-repeat;
}

.classify-icon{
  background: url('../common/images/newIndex/classify_h.png') no-repeat;
}
.classify-outline-icon{
  background: url('../common/images/newIndex/classify.png') no-repeat;
}

.car-icon{
  background: url('../common/images/newIndex/cart_h.png') no-repeat;
}
.car-outline-icon{
  background: url('../common/images/newIndex/car.png') no-repeat;
}

.person-icon{
  background: url('../common/images/newIndex/user_h.png') no-repeat;
}
.person-outline-icon{
  background: url('../common/images/newIndex/user.png') no-repeat;
}

</style>
