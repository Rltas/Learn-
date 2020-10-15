<template>
  <div class="pay">
    <div class="order-info">
      <div class="section">
        <div class="money">
          <van-icon name="success" size="56" color="#04BE02"></van-icon>
          <p>订单提交成功，应支付金额：
            <span class="price">¥{{Number(pay).toFixed(2)}}</span>元</p>
        </div>
      </div>
    </div>
    <div class="order-id">
      <p>订单号：{{orderNumber}}</p>
    </div>

    <group>
      <!-- <cell title="支付剩余时间">
				<clocker :time="payTime"></clocker>
				{{payTime}}
			</cell> -->
    </group>

    <group :title="'选择支付方式'" v-show="isWeiXin == false">
      <radio :options="payWay" v-model="paymentValue" @click="payment"></radio>
    </group>

    <div class="bottom" v-show="isWeiXin == false">
      <a @click="payment">立即付款</a>
    </div>

    <div class="bottom" v-show="isWeiXin" style="background-color: #56c13e">
      <a @click="payment">立即使用微信付款</a>
    </div>

    <!-- 提示 -->
  </div>
</template>

<script>
import { Group, Radio } from 'vux'

export default {
  components: {
    Group,
    Radio
  },
  data() {
    return {
      listHeight: [],
      scrollY: 0,
      selectedOrder: {},
      time1: '',
      demo4: '',
      showPopup: false,
      payWay: ['支付宝', '微信'],
      id: '',
      orderNumber: '',
      pay: '',         //总金额
      paymentValue: '支付宝',
      payTime: '',
      isWeiXin: '',
      changeDeposit: 0,
    }
  },
  mounted: function () {
    this.$nextTick(function () {

    })
  },
  mounted: function () {
    this.$nextTick(function () {
      Date.prototype.Format = function (fmt) { //author: meizz
        var o = {
          "M+": this.getMonth() + 1, //月份
          "d+": this.getDate(), //日
          "h+": this.getHours(), //小时
          "m+": this.getMinutes(), //分
          "s+": this.getSeconds(), //秒
          "q+": Math.floor((this.getMonth() + 3) / 3), //季度
          "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
          if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
      }
    })
  },
  created() {

    // 判断是否是微信浏览器
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
      this.isWeiXin = true
    } else {
      this.isWeiXin = false
    }

    var id = this.getQueryString("id")
    this.id = id     //订单id
    var orderNumber = this.getQueryString("orderNumber")
    this.orderNumber = orderNumber  //订单号

    var me = this

    this.$http.post(global.COURSES + "/app/buyer/order_view.htm", { 'id': me.id }).then(function (res) {
      res = res.body
      var date = res.obj.addTime
      date = new Date().Format("yyyy-MM-dd hh:mm:ss");
      if (res.obj.changeDeposit && res.obj.changeDeposit != '0') {
        this.$dialog.alert({
          title: '提示',
          message: `由于您在其他商品使用了幸运值付款，该订单将多支付${res.obj.changeDeposit}元，总额不变`
        })
      }
      this.payTime = date
      this.pay = Number(res.obj.totalPrice - res.obj.depositPrice).toFixed(2)

    }, function () {
    })
  },
  methods: {
    // 获取href数据
    getQueryStringVar: function (name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      var r = window.location.href.substring(window.location.href.indexOf('?'), window.location.href.length).substr(1).match(reg);
      if (r != null) return unescape(r[2]); return null;
    },
    payment: function (value) {
      if (this.isWeiXin) {
        window.location.href = global.COURSES + '/pay_submit.htm?order_id=' + this.id + '&payType=weixin_wap'
        localStorage.clear();
      } else {
        if (this.paymentValue == '支付宝') {
          this.$toast.loading({
            duration: 0,
            forbidClick: true,
            message: '正在尝试支付宝'
          })
          setTimeout(() => {
            window.location.href = global.COURSES + '/pay_submit.htm?order_id=' + this.id + '&payType=alipay_wap'
          }, 1000)
          localStorage.clear();
        } else if (this.paymentValue == '微信') {
          this.$toast.loading({
            duration: 0,
            forbidClick: true,
            message: '正在尝试打开微信'
          })
          setTimeout(() => {
            window.location.href = global.COURSES + '/pay_submit.htm?order_id=' + this.id + '&payType=wxcodepay'
          }, 1000)
          localStorage.clear();
        } else if (this.paymentValue == '银联') {
          window.location.href = global.COURSES + '/order_pay.htm?order_id=' + this.id + '&payType=unionpay'
          localStorage.clear();
        } else {
          console.log("请选择支付方式")
        }
      }

    },
    payBack: function () {
      this.$router.go(-1);
    }
  }
}

</script>

<style lang="less" scoped>
	@red: #f0415f;
	.pay{
		.order-info{
			padding: .1rem;
			background-color: #fff;
			text-align: center;
			.section{
				padding: .2rem .1rem .1rem;
				.money{
					display: inline-block;
					p{
						padding-top: .1rem;
						.price{
							color: @red;
							font-size: .2rem;
						}
					}
				}
			}
		}
		.order-id{
			margin-top: .1rem;
			padding: .1rem .1rem;
			background-color: #fff;
			p{
				font-size: .14rem;
			}
		}
		.bottom{
			a{
				position: absolute;
				height: .5rem;
				width: 100%;
				bottom: 0;
				display: block;
				background-color: @red;
				text-align: center;
				line-height: .5rem;
				color: #fff;
			}
		}
	}
</style>
