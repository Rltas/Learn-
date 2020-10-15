<template>
  <div class="distribution-center">
    <div class="header-box">
      <div class="distribution-title">
        <ul>
          <li class="li-text">
            <span>待结算</span>
            <div class="money-box">
              <span>￥{{Number(dataObj.waitProfit).toFixed(2)}}</span>
            </div>
          </li>
          <li>
            <span></span>
            <div class="line"></div>
          </li>
          <li class="li-text">
            <span>可提现</span>
            <div class="money-box">
              <span>￥{{Number(dataObj.canProfit).toFixed(2)}}</span>
            </div>
          </li>
          <li>
            <span></span>
            <div class="line"></div>
          </li>
          <li class="li-text">
            <span>已提现</span>
            <div class="money-box">
              <span>￥{{Number(dataObj.haveProfit).toFixed(2)}}</span>
            </div>
          </li>
        </ul>
        <div class="operation">
          <span>收货7天后可提现</span>
          <van-button type="default" @click="handleTakeMoney">立即提现</van-button>
          <span>￥{{Number(dataObj.ongoingSubmit).toFixed(2)}} 申请中</span>
        </div>
      </div>
      <tab>
        <tab-item selected @on-item-click="onItemClick(0)">收益明细</tab-item>
        <tab-item @on-item-click="onItemClick(1)">提现记录</tab-item>
      </tab>
    </div>
    <div class="content-list">
      <scroll
        style="over-flow: hidden; height: 100%"
        :data="dataList"
        @scrollToEnd="loadMore"
        :probe-type="3"
        :pullup="true"
        ref="dataList"
      >
        <ul class="returns-detailed" v-if="tabActive==0">
          <li v-for="(item,index) in dataList" :key="index">
            <div class="left">
              <span :style="item.status==3 && 'color:#999;'">￥{{Number(item.profit).toFixed(2)}}</span>
              <span>{{item.status | formatStatus}}</span>
            </div>
            <div class="right">
              <p><span style="white-space:nowrap;">订单号:</span>{{item.orderno}}</p>
              <p>金额：￥{{Number(item.totalPrice).toFixed(2)}}</p>
              <p>用户 {{item.payuser | formatUser}} 支付于 {{item.paytime | formatTime}}</p>
            </div>
          </li>
        </ul>
        <ul class="take-money" v-if="tabActive==1">
          <li v-for="(item,index) in dataList" :key="index" @click="handleToDetail(item)">
            <div class="left">
              <p class="gray">申请时间：{{item.time}}</p>
              <p>金额：￥{{item.totalPrice}}</p>
            </div>
            <div class="right">
              <p :style="item.status==0 && 'color:#59D850'">状态：{{item.status | formatStatus1}}</p>
              <p class="gray">提现方式：{{item.payType | formatPayType}}</p>
            </div>
            <div class="right-arrow">
              <img src="../../common/images/newIndex/right.png" alt="">
            </div>
          </li>
          <div style="width:100%;text-align: center;">
            <van-loading size="24px" v-if="showLoadMore">正在加载</van-loading>
          </div>
        </ul>
      </scroll>
    </div>
  </div>
