<template>
	<!--手机端-->
	<div class="goods-classify-list">

		<div class="top-head" ref="topHead" :class="{'notInList': notInList}">
			<!-- 头部搜索 -->
			<div class="seach-head">
				<div class="search-input" ref="searchInput" @click="goToSearch">
					<i class="icon ion-android-search"></i>
					<span class="placeholder">
						搜索商品
					</span>
				</div>

				<router-link to='/shopping-cart'>
					<div class="search-ico card" ref="searchInput">
						<i class="icon ion-ios-cart"></i>
					</div>
				</router-link>

				<router-link to='/'>
					<div class="search-ico home" ref="searchInput">
						<i class="icon ion-ios-home"></i>
					</div>
				</router-link>
			</div>
		</div>

    <!-- 主体scroll -->
    <Scroll style="over-flow: hidden; height: 100%" :data="hotGoods" :listen-scroll="listenScroll" :probe-type="probeType" @scroll="scroll" ref="classifyScroll">
      <div>
        <!-- 轮播图 -->
        <div style="min-height: 100px">
          <!-- 生活超市 -->
          <!-- <img v-if="seq == '1'" class="banner-img" src="/inter-static/img/banner_edu.jpg" alt=""> -->
          <!-- 生活超市 -->
          <!-- <img v-if="seq == '2'" class="banner-img" src="/inter-static/img/banner_live.jpg" alt=""> -->
          <!-- 进口商品专区 -->
          <!-- <img v-if="seq == '7'" class="banner-img" src="/inter-static/img/banner_import_goods.png" alt=""> -->
          <!-- 扶贫惠购 -->
          <!-- <img v-if="seq == '8'" class="banner-img" src="/inter-static/img/help_home_banner01.png" alt=""> -->
        </div>
        <!-- 扶贫惠购轮播图 -->
        <swiper v-if="seq == '8'" :list="banner" height="210" :show-desc-mask="false"></swiper>

        <!-- 扶贫商品列表 -->
        <div v-if="seq == '8'">

          <div class="entrance">
            <div class="enter-item" @click="goPreference(1)">
              <div style="flex:5.45;height:78px;">
                <img style="width:100%;height:100%" src="/inter-static/img/enterBg11.png" alt=""/>
              </div>
              <div class="enterImg">
                <img style="width:100%;" src="/inter-static/img/areaImg11.png"/>
              </div>
              <div class="arrow">
                <img style="width:100%;" src="/inter-static/img/arrow.png"/>
              </div>
            </div>

            <div class="enter-item" @click="goPreference(2)">
              <div style="flex:5.45;height:78px;">
                <img style="width:100%;height:100%" src="/inter-static/img/enterBg33.png"/>
              </div>
              <div class="enterImg">
                <img style="width:100%;" src="/inter-static/img/areaImg33.png"/>
              </div>
              <div class="arrow">
                <img style="width:100%;" src="/inter-static/img/arrow.png"/>
              </div>
            </div>
            <div class="enter-item" @click="goPreference(3)">
              <div style="flex:5.45;height:78px;">
                <img style="width:100%;height:100%" src="/inter-static/img/enterBg222.png"/>
              </div>
              <div class="enterImg">
                <img style="width:100%;" src="/inter-static/img/areaImg222.png"/>
              </div>
              <div class="arrow">
                <img style="width:100%;" src="/inter-static/img/arrow.png"/>
              </div>
            </div>
          </div>
        </div>
        <!-- 商品详情 -->
        <div v-else>
          <good-list
            v-for="item in hotGoods"
            :goodsData="item.floorgoods"
            :divider="item.name"
            :isIntegral="item.type == '1'"
            v-if="item.floorgoods.length > 0"
            ></good-list>
        </div>
      </div>
    </Scroll>
		<MLoading v-show="loading"></MLoading>
	</div>
</template>

<script>

import {
  Swiper,
  SwiperItem,
  TransferDomDirective as TransferDom,
} from "vux"
import MLoading from "components/loading/loading"
import { getLoginState, getIndexInfo } from "api/getData"
import { isWeixin, getQueryString } from "js/mixin"
import Scroll from "base/scroll"
import BackTop from "base/backTop"
import GoodList from "base/goodList"
import { Script } from 'vm';
import { getNormalGoodsDetail,getShareParmars} from "api/getData";
const bannerList = [
  {
    url: "javascript:",
    img: "/inter-static/img/help_home_banner01.png"
  },
  {
    url: "javascript:",
    img: "/inter-static/img/help_home_banner02.png"
  }
]

