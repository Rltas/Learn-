<template>
  <div class="classify-list">
    <div class="classify" id="classify">
      <!-- <x-header class="vux-1px-b" :left-options="{showBack:false}"></x-header> -->

      <!-- <scroll
        style="over-flow: hidden; height: 100%"
        :data="data"
        @scrollToEnd="loadMore"
        :listen-scroll="listenScroll"
        :probe-type="probeType"
        :pullup="pullup"
        @scroll="showBackButton"
        ref="dataList"
      >-->
      <div>
        <div v-if="id && bannerList.length != 0" class="carousel-box">
          <swiper style="width:100%;" auto loop :aspect-ratio='450/800' dots-position="center">
            <swiper-item
              class="swiper-demo-img"
              v-for="(item, index) in bannerList"
              :key="index"
              @click.native="handleToClassify(item.targetUrl)"
            >
              <img :src="item.url" style="width:100%;height:100%;"/>
            </swiper-item>
          </swiper>
        </div>
        <div class="action" ref="action">
          <div class="item item-active" @click="handleChange('默认')">
            <span>默认</span>
          </div>
          <div class="item" @click="handleChange('销量')">
            <span>销量</span>
            <img src="../../common/images/newIndex/arrow1.png" v-if="xlFlag" alt />
            <img src="../../common/images/newIndex/arrow2.png" v-else alt />
          </div>
          <div class="item" @click="handleChange('价格')">
            <span>价格</span>
            <img src="../../common/images/newIndex/arrow1.png" v-if="jgFlag" alt />
            <img src="../../common/images/newIndex/arrow2.png" v-else alt />
          </div>
          <div class="back-arrow" @click="goBack"></div>
          <router-link class="go-shop" to="/shopping-cart">
            <img src="../../common/images/newIndex/goShop.png" alt />
            <span>购物车</span>
          </router-link>
        </div>
        <div class="second-level" v-if="id && levelList.length != 0">
          <span
            v-for="(item,index) in levelList"
            :key="index"
            :class="{levelActive: levelIndex == index}"
            @click="levelTo(index,item.gcid)"
          >{{item.name}}</span>
        </div>
        <!-- 商品列表 -->
        <div class="container">
          <good-list
            :goodsData="data"
            :isBargain="isBargain == 'true'"
            :isNewGoods="isNewGoods == 'true'"
            :showLoadMore="showLoadMore"
          ></good-list>
        </div>
      </div>
      <!-- 没有数据提示 -->
      <no-data v-show="showNoData" tip="该商品分类没有数据 :("></no-data>
      <!-- 
      </scroll>-->
      <!-- 返回顶部 -->
      <back-top v-show="showBackTop" @click.native="backToTop"></back-top>
    </div>
    <!--规格弹窗-->
    <spec-box :showChooseSpecCard="showSpecBox" :detailData="detailData" />
  </div>
</template>

