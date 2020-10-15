<template>
  <div id="coupon" ref="coupon">
    <header>
      <ul>
        <li v-for="(item, index) in tabList" :key="index">
          <span :class="{'tab-active': activeIndex == index}" @click="changeTab(index)">{{item}}</span>
        </li>
      </ul>
    </header>

    <div class="coupon-container" v-if="couponList.length != 0">
      <div class="coupon-details" v-for="(item, index) in couponList" :key="index" @click="toPay(item)">
        <div class="content">
          <img :src="item.goodsUrl" alt="">
          <div class="use-info">
            <span class="coupon-title">{{item.name}}</span>
            <span class="use-limitTime">{{item.endTime}}</span>
            <template>
              <span class="indate" v-if="item.status == 0">立即使用</span>
              <span class="past-due" v-if="item.status == 1">已使用</span>
              <span class="been-used" v-if="item.status == 2">已过期</span>
            </template>
          </div>
        </div>
        <div class="split-line"></div>
        <div :class="['tip',{'tip-disabled': item.status != 0}]">
          <span class="flag">￥</span>
          <span :class="['price', {'small-price': item.price.toString().length >= 5}]">{{$numShow(item.price)}}</span>
          <div :class="['rotate',{'rotate-disabled': item.status != 0}]">
            <span>*</span>
            <span>优惠券</span>
            <span>*</span>
          </div>
        </div>
      </div>
      <van-loading size="24px" style="text-align: center;" v-show="loading">加载中...</van-loading>
    </div>

    <van-empty :description="desTitle" v-else />

  </div>
</template>

<script>
  export default {
    data() {
      return {
        tabList: ['未使用', '已使用', '已过期'],
        activeIndex: 0,
        couponList: [],
        loading: false,
        currentPage: 1,
        totalPage: 1,
        desTitle: ''
      }
    },

    watch: {
      activeIndex: {
        handler(val) {
          switch (val) {
            case 0:
              this.desTitle = '暂无未使用优惠券';
              break;
            case 1:
              this.desTitle = "暂无已使用优惠券";
              break;
            case 2:
              this.desTitle = "暂无已过期优惠券";
              break;
          }
        },
        immediate: true
      }
    },

    created() {
      this.getCouponList();

    },

    mounted() {
      this.$refs.coupon.addEventListener('scroll', this.loadMore, false);
    },

    destroyed() {
      if (this.$refs.coupon) {
        this.$refs.coupon.removeEventListener('scroll', this.loadMore, false);
      }
    },
    methods: {
      changeTab(index) {
        this.activeIndex = index;
        this.currentPage = 1;
        this.couponList = [];
        this.getCouponList();
      },
      toPay(item) {
        if (item.status != 0) {
          return
        } else {
          this.$storage.setCouponTitle_storage(item.name);
          this.$storage.setConponSpecId_storage(item.specid);
          this.$storage.setCouponId_storage(item.id);
          this.$router.push({
            path: '/couponPay',
            query: {
              id: item.goodsid
            }
          });
        }
      },
      getCouponList() {
        let data = {
          currentPage: this.currentPage,
          status: this.activeIndex
        }
        if (this.couponList.length == 0) {
          this.$generalTool.toastLoading();
        } else {
          this.loading = true;
        }
        this.api.post('getMyCoupon', data).then(res => {
          this.$toast.clear();
          this.loading = false;
          if (res && res.code == 200) {
            this.couponList.push(...res.obj.couponList);
            this.totalPage = res.obj.totalPage;
          }
        })
      },
      loadMore() {
        let coupon = this.$refs.coupon;
        if (coupon.offsetHeight + coupon.scrollTop >= coupon.scrollHeight - 5) {
          this.currentPage++;
          if (this.currentPage <= this.totalPage) {
            this.getCouponList();
          }
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  #coupon {
    height: 100%;

    header {
      width: 100%;
      height: .56rem;
      background: #fff;
      color: #666;
      position: fixed;
      top: 0;
      z-index: 6;

      ul {
        height: inherit;
        display: flex;

        li {
          flex: 1;
          height: .18rem;
          text-align: center;
          margin-top: .19rem;

          span {
            display: inline-block;
            height: .56rem;
            line-height: .54rem;
            box-sizing: border-box;
            margin-top: -.19rem;
          }

          .tab-active {
            border-bottom: .02rem solid #FF8B58;
            color: #FF8B58;
          }

          &:not(:last-child) {
            border-right: .01rem solid #ccc;
          }
        }
      }
    }

    .coupon-container {
      width: 100%;
      height: 100%;
      padding-top: .66rem;
      box-sizing: border-box;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;

      .coupon-details {
        width: 3.45rem;
        margin: 0 auto;
        margin-bottom: .1rem;
        background: #fff;
        height: 1rem;
        border-radius: .05rem;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .content {
          flex: 1;
          height: inherit;
          padding: .07rem .05rem .07rem .07rem;
          border-radius: .05rem 0 0 .05rem;
          display: flex;
          color: #666;

          img {
            width: .86rem;
            height: .86rem;
            margin-right: .1rem;
          }

          .use-info {
            font-size: .12rem;
            width: 1.3rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: .03rem 0 .04rem 0;
            box-sizing: border-box;

            .coupon-title {
              font-size: .14rem;
              font-weight: 600;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              overflow: hidden;
              max-height: .3rem;
            }

            .indate {
              display: inline-block;
              padding: .04rem 0;
              width: .7rem;
              text-align: center;
              border: .01rem solid #FF543D;
              color: #FF543D;
              border-radius: .12rem;
            }
          }
        }

        .tip {
          flex: 0 0 1rem;
          height: inherit;
          border-radius: 0 .05rem .05rem 0;
          background: linear-gradient(137deg, #ffb347 6%, #ff533d 97%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          position: relative;
          overflow: hidden;

          .price {
            font-size: .28rem;
            font-weight: 600;
          }

          .small-price {
            font-size: .22rem;
          }

          .rotate {
            display: flex;
            align-items: center;
            background: #FFD763;
            transform: rotate(45deg) scale(.8);
            justify-content: center;
            position: absolute;
            right: -.26rem;
            top: .08rem;
            padding: 0 .2rem;
            line-height: .12rem;
            font-size: .12rem;

            span {
              color: #FF5B3E;

              &:nth-child(1),
              &:nth-child(3) {
                line-height: .12rem;
                padding-top: .06rem;
                color: #fff;
                box-sizing: border-box;
              }

            }
          }

          .rotate-disabled {
            background: #ccc;

            span {
              color: #fff;
            }
          }
        }

        .tip-disabled {
          background: #999;
        }

        .split-line {
          position: relative;
          flex: 0 0 0;
          height: inherit;

          &::before,
          &::after {
            content: '';
            position: absolute;
            width: .1rem;
            height: .05rem;
            background: #eee;
            left: -.05rem;
            z-index: 1
          }

          &::before {
            border-radius: 0 0 .05rem .05rem;
            top: 0;
          }

          &::after {
            border-radius: .05rem .05rem 0 0;
            bottom: 0;
          }
        }
      }
    }
  }
</style>