</template>
<script>
import { Tab, TabItem } from 'vux';
import Scroll from 'base/newScroll';
export default {
  components: {
    Tab,
    TabItem,
    Scroll
  },
  data(){
    return {
      dataObj:{
        ongoingSubmit:0,//申请中
        canProfit:0, //可提现
        haveProfit:0, //已提现
        waitProfit:0 //待结算
      }, //提现数据
      tabActive:0,
      dataList:[],//显示列表
      currentPage:1, //当前页
      totalPage:2, //总条数
      showLoadMore:false
    }
  },
  created(){
    this.getEarningsList(); //获取收益列表
  },
  filters: {
    formatStatus(val){
      if(val ==0){
        return "待结算";
      }else if(val==1){
        return "可提现";
      }else if(val==2){
        return "申请中";
      }else if(val==3){
        return "已提现";
      }
    },
    formatStatus1(val){
      if(val ==0){
        return "申请中";
      }else if(val==1){
        return "已提现";
      }
    },
    formatPayType(val){
      if(val ==1){
        return "支付宝";
      }else if(val==2){
        return "微信";
      }
    },
    formatUser(val){
      if(val.length>5){
        return val.slice(0,5)+'**';
      }else{
        return val;
      }
    },
    formatTime(val){
      return /\d{4}-\d{1,2}-\d{1,2}/g.exec(val)[0];
    }
  },
  methods: {
    getEarningsList(){
      let p = {
        pageSize:10,
        currentPage:this.currentPage
      }
      this.api.post('earningsList',p).then(res=>{
        if(res.code==200){
          this.dataObj = res.obj;
          this.showLoadMore = false;
          if(res.obj.profitList){
            this.dataList.push(...res.obj.profitList);
            this.totalPage = res.obj.rows;
          }
        }
      })
    },
    getRecordList(){
      let p ={
        pageSize:10,
        currentPage:this.currentPage
      }
      this.api.post('recordList',p).then(res=>{
        this.showLoadMore = false;
        if(res.code==200 && res.obj.recordList){
          this.dataList.push(...res.obj.recordList);
          this.totalPage = res.obj.rows;
        }
      })
    },
    onItemClick(val){
      this.tabActive = val;
      this.currentPage =1;
      this.totalPage = 0;
      this.dataList =[];
      if(this.tabActive ==0){
        this.getEarningsList();
      }else{
        this.getRecordList();
      }
    },
    handleToDetail(item){
      this.$router.push({
        path:'/takeMoneyDetail',
        query:{
          detailData:JSON.stringify(item),
          id:item.id
        }
      });
    },
    //提现
    handleTakeMoney(){
      this.$toast.loading({
        duration: 0,
        forbidClick: true,
        message: '加载中'
      })
      setTimeout(()=>{
        this.$toast.clear()
        if(this.dataObj.canProfit ==0){
          this.$toast('金额为0不能体现')
          return;
        }
        localStorage.setItem('depositMoney',this.dataObj.canProfit);
        this.$router.push('/withdrawDeposit');
      },500)
    },
    //滚动加载
    loadMore() {
      if(this.dataList.length < this.totalPage) {
        this.showLoadMore = true;
        this.currentPage ++;
        if(this.tabActive ==0){
          this.getEarningsList();
        }else{
          this.getRecordList();
        }
			}
    },
  }
}
</script>
<style lang="less" scoped>
  .distribution-center{
    width: 100%;
    .header-box{
      width: 100%;
      position: fixed;
      top: 0;
      left: 0;
      .distribution-title{
        background:linear-gradient(168deg,rgba(255,170,58,1) 0%,rgba(255,119,58,1) 100%);
        border-radius:.05rem;
        margin: .08rem;
        height: 1.8rem;
        box-sizing: border-box;
        padding: .2rem .15rem .1rem;
        ul{
          display: flex;
          margin-bottom: .32rem;
          align-items: center;
          li{
            display: flex;
            flex-direction: column;
            align-items: center;
            >span{
              display: inline-block;
              height: .15rem;
              font-size: .12rem;
              color: #fff;
              margin-bottom: .1rem;
            }
            .money-box{
              width: 100%;
              height: .6rem;
              text-align: center;
              line-height: .6rem;
              background:rgba(255,255,255,1);
              border-radius:.1rem;
              overflow: hidden;
              span{
                color: #FF773A;
                font-size: .16rem;
                font-weight:400;
              }
            }
            .line{
              width: 0;
              height: .5rem;
              border-right: .01rem solid #fff;
              margin: 0 6px;
            }
          }
          .li-text{
            width: 33.333%;
          }
        }
        .operation{
          display: flex;
          justify-content: space-between;
          align-items: center;
          span{
            font-size: .12rem;
            color: #fff;
          }
          .van-button--default{
            width: .8rem;
            height: .32rem;
            background:linear-gradient(180deg,rgba(255,255,255,1) 0%,rgba(213,213,213,1) 100%);
            color: #FF773A;
            font-size: .12rem;
            outline: none;
          }
        }
      }
      .vux-tab .vux-tab-item.vux-tab-selected{
        color: #FF773A !important;
        border-bottom:.02rem solid #FF773A !important;
      }
    }
    .content-list{
      width: 100%;
      position: fixed;
      top: 2.36rem;
      bottom: 0;
      overflow: hidden;
      // overflow: auto;
      //收益明细
      .returns-detailed{
        padding: .1rem .07rem;
        background: #eee;
        li{
          background: #fff;
          border-radius: .06rem;
          padding: .17rem 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: .1rem;
          .left{
            display: flex;
            min-width: 1.1rem;
            flex-direction: column;
            align-items: center;
            border-right: .01rem solid #CCCCCC;
            box-sizing: border-box;
            span:nth-child(1){
              color: #59D850;
              font-size: .24rem;
              font-weight: bold;
              white-space: nowrap;
            }
            span:nth-child(2){
              font-size: .12rem;
              color: #999999;
            }
          }
          .right{
            flex: 1;
            overflow: hidden;
            min-height: .65rem;
            padding: 0 .1rem 0 .08rem;
            font-size: .12rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            p:nth-child(odd){
              color: #999999;
            }
          }
        }
      }
      //提现明细
      .take-money{
        padding: .1rem .07rem;
        background: #eee;
        li{
          background: #fff;
          border-radius: .06rem;
          margin-bottom: .1rem;
          padding: .1rem .47rem .1rem .12rem;
          display: flex;
          position: relative;
          font-size: .12rem;
          .left,.right{
            p:first-child{
              margin-bottom: .08rem;
            }
            .gray{
              color: #999999;
            }
          }
          .right{
            text-align: right;
          }
          .right-arrow{
            width: .18rem;
            height: .18rem;
            position: absolute;
            right: .1rem;
            top: 50%;
            transform: translate(0,-50%);
            img{
              width: 100%;
              height: 100%;
            }
          }
        }
      }
      .load-more{
        width: 100%;
      }
    }
  }
</style>


