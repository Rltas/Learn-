<template>
  <div class="shop-card">
    <div class="page-container" :style="noShpping?'':'padding-bottom: 110px;'">
      <!-- 商铺列表 -->
      <div class="shop-list" v-for="(list,k2) in data" :key='k2'>

        <div class="shop-name vux-1px-b" v-if="list.validCount > 0">
          <img src="../../common/images/newIndex/cart_shop.png" alt="">
          <span>{{list.supplierName}}</span>
        </div>
        <!-- 购物车商品列表 -->
        <div class="card-list" v-for="(item,index) in list.goodsList" :key="index">
          <div class="card-item" v-if="item.goodsStatus == 0">

            <div class="item-left">
              <input type="checkbox" class="ui-checkbox" v-model="item.state">
            </div>

            <div class="item-right">
              <div class="order-list" ref="foodsWrapper">
                <ul>
                  <li class="list-detail" ref="orderList">
                    <div>
                      <div class="list-item">
                        <!-- 商品 -->
                        <div class="goods-list">
                          <div class="goods-img" @click="gotoDetail(item.goodsId)">
                            <img width="80" height="80" v-lazy="item.url" alt="...">
                          </div>
                          <div class="content vux-1px-b">
                            <div class="content-top">
                              <span class="name">{{item.name}}</span>
                              <div class="goods-standard">
                                <div class="cc-left">
                                  <span v-for="(spec,i) in item.specMap" :key="i">【{{spec.value}}】</span>
                                </div>
                              </div>
                            </div>
                            <div class="goods-action">
                              <!-- 价格 -->
                              <div class="total-price"> <span class="color-price">¥{{item.unitPrice}}</span></div>
                              <!-- 数量操作 -->
                              <div class="amount">
                                <span class="vm-minus" @click.stop="calcNum(-1,item)"
                                  :style=" item.num == 1 || item.num == item.startNum? 'color:#E1E1E1' : 'color:#FF773A'">-</span>
                                <input class="vm-quantity" type="number" v-model="item.num" @blur='handleBlur(item)'>
                                <span class="vm-plus" @click.stop="calcNum(1,item)">+</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <!-- 删除操作 -->
                        <div class="del" @click="remove(item)"></div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 失效商品列表 -->
      <div class="shop-list">
        <span class="shop-name" style="border: none" v-if="loseData.length > 0">
          失效商品
          <span @click="clearLoseData" style="float: right; padding: 0 10px; color: #999">清除全部失效商品</span>
        </span>
        <!-- 商品列表 -->
        <div class="card-list" v-for="(item,index) in loseData" :key="index">
          <div class="card-item" v-if="item.goodsStatus == 1">

            <div class="item-right">
              <div class="order-list" ref="foodsWrapper">
                <ul>
                  <li class="list-detail" ref="orderList">
                    <div>
                      <div class="list-item">
                        <!-- 商品 -->
                        <div class="goods-list">

                          <div class="goods-img lose-img">
                            <span class="lose-text">
                              失效
                            </span>
                            <img width="80" height="80" v-lazy="item.url" alt="...">
                          </div>

                          <div class="content vux-1px-b">
                            <div class="content-top">
                              <span class="name">{{item.name}}</span>
                              <div class="goods-standard">
                                <div class="cc-left">
                                  <span v-for="(spec,sp) in item.specMap" :key="sp">【{{spec.value}}】</span>
                                </div>
                              </div>
                            </div>
                            <div class="goods-action">
                              <!-- 价格 -->
                              <div class="total-price"> <span class="color-price">¥{{item.unitPrice}}</span></div>
                              <!-- 数量操作 -->
                            </div>
                          </div>

                        </div>
                        <!-- 删除操作 -->
                        <div class="del" @click="remove(item)"></div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 购物车没有商品 -->
      <div v-show="noShpping">
        <span class="default-hint">购物车还没有商品</span>
      </div>
    </div>

    <!-- 未登录提示 -->
    <div v-show="noLogin" class="nologin-box">
      <img class="nologin-pic" src="../../common/images/newIndex/empty_car.png" />
      <span class="default-hint">登录后才可以使用此功能哦</span>
      <div class="nologin-button" @click="startLogin()">
        立即登录
      </div>
    </div>

    <!-- 购物车底部 -->
    <div v-show="!noLogin" class="card-bottom vux-1px-t">
      <div class="cb card-left">
        <input type="checkbox" id="allCheck" class="ui-checkbox" v-model="allChecked">
        <label for="allCheck" class="label-all">全选</label>
      </div>
      <div class="cb card-middle">
        <div class="total-price">合计：<span class="price">¥{{totalPrice}}</span></div>
      </div>
      <div class="cb card-right">
        <a @click="goPay">去结算</a>
      </div>
    </div>

    <!-- 提示 -->


  </div>
