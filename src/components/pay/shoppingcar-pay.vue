<template>
  <div class="shoppingcar-pay">
    <div class="pay-header">
      <span class="header-left" @click="closePay"></span>
    </div>

    <div class="maincon" style="padding:.42rem 0;">
      <!-- 收货地址 -->
      <div class="addr-sheet section" v-if="addressData > 0">
        <a class="addr-txt" @click="chooseAddress">
          <p class="person orient-h"></p>
          <span class="name cell">{{address.trueName}}</span>
          <span class="phone cell">{{address.mobile}}</span>
          <p>{{address.area}}，{{address.area_info}}</p>
        </a>
      </div>
      <div class="addr-sheet section" v-else>
        <a class="addr-txt" @click="chooseAddress">
          <span style="line-height: .44rem; color: #007aff">请添加收货地址信息</span>
        </a>
      </div>

      <!-- 商品明细 -->
      <div class="order-info vux-1px-tb">
        <div class="section">
          <div class="ord-list">

            <!-- 购物车商品展示 -->
            <div class="shop-item" v-for="(shopList,index) in newCarShoppingList">
              <div class="shop-name vux-1px-b">
                <img src="../../common/images/newIndex/cart_shop.png" alt="">
                <span>{{shopList.supplierName}}</span>
              </div>

              <!-- 商品列表 -->
              <div class="item" v-for="item in shopList.goodsInfos" v-if="isBuyNow=='false'">
                <img :src="item.url" alt="" class="prod-img">
                <div class="intro">
                  <h3>{{item.name}}</h3>
                  <p class="attrs" v-show="item.specMap && item.specMap.length > 0" v-for="citem in item.specMap">
                    【{{citem.value}}】</p>
                  <div class="howmuch">
                    单价：
                    <span class="sale-price">
                      <small>¥</small>
                      {{item.unitPrice}}
                    </span>
                  </div>
                  <div class="num">
                    x{{item.num}}
                  </div>
                </div>
                <div class="dis-area" v-if="item.goodsArea">
                  <span class="area-title">配送区域：</span>
                  <div class="area-content">
                    仅 {{item.goodsArea}}
                    <img class="string-arrows" src="../../common/images/newIndex/string-arrows.png"
                      @click="changeActive($event)" v-if="item.goodsArea.length >= 12"></img>
                  </div>
                </div>
              </div>
              <!-- 店铺选项 -->
                <!-- 配送方式和运费 -->
                <van-cell title="配送方式及运费" :value="shopList.transportDefaultValue" is-link
                  @click="chooseDistribution(shopList,index)"></van-cell>
                <!-- 发票 -->
                <van-cell title="选择开票类型" :value="shopList.billName" is-link @click="chooseDistribution2(shopList,index)"></van-cell>
                <van-cell v-show="shopList.bill_type == 1" title="个人发票还是公司发票" :value="shopList.personOrBusiness" is-link @click="chooseBill(index)"></van-cell>
                <van-field v-show="shopList.bill_type == 1 && shopList.bill == 1" placeholder="请输入单位名称" v-model="shopList.bill_content" rows="1" maxlength="50" autosize></van-field>
                <van-field v-show="shopList.bill_type == 1&& shopList.bill == 1" label="纳税识别码" placeholder="或统一社会信用代码" v-model="shopList.bill_no" rows="1" autosize></van-field>
                <van-cell title="专票请联系客服：02368141130" v-show="shopList.bill_type == 2"></van-cell>
            </div>
            <!-- end 购物车商品展示-->
          </div>
        </div>
      </div>

      <!-- 是否使用幸运值支付 -->
        <van-cell center title="是否使用幸运值" :label="`当前幸运值：${userDeposit}`">
          <template #right-icon>
            <van-switch v-model="useBalance" size="24" @change="changeBalanceSwitch" />
          </template>
        </van-cell>
      <!-- 备注 -->
      <van-field type="textarea" maxlength="150" label="备注" v-model="remark" placeholder="请填写150字以内备注信息" show-word-limit rows="2" style="margin-top:.1rem"></van-field>
      <!-- 结算卡片 -->
      <form-preview style="margin-top:.1rem;margin-bottom:.42rem;" v-show="!integral && isGray == false"
        header-label="需要支付" :header-value="showBuyMoney" :body-items="list" name="demo"></form-preview>

      <button
        style="width: 100%;background: #FF4040;height: .42rem;line-height: .42rem;color: #fff;font-size:.16rem;text-align: center;position:fixed;bottom:0;z-index:99;"
        :disabled="disabled" @click="pay" ref="mybox">
        {{submitBtn}}
      </button>

      <!--配送方式选择弹框-->
      <van-popup v-model="showPopup" class="checker-popup" position="bottom">
        <div style="padding:.1rem; background-color:#fff;">
          <p
            style="padding: .05rem .05rem .05rem .02rem; margin-bottom:.1rem; color:#888; text-align: center; background-color:#f3f3f3;">
            请选择配送方式</p>
          <checker v-model="transportDefault" default-item-class="demo4-item" selected-item-class="demo4-item-selected"
            disabled-item-class="demo4-item-disabled">
            <checker-item :value="item.key" v-for="(item,index) in transportMoney"
              @on-item-click="chooseTransport(index)" :key='index'>{{item.key}}</checker-item>
          </checker>
        </div>
      </van-popup>

      <!-- 开票类型 -->
      <div>
        <van-popup v-model="showPopup2" class="checker-popup" position="bottom">
          <div style="padding:.1rem; background-color:#fff;">
            <p
              style="padding: .05rem .05rem .05rem .02rem; margin-bottom:.1rem; color:#888; text-align: center; background-color:#f3f3f3;">
              请选择开票类型</p>
            <div class="demo4-item">
              <span @click="chooseBillType(0)" class="choose-bill">不开发票</span>
              <span @click="chooseBillType(1)" class="choose-bill">普通发票</span>
              <span @click="chooseBillType(2)" class="choose-bill">专票</span>
            </div>
          </div>
        </van-popup>

        <van-popup v-model="showPopup3" class="checker-popup" position="bottom">
          <div style="padding:.1rem; background-color:#fff;">
            <p
              style="padding: .05rem .05rem .05rem .02rem; margin-bottom:.1rem; color:#888; text-align: center; background-color:#f3f3f3;">
              个人发票还是单位发票</p>
            <div class="demo4-item">
              <span @click="onItemClick2(0)" class="choose-bill">个人</span>
              <span @click="onItemClick2(1)" class="choose-bill">单位</span>
            </div>
          </div>
        </van-popup>
      </div>
    </div>

    <!-- 提示 -->

    <!--支付选择框-->
    <pay-box :isShow='showPayBox' :payBoxData='payBoxData' @boxOnClose="boxOnClose"></pay-box>
  </div>
