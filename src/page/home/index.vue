<template>
  <div>
    <div class="homepage" style="overflow:hidden;" :class="{'noscroll': noScroll}">
      <div class="top-head" ref="topHead">
        <!-- 头部搜索 -->
        <div class="seach-head">

          <div @click="goToFind()" v-show="!isWeixinExplorer" class="search-ico card" ref="searchInput"
            style="margin-left: 0; margin-right: .1rem;">
            <i class="icon ion-chevron-left"></i>
          </div>

          <div class="search-input" ref="searchInput">
            <div @click="goToSearch" class="search">
              <i class="search-icon" style="font-size:.17rem;"></i>
              <span class="placeholder">
                请输入搜索关键词
              </span>
            </div>
            <div class="wx-scan" @click="wXscan">
              <img src="../../common/images/newIndex/u6.png" alt="">
            </div>
          </div>

        </div>

      </div>
      <div class="nav-fixed" ref="navBox" v-show="!loading">
        <ul class="index-nav-ul" ref="navUl1">
          <li class="item" :class="navIndex == 0 ? 'item-active':''" @click="changeTab(1,0,$event)">热门商品</li>
          <li class="item" :class="navIndex == index+1 ? 'item-active':''" v-for="(item,index) in navList" :key="index"
            @click="changeTab(item,index,$event)">{{item.name}}</li>
        </ul>
      </div>

      <!-- 轮播图 -->
      <div v-if="bannerList.length !=0">
        <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
          <van-swipe-item v-for="(item, index) in bannerList" :key="index" @click="handleToClassify(item.targetUrl)">
            <img :src="item.url" alt=""></van-swipe-item>
        </van-swipe>
      </div>
      <div class="main" v-show="!loading">
        <!-- 导航 -->
        <div class="channel" v-if="indexNavList.length>0">
          <div class="row">
            <div class="item" v-for="(item,index) in indexNavList" :key="index">
              <div @click="handleToClassify(item.targetUrl)" v-if="index<=9">
                <img class="icon" :src="item.url" alt="">
                <span class="name">{{item.goodsId}}</span>
              </div>
            </div>
          </div>
        </div>
        <!--跳转列表-->
        <div class="link-shop" v-if="recomList.length==3">
          <!--优选电器-->
          <div class="link-left" @click="handleToClassify(recomList[1].targetUrl)">
            <span style="color:#6593E4;">{{recomList[1].goodsId}}</span>
            <div class="cooking-pic">
              <img :src="recomList[1].url" alt="">
            </div>
          </div>
          <!--放心食品-->
          <div class="link-right">
            <div class="food-top" @click="handleToClassify(recomList[2].targetUrl)">
              <span style="color:#3AC182">{{recomList[2].goodsId}}</span>
              <div class="food-pic">
                <img :src="recomList[2].url" alt="">
              </div>
            </div>
            <!--海外精品-->
            <div class="food-bottom" @click="handleToClassify(recomList[0].targetUrl)">
              <span style="color:#AC63FF;">{{recomList[0].goodsId}}</span>
              <div class="food-pic">
                <img :src="recomList[0].url" alt="">
              </div>
            </div>
          </div>
        </div>
        <!--惊爆特价-->
        <div class="shocking-price" v-if="shockingGoodsList.length>0">
          <div class="shocking-head">
            <div class="hd-title">
              <span>惊爆特价</span><img src="../../common/images/newIndex/sale_price.png" alt="">
            </div>
            <div class="hd-more" @click="loadmore(1)">
              <span>更多</span><img src="../../common/images/newIndex/load_more.png" alt="">
            </div>
          </div>
          <div class="shocking-box">
            <ul class="shocking-ul">
              <li v-for="(item,index) in shockingGoodsList" :key="index" @click="openDetail(item.goodsid)">
                <div class="product-img">
                  <img v-lazy="item.url" alt="">
                </div>
                <div class="product-content">
                  <h3>{{item.goodsName}}</h3>
                  <div class="product-content-price">
                    <span class="buy-price">￥{{item.activity.bargainPrice}}</span>
                    <span>￥{{item.specPrice[0].oldprice || item.specPrice[0].price}}</span>
                  </div>
                  <div class="badge">
                    <span>特价</span>
                  </div>
                </div>
              </li>
            </ul>
            <div class="pointer" v-if="loginState == false && scrollTarget == true">
              <img src="../../common/images/newIndex/pointer.png" alt="">
            </div>
          </div>
        </div>
        <!--上新好物-->
        <div class="new-goods" v-if="newGoodsList.length>0">
          <div class="new-head">
            <div class="hd-title">
              <span>新鲜好物</span><img src="../../common/images/newIndex/new_price.png" alt="">
            </div>
            <div class="hd-more" @click="loadmore(2)">
              <span>更多</span><img src="../../common/images/newIndex/load_more.png" alt="">
            </div>
          </div>
          <div class="new-box">
            <ul class="new-ul">
              <li v-for="(item,index) in newGoodsList" :key="index" @click="openDetail(item.goodsid)">
                <div class="product-img">
                  <img v-lazy="item.url" alt="">
                </div>
                <div class="product-content">
                  <h3>{{item.goodsName}}</h3>
                  <div class="buy-price">
                    ￥{{item.specPrice[0].price}}
                  </div>
                  <div class="badge">
                    <span>新品</span>
                  </div>
                </div>
              </li>
            </ul>
            <div class="pointer" v-if="loginState == false && scrollTarget == true">
              <img src="../../common/images/newIndex/pointer.png" alt="">
            </div>
          </div>
        </div>
        <!-- 普通商品导航 -->
        <div class="index-nav">
          <ul class="index-nav-ul" ref="navUl">
            <li class="item" :class="navIndex == 0 ? 'item-active':''" @click="changeTab(1,0,$event)">热门商品</li>
            <li class="item" :class="navIndex == index+1 ? 'item-active':''" v-for="(item,index) in navList"
              :key="index" @click="changeTab(item,index,$event)">{{item.name}}</li>
          </ul>
        </div>
        <div class="index-list">
          <!-- 商品列表 -->
          <good-list :goodsData="classifyGoodsList" @goodsId="getGoodsId">
          </good-list>
          <!-- 没有数据提示 -->
          <no-data v-show="showNoData" tip="该商品分类没有数据 :("></no-data>
        </div>

        <div v-if="goodsLoadMore" style="text-align: center">
          <van-loading size=".24rem">加载中...</van-loading>
        </div>
      </div>

      <MLoading v-show="loading"></MLoading>

      <!--底部-->
      <van-divider v-show="hotGoods.length > 0" style="margin-bottom:0.58rem">
        <img src="http://shop.yujiaojiaoyu.com/resources/dist/img/ba.png" width="16" height="16"
          style="vertical-align: middle; margin-right: .04rem">
        <span style="vertical-align: middle; font-size: .12rem">渝公网安备 50010702501168号</span>
      </van-divider>

      <div>
      </div>
      <!--规格弹窗-->
      <spec-box :showChooseSpecCard='showSpecBox' :detailData='detailData' />
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import MLoading from "components/loading/loading"
  import {
    isWeixin,
    getQueryString
  } from "js/mixin"
  import {
    yjBaseUrl,
    baseUrl
  } from "api/config"
  import GoodList from "base/newGoodList"
  import NoData from 'base/noData'
  import {
    mapMutations
  } from "vuex"
  import {
    mapGetters
  } from 'vuex'
  import GoodsDetail from "components/goods-detail/newGoodsDetail";
  import {
    getNormalGoodsDetail,
    getShareParmars
  } from "api/getData";
  import {
    getWxToken
  } from "api/getData";
  import SpecBox from 'base/specPopup';
  export default {
    name: 'homePage',
    components: {
      MLoading,
      GoodList,
      GoodsDetail,
      NoData,
      SpecBox,
    },
    data() {
      return {
        orgidStr: '', //生活超市id
        bannerList: [], //轮播图列表
        indexNavList: [], //首页导航列表
        recomList: [], //推荐列表

        hotGoods: [], // 商品列表
        loading: true, //加载中显示控制
        userStateCode: "", //存储登录状态码
        loginState: false, //用户状态
        confirmType: 0, //弹出框索引 1->重设密码 2-> 进口专区提示
        confirm: false, //弹出框控制
        confirmTitle: "", //弹出框名称
        confirmText: "", //弹出框文字提示
        isWeixinExplorer: false, //是否为微信浏览器
        // alertCon: false, //警告框控制
        noScroll: false, //是否禁止滚动
        openGoodsDetail: false, //是否打开商品详情
        isVip: '', //是否是vip
        shockingGoodsList: [], //惊爆特价商品列表
        newGoodsList: [], //上新好物商品列表
        navList: [], //分类列表
        navIndex: 0,
        classifyGoodsList: [], //分类列表商品
        showNoData: false,
        showSpecBox: false, //规格弹窗
        detailData: {}, //详情数据
        scrollTarget: true, //显示滑动小手
        currentPage: 1, //当前页
        totalPage: 1, // 总页数
        gcid: '', //请求的分类id
        isRecommend: 1,
        seq: 2, //生活超市
        goodsLoadMore: false, //加载更多
        eleHeight: 0, //导航条距离顶部的高度
        isShowService: false
      };
    },
    watch: {
      $route: "routerChange"
    },
    created() {
      // 判断浏览器是否为微信
      this.isWeixinExplorer = isWeixin()
      //获取对应版块的orgid
      this.getOrgid();
      //获取登录信息
      this.getUserInfo()
      let isShareShow = this.getQueryString("isShareShow") || sessionStorage.getItem("isShareShow") || 1;
      if (isShareShow == 0) {
        sessionStorage.setItem('isShareShow', 0);
      } else {
        sessionStorage.removeItem('isShareShow');
      }
    },
    activated() {
      this.$nextTick(() => {
        let navBox = this.$refs.navBox;
        navBox.classList.remove('show-nav');
        document.addEventListener('scroll', this.handleScroll);
        //微信分享
        this._goodsDetailShare()
        setTimeout(() => {
          this.scrollTarget = false;
        }, 10000)
      })
    },
    deactivated() {
      let navBox = this.$refs.navBox;
      navBox.classList.remove('show-nav');
      document.removeEventListener('scroll', this.handleScroll);
    },
    methods: {
      getOrgid() {
        this.api.post('getSeqOrgid').then(res => {
          if (res.code == 200 && res.obj && res.obj.length > 0) {
            res.obj.forEach(item => {
              if (item.seq == 2) { //生活超市 seq固定值为2
                this.orgidStr = item.orgid;
              }
            })
            // 获取首页信息
            this._getIndexInfo()
          }
        })
      },
      handleScroll() {
        let navBox = this.$refs.navBox;
        let navUlHeight = this.$refs.navUl.offsetHeight;
        this.eleHeight = this.$refs.navUl.offsetTop - navUlHeight;
        //滚动条滚动时，距离顶部的距离
        let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        //可视区的高度
        let windowHeight = document.documentElement.clientHeight || document.body.clientHeight;
        //滚动条的总高度
        let scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
        if (scrollTop >= this.eleHeight) {
          navBox.classList.add('show-nav');
        } else {
          navBox.classList.remove('show-nav');
        }
        this.goodsLoadMore = true;
        if (scrollTop + windowHeight >= scrollHeight - 10 && scrollTop != 0 && this.classifyGoodsList.length != 0) {
          if (this.currentPage < this.totalPage) {
            this.currentPage++;
            this.getStoreGoodsList();
          } else {
            this.goodsLoadMore = false;
          }
        }
      },
      _goodsDetailShare: function () {
        const _this = this;
        var url = location.href.split('#')[0];
        this.api.post('getShareParmars', {
          url: url,
          id: ""
        }).then(res => {
          wx.config({
            debug: false,
            appId: res.config_appid,
            timestamp: res.config_timestamp,
            nonceStr: res.config_nonceStr,
            signature: res.config_sign,
            jsApiList: [
              'checkJsApi', //判断当前客户端版本是否支持指定JS接口
              'onMenuShareTimeline',
              'onMenuShareAppMessage',
              'scanQRCode'
            ]
          });
          wx.ready(function () {
            var link = window.location.href;
            var protocol = window.location.protocol;
            var host = window.location.host;
            //分享给好友
            wx.onMenuShareAppMessage({
              title: "渝教商城",
              desc: "渝教商城",
              link: res.config_url + "/wap/eduIndex.htm#/redirect",
              imgUrl: res.config_url + "/edu-static/img/sharelogo.jpg",
              type: 'link',
              dataUrl: ''
            });
            wx.error(function (res) {
              alert(res.errMsg);
            });
          });
          //分享朋友圈
          wx.onMenuShareTimeline({
            title: '渝教商城',
            link: res.config_url + "/wap/eduIndex.htm#/redirect",
            imgUrl: res.config_url + "/edu-static/img/sharelogo.jpg"
          });
        })
      },
      routerChange: function () {
        if (this.getQueryString("goodsdetail")) {
          this.openGoodsDetail = true
        }
        this.noScroll = true
        window.location.href.indexOf("goodsClassify") > -1 ?
          (this.noScroll = true) :
          (this.noScroll = false)
      },
      getUserInfo: function () {
        this.api.post('getLoginState').then(res => {
          this.setUserInfo(res)
          if (res.code == '200') {
            this.loginState = true;
            localStorage.setItem('userDeposit', res.obj.user.userDeposit)
            // 判断是否为第一次登录
            if (res.obj.user.loginCount == '1') {}
          } else {
            this.loginState = false;
          }
        })
      },
      ...mapGetters([
        'userInfo'
      ]),
      _getIndexInfo: function (id) {
        const _this = this
        this.hotGoods = []
        this.loading = true
        this.api.post('getIndexInfo', {
          orgid: this.orgidStr
        }).then(res => {
          //获取导航列表
          _this.navList = res.menuList[0].resList;
          _this.hotGoods = res.mainList
          _this.tabList = res.orgList
          _this.shockingGoodsList = res.bargainList; //惊爆特价商品列表
          _this.newGoodsList = res.newGoodsList; //上新好物商品列表
          _this.hotGoods[0].smallList.forEach((item, index) => {
            if (item.activity != null && item.activity != "") {
              item.price = (item.price * item.activity.discount).toFixed(2);
              if (item.activity.discount == 1) {
                item.activity.discount = null
              } else {
                item.activity.discount = item.activity.discount * 100
              }
            } else {
              item.activity = [];
              item.activity.givePresent = null
              item.activity.reducePostage = null
            }
          })
          //获取热门商品
          this.getStoreGoodsList();

          // 获取轮播图 分类  推荐列表
          if (res.advertPositionList && res.advertPositionList.length > 0) {
            res.advertPositionList.forEach(item => {
              if (item.lunbo) {
                _this.bannerList = item.lunbo;
              } else if (item.link) {
                _this.recomList = item.link;
                _this.recomList = _this.recomList.slice(0, 3);
              } else if (item.fenlei) {
                _this.indexNavList = item.fenlei;
              }
            })
          }
        })
      },
      //导航
      changeTab(item, index, e) {
        // 显示
        this.$toast.loading({
          duration: 0,
          forbidClick: true,
          message: '加载中'
        })
        if (item == 1) {
          this.isRecommend = 1;
          this.seq = 2;
          this.gcid = '';
        } else {
          this.isRecommend = '';
          this.seq = '';
          this.gcid = item.urlId;
        }
        if (e.target.innerHTML == '热门商品') {
          this.navIndex = index;
        } else {
          this.navIndex = index + 1;
        }
        this.scrollMoveX(e, this.$refs.navUl);
        this.scrollMoveX(e, this.$refs.navUl1);
        this.showNoData = false
        $('html,body').animate({
          scrollTop: this.eleHeight
        }, 300).promise().then(() => {
          this.currentPage = 1; //当前页初始化
          this.getStoreGoodsList();
        });
      },
      scrollMoveX(e, box) {
        let docW = $(box).width();
        let thisW = $(e.target).width();
        let left = $(box).scrollLeft() + ($(e.target).offset().left) - (docW / 2 - thisW / 2);
        $(box).animate({
          scrollLeft: left
        }, 300);
      },
      ...mapMutations({
        setUserInfo: 'SET_USER_INFO'
      }),
      goToFind: function () {
        window.location.href = `${yjBaseUrl}/discover/index.shtml`
      },
      onConfirm: function () {
        if (this.confirmType == 1) {
          this.$router.push("/resetPwd")
        } else if (this.confirmType == 2) {
          this.$router.push({
            name: "goodsClassify",
            query: {
              seq: this.listType,
              orgid: this.listOrgid
            }
          })
        } else {
          window.location.href = `${baseUrl}/user/login.htm?url=${baseUrl}/wap/index.htm%2523%2F`
        }
      },
      goToSearch: function () {
        this.$router.push("/search")
      },
      getGoodsId: function (id) {
        this.goodsId = id
        this.openGoodsDetail = true
      },
      closeGoodsDetail: function (e) {
        if (e) this.openGoodsDetail = false
      },
      loadmore(val) {
        if (val == 1) {
          this.$router.push({
            path: "goods-classify-list",
            query: {
              isBargain: true
            }
          })
        } else if (val == 2) {
          this.$router.push({
            path: "goods-classify-list",
            query: {
              isNewGoods: true
            }
          })
        }
      },
      openDetail(id) {
        this.$router.push({
          path: "/goods-detail",
          query: {
            goodsid: id
          }
        })
      },
      handleToClassify(url) {
        if (url) {
          window.location.href = url;
        }
      },
      handleShowSpecBox(data) {
        this.detailData = data;
        this.showSpecBox = true;
      },
      closeSpecBox() {
        this.showSpecBox = false;
      },
      getStoreGoodsList() {
        let data = {
          isRecommend: this.isRecommend,
          gc_id: this.gcid,
          seq: this.seq,
          currentPage: this.currentPage
        }
        this.api.post('getStoreGoodsList', data).then(res => {
          this.goodsLoadMore = false;
          this.loading = false;
          // 隐藏
          this.$toast.clear()
          if (!res.obj.goodsList) {
            this.showNoData = true;
          } else {
            this.showNoData = false;
            this.totalPage = res.obj.totalPage;
            if (this.currentPage == 1) {
              this.classifyGoodsList = res.obj.goodsList;
            } else {
              this.classifyGoodsList.push(...res.obj.goodsList);
            }

          }
        })
      },
      wXscan() {
        wx.ready(function () {
          wx.scanQRCode({
            needResult: 1, // 默认为0，扫描结果由微信处理，1则直接返回扫描结果，
            scanType: ["qrCode", "barCode"], // 可以指定扫二维码还是一维码，默认二者都有
            success: function (res) {
              let result = res.resultStr; // 当needResult 为 1 时，扫码返回的结果
              window.location.href = result; //因为我这边是扫描后有个链接，然后跳转到该页面
            },
            error: function (res) {
              this.$toast(res)
            }
          });
        })
      }
    }
  }