</template>

<script>
  import {
    mapGetters,
    mapMutations
  } from 'vuex'
  import {
    baseUrl
  } from 'api/config'
  import router from '../../router/index'
  import {
    getNormalGoodsDetail,
    getShareParmars,
    getWxToken
  } from "api/getData";

  export default {
    data() {
      return {
        show: false,
        nowIndex: -100,
        data: [],
        storeId: '',
        loseData: [], //失效商品列表
        loseDataID: [], //失效商品ID
        noShpping: false,
        noLogin: false,
        obj: ''
      }
    },
    created() {
      this.api.post("getLoginState").then(res => {
        this.setUserInfo(res)
        if (res.code == '406') {
          this.noLogin = true
        } else {
          this._getShoppingCartData()
        }
      })
      var token = this.getQueryString("token");
      if (token) {
        getWxToken();
      }
    },
    computed: {
      allChecked: {
        get: function () {
          var a = 0
          this.data.forEach((item, index) => {
            item.goodsList.forEach(item => {
              if (item.goodsStatus == 0) a++
            })
          })
          return this.checkedCount == a
        },
        set: function (value) {
          this.data.forEach(item => {
            item.goodsList.forEach(item2 => {
              if (item2.goodsStatus == 0) item2.state = value
            })
          })
          return value
        }
      },
      checkedCount: {
        get: function () {
          var i = 0
          this.data.forEach(item => {
            item.goodsList.forEach(item2 => {
              if (item2.state == true && item2.goodsStatus == 0) i++
            })
          })
          return i
        }
      },
      ...mapGetters([
        'userInfo'
      ]),
      // 计算总价
      totalPrice() {
        let price = 0
        this.data.forEach(item => {
          item.goodsList.forEach(item2 => {
            if (item2.state == true) {
              price += item2.unitPrice * item2.num
            }
          })
        })
        return price.toFixed(2)
      },
    },
    methods: {
      gotoDetail: function (id) {
        this.$router.push({
          name: 'goodsdetail',
          query: {
            goodsid: id
          }
        })
      },
      getCase() {
        this.api.post("getLoginState").then(res => {
          this.userStateCode = res.code;
          this.setUserInfo(res)
        })
      },
      _getShoppingCartData: function () {
        this.$toast.loading({
          duration: 0,
          forbidClick: true,
          message: '正在加载'
        })
        this.api.post('getShoppingCartData', {
          seq: 2
        }).then(res => {
          this.$toast.clear()
          if (res.obj == '' || res.obj == null) {
            this.obj = res.obj;
            this.noShpping = true
          }
          res.obj.forEach(item => {
            item.goodsList.forEach(item2 => {
              item2.state = false
            })
          })
          // 正式数据
          this.data = res.obj
          this.storeId = res.obj[0].storeId

          // 将失效商品和ID加入数组
          this.loseData = [];
          this.loseDataID = [];
          this.data.forEach(item => {
            let validCount = 0 //有效商品数量
            item.goodsList.forEach((item, index) => {
              if (item.goodsStatus == 1) {
                this.loseData.push(item)
                this.loseDataID.push(item.goodCartId)
              } else {
                if (validCount == 0) validCount += 1
              }
            })
            item.validCount = validCount
          })
          // 价格处理
          this.data.forEach(item => {
            item.goodsList.forEach(item => {
              item.unitPrice = (Number(item.unitPrice) * Number(item.activity.discount)).toFixed(2)
              item.itemPrice = (item.unitPrice * item.num).toFixed(2)
            })
          })
        })
      },
      // 数量增减计算
      calcNum: function (step, obj) {
        if (step == -1) {
          if (obj.startNum == 0) {
            if (obj.num <= 1) {
              obj.num = 1
            } else {
              obj.num = parseInt(obj.num) - 1;
            }
          } else {
            if (obj.num <= obj.startNum) {
              obj.num = Number(obj.startNum);
            } else {
              obj.num = parseInt(obj.num) - 1;
            }
          }
        } else {
          obj.num = parseInt(obj.num) + 1;
        }
        obj.itemPrice = (obj.unitPrice * obj.num).toFixed(2)
        obj.num.toFixed(0)
      },
      handleBlur(item) {
        if (item.startNum == 0) {
          if (item.num > 0) {
            item.num = parseInt(item.num);
          } else {
            item.num = 1;
          }
        } else {
          if (item.num > item.startNum) {
            item.num = parseInt(item.num);
          } else {
            item.num = item.startNum;
          }
        }
      },
      delItem: function () {
        this.show = true;
      },
      // 从购物车删除商品
      remove: function (item) {
        this.delItem = item
        this.$dialog.confirm({
          title: '提示',
          message: '是否从购物车移除该商品'
        }).then(() => {
          this.onConfirm()
        })
      },
      startLogin: function () {
        // window.location.href = `${baseUrl}/user/login.htm?url=${baseUrl}/wap/index.htm%23`
        let backUrl = window.location.hash.substring(2);
        window.location.href = `${baseUrl}/shop/weChat_login_api.htm?url=${backUrl}&type=2`;
      },
      // 确定删除
      onConfirm: function () {
        this.$toast.loading({
          duration: 0,
          forbidClick: true,
          message: '正在移除购物车'
        })
        var _this = this
        this.api.post('removeGoodsInCart', {
          'ids': _this.delItem.goodCartId,
          'store_id': _this.delItem.storeId
        }).then(res => {
          this.$toast.clear()
          _this._getShoppingCartData()
          // window.location.reload()
        })

      },
      goPay: function () {
        var goods = []
        // 获取选中的数据
        var goodsInfos = this.data
        //筛选数据
        for (var i = 0; i < this.data.length; i++) {
          this.data[i].goodsList.forEach((item, index) => {
            if (item.state) {
              item.supplierName = this.data[i].supplierName
              goods.push(JSON.stringify(item))
            }
          })
        }
        if (goods.length > 0) {
          localStorage.setItem("goods", goods)
          this.$router.push({
            path: 'shoppingcar-pay',
            query: {
              isBuyNow: 'false'
            }
          })
        } else {
          this.$dialog.alert({
            title: '提示',
            message: '没有选择商品'
          })
        }

      },

      // 清除购物车失效商品
      clearLoseData: function () {
        // 用逗号分割失效商品
        var loseData = ''
        loseData = this.loseDataID.join(',')
        this.$toast.loading({
          duration: 0,
          forbidClick: true,
          message: '正在移除失效商品'
        })
        var _this = this
        this.api.post('removeGoodsInCart', {
          'ids': loseData,
          'store_id': _this.storeId
        }).then(res => {
          this.$toast.clear()
          window.location.reload()
        })
      },
      ...mapMutations({
        setUserInfo: 'SET_USER_INFO',
        setToken: 'SET_TOKEN',
        refreshToken: 'REFRESH_TOKEN'
      })
    },

  }
