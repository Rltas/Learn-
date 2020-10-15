<template>
  <div class="goods-detail">
    <div>
      <div class="detail-backicon" @click="closeGoodsDetail" ref="backPic"></div>
      <!--头部-->
      <div class="vux-1px-b detail-header" ref='headNav'>
        <span class="header-left" @click="closeGoodsDetail"></span>
        <!-- 商品 -->
        <ul class="header-ul" v-show="isIntegral == '' || isIntegral == null">
          <li class="header-li" :class="{h_active: currentView == 1}" @click="topTabChange(1)">商品</li>
          <li class="header-li" :class="{h_active: currentView == 3}" @click="topTabChange(3)">评价</li>
          <li class="header-li" :class="{h_active: currentView == 2}" @click="topTabChange(2)">详情</li>
        </ul>
        <!-- 积分 -->
        <!-- <ul class="header-ul" v-show="isIntegral == 'true'">
          <li class="header-li" style="width:50%" :class="{h_active: currentView == 1}" @click="headerTab(1)">商品</li>
          <li class="header-li" :class="{h_active: currentView == 2}" @click="currentView == 2">介绍</li>
        </ul>
        <div class="icon" @click="handleSearchClick">
          <div class="detail-search" ></div>
        </div> -->
      </div>
      <!-- 商品详情 -->
      <div ref="scrollMain" style="overflow: scroll;padding-bottom:54px;">
        <div class="goods-main">
          <!-- 商品详情 -->
          <div class="img-header">
            <van-swipe class="my-swipe" :autoplay="2000" indicator-color="#04BE02">
              <van-swipe-item v-for="(item,index) in goodsImgList" :key="index"><img :src="item.img" alt="">
              </van-swipe-item>
            </van-swipe>
          </div>
          <div class="prod-info">
            <div class="prod-info-header">{{goodsDetail.name}}</div>
            <div class="prod-info-pb">

              <!-- 有折扣 -->
              <div class="pb-price" v-show="isIntegral == '' || isIntegral == null">
                ¥{{(nowPrice * shoppingDiscount).toFixed(2)}}

                <div v-if="isBargain == 'true'">
                  <span
                    style="color:#999;font-size:14px;margin-left:24px;text-decoration:line-through;">￥{{goodsDetail.specPrice[0].oldprice || goodsDetail.specPrice[0].price}}</span>
                </div>

                <div v-else-if="oldPrice">
                  <span style="color:#999;font-size:14px;margin-left:24px;">¥{{Number(oldPrice).toFixed(2)}}</span>
                </div>
                <div v-else>
                  <span style="color:#999;font-size:14px;margin-left:24px;">¥{{Number(nowPrice).toFixed(2)}}</span>
                </div>

              </div>

              <div class="pb-price" v-show="isIntegral == 'true'">积分{{goodsDetail.price}}</div>
              <div class="badge" v-show="isBargain == 'true'">
                <span>特价</span>
              </div>
              <div class="badge" v-show="isNewGoods == 'true'">
                <span>新品</span>
              </div>
            </div>
            <!--分销分享-->
            <div class="code-share" @click.stop="handleToSharePage" v-if="!isSecondShare">
              <img src="../../common/images/newIndex/share.png" alt="">
              <p>分享</p>
            </div>
          </div>
          <van-cell title="规格和数量" is-link @click="showShopStandard">
            <template #default>
              <span v-for="(item,index) in choosedSpec" :key="index">【{{item.value}}】</span>
              <span>数量：{{numValue}}</span>
            </template>
          </van-cell>

          <!--相关商品-->
          <div v-show="!isIntegral && relatedGoods.length > 0">
            <span class="scroller-name">同系列商品</span>
            <div class="scroller-box" ref="scrollerBox">
              <div class="scroller-box-item" :class="{activity_goods: item.current == 1}" v-for="item in relatedGoods"
                @click="switchGoods(item)">
                <div class="item-left">
                  <img v-lazy="item.src_small" alt="">
                </div>
                <div class="item-rigth">
                  <span class="item-name">
                    {{item.goodsAlias}}
                  </span>
                  <span class="item-price" v-if="item.activity.isBargain=='true'">
                    ¥ {{item.activity.bargainPrice}}
                  </span>
                  <span class="item-price" v-else-if="item.activity.isNewGoods=='true'">
                    ¥ {{item.specPrice[0].price}}
                  </span>
                  <span class="item-price" v-else>
                    ¥ {{item.price}}
                  </span>
                  <div class="badge" v-show="item.activity?item.activity.isBargain == 'true':false">
                    <span>特价</span>
                  </div>
                  <div class="badge" v-show="item.activity?item.activity.isNewGoods == 'true':false">
                    <span>新品</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <van-cell-group v-show="isIntegral == '' || isIntegral == null">
            <van-cell title="折扣" :value="discount + '折'"
              v-show="discount != null && discount != '' && discount != 100" />
            <van-cell title="买就送" :value="givePresent" v-show="givePresent != null && givePresent!= ''" />
            <van-cell title="包邮" :value="'满' + reducePostage + '包邮'"
              v-show="reducePostage != null && reducePostage != ''" />
          </van-cell-group>
          <div class="dis-area" v-if="goodsDetail && goodsDetail.goodsArea">
            <span class="area-title">配送区域</span>
            <div class="area-content">
              仅 {{goodsDetail.goodsArea}}
              <img class="string-arrows" @click="changeActive($event)"
                src="../../common/images/newIndex/string-arrows.png" v-if="goodsDetail.goodsArea.length >= 10"></img>
            </div>
          </div>
          <span class="hint"
            v-show="isIntegral == 'true' && goodsDetail.ig_limit_type == 1">该商品只能兑换{{goodsDetail.ig_limit_count}}次，已兑换{{goodsDetail.userExchangeCount}}次</span>

          <!-- 新增商品评价 -->
          <van-cell :title="'评价（'+commenLen+'）'" value="查看全部" @click="handleLookAll" is-link=""></van-cell>
          <div ref="commentDiv">
            <div v-if="comment.length != 0">
              <div class="assess-flat" v-for="(item,index) in comment" :key="index">
                <div class="assess-wrapper vux-1px-b" v-if='index<2'>
                  <!-- top -->
                  <div class="assess-top">
                    <span class="user-name">{{item.evaluate_user_name}}</span>
                    <span class="assess-date">{{item.evaluate_add_time}}</span>
                  </div>
                  <!-- bottom -->
                  <div class="assess-bottom">
                    <div v-if="item.evaluate_info == '' || item.evaluate_info == null">
                      <p class="assess-content" v-show="item.evaluate_val == 1">好评</p>
                      <p class="assess-content" v-show="item.evaluate_val == 0">中评</p>
                      <p class="assess-content" v-show="item.evaluate_val == -1">差评</p>
                    </div>

                    <p class="assess-content" v-else>{{item.evaluate_info}}</p>
                    <div class="date-spec-box">
                      <p class="pay-date">购买日期：{{item.order_add_time}}</p>
                      <p class="product-type">{{item.goods_spec}}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-else>
              <span class="default-hint">暂无评论</span>
            </div>
          </div>

          <!-- 新增商品详情 -->
          <van-cell title="详情"></van-cell>
          <div ref="introduceDiv">
            <div v-show="goodsDetail.goods_details=='' || goodsDetail.goods_details==null">
              <span class="default-hint">暂无详情</span>
            </div>
            <div class="goods-introduce" v-html="goodsDetail.goods_details"></div>
          </div>
        </div>

      </div>




      <!-- 底部-商品 -->
      <div class="card-bottom vux-1px-t" v-show="isIntegral == '' || isIntegral == null">
        <div class="cb card-middle"></div>
        <div class="cb card-right">
          <a @click="alreadyToBuy">立即购买</a>
        </div>

        <div class="cb card-right">
          <a @click="addShoppingCart" style="background-color:#FF773A">加入购物车</a>
        </div>

        <div class="item_link" @click="handleHomeClick">
          <div class="icon-home"></div>
        </div>

        <div class="item_link_cart" style="position:relative" @click="handleCartClick">
          <div class="icon-cart"></div>
          <!-- <div style="display:inline-block;width:16px;height:13px;position:absolute;top:14px;right:8px;border-radius:50%;background:#f0415f;">
            <div style="font-size:10px;color:#fff;margin-top:-3px;margin-left:5px;">{{goodsListCount}}</div>
          </div> -->
        </div>
      </div>

      <!-- 底部-积分 -->
      <div class="card-bottom vux-1px-t" style="padding:0" v-show="isIntegral == 'true'">
        <div class="cb card-middle">
        </div>
        <div class="cb card-right" style="width:100%; padding:0;"
          v-if="goodsDetail.price*numValue <= goodsDetail.userCurrentIntegral">
          <a @click="buyIntegral">立即兑换</a>
        </div>
        <div class="cb card-right" style="width:100%; background-color: #999;" v-if="userStateCode == 406">
          <a style="padding:0;" @click="jfLogin">还未登录，点击登录</a>
        </div>
        <div class="cb card-right" style="width:100%; background-color: #999;" v-else>
          <a>积分不足</a>
        </div>

      </div>

    </div>

    <!-- 选择型号 -->
    <transition name="showlist">
      <div class="shop-standard" v-show="showChooseSpecCard" @touchmove.prevent.stop>
        <div class="body">
          <div class="title">
            <div class="button">请选择规格和数量</div>
          </div>

          <div class="type">
            <div class="group" v-for="(item,index) in goodsDetail.specBeans" :key="index">
              <span class="standard-item-name">{{item.name}}：</span>
              <checker v-model="item.id" @on-change="chooseSpeciflaction" class="standard-item-type"
                default-item-class="standard-item" selected-item-class="standard-item-selected">
                <checker-item :value="item.key" v-for="(item,index1) in item.properties" :key="index1">{{item.value}}
                </checker-item>
              </checker>
            </div>

            <!-- 选择数量(积分)-->
            <x-number v-if="isIntegral == 'true' && goodsDetail.ig_limit_type == 1" :title="('选择数量')"
              button-style="round" :min="1" :max="Number(goodsDetail.ig_limit_count)" :value="numValue"
              @on-change="numChange"></x-number>
            <!-- 选择数量(商品)-->
            <!-- <x-number v-else :title="('选择数量')" button-style="round" :min="minValue" fillable v-model="numValue" @on-change="numChange"></x-number> -->
            <div class="choose-num" v-else>
              <div class="choose-num-val">
                选择数量
              </div>
              <div class="choose-num-box">
                <a @click="handleSub" class="number-selector" :class="{'selector-sub-disabled':numValue == minValue}">
                  <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink" width="18" height="18">
                    <defs></defs>
                    <path
                      d="M863.74455 544.00086 163.424056 544.00086c-17.664722 0-32.00086-14.336138-32.00086-32.00086s14.336138-32.00086 32.00086-32.00086l700.320495 0c17.695686 0 31.99914 14.336138 31.99914 32.00086S881.440237 544.00086 863.74455 544.00086z">
                    </path>
                  </svg>
                </a>
                <input class="number-input" v-model="numValue" pattern="[0-9]*" type="tel" @blur="handleBlur"
                  @click="handleClick($event)" />
                <a @click="handleAdd" class="number-selector">
                  <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20">
                    <defs></defs>
                    <path
                      d="M863.328262 481.340895l-317.344013 0.099772L545.984249 162.816826c0-17.664722-14.336138-32.00086-32.00086-32.00086s-31.99914 14.336138-31.99914 32.00086l0 318.400215-322.368714-0.17718c-0.032684 0-0.063647 0-0.096331 0-17.632039 0-31.935493 14.239806-32.00086 31.904529-0.096331 17.664722 14.208843 32.031824 31.871845 32.095471l322.59234 0.17718 0 319.167424c0 17.695686 14.336138 32.00086 31.99914 32.00086s32.00086-14.303454 32.00086-32.00086L545.982529 545.440667l317.087703-0.099772c0.063647 0 0.096331 0 0.127295 0 17.632039 0 31.935493-14.239806 32.00086-31.904529S880.960301 481.404542 863.328262 481.340895z">
                    </path>
                  </svg>
                </a>
              </div>
            </div>
          </div>

        </div>
        <div class="bottom">
          <span style="background-color:#f0f0f0; color: #03a9f4; width: 50%" @click="cancelCall">取消</span>
          <span style="width: 50%" @click="callOff">{{standardText}}</span>
        </div>
      </div>
    </transition>

    <!-- 提示 -->
    <div>
      <!-- 加载中 -->
    </div>

    <!--分销分享-->
    <GoodsShare :showShareCard="showShareCard" :data="shareData" @touchmove.prevent>
    </GoodsShare>

    <div class="fixed-share-icon" v-if="showShareCard" @click="closeShareBox">
      <span>立即推广给好友吧</span>
      <i class="arrow-icon"></i>
    </div>
  </div>
