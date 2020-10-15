<template>
  <div class="search-list">
    <div class="search">

      <!-- 搜索 -->
      <div class="search-main">
        <div class="search-form">
          <input class="search-input" type="text" v-model="keyword" name="kewword" placeholder="请输入搜索关键词" v-on:input="watchText">
          <button class="search-but"  @click="searchOnSubmit"></button>
        </div>
      </div>

      <!-- 热门搜索 -->
      <div class="hot-search" v-show="!searchResult">
        <!-- <span class="hot-s-title">热门搜索</span> -->
        <!-- <ul>
          <li class="hot-s-li" v-for="item in hotSearchKeywords" @click="searchTarget(item)">{{item}}</li>
        </ul> -->
      </div>

      <!-- 搜索结果 -->
      <Scroll
        :listen-scroll="listenScroll"
        :probe-type="probeType"
        @scroll="showBackButton"
        @scrollToEnd="searchMore"
        :pullup="pullup"
        :data="goodsList"
        ref="searchList"
        class="search-result"
        v-show="searchResult">
        <good-list :goodsData="goodsList"></good-list>

        <div class="nogoods" v-if="noShopping">
          <img src="../../common/images/newIndex/nogoods.png" alt="">
          <p>没找到相关商品</p>
        </div>
      </Scroll>

      <!--  返回顶部  -->
      <backTop v-show="showBackTop" @click.native="backToTop"></backTop>
    </div>
    <!--规格弹窗-->
    <spec-box
      :showChooseSpecCard = 'showSpecBox'
      :detailData = 'detailData'
      />
  </div>
</template>

<script>
import { getIndexInfo, getNormalSearchDatas, getJxcSearchList, getLoginState } from 'api/getData'
import { haveData } from 'common/js/mixin'
import Scroll from 'base/scroll'
import backTop from 'base/backTop'
import GoodList from 'base/newGoodList'
import SpecBox from 'base/specPopup';

export default {
	components: {
		  Scroll, backTop, GoodList,SpecBox
	},
	data() {
		return {
			hotSearchKeywords: [],  //热门搜索关键词
			startSearch: true, //是否开始搜索
			searchValue: '', // 搜索内容
			searchResult: '', // 搜索返回的结果
			keyword: '',//搜索关键词
			goodsList: [],
			isJxcGoodsList: false, //是否是进销存商品列表
			jxcAllowed: 1, //是否拥有进销存权限
			showActivity: false, //是否展示活动信息
			searchValue: '',
			noShopping: false,
			pageIndex: 1,
			currentPage: 1,
			pageSize: 16,
			loadMoreCon: false,
			totalPage: '',
			keywords: '',
			searchTypeIndex: 0,
			pullup: true, // 是否开启上拉刷新
      showBackTop: false, // 是否显示返回顶部
      showHot:true,

      showSpecBox:false, //规格弹窗
      detailData:{} //详情数据
		}
	},
	created() {
		this.getHotSearchKeyword()
		this._getLoginState()
		this.listenScroll = true
		this.probeType = 3 //1 会截流,只有在滚动结束的时候派发一个 scroll 事件。
						   //2 在手指 move 的时候也会实时派发 scroll 事件，不会截流。
						   //3 除了手指 move 的时候派发scroll事件，在 swipe（手指迅速滑动一小段距离）的情况下，列表会有一个长距离的滚动动画，这个滚动的动画过程中也会实时派发滚动事件
	},
	methods: {
    watchText:function(){
      console.log(this.keyword);
      if(this.keyword == '' || this.keyword == null){
        this.showHot = true
        this.searchResult = ''
      }else {
        this.showHot = false
      }
    },
		searchOnSubmit: function () {
      if(this.keyword !== ''){
        this._getNormalSearchDatas()
      }else{
				this.$toast('关键字不能为空')
      }
		},
		searchTarget: function (item) {
			this.currentPage = 1
			this.keyword = item
			this._getNormalSearchDatas()
		},
		searchMore: function(){
			if(this.currentPage < this.totalPage){
				this.currentPage += 1
				var _this = this
				var currentPage = this.currentPage
				var pageSize = this.pageSize
				var keyword = this.keyword
				if(this.searchTypeIndex == 0){
					getNormalSearchDatas(currentPage, pageSize, keyword,2).then((res) => {
						_this.searchResult = res.code
						res.obj.goodsList.forEach( item => {
							_this.goodsList.push(item)
						})
					})
				} else {
					getJxcSearchList(currentPage, pageSize, keyword).then((res) => {
						_this.searchResult = res.code
						res.obj.goodsList.forEach( item => {
							_this.goodsList.push(item)
						})
					})
				}

			}
		},
		backToTop: function(){
			this.$refs.searchList.scroll.scrollTo(0, 0, 500)
		},
		showBackButton: function(pos){
			pos.y > -2000 ? this.showBackTop = false : this.showBackTop = true
		},
		gotoGoodsDetail: function (item) {
			if (this.isJxcGoodsList) {
				this.$router.push({
					name: 'jxcGoodsDetail',
					query: {
						goodsid: item.id,
					}
				})
			} else {
				this.$router.push({
					name: 'goodsdetail',
					query: {
						goodsid: item.id,
					}
				})
			}

		},
		_getLoginState: function () {
			getLoginState().then(res => {
				if (res.code != 406) {
					this.jxcAllowed = res.obj.jxcAllowed
				} else {
					this.jxcAllowed = 1
				}
			})
		},
		getHotSearchKeyword: function () {
			getIndexInfo().then((res) => {
				this.hotSearchKeywords = res.keywords
			})
		},
		_getNormalSearchDatas: function () {
			const _this = this

			this.showActivity = true
			this.$toast.loading({
				duration: 0,
				forbidClick: true,
				message: '正在搜索'
			})
			var currentPage = this.currentPage
			var pageSize = this.pageSize
			var keyword = this.keyword

			getNormalSearchDatas(currentPage, pageSize, keyword,2).then((res) => {
        this.$toast.clear()
				_this.searchResult = res.code
				if (haveData(res)) {
					_this.noShopping = false
					_this.goodsList = res.obj.goodsList
          _this.totalPage = res.obj.totalPage
				} else {
					_this.goodsList = []
					_this.noShopping = true
				}
			})
		},
		_getJxcSearchList: function () {
			const _this = this

			this.showActivity = false
			this.$toast.loading({
				duration: true,
				forbidClick: true,
				message: '正在搜索'
			})
			var currentPage = this.currentPage
			var pageSize = this.pageSize
			var keyword = this.keyword
			getJxcSearchList(currentPage, pageSize, keyword).then((res) => {
				this.$toast.clear()
				_this.searchResult = res.code
				if (haveData(res)) {
					this.noShopping = false

					res.obj.goodsList.forEach(item => {
						item.activity = {}
						item.activity.discount = ''
						item.activity.givePresent = ''
						item.activity.reducePostage = ''
					})

					_this.goodsList = res.obj.goodsList
					_this.totalPage = res.obj.totalPage
				} else {
					_this.goodsList = []
					this.noShopping = true
				}
			})
    },
    handleShowSpecBox(data){
      this.detailData = data;
      this.showSpecBox = true;
    },
    closeSpecBox(){
      this.showSpecBox = false;
    }
	}

}

