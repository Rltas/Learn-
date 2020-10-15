<template>
  <div class="comment-list">
    <scroll
			style="over-flow: hidden; height: 100%"
			:data="commentData"
			@scrollToEnd="loadMore"
			:listen-scroll="listenScroll"
			:probe-type="probeType"
			:pullup="pullup"
			@scroll="showBackButton"
			ref="dataList"
		>
      <div class="box">
        <div class="assess-flat vux-1px-b" v-for="(item,index) in commentData" :key="index">
          <div class="assess-wrapper">
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
      <!--没有评论-->
      <div v-show="showNoData">
        <span class="default-hint">暂无评论</span>
      </div>
    </scroll>
    <!-- 返回顶部 -->
		<back-top v-show="showBackTop"  @click.native="backToTop"></back-top>
  </div>
</template>
<script>
import Scroll from 'base/scroll';
import BackTop from 'base/backTop'
export default {
  components:{
    Scroll,
    BackTop
  },
  data(){
    return{
      goodsId:'', //商品id
      currentPage: 1, // 当前页
      totalPage: 1, // 总页数
      commentData: [], // 评论数据
      pullup: true, // 开启上拉加载
      listenScroll:true,
      probeType:3,
			showBackTop: false, //是否显示返回顶部
      showNoData: false,
    }
  },
  created(){
    this.goodsId = this.$route.query.goodsId;
    this.getCommentList(); //获取评论数据
  },
  methods:{
    getCommentList(){
      let data ={
        goods_id:this.goodsId,
        currentPage:this.currentPage
      }
      this.api.post('getGoodsEvaluation',data).then(res=>{
        if(res.message == '暂无数据'){
          this.showNoData = true;
        }else{
          this.showNoData = false;
          this.totalPage = res.obj.totalPage;
          this.commentData.push(...res.obj.evaluateList);
        }
      })
    },
    loadMore(){
			if(this.currentPage < this.totalPage) {
				this.currentPage ++;
				this.getCommentList();
			}
    },
    showBackButton: function(pos){
			pos.y > -2000 ? this.showBackTop = false : this.showBackTop = true;
    },
    backToTop: function(){
			this.$refs.dataList.scroll.scrollTo(0, 0, 500);
		}
  }
}
</script>
<style lang="less" scoped>
  .comment-list{
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: #fff;
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
  }
</style>

