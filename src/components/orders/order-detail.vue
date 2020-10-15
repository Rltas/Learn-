<template>
  <div class="order-detail">
    <div class="maincon" style="padding-bottom:64px;">

      <!-- 订单状态 -->
      <div class="order-status">
        <div class="already-deliver">
          <p class="status-detail">
            订单状态：
            <i v-if="data.ordeStatus == '10'">待付款</i>
            <i v-if="data.showStatus == '1'">
              <template v-if="data.order_from == 'outline_scan'">
                  已付款
              </template>
              <template v-else>
                  待发货
              </template>
            </i>
            <i v-if="data.ordeStatus == '30'">待收货</i>
            <i v-if="data.showStatus == '3'">交易完成</i>
            <i v-if="data.ordeStatus == '0'|| data.ordeStatus == '-1'">交易关闭</i>
            <i v-if="data.ordeStatus == '47'">退货完成</i>
          </p>
        </div>
      </div>

      <!-- 收货地址 -->
      <div class="addr-sheet section" v-if="address!=null">
        <a class="addr-txt">
          <p class="person orient-h"></p>
          <span class="name cell">收货姓名：{{address.trueName}}</span>
          <span class="phone cell">{{address.mobile}}</span>
          <p>收货地址：{{address.area}}，{{address.area_info}}</p>
        </a>
      </div>
      <!-- 物流信息 -->
      <div class="order-status"
        v-if="(data.ordeStatus=='30' || data.showStatus=='3') && !userState && data.order_from != 'outline_scan'">
        <div class="already-deliver">
          <p class="status-detail">
            <span>物流信息</span>
            <router-link :to="{path: '/logistics', query:{id: data.id,type: 1}}"
              style="float:right; padding-right: 15px; color: #007aff">立即查看</router-link>
          </p>
        </div>
      </div>

      <!-- 商品明细 -->
      <div class="order-info">
        <div class="section">
          <div class="ord-list">
            <!-- 商品1 -->
            <div class="item" v-for="item in data.goodsCarDetailList" @click="gotoDetail(item)" :key="item.goodsId">
              <img v-lazy="item.url" alt="" class="prod-img">
              <div class="intro">
                <h3>{{item.name}}</h3>
                <p class="attrs"><span v-for="(spec,k) in item.specMap" :key="k">【{{spec.value}}】</span></p>
                <div class="howmuch">
                  <span class="sale-price">
                    <small>¥</small>
                    {{item.unitPrice}}
                  </span>
                </div>
                <div class="num">
                  x{{item.num}}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      <!-- 价格 -->
      <div style="margin: .16rem 0;">
        <van-cell title="商品总价">
          <template #default>
            <span>+ ¥{{(Number(data.totalPrice) - Number(data.shipPrice)).toFixed(2)}}</span>
          </template>
        </van-cell>
        <van-cell title="运费">
          <template v-slot:default>
            <span>+ ¥{{Number(data.shipPrice).toFixed(2)}}</span>
          </template>
        </van-cell>
        <van-cell title="优惠券" :value="data.couponName" v-if="data.couponName"/>
        <van-cell title="幸运值抵扣" v-if="userDeposit != -1">
          <template #default>
            <span>- ¥{{Number(data.depositPrice).toFixed(2)}}</span>
          </template>
        </van-cell>
        <van-cell title="实付金额">
          <template #default>
            <span style="color: #f0415f">¥{{(Number(data.totalPrice) - Number(data.depositPrice)).toFixed(2)}}</span>
          </template>
        </van-cell>
      </div>

      <!-- 订单 -->
      <!-- <cell :title="('供货商')" :value="data.supplierName"></cell> -->
      <van-cell title="订单号" :value="data.orderId"></van-cell>
      <van-cell title="开票类型">
        <template #default>
          <span v-show="data.bill_type == 0">不开票</span>
          <span v-show="data.bill_type == 1">普通发票</span>
          <span v-show="data.bill_type == 2">专票</span>
        </template>
      </van-cell>
      <van-cell title="发票类型" v-show="data.bill_type == 1">
        <template #default>
          <span v-show="data.bill == 0">个人</span>
          <span v-show="data.bill == 1">单位</span>
        </template>
      </van-cell>
      <van-cell title="单位名称" v-show="data.bill_type == 1" :value="data.bill_content"></van-cell>
      <van-cell title="纳税识别码" :value="data.bill_no" v-show="data.bill_type == 1 && data.bill == 1"></van-cell>
      <van-cell title="下单时间" :value="data.addTime"></van-cell>
      <van-cell title="付款时间" :value="data.payTime=='' || data.payTime==null ? '--' : data.payTime"></van-cell>
      <van-cell title="发货时间" :value="data.shipTime=='' || data.payTime==null ? '--' : data.shipTime"></van-cell>
      <!-- <cell :title="('收货时间')" :value="data.addTime"></cell> -->

      <!-- 备注 -->
      <div style="margin: .16rem 0;">
        <van-cell title="备注" :value="data.remark=='' || data.remark==null ? '--' : data.remark"></van-cell>
      </div>
    </div>

    <!-- 底部 -->
    <div class="card-bottom vux-1px-t">

      <!-- 待付款 -->
      <div class="bot-body" v-if="data.ordeStatus=='10' || data.ordeStatus =='15'">
        <div class="bot-btn" v-if="!userState">
          <!-- <router-link :to="{path: 'pay-way', query: { id: data.id, orderNumber: data.orderId, pay:Number(data.totalPrice - data.depositPrice).toFixed(2) }}" class="important">立即付款</router-link> -->
          <a @click="handlePayMoney(data)" class="important a">立即付款</a>
        </div>

        <div class="bot-btn" v-if="!userState">
          <a @click="cancelOrder" class="a">取消订单</a>
        </div>
      </div>

      <!-- 待发货 || 退货退款完成 -->
      <div class="bot-body" v-if="data.showStatus=='1' || data.ordeStatus=='0'||data.ordeStatus=='-1'">
        <template v-if="userState">
          <button class="bot-btn" style="background: transparent" :disabled="btnGoods"
            v-if="data.order_from == 'outline_scan'" @click="writeOff(data.id)">
            <span class="a">核销</span>
          </button>
          <button class="bot-btn" style="background: transparent" :disabled="btnGoods" @click="handleShipment(data)"
            v-else>
            <span class="a">发货</span>
          </button>
        </template>
        <div class="bot-btn" v-if="!userState">
          <a @click="haveQuestion" class="a">订单遇到问题</a>
        </div>
      </div>


      <!-- 待收货 -->
      <div class="bot-body" v-if="data.ordeStatus=='30' && !userState">
        <div class="bot-btn">
          <a @click="affirm" class="important a">确认收货</a>
        </div>
        <div class="bot-btn">
          <a @click="haveQuestion" class="a">订单遇到问题</a>
        </div>
      </div>

      <!-- 交易已完成 -->
      <div class="bot-body" v-if="data.showStatus=='3' && !userState">
        <div class="bot-btn">
          <router-link :to="{path: '/evaluate', query:{id: data.id}}" class="important a" v-if="data.ordeStatus=='40'">
            立即评价</router-link>
        </div>
        <div class="bot-btn" style="">
          <a @click="haveQuestion" class="a">订单遇到问题</a>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
  import Scroll from 'base/scroll'
  import {
    baseUrl
  } from 'api/config'
  import {
    mapMutations
  } from "vuex"

  export default {
    props: {
      orderId: {
        type: String,
        default: ''
      }
    },
    components: {
      Scroll
    },
    data() {
      return {
        btnGoods: '',
        userInfoCode: '', //登录状态码
        userState: false, //用户状态(是否为商家)
        listHeight: [],
        scrollY: 0,
        selectedOrder: {},
        urlID: '',
        data: {},
        address: '',
        totalm: 0, //总价
        disPrice: 0, // 优惠价格
        okOrDel: '',
        userDeposit: '',
        msg: "显示文字",
      }
    },
    created() {

      this.userDeposit = localStorage.getItem("userDeposit");
      //获取登录信息
      this.getUserInfo()
    },
    mounted: function () {
      this.$nextTick(function () {
        var urlID = this.getQueryString("id") //获取id
        this.urlID = urlID
        this.getOrderDetails()
      })
    },
    methods: {
      getOrderDetails() {
        this.api.post('getOrderDetail', {
          'id': this.urlID
        }).then(res => {
          if (res.code == '200') {
            this.data = res.obj;
            this.data.ordeStatus >= 30 ? this.btnGoods = true : this.btnGoods = false;
            this.address = res.obj.address;
            if (res.obj.changeDeposit && res.obj.changeDeposit != '0') {
              this.$dialog.alert({
                title: '提示',
                message: `由于您在其他商品使用了幸运值付款，该订单将多支付${res.obj.changeDeposit}元，总额不变`
              })
            }
            // console.log(this.data.goodsCarDetailList);
            this.data.goodsCarDetailList.forEach((item, index) => {
              this.totalm += Number(item.unitPrice) * Number(item.num)
              item.unitPrice = (Number(item.unitPrice) * Number(item.activity.discount)).toFixed(2)
            })
            this.totalm = this.totalm.toFixed(2)
            this.disPrice = (Number(this.totalm) + Number(this.data.shipPrice) - Number(this.data.totalPrice))
              .toFixed(2)
          }
        })
      },
      getUserInfo() {
        let backUrl = window.location.hash.substring(2);
        this.api.post('getLoginState').then(res => {
          this.setUserInfo(res);
          this.userInfoCode = JSON.parse(localStorage.getItem('userInfo')).code || '';
          this.orderid = localStorage.getItem('orderId');
          if (res.code == '200') {
            if (JSON.parse(localStorage.getItem('userInfo')).obj.user.userRole != 'BUYER') {
              this.userState = true;
            } else {
              this.userState = false;
            }
          } else {
            let backUrl = window.location.hash.substring(2);
            window.location.href = `${baseUrl}/shop/weChat_login_api.htm?url=${backUrl}&type=2`;
          }
        })

      },
      // 获取href数据
      getQueryStringVar: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.href.substring(window.location.href.indexOf('?'), window.location.href.length).substr(
          1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
      },
      haveQuestion: function () {
        this.$dialog.alert({
          title: '提示',
          message: '如果你对购买的商品存在问题请联系渝教商城客服：' + `<a href="tel:${global.PHONE}">${global.PHONE}</a>`
        })
      },
      // 取消订单
      cancelOrder: function () {
        this.$dialog.confirm({
          title: '提示',
          message: '是否取消订单？'
        }).then(() => {
          this.api.post('cancelOrder', {
            id: this.urlID
          }).then((res) => {
            this.$dialog.alert({
              title: '提示',
              message: '订单取消成功'
            }).then(() => {
              location.reload()
            })
          })
        })
      },
      // 确认收货
      affirm: function () {
        this.$dialog.confirm({
          title: '提示',
          message: '是否确认收货？'
        }).then(() => {
          this.$toast.loading({
            duration: 0,
            forbidClick: true,
            message: '加载中'
          })
          this.api.post('confirmOrder', {
            id: this.urlID
          }).then(() => {
            this.$toast.clear()
            location.reload()
          })
        })
      },
      //确认付款
      handlePayMoney(item) {
        this.$parent.handlePayMoney(item);
      },
      gotoDetail(item) {
        if (this.data.order_from == "outline_scan") return;
        if (!this.userState) {
          if (item.goodsStatus == 0) {
            this.api.post("getGoodsDetail", {
              id: item.goodsId
            }).then(res => {
              if (res.code == 200) {
                if (res.obj.seq == 1) { //生活超市详情
                  let url = `${baseUrl}/wap/eduIndex.htm#/goods-detail?goodsid=${item.goodsId}`
                  window.location.href = url;
                } else if (res.obj.seq == 2 || res.obj.seq == 7 || res.obj.seq == 8) { //内购商城详情
                  let url = `${baseUrl}/wap/interIndex.htm#/goods-detail?goodsid=${item.goodsId}`
                  window.location.href = url;
                }
              } else {
                this.$toast(res.message)
              }
            })
          } else {
            this.$toast('该商品已下架！')
          }
        }
      },
      //发货
      handleShipment(item) {
        if (this.$parent.$parent.$data.btnGoodSon || this.btnGoods) {
          this.$toast('该订单已经发货！')
        } else {
          this.$parent.showShipment(item);
        }
      },
      writeOff(id) {
        let data = {
          id
        }
        this.$toast.loading({
          duration: 0,
          forbidClick: true,
          message: '正在核销'
        })
        this.api.post('outLineConfirm', data).then(res => {
          this.$toast.clear()
          if (res.code == 200) {
            this.$toast('核销成功！');
            this.getOrderDetails()
          } else {
            this.$toast(res.message)
          }
        })
      },
      ...mapMutations({
        setUserInfo: 'SET_USER_INFO'
      })
    }
  }