</script>

<style lang="less" scoped>
@red: #f0415f;
@main: #b22a32;
.search {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	padding-top: .9rem;
  height: 100%;
  background: #EEEEEE;
	.search-main {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 20;
		padding: .1rem;
		background-color: #fff;
		box-shadow: 0 .02rem .04rem #aaa;
		.search-form {
      width: 85%;
      margin: 0 auto;
      background-color: #fff;
      position: relative;
			.search-input {
        display: block;
        width: 100%;
				height: .32rem;
        line-height: .32rem;
        text-align: center;
        font-size: .14rem;
				border: .01rem solid #E1E1E1;
        border-radius: .16rem;
        padding:0 .36rem 0 .26rem;
        box-sizing: border-box;
				-webkit-appearance: none;
				&:focus {
					outline: none;
				}
			}
			.search-but {
        position: absolute;
        right: .1rem;
        top: 50%;
        margin-top: -.13rem;
        width: .26rem;
				height: .26rem;
        border: none;
        outline: none;
        background: url('../../common/images/newIndex/search2.png') no-repeat;
        background-size: .26rem .26rem;
				-webkit-appearance: none;
			}
		}
		.search-screen {
			height: .24rem;
			ul li {
				margin-top: .1rem;
				line-height: .24rem;
				float: left;
				font-size: .14rem;
				display: block;
				padding: 0px .1rem;
				background-color: #f0f0f0;
				margin-right: .1rem;
				border-radius: .04rem;
				color: #666;
			}
			.active {
				background-color: #1fbba6;
				color: #e4fffb;
			}
		}
	}
	.hot-search {
		// background-color: #fff;
		// margin-top: 10px;
		z-index: 101;
		.hot-s-title {
			display: block;
      width: 100%;
      text-align: center;
			font-size: .16rem;
      margin-bottom: .1rem;
		}
		.hot-s-li {
			width: 100%;
			display: block;
			text-align: center;
			font-size: .14rem;
			line-height: .44rem;
			color: #FF773A;
		}
	}
	.search-result {
		position: fixed;
		top: .6rem;
		bottom: 0;
		left: 0;
		right: 0;
		.yjyl-shop-item {
			background-color: #fff;
			width: 100%;
			height: 100%;
		}
		.item-ul {
			margin-top: .04rem;
			.title {
				background-color: #fff;
			}
		}
		.item-ul li {
			background-color: #fff;
			float: left;
			overflow: hidden;
			width: 46%;
			padding: 1%;
			margin: 1%;
		}
		.similar-product-img {
			width: 100%;
			height: 0;
			padding-bottom: 100%;
		}
		.similar-product-img img {
			width: 100%;
		}
		.similar-product-activity {
			font-size: .12rem;
			color: #fff; // display: inline-block;
			line-height: .16rem;
			span {
				padding: .02rem .04rem;
				border-radius: .02rem;
				background-color: #25b4b0;
				margin-right: .04rem;
			}
		}
		.similar-product-title {
			color: #000;
			display: block;
			font-size: .13rem;
			height: .33rem;
			line-height: .17rem;
			overflow: hidden;
			margin-top: .05rem;
			margin-bottom: .03rem;
			padding: 0 .04rem;
		}
		.similar-product-price {
			color: #f23030;
			font-size: .17rem;
			display: block;
			padding: 0 .04rem;
			position: relative;
			top: .01rem;
			height: .25rem;
			line-height: .25rem;
			text-align: center;
		}
	}
}
.nogoods{
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  img{
    width: 1.2rem;
    height: 1.2rem;
    margin-top: .56rem;
  }
  p{
    width: 1.2rem;
    font-size: .14rem;
    color: #999999;
  }
}

.me-more {
	overflow: hidden;
	width: 100%;
	height: .5rem;
	line-height: .5rem;
	background-color: #fff;
	span {
		display: block;
		text-align: center;
		line-height: .5rem;
		color: #007aff;
	}
}
</style>