<script>
import { XHeader, Swiper, SwiperItem } from "vux";
import Scroll from "base/scroll";
import GoodList from "base/newGoodList";
import BackTop from "base/backTop";
import NoData from "base/noData";
import SpecBox from "base/specPopup";
export default {
  components: {
    XHeader,
    Scroll,
    GoodList,
    NoData,
    BackTop,
    SpecBox,
    Swiper,
   SwiperItem,
  },
  data() {
    return {
      currentPage: 1, // 当前页
      totalPage: 1, // 总页数
      id: "", // 分类id
      data: [], // 商品数据
      pullup: true, // 开启上拉加载
      showBackTop: false, //是否显示返回顶部
      showNoData: false,
      isBargain: false,
      isNewGoods: false,
      orderByName: "", //排序字段
      orderTypeStr: "desc", //默认降序
      xlFlag: true, //销量
      jgFlag: true, //价格
      showSpecBox: false, //规格弹窗
      detailData: {}, //详情数据
      showLoadMore: false, //加载更多控制
      bannerList: [],
      levelIndex: 0,
      levelList: []
    };
  },
  created() {
    this.id = this.getQueryString("id");
    this.isBargain = this.getQueryString("isBargain");
    this.isNewGoods = this.getQueryString("isNewGoods");
    this._getStoreGoodsList();
    this.listenScroll = true;
    this.probeType = 3;
    if (this.id) {
      this.loadBanner();
      this.loadLevel();
    }
  },
  mounted() {
    document
      .getElementById("classify")
      .addEventListener("scroll", this.loadMore, false);
  },
  methods: {
    ceshi() {
      let ceshi = document.getElementById("classify");
      console.log(ceshi.clientHeight, ceshi.scrollTop, ceshi.scrollHeight);
    },
    showBackButton: function(pos) {
      pos.y > -2000 ? (this.showBackTop = false) : (this.showBackTop = true);
    },
    backToTop: function() {
      document.getElementById("classify").scrollTo(0, 0);
    },
    _getStoreGoodsList: function() {
      const _this = this;
      let data = {};
      data = {
        currentPage: _this.currentPage,
        isBargain: _this.isBargain ? "1" : "",
        isNewGoods: _this.isNewGoods ? "1" : "",
        gc_id: _this.id || "",
        orderBy: _this.orderByName,
        orderType: _this.orderTypeStr,
        seq: 2 //生活超市
      };
      this.api.post("getStoreGoodsList", data).then(res => {
        this.showLoadMore = false;
        if (!res.obj.goodsList) {
          _this.showNoData = true;
          return;
        } else {
           _this.showNoData = false;
        }
        _this.data.push(...res.obj.goodsList);
        _this.totalPage = res.obj.totalPage;
      });
    },
    loadMore: function() {
      let scrollBox = document.getElementById("classify");
      scrollBox.scrollTop > 1586
        ? (this.showBackTop = true)
        : (this.showBackTop = false);
      if (
        scrollBox.clientHeight + scrollBox.scrollTop >=
        scrollBox.scrollHeight
      ) {
        this.currentPage++;
        if (this.currentPage <= this.totalPage) {
          this.showLoadMore = true;
          this._getStoreGoodsList();
        }
      }
    },
    goBack() {
      this.$router.push({
        path: "/"
      });
    },
    handleChange(val) {
      this.data = [];
      this.currentPage = 1;
      let items = this.$refs.action.children;
      for (var i = 0; i < 3; i++) {
        items[i].classList.remove("item-active");
      }
      if (val == "销量") {
        items[1].classList.add("item-active");
        this.orderByName = "goods_salenum";
        if (this.xlFlag) {
          this.orderTypeStr = "desc";
          this.xlFlag = false;
        } else {
          this.orderTypeStr = "asc";
          this.xlFlag = true;
        }
      } else if (val == "价格") {
        items[2].classList.add("item-active");
        this.orderByName = "store_price";
        if (this.jgFlag) {
          this.orderTypeStr = "desc";
          this.jgFlag = false;
        } else {
          this.orderTypeStr = "asc";
          this.jgFlag = true;
        }
      } else {
        items[0].classList.add("item-active");
        this.orderByName = "";
        this.orderTypeStr = "desc";
      }
      this._getStoreGoodsList();
    },
    handleShowSpecBox(data) {
      this.detailData = data;
      this.showSpecBox = true;
    },
    closeSpecBox() {
      this.showSpecBox = false;
    },
    loadBanner() {
      let data = {
        gcid: this.$route.query.id
      };
      this.api.post("getAdvertBygcid", data).then(res => {
        this.bannerList = res.obj;
      });
    },
    handleToClassify(val) {
      if (val) {
        window.location.href = val;
      }
    },
    loadLevel() {
      let data = {
        gcid: this.$route.query.id
      };
      this.api.post("getChildrenBygcid", data).then(res => {
        this.levelList = res.obj;
        if (this.levelList.length > 0) {
          this.levelList.unshift({
            name: "全部",
            gcid: this.$route.query.id
          });
        }
      });
    },
    levelTo(index,id) {
      this.levelIndex = index;
      let levelBox = document.querySelector('.second-level');
      levelBox.scrollLeft = (58 * index);      
      this.currentPage = 1;
      this.data = [];
      this.id = id;
      this._getStoreGoodsList();
    }
  }
};
</script>

<style lang="less" scoped>
.classify {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f0f4f5;
  overflow-y: auto;
  .action {
    width: 100%;
    position: sticky;
    top: 0;
    z-index: 500;
    background: #fff;
    height: 0.5rem;
    display: flex;
    justify-content: space-between;
    padding: 0 0.68rem 0 0.59rem;
    // margin-bottom: 0.05rem;
    box-sizing: border-box;
    // box-shadow: 0 0.02rem 0.02rem 0 #999;
    .item {
      line-height: 0.5rem;
      display: flex;
      align-items: center;
      font-size: 0.16rem;
      color: #666;
      img {
        width: 0.08rem;
        height: 0.16rem;
        margin-left: 0.03rem;
      }
    }
    .item-active {
      color: #ff773a;
    }
    .back-arrow {
      position: absolute;
      left: 0.14rem;
      top: 50%;
      margin-top: -0.11rem;
      width: 0.22rem;
      height: 0.22rem;
      background: url("../../common/images/newIndex/go_back.png") no-repeat;
      background-size: 0.22rem 0.22rem;
    }
    .go-shop {
      width: 0.5rem;
      height: 0.5rem;
      background: #ff773a;
      font-size: 0.12rem;
      color: #fff;
      position: absolute;
      right: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      img {
        width: 0.26rem;
        height: 0.26rem;
      }
    }
  }
  .second-level {
    width: 100%;
    height: 0.36rem;
    background: #fff;
    color: #707070;
    border-top: 0.01rem solid #ddd;
    position: sticky;
    top: 0.49rem;
    z-index: 500;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    white-space: nowrap;
    padding: 0 0.16rem;
    box-sizing: border-box;
    line-height: 0.36rem;
    font-size: 0.14rem;
    span {
      padding: 0 0.14rem;
      border-right: 0.01rem solid #d8d8d8;
      &:last-child {
        border: none;
      }
    }
    .levelActive {
      color: #ff773a;
    }
  }
  .container {
    padding-top: 0.04rem;
  }
}
</style>