</script>

<style lang="less" scoped>
  @red: #f0415f;

  .order-detail {
    .van-cell__value {
      flex: 2;
    }

    position: fixed;
    // top: 46px;
    top: 0px;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
    background-color: #f0f4f5;
    z-index: 66;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;

    .order-status {
      line-height: 54px;
      padding-left: 15px;
      background-color: #fff;
      margin-bottom: 10px;

      i {
        font-style: normal;
        color: #eb6100;
      }
    }

    .addr-sheet {
      display: block;
      line-height: 1.4;
      font-size: 14px;

      .addr-txt {
        position: relative;
        display: block;
        padding: 10px 15px;
        color: #333;

        .person {
          padding-top: 4px 0 10px;
        }

        .cell {
          display: inline-block;
          padding-bottom: 8px;
          width: 40%;
          font-size: 16px;
        }

        .phone {
          float: right;
          padding-right: 10px;
          text-align: right;
        }
      }
    }

    .order-info {
      .section {
        margin-bottom: 10px;
        background-color: #fff;

        .ord-list {
          .item {
            position: relative;
            z-index: 0;
            padding: 15px 10px;
            overflow: hidden;

            .prod-img {
              float: left;
              width: 82px;
              height: 82px;
              box-shadow: 0 0 0 0.5px #e5e5e5;
            }

            .intro {
              position: relative;
              margin-left: 94px;
              padding-right: 20px;
              line-height: 26px;
              overflow: hidden;
              text-align: left;

              h3 {
                font-size: 14px;
                font-weight: normal;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }

              .attrs {
                font-size: 12px;
                font-weight: normal;
                // overflow: hidden;
                // text-overflow: ellipsis;
                // white-space: nowrap;
              }

              .howmuch {
                line-height: 21px;
              }

              .sale-price {
                color: #f04360;

                small {
                  font-size: smaller;
                }
              }

              .num {
                position: absolute;
                right: 0;
                top: 0;
                color: #999;
                font-size: 12px;

              }
            }
          }
        }
      }
    }

    .price-info {
      padding: 15px;
      margin-bottom: 10px;
      background-color: #fff;

      p {
        color: #999;
        display: flex;
      }
    }

    .section {
      margin-bottom: 10px;
      background-color: #fff;
    }

    .card-bottom {
      position: fixed;
      bottom: 0;
      height: 54px;
      width: 100%;
      z-index: 88;
      background-color: #fff;

      .bot-body {
        padding: 0 10px;

        .btn-goods {
          width: 40%;
          box-sizing: border-box;
          padding-left: 8px;
          float: right;
          display: block;
        }

        .bot-btn {
          width: 40%;
          box-sizing: border-box;
          padding-left: 8px;
          float: right;

          .a {
            box-sizing: border-box;
            width: 100%;
            height: 34px;
            line-height: 34px;
            text-align: center;
            color: @red;
            border: 1px solid @red;
            border-radius: 3px;
            background: #fff;
            margin-top: 10px;
            float: right;
            margin-left: 8px;
          }

          .important {
            box-sizing: border-box;
            width: 100%;
            height: 34px;
            line-height: 34px;
            text-align: center;
            color: #fff;
            border: 1px solid @red;
            border-radius: 3px;
            background: @red;
            margin-top: 10px;
            float: right;
            margin-left: 8px;

          }

        }

      }

    }
  }
</style>
