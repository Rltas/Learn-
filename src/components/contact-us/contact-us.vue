<template>
  <div id="contact_us">
      <div class="main_top">
          <div class="work-time">
            <p>客服工作时间</p>
            <p>法定工作日(9:00-18:00)</p>
          </div>
          <div class="helpline">
            <p>咨询热线</p>
            <!-- <p>座机：{{tel}}</p> -->
            <p>
            <p>手机：<a href="tel:19922836031">19922836031</a></p>
            <div class="tel">
                <a :href="'tel:'+this.tel">一键拨打</a>
            </div>
          </div>
      </div>
      <div class="main_bottom">
          <div class="remind-title">
            <img src="../../common/images/remind.png" alt="">
            <span>温馨提示：</span>
          </div>
          <div class="remind-content">
              <p>如果您对收到的货品有异议，请拍照留证后，可在渝教商城微信公众号上留言及发图，与客服联系沟通。</p>
          </div>
      </div>
  </div>
</template>
<script>
export default {
  name:"contactus",
  data(){
    return{
      tel:"19922836031"
    }
  }
}
</script>
<style lang="less" scoped>
  #contact_us{
    height:100%;
    position:fixed;
    top:0;
    left: 0;
    right:0;
    bottom:0;
    font-size:.16rem;
    font-family:Microsoft YaHei;
    background-color:rgba(242,242,242,1);
    color:#000;
    .main_top{
      height:2.38rem;
      background-color:#fff;
      margin:.12rem 0;
      padding:.32rem;
      box-sizing:border-box;
      position:relative;
      line-height: .28rem;
      .work-time{
        margin-bottom:.33rem;
      }
      .helpline .tel{
        width:.8rem;
        height:.3rem;
        background-image:url(../../common/images/tel.png);
        background-repeat: no-repeat;
        background-size:100% 100%;
        position:absolute;
        right:.32rem;
        bottom:.6rem;
        text-align: center;
        line-height:.3rem;
        a{
          width:100%;
          height:100%;
          font-size:.16rem;
          display:inline-block;
        }
      }
    }
    .main_bottom{
      height:1.78rem;
      background-color:#fff;
      padding:.32rem;
      box-sizing:border-box;
      .remind-title{
        margin-bottom:.16rem;
        line-height: .21rem;
        img{
          width:.2rem;
          height:.2rem;
          vertical-align: middle;
          margin-right:.06rem;
        }
      }
      .remind-content{
        text-indent: .32rem;
        line-height: .28rem;
      }
    }
  }
</style>


