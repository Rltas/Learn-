<template>
  <div class="payBox">
    <van-popup v-model="isShow" position="bottom" v-if="payBoxData.length >0" :close-on-click-overlay="false">
      <div class="order-id">
        <p class="orderNo">订单号：{{payBoxData[0].orderNumber}}</p>
        <van-icon name="cross"  size="24" @click="boxOnClose"/>
      </div>
      <div class="order-info" v-if="payBoxData[0].isShowInfo">
        订单已拆单，其中金额为￥{{Number(payBoxData[0].deductPrice).toFixed(2)}} 的子订单已使用幸运值成功抵扣</div>
      <div class="order-money">
        <p style="font-size:.12rem;color:#999;margin-bottom:.05rem;">
          商品总价：￥{{(Number(payBoxData[0].pay) - Number(payBoxData[0].shipMoney)).toFixed(2)}}</p>
        <p style="font-size:.12rem;color:#999;margin-bottom:.05rem;">运费：￥{{Number(payBoxData[0].shipMoney).toFixed(2)}}
        </p>
        <p style="font-size:.12rem;color:#999;">幸运值抵扣：￥-{{payBoxData[0].luckyValue}}</p>
        <p>应付：<span>￥{{Number(payBoxData[0].orderPay).toFixed(2)}}</span></p>
      </div>
      <div class="wx-pay" @click="payment('微信')">
        <div class="wx-name">
          <img class="wx-check" src="../../common/images/newIndex/wx_check.png" alt="">
          <span>微信支付</span>
        </div>
        <div class="wx-price">
          <img src="../../common/images/newIndex/line_arrow.png" alt="">
        </div>
      </div>
      <div class="down-pay" @click="payment('线下支付')" v-if="showLinePay">
        <div class="down-name">
          <img class="wx-check" src="../../common/images/newIndex/down_check.png" alt="">
          <span>线下支付</span>
        </div>
        <div class="wx-price">
          <img src="../../common/images/newIndex/line_arrow.png" alt="">
        </div>
      </div>
    </van-popup>

    <!--提示-->
  </div>
</template>
<script>
  export default {
    props: {
      isShow: {
        type: Boolean,
        default: false
      },
      payBoxData: {
        type: Array,
        default: () => {
          return []
        }
      },
      showLinePay: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        isWeiXin: ''
      }
    },
    created() {
      // 判断是否是微信浏览器
      var ua = window.navigator.userAgent.toLowerCase();
      if (ua.match(/MicroMessenger/i) == "micromessenger") {
        this.isWeiXin = true
      } else {
        this.isWeiXin = false
      }
    },
    methods: {
      boxOnClose() {
        this.$emit('boxOnClose')
      },
      removeLocal() {
        localStorage.removeItem("goodsName");
        localStorage.removeItem("goodsNum");
        localStorage.removeItem("message");
        localStorage.removeItem("messageobj");
        localStorage.removeItem("url");
        localStorage.removeItem("supplierId");
        localStorage.removeItem("price");
        localStorage.removeItem("specPropertyIds");
      },
      payment(val) {
        if (this.isWeiXin) {
          if (val == '微信') {
            this.$toast.loading({
              duration: 1000,
              forbidClick: true,
              message: '正在跳转',
              overlay: true
            })
            setTimeout(() => {
              window.location.href = global.COURSES + '/pay_submit.htm?order_id=' + this.payBoxData[0].id +'&payType=weixin_wap';
            }, 1000)   
            // localStorage.clear();
            this.removeLocal();
          } else if (val == '线下支付') {
            let data = {
              id: this.payBoxData[0].id
            }
            this.api.post('getOrderDetail', data).then(res => {
              // localStorage.clear();
              this.removeLocal();
              this.$router.push({
                path: '/offline-pay',
                query: {
                  id: res.obj.id,
                  shipMoney: res.obj.shipPrice, //运费
                  luckyValue: res.obj.depositPrice, //幸运值抵扣
                  payMoney: Number(res.obj.totalPrice) - Number(res.obj.depositPrice), //应付价格
                  price: res.obj.totalPrice, //商品总价
                  orderTime: res.obj.addTime, //下单时间
                }
              })
            })
          }
        } else {
          if (val == '微信') {
             this.$toast.loading({
              duration: 1000,
              forbidClick: true,
              message: '正在跳转',
              overlay: true
            })
            setTimeout(() => {
              window.location.href = global.COURSES + '/pay_submit.htm?order_id=' + this.payBoxData[0].id +'&payType=wxcodepay'
            }, 1000)
            // localStorage.clear();
            this.removeLocal();
          } else if (val == '线下支付') {
            let data = {
              id: this.payBoxData[0].id
            }
            this.api.post('getOrderDetail', data).then(res => {
              this.loading = false;
              // localStorage.clear();
              this.removeLocal();
              this.$router.push({
                path: '/offline-pay',
                query: {
                  id: res.obj.id,
                  shipMoney: res.obj.shipPrice, //运费
                  luckyValue: res.obj.depositPrice, //幸运值抵扣
                  payMoney: this.payBoxData[0].orderPay, //应付价格
                  price: this.payBoxData[0].pay, //商品总价
                  orderTime: res.obj.addTime, //下单时间
                }
              })
            })
          }
        }
      }
    }
  }
</script>
<style lang='less' scoped>
  .vux-popup-dialog {
    background: #fff;
    padding: 0 .15rem .31rem;
    color: #333;
    font-size: .15rem;
    box-sizing: border-box;
  }

  .order-id,
  .order-info {
    padding: .08rem 0;
    border-bottom: .01rem dashed #F5667B;
    display: flex;
    justify-content: space-between;
    align-self: center;
  }

  .order-money {
    padding: .19rem 0;
    text-align: left;
    border-bottom: .01rem dashed #F5667B;

    p:last-child {
      span {
        font-size: .28rem;
        color: #F5667B;
        font-weight: bold;
        vertical-align: middle;
      }
    }
  }

  .wx-pay,
  .down-pay {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: .01rem solid #eee;
    padding: .21rem 0 .07rem;

    .wx-price img {
      width: .08rem;
      height: .15rem;
    }
  }

  .wx-check {
    width: .15rem;
    height: .15rem;
    margin-right: .1rem;
    vertical-align: middle;
  }

  .payBox .van-popup {
    padding: 0 .15rem .31rem;
    box-sizing: border-box;
  }
</style>
