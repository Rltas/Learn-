<template>
  <div id="coupon-pay">

    <div class="pay-header">
      <span class="header-left" @click="$router.back()"></span>
    </div>

    <div class="addr-sheet section" v-if="JSON.stringify(address) != '{}'">
      <a class="addr-txt" @click="chooseAddress">
        <p class="person orient-h"></p>
        <span class="name cell">{{address.trueName}}</span>
        <span class="phone cell">{{address.mobile}}</span>
        <p>{{address.area}}，{{address.area_info}}</p>
      </a>
    </div>

    <div class="addr-sheet section" v-else>
      <a class="addr-txt" @click="chooseAddress">
        <span style="line-height: .44rem; color: #007aff">请添加收货地址信息</span>
      </a>
    </div>

  <div class="all-goods-plate" v-if="JSON.stringify(goodsInfo) != '{}'">
      <div class="goods-details">
        <img :src="goodsInfo.url" alt="">
        <div class="goods-content">
          <div class="top">
            <span class="name">{{goodsInfo.name}}</span>
            <span class="num">x1</span>
          </div>
          <div class="mid">
            <span v-for="(item,index) in goodsInfo.specList" :key="index">【{{item}}】</span>
          </div>
          <div class="bottom">
            <span>单价：</span><span>￥{{$numShow(goodsInfo.nowPrice)}}</span>
          </div>
        </div>
      </div>

      <div class="dis-area" v-if="goodsInfo.goodsArea">
        <span class="area-title">配送区域：</span>
        <div class="area-content">
          仅 {{goodsInfo.goodsArea}}
          <img class="string-arrows" src="../../common/images/newIndex/string-arrows.png"
            v-if="goodsInfo.goodsArea.length > 15" @click="changeActive($event)"></img>
        </div>
      </div>
    </div>

    <div class="coupon-category">
      <van-cell title="优惠券" :value="couponTitle" />
    </div>

    <div class="remack-box">
      <div class="remack-title">
        订单备注
      </div>
      <div class="remack-input">
        <van-field 
          v-model="remark" 
          placeholder="请输入备注信息" 
          maxlength="150" 
          show-word-limit 
          rows="4" 
          type="textarea" />
      </div>
    </div>

    <button @click="convert_coupon" :class="['footer',{'dis-footer':btnDisabled}]" :disabled="btnDisabled">
      立即兑换
    </button>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        address: {},
        goodsInfo: {},
        couponTitle: '',
        remark: '',
        specId: '',
        btnDisabled: false
      }
    },

    created() {
      this.getAddressList();
      this.getGoodsDetail();
      this.couponTitle = this.$storage.getCouponTitle_storage();
      this.specId = this.$storage.getConponSepcId_storage();
    },

    methods: {
      getAddressList() {
        this.api.post('getAddressList').then(res => {
          this.address = res.obj.addressList[localStorage.getItem("addressIndex") || 0];
        })
      },
      getGoodsDetail() {
        this.$generalTool.toastLoading()
        let data = {
          id: this.$route.query.id
        }
        this.api.post('getGoodsDetail', data).then(res => {
          this.$toast.clear();
          this.goodsInfo = res.obj;
          this.dealNewProperty(this.goodsInfo);
        })
      },
      chooseAddress() {
        this.$router.push({
          path: '/address',
          query: {
            fromPay: true
          }
        });
      },
      changeActive(e) {
        e.currentTarget.parentElement.classList.toggle('area-content-active');
        e.currentTarget.classList.toggle('img-transform');
      },
      convert_coupon() {
        if (JSON.stringify(this.address) == '{}') {
          this.$toast('请选择收货地址')
        } else {
          this.btnDisabled = true;
          this.$generalTool.toastLoading(0, '正在提交');
          this.api.post('submitOrderCoupon', this.packageData(this.goodsInfo)).then(res => {
            this.$toast.clear();
            this.btnDisabled = false;
            if (res.code == 200) {
              this.$toast('提交成功')
              this.$router.push({
                path: '/pay-success',
                query: {
                  id: res.obj.orderNumber
                }
              });
            } else {
              this.$toast(res.message);
            }
          })
        }
      },
      dealNewProperty(data) {
        this.$set(data, 'nowPrice', 0);
        this.$set(data, 'specList', this.dealData(this.specId, data));
        data.specPrice.map((item, index) => {
          if (item.id == this.specId) {
            data.nowPrice = item.price;
          }
        });
      },
      dealData(data, data_all) {
        let result = [];
        this.dealSpecId(data).map(item => {
          data_all.specBeans.map(all => {
            all.properties.map(ele => {
              if (ele.key == item) {
                result.push(ele.value);
              }
            })
          })
        })
        return result;
      },
      dealSpecId(data) {
        data = data.split('_');
        data.pop();
        return data;
      },
      packageData(obj) {
        let data = {
          addr_id: this.address.id,
          coupon_id: this.$storage.getCouponId_storage(),
          msg: this.remark,
          seq: 2,
          storeInfo: JSON.stringify([{
            storeId: obj.storeId,
            supplierId: obj.supplierId,
            bill_type: 0,
            goods: [{
              goodsid: obj.id,
              count: 1,
              specPropertyIds: this.dealSpecId(this.specId).join(',')
            }]
          }])
        }
        return data;
      }
    }
  }
