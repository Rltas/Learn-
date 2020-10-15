<template>
  <div class="service-argreement">
    <van-popup v-model="isShowService" class="dialog-demo" style="width:3rem" :close-on-click-overlay="false">
      <div class="popup-title">服务协议</div>
      <div class="content" v-html="content"></div>
      <div @click="closePopup">
        <span class="close-btn vux-1px-t">我知道了</span>
      </div>
    </van-popup>
  </div>
</template>
<script>
export default {
  props: ["isShowService" ,'content'],
  data() {
    return {
      
    };
  },
  created() {
    
  },
  methods: {
    closePopup() {
      this.$emit("closePopup");
    }
  }
};
</script>
<style lang="less" scoped>
.service-argreement {
  .popup-title {
    color: #000;
    width: 100%;
    height: .4rem;
    font-size: .15rem;
    font-weight: bold;
    line-height: .4rem;
    text-align: center;
    box-shadow: 0 .02rem .04rem #ccc;
  }
  .content {
    padding: .1rem;
    max-height: 3.2rem;
    font-size: .13rem;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    text-align: left;
  }
  .close-btn {
    display: block;
    width: 100%;
    height: .4rem;
    font-size: .14rem;
    line-height: .4rem;
    text-align: center;
    color: #02b6ef;
    box-shadow: .02rem 0 .04rem #ccc;
  }
}
</style>
