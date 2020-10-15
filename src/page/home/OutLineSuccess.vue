<template>
  <div id="outLine-success">
    <div class="merchant-title">
      <img src="../../common/images/newIndex/u21.png" alt="">
      <span>{{orderInfo.supplierName}}</span>
    </div>
    <div class="pay-success">
      <div class="success">
        <van-icon name="success" size="52" color="#789F00" />
        <span>支付成功！</span>
      </div>
      <span class="price">￥{{$numShow(orderInfo.totalPrice)}}</span>
    </div>
    <div class="pay-time">付款时间：{{orderInfo.payTime}}</div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        orderInfo: ''
      }
    },
    created() {
      this.loadOrderDetails()
    },
    methods: {
      loadOrderDetails() {
        let data = {
          id: this.$route.query.id
        }
        this.api.post('getOrderDetail', data).then(res => {
          this.orderInfo = res.obj
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  #outLine-success {
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    background: #fff;
    color: #666;

    .merchant-title {
      height: .48rem;
      border-bottom: .01rem solid #eee;
      padding: 0 .16rem;
      display: flex;
      box-sizing: border-box;
      align-items: center;

      img {
        width: .28rem;
        height: .26rem;
        margin-right: .08rem;
      }

      span {
        flex: 1;
        text-align: justify;
        font-size: .14rem;
        font-weight: bold;
        line-height: .16rem;
      }
    }

    .pay-success {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      margin: 1rem 0 .26rem 0;

      .success {
        display: flex;
        align-items: center;

        span {
          font-size: .21rem;
          color: #789F00;
        }
      }

      .price {
        font-size: .21rem;
        color: #ff0000;
      }
    }

    .pay-time {
      padding: 0 .16rem;
    }
  }
</style>