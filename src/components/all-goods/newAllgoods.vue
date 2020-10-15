<template>
  <div class="all-goods-list">
    <div class="all-goods">
        <!-- 头部导航 -->
      <div class="top-head">
        <ul class="tab-head">
          <li v-for="(item,index) in headNavList" :key="index" :class="{'active_nav': index == headNavIndex}" @click="changeTab(item,index)">{{item.name}}</li>
        </ul>
        <router-link tag="div" class="head-search" :to="{ path: 'search'}">
          <img src="../../common/images/newIndex/search2.png" alt="">
        </router-link>
      </div>

      <div class="type">
        <div class="type-item" ref="menu">
          <ul>
            <!--普通-->
            <li  v-for="(item, index) in secondClassify" :key="index" :class="{active_item: index == indexItem}" @click="chooseItem(item,index)">
              <span>{{item.name}}</span>
            </li>
          </ul>
        </div>

        <div class="type-list">
          <div class="list-nav">
            <ul ref="navUl2">
              <li v-for="(item, index) in threeList" :key="index" :class="{'three-active': index == threeIndex}" @click="chooseThreeItem(item,index,$event)">{{item.name}}</li>
            </ul>
          </div>
          <!-- 商品列表 -->
          <div class="goods-list">
            <scroll
              style="over-flow: hidden; height: 100%"
              :data="classifyGoodsList"
              @scrollToEnd="loadMore"
              :listen-scroll="listenScroll"
              :probe-type="probeType"
              :pullup="pullup"
              @scroll="showBackButton"
              ref="dataList"
            >
              <good-list
                :goodsData="classifyGoodsList"
                :showLoadMore='showLoadMore'
                >
              </good-list>
              <!-- 没有数据提示 -->
              <no-data v-show="showNoData" tip="该商品分类没有数据 :("></no-data>
            </scroll>
            <!-- 返回顶部 -->
            <back-top v-show="showBackTop"  @click.native="backToTop" style="bottom:65px;right:15px;"></back-top>
          </div>
        </div>
      </div>
      <loading v-model="loadingCon" text="加载中"></loading>
    </div>
    <!--规格弹窗-->
    <spec-box
      :showChooseSpecCard = 'showSpecBox'
      :detailData = 'detailData'
    />
  </div>
</template>

<script>
import { Loading } from "vux";
import Scroll from 'base/scroll';
import BackTop from 'base/backTop';
import NoData from 'base/noData';
import { getLoginState, getIndexInfo } from "../../api/getData";
import GoodList from "base/newGoodList"
import { getNormalGoodsDetail,getShareParmars} from "api/getData";
import SpecBox from 'base/specPopup';
export default {
  name: 'allGoods',
  components: {
    GoodList,
    Loading,
    Scroll,
    NoData,
    BackTop,
    SpecBox
  },
  data() {
    return {
      headNavList:[
        {type:2,name:'生活超市', orgid:''},
        {type:7,name:'进口商品', orgid:''},
        {type:8,name:'精准扶贫', orgid:''}
      ], //头部导航
      headNavIndex:0, //一级分类索引
      loadingCon: false, //加载中控制
      secondClassify: [], //二级分类列表
      indexItem: 0, //二级分类索引
      threeList:[], //三级分类
      threeIndex:0, //三级分类索引
      classifyId:'',//分类id
      classifyGoodsList:[], //商品分类列表
      currentPage: 1, // 当前页
      totalPage: 1, // 总页数
      pullup: true, // 开启上拉加载
      probeType:3,
      listenScroll:true,
      showBackTop: false, //是否显示返回顶部
      showNoData:false,
      showSpecBox:false, //规格弹窗
      detailData:{}, //详情数据
      showLoadMore:false, //加载更多控制

      seq:2, //一级分类id
      secondUrlId:'', //二级分类id
      flag:true
    };
  },
  created(){
    if(this.flag){
      this.loadingCon = true;
      this.seq =this.$route.query.seq || 2;
      this.secondUrlId = this.$route.query.urlId || '';
      //获取对应版块的orgid
      this.getOrgid(this.seq);
    }
  },
  beforeRouteEnter(to,from,next){
    next(vm=>{
      if(from.name == 'home' && JSON.stringify(to.query) != "{}"){
        // window.location.reload();
        vm.loadingCon = true;
        vm.seq =vm.$route.query.seq || 2;
        vm.secondUrlId = vm.$route.query.urlId || '';
        //获取对应版块的orgid
        vm.getOrgid(vm.seq);
        vm.flag = false
      }else{
        vm.flag = true
      }
    });
  },
  beforeRouteLeave(to,from,next){
    if(!this.loadingCon){
      next();
    }
  },
  methods: {
    getOrgid(val){
       this.api.post('getSeqOrgid').then(res=>{
        if(res.code==200 && res.obj && res.obj.length>0){
          res.obj.forEach(item=>{
            this.headNavList.forEach(citem=>{
              if(citem.type == item.seq){
                citem.orgid = item.orgid;
              }
            })
            if(item.seq == val){ //生活超市 seq固定值为2
              if(val==2){
                this.headNavIndex = 0;
              }else if(val==7){
                this.headNavIndex = 1;
              }else if(val==8){
                this.headNavIndex = 2;
              }
              // 获取首页信息
              this.getIndexData(item.orgid) //默认获取生活超市
            }
          })
        }
      })
    },
    getIndexData(id){
      this.loadingCon = true;
      getIndexInfo(id).then(res => {
        this.loadingCon = false;
        this.secondClassify = [...res.menuList[0].resList];
        if(this.secondClassify.length !=0){
          this.secondClassify.forEach(item=>{
            item.secList.unshift({
              name:'全部',
              urlId:item.urlId,
              floorgoods:item.floorgoods
            })
          });
          this.threeList = [];
          this.classifyGoodsList =[];
          this.threeList = this.secondClassify[0].secList;
          if(this.secondUrlId){
            this.classifyId = this.secondUrlId;
            let index = this.secondClassify.findIndex(item=>item.urlId == this.secondUrlId);
            this.indexItem = index; //初始化左侧item
          }else{
            this.classifyId = this.secondClassify[0].urlId;
            this.secondUrlId = this.secondClassify[0].urlId;
            this.indexItem = 0; //初始化左侧item
          }
          this.getStoreGoodsList();
        }
      });
    },
    //头部导航切换
    changeTab(item,index) {
      this.headNavIndex = index;
      this.seq = item.type;
      this.threeIndex = 0; //初始化三级分类索引
      this.indexItem = 0; //初始化二级分类索引
      this.secondUrlId = ''; //二级分类清空
      this.currentPage = 1;
      this.threeList = [];
      this.showNoData = false;
      this.classifyGoodsList = [];
      if (item.orgin != '') {
        this.getIndexData(item.orgid);
      }
    },
    chooseItem(item,index) {
      this.indexItem = index;
      this.currentPage = 1;
      this.threeIndex = 0;
      this.threeList = [...new Set(item.secList)];
      this.classifyGoodsList = [];
      this.classifyId = item.urlId;
      this.secondUrlId = item.urlId;
      this.getStoreGoodsList();
    },
    chooseThreeItem(item,index,e){
      this.threeIndex = index;
      this.currentPage = 1;
      this.classifyGoodsList = [];
      this.classifyId = item.urlId;
      this.scrollMoveX(e,this.$refs.navUl2);
      this.getStoreGoodsList();
    },
    scrollMoveX(e,box){
      let docW = $(box).width();
      let thisW = $(e.target).width();
      let left = $(box).scrollLeft() + ($(e.target).offset().left) - (docW / 2 - thisW / 2) - 100;
      $(box).animate({ scrollLeft: left }, 300);
    },
    getStoreGoodsList(){
      this.$router.push({
        path:'/all-goods',
        query:{
          seq:this.seq,
          urlId:this.secondUrlId
        }
      })
      let data ={
        gc_id:this.classifyId,
        currentPage:this.currentPage
      }
      this.api.post('getStoreGoodsList', data).then( res => {
        this.showLoadMore = false;
        if(!res.obj.goodsList) {
					this.showNoData = true;
				}else{
          this.showNoData = false;
          this.classifyGoodsList.push(...res.obj.goodsList);
          this.totalPage = res.obj.totalPage;
        }
			})
    },
    //滚动加载
    showBackButton: function(pos){
			pos.y > -2000 ? this.showBackTop = false : this.showBackTop = true
    },
    backToTop: function(){
      this.$refs.dataList.scroll.scrollTo(0, 0, 500)
		},
    loadMore: function() {
			if(this.currentPage < this.totalPage && this.classifyId !='') {
        this.showLoadMore = true;
				this.currentPage ++;
				this.getStoreGoodsList();
			}
    },
    handleShowSpecBox(data){
      this.detailData = data;
      this.showSpecBox = true;
    },
    closeSpecBox(){
      this.showSpecBox = false;
    }
  }
};
</script>