</script>

<style lang="less">
  @red: #f0415f;

  @keyframes handMove {
    0% {
      left: 0.5rem;
    }

    100% {
      left: 0;
    }
  }

  .pointer {
    position: absolute;
    left: 0;
    top: 50%;
    margin-top: -0.25rem;
    width: 0.5rem;
    height: 0.5rem;
    animation: handMove 1s infinite;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .homepage {
    width: 100%;
    height: 100%;
    background: #EEEEEE;
  }

  //跳转列表
  .link-shop {
    width: 94%;
    margin: 0 auto 0.1rem;
    border-radius: 0.05rem;
    display: flex;
    justify-content: space-between;

    .link-left {
      width: 40%;
      border-radius: 0.05rem;
      background: #fff;
      display: flex;
      flex-direction: column;
      padding: 0.06rem 0.1rem;

      .cooking-pic {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }

      img {
        width: 100%;
        height: inherit
      }
    }

    .link-right {
      width: 52%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;

      .food-pic {
        display: flex;
        justify-content: space-between;
      }

      img {
        width: 100%;
        height: 50%;
      }

      .food-top {
        border-radius: 0.05rem;
        background: #fff;
        padding: 0.06rem 0.1rem;
        margin-bottom: 0.1rem;

        img:first-child {
          margin-right: 0.03rem;
        }
      }

      .food-bottom {
        border-radius: 0.05rem;
        background: #fff;
        padding: 0.06rem 0.1rem;

        img:first-child {
          margin-right: 0.03rem;
        }
      }
    }

    span {
      display: block;
      color: #AC63FF;
      font-size: 0.14rem;
      font-weight: 400;
      margin-bottom: 0.06rem;
    }
  }

  //惊爆特价
  .shocking-price {
    width: 94%;
    margin: 0 auto 0.1rem;
    background: #fff;
    border-radius: 0.05rem;
    padding: 0.16rem 0 0.16rem 0.12rem;
    box-sizing: border-box;
    overflow: hidden;

    .shocking-head {
      display: flex;
      justify-content: space-between;
      width: 100%;
      padding: 0 0.12rem 0.16rem 0;
      box-sizing: border-box;
      font-family: Microsoft YaHei UI;

      .hd-title {
        span {
          font-size: 0.18rem;
          color: #FF0000;
          font-weight: 400;
        }

        img {
          width: 0.23rem;
          height: 0.23rem;
          margin-left: 0.1rem;
          vertical-align: sub;
        }
      }

      .hd-more {
        display: flex;
        align-items: center;

        span {
          font-size: 0.12rem;
          color: #FF773A;
        }

        img {
          width: 0.15rem;
          height: 0.15rem;
          font-size: 0;
          margin-left: 0.05rem;
          vertical-align: middle;
        }
      }
    }

    .shocking-box {
      width: 100%;
      padding-bottom: 0.13rem;
      overflow: hidden;
      overflow-x: auto;
      position: relative;

      .shocking-ul {
        display: flex;
        flex-wrap: nowrap;

        li {
          width: 1rem;
          margin-right: 0.07rem;

          .product-img {
            width: 1rem;
            height: 1rem;

            img {
              width: 100%;
              height: 100%;
            }
          }

          .product-content {
            margin-top: 0.1rem;

            h3 {
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
              color: #333333;
              font-size: 0.12rem;
              text-align: center;
            }

            .product-content-price {
              overflow: hidden;
              display: flex;
              justify-content: space-between;

              span {
                font-size: 0.12rem;
                color: #999999;
                white-space: nowrap;
                text-decoration: line-through;
              }

              .buy-price {
                font-size: 0.12rem;
                color: #E20404;
                text-decoration: none;
              }
            }

            .badge {
              display: block;
              span {
                display: inline-block;
                width: 0.3rem;
                height: 0.13rem;
                border: 0.01rem solid #E20404;
                border-radius: 0.05rem;
                font-size: 0.12rem;
                color: #E20404;
                text-align: center;
                line-height: 0.13rem;
              }
            }
          }
        }
      }
    }
  }

  //上新好物
  .new-goods {
    width: 94%;
    margin: 0 auto 0.1rem;
    background: #fff;
    border-radius: 0.05rem;
    padding: 0.16rem 0 0.16rem 0.12rem;
    box-sizing: border-box;
    overflow: hidden;

    .new-head {
      display: flex;
      justify-content: space-between;
      width: 100%;
      padding: 0 0.12rem 0.16rem 0;
      box-sizing: border-box;
      font-family: Microsoft YaHei UI;

      .hd-title {
        span {
          font-size: 0.18rem;
          color: #FF0000;
          font-weight: 400;
        }

        img {
          width: 0.23rem;
          height: 0.23rem;
          margin-left: 0.1rem;
          vertical-align: sub;
        }
      }

      .hd-more {
        display: flex;
        align-items: center;

        span {
          font-size: 0.12rem;
          color: #FF773A;
        }

        img {
          width: 0.15rem;
          height: 0.15rem;
          font-size: 0;
          margin-left: 0.05rem;
        }
      }
    }

    .new-box {
      width: 100%;
      padding-bottom: 0.13rem;
      overflow: hidden;
      overflow-x: auto;
      position: relative;

      .new-ul {
        display: flex;
        flex-wrap: nowrap;

        li {
          width: 1rem;
          margin-right: 0.07rem;

          .product-img {
            width: 1rem;
            height: 1rem;

            img {
              width: 100%;
              height: 100%;
            }
          }

          .product-content {
            margin-top: 0.1rem;

            h3 {
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
              color: #333333;
              font-size: 0.12rem;
              text-align: center;
            }

            .buy-price {
              font-size: 0.13rem;
              color: #CA312D;
              text-align: left;
            }

            .badge {
              display: block;
              span {
                display: inline-block;
                width: 0.3rem;
                height: 0.13rem;
                border: 0.01rem solid #E20404;
                border-radius: .05rem;
                font-size: 0.12rem;
                color: #E20404;
                text-align: center;
                line-height: 0.13rem;
              }
            }
          }
        }
      }
    }
  }

  .index-list {
    width: 100%;
    background: #EEEEEE;
    padding: 0.16rem 0.1rem;
    box-sizing: border-box;
    position: relative;
    z-index: 1;
  }

  //普通商品导航
  .index-nav {
    width: 100%;
    overflow: hidden;
    padding: 0 0.1rem;
    box-sizing: border-box;
    background: #F9F9F9;

    .index-nav-ul {
      padding: 0.16rem 0;
      overflow-x: auto;
      display: flex;
      flex-wrap: nowrap;

      .item {
        height: 0.16rem;
        line-height: 0.16rem;
        white-space: nowrap;
        padding: 0 0.1rem;
        font-size: 0.16rem;
        color: #333333;
        border-right: 0.01rem solid #E1E1E1;
      }

      .item:last-child {
        border-right: none;
      }

      .item-active {
        color: #FF773A;
      }
    }
  }

  //固定的导航
  .nav-fixed {
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;
    background: #F9F9F9;
    padding: 0.52rem 0.1rem 0;
    opacity: 0;
    transition: all 0.3s;

    .index-nav-ul {
      padding: 0.16rem 0;
      overflow-x: auto;
      display: flex;
      flex-wrap: nowrap;

      .item {
        height: 0.16rem;
        line-height: 0.16rem;
        white-space: nowrap;
        padding: 0 0.1rem;
        font-size: 0.16rem;
        color: #333333;
        border-right: 0.01rem solid #E1E1E1;
      }

      .item:last-child {
        border-right: none;
      }

      .item-active {
        color: #FF773A;
      }
    }
  }

  .show-nav {
    z-index: 490;
    opacity: 1;
  }

  .channel {
    margin-bottom: 0.1rem;
    padding: 0.16rem 0.12rem 0.08rem;
    background-color: #fff;
    box-sizing: border-box;
    overflow: hidden;

    .row {
      display: flex;
      flex-wrap: wrap;

      .item {
        width: 20%;
        margin-bottom: 0.1rem;
        text-align: center;

        div {
          display: inline-block;

          .icon {
            display: block;
            width: 0.5rem;
            height: 0.5rem;
            background-size: 0.5rem 0.5rem;
          }

          .name {
            font-size: 0.12rem;
            color: #333333;
            margin-top: 0.02rem;
          }
        }
      }
    }
  }

  .yjyl-shop-search {
    height: 0.44rem;
    padding: 0.04rem 0.15rem;
    background-color: #fff;

    & a {
      display: inline-block;
      background-color: #eee;
      line-height: 0.36rem;
      width: 100%;
      border-radius: 0.18rem;
      font-size: 0.14rem;
      color: #999;
      text-align: center;
    }
  }

  .top-head {
    background-color: rgba(0, 0, 0, 0);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 500;

    .seach-head {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: .08rem .15rem;

      .back {
        display: inline-block;
        margin-right: 0.1rem;
        width: 0.34rem;
        height: 0.34rem;
        border-radius: 0.17rem;
        background-color: rgba(0, 0, 0, 0.3);
        color: #fff;
        text-align: center;
        line-height: 0.34rem;
      }

      .search-input {
        position: relative;
        min-width: 3rem;
        height: 0.34rem;
        font-size: 0.14rem;
        background-color: #fff;
        border-radius: 0.17rem;
        box-shadow: 0.02rem 0.04rem 0.1rem rgba(0, 0, 0, 0.1);
        border: 0.01rem solid #e9e9e9;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 .14rem;
        box-sizing: border-box;
        flex: 1;

        .search {
          display: flex;
          align-items: center;
          flex: 1;
          text-align: center;

          .search-icon {
            display: inline-block;
            width: 0.22rem;
            height: 0.22rem;
            background: url('../../common/images/newIndex/search.png') no-repeat;
            background-size: contain;
            flex-shrink: 0;
          }

          .placeholder {
            color: #BFBFBF;
            flex: 1;
            text-align: center;
          }
        }

        .wx-scan {
          width: .33rem;
          display: flex;
          justify-content: flex-end;
          flex-shrink: 0;
          img {
            width: .17rem;
          }
        }
      }

      .search-ico {
        margin-left: 0.06rem;
        width: 0.34rem;
        text-align: center;
        height: 0.34rem;
        font-size: 0.14rem;
        background-color: #fff;
        border-radius: 0.17rem;
        box-shadow: 0.02rem 0.04rem 0.1rem rgba(0, 0, 0, 0.1);
        border: 0.01rem solid #e9e9e9;

        .icon {
          vertical-align: middle;
          display: inline-block;
          align-items: center;
          font-size: 0.2rem;
          line-height: 0.34rem;
          color: #666;
        }
      }
    }
  }

  .yjyl-shop-nav {
    width: 100%;
    background-color: #fff;

    & ul {
      display: block;
      height: 0.44rem;
      margin: 0;
      padding: 0;

      & li {
        display: block;
        float: left;
        list-style: none;
        width: 33.333333%;
        text-align: center;
        line-height: 0.44rem;
        background-color: #fff;
        color: #666;
      }

      & a {
        display: block;
        line-height: 0.4rem;
        color: #666;

        &.router-link-active {
          border-bottom: 0.04rem solid #1fbba6 !important;
          color: #1fbba6 !important;
        }
      }
    }
  }

  .goods-nav {
    overflow: hidden;
  }

  .goods-nav-ul li {
    display: block;
    float: left;
    width: 25%;
    padding: 0.08rem 1%;
    font-size: 0.14rem;
  }

  .goods-nav-ul div {
    padding: 0.02rem 0.06rem;
    color: #666;
    text-align: center;
    line-height: 2;
  }

  .gnu-right {
    margin-left: -0.04rem;
  }

  .goods-active {
    color: #fff !important;
    background-color: #1fbba6;
    border-radius: 0.15rem;
  }

  .my-swipe {
    .van-swipe {
      width: 3.75rem;
      height: 2.1rem;
    }

    img {
      width: 100%;
      height: 100%;
    }
  }
</style>
