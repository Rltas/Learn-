<template>
  <div class="take-money-detail">
    <div class="detail-title">
      <div class="left">
        <p class="gray">申请时间：{{detailData.time}}</p>
        <p>金额：￥{{detailData.totalPrice}}</p>
      </div>
      <div class="right">
        <p :style="detailData.status==0 && 'color:#59D850'">状态：{{detailData.status | formatStatus1}}</p>
        <p class="gray">提现方式：{{detailData.payType | formatPayType}}</p>
      </div>
      <div class="right-arrow" @click="goBack">
        <img src="../../common/images/newIndex/right.png" alt="">
      </div>
    </div>
    <div class="detail-list">
      <scroll style="over-flow: hidden; height: 100%" :data="detailList" @scrollToEnd="loadMore" :probe-type="3"
        :pullup="true" ref="dataList">
        <ul class="returns-detailed">
          <li v-for="(item,index) in detailList" :key="index">
            <div class="left">
              <span>￥{{Number(item.profit).toFixed(2)}}</span>
              <span>{{detailData.status | formatStatus1}}</span>
            </div>
            <div class="right">
              <p><span style="white-space:nowrap;">订单号:</span>{{item.orderno}}</p>
              <p>金额：￥{{Number(item.totalPrice).toFixed(2)}}</p>
              <p>用户 {{item.payuser | formatUser}} 支付于 {{item.paytime | formatTime}}</p>
            </div>
          </li>
          <div style="width:100%;text-align: center">
            <van-loading size="24px" v-show="showLoadMore">正在加载</van-loading>
          </div>
        </ul>
      </scroll>
    </div>
  </div>
</template>
<script>
  import Scroll from 'base/newScroll';
  import {
    LoadMore
  } from "vux";
  export default {
    components: {
      Scroll,
      LoadMore
    },
    data() {
      return {
        id: '', //提现记录id
        detailData: {}, //详情数据
        currentPage: 1,
        totalPage: 0,
        detailList: [], //详情列表数据
        showLoadMore: false
      }
    },
    filters: {
      formatStatus(val) {
        if (val == 0) {
          return "待结算";
        } else if (val == 1) {
          return "可提现";
        } else if (val == 2) {
          return "申请中";
        } else if (val == 3) {
          return "已提现";
        }
      },
      formatStatus1(val) {
        if (val == 0) {
          return "申请中";
        } else if (val == 1) {
          return "已提现";
        }
      },
      formatPayType(val) {
        if (val == 1) {
          return "支付宝";
        } else if (val == 2) {
          return "微信";
        }
      },
      formatUser(val) {
        if (val.length > 5) {
          return val.slice(0, 5) + '**';
        } else {
          return val;
        }
      },
      formatTime(val) {
        return /\d{4}-\d{1,2}-\d{1,2}/g.exec(val)[0];
      }
    },
    created() {
      this.id = this.$route.query.id;
      this.detailData = JSON.parse(this.$route.query.detailData);
      this.getRecordDetail(); //获取提现详情
    },
    methods: {
      getRecordDetail() {
        let p = {
          recordid: this.id,
          currentPage: this.currentPage,
          pageSize: 10
        }
        this.api.post('recordDetail', p).then(res => {
          if (res.code == 200 && res.obj.detailList) {
            this.showLoadMore = false;
            this.detailList.push(...res.obj.detailList);
            this.totalPage = res.obj.rows;
          }
        })
      },
      goBack() {
        this.$router.go(-1);
      },
      //滚动加载
      loadMore() {
        if (this.detailList.length < this.totalPage) {
          this.showLoadMore = true;
          this.currentPage++;
          this.getRecordDetail();
        }
      },
    }
  }
</script>
<style lang="less" scoped>
  .take-money-detail {

    //提现明细
    .detail-title {
      height: .8rem;
      background: #fff;
      margin-bottom: .1rem;
      padding: .2rem .54rem .2rem .2rem;
      box-sizing: border-box;
      display: flex;
      position: relative;
      font-size: .12rem;

      .left,
      .right {
        p:first-child {
          margin-bottom: .08rem;
        }

        .gray {
          color: #999999;
        }
      }

      .right {
        text-align: right;
      }

      .right-arrow {
        width: .18rem;
        height: .18rem;
        position: absolute;
        right: .1rem;
        top: 50%;
        transform: translate(0, -50%);

        img {
          width: 100%;
          height: 100%;
        }
      }
    }

    .detail-list {
      width: 100%;
      position: fixed;
      top: .9rem;
      bottom: 0;
      overflow: scroll;

      .returns-detailed {
        padding: 0 .07rem;

        li {
          background: #fff;
          border-radius: .06rem;
          padding: .17rem 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: .1rem;

          .left {
            display: flex;
            min-width: 1.1rem;
            flex-direction: column;
            align-items: center;
            border-right: .01rem solid #CCCCCC;
            box-sizing: border-box;

            span:nth-child(1) {
              color: #59D850;
              font-size: .24rem;
              font-weight: bold;
            }

            span:nth-child(2) {
              font-size: .12rem;
              color: #999999;
            }
          }

          .right {
            flex: 1;
            min-height: .65rem;
            padding: 0 .1rem 0 .08rem;
            font-size: .12rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            p:nth-child(odd) {
              color: #999999;
            }
          }
        }
      }
    }
  }
</style>
