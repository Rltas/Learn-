<template>
  <div id="scan">
    <div v-if="goodsDetails || goodsList.length != 0">
      <div class="header-title">
        <div class="title-img">
          <img src="../../common/images/newIndex/scan/home.png" alt="">
          <p>{{storeTitle}}</p>
        </div>
        <div class="service-scope" @click="toService">
          {{businessScope}}
        </div>
      </div>
      <div v-if="goodsList.length != 0" class="has-goods">
        <div class="tab-nav">
          <p v-for="(item, index) in navList" :key="index" :class="{'nav-active': currentIndex == index}"
            @click="changeTab(index)">
            {{item}}
          </p>
        </div>
        <div class="space-line"></div>
        <div class="service-select" v-show="currentIndex == 0">
          <div class="list-content">
            <div id="left">
              <ul>
                <li :class="{'left-active': leftActive == index}" :id="'left_' + index"
                  v-for="(item, index) in goodsList" :key="index" @click="changeLeftActive(index)">
                  {{item.className}}
                </li>
              </ul>
            </div>
            <div id="right_all">             
              <ul style="transition:500ms" v-for="(item, index) in goodsList" :id="'right_'+index" :key="index">
                  <div class="title">{{item.className}}</div>
                  <li v-for="(list, key) in item.goods" :key="key">
                    <div class="img-left">
                      <img :src="list.url" alt="">
                    </div>
                    <div class="list-right">
                      <p class="title-goods">{{list.goodsName}}</p>
                      <p class="intro">{{list.detail}}</p>
                      <div class="handle-bottom">
                        <p class="price">￥{{list.nowPrice}}</p>
                        <div class="handle-right">
                          <van-icon name="plus" v-if="list.count == 0" @click="addSelectList(list)" />
                          <van-stepper v-model="list.count" min="0" integer v-else async-change />
                        </div>
                      </div>
                    </div>
                  </li>
              </ul>
            </div>
          </div>
          <footer>
            <div class="right">
              <van-icon name="shopping-cart-o" :badge="selectList.length" @click="toCart" />
              <span class="price">￥{{totalPrice}}</span>
            </div>
            <button :disabled="selectList.length == 0" @click="toCart">确定</button>
          </footer>
          <van-popup v-model="showCart" position="bottom">
            <div class="popup-content">
              <header>
                <div class="left" @click="emptyCart">
                  <img src="../../common/images/newIndex/scan/delete.png" alt="">
                  <span>清空</span>
                </div>
                <div class="mid-title">
                  购物车
                </div>
                <img src="../../common/images/newIndex/scan/cha.png" alt="" @click="closeCart">
              </header>
              <div class="cartList-contain">
                <div class="cartList-details" v-for="(item, index) in selectList" :key="index">
                  <div class="details-img">
                    <img :src="item.url" alt="">
                  </div>
                  <div class="cart-info">
                    <p class="goos-name">{{item.goodsName}}</p>
                    <p class="price">￥{{item.nowPrice}}</p>
                  </div>
                  <van-stepper v-model="item.count" min="0" integer async-change />
                </div>
              </div>
              <div class="footer">
                <div class="right">
                  <van-icon name="shopping-cart-o" :badge="selectList.length" />
                  <span class="price">￥{{totalPrice}}</span>
                </div>
                <button :disabled="selectList.length == 0" @click="submitExchange(0)">确定</button>
              </div>
            </div>
          </van-popup>
        </div>
        <div class="self-exchange" v-show="currentIndex == 1">
          <div class="num-content-exchange">
            <van-field v-model.trim="countNum" placeholder="请输入消费点数" type="digit" :formatter="formatter"
              maxlength="8" />
          </div>
          <button class="self-btn" :disabled="countNum == 0 || countNum == ''" @click="submitExchange(1)">确定</button>
        </div>
      </div>
      <div v-else class="no-goods">
        <div class="space-line"></div>
        <div class="num-content">
          <van-field v-model.trim="countNum" placeholder="请输入消费点数" type="digit" :formatter="formatter" maxlength="8" />
        </div>
        <button :disabled="countNum == 0 || countNum == ''" @click="submitExchange(1)">确定</button>
      </div>
    </div>
    <van-empty description="商品有误" v-else />
    <van-dialog v-model="showConfirm" title="温馨提示" show-cancel-button @confirm="confirmSubmit">
      <p class="submit-popup-info"><label>商&nbsp;&nbsp;&nbsp;&nbsp;家：</label><span>{{storeTitle}}</span></p>
      <p class="submit-popup-info"><label>幸运值：</label><span class="price">{{luckMoney}}</span></p>
    </van-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        navList: ['服务项目', '自助兑换'],
        currentIndex: 0,
        goodsList: [],
        countNum: '',
        id: '',
        leftActive: 0,
        selectList: [], //选中的商品
        showCart: false,
        specId: [],
        goodsDetails: '',
        businessScope: '',
        storeTitle: '',
        showConfirm: false,
        confirmType: '',
        luckMoney: ''
      }
    },
    created() {
      // this.id = this.$route.query.supplierid ? this.$route.query.supplierid : 763;
      this.id = this.$route.query.supplierid ? this.$route.query.supplierid : localStorage.getItem('outLineId');
      this.getOutLineGoodsList();
      this.getlineDetails();
      this.getSupplierDetail();
   
    },
    updated() {
      if (document.querySelector('#right_all')) {
        document.querySelector('#right_all').addEventListener('scroll', this.scrollEvent, false);
      }
    },
    destroyed() {
      if (document.querySelector('#right_all')) {
        document.querySelector('#right_all').removeEventListener('scroll', this.scrollEvent, false);
      }
    },
    computed: {
      totalPrice() {
        let total = 0;
        this.selectList.map((item, index) => {
          total += item.count * item.nowPrice;
        });
        return this.$numShow(total);
      }
    },
    watch: {
      selectList: {
        handler(val) {
          val.map((item, index) => {
            if (item.count == 0) {
              val.splice(index, 1);
            }
          });
          if (val.length == 0) {
            this.showCart = false;
            this.goodsList.map(list => {
              list.goods.map(good => good.count = 0);
            });
          }
        },
        deep: true,
        immediate: true
      }
    },
    methods: {
      formatter(val) {
        return val.replace(/\-/, '');
      },
      toService() {
        if (this.businessScope.length >= 58) {
          this.$dialog.alert({
            title: '详细信息',
            message: this.businessScope
          });
        } else {
          return
        }

      },
      changeTab(index) {
        this.currentIndex = index;
      },
      getOutLineGoodsList() {
        let data = {
          supplierid: this.id
        };
        this.api.post('getOutLineGoodList', data).then(res => {
          if (res.code == 200) {
            this.goodsList = res.obj;
            this.goodsList.map((item, index) => {
              item.goods.map((list, key) => {
                this.$set(list, 'nowPrice', '');
                this.$set(list, 'specId', []);
                this.$set(list, 'count', 0);
                list.specBeans.map((citem, cindex) => {
                  list.specId.push(citem.properties[0].key);
                });
                let id = JSON.parse(JSON.stringify(list.specId)).sort().join("_") + "_";
                list.specPrice.map((pitem, pindex) => {
                  if (pitem.id == id) {
                    list.nowPrice = this.$numShow(pitem.price);
                  }
                });
              });
            });
          }
        });
      },
      getlineDetails() {
        let data = {
          supplierid: this.id
        }
        this.api.post('getOutlinescan', data).then(res => {
          if (res.code == 200) {
            this.goodsDetails = res.obj;
            if (this.goodsDetails) {
              this.goodsDetails.specBeans.map((item, index) => {
                this.specId.push(item.properties[0].key);
              });
            }
          }
        })
      },
      getSupplierDetail() {
        let data = {
          supplierid: this.id
        }
        this.api.post('getSupplierDetail', data).then(res => {
          let {
            obj
          } = res;
          this.storeTitle = obj.supplierName;
          this.businessScope = obj.supplierContent;
        })
      },
      changeLeftActive(index) {
        this.leftActive = index;
        let height = document.getElementById('right_all').getBoundingClientRect().height;
        let minHeight = document.querySelector('#right_all li').offsetHeight;
        let top = document.getElementById('right_all').scrollTop;
        let titleTop = document.querySelector('#right_all .title').offsetHeight;
        let total = 0;
        this.goodsList.map((item, id) => {
          if (id > index) return;
          total += Number(item.goods.length);
        });
        if (index == 0) {
          document.getElementById('right_all').scrollTop = 0;
        } else {
          let allHeight = 0;
          for(let i = 0 ; i < index; i++) {
            allHeight += document.querySelector('#right_'+i).offsetHeight;
          }
          document.getElementById('right_all').scrollTop = allHeight;
        }
      },
      scrollEvent() {
        let height = document.getElementById('right_all').getBoundingClientRect().height;
        let minHeight = document.querySelector('#right_all li').offsetHeight;
        let top = document.getElementById('right_all').scrollTop >= 0 ? document.getElementById('right_all').scrollTop : 0;
        let titleTop = document.querySelector('#right_all .title').offsetHeight;
        let allUl = document.querySelectorAll('#right_all ul');
        let allLi = document.querySelectorAll('#right_all li');
        let diffVal = titleTop * allUl.length / allLi.length; //阈值
        let num = Math.floor((top + height) / (minHeight + diffVal) - 1);
        if (num < 0) {
          num = 0;
        } else if (num <= allLi.length - 1) {
          num = num;
        } else {
          num = allLi.length - 1;
        }
        let id;
        if (allLi[num] && allLi[num].parentNode.id) {
          id = Number(allLi[num].parentNode.id.replace('right_', ''));
        }
        this.leftActive = id;
        let left = document.getElementById('left').offsetHeight;
        let minHeights = document.querySelector('#left li').offsetHeight;
        document.getElementById('left').scrollTop = minHeights * id - left > 0 ? minHeights * id - left + 56 : 0;
      },
      addSelectList(item) {
        item.count = 1;
        this.selectList.push(item);
      },
      toCart() {
        if (this.selectList.length == 0) return;
        this.showCart = true;
      },
      emptyCart() {
        this.$dialog.confirm({
          title: '温馨提示',
          message: '是否清空购物车？'
        }).then(() => {
          this.selectList = [];
        });
      },
      closeCart() {
        this.showCart = false;
      },
      submitExchange(val) {
        this.confirmType = val;
        this.luckMoney = val == 0 ? this.totalPrice : this.countNum;
        this.showConfirm = true;
      },
      confirmSubmit() {
        let storeInfo = [{
          storeId: this.goodsDetails.storeid,
          supplierId: this.goodsDetails.supplierid,
          bill_type: 0,
          goods: []
        }];
        if (this.confirmType == 0) {
          this.selectList.map((item, index) => {
            storeInfo[0].goods.push({
              goodsid: item.goodsid,
              specPropertyIds: item.specId.join(','),
              count: item.count
            });
          });
        } else {
          storeInfo[0].goods = [{
            goodsid: this.goodsDetails.goodsid,
            specPropertyIds: this.specId.join(','),
            count: this.countNum
          }];
        }
        let data = {
          seq: 2,
          storeInfo: JSON.stringify(storeInfo)
        }
        this.$toast.loading({
          duration: 0,
          forbidClick: true,
          message: '正在提交',
          overlay: true
        });
        this.api.post('submitOrderOutline', data).then(res => {
          this.$toast.clear();
          if (res.code == 200) {
            if (res.obj.realpay == 0) {
              this.$toast.loading({
                duration: 500,
                forbidClick: true,
                message: '支付成功',
                overlay: true
              });
              setTimeout(() => {
                this.$router.push({
                  path: '/outLineSuccess',
                  query: {
                    id: res.obj.id
                  }
                });
              }, 500);
            } else {
              this.$toast('您的幸运值不足！');
            }
          } else {
            this.$toast(res.message);
          }
        });
      }
    }
  }
</script>

<style lang="less" scoped>
  @import url('./scan.less');
</style>

<style lang="less">
  #scan {

    .van-stepper__minus,
    .van-stepper__plus {
      width: .2rem;
      height: .2rem;
    }

    .van-stepper__input {
      width: .3rem;
      height: .2rem;
      margin: 0 .02rem;
    }

    .van-stepper__plus {
      background: #FF8B58;
      color: #fff;
    }
  }
</style>
