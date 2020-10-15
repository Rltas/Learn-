<template>
  <div class="personal">
    <!-- 个人信息 -->
    <div class="my_header_v4_wrap">
      <div class="my_header_v4">
        <!--已登录-->
        <div class="member-info">
          <div class="img-box" v-if="!noLogin">
            <img src="../../common/images/newIndex/user_head.png" alt="">
          </div>
          <div class="info-box">
            <div v-if="!noLogin" class="name">{{userData.user.mobile}}</div>
            <div class="my_header_msg" v-if="Number(userData.orgid) > 0">
              <span>幸运值：{{Number(this.userDeposit).toFixed(2) || 0.0}}点</span>
            </div>
          </div>
        </div>
        <!--未登录-->
        <div class="no-login-info" v-if="noLogin" @click="login()">
          <div class="img-box">
            <img src="../../common/images/newIndex/user_head.png" alt="">
          </div>
          <span class="login-btn">立即登录</span>
        </div>
      </div>
    </div>

    <!-- 订单 -->
    <div class="info_block">
      <div class="item" @click="goToorders(0)">
        <div class="item_content">
          <div class="text">我的订单</div>
        </div>
        <div class="arrow">
          <span class="iconfont icon-xiaojiantou" style="vertical-align:middle;font-size:17px;"></span>
        </div>
      </div>
      <div class="order_wrap">
        <div class="order_body">

          <div class="order_item" @click="goToorders(1)">
            <div class="item_link">
              <div class="icon daifukuan-icon">
                <van-icon class-prefix="badge" :badge="payCount" v-if="payCount != 0"></van-icon>
              </div>
              <span>待付款</span>
            </div>
          </div>
          <div class="order_item" @click="goToorders(2)">
            <div class="item_link">
              <div class="icon daifahuo-icon">
                <van-icon :badge="deliveryCount" v-if="deliveryCount != 0" class="badge" />
              </div>
              <span>待发货</span>
            </div>
          </div>
          <div class="order_item" @click="goToorders(3)">
            <div class="item_link">
              <div class="icon daishouhuo-icon">
                <van-icon class="badge" :badge="shipmentsCount" v-if="shipmentsCount != 0"></van-icon>
              </div>
              <span>待收货</span>
            </div>
          </div>
          <div class="order_item" @click="goToorders(4)">
            <div class="item_link">
              <div class="icon yiwancheng-icon">
                <van-icon class="badge" :badge="completedCount" v-if="completedCount != 0"></van-icon>
              </div>
              <span>已完成</span>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!--附加选项-->
    <div class="personal-body">
      <van-cell is-link @click="goToorders(5)">
        <template #title>
          <span class="custom-title">我的优惠券</span>
          <van-icon :badge="couponBadge" style="position: relative;top: -10px;left: 5px;" v-if="couponBadge"></van-icon>
        </template>
      </van-cell>
      <van-cell title="收货地址管理" @click="goToorders(6)" is-link></van-cell>
      <van-cell title="幸运值变动历史" @click="goToorders(7)" is-link></van-cell>
      <van-cell title="联系我们" @click="goToorders(8)" is-link></van-cell>
      <van-cell title="服务协议" @click="serviceAgreement" is-link></van-cell>

      <div v-if="!noLogin && isShareBtn" style="margin-top:0.18rem">
        <van-cell title="分销中心" @click="handleToShareCenter" is-link></van-cell>
      </div>

      <div v-if="!noLogin" style="margin-top:0.18rem">
        <van-cell title="解绑手机" @click="unBinding" is-link></van-cell>
      </div>
    </div>

    <!-- 底部导航 -->
    <router-view></router-view>

    <!--付款弹窗-->
    <pay-box :isShow='showPayBox' :payBoxData='payBoxData' @boxOnClose="boxOnClose"></pay-box>

    <!--发货弹窗-->
    <van-popup v-model='isShow' position="bottom" @touchmove.prevent.stop>
      <div class="body">
        <div class="type">
          <selector placeholder="选择快递公司" v-model="company" :options="companyList" @on-change='handleBlur'></selector>
        </div>
        <div class="type">
          <input type="text" placeholder="输入快递单号" v-model="companyNum" @blur="handleBlur">
        </div>
      </div>
      <div class="bottom">
        <span style="background-color:#f0f0f0; color: #03a9f4; width: 50%" @click="cancelCall" class="span">取消</span>
        <button style="width: 50%" @click="handleConfirm" class="span btn" :disabled="btndisabled">保存</button>
      </div>
    </van-popup>

    <!--服务协议-->
    <ServiceAgreement :isShowService="isShowService" @closePopup="closePopup" :content="content">
    </ServiceAgreement>

  </div>

</template>

