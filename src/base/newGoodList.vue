<template>
  <div class="shopping-list">
    <div class="item-ul">
      <ul>
        <li v-for="(goods,index) in goodsData" :key="index">
          <a>
            <div class="similar-product">
              <div class="similar-product-img" @click="openDetail(goods.id)">
                <img v-lazy="goods.url">
              </div>
              <div class="similar-product-content">
                <span class="similar-product-title" v-html="goods.name">
                  {{goods.name}}
                </span>
                <div class="product-content-price">
                  <div>
                    <span v-if="goods.activity?goods.activity.isBargain == 'true':false" class="similar-product-price">
                      ￥{{Number(goods.activity.bargainPrice).toFixed(2)}}
                    </span>
                    <span v-else-if="goods.activity?goods.activity.isNewGoods == 'true':false"
                      class="similar-product-price">
                      ￥{{Number(goods.specPrice[0].price).toFixed(2)}}
                    </span>
                    <span v-else class="similar-product-price">
                      ￥{{Number(goods.price).toFixed(2)}}
                    </span>
                  </div>
                  <div class="schocking-price" v-if="isBargain">
                    <span>￥{{goods.specPrice[0].oldprice || goods.specPrice[0].price}}</span>
                  </div>
                </div>
                <div class="icon-box">
                  <div class="badge">
                    <span v-show="goods.activity?goods.activity.isBargain == 'true':false">特价</span>
                    <span v-show="goods.activity?goods.activity.isNewGoods == 'true':false">新品</span>
                  </div>
                  <div class="car-icon" @click.stop="handleToCar(goods)">
                    <img src="../common/images/newIndex/car_icon.png" alt="">
                  </div>
                </div>
              </div>
            </div>
          </a>
        </li>
      </ul>
    </div>
    <div v-if="showLoadMore" style="text-align: center">
      <van-loading size="24px">加载中...</van-loading>
    </div>
  </div>

</template>

<script>
  import {
    mapGetters,
    mapMutations
  } from "vuex";
  import {
    baseUrl
  } from "api/config";

  export default {
    props: {
      goodsData: {
        type: Array,
        default: []
      },
      isBargain: {
        type: Boolean,
        default: false
      },
      isNewGoods: {
        type: Boolean,
        default: false
      },
      showLoadMore: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        goodsDataList: this.goodsData,
        userStateCode: '', // 登录状态码
        showChooseSpecCard: false,
      }
    },
    methods: {
      ...mapMutations({
        setUserInfo: 'SET_USER_INFO',
        setToken: 'SET_TOKEN',
        refreshToken: 'REFRESH_TOKEN'
      }),
      openDetail: function (id) {
        this.$router.push({
          name: 'goodsdetail',
          query: {
            goodsid: id
          }
        })
      },
      closeGoodsDetail: function (e) {
        if (e) this.open = false
      },
      handleToCar(goods) {
        this.api.post("getLoginState").then(res => {
          this.setUserInfo(res)
          if (res.code == 200) {
            localStorage.setItem('userDeposit', res.obj.user.userDeposit);
            let goodsId = goods.id;
            this.api.post("getGoodsDetail", {
              id: goodsId
            }).then(res1 => {
              if (res.obj.user.storeId == res1.obj.storeId) {
                this.$toast('不能购买自己的商品')
              } else {
                this.$parent.handleShowSpecBox(res1.obj);
              }
            })
          } else {
            let backUrl = window.location.hash.substring(2);
            window.location.href = `${baseUrl}/shop/weChat_login_api.htm?url=${backUrl}&type=2`
          }
        })
      }
    }
  };
</script>

<style lang="less" scoped>
  .showlist-enter-active,
  .showlist-leave-active {
    transition: all 0.3s;
    transform: translateY(0);
  }

  .showlist-enter,
  .showlist-leave-active {
    opacity: 0;
    transform: translateY(0);
  }

  .shop-standard {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 200;
    background-color: rgba(0, 0, 0, 0.4);
  }

  .shopping-list {
    .item-ul {
      overflow: hidden;

      .title {
        background-color: #fff;
      }
    }

    .item-ul ul {
      overflow: hidden;
      display: flex;
      flex-wrap: wrap;
    }

    .item-ul li {
      background-color: #fff;
      // float: left;
      overflow: hidden;
      width: 48%;
      margin: 1%;
      position: relative;
      border-radius: 0.05rem;
    }

    .icon-box {
      display: flex;
      justify-content: space-between;
      padding: 0 0.08rem;
    }

    .badge {
      display: block;
      height: 0.18rem;
      line-height: 0.18rem;

      span {
        display: inline-block;
        width: 0.3rem;
        height: 0.13rem;
        border: 0.01rem solid #E20404;
        border-radius: 0.05rem;
        font-size: 0.12rem;
        color: #E20404;
        text-align: center;
        line-height: 0.13rem;
      }
    }

    .car-icon {
      width: 0.2rem;
      height: 0.2rem;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .similar-product-content {
      padding: 0.1rem 0 0.08rem;
      background: #fff;
      box-sizing: border-box;
    }

    .product-content-price {
      overflow: hidden;
      display: flex;
      justify-content: space-between;
      padding: 0 .08rem;

      .similar-product-price {
        width: 100%;
        display: block;
        text-align: center;
        color: #f0415f;
        font-size: .12rem;
      }

      .schocking-price {
        font-size: .12rem;
        color: #999999;
        text-decoration: line-through;
        white-space: nowrap;
      }
    }

    .similar-product-img {
      width: 100%;
      height: 0;
      padding-bottom: 100%;
      overflow: hidden;
    }

    .similar-product-img img {
      width: 100%;
    }

    .similar-product-title {
      color: #000;
      display: block;
      font-size: .12rem;
      height: .17rem;
      line-height: .17rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      margin-bottom: .05rem;
      padding: 0 .08rem;
      text-align: left;
    }
  }
</style>