</template>
<script>
  import {
    Checker,
    CheckerItem,
  } from "vux";
  import {
    getNormalGoodsDetail,
    getShareParmars,
    getWxToken
  } from "api/getData";
  import {
    mapGetters,
    mapMutations
  } from "vuex";
  import {
    baseUrl
  } from "api/config";
  import GoodsShare from "../../page/distribution/goodsLinkShare";
  export default {
    components: {
      Checker,
      CheckerItem,
      GoodsShare
    },
    data() {
      return {
        userStateCode: "", //登录状态码
        currentView: 1, //headerNav
        goodsImgList: [], //轮播图
        showChooseSpecCard: false,
        goodsDetail: {},
        comment: [], //存储评论数据
        id: "",
        active: 0,
        numValue: 1, //数量
        minValue: 1, //最小数量
        specIds: "", //商品规格
        specsIndex: 0, //当前选中的规格索引值
        nowPrice: "", //现价
        oldPrice: "",
        choosedSpec: [], //选中的型号数组
        name: "",
        disabled: true,
        isIntegral: "",
        buyOrAdd: "",
        standardText: "确定",
        favorable: "", //优惠信息汇总
        discount: "", //全场打折
        shoppingDiscount: "",
        newCount: "", //新费用
        duscountNum: "", //打折金额
        givePresent: "", //买什么送什么商品
        reducePostage: "", //减邮费
        supplierId: "", //供货商ID
        relatedGoods: "", //相关商品
        count_width: 0, //相关商品总体width
        activity_goods: false, //相关商品当前项css

        isBargain: false,
        isNewGoods: false,
        shockingPrice: "", //惊爆价
        newGoodsPrice: "", //新品价
        commenLen: 0, //评论总数
        screenHeight: window.innerHeight, //默认视口高度
        numDisabled: false, //数量加减禁用样式
        shopStoreId: '', //商家id
        showShareCard: false, //分享弹窗控制
        shareData: {},
        isSecondShare: false, //是否为二次分享
        shareLink: '', //分享跳转地址
        shareDescribe: ''
      };
    },
    created() {
      this.goodsId = this.$route.query.goodsid
      this.isIntegral = this.getQueryString("integral_"); //判断是否是积分商品\
      //判断是否显示分销
      let isShareShow = this.getQueryString("isShareShow") || sessionStorage.getItem("isShareShow") || 1;
      if (isShareShow == 0) {
        sessionStorage.setItem('isShareShow', 0);
        this.isSecondShare = true;
      } else {
        sessionStorage.removeItem('isShareShow');
        this.isSecondShare = false;
      }
      //获取用户id
      let userId = '';
      userId = this.getQueryString("userId") || sessionStorage.getItem("shareUserId") || '';
      if (userId && userId != 'null') {
        sessionStorage.setItem('shareUserId', userId);
      } else {
        sessionStorage.removeItem('shareUserId');
      }
      this.getUserInfo()
      let token = this.getQueryString("token");
      if (token) {
        getWxToken();
      }
      if (this.isIntegral) {
        // 获取积分商品基本信息
        this._getIntegralGoodsDetail();
      } else {
        // 获取商品基本信息
        this._getGoodsDetail();
        // 获取评论
        this._getGoodsEvaluation();
      }
    },
    mounted() {
      window.scrollTo(0, 0);
      document.addEventListener('scroll', this.handleScroll);
    },
    beforeRouteLeave(to, from, next) {
      if (to.path) {
        document.body.style.position = 'static';
        document.body.style.height = 'auto';
        document.body.style.overflow = '';
        document.body.style.overflow = '';
        this.$refs.scrollMain.style.overflow = 'scroll';
        next();
      }
    },
    destroyed() {
      document.removeEventListener('scroll', this.handleScroll);
    },
    methods: {
      changeActive(e) {
        e.currentTarget.parentElement.classList.toggle('area-content-active')
        e.currentTarget.classList.toggle('img-transform')
      },
      handleScroll() {
        let backPic = this.$refs.backPic;
        let headNav = this.$refs.headNav; //头部
        let commentDiv = this.$refs.commentDiv; //评价
        let introduceDiv = this.$refs.introduceDiv; //介绍
        let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        let opa = 0; //透明度
        if (scrollTop > 0) {
          backPic.style.display = 'none';
          opa += 1 / 46 * scrollTop;
          if (opa > 1) {
            opa = 1;
          }
          headNav.style.zIndex = 100;
          headNav.style.opacity = opa;
          if (scrollTop + 110 > introduceDiv.offsetTop) {
            this.currentView = 2;
          } else if (scrollTop + 110 > commentDiv.offsetTop) {
            this.currentView = 3;
          } else {
            this.currentView = 1;
          }
        } else {
          backPic.style.display = 'block';
          headNav.style.opacity = opa;
          headNav.style.zIndex = -10;
        }
      },
      handleSearchClick() {
        this.$router.push({
          path: '/search'
        })
      },
      handleHomeClick() {
        this.$router.push({
          path: '/'
        })
      },
      handleCartClick() {
        this.api.post("getLoginState").then(res => {
          this.userStateCode = res.code;
          this.setUserInfo(res)
          this.$router.push({
            path: "/shopping-cart"
          });
        })
      },
      getUserInfo: function () {
        this.api.post('getLoginState').then(res => {
          this.userStateCode = res.code
          if (this.userStateCode == 200) {
            localStorage.setItem('userInfo', JSON.stringify(res));
            localStorage.setItem('userDeposit', res.obj.user.userDeposit)
          }
        })
      },
      _getGoodsDetail: function () {
        const _this = this;
        let imgList = [];
        _this.choosedSpec = [];
        this.api.post("getGoodsDetail", {
          id: _this.goodsId
        }).then(res => {
          _this.goodsDetail = res.obj;
          _this.isBargain = res.obj.activity.isBargain;
          _this.isNewGoods = res.obj.activity.isNewGoods;
          // 为dom增加高度
          // _this.$refs.scrollMain.style.height =
          //   window.screen.availHeight - 54 + "px";

          _this.supplierId = res.obj.supplierId;
          _this.id = res.obj.id;
          if (_this.isBargain == "true") {
            _this.nowPrice = res.obj.activity.bargainPrice; //惊爆价
            _this.shockingPrice = res.obj.activity.bargainPrice;
          } else if (_this.isNewGoods == "true") {
            _this.nowPrice = res.obj.specPrice[0].price; //新品价
            _this.newGoodsPrice = res.obj.specPrice[0].price;
          } else {
            _this.nowPrice = res.obj.price;
          }
          _this.oldPrice = res.obj.oldPrice;
          // 相关商品
          if (res.obj.relatedGoods) {
            _this.relatedGoods = res.obj.relatedGoods.goods;
            // 计算宽度
            // _this.count_width =
            //   _this.relatedGoods.length * 200 +
            //   (_this.relatedGoods.length - 1) * 15 +
            //   _this.relatedGoods.length * 4;
            // _this.$refs.scrollerBox.style.width = _this.count_width + "px";
          }
          // 获取img到轮播图
          res.obj.imgs.forEach((item, index) => {
            imgList[index] = item.src_big;
          });
          _this.goodsImgList = imgList.map((one, index) => ({
            img: one
          }));
          // 折扣
          _this.favorable = res.obj.activity;

          if (res.obj.activity != "" && res.obj.activity != null) {
            _this.discount = res.obj.activity.discount * 100;
            _this.shoppingDiscount = res.obj.activity.discount;
            _this.reducePostage = res.obj.activity.reducePostage;
            _this.givePresent = res.obj.activity.givePresent;
          }

          //默认选中规格
          if (_this.goodsDetail.specBeans.length == 1) {
            _this.goodsDetail.specBeans[0].id = _this.goodsDetail.specBeans[0].properties[0].key;
            _this.choosedSpec.push({
              key: _this.goodsDetail.specBeans[0].properties[0].key,
              value: _this.goodsDetail.specBeans[0].properties[0].value
            })
            _this.specIds = _this.goodsDetail.specBeans[0].properties[0].key + '';
          }
          //获取默认数量
          if (_this.goodsDetail.startNum == 0) {
            _this.minValue = 1;
            _this.numValue = 1;
          } else {
            _this.minValue = Number(_this.goodsDetail.startNum);
            _this.numValue = Number(_this.goodsDetail.startNum);
          }
          //商家id
          _this.shopStoreId = _this.goodsDetail.storeId;
          //分享
          this._goodsDetailShare();
        });
      },
      _getIntegralGoodsDetail: function () {
        this.api
          .post("getIntegralGoodsDetail", {
            id: this.goodsId
          })
          .then(res => {
            this.goodsDetail = res.obj;
            this.id = res.obj.id;
            this.nowPrice = res.obj.price;
            // 获取img到轮播图
            let imgList = [];
            imgList[0] = res.obj.url;
            this.goodsImgList = imgList.map((one, index) => ({
              img: one
            }));
          });
      },
      _getGoodsEvaluation: function () {
        const _this = this;
        this.api
          .post("getGoodsEvaluation", {
            goods_id: _this.goodsId
          })
          .then(res => {
            if (res.obj.evaluateList) {
              _this.comment = res.obj.evaluateList;
              _this.commenLen = res.obj.rows;
            } else {
              _this.comment = [];
              _this.commenLen = 0;
            }
            console.log(_this.comment)
          });
      },
      _goodsDetailShare: function () {
        const _this = this;
        //判断是否是积分商品
        let type = 1;
        if (_this.isIntegral) {
          type = 2;
        } else {
          type = 1;
        }
        var url = location.href.split('#')[0]; //url不能写死
        this.api.post('getShareParmars', {
          url: url,
          id: _this.goodsId,
          type: type
        }).then(res => {
          if (_this.userStateCode == 200) {
            if (_this.isSecondShare) {
              _this.shareLink =
                `${baseUrl}/share/sharegoods.htm?goodsid=${_this.goodsId}&integral_=${_this.isIntegral}&userId=${sessionStorage.getItem("shareUserId")}&type=2`
            } else {
              _this.shareLink =
                `${baseUrl}/share/sharegoods.htm?goodsid=${_this.goodsId}&integral_=${_this.isIntegral}&userId=${JSON.parse(localStorage.getItem("userInfo")).obj.user.id}&type=2`
            }
          } else {
            _this.shareLink =
              `${baseUrl}/share/sharegoods.htm?goodsid=${_this.goodsId}&integral_=${_this.isIntegral}&type=2`
          }
          _this.shareDescribe = `抢！抢！抢！只要${Number(_this.nowPrice).toFixed(2)}元，${_this.goodsDetail.name}`;
          wx.config({
            debug: false, ////生产环境需要关闭debug模式
            appId: res.config_appid, //appId通过微信服务号后台查看
            timestamp: res.config_timestamp, //生成签名的时间戳
            nonceStr: res.config_nonceStr, //生成签名的随机字符串
            signature: res.config_sign, //签名
            jsApiList: [ //需要调用的JS接口列表
              'checkJsApi', //判断当前客户端版本是否支持指定JS接口
              'onMenuShareTimeline', //分享给好友
              'onMenuShareAppMessage' //分享到朋友圈
            ]
          });
          wx.ready(function () {
            //分享给好友
            wx.onMenuShareAppMessage({
              title: "渝教商城-【超值特价】", // 分享标题
              desc: _this.shareDescribe, // 分享描述
              link: _this.shareLink, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: res.config_img, // 自定义图标

              type: 'link', // 分享类型,music、video或link，不填默认为link
              dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
              success: function () {
                // 用户确认分享后执行的回调函数
              },
              cancel: function () {
                // 用户取消分享后执行的回调函数
              }
            });
            wx.error(function (res) {
              alert(res.errMsg);
            });
          });
          //分享朋友圈
          wx.onMenuShareTimeline({
            title: _this.shareDescribe,
            link: _this.shareLink,
            imgUrl: res.config_img, // 自定义图标
            trigger: function (res) {
              //alert('click shared');
            },
            success: function (res) {
              //alert('shared success');
              //some thing you should do
            },
            cancel: function (res) {
              //alert('shared cancle');
            },
            fail: function (res) {
              //alert(JSON.stringify(res));
            }
          });
        })
      },
      _addGoodsToShoppingCart: function () {
        if (this.userStateCode == 200) {
          if (this.choosedSpec.length < this.goodsDetail.specBeans.length) {
            this.showChooseSpecCard = true;
          } else {
            const _this = this;
            this.$toast.loading({
              duration: 0,
              forbidClick: true,
              message: '正在加入购物车'
            })
            this.api.post("addShoppingCart", {
                goodId: _this.id,
                price: _this.nowPrice,
                count: _this.numValue,
                gsp: _this.specIds,
                supplierid: _this.supplierId,
                seq: 2, //商品属于生活超市
              })
              .then(res => {
                this.$toast.clear()
                this.$toast(res.message)
              });
          }
        } else {
          let backUrl = window.location.hash.substring(2);
          window.location.href = `${baseUrl}/shop/weChat_login_api.htm?url=${backUrl}&type=2`
        }
      },
      topTabChange: function (type) {
        this.currentView = type;
        let commentDiv = this.$refs.commentDiv; //评价
        let introduceDiv = this.$refs.introduceDiv; //介绍
        let speed = 200; //滑动速度
        if (type == 1) {
          $('html,body').animate({
            scrollTop: 0
          }, speed);
        } else if (type == 2) {
          if (introduceDiv.offsetTop) {
            $('html,body').animate({
              scrollTop: introduceDiv.offsetTop - 105
            }, speed);
          }
        } else {
          $('html,body').animate({
            scrollTop: commentDiv.offsetTop - 100
          }, speed);
        }
      },
      showShopStandard: function () {
        this.standardText = "确定";
        this.showChooseSpecCard = true;
        this.buyOrAdd = "no";
      },
      numChange: function (val) {
        if (val > this.minValue) {
          this.numValue = parseInt(val);
        } else {
          this.numValue = Number(this.minValue);
        }
      },
      chooseSpeciflaction: function () {
        var ids = []; //存入规格key值
        var choosedSpec = []; //存入规格
        this.goodsDetail.specBeans.forEach(item => {
          var choosedId = item.id;
          item.properties.forEach(citem => {
            if (choosedId == citem.key) {
              choosedSpec.push({
                id: item.id,
                value: citem.value
              });
            }
          });
          if (item.id != "") {
            ids.push(item.id);
          }
        });
        this.choosedSpec = choosedSpec;
        this.specIds = ids.join(",");
        // 处理选中规格后的价格
        // 惊爆价或者新品价
        if (this.isBargain == "true") {
          this.nowPrice = this.shockingPrice;
        } else if (this.isNewGoods == "true") {
          this.nowPrice = this.newGoodsPrice;
        } else {
          if (ids.length == this.goodsDetail.specBeans.length) {
            let _specIds = ids.sort().join("_") + "_";
            this.goodsDetail.specPrice.forEach(item => {
              if (item.id == _specIds) {
                this.nowPrice = item.price;
              }
            });
          } else {
            this.nowPrice = this.goodsDetail.price;
          }
        }
      },
      // 直接购买
      alreadyToBuy: function () {
        this.buyOrAdd = "buy";
        this.standardText = "立即购买";
        this.api.post("getLoginState").then(res => {
          this.userStateCode = res.code;
          this.setUserInfo(res)
          if (this.userStateCode == 200) {
            if (res.obj.user.storeId == this.shopStoreId) {
              this.$toast('不能购买自己的商品')
            } else {
              localStorage.setItem('userDeposit', res.obj.user.userDeposit)
              this.showChooseSpecCard = true;
            }
          } else {
            let backUrl = window.location.hash.substring(2);
            window.location.href = `${baseUrl}/shop/weChat_login_api.htm?url=${backUrl}&type=2`
          }
        })

      },
      _alreadyToBuy() {
        this.api.post("getLoginState").then(res => {
          if (this.userStateCode == 200) {
            localStorage.setItem('userDeposit', res.obj.user.userDeposit)
            if (this.choosedSpec.length < this.goodsDetail.specBeans.length) {
              this.showChooseSpecCard = true;
            } else {
              let nowPrice = Number(this.nowPrice).toFixed(2);
              localStorage.setItem("supplierId", this.supplierId); //储存供货商ID
              localStorage.setItem("url", this.goodsDetail.imgs[0].src_big); //储存图片链接
              localStorage.setItem("goodsName", this.goodsDetail.name); //储存商品名称
              localStorage.setItem("message", this.specIds); //储存商品规格字符串
              localStorage.setItem("messageobj", JSON.stringify(this.choosedSpec)); //储存商品规格对象
              localStorage.setItem("price", nowPrice); //储存单价
              localStorage.setItem("specPropertyIds", this.specIds); //储存specPropertyIds  规格id
              localStorage.setItem("goodsNum", this.numValue); //储存goodsNum  数量
              localStorage.setItem('goodsArea', this.goodsDetail.goodsArea); //存储商品配送区域
              this.$router.push({
                path: "/pay",
                query: {
                  id: this.id,
                  storeid: this.goodsDetail.storeId,
                  isBuyNow: "true"
                }
              });
            }
          } else {
            let backUrl = window.location.hash.substring(2);
            window.location.href = `${baseUrl}/shop/weChat_login_api.htm?url=${backUrl}&type=2`
          }
        })
      },
      // 加入购物车
      addShoppingCart: function () {
        this.buyOrAdd = "add";
        this.standardText = "加入购物车";
        this.api.post("getLoginState").then(res => {
          this.userStateCode = res.code;
          this.setUserInfo(res)
          if (this.userStateCode == 200) {
            if (res.obj.user.storeId == this.shopStoreId) {
              this.$toast('不能购买自己的商品')
            } else {
              localStorage.setItem('userDeposit', res.obj.user.userDeposit);
              this.showChooseSpecCard = true;
            }
          } else {

            let backUrl = window.location.hash.substring(2);
            window.location.href = `${baseUrl}/shop/weChat_login_api.htm?url=${backUrl}&type=2`
          }
        })
      },
      // 积分商品购买
      buyIntegral: function () {
        if (this.userStateCode == 200) {
          if (
            this.goodsDetail.ig_limit_type == 1 &&
            this.goodsDetail.userExchangeCount == this.goodsDetail.ig_limit_count
          ) {
            this.$dialog.alert({
              title: '提示',
              message: '兑换量已达上限，该商品你已不能兑换'
            })
          } else {
            localStorage.setItem("url", this.goodsDetail.url); //储存图片链接
            localStorage.setItem("goodsName", this.goodsDetail.name); //储存商品名称
            localStorage.setItem("price", this.goodsDetail.price); //储存所需积分
            localStorage.setItem("goodsNum", this.numValue); //储存goodsNum  数量
            this.$router.push({
              path: "pay",
              query: {
                id: this.id,
                integral_: this.isIntegral
              }
            })
          }
        } else {
          this.$dialog.alert({
            title: '提示',
            message: '还没有登录，请先到app登录'
          })
        }
      },
      callOff: function () {
        if (this.buyOrAdd == "buy" || this.buyOrAdd == "add") {
          if (this.choosedSpec.length < this.goodsDetail.specBeans.length || this.goodsDetail.specBeans.length == 0) {
            this.$dialog.alert({
              title: '提示',
              message: '请先选择规格'
            })
          } else {
            this.buyOrAdd == "buy" ?
              this._alreadyToBuy() :
              this._addGoodsToShoppingCart()
            this.showChooseSpecCard = false
          }
        } else {
          this.showChooseSpecCard = false
        }
      },
      cancelCall: function () {
        this.showChooseSpecCard = false
      },
      onConfirm: function () {
        this.jfLogin()
      },
      jfLogin: function () {
        let backUrl = window.location.hash.substring(2);
        window.location.href = `${baseUrl}/shop/weChat_login_api.htm?url=${backUrl}&type=2`
      },
      switchGoods: function (item) {
        // 获取商品基本信息
        // this._getGoodsDetail();
        this.goodsId = item.goodsid;
        this._getGoodsDetail();
        this._getGoodsEvaluation();
      },
      closeGoodsDetail: function () {
        this.$emit("closeGoodsDetail", true)
        if (this.$route.query.share == true) {
          this.$router.push({
            path: "/",
          })
        } else {
          this.$router.back()
        }
      },
      //评论查看全部
      handleLookAll() {
        this.$router.push({
          path: '/comment-list',
          query: {
            goodsId: this.goodsId
          }
        })
      },
      //数量选择
      handleBlur() {
        if (this.numValue > this.minValue) {
          this.numValue = parseInt(this.numValue);
        } else {
          this.numValue = Number(this.minValue);
        }
        let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        $('html,body').animate({
          scrollTop: scrollTop
        }, 300);
      },
      handleClick(e) {
        let len = e.target.value.length;
        e.target.selectionStart = e.target.selectionEnd = len;
        e.target.focus();
      },
      handleAdd() {
        this.numValue++;
      },
      handleSub() {
        if (this.numValue > this.minValue) {
          this.numValue--;
        } else {
          this.numValue = this.minValue;
        }
      },
      ...mapMutations({
        setUserInfo: 'SET_USER_INFO',
        setToken: 'SET_TOKEN',
        refreshToken: 'REFRESH_TOKEN'
      }),
      //分销分享
      handleToSharePage() {
        this.api.post("getLoginState").then(res => {
          this.userStateCode = res.code;
          this.setUserInfo(res);
          if (this.userStateCode == 200) {
            window.scrollTo(0, 0);
            document.body.style.position = 'absolute';
            document.body.style.width = '100%';
            document.body.style.height = '100%';
            document.body.style.overflow = 'hidden';
            this.$refs.scrollMain.style.overflow = 'hidden';
            let spcIds = [];
            let spcStr = '';
            let sharrPrice = 0; //当前价格
            if (this.goodsDetail.specBeans.length == 1) {
              spcStr = this.goodsDetail.specBeans[0].properties[0].key;
              sharrPrice = this.nowPrice;
            } else {
              if (this.specIds) {
                if (this.choosedSpec.length < this.goodsDetail.specBeans.length) {
                  this.$toast('请选择完整规格')
                  return;
                }
                spcStr = this.specIds;
                sharrPrice = this.nowPrice;
              } else {
                this.goodsDetail.specBeans.forEach(item => {
                  spcIds.push(item.properties[0].key);
                })
                spcStr = spcIds.join(",");
                // 处理选中规格后的价格
                // 惊爆价或者新品价
                if (this.isBargain == "true") {
                  sharrPrice = this.shockingPrice;
                } else if (this.isNewGoods == "true") {
                  sharrPrice = this.newGoodsPrice;
                } else {
                  if (spcIds.length == this.goodsDetail.specBeans.length) {
                    let _specIds = spcIds.sort().join("_") + "_";
                    let len = this.goodsDetail.specPrice.length;
                    for (var i = 0; i < len; i++) {
                      if (this.goodsDetail.specPrice[i].id == _specIds) {
                        sharrPrice = this.goodsDetail.specPrice[i].price;
                        break;
                      }
                    }
                  } else {
                    sharrPrice = this.goodsDetail.price;
                  }
                }
              }
            }
            this.shareData = {
              goodsid: this.goodsDetail.id,
              goodsName: this.goodsDetail.name,
              goodsImgArr: this.goodsDetail.imgs,
              specPropertyIds: spcStr,
              price: sharrPrice
            }
            this.showShareCard = true;
          } else {
            let backUrl = window.location.hash.substring(2);
            window.location.href = `${baseUrl}/shop/weChat_login_api.htm?url=${backUrl}&type=2`
          }
        })

      },
      closeShareBox() {
        this.showShareCard = false;
        document.body.style.position = 'static';
        document.body.style.height = 'auto';
        document.body.style.overflow = '';
        this.$refs.scrollMain.style.overflow = 'scroll';
      }
    },
    computed: {
      // 计算总价
      totalPrice: function () {
        if (this.choosedSpec.length == 0) {
          var a = this.goodsDetail.price * this.numValue
        } else {
          var a = this.nowPrice * this.numValue
        }
        return a.toFixed(2)
      },
      ...mapGetters(["userInfo"])
    }
  };
