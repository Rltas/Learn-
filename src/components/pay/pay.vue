<template>
  <div class="pay">
    <div class="pay-header">
      <span class="header-left" @click="closePay"></span>
    </div>

    <div class="maincon" style="">
      <!-- 收货地址 -->

      <div class="addr-sheet section" v-if="addressDataLength > 0">
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

            <!-- 商品1 -->
            <div class="item" v-if="isBuyNow=='true' || integral=='true' ">
              <img :src="imgUrl" alt="" class="prod-img">
              <div class="intro">
                <h3>{{goodsName}}</h3>
                <p class="attrs" v-show="isBuyNow=='true'" v-for="item in goodsMessObj">【{{item.value}}】</p>
                <div class="howmuch">
                  <span v-if="integral=='true'">积分：</span>
                  <span v-if="integral=='' || integral==null">单价：</span>
                  <span class="sale-price">
                    <small v-if="integral=='' || integral==null">¥</small>
                    {{goodsPrice}}
                  </span>
                </div>
                <div class="num">
                  x{{goodsNum}}
                </div>
              </div>
              <div class="dis-area" v-if="goodsArea">
                <span class="area-title">配送区域：</span>
                <div class="area-content">
                  仅 {{goodsArea}}
                  <img class="string-arrows" src="../../common/images/newIndex/string-arrows.png"
                    @click="changeActive($event)" v-if="goodsArea.length >= 12"></img>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 配送方式 -->
      <div class="pay-van-cell">
        <van-cell title="配送方式及运费" value="免运费" is-link v-if="integral" />
        <van-cell title="配送方式及运费" :value="transportDefaultValue" is-link @click="chooseDistribution" v-else />
        <van-cell center title="是否使用幸运值" :label="`当前幸运值：${userDeposit}`">
          <template #right-icon>
            <van-switch v-model="useBalance" size="24" @change="changeBalanceSwitch" />
          </template>
        </van-cell>
      </div>
      <van-popup v-model="showPopup" class="checker-popup" position="bottom">
        <div style="padding:10px 10px 10px 10px; background-color:#fff;">
          <p
            style="padding: 5px 5px 5px 2px; margin-bottom:10px; color:#888; text-align: center; background-color:#f3f3f3;">
            请选择配送方式</p>
          <checker v-model="transportDefault" default-item-class="demo4-item" selected-item-class="demo4-item-selected"
            disabled-item-class="demo4-item-disabled">
            <checker-item :value="item.key" v-for="(item,index) in transportMoney" @on-item-click="onItemClick(index)">
              {{item.key}}</checker-item>
          </checker>
        </div>
      </van-popup>

      <!-- 发票 -->
      <div v-show="!integral">
          <van-cell title="选择开票类型" :value="bill" is-link @click="chooseDistribution2"></van-cell>
          <van-cell v-show="billCon == 1" title="个人发票还是公司发票" :value="personOrBusiness" is-link @click="chooseBill"></van-cell>
          <van-field  v-show="billCon2 == 1" placeholder="请输入单位名称" v-model="billHead" maxlength="50" @focus="showButtom('focus')" @blur="showButtom('blur')" rows="2"></van-field>
         <van-field  v-show="billCon2 == 1" label="纳税人识别码" placeholder="或统一社会信用代码" v-model="bill_no" autosize></van-field>
          <van-cell v-show="billCon == 2" title="专票请联系客服：02368141130"></van-cell>
        <van-popup v-model="showPopup2" class="checker-popup" position="bottom">
          <div style="padding:10px 10px 10px 10px; background-color:#fff;">
            <p
              style="padding: 5px 5px 5px 2px; margin-bottom:10px; color:#888; text-align: center; background-color:#f3f3f3;">
              请选择开票类型</p>
            <div class="demo4-item">
              <span @click="chooseBillType(0)" class="choose-bill">不开发票</span>
              <span @click="chooseBillType(1)" class="choose-bill">普通发票</span>
              <span @click="chooseBillType(2)" class="choose-bill">专票</span>
            </div>
          </div>
        </van-popup>

        <van-popup v-model="showPopup3" class="checker-popup" position="bottom">
          <div style="padding:10px 10px 10px 10px; background-color:#fff;">
            <p
              style="padding: 5px 5px 5px 2px; margin-bottom:10px; color:#888; text-align: center; background-color:#f3f3f3;">
              个人发票还是单位发票</p>
            <div class="demo4-item">
              <span @click="onItemClick2(0)" class="choose-bill">个人</span>
              <span @click="onItemClick2(1)" class="choose-bill">单位</span>
            </div>
          </div>
        </van-popup>
      </div>

      <!-- 买家留言 -->
      <van-field label="备注" maxlength="150" v-model="remark" placeholder="请填写150字以内备注信息" rows="2" show-word-limit type="textarea"></van-field>
      <!-- 结算卡片 -->
      <form-preview style="margin-top:10px;margin-bottom:42px;" v-show="!integral" header-label="需要支付"
        :header-value="showBuyMoney" :body-items="list" name="demo"></form-preview>

      <button v-show="!integral"
        style="width: 100%;background: #FF4040;height: 42px;line-height: 42px;color: #fff;font-size:16px;text-align: center;position:fixed;bottom:0;z-index:99;"
        :disabled="disabled" @click="pay" ref="mybox">
        {{submitBtn}}
      </button>

    </div>
    <!-- </scroller> -->

    <!-- 底部 -->
    <div class="card-bottom vux-1px-t" v-show="integral=='true'">
      <!-- 直接购买 -->
      <div class="cb card-middle" v-if="isBuyNow=='true' || integral=='true'">
        <div class="total-price">
          <span v-if="integral=='true'">所需积分：<span class="price">{{totalPrice}}</span></span>
          <span v-if="integral=='' || integral==null">总计：<span class="price"
              v-if="money === '' || money === null">请先选择配送方式</span><span class="price" v-else>¥
              {{buyMoney}}</span></span>
        </div>
        <div class="trans-price" v-show="isBuyNow=='true'">包含运费：<span
            v-if="money === '' || money === null">--</span><span v-else>¥{{money}}</span></div>
        <div class="trans-price" v-show="integral=='true'">包含运费：¥0</div>
      </div>

      <div class="cb card-right" v-if="integral == 'true'">
        <a @click="dhSubmit">立即兑换</a>
      </div>
    </div>
    <br>


    <!-- 提示 -->

    <!--支付选择框-->
    <pay-box :isShow='showPayBox' :payBoxData='payBoxData' @boxOnClose="boxOnClose"></pay-box>
  </div>