</script>

<style lang="less" scoped>
  #coupon-pay {
    height: 100%;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    padding-bottom: .56rem;
    box-sizing: border-box;

    .pay-header {
      width: 100%;
      height: .46rem;
      position: sticky;
      top: 0;
      z-index: 300;
      background: #fff;
      box-shadow: 0 0.02rem 0.04rem #eee;

      .header-left {
        position: absolute;
        left: .18rem;
        top: .14rem;
        width: .22rem;
        height: .22rem;
        background: url('../../common/images/newIndex/go_back.png') no-repeat;
        background-size: .22rem .22rem;
      }
    }

    .addr-sheet {
      display: block;
      line-height: 1.4;
      font-size: .14rem;

      &:after {
        content: "";
        display: block;
        height: .05rem;
        background-image: linear-gradient(135deg, #82c9ff .08rem, transparent .08rem, transparent .16rem, #ff8282 .16rem, #ff8282 .32rem, transparent .32rem, transparent .32rem, transparent .4rem, #82c9ff .4rem, #82c9ff);
        background-color: #fff;
        background-size: .68rem .05rem;
      }

      .addr-txt {
        position: relative;
        display: block;
        padding: .1rem .15rem;
        color: #333;

        .person {
          padding: .04rem 0 .1rem;
        }

        .cell {
          display: inline-block;
          padding-bottom: .08rem;
          width: 40%;
          font-size: .16rem;
        }

        .phone {
          float: right;
          padding-right: .1rem;
          text-align: right;
        }
      }
    }

    .section {
      margin-bottom: .1rem;
      background-color: #fff;
    }

    .all-goods-plate {
      padding: .08rem;
      background: #fff;
      box-sizing: border-box;

      .goods-details {
        display: flex;
        margin-bottom: .06rem;

        img {
          width: .8rem;
          height: .8rem;
          flex-shrink: 0;
          margin-right: .08rem;
        }

        .goods-content {
          display: flex;
          flex-direction: column;
          flex: 1;
          justify-content: space-between;
          padding: .06rem 0;

          .top {
            height: .28rem;
            position: relative;

            .name {
              width: 2.4rem;
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 2;
              overflow: hidden;
              color: #333;
            }

            .num {
              position: absolute;
              right: .02rem;
              top: .06rem;
            }
          }

          .mid {
            width: 2.4rem;
            color: #666;
            margin-bottom: .04rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;

            span {
              &:not(:last-child)::after {
                content: '、';
              }
            }
          }

          .bottom {
            span {
              &:last-child {
                color: #f04360;
              }
            }
          }
        }
      }

      .dis-area {
        position: relative;
        display: flex;
        color: #FF773A;
        margin-top: .08rem;
        font-size: .14rem;

        .area-title {
          flex-shrink: 0;
        }

        .area-content {
          margin-left: .02rem;
          height: .22rem;
          padding-right: .2rem;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;

          .string-arrows {
            position: absolute;
            right: .04rem;
            width: .2rem;
            height: .2rem;
          }

          .img-transform {
            transform: rotate(180deg);
          }
        }

        .area-content-active {
          height: auto;
          overflow: visible;
          white-space: normal;
        }
      }
    }

    .coupon-category {
      margin: .1rem 0;

      .van-cell {
        padding: .1rem .16rem;
        font-size: .14rem;
        line-height: .24rem;
      }
    }

    .remack-box {
      background: #fff;
      width: 100%;
      padding: 0 .16rem;

      .remack-title {
        background: #fff;
        padding-top: .1rem;
        color: #323232;
      }

      .remack-input {
        /deep/.van-field__value {
          border: .01rem solid #E3E3E3;
        }

        /deep/.van-field__word-limit {
          margin-right: .1rem;
        }

        /deep/.van-field__control {
          text-indent: 1em;
        }
      }
    }

    .footer {
      width: 100%;
      height: .5rem;
      background: #FF773A;
      color: #fff;
      line-height: .5rem;
      text-align: center;
      position: fixed;
      bottom: 0;
      z-index: 6;
      font-weight: 600;
      -webkit-appearance: none;
      border: none;
    }

    .dis-footer {
      background: #ccc;
    }
  }
</style>