</script>

<style lang="less" scoped>
  @red: #f0415f;
  @main1: #1fbba6;

  .van-cell {
    font-size: 0.16rem;
    margin-top: 0.1rem;
  }

  .showlist-enter-active,
  .showlist-leave-active {
    transition: all 0.3s;
    transform: translateY(0);
  }

  .showlist-enter,
  .showlist-leave-active {
    opacity: 0;
    transform: translateY(0);
  }

  .active {
    color: @main1;
  }

  .standard-item {
    border: 0.01rem solid #ececec;
    padding: 0.05rem 0.15rem;
    border-radius: 0.04rem;
    margin-right: 0.06rem;
    margin-bottom: 0.06rem;
    font-size: 0.14rem;
  }

  .standard-item-selected {
    border: 0.01rem solid @main1;
    background-color: @main1;
    color: #fff;
  }

  .vux-popup-picker-value {
    color: #999;
  }

  .vux-popup-picker-header {
    color: #333 !important;
  }

  .vux-number-round .vux-number-selector-sub,
  .vux-number-round .vux-number-selector-plus {
    border: 0.01rem solid @main1  !important;
  }

  .vux-number-selector svg {
    fill: @main1  !important;
  }

  .hint {
    display: block;
    float: right;
    padding: 0.04rem 0.1rem;
    font-size: 0.13rem;
    color: #999;
  }

  // header-nav
  .detail-header {
    width: 100%;
    height: 0.46rem;
    position: fixed;
    top: 0;
    left: 0;
    z-index: -999;
    opacity: 0;
    transition: all 0.5s;
    background: #fff;

    .header-left {
      position: absolute;
      left: 0.18rem;
      top: .14rem;
      width: .22rem;
      height: .22rem;
      background: url('../../common/images/newIndex/go_back.png') no-repeat;
      background-size: .22rem .22rem;
    }

    .header-ul {
      width: 53%;
      margin: 0 auto;
      line-height: 0.46rem;
      overflow: hidden;

      .header-li {
        display: block;
        width: 33.333333%;
        float: left;
        font-size: 0.16rem;
        height: 0.46rem;
        text-align: center;

        span {
          padding: .08rem .02rem;
          line-height: .36rem;
        }
      }

      .h_active {
        color: #FF773A;

        span {
          border-bottom: .02rem solid #FF773A;
        }
      }
    }
  }


  .goods-detail {
    background-color: #f0f4f5;

    .icon {
      width: 10.68%;
      ;
      height: 100%;
      border-left: .01rem solid #E1E1E1;
      position: absolute;
      top: 0;
      right: 0;
      z-index: 1000;

      .detail-search {
        width: .2rem;
        height: .2rem;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: url('../../common/images/newIndex/search2.png') no-repeat;
        background-size: .2rem .2rem;
      }
    }

    .scroller-name {
      display: block;
      line-height: .3rem;
      margin-top: .1rem;
      padding-top: .06rem;
      padding-left: .15rem;
      background-color: #fff;
      color: #999;
      font-size: .14rem
    }

    .scroller-box {
      display: flex;
      flex-wrap: nowrap;
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      padding: .1rem;
      background: #fff;

      .scroller-box-item {
        width: 2rem;
        height: 1rem;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        flex-shrink: 0;
        background: #f0f0f0;
        margin-right: .08rem;
        .item-left {
          width: 1rem;
          height: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;

          img {
            width: .9rem;
            height: .9rem;
          }
        }

        .item-rigth {
          display: flex;
          flex-direction: column;
          height: 100%;
          width: 1rem;
          padding: .1rem .04rem;
          box-sizing: border-box;

          .item-name {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .item-price {
            color: #f0415f;
            margin: .06rem 0;
          }

          .badge {

            span {
              display: inline-block;
              width: .4rem;
              height: .18rem;
              border: .01rem solid #E20404;
              border-radius: .05rem;
              font-size: .12rem;
              color: #E20404;
              text-align: center;
              line-height: .18rem;
            }
          }
        }
      }
    }

    .activity_goods {
      border: .02rem solid #1fbba6;
    }

    background-color: #f0f4f5;

    .tab-ul {
      .tab-li {
        width: 33%;
        float: left;
        list-style: none;
      }
    }

    .img-header {
      width: 3.75rem;
      height: 3.75rem;

      img {
        width: 3.75rem;
        height: 3.75rem;
      }

      .back {
        position: absolute;
        top: .56rem;
        left: .1rem;
        border-radius: .22rem;
        width: .44rem;
        height: .44rem;
        background: rgba(0, 0, 0, 0.3);

        span {
          display: block;
          text-align: center;
          line-height: .44rem;
          font-size: .14rem;
          color: #fff;
        }
      }
    }

    .prod-info {
      padding: .1rem;
      background-color: #fff;
      position: relative;

      .prod-info-header {
        font-size: .16rem;
        color: #333;
        font-weight: normal;
        line-height: .24rem;
        max-width: 85%;
      }

      .prod-info-pb {
        display: flex;

        .pb-price {
          display: flex;
          align-items: center;
          color: @red;
          font-size: .18rem;
        }

        .badge {
          display: block;
          margin-left: .24rem;

          span {
            display: inline-block;
            width: .4rem;
            height: .18rem;
            border: .01rem solid #E20404;
            border-radius: .05rem;
            font-size: .12rem;
            color: #E20404;
            text-align: center;
            line-height: .18rem;
          }
        }
      }

      .code-share {
        position: absolute;
        right: .1rem;
        top: .1rem;
        width: .24rem;
        height: .24rem;
        display: flex;
        align-items: center;
        flex-direction: column;

        img {
          width: 100%;
          height: 100%;
        }

        p {
          white-space: nowrap;
          font-size: .12rem;
          color: #FF773A;
        }
      }
    }

    .card-bottom {
      position: fixed;
      bottom: 0;
      height: .54rem;
      width: 100%;
      background-color: #fff;
      z-index: 100;

      .cb {
        float: left;
        line-height: .54rem;
      }

      .card-left {
        margin-right: .24rem;
      }

      .card-middle {
        width: 50%;
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
        width: 35%;
        background-color: #FF4040;

        a {
          display: inline-block;
          width: 100%;
          color: #fff;
          text-align: center;
        }
      }

      .item_link {
        float: left;
        width: 15%;
        height: .54rem;
        position: relative;

        .icon-home {
          position: absolute;
          top: 50%;
          left: 50%;
          margin-left: -.12rem;
          margin-top: -.12rem;
          width: .23rem;
          height: .23rem;
          background: url('../../common/images/newIndex/home.png') no-repeat;
          background-size: .23rem .23rem;
        }
      }

      .item_link_cart {
        float: left;
        width: 15%;
        height: .54rem;
        position: relative;

        .icon-cart {
          position: absolute;
          top: 50%;
          left: 50%;
          margin-left: -.12rem;
          margin-top: -.12rem;
          width: .23rem;
          height: .23rem;
          background: url('../../common/images/newIndex/car.png') no-repeat;
          background-size: .23rem .23rem;
        }
      }
    }
  }

  .shop-standard {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 200;
    background-color: rgba(0, 0, 0, 0.4);

    .body {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      background-color: #fff;

      .title {
        height: .44rem;
        background-color: #eee;

        .left {
          float: left;
        }

        .right {
          float: right;
        }

        .button {
          display: inline-block;
          width: 100%;
          font-size: .16rem;
          color: #333;
          line-height: .44rem;
          text-align: center;
        }
      }

      .type {
        padding: .15rem .15rem .6rem;

        .group {
          overflow: hidden;
          margin-bottom: .15rem;

          .standard-item-name {
            width: .6rem;
            display: inline-block;
            padding: .05rem;
            float: left;
            color: #999;
            font-size: .14rem;
          }

          .standard-item-type {
            // flex: 1;
            display: inline-block;
            float: left;
          }
        }
      }
    }

    .bottom {
      position: fixed;
      height: .54rem;
      width: 100%;
      bottom: 0;
      background-color: #FF4040;
      text-align: center;
      line-height: .54rem;
      color: #fff;

      span {
        display: block;
        width: 50%;
        padding: 0;
        margin: 0;
        float: left;
        height: inherit;
      }
    }
  }

  .assess-flat {
    position: relative;

    .assess-wrapper {
      display: block;
      padding-left: .1rem;
      background-color: #fff;

      .assess-top {
        position: relative;
        padding: .11rem .1rem .11rem 0;
        background-color: #fff;
        overflow: hidden;

        .user-name {
          font-size: .13rem;
          line-height: .27rem;
          float: left;
          height: .27rem;
          margin-right: .05rem;
          color: #252525;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          max-width: 1rem;
        }

        .assess-date {
          font-size: .13rem;
          line-height: .27rem;
          float: right;
          height: .27rem;
          color: #848689;
        }
      }

      .assess-bottom {
        padding-bottom: .12rem;
        background-color: #fff;

        .assess-content {
          font-size: .13rem;
          line-height: .18rem;
          margin-top: .1rem;
          margin-right: .1rem;
          color: #252525;
          word-wrap: break-word;
          overflow: hidden;
          text-align: justify;
        }

        .pay-date {
          font-size: .12rem;
          line-height: .12rem;
          margin-top: .05rem;
          color: #bfbfbf;
        }

        .product-type {
          font-size: .12rem;
          line-height: .12rem;
          margin-top: .05rem;
          color: #bfbfbf;
        }
      }
    }
  }

  .date-spec-box {
    padding-right: .1rem;
    display: flex;
    justify-content: space-between;
  }

  .weui-cell {
    height: .5rem;
    font-size: .16rem;
    box-sizing: border-box;
  }

  .detail-backicon {
    position: fixed;
    left: .18rem;
    top: .14rem;
    z-index: 400;
    width: .22rem;
    height: .22rem;
    background: url('../../common/images/newIndex/go_back.png') no-repeat;
    background-size: .22rem .22rem;
  }

  //选择数量
  .choose-num {
    display: flex;
    justify-content: space-between;
    padding: .1rem .15rem;
    position: relative;
    align-items: center;

    .choose-num-box {
      display: flex;
      align-items: center;

      .number-selector {
        width: .2rem;
        height: .2rem;
        display: inline-block;
        border: .01rem solid #3cc51f;
        padding: .02rem;
        border-radius: 50%;
        color: #3cc51f;
        text-align: center;

        svg {
          fill: #3cc51f;
        }
      }

      .selector-sub-disabled {
        border-color: #ccc;

        svg {
          fill: #ccc;
        }
      }

      .number-input {
        width: .5rem;
        border: none;
        outline: none;
        text-align: center;
        font-size: .2rem;
        padding: .03rem 0;
        color: #666;
      }
    }
  }

  .choose-num::before {
    content: '';
    position: absolute;
    width: 100%;
    border-top: .01rem solid #D9D9D9;
    top: 0;
    left: 0;
    transform: scaleY(0.5);
  }

  .fixed-share-icon {
    position: fixed;
    top: 0px;
    right: 6%;
    color: #fff;
    font-size: .24rem;
    z-index: 9999;

    .arrow-icon {
      display: inline-block;
      width: .55rem;
      height: .69rem;
      background: url('../../common/images/withdraw/share.png') no-repeat;
      background-size: .55rem .69rem;
      vertical-align: super;
    }
  }

  // 新增配送区域
  .dis-area {
    background: #fff;
    padding: .1rem .15rem;
    position: relative;
    display: flex;
    margin-top: .08rem;
    color: #000;
    font-size: .16rem;

    .area-title {
      flex-shrink: 0;
    }

    .area-content {
      margin-left: .15rem;
      height: .22rem;
      padding-right: .15rem;
      box-sizing: border-box;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: #999;

      .string-arrows {
        position: absolute;
        top: .13rem;
        right: .15rem;
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
<style>
  .goods-introduce img {
    width: 100% !important;
  }

  .goods-detail .weui-cells {
    margin-top: .08rem !important;
  }

  .goods-detail .goods-main .vux-label {
    white-space: nowrap;
  }

  .goods-detail .goods-main .weui-cell {
    height: auto;
  }
</style>