export default {
  directives: {
    TransferDom
  },
  components: {
    Swiper,
    SwiperItem,
    MLoading,
    Scroll,
    BackTop,
    GoodList
  },
  data() {
    return {
      banner: bannerList, // banner图片集合
      hotGoods: [], //分类热门商品集合
      loading: true, //加载中
      orgid: "", //大分类id
      seq: "", //大分类唯一标识符
      gc_id: "", //商品类（GoddsClass）id
      open: false,
      goodsId: '',
      notInList: false
    };
  },
  created() {
    this.listenScroll = true
    this.probeType = 3
    this.orgid = getQueryString("orgid")
    this.seq = getQueryString("seq")
    this._getIndexInfo(this.orgid)
    this._goodsDetailShare()
  },
  watch: {
    $route: "routerChange"
  },
  methods: {
    _goodsDetailShare:function(){
      const _this = this;
      var url = location.href.split('#')[0];//url不能写死
      this.api.post('getShareParmars',{
        url:url,id: ""
      }).then(res => {
        wx.config({
                debug: false,////生产环境需要关闭debug模式
                appId: res.config_appid,//appId通过微信服务号后台查看
                timestamp: res.config_timestamp,//生成签名的时间戳
                nonceStr: res.config_nonceStr,//生成签名的随机字符串
                signature: res.config_sign,//签名
                jsApiList: [//需要调用的JS接口列表
                    'checkJsApi',//判断当前客户端版本是否支持指定JS接口
                    'onMenuShareTimeline',//分享给好友
                    'onMenuShareAppMessage'//分享到朋友圈
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
              link: res.config_url+"/wap/interIndex.htm#", // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
              imgUrl: res.config_url+"/inter-static/img/sharelogo.jpg", // 自定义图标
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
            title: '渝教商城',
            link: res.config_url+"/wap/interIndex.htm#",
            imgUrl: res.config_url+"/inter-static/img/sharelogo.jpg",// 自定义图标
            trigger: function (res) {
                // 不要尝试在trigger中使用ajax异步请求修改本次分享的内容，因为客户端分享操作是一个同步操作，这时候使用ajax的回包会还没有返回.
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
    routerChange: function(){
      if(this.getQueryString("goodsdetail")) {
        this.noScroll = true
      }
    },
    scroll(pos) {
      this.scrollY = pos.y
    },
    _getIndexInfo: function(id) {
      const _this = this
      this.hotGoods = []
      this.loading = true
      getIndexInfo(id).then(res => {
        this.hotGoods = res.menuList[0].resList
        this.gc_id = res.menuList[0].resList[0].urlId
        // 如果是扶贫商品
        if (this.seq == "8") {
          let data = {
            currentPage: 1,
            pageSize: 100,
            gc_id: this.gc_id,
            orderType: "asc",
            orderBy: "store_price"
          }
          this.api.post('getStoreGoodsList', data).then( res => {
              _this.hotGoods = res.obj.goodsList
              _this.loading = false
            }
          )
        }
      })
    },
    goToSearch: function() {
      this.$router.push("/search")
    },
    getGoodsId: function(id) {
      this.goodsId = id
      this.open = true
    },
    closeGoodsDetail: function(e) {
      if(e) this.open = false
    },
    goPreference:function(e){
      const _this = this;
      this.$router.push({name:"preference",query:{areaId:e,orgid:this.orgid}})
    }
  },
};
</script>

<style lang="less" scoped>
@import "../../common/css/variable.less";
.notInList {
  display: none;
}
.goods-classify-list {
  width:100%;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 1000;
  padding-bottom:10px;
  background-color: @bg;
  &, body {
    overflow: hidden;
    height: 100%;
  }
}
.entrance {
  padding-top:24px;
  margin-bottom:10px;
}
.entrance .enter-item {
  display: flex;
  height: 90px;
  box-sizing: border-box;
  padding-left:26px;
  // line-height: 90px;
  margin-bottom:16px;
  background-color: #D4D4D4;
  align-items: center;
}
.entrance .enter-item .enterImg-wrapper {
  width:130px;
  height: 32px;
  margin-left:11px;
  margin-right: 17px;
}
.entrance .enter-item .enterImg {
  flex:6.58;
  height: 27px;
  margin-left:11px;
  margin-right: 8px;
}
.entrance .enter-item .arrow {
  flex:1;
  height: 24px;
}
</style>