<style lang="less" scoped>
.active_item{
  background-color: #fff !important;
  span{
    border-left: .04rem solid #FF773A !important;
    color: #333333 !important;
  }
}
.all-goods {
  position: fixed;
  top: 0;
  left:0;
  bottom: 0;
  right: 0;
  overflow: hidden;
  background-color: #E1E1E1;
  //头部导航
  .top-head {
    background-color:#fff;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 500;
    height: .5rem;
    display: flex;
    border-bottom: .08rem solid #E1E1E1;
    .tab-head{
      flex:1;
      display: flex;
      justify-content: space-between;
      padding-left:.08rem;
      padding-right: .12rem;
      li{
        white-space: nowrap;
        line-height: .5rem;
        font-size: .14rem;
        color: #333333;
      }
      .active_nav{
        color:#FF773A;
      }
    }
    .head-search{
      width: 10.67%;
      border-left: .01rem solid #E1E1E1;
      position: relative;
      img{
        width:.2rem;
        height: .2rem;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
      }
    }
  }
  .type {
    display: flex;
    position: absolute;
    top: .58rem;
    bottom: .5rem;
    left: 0;
    right: 0;
    width:100%;
    background: #fff;
    overflow: hidden;
    .type-item {
      flex: 0 0 1rem;
      width: 1rem;
      background-color:#F9F9F9;
      overflow-y: auto;
      li {
        display: block;
        height: .45rem;
        line-height: .45rem;
        text-align: center;
        position: relative;
        overflow: hidden;
        span {
          margin-top:.12rem;
          color: #999999;
          display: block;
          height: .2rem;
          line-height: .2rem;
          font-size: .14rem;
          border-left: .04rem solid #f0f4f5;
        }
      }
    }
    .type-list {
      flex: 1;
      overflow: hidden;
      .list-nav{
        position: relative;
        z-index: 500;
        background: #fff;
        width: 100%;
        height: .45rem;
        border-bottom: .02rem solid #EEEEEE;
        ul{
          width: 100%;
          display: flex;
          overflow-x:auto;
          li{
            padding: 0 .12rem;
            line-height: .45rem;
            white-space: nowrap;
            font-size: .12rem;
          }
          .three-active{
            color:#FF773A;
          }
        }
      }
      .goods-list {
        padding:.2rem .1rem .16rem;
        position: fixed;
        top: .4rem;
        bottom: .51rem;
        left: 0;
        right: 0;
        margin-left: 1rem;
        margin-top: .6rem;
      }
    }
  }
}
</style>