</template>

<script>
  import {
    Checker,
    CheckerItem,
    FormPreview
  } from "vux";
  import {
    mapMutations
  } from "vuex";
  import {
    getNormalGoodsDetail,
    getShareParmars
  } from "api/getData";
  import payBox from './pay-box.vue'
  export default {
    components: {
      Checker,
      CheckerItem,
      FormPreview,
      payBox
    },
    computed: {
      totalPrice: function () {
        return (
          Number(this.goodsPrice) * Number(this.goodsNum) +
          Number(this.shopMoney)
        ).toFixed(2);
      }
    },
    data() {
      return {
        transportDefault: "",
        transportDefaultValue: "请选择配送方式",
        showPopup: false,
        transportMoney: "", //运输费用
        totleTransportMoney: 0,
        // transportMoneyDefault: '请选择配送方式',
        address: [], //地址
        addressIndex: 0, //地址索引
        // addressName: ''

        type: "", //判断是否为积分
        storeid: "", //店铺id
        isBuyNow: "", //是否直接购买
        imgUrl: "", //图片链接
        goods: "",
        goodsName: "", //商品名称
        goodsMess: "", //商品信息字符串
        goodsMessObj: "", //商品详细对象
        goodsPrice: "", //
        newCarShoppingList: "", //购物车商品列表

        submitGoodsPrice: "", //提交的订单金额

        goodsNum: "",
        goodsId: "", //判断来源
        storeId_buycar: "",
        remark: "", //备注信息
        storeid: "",
        id: "",
        totalm: 0,
        integral: "", //是否是积分
        orderID: "", //订单id
        addressData: "", //地址数据
        string_: "",

        // 发票
        showPopup2: false,
        showPopup3: false,
        billCon: 0, //发票类型控制
        billCon2: 0, //个人或者单位
        bill: "不开发票",
        personOrBusiness: "个人",
        billHead: "",

        shopMoney: 0,
        goodscarMoney: 0,
        totalPrice1: 0,

        // 运费
        shopTotleMoney: 0, //存储供应商总价
        shopListIndex: "",

        shoppingTotlePrice: 0, //商品总价
        transportTotlePrice: -1, //运费总价

        loading: false,
        loadingText: "",
        wapFrom: "", //判断是否来源于微信

        useBalance: true, //判断是否使用幸运值
        userDeposit: 0, //用户幸运值
        useUserDeposit: 0, //订单使用幸运值
        showBuyMoney: "请先选择配送方式", //显示的幸运值
        packageInfo: "", //打包信息，提交订单时候提交到后台
        isDisable: false,
        tem: true,
        isGray: false,
        colorRed: "yellow",
        list: [],
        submitBtn: "确认支付",
        disabled: false,
        buttons2: [{
          style: "primary",
          text: "立即结算",
          onButtonClick: name => {
            if (this.isDisable == false) {
              this.pay();
            } else {
              return;
            }
          }
        }],
        showPayBox: false, //支付选择框
        payBoxData: [],
      };
    },
    created() {
      // 获取用户信息
      // 获取收货地址
      this._goodsDetailShare();
      this.api.post("getAddressList", {
        currentPage: "1"
      }).then(res => {
        this.addressData = res.obj.addressList.length;
        this.address = res.obj.addressList[this.addressIndex];
        if (this.address.show == 0) {
          this.$dialog.alert({
            title: '提示',
            message: this.address.msg
          })
        }
      });
    },
    mounted: function () {
      this.$nextTick(function () {
        // 判断是否是微信浏览器
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
          this.wapFrom = "weixin";
        } else {
          this.wapFrom = "yjyl";
        }

        var urlid = this.getQueryString("id"); //商品id
        var integral = this.getQueryString("integral_"); //是否为积分
        this.integral = integral;
        if (this.integral) {
          this.totalPrice1 = localStorage.getItem("price");
          this.goodsId = urlid;
        }

        var addressIndex = localStorage.getItem("addressIndex"); //获取地址索引
        this.addressIndex = addressIndex;
        if (this.addressIndex == null || this.addressIndex == "") {
          this.addressIndex = 0;
        }

        // console.log("地址索引"+this.addressIndex)

        var storeid = this.getQueryString("storeid");
        this.storeid = storeid; //店铺id
        var isBuyNow = this.getQueryString("isBuyNow");
        this.isBuyNow = isBuyNow; //是否直接购买
        this.imgUrl = localStorage.getItem("url"); //图片链接
        this.goodsName = localStorage.getItem("goodsName"); //商品名称
        this.goodsMess = localStorage.getItem("message"); //商品信息字符串
        this.goodsMessObj = JSON.parse(localStorage.getItem("messageobj")); //商品信息对象
        this.goodsPrice = localStorage.getItem("price"); //单价
        this.submitGoodsPrice = localStorage.getItem("price") / 0.75;
        this.goodsNum = localStorage.getItem("goodsNum"); //  数量

        this.userDeposit = localStorage.getItem("userDeposit"); // 获取用户幸运值
        if (this.userDeposit == -1) {
          this.useBalance = false;
        }

        this.storeId_buycar = localStorage.getItem("storeId_buycar"); //店铺id购物车过来

        // 整理购物车过来的商品信息
        var carGoods = "[" + localStorage.getItem("goods") + "]";
        carGoods = JSON.parse(carGoods);

        // 整理生成新的商品对象
        var newCarShoppingList = [];
        carGoods.forEach(data => {
          for (var i = 0; i < newCarShoppingList.length; i++) {
            if (newCarShoppingList[i].supplierId === data.supplierId) {
              newCarShoppingList[i].goodsInfos.push(data);
              return;
            }
          }
          newCarShoppingList.push({
            supplierId: data.supplierId,
            goodsInfos: [data],
            supplierName: data.supplierName,
            storeId: data.storeId,
            transportName: "",
            transportPrice: -1,
            bill_type: 0,
            bill: "0",
            bill_content: "",
            bill_no: "",
            billName: "不开发票",
            personOrBusiness: "个人",
            buy_type: ""
          });
        });
        // 给供应商增加总价格属性，商品id集合等属性
        newCarShoppingList.forEach(item => {
          item.transportDefaultValue = "请选择配送方式";
          var totlePrice = 0;
          var goodsIds = [];
          var specPropertyIds = [];
          item.goodsInfos.forEach(itemData => {
            totlePrice += Number(itemData.unitPrice) * itemData.num; //单厂商价格总和
            goodsIds.push(itemData.goodsId); //商品ID
            itemData.goodsNum = itemData.num; //商品数量
            itemData.goodsPrice = itemData.unitPrice; //商品价格
            itemData.unit = "unit"; //进销存单位
            itemData.remark = "remark"; //进销存备注
            var a = [];
            itemData.specMap.forEach((specMapItem, index) => {
              a.push(specMapItem.id);
            });

            itemData.specPropertyIds = a.join(","); //商品规格id，用，隔开
          });

          item.goodsIds = goodsIds.join(",");
          item.totlePrice = totlePrice;
          this.shoppingTotlePrice += totlePrice;
        });
        this.shoppingTotlePrice = this.shoppingTotlePrice.toFixed(2);

        // 结算卡片
        if (Number(this.transportTotlePrice) < 0) {
          this.list = [];
        } else {
          if (Number(this.userDeposit) != -1) {
            // 判断幸运值是否大于订单总价
            if (
              Number(this.userDeposit) >
              (
                Number(this.shoppingTotlePrice) + Number(this.transportTotlePrice)
              ).toFixed(2)
            ) {
              this.useUserDeposit = (
                Number(this.shoppingTotlePrice) + Number(this.transportTotlePrice)
              ).toFixed(2);
              this.showBuyMoney = `¥0.00`;
            } else {
              this.useUserDeposit = Number(this.userDeposit);
              this.showBuyMoney = `¥${(
              (
                Number(this.shoppingTotlePrice) +
                Number(this.transportTotlePrice)
              ).toFixed(2) - this.useUserDeposit
            ).toFixed(2)}`;
            }

            this.list = [{
                label: "商品总价",
                value: Number(this.shoppingTotlePrice).toFixed(2)
              },
              {
                label: "运费",
                value: Number(this.transportTotlePrice).toFixed(2)
              },
              {
                label: "订单金额",
                value: (
                  Number(this.shoppingTotlePrice) +
                  Number(this.transportTotlePrice)
                ).toFixed(2)
              },
              {
                label: "幸运值抵扣",
                value: this.useUserDeposit
              }
            ];
          } else {
            this.useUserDeposit = 0;
            this.list = [{
                label: "商品总价",
                value: Number(this.shoppingTotlePrice).toFixed(2)
              },
              {
                label: "运费",
                value: Number(this.transportTotlePrice).toFixed(2)
              },
              {
                label: "订单金额",
                value: (
                  Number(this.shoppingTotlePrice) +
                  Number(this.transportTotlePrice)
                ).toFixed(2)
              }
            ];
          }
        }
        this.newCarShoppingList = newCarShoppingList;
      });
    },
    methods: {
      changeActive(e) {
        e.currentTarget.parentElement.classList.toggle('area-content-active')
        e.currentTarget.classList.toggle('img-transform')
      },
      _goodsDetailShare: function () {
        const _this = this;
        var url = location.href.split("#")[0]; //url不能写死
        this.api
          .post("getShareParmars", {
            url: url,
            id: ""
          })
          .then(res => {
            wx.config({
              debug: false, ////生产环境需要关闭debug模式
              appId: res.config_appid, //appId通过微信服务号后台查看
              timestamp: res.config_timestamp, //生成签名的时间戳
              nonceStr: res.config_nonceStr, //生成签名的随机字符串
              signature: res.config_sign, //签名
              jsApiList: [
                //需要调用的JS接口列表
                "checkJsApi", //判断当前客户端版本是否支持指定JS接口
                "onMenuShareTimeline", //分享给好友
                "onMenuShareAppMessage" //分享到朋友圈
              ]
            });
            wx.ready(function () {
              var link = window.location.href;
              var protocol = window.location.protocol;
              var host = window.location.host;
              //分享给好友
              wx.onMenuShareAppMessage({
                title: "渝教商城", // 分享标题
                desc: "渝教商城", // 分享描述
                link: res.config_url + "/wap/eduIndex.htm#", // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                imgUrl: res.config_url + "/edu-static/img/sharelogo.jpg", // 自定义图标
                type: "link",
                dataUrl: ""
              });
              wx.error(function (res) {
                alert(res.errMsg);
              });
            });
            //分享朋友圈
            wx.onMenuShareTimeline({
              title: "渝教商城",
              link: "渝教商城",
              imgUrl: res.config_url + "/edu-static/img/sharelogo.jpg"
            });
          });
      },
      ...mapMutations({
        setUserInfo: "SET_USER_INFO"
      }),
      getQueryStringVal: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.href
          .substring(
            window.location.href.indexOf("?"),
            window.location.href.length
          )
          .substr(1)
          .match(reg);
        if (r != null) return unescape(r[2]);
        return null;
      },
      pay: function () {
        var me = this;
        this.tem = true;
        var readyAddress = false;
        var readyTransportChoose = false;
        var readyBill = false;

        // 判断是否填写了收获地址
        if (!this.addressData) {
          this.$toast('请先填写收货地址')
          return;
        } else {
          readyAddress = true;
        }

        // 判断是否选择了运费
        for (let i = this.newCarShoppingList.length - 1; i >= 0; i--) {
          if (
            this.newCarShoppingList[i].transportName == "" ||
            this.newCarShoppingList[i].transportName == null
          ) {
            readyTransportChoose = false;
            this.$toast('请选择配送方式')
            break;
          } else {
            readyTransportChoose = true;
          }
        }
        // readyTransportChoose = this.newCarShoppingList.every((item,index) => {
        //     return item.transportName
        // })
        // 判断是否填写了发票抬头
        let reg = /^[0-9A-Za-z]+$/;
        for (let i = this.newCarShoppingList.length - 1; i >= 0; i--) {
          if (
            (this.newCarShoppingList[i].bill_type == 1 &&
              this.newCarShoppingList[i].bill == 1 &&
              this.newCarShoppingList[i].bill_content == "") ||
            this.newCarShoppingList[i].bill_content == null
          ) {
            readyBill = false;
            this.$toast('请添加发票抬头')
            return false;
          } else if (
            (this.newCarShoppingList[i].bill_type == 1 &&
              this.newCarShoppingList[i].bill == 1 &&
              this.newCarShoppingList[i].bill_no == "") ||
            this.newCarShoppingList[i].bill_no == null
          ) {
            readyBill = false;
            this.$toast('请添加纳税识别码')
            return false;
          } else if (
            this.newCarShoppingList[i].bill_type == 1 &&
            this.newCarShoppingList[i].bill == 1 &&
            !reg.test(this.newCarShoppingList[i].bill_no)
          ) {
            readyBill = false;
            this.$toast('纳税人识别码格式不正确')
            return false;
          } else {
            readyBill = true;
          }
        }

        // 判断所有信息是否准备完成，准备支付
        if (readyAddress && readyTransportChoose && readyBill) {
          this.disabled = true;
          this.$refs.mybox.style.backgroundColor = "#ccc";
          this.isDisable = true;
          this.$http.post(global.COURSES + "/app/submitOrder.htm", {
              addr_id: this.address.id,
              isBuyNow: "0",
              msg: this.remark,
              from: this.wapFrom,
              isDeposit: this.useBalance ? "1" : "0",
              storeInfo: JSON.stringify(me.newCarShoppingList),
              profitUserid: sessionStorage.getItem("shareUserId") || '', //分销人id
              seq: 2 //生活超市
            })
            .then(function (res) {
              this.submitBtn = "正在提交...";
              this.$toast(res.body.message)
                if (res.body.code !== "200") {
                  this.isDisable = false;
                } else {
                  this.api.post("getLoginState").then(res => {
                    this.setUserInfo(res);
                    sessionStorage.setItem("userDeposit", res.obj.user.userDeposit);
                  });
                  res = res.body;
                  if (res.obj.realpay == 0) {
                    this.$router.push({
                      path: "/pay-success",
                      query: {
                        id: res.obj.orderNumber
                      }
                    });
                  } else {
                    // this.$router.push({
                    //   path: "/pay-way",
                    //   query: {
                    //     id: res.obj.id,
                    //     orderNumber: res.obj.orderNumber,
                    //     pay: res.obj.realpay
                    //   }
                    // });
                    this.showPayBox = true;
                    this.payBoxData = [];
                    this.payBoxData.push({
                      id: res.obj.id,
                      orderNumber: res.obj.orderNumber,
                      orderPay: res.obj.realpay,
                      pay: res.obj.total,
                      shipMoney: this.transportTotlePrice,
                      luckyValue: this.useUserDeposit,
                      isShowInfo: (Number(res.obj.total) - Number(res.obj.pay)) > 0, //是否显示拆单金额
                      deductPrice: Number(res.obj.total) - Number(res.obj.pay) //已扣除的金额
                    })
                  }
                }
              },
              function () {}
            );
        }
      },
      boxOnClose() {
        this.showPayBox = false;
        this.isDisable = false;
        this.disabled = false;
        this.submitBtn = '确认支付';
        this.$refs.mybox.style.backgroundColor = 'rgb(247, 100, 121)';
        this.$router.push({
          path: '/orders',
          query: {
            type: 1
          }
        })
      },
      chooseAddress: function () {
        this.$router.push({
          path: "/address",
          query: {
            fromPay: true
          }
        });
      },
      // 选择地址
      chooseDistribution: function (shopList, index) {
        this.shopListIndex = index;
        // console.log(this.shopListIndex)
        if (this.addressData > 0) {
          this.shopTotleMoney = shopList.totlePrice;

          // 获取运费
          var goodsInfos = [];
          var _goodsIds = [];
          shopList.goodsInfos.forEach(item => {
            goodsInfos.push({
              goods_id: item.goodsId,
              goods_num: item.num,
              goods_spec: item.specPropertyIds
            });
            _goodsIds.push(item.goodsId);
          });

          this.$http
            .post(global.COURSES + "/app/goods_transport_money.htm", {
              // 'goods_info': JSON.stringify(goodsInfos),
              goods_ids: _goodsIds.join(","),
              area_id: this.address.area_id,
              total_fee: shopList.totlePrice,
              supplierid: shopList.supplierId
            })
            .then(
              function (res) {
                res = res.body;
                if (res.code == 400) {
                  this.$toast('商品无法送达你的配送地址')
                  return
                }
                this.storeInfo = res.package || "";
                // this.transportMoney = res.obj.ship
                this.transportMoney = res.obj;
                this.showPopup = true;

                if (res.obj.length == 0) {
                  this.$dialog.alert({
                    title: '提示',
                    message: res.message
                  })
                  this.showPopup = false;
                }
              },
              function () {
                console.log(1);
              }
            );
        } else {
          this.$toast('请先填写收货地址')
        }
      },
      chooseTransport: function (index) {
        this.newCarShoppingList[
          this.shopListIndex
        ].transportDefaultValue = this.transportMoney[index].key;
        this.newCarShoppingList[
          this.shopListIndex
        ].transportName = this.transportMoney[index].key;
        this.newCarShoppingList[
          this.shopListIndex
        ].transportPrice = this.transportMoney[index].value;

        // 打包信息
        this.newCarShoppingList[this.shopListIndex].packages = this.packageInfo;

        var transportTotlePrice = 0;
        for (var i = 0; i < this.newCarShoppingList.length; i++) {
          if (this.newCarShoppingList[i].transportPrice >= 0) {
            transportTotlePrice += this.newCarShoppingList[i].transportPrice;
          } else if (this.newCarShoppingList[i].transportPrice < 0) {
            transportTotlePrice = -1;
            break;
          }
        }
        this.transportTotlePrice = transportTotlePrice.toFixed(2);

        // 结算卡片
        if (Number(this.transportTotlePrice) < 0) {
          this.list = [];
        } else {
          if (Number(this.userDeposit) != -1 && this.useBalance) {
            // 判断幸运值是否大于订单总价
            if (
              Number(this.userDeposit) >
              (
                Number(this.shoppingTotlePrice) + Number(this.transportTotlePrice)
              ).toFixed(2)
            ) {
              this.useUserDeposit = (
                Number(this.shoppingTotlePrice) + Number(this.transportTotlePrice)
              ).toFixed(2);
              this.showBuyMoney = `¥0.00`;
            } else {
              this.useUserDeposit = Number(this.userDeposit);
              this.showBuyMoney = `¥${(
              (
                Number(this.shoppingTotlePrice) +
                Number(this.transportTotlePrice)
              ).toFixed(2) - this.useUserDeposit
            ).toFixed(2)}`;
            }

            this.list = [{
                label: "商品总价",
                value: Number(this.shoppingTotlePrice).toFixed(2)
              },
              {
                label: "运费",
                value: Number(this.transportTotlePrice).toFixed(2)
              },
              {
                label: "订单金额",
                value: (
                  Number(this.shoppingTotlePrice) +
                  Number(this.transportTotlePrice)
                ).toFixed(2)
              },
              {
                label: "幸运值抵扣",
                value: this.useUserDeposit
              }
            ];
          } else {
            this.useUserDeposit = 0;
            this.showBuyMoney = `¥${(
            (
              Number(this.shoppingTotlePrice) + Number(this.transportTotlePrice)
            ).toFixed(2) - this.useUserDeposit
          ).toFixed(2)}`;
            this.list = [{
                label: "商品总价",
                value: Number(this.shoppingTotlePrice).toFixed(2)
              },
              {
                label: "运费",
                value: Number(this.transportTotlePrice).toFixed(2)
              },
              {
                label: "订单金额",
                value: (
                  Number(this.shoppingTotlePrice) +
                  Number(this.transportTotlePrice)
                ).toFixed(2)
              }
            ];
          }
        }

        this.showPopup = false;
      },
      changeBalanceSwitch: function (e) {
        // 结算卡片
        if (e) {
          if (Number(this.transportTotlePrice) < 0) {
            this.list = [];
            this.showBuyMoney = "请先选择配送方式";
          } else {
            // 判断幸运值是否大于订单总价
            if (
              Number(this.userDeposit) >
              (
                Number(this.shoppingTotlePrice) + Number(this.transportTotlePrice)
              ).toFixed(2)
            ) {
              this.useUserDeposit = this.useUserDeposit = (
                Number(this.shoppingTotlePrice) + Number(this.transportTotlePrice)
              ).toFixed(2);
              this.showBuyMoney = `¥0.00`;
            } else {
              this.useUserDeposit = Number(this.userDeposit);
              this.showBuyMoney = `¥${(
              (
                Number(this.shoppingTotlePrice) +
                Number(this.transportTotlePrice)
              ).toFixed(2) - this.useUserDeposit
            ).toFixed(2)}`;
            }

            this.list = [{
                label: "商品总价",
                value: Number(this.shoppingTotlePrice).toFixed(2)
              },
              {
                label: "运费",
                value: Number(this.transportTotlePrice).toFixed(2)
              },
              {
                label: "订单金额",
                value: (
                  Number(this.shoppingTotlePrice) +
                  Number(this.transportTotlePrice)
                ).toFixed(2)
              },
              {
                label: "幸运值抵扣",
                value: this.useUserDeposit
              }
            ];
          }
        } else {
          this.useUserDeposit = 0;
          if (Number(this.transportTotlePrice) < 0) {
            this.list = [];
          } else {
            this.showBuyMoney = `¥${Number(Number(this.shoppingTotlePrice) +
            Number(this.transportTotlePrice)).toFixed(2)}`;
            this.list = [{
                label: "商品总价",
                value: Number(this.shoppingTotlePrice).toFixed(2)
              },
              {
                label: "运费",
                value: Number(this.transportTotlePrice).toFixed(2)
              },
              {
                label: "订单金额",
                value: (
                  Number(this.shoppingTotlePrice) +
                  Number(this.transportTotlePrice)
                ).toFixed(2)
              }
            ];
          }
        }
      },
      // 发票
      chooseDistribution2: function (shopList, index) {
        this.shopListIndex = index;
        this.showPopup2 = true;
      },
      chooseBill: function (index) {
        this.shopListIndex = index;
        this.showPopup3 = true;
      },
      chooseBillType: function (e) {
        if (e == 0) {
          this.showPopup2 = false;
          this.newCarShoppingList[this.shopListIndex].bill_type = 0;
          this.newCarShoppingList[this.shopListIndex].billName = "不开发票";
        } else if (e == 1) {
          this.showPopup2 = false;
          this.newCarShoppingList[this.shopListIndex].bill_type = 1;
          this.newCarShoppingList[this.shopListIndex].billName = "普通发票";
        } else if (e == 2) {
          this.showPopup2 = false;
          this.newCarShoppingList[this.shopListIndex].bill_type = 2;
          this.newCarShoppingList[this.shopListIndex].billName = "专票";
        }
      },
      onItemClick2: function (e) {
        this.showPopup3 = false;
        if (e == 0) {
          this.newCarShoppingList[this.shopListIndex].personOrBusiness = "个人";
          this.newCarShoppingList[this.shopListIndex].bill = 0;
          console.log(this.newCarShoppingList[this.shopListIndex].bill);
        } else {
          this.newCarShoppingList[this.shopListIndex].personOrBusiness = "单位";
          this.newCarShoppingList[this.shopListIndex].bill = 1;
        }
      },
      closePay() {
        this.$router.back();
      }
    }
  };
