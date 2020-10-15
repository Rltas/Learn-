<template>
  <div class="shopping-list">
      <div class="item-ul">
      <divider v-show="divider" style="background-color: #f0f4f5"><strong>{{divider}}</strong></divider>
      <ul>
          <li v-for="(goods,index) in goodsData" :key="index">
                <a @click="openDetail(goods.id)">
                  <div class="similar-product">
                      <div class="badge" v-show="goods.activity?goods.activity.isBargain == 'true':false">
                        <img src="../common/images/tejia.png" alt="">
                      </div>
                      <div class="badge" v-show="goods.activity?goods.activity.isNewGoods == 'true':false">
                        <img src="../common/images/shangxin.png" alt="">
                      </div>
                      <div class="similar-product-img">
                          <img v-lazy="goods.url">
                      </div>
                      <span class="similar-product-title" v-html="goods.name">
                          {{goods.name}}
                      </span>

                      <div v-if="!isIntegral && !isBargain" style="text-align: center; line-height: 20px;height:20px;">
                          <span class="comment" v-show="goods.activity != null && goods.activity != ''">
                              <span v-show="goods.activity.reducePostage">
                                  满{{goods.activity.reducePostage}}包邮
                              </span>
                              <span v-show="goods.activity.discount && goods.activity.discount != '1'">
                                  折
                              </span>
                              <span v-show="goods.activity.givePresent">
                                  赠
                              </span>
                          </span>
                      </div>
                      <div class="product-content-price" v-if="isBargain">
                        <span>商城价：{{goods.specPrice[0].price}}</span>
                        <span>市场价：{{goods.specPrice[0].oldprice || goods.specPrice[0].price}}</span>
                      </div>


                      <div>
                          <span v-if="isIntegral" class="similar-product-price">
                              {{goods.price}}积分
                          </span>
                          <span v-else-if="goods.activity?goods.activity.isBargain == 'true':false" class="similar-product-price">
                              ¥{{Number(goods.activity.bargainPrice).toFixed(2)}}
                          </span>
                          <span v-else-if="goods.activity?goods.activity.isNewGoods == 'true':false" class="similar-product-price">
                              ¥{{Number(goods.specPrice[0].price).toFixed(2)}}
                          </span>
                          <span v-else class="similar-product-price">
                              ¥{{Number(goods.price).toFixed(2)}}
                          </span>

                          <!-- <span v-if="goods.supplierName" class="similar-product-shopname">
                              {{goods.supplierName}}
                          </span> -->
                      </div>
                  </div>
                </a>
          </li>
      </ul>
    </div>
  </div>

</template>

<script>
import { Divider } from "vux"
export default {
  props: {
    goodsData: {
      type: Array,
      default: []
    },
    divider: {
      type: String,
      default: ""
    },
    isIntegral: {
      type: Boolean,
      default: false
    },
    isBargain:{
      type:Boolean,
      default:false
    },
    isNewGoods:{
      type:Boolean,
      default:false
    }
  },
  components: {
    Divider
  },
  data() {
    return {
      goodsDataList:this.goodsData
    }
  },
  methods: {
    openDetail: function(id) {
      if(this.isIntegral) {
        this.$router.push({
          name:'goodsdetail',
          query: {
            goodsid: id,
            integral_: true
          }
        })
      } else {
        this.$router.push({
          name:'goodsdetail',
          query:{goodsid: id}
        })
      }

    },
    closeGoodsDetail: function(e) {
      if(e) this.open = false
    }
  }
};
</script>

<style lang="less">
.shopping-list {
  .item-ul {
    overflow: hidden;
    border-bottom: .08rem solid #f0f4f5;
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
    position: relative;
  }

  .badge{
    width:28%;
    position:absolute;
    right:0;
    top:0;
    img{
      width:100%;
    }
  }
  .product-content-price{
    overflow: hidden;
    line-height: .2rem;
    display:flex;
    justify-content: space-between;
    span{
      font-size:.12rem;
      color:#A1A1A1;
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
    font-size: .13rem;
    height: .17rem;
    line-height: .17rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-top: .05rem;
    margin-bottom: .03rem;
    padding: 0 .04rem;
    text-align: center;
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
  .comment {
    max-width: 100%;
    margin-top: .16667rem;
    font-size: .12rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #999;
  }

  .similar-product-price {
    width: 100%;
    display: block;
    text-align: center;
    color: #f0415f;
    font-size: .17rem;
    height: .25rem;
    line-height: .25rem;
  }

  .similar-product-shopname {
    float: right;
    color: #999;
    font-size: .12rem;
    padding: 0 .04rem;
    height: .25rem;
    line-height: .25rem;
  }
}
</style>