<script>
  import {
    mapGetters
  } from 'vuex'
  import {
    mapMutations
  } from "vuex"
  import {
    baseUrl
  } from 'api/config'
  import {
    getWxToken
  } from "api/getData";
  import {
    Selector
  } from 'vux'
  import payBox from "../pay/pay-box.vue";
  import ServiceAgreement from '../../base/serviceAgreement.vue';

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    components: {
      payBox,
      ServiceAgreement,
      'selector': Selector
    },
    data() {
      return {
        btndisabled: false,
        btnGoodSon: false,
        orderType: 1, //订单类别
        userData: '', //用户信息
        noLogin: true, //是否登录
        userDeposit: '', //用户幸运值

        showPayBox: false, //支付选择框
        payBoxData: [],

        payCount: 0, //待付款
        deliveryCount: 0, //待发货
        shipmentsCount: 0, //待收货
        completedCount: 0, //已完成
        couponBadge: 0, //可使用优惠券
        isShow: false, //发货弹窗
        company: '', //快递公司
        companyNum: '', //快递单号
        companyList: [], //所有快递公司
        orderId: '',
        pageScrollYoffset: 0,

        isShareBtn: false, //是否显示分销中心
        isShowService: false, //服务协议弹窗
        content: ''
      }
    },
    watch: {
      isShow(val) {
        document.body.scrollTop = this.pageScrollYoffset;
        window.scroll(0, this.pageScrollYoffset);
      }
    },
    created() {
      let isShareShow = sessionStorage.getItem("isShareShow") || 1;
      if (isShareShow == 0) {
        this.isShareBtn = false;
      } else {
        this.isShareBtn = true;
      }
      this.getUserInfo()
      var token = this.getQueryString("token");
      if (token) {
        getWxToken();
      }
      $('html,body').css('height', window.innerHeight);
    },
    computed: {
      ...mapGetters([
        'userInfo'
      ])
    },
    methods: {
      getUserInfo() {
        this.api.post("getLoginState").then(res => {
          this.setUserInfo(res)
          if (res.code == 200) {
            sessionStorage.setItem('userInfo', JSON.stringify(res));
            this.userDeposit = res.obj.user.userDeposit
            localStorage.setItem('userDeposit', res.obj.user.userDeposit)
            this.noLogin = false
            this.userData = res.obj;
            this.getOrderData(); //获取订单数据
            this.getUsableCoupon();
          } else if (res.code == '406') {
            this.noLogin = true
          }
        })
      },
      getOrderData() {
        let data = {
          currentPage: 1,
          pageSize: 16,
          showStatus: 0
        }
        this.api.post('getOrderList').then(res => {
          this.payCount = res.other.s_payCount > 99 ? '99+' : res.other.s_payCount;
          this.deliveryCount = res.other.s_deliveryCount > 99 ? '99+' : res.other.s_deliveryCount;
          this.shipmentsCount = res.other.h_deliveryCount > 99 ? '99+' : res.other.h_deliveryCount;
          this.completedCount = res.other.h_completedCount > 99 ? '99+' : res.other.h_completedCount;
        })
      },
      goBack() {
        this.$router.go(-1);
      },
      goToorders: function (type) {
        if (type == 8) {
          this.$router.push('/contactUs')
          return
        }
        if (this.noLogin) {
          this.login()
          return
        }
        if ( type == 5) {
          this.$router.push('/coupon');
          return;
        }
        if (type == 6) {
          this.$router.push('/address')
          return
        }
        if (type == 7) {
          this.$router.push('/balance-history')
          return
        }
        this.$router.push({
          path: '/orders',
          query: {
            type: type
          }
        });
      },
      //服务协议
      serviceAgreement() {
        this.isShowService = true;
        if (!this.content) {
          this.getServiceAgreement();
        }
      },
      getServiceAgreement() {
        this.api.post('serviceAgreement').then(res => {
          this.content = res.obj;
        })
      },
      closePopup() {
        this.isShowService = false;
      },
      resetPwd: function () {
        // this.$router.push('/resetPwd')
      },
      login: function () {
        let backUrl = window.location.hash.substring(2);
        window.location.href = `${baseUrl}/shop/weChat_login_api.htm?url=${backUrl}&type=2`
      },
      unBinding: function () {
        this.$router.push({
          path: '/unBindingMobile'
        })
      },
      ...mapMutations({
        setUserInfo: 'SET_USER_INFO'
      }),
      handleShowPayBox(data) {
        this.payBoxData = [];
        this.showPayBox = true;
        this.payBoxData.push(data);
      },
      boxOnClose() {
        this.showPayBox = false;
      },
      //发货
      showShipment(item) {
        this.company = '';
        this.companyNum = '';
        this.isShow = true;
        this.orderId = item.id;
        this.api.post('getExpressCompany').then(res => {
          if (res.code == '200') {
            let arr = [];
            this.companyList = [];
            arr = res.obj;
            arr.map(item => {
              this.companyList.push({
                key: item.id,
                value: item.name
              })
            });
          }
        })

      },
      hideShipment() {
        this.isShow = false;
      },
      cancelCall() {
        this.isShow = false;
      },
      handleBlur() {
        let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        $('html,body').animate({
          scrollTop: scrollTop
        }, 300);
      },
      handleConfirm() {
        if (this.company != '' && this.companyNum != '') {
          let data = {
            id: this.orderId,
            ec_id: this.company,
            shipCode: this.companyNum
          }
          this.api.post('shipMents', data).then(res => {
            this.$toast(res.message)
            this.isShow = false;
            if (res.code == '200') {
              this.btnGoodSon = true;
              this.btndisabled = true;
              location.reload();
            }
          })
        } else {
          this.$toast('请填写完整信息')
        }
      },
      //分销中心
      handleToShareCenter() {
        if (this.noLogin) {
          this.login();
          return;
        }
        this.$router.push('/distributionCenter');
      },
      getUsableCoupon() {
        this.api.post('myAvailableCouponCount').then(res => {
          if (res && res.code == 200) {
            this.couponBadge = res.obj;
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  @red: #f0415f;
  @main: #1fbba6;

  [v-clock] {
    display: none;
  }

  .personal {
    padding-bottom: .6rem;
    // background-color: #f0f4f5;
    background-color: #eee;

    //个人信息
    .my_header_v4_wrap {
      margin-bottom: .08rem;
      padding: .08rem;
      background-color: #fff;

      .my_header_v4 {
        padding: .2rem .16rem;
        border-radius: .05rem;
        font-size: .16rem;
        color: #fff;
        background: #FF773A;

        .member-info {
          display: flex;

          img {
            width: .6rem;
            height: .6rem;
            border-radius: 50%;
          }

          .info-box {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            margin-left: .12rem;

            .my_header_msg {
              font-size: .14rem;
            }
          }
        }

        .no-login-info {
          width: 50%;
          display: flex;
          align-items: center;

          img {
            display: inline-block;
            width: .6rem;
            height: .6rem;
            border-radius: 50%;
          }

          .login-btn {
            margin-left: .12rem;
          }
        }
      }
    }

    //订单
    .info_block {
      padding: 0 .08rem;
      background: #fff;

      .item {
        padding: .16rem .07rem .16rem .16rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: .01rem solid #E1E1E1;

        .item_content {
          display: flex;
          align-items: center;

          .text {
            color: #333333;
            font-size: .14rem;
          }
        }

        .arrow {
          color: #cccccc;
          font-weight: 600;
        }
      }

      .order_wrap {
        background-color: #fff;
        width: 100%;

        .order_body {
          display: flex;
          padding: .15rem 0;

          .order_item {
            text-align: center;
            width: 100%;
            flex: 1;

            .item_link {
              display: flex;
              flex-direction: column;
              align-items: center;

              span {
                font-size: .12rem;
                color: #999999;
              }

              .icon {
                width: .3rem;
                height: .3rem;
                background-size: .3rem .3rem;
                background-repeat: no-repeat;
                position: relative;

                .badge {
                  box-sizing: border-box;
                  position: absolute;
                  right: 0;
                  top: .05rem;
                  transform: translateX(50%);
                  color: #fff;
                }
              }

              .daifukuan-icon {
                background-image: url('../../common/images/newIndex/daifukuan.png');
              }

              .daifahuo-icon {
                background-image: url('../../common/images/newIndex/daifahuo.png');
              }

              .daishouhuo-icon {
                background-image: url('../../common/images/newIndex/daishouhuo.png');
              }

              .yiwancheng-icon {
                background-image: url('../../common/images/newIndex/yiwancheng.png');
              }
            }
          }
        }
      }
    }

    //附加选项
    .weui-cell {
      height: .5rem;
      box-sizing: border-box;
      font-size: .14rem;
    }

    //弹窗
    .body {
      width: 100%;
      background-color: #fff;
      padding-top: .15rem;
      padding-bottom: .15rem;

      .type {
        margin: .15rem;
        text-align: center;
        border: .01rem solid #eee;

        input {
          width: 100%;
          height: .44rem;
          padding: 0 .15rem;
          box-sizing: border-box;
          outline: none;
          border: none;
        }
      }
    }

    .bottom {
      height: .54rem;
      width: 100%;
      // background-color: #FF4040;
      text-align: center;
      line-height: .54rem;
      color: #fff;

      .span {
        display: block;
        width: 50%;
        padding: 0;
        margin: 0;
        float: left;
      }

      .btn {
        height: 100%;
        background: #FF4040;
        color: #fff
      }
    }
  }
</style>
