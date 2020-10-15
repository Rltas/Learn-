<template>
  <div class="specPopup">
    <!-- 选择型号 -->
    <van-popup v-model="showChooseSpecCard" position="bottom" :close-on-click-overlay="false">
      <div class="body">
        <div class="title">
          <div class="button">请选择规格和数量</div>
        </div>

        <div class="type">
          <div class="group" v-for="(item,index) in goodsDetail.specBeans" :key="index">
            <span class="standard-item-name">{{item.name}}：</span>
            <checker v-model="item.id" @on-change="chooseSpeciflaction" class="standard-item-type"
              default-item-class="standard-item" selected-item-class="standard-item-selected">
              <checker-item :value="item.key" v-for="(item,k) in item.properties" :key="k">{{item.value}}</checker-item>
            </checker>
          </div>

          <!-- 选择数量(商品) -->
          <!-- <x-number :title="('选择数量')" button-style="round" :min="minValue" fillable v-model="numValue" @on-change="numChange"></x-number> -->
          <div class="choose-num">
            <div class="choose-num-val">
              选择数量
            </div>
            <div class="choose-num-box">
              <a @click="handleSub" class="number-selector" :class="{'selector-sub-disabled':numValue == minValue}">
                <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink" width="18" height="18">
                  <defs></defs>
                  <path
                    d="M863.74455 544.00086 163.424056 544.00086c-17.664722 0-32.00086-14.336138-32.00086-32.00086s14.336138-32.00086 32.00086-32.00086l700.320495 0c17.695686 0 31.99914 14.336138 31.99914 32.00086S881.440237 544.00086 863.74455 544.00086z">
                  </path>
                </svg>
              </a>
              <input class="number-input" v-model="numValue" pattern="[0-9]*" type="tel" @blur="handleBlur"
                @click="handleClick($event)" />
              <a @click="handleAdd" class="number-selector">
                <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink" width="20" height="20">
                  <defs></defs>
                  <path
                    d="M863.328262 481.340895l-317.344013 0.099772L545.984249 162.816826c0-17.664722-14.336138-32.00086-32.00086-32.00086s-31.99914 14.336138-31.99914 32.00086l0 318.400215-322.368714-0.17718c-0.032684 0-0.063647 0-0.096331 0-17.632039 0-31.935493 14.239806-32.00086 31.904529-0.096331 17.664722 14.208843 32.031824 31.871845 32.095471l322.59234 0.17718 0 319.167424c0 17.695686 14.336138 32.00086 31.99914 32.00086s32.00086-14.303454 32.00086-32.00086L545.982529 545.440667l317.087703-0.099772c0.063647 0 0.096331 0 0.127295 0 17.632039 0 31.935493-14.239806 32.00086-31.904529S880.960301 481.404542 863.328262 481.340895z">
                  </path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom">
        <span style="background-color:#f0f0f0; color: #03a9f4; width: 50%" @click="cancelCall">取消</span>
        <span style="width: 50%" @click="handleAddCart">加入购物车</span>
      </div>
    </van-popup>
  </div>