</template>

<script>
  import {
    Checker,
    CheckerItem,
    FormPreview,
  } from 'vux'
  import {
    mapMutations
  } from "vuex"
  import payBox from './pay-box.vue'
  export default {
    components: {
      Checker,
      CheckerItem,
      FormPreview,
      payBox
    },
    data() {
      return {
        transportDefault: '',
        transportDefaultValue: '请选择配送方式',
        showPopup: false,
        transportMoney: '', //运输费用
        money: '',
        // transportMoneyDefault: '请选择配送方式',
        address: [], //地址
        addressIndex: 0, //地址索引
        // addressName: ''
        type: '', //判断是否为积分
        storeid: '', //店铺id
        isBuyNow: '', //是否直接购买
        imgUrl: '', //图片链接
        goods: '',
        goodsName: '', //商品名称
        goodsMess: '', //商品信息字符串
        goodsMessObj: '', //商品详细对象
        goodsPrice: '', //
        newCarShoppingList: '', //购物车商品列表

        submitGoodsPrice: '', //提交的订单金额

        goodsNum: '',
        goodsId: '', //判断来源
        storeId_buycar: '',
        remark: '', //备注信息
        storeid: '',
        id: '',
        totalm: 0,
        integral: false, //是否是积分
        orderID: '', //订单id
        addressDataLength: '', //地址数据
        string_: '',

        // 发票
        showPopup2: false,
        showPopup3: false,
        billCon: 0, //发票类型控制
        billCon2: 0, //个人或者单位
        bill: '不开发票',
        personOrBusiness: '个人',
        billHead: '',
        bill_no: '', //纳税号

        shopMoney: 0,
        goodscarMoney: 0,
        totalPrice: 0,

        supplierId: '',
        wapFrom: '', //判断是否来源于微信

        useBalance: true, //判断是否使用幸运值
        userDeposit: -1, //用户幸运值
        useUserDeposit: 0, //订单使用幸运值
        showBuyMoney: '请先选择配送方式', //显示的幸运值

        packageInfo: '', //打包信息，提交订单时候提交到后台
        isDisable: false,
        submitBtn: '确认支付',
        disabled: false,
        areaReady: true,
        list: [],
        buttons2: [{
          style: 'primary',
          text: '立即结算',
          onButtonClick: (name) => {
            if (this.isDisable == false) {
              this.pay()
            } else {
              return
            }
          }
        }],
        showPayBox: false, //支付选择框
        payBoxData: [],
        goodsArea: '',
        areaState: false
      }
    },
    mounted: function () {
      this.$nextTick(function () {

        // 判断是否是微信浏览器
        var ua = window.navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
          this.wapFrom = 'weixin'
        } else {
          this.wapFrom = 'yjyl'
        }

        var me = this;
        var urlid = this.getQueryString("id") //商品id
        var integral = this.getQueryString("integral_") //是否为积分
        this.integral = integral
        if (this.integral) {
          this.totalPrice = (Number(localStorage.getItem("price")) * Number(localStorage.getItem("goodsNum")))
          this.goodsId = urlid
        }

        var addressIndex = localStorage.getItem("addressIndex") //获取地址索引
        this.addressIndex = addressIndex
        if (this.addressIndex == null || this.addressIndex == '') {
          this.addressIndex = 0
        }

        var storeid = this.getQueryString("storeid")
        this.storeid = storeid //店铺id
        var isBuyNow = this.getQueryString("isBuyNow")
        this.isBuyNow = isBuyNow //是否直接购买
        this.imgUrl = localStorage.getItem("url") //图片链接
        this.goodsName = localStorage.getItem("goodsName") //商品名称
        this.goodsMess = localStorage.getItem("message") //商品信息字符串
        this.goodsMessObj = JSON.parse(localStorage.getItem("messageobj")) //商品规格信息对象
        this.goodsPrice = localStorage.getItem("price") //单价
        this.submitGoodsPrice = localStorage.getItem("price")
        this.goodsNum = localStorage.getItem("goodsNum") //  数量
        this.goodsArea = localStorage.getItem('goodsArea') //可配送区域
        this.supplierId = localStorage.getItem("supplierId")
        this.userDeposit = Number(localStorage.getItem("userDeposit")) // 获取用户幸运值
        if (this.userDeposit == -1) {
          this.useBalance = false
        }
        this.storeId_buycar = localStorage.getItem("storeId_buycar") //店铺id购物车过来

        // 费用总和
        if (isBuyNow != 'true') {
          // console.log(this.goods)
          this.goods.forEach(item => {
            this.shopMoney += Number(item.unitPrice) * Number(item.num)
            // this.goodscarMoney += (Number(item.unitPrice) * Number(item.num))
          })
          this.shopMoney = Number(this.shopMoney).toFixed(2)
          // console.log(this.shopMoney)
        } else {
          this.shopMoney = Number(this.goodsPrice) * Number(this.goodsNum)
        }

        if (isBuyNow == 'true' || this.integral == 'true') {
          this.goodsId = urlid //判断来源
          if (this.goodsMessObj == null || this.goodsMessObj.length == 0) {
            me.no = true
          };
        }
      })

    },
    created() {
      // 获取用户信息
      const _this = this;

      // 获取收货地址
      this.api.post('getAddressList', {
        currentPage: '1'
      }).then(res => {
        let addressList = res.obj.addressList;
        let addressNormal = [];
        let addressNoUse = [];
        addressList.forEach((item, index) => {
          if (item.show == '0') {
            addressNoUse.push(item)
          }
          if (item.show == '1') {
            addressNormal.push(item)
          }
        })
        let address = addressNormal.concat(addressNoUse);

        // if(address[0].show == '0'){
        //   this.areaReady = false
        // }
        // _this.addressDataLength = res.obj.addressList.length
        // _this.address = res.obj.addressList[_this.addressIndex];
        _this.addressDataLength = address.length
        _this.address = address[_this.addressIndex];
        if (_this.address.show == 0) {
          this.$dialog.alert({
            title: '提示',
            message: _this.address.msg
          })
          this.areaReady = false;
        } else {
          this.areaReady = true;
        }
        if (res.code != 200) {
          _this.$router.push('/')
        } else {
          // 如果有用户信息，获取快递费用
          var transportValue = [];

          var specIds = []
          _this.goodsMessObj.forEach(item => {
            specIds.push(item.id)
          })

          _this.api.post('getTransportMoney', {
            'goods_ids': _this.goodsId,
            'area_id': _this.address.area_id,
            'total_fee': _this.shopMoney,
            'supplierid': _this.supplierId
          }).then(res => {
            //  打包信息，提交订单时候提交到后台
            _this.storeInfo = res.package || ''

            // _this.transportMoney = res.obj.ship
            // _this.transportDefault = res.obj.ship[0] //积分运
            if (res.code == 400) {
              this.areaState = true
              return
            }
            if (res.obj.length == 0) {
              this.$dialog.alert({
                title: '提示',
                message: res.message
              })
            }
            _this.transportMoney = res.obj
            _this.transportDefault = res.obj[0] //积分运费

            _this.transportMoney.sort((a, b) => {
              return a.value - b.value
            })

            _this.transportDefaultValue = _this.transportMoney[0].key
            _this.money = _this.transportMoney[0].value.toFixed(2)
            _this.buyMoney = (Number(_this.shopMoney) + Number(_this.money)).toFixed(2)
            if (Number(_this.userDeposit) != -1 && _this.useBalance) {
              // 判断幸运值是否大于订单总价
              if (Number(_this.userDeposit) > _this.buyMoney) {
                _this.useUserDeposit = _this.buyMoney
                _this.showBuyMoney = `¥0.00`
              } else {
                _this.useUserDeposit = Number(_this.userDeposit)
                _this.showBuyMoney = `¥${(_this.buyMoney - _this.useUserDeposit).toFixed(2)}`
              }

              _this.list = [{
                label: '商品总价',
                value: Number(_this.shopMoney).toFixed(2)
              }, {
                label: '运费',
                value: Number(_this.money).toFixed(2)
              }, {
                label: '订单金额',
                value: _this.buyMoney
              }, {
                label: '幸运值抵扣',
                value: _this.useUserDeposit
              }]
            } else {
              if (_this.buyMoney) {
                _this.useUserDeposit = 0;
                _this.showBuyMoney = `￥${_this.buyMoney}`
                _this.list = [{
                  label: '商品总价',
                  value: Number(_this.shopMoney).toFixed(2)
                }, {
                  label: '运费',
                  value: Number(_this.money).toFixed(2)
                }, {
                  label: '订单金额',
                  value: _this.buyMoney
                }]
              } else {
                _this.showBuyMoney = '请先选择配送方式'
                _this.list = []
              }
            }
          })
        }
      })
    },
    methods: {
      ...mapMutations({
        setUserInfo: 'SET_USER_INFO'
      }),
      changeActive(e) {
        e.currentTarget.parentElement.classList.toggle('area-content-active')
        e.currentTarget.classList.toggle('img-transform')
      },
      getQueryStringVar: function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.href.substring(window.location.href.indexOf('?'), window.location.href.length).substr(
          1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
      },
      // 选择配送方式
      onItemClick(index, disabled) {
        this.money = this.transportMoney[index].value.toFixed(2);

        this.buyMoney = (Number(this.shopMoney) + Number(this.money)).toFixed(2)
        this.transportDefaultValue = this.transportMoney[index].key;
        if (!this.disabled) {
          this.showPopup = false
        }

        if (Number(this.userDeposit) != -1 && this.useBalance) {
          // 判断幸运值是否大于订单总价
          if (Number(this.userDeposit) > this.buyMoney) {
            this.useUserDeposit = this.buyMoney
            this.showBuyMoney = `¥0.00`
          } else {
            this.useUserDeposit = Number(this.userDeposit)
            this.showBuyMoney = `¥${(this.buyMoney - this.useUserDeposit).toFixed(2)}`
          }

          this.list = [{
            label: '商品总价',
            value: Number(this.shopMoney).toFixed(2)
          }, {
            label: '运费',
            value: Number(this.money).toFixed(2)
          }, {
            label: '订单金额',
            value: this.buyMoney
          }, {
            label: '幸运值抵扣',
            value: this.useUserDeposit
          }]
        } else {
          if (this.buyMoney) {
            this.useUserDeposit = 0;
            this.showBuyMoney = `￥${this.buyMoney}`
            this.list = [{
              label: '商品总价',
              value: Number(this.shopMoney).toFixed(2)
            }, {
              label: '运费',
              value: Number(this.money).toFixed(2)
            }, {
              label: '订单金额',
              value: this.buyMoney
            }]
          } else {
            this.showBuyMoney = '请先选择配送方式'
            this.list = []
          }
        }

      },
      changeBalanceSwitch(e) {
        if (e) {
          if (this.buyMoney) {
            // 判断幸运值是否大于订单总价
            if (Number(this.userDeposit) > this.buyMoney) {
              this.useUserDeposit = this.buyMoney
              this.showBuyMoney = `¥0.00`
            } else {
              this.useUserDeposit = Number(this.userDeposit)
              this.showBuyMoney = `¥${(this.buyMoney - this.useUserDeposit).toFixed(2)}`
            }

            this.list = [{
              label: '商品总价',
              value: Number(this.shopMoney).toFixed(2)
            }, {
              label: '运费',
              value: Number(this.money).toFixed(2)
            }, {
              label: '订单金额',
              value: this.buyMoney
            }, {
              label: '幸运值抵扣',
              value: this.useUserDeposit
            }]
          } else {
            this.showBuyMoney = '请先选择配送方式'
            this.list = []
          }

        } else {
          if (this.buyMoney) {
            this.useUserDeposit = 0;
            this.showBuyMoney = `¥${this.buyMoney}`
            this.list = [{
              label: '商品总价',
              value: Number(this.shopMoney).toFixed(2)
            }, {
              label: '运费',
              value: Number(this.money).toFixed(2)
            }, {
              label: '订单金额',
              value: this.buyMoney
            }]
          } else {
            this.showBuyMoney = '请先选择配送方式'
            this.list = []
          }

        }
      },
      pay: function () {

        var arr = [];
        var _this = this;

        var storeInfo = [];
        var isBuyNow_ = '0'; //是否直接购买0：false，1：true
        if (this.isBuyNow == 'true') {
          isBuyNow_ = '1';
          var storeInfo = [{
            'packages': _this.packageInfo,
            'storeId': _this.storeid,
            'supplierId': _this.supplierId,
            'transportName': _this.transportDefaultValue,
            'transportPrice': _this.money,
            'bill_type': _this.billCon,
            'bill': _this.billCon2,
            'bill_content': _this.billHead,
            'bill_no': _this.bill_no,
            'goodsInfos': [{
              'goodsId': _this.goodsId,
              'goodsNum': _this.goodsNum,
              'goodsPrice': _this.submitGoodsPrice,
              'buy_type': '',
              'specPropertyIds': _this.goodsMess
            }]
          }]
        }

        // 判断是否存在收货地址
        let reg = /^[0-9A-Za-z]+$/;
        if (this.addressDataLength > 0) {
          let len = this.bill_no.length == 15 || this.bill_no.length == 18 || this.bill_no.length == 20;
          if (this.areaState) {
            this.$toast('商品无法送达你的配送地址')
          } else if (this.money === '' || this.money === null) {
            this.showPopup = true; //判断是否选择了配送方式
          } else if (this.billCon == 1 && this.billCon2 == 1 && this.billHead == '' || this.billHead == null) {
            this.$toast('请添加发票抬头')
          } else if (this.billCon == 1 && this.billCon2 == 1 && this.bill_no == '' || this.bill_no == null) {
            this.$toast('请填写纳税人识别码')
          } else if (this.billCon == 1 && this.billCon2 == 1 && !len) {
            this.$toast('纳税人识别号位数有误')
          } else if (this.billCon == 1 && this.billCon2 == 1 && !reg.test(this.bill_no)) {
            this.$toast('纳税人识别号只能是数字或字母')
          } else {
            this.isDisable = true
            this.disabled = true
            this.$refs.mybox.style.backgroundColor = '#ccc';
            this.$http.post(global.COURSES + "/app/submitOrder.htm", {
              'addr_id': _this.address.id,
              'isBuyNow': isBuyNow_,
              'msg': _this.remark, //提交定单传备注信息
              'from': _this.wapFrom,
              'isDeposit': this.useBalance ? '1' : '0',
              'storeInfo': JSON.stringify(storeInfo),
              profitUserid: sessionStorage.getItem("shareUserId") || '', //分销人id
              seq: 2, //生活超市
            }).then(function (res) {
              this.submitBtn = '正在提交...'
              this.api.post("getLoginState").then(res => {
                _this.setUserInfo(res)
                localStorage.setItem('userDeposit', res.obj.user.userDeposit)
              })
              res = res.body
              this.$toast(res.message)
              if (res.obj.realpay == 0) {
                this.$router.push({
                  path: '/pay-success',
                  query: {
                    id: res.obj.orderNumber
                  }
                })
              } else {
                // this.$router.push({
                // 	path: '/pay-way',
                // 	query: {
                // 		id: res.obj.id,
                // 		orderNumber: res.obj.orderNumber,
                // 		pay: res.obj.realpay
                // 	}
                // })
                this.showPayBox = true;
                this.payBoxData = [];
                this.payBoxData.push({
                  id: res.obj.id,
                  orderNumber: res.obj.orderNumber,
                  pay: res.obj.total,
                  orderPay: res.obj.realpay,
                  shipMoney: this.money,
                  luckyValue: this.useUserDeposit,
                  isShowInfo: false //是否显示拆单金额
                })
              }

            }, function () {
              console.log(1)
            });
          }
        } else {
          this.$toast('请填写收货地址')
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
      //  积分
      dhSubmit: function () {
        if (this.areaReady == false) {
          this.$dialog.alert({
            title: '提示',
            message: '尊敬的客户，由于合作快递公司的缘故，目前黑龙江、吉林、辽宁、海南、内蒙古、新疆、西藏等地区无法发货，对您购物造成了不便，我们深表歉意。请重新选择地址'
          })
        } else if (this.addressDataLength > 0) {
          var me = this
          var goodsInfos = [{
            'goodsId': this.goodsId,
            'goodsNum': this.goodsNum
          }]
          this.$http.post(global.COURSES + "/app/submitOrder_integral.htm", {
            'addr_id': me.address.id,
            'msg': this.remark,
            'goodsInfos': JSON.stringify(goodsInfos)
          }).then(function (res) {
            res = res.body

            if (res.code != 200) { //异常情况提示
              this.$dialog.alert({
                title: '提示',
                message: res.message
              })
            } else { //正常情况提示
              this.$router.push({
                path: '/pay-success',
                query: {
                  id: res.obj.orderNumber
                }
              })
            }
          }, function () {});
        } else {
          this.$toast('请先填写收货地址')
        }

      },
      chooseAddress: function () {
        this.$router.push({
          path: '/address',
          query: {
            fromPay: true
          }
        })
      },
      chooseDistribution: function () {
        if (this.areaState) {
          this.$toast('商品无法送达你的配送地址')
          return;
        }
        if (this.transportMoney && this.transportMoney.length == 0) {
          this.$dialog.alert({
            title: '提示',
            message: '当前收货地址不支持发货'
          })
          return
        }
        if (this.addressDataLength > 0) {
          this.showPopup = true
        } else {
          this.$toast('请先填写收货地址')
        }
      },

      // 发票
      chooseDistribution2: function () {
        this.showPopup2 = true
      },
      chooseBill: function () {
        this.showPopup3 = true
      },
      chooseBillType: function (e) {
        if (e == 0) {
          this.billCon = 0
          this.showPopup2 = false
          this.billCon2 = ''
          this.bill = "不开发票"
        } else if (e == 1) {
          this.billCon = 1
          this.bill = "普通发票"
          this.showPopup2 = false
          this.billCon2 = 0
        } else if (e == 2) {
          this.billCon = 2
          this.bill = "专票"
          this.showPopup2 = false
          this.billCon2 = ''
        }
      },
      onItemClick2: function (e) {
        this.billCon2 = e
        this.showPopup3 = false
        if (e == 0) {
          this.personOrBusiness = "个人"
        } else {
          this.personOrBusiness = "单位"
        }
      },
      closePay() {
        this.$router.back();
      }
    }
  }
</script>

<style lang="less">
  @red: #f0415f;

  .pay .van-cell {
    margin-top: 0.15rem;
    font-size: 0.16rem;
  }

  .weui-form-preview__btn_primary {
    color: #fff !important;
  }

  .weui-form-preview__btn {
    background-color: #ee4461
  }

  .weui-form-preview__value {
    color: #ee4461;
  }

  // .maincon {
  //   display: flex;
  // }
  button {
    border: 0;
  }

  .pay {
    position: absolute;
    top: .46rem;
    bottom: .42rem;
    width: 100%;

    // background-color: #f0f4f5;
    .pay-header {
      width: 100%;
      height: .46rem;
      position: fixed;
      top: 0;
      left: 0;
      z-index: 300;
      background: #fff;
      box-shadow: 0 0.02rem 0.04rem #eee;

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

      &:after {
        content: "";
        display: block;
        height: .05rem;
        background-image: linear-gradient(135deg, #82c9ff .08rem, transparent .08rem, transparent .16rem, #ff8282 .16rem, #ff8282 .32rem, transparent .32rem, transparent .32rem, transparent .4rem, #82c9ff .4rem, #82c9ff);
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
        margin-bottom: .1rem;
        background-color: #fff;

        .ord-list {
          .shop-item {
            // border-bottom: 5px solid #f0f4f5;
          }

          .shop-name {
            display: block;
            background-color: #f0f0f0;
            width: 100%;
            border-radius: .04rem;
            line-height: .3rem;
          }

          .item {
            position: relative;
            z-index: 0;
            padding: .15rem .1rem;
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
      margin-bottom: .1rem;
      background-color: #fff;
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
    margin-right: 1rem;
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
