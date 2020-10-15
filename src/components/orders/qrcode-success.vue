<template>
  <div class="bind-success">
    <div class="container">
      <p class="first-child">绑定成功！</p>
      <p>关注渝教商城公众号之后，您将可以在公众号中收到新订单通知消息</p>
      <button @click="goToShop">去关注渝教商城公众号</button>
    </div>
  </div>
</template>
<script>
  import {
    baseUrl
  } from 'api/config.js'
  export default {
    data() {
      return {
        suName: '', //供货商名字
        olduser: ''
      }
    },
    created() {
      this.suName = this.$route.query.suName || '';
      if (this.suName == 'store' || this.suName == '') {
        this.suName = '渝教商城';
      };
    
      //     }
      //   }
      // });
    },
    mounted(){
        this.olduser = this.$route.query.olduser || '';
      // window.location.href = `${baseUrl}/shopping_logout.htm`
      // this.api.post('getLoginState').then(res => {
        // alert('获取用户信息')
        // if (res.code == 200) {
          // if (res.obj.user.userName) {
            let data = {
              name: this.olduser
            }
            this.api.post('down', data).then(res => {

            })
    },
    methods: {
      goToShop() {
        window.location.href =
          'https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzI4MjUyOTI5Nw==&scene=126&bizpsid=0&sharer_username=gh_f7585f44eb70&subscene=0&clicktime=1559633981#wechat_redirect';
      },
    }
  }
</script>
<style lang="less" scoped>
  .bind-success {
    position: fixed;
    height: 100%;
    width: 100%;

    .container {
      width: 80%;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;

      p {
        margin-bottom: .3rem;
        font-weight: bold;
        font-size: .16rem;
        line-height: .2rem;
      }

      .first-child {
        white-space: nowrap;
      }

      button {
        padding: .12rem .05rem;
        background: rgb(255, 64, 64);
        color: #fff;
        border-radius: .1rem;
      }
    }
  }
</style>
