<template>
	<div class="classify">
		<!-- <x-header class="vux-1px-b" :left-options="{showBack:false}"></x-header> -->

      <!-- 搜索栏 -->
    <div class="top-head" ref="topHead">
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
		<scroll
			style="over-flow: hidden; height: 100%"
			:data="data"
      @scrollToEnd="loadMore"
			:listen-scroll="listenScroll"
			:probe-type="probeType"
			:pullup="pullup"
			@scroll="showBackButton"
			ref="dataList"
		>
      <div>

        <!-- 商品列表 -->
        <div class="container">
          <img  class="banner-img" src="/inter-static/img/help_home_banner01.png" alt="">

          <good-list :goodsData="data"></good-list>
        </div>
        <!-- 没有数据提示 -->
        <no-data v-show="showNoData" tip="该商品分类没有数据 :("></no-data>

      </div>

		</scroll>

	</div>
</template>

<script>
import { XHeader } from 'vux'
import Scroll from 'base/scroll'
import GoodList from 'base/goodList'
import BackToTop from 'base/backTop'
import NoData from 'base/noData'
import { getLoginState, getIndexInfo } from "api/getData"
import { isWeixin, getQueryString } from "js/mixin"
export default {
	components: {
		XHeader,
		Scroll,
		GoodList,
		NoData
	},
	data() {
		return {
			currentPage: 1, // 当前页
			totalPage: 1, // 总页数
			id: '', // 分类id
			data: [], // 商品数据
			pullup: true, // 开启上拉加载
			showBackTop: false, //是否显示返回顶部
      showNoData: false,
      gc_id: "", //商品类（GoddsClass）id
		}
	},
	created() {
		this.id = this.getQueryString('id')
		this.listenScroll = true
    this.probeType = 3
    this.orgid = getQueryString("orgid")
    // 地区areaId
    this.areaId = getQueryString("areaId");
    this._getIndexInfo(this.orgid)
  },
	methods: {
    goToSearch: function() {
      this.$router.push("/search")
    },
		showBackButton: function(pos){
			pos.y > -2000 ? this.showBackTop = false : this.showBackTop = true
		},
		backToTop: function(){
			this.$refs.dataList.scroll.scrollTo(0, 0, 500)
    },
    _getIndexInfo: function(id) {
      const _this = this
      _this.data = [];
      getIndexInfo(id).then(res => {
        const me = _this;
        this.gc_id = res.menuList[0].resList[0].secList[me.areaId-1].urlId
        me._getStoreGoodsList(this.gc_id);
      })
    },
		_getStoreGoodsList: function() {
      const _this = this
			this.api.post('getStoreGoodsList', {
        currentPage: _this.currentPage,
				gc_id: this.gc_id
			}).then( res => {
				if(!res.obj.goodsList) {
					_this.showNoData = true
					return
				}

				_this.data.push(...res.obj.goodsList)
				_this.totalPage = res.obj.totalPage
			})
    },
    loadMore: function() {
			if(this.currentPage < this.totalPage) {
				this.currentPage ++
				this._getStoreGoodsList()
			}
		}
	}
}
</script>

<style lang="less" scoped>
  .top-head {
    background-color: rgba(0, 0, 0, 0);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    height: .6rem;
    .seach-head {
      display: -webkit-box;
      display: -webkit-flex;
      display: -moz-flex;
      display: -ms-flexbox;
      display: flex;
      -webkit-flex-flow: row nowrap;
      -moz-flex-flow: row nowrap;
      -ms-flex-flow: row nowrap;
      flex-flow: row nowrap;
      -webkit-box-align: center;
      -ms-flex-align: center;
      -webkit-align-items: center;
      -moz-align-items: center;
      align-items: center;
      padding: .08rem .15rem;

      .logo {
        width: .8rem;
        height: .2rem;
        background-image: url(../../common/images/logo.png);
        display: inline-block;
        margin-right: .1rem;
        background-size: cover;
        background-position: center;
      }
      .back {
        display: inline-block;
        margin-right: .1rem;
        width: .34rem;
        height: .34rem;
        border-radius: .17rem;
        background-color: rgba(0, 0, 0, 0.3);
        color: #fff;
        text-align: center;
        line-height: .34rem;
      }
      .search-input {
        flex-grow: 1;
        display: -webkit-box;
        display: -webkit-flex;
        display: -moz-flex;
        display: -ms-flexbox;
        display: flex;
        -webkit-flex-flow: row nowrap;
        -moz-flex-flow: row nowrap;
        -ms-flex-flow: row nowrap;
        flex-flow: row nowrap;
        -webkit-box-align: center;
        -ms-flex-align: center;
        -webkit-align-items: center;
        -moz-align-items: center;
        align-items: center;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        -webkit-justify-content: center;
        -moz-justify-content: center;
        justify-content: center;
        height: .34rem;
        font-size: .14rem;
        background-color: #fff;
        border-radius: .17rem;
        box-shadow: .02rem .04rem .1rem rgba(0, 0, 0, 0.1);
        border: .01rem solid #e9e9e9;
        .icon {
          vertical-align: middle;
          margin-right: .05rem;
          display: inline-block;
          align-items: center;
          font-size: .17rem;
          line-height: 1;
          color: #666;
        }
        .placeholder {
          color: #666;
        }
      }
      .search-ico {
        margin-left: .06rem;
        width: .34rem;
        text-align: center;
        height: .34rem;
        font-size: .14rem;
        background-color: #fff;
        border-radius: .17rem;
        box-shadow: .02rem .04rem .1rem rgba(0, 0, 0, 0.1);
        border: .01rem solid #e9e9e9;
        .icon {
          vertical-align: middle;
          display: inline-block;
          align-items: center;
          font-size: .2rem;
          line-height: .34rem;
          color: #666;
        }
      }
    }
  }
	.classify {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #f0f4f5;
		.container {
			
		}
	}
</style>