</script>

<style lang="less">
  @red: #f0415f;

  .weui-form-preview__btn_primary {
    color: #fff !important;
  }

  .weui-form-preview__btn {
    background-color: #ee4461;
    // background-color: colorRed
  }

  .weui-form-preview__value {
    color: #ee4461;
  }

  button {
    border: 0;
  }

  .shoppingcar-pay {
    .van-cell {
      font-size: 0.16rem;

      &::before {
        content: " ";
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        height: .01rem;
        border-top: .01rem solid #D9D9D9;
        color: #D9D9D9;
        -webkit-transform-origin: 0 0;
        transform-origin: 0 0;
        -webkit-transform: scaleY(0.5);
        transform: scaleY(0.5);
        left: .15rem;
      }
    }

    .pay-header {
      width: 100%;
      height: .46rem;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 300;
      background: #fff;
      box-shadow: 0 .02rem .04rem #ccc;

      .header-left {
        position: absolute;
        left: .18rem;
        top: .14rem;
        width: .22rem;
        height: .22rem;
        background: url('../../common/images/newIndex/go_back.png') no-repeat;
        background-size: .22rem .22rem;
      }
    }

    .addr-sheet {
      display: block;
      line-height: 1.4;
      font-size: .14rem;
      background: #fff;

      &:after {
        content: "";
        display: block;
        height: .05rem;
        background-image: linear-gradient(135deg,
            #82c9ff .08rem,
            transparent .08rem,
            transparent .16rem,
            #ff8282 .16rem,
            #ff8282 .32rem,
            transparent .32rem,
            transparent .32rem,
            transparent .4rem,
            #82c9ff .4rem,
            #82c9ff);
        background-color: #fff;
        background-size: .68rem .05rem;
      }

      .addr-txt {
        position: relative;
        display: block;
        padding: .1rem .15rem;
        color: #333;

        .person {
          padding: .04rem 0 .1rem;
        }

        .cell {
          display: inline-block;
          padding-bottom: .08rem;
          width: 40%;
          font-size: .16rem;
        }

        .phone {
          float: right;
          padding-right: .1rem;
          text-align: right;
        }
      }
    }

    .order-info {
      .section {
        margin: .1rem 0;

        // background-color: #fff;
        .ord-list {
          .shop-item {
            // border-bottom: 5px solid #f0f4f5;
            margin-bottom: .1rem;
            background: #fff;
            // text-align: center;
          }

          .shop-name {
            display: flex;
            align-items: center;
            line-height: .4rem;
            margin: 0 .16rem;

            img {
              width: .16rem;
              height: .16rem;
            }

            span {
              font-size: .12rem;
              margin-left: .1rem;
            }
          }

          .item {
            position: relative;
            z-index: 0;
            padding: .15rem .1rem;
            padding: .15rem .1rem 0 .1rem;
            overflow: hidden;

            .prod-img {
              float: left;
              width: .82rem;
              height: .82rem;
              box-shadow: 0 0 0 .005rem #e5e5e5;
            }

            .intro {
              position: relative;
              margin-left: .94rem;
              padding-right: .2rem;
              line-height: .26rem;
              overflow: hidden;
              text-align: left;

              h3 {
                font-size: .14rem;
                font-weight: normal;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }

              .attrs {
                display: inline-block;
                color: #999;
                font-size: .14rem;
                font-weight: normal;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }

              .howmuch {
                line-height: .21rem;
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
                font-size: .12rem;
              }
            }
          }
        }
      }
    }

    .section {
      // margin-bottom: 10px;
    }

    .card-bottom {
      position: fixed;
      bottom: 0;
      height: .54rem;
      width: 100%;
      background-color: #fff;
      padding: 0 .15rem;

      .cb {
        float: left;
        line-height: .54rem;
      }

      .card-left {
        margin-right: .24rem;
      }

      .card-middle {
        padding-top: .08rem;
        line-height: .2rem;

        .price {
          color: @red;
        }

        .total-price {
          font-weight: 500;
        }

        .trans-price {
          font-size: .14rem;
        }
      }

      .card-right {
        float: right;
        width: 30%;
        background-color: @red;
        padding-right: .1rem;

        a {
          display: inline-block;
          width: 100%;
          color: #fff;
          text-align: center;
        }
      }
    }

    .choose-bill {
      display: block;
      line-height: .44rem;
      color: #000;
    }
  }

  .demo4-item {
    background-color: #fff;
    text-align: center;
    width: 80%;
    color: #222;
    font-size: .14rem;
    padding: .1rem 10%;
    margin-right: .1rem;
    line-height: .18rem;
    border-radius: .15rem;
  }

  .demo4-item-selected {
    // background-color: #1fbba6;
    color: #1fbba6;
  }

  .demo4-item-disabled {
    color: #999;
  }

  .bill {
    background-color: #fff;

    .bill-ul {
      padding: .1rem 0;

      .bill-li {
        display: inline-block;
        width: 30%;
        text-align: center;
      }
    }
  }

  // 新增配送区域
  .dis-area {
    background: #fff;
    position: relative;
    display: flex;
    color: #FF773A;
    margin-top: .08rem;
    font-size: .14rem;

    .area-title {
      flex-shrink: 0;
    }

    .area-content {
      margin-left: .02rem;
      height: .22rem;
      padding-right: .2rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;

      .string-arrows {
        position: absolute;
        top: .02rem;
        right: .04rem;
        width: .2rem;
        height: .2rem;
      }

      .img-transform {
        transform: rotate(180deg);
      }
    }

    .area-content-active {
      height: auto;
      overflow: visible;
      white-space: normal;
    }
  }
</style>