</template>
<script>
  import {
    Checker,
    CheckerItem,
  } from 'vux';
  export default {
    components: {
      Checker,
      CheckerItem,
    },
    data() {
      return {
        numValue: 1, //数量
        minValue: 1, //最小数量
        goodsDetail: {}, //商品详情数据
        choosedSpec: [], //选中的规格数组
        specIds: '', //选中所有规格key值的字符串，用逗号隔开
        nowPrice: '', //商品价格
        numDisabled: false, //数量加减禁用样式
      }
    },
    props: ['showChooseSpecCard', 'detailData'],
    watch: {
      detailData(newVal, oldVal) {
        if (newVal) {
          this.goodsDetail = newVal;
          this.numValue = 1; //初始化数量
          this.choosedSpec = []; //初始化规格
          //默认选中规格
          if (this.goodsDetail.specBeans.length == 1) {
            this.goodsDetail.specBeans[0].id = this.goodsDetail.specBeans[0].properties[0].key;
            this.choosedSpec.push({
              key: this.goodsDetail.specBeans[0].properties[0].key,
              value: this.goodsDetail.specBeans[0].properties[0].value
            })
            this.specIds = this.goodsDetail.specBeans[0].properties[0].key + '';
          }
          //获取商品价格
          if (this.goodsDetail.activity.isBargain == 'true') {
            this.nowPrice = this.goodsDetail.activity.bargainPrice; //惊爆价
          } else if (this.goodsDetail.activity.isNewGoods == 'true') {
            this.nowPrice = this.goodsDetail.specPrice[0].price; //新品价
          } else {
            this.nowPrice = this.goodsDetail.price; //普通价格
          }
          //获取默认数量
          if (this.goodsDetail.startNum == 0) {
            this.minValue = 1;
          } else {
            this.minValue = Number(this.goodsDetail.startNum);
            this.numValue = Number(this.goodsDetail.startNum);
          }
        }
      }
    },
    methods: {
      onClose() {
        this.$parent.closeSpecBox();
      },
      cancelCall() {
        this.onClose();
      },
      handleAddCart() {
        if (this.choosedSpec.length < this.goodsDetail.specBeans.length || this.goodsDetail.specBeans.length == 0) {
          this.$toast('请选择规格')
        } else {
          let data = {
            goodId: this.goodsDetail.id,
            price: this.nowPrice,
            count: this.numValue,
            gsp: this.specIds,
            supplierid: this.goodsDetail.supplierId,
            seq: 2, //商品属于生活商城
          }
          this.api.post("addShoppingCart", data).then(res => {
            this.$toast(res.message)
            this.onClose();
          })
        }
      },
      numChange(val) {
        if (val > this.minValue) {
          this.numValue = parseInt(val);
        } else {
          this.numValue = this.minValue;
        }
      },
      chooseSpeciflaction() {
        var ids = []; //存入规格key值
        var choosedSpec = []; //存入规格
        this.goodsDetail.specBeans.forEach(item => {
          var choosedId = item.id;
          item.properties.forEach(citem => {
            if (choosedId == citem.key) {
              choosedSpec.push({
                id: item.id,
                value: citem.value
              });
            }
          })
          if (item.id != "") {
            ids.push(item.id);
          }
        });
        this.choosedSpec = choosedSpec;
        this.specIds = ids.join(",");
      },
      //数量选择
      handleBlur() {
        if (this.numValue > this.minValue) {
          this.numValue = parseInt(this.numValue);
        } else {
          this.numValue = this.minValue;
        }
        // window.scrollTo(0,0);
        let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        $('html,body').animate({
          scrollTop: scrollTop
        }, 300);
      },
      handleClick(e) {
        let len = e.target.value.length;
        e.target.selectionStart = e.target.selectionEnd = len;
        e.target.focus();
      },
      handleAdd() {
        this.numValue++;
      },
      handleSub() {
        if (this.numValue > this.minValue) {
          this.numValue--;
        } else {
          this.numValue = this.minValue;
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  .specPopup {
    .standard-item {
      border: 0.01rem solid #ececec;
      padding: 0.05rem 0.15rem;
      border-radius: 0.04rem;
      margin-right: 0.06rem;
      margin-bottom: 0.06rem;
      font-size: 0.14rem;
    }

    .standard-item-selected {
      border: 0.01rem solid #1fbba6;
      background-color: #1fbba6;
      color: #fff;
    }

    .body {
      width: 100%;
      background-color: #fff;

      .title {
        height: 0.44rem;
        background-color: #eee;

        .button {
          display: inline-block;
          width: 100%;
          font-size: 0.16rem;
          color: #333;
          line-height: 0.44rem;
          text-align: center;
        }
      }

      .type {
        padding: 0.15rem;

        .group {
          overflow: hidden;
          margin-bottom: 0.15rem;

          .standard-item-name {
            width: 0.6rem;
            display: inline-block;
            padding: 0.05rem;
            color: #999;
            font-size: 0.14rem;
          }

          .standard-item-type {
            display: inline-block;
          }
        }
      }
    }

    .bottom {
      height: 0.54rem;
      width: 100%;
      background-color: #FF4040;
      text-align: center;
      line-height: 0.54rem;
      color: #fff;

      span {
        display: block;
        width: 50%;
        padding: 0;
        margin: 0;
        float: left;
      }
    }
  }

  //选择数量
  .choose-num {
    display: flex;
    justify-content: space-between;
    padding: 0.1rem 0.15rem;
    position: relative;
    align-items: center;

    .choose-num-box {
      display: flex;
      align-items: center;

      .number-selector {
        width: 0.2rem;
        height: 0.2rem;
        display: inline-block;
        border: 0.01rem solid #3cc51f;
        padding: 0.02rem;
        border-radius: 50%;
        color: #3cc51f;
        text-align: center;

        svg {
          fill: #3cc51f;
        }
      }

      .selector-sub-disabled {
        border-color: #ccc;

        svg {
          fill: #ccc;
        }
      }

      .number-input {
        width: 0.5rem;
        border: none;
        outline: none;
        text-align: center;
        font-size: 0.2rem;
        padding: 0.03rem 0;
        color: #666;
      }
    }
  }

  .choose-num::before {
    content: '';
    position: absolute;
    width: 100%;
    border-top: 0.01rem solid #D9D9D9;
    top: 0;
    left: 0;
    transform: scaleY(0.5);
  }
</style>