</script>

<style lang="less" scoped>
  //未登录提示
  .nologin-box {
    position: fixed;
    top: 0;
    width: 100%;
    bottom: .5rem;
    z-index: 99;
    background: #fff;
    text-align: center;

    .nologin-pic {
      width: 2rem;
      height: 2rem;
      margin-top: .7rem;
      margin-bottom: .4rem;
    }

    .nologin-button {
      width: 50%;
      padding-top: .1rem;
      margin: auto;
      color: #FF773A;
      font-size: .16rem;
    }
  }

  .ui-checkbox {
    position: absolute;
    left: .05rem;
    top: 50%;
    margin-top: -.1rem;
    width: .2rem;
    height: .2rem;
    border-width: 0;
    background: url('../../common/images/newIndex/check.png') no-repeat;
    background-size: .2rem .2rem;
    margin-right: .05rem
  }

  .ui-checkbox:checked {
    background: url('../../common/images/newIndex/checked.png') no-repeat;
    background-size: .2rem .2rem;
  }

  .ui-checkbox+span {
    margin-left: .2rem;
    vertical-align: middle
  }

  input[type=checkbox] {
    vertical-align: middle;
    outline: 0;
    color: #424242;
    -webkit-appearance: none;
    -webkit-user-select: text;
  }

  .shop-card {
    width: 100%;
    position: fixed;
    top: 0;
    bottom: .5rem;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    .page-container {
      width: 100%;
      position: fixed;
      top: 0;
      bottom: .5rem;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      padding-bottom: .56rem;
    }

    .shop-list {
      margin-bottom: .1rem;
      background-color: #fff;

      .shop-name {
        display: flex;
        align-items: center;
        line-height: .4rem;
        margin: 0 .16rem;

        img {
          width: .16rem;
          height: .16rem;
        }

        span {
          font-size: .12rem;
          margin-left: .1rem;
        }
      }
    }

    .card-list {

      // margin-bottom: 10px;
      .card-item {
        background-color: #fff;
        overflow: hidden;
        display: flex;

        .item-left {
          flex: 0 0 .35rem;
          width: .35rem;
          overflow: hidden;
          position: relative;

          input {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          }
        }

        .item-right {
          flex: 1;
          overflow: hidden;

          .order-list {
            flex: 1;

            .list-detail {
              list-style: none;

              .list-item {
                overflow: hidden;
                margin: .08rem 0 0 .1rem;
                padding-right: .1rem;
                position: relative;

                .goods-list {
                  display: flex;

                  .goods-img {
                    flex: 0 0 .8rem;
                    width: .8rem;
                    margin-right: .1rem;
                    overflow: hidden;

                    img {
                      border-radius: .05rem;
                    }
                  }

                  .lose-img {
                    position: relative;

                    .lose-text {
                      position: absolute;
                      width: .8rem;
                      height: .8rem;
                      text-align: center;
                      line-height: .8rem;
                      background-color: rgba(0, 0, 0, .4);
                      color: #fff;
                    }
                  }

                  .content {
                    flex: 1;

                    .content-top {
                      padding-right: .6rem;

                      .name {
                        display: block;
                        overflow: hidden;
                        margin: .2rem 0 0;
                        height: .34rem;
                        line-height: .18rem;
                        font-size: .14rem;
                        color: rgb(7, 17, 27);
                      }

                      .goods-standard {
                        margin-top: .15rem;
                        color: #999;
                        font-size: .12rem;
                        line-height: .22rem;
                        display: inline-block;
                        width: 100%;

                        .cc-left {
                          float: left;
                        }
                      }
                    }

                    .goods-action {
                      display: flex;
                      justify-content: space-between;
                      padding-bottom: .1rem;
                      align-items: center;

                      .total-price {
                        .color-price {
                          font-size: .14rem;
                          color: #E20404;
                        }
                      }

                      .amount {
                        position: relative;
                        height: .2rem;
                        width: .9rem;
                        border: .01rem solid #E1E1E1;
                        overflow: hidden;

                        span {
                          position: absolute;
                          top: 0;
                          width: .2rem;
                          height: .2rem;
                          line-height: .2rem;
                          font-size: .2rem;
                          text-align: center;
                          color: #E1E1E1;
                          background: #F9F9F9;
                        }

                        .vm-minus {
                          left: 0;
                          color: #FF773A;
                        }

                        .vm-quantity {
                          position: absolute;
                          top: 0;
                          left: .2rem;
                          width: .5rem;
                          height: .2rem;
                          padding: 0;
                          line-height: .2rem;
                          font-size: .14rem;
                          border: none;
                          color: #333;
                          text-align: center;
                          background: #fff;
                          outline: none;
                        }

                        .vm-plus {
                          right: 0;
                          color: #FF773A;
                          border-left: .01rem solid #e5e5e5;
                        }

                        input {
                          -webkit-appearance: none;
                          border: none;
                          text-align: center;
                          width: .34rem;
                          vertical-align: top;
                          font-size: .15rem;
                          color: #232326;
                        }
                      }
                    }
                  }
                }

                .del {
                  position: absolute;
                  right: .1rem;
                  top: .12rem;
                  width: .16rem;
                  height: .16rem;
                  background: url('../../common/images/newIndex/delete.png') no-repeat;
                  background-size: .16rem .16rem;
                }
              }
            }
          }
        }
      }
    }

    .card-list:last-child .content {
      position: relative;
      top: 1px;
    }

    .card-bottom {
      position: fixed;
      bottom: .5rem;
      height: .5rem;
      width: 100%;
      background-color: #fff;
      padding-left: .15rem;
      color: #666666;
      font-size: .14rem;
      box-sizing: border-box;
      z-index: 100;

      .cb {
        float: left;
        line-height: .5rem;
      }

      .card-left {
        margin-right: .24rem;

        .label-all {
          margin-left: .2rem;
        }
      }

      .card-middle {
        .total-price {
          font-weight: 500;
          line-height: .5rem;

          .price {
            color: #E20404;
          }
        }

        .trans-price {
          font-size: .14rem;
        }
      }

      .card-right {
        float: right;
        width: .98rem;
        background-color: #FF773A;
        padding-right: .1rem;

        a {
          display: inline-block;
          width: 100%;
          color: #fff;
          text-align: center;
        }
      }
    }
  }
</style>