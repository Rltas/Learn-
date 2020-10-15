<template>
  <div class="pay-success">
    <div class="order-info">
      <div class="section">
        <div class="money">
          <van-icon name="success" size="56" color="#04BE02"></van-icon>
          <p>购买成功,愉教愉乐将为你马上发货</p>
        </div>
      </div>
    </div>
    <div class="order-id">
      <p>订单号：{{orderID}}</p>
    </div>
    <!-- </scroller> -->

    <div class="bottom">
      <router-link to="/">返回首页</router-link>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    seller: {
      type: Object
    }
  },
  data() {
    return {
      listHeight: [],
      scrollY: 0,
      selectedOrder: {},
      time1: '2017-07-13 21:54',
      demo4: '',
      showPopup: false,
      orderID: ''
    }
  },
  mounted: function () {
    var orderID = this.getQueryString("id")  //订单ID
    this.orderID = orderID
  },
  methods: {
    getQueryStringVar: function (name) {
      var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
      var r = currentUrl.substring(currentUrl.indexOf('?'), currentUrl.length).substr(1).match(reg);
      if (r != null) return unescape(r[2]); return null;
    }
  }

}

</script>

<style lang="less" scoped>
	@red: #f0415f;
	.pay-success{
		// padding-top: 46px;
    background-color: #f0f4f5;
    display: flex;
    flex-direction: column;
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
			padding: .1rem 0 .1rem .35rem;
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
