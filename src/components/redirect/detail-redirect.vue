<template>
<div>
  <p style="text-align:center; margin-top:2rem">载入中.....</p>
</div>
</template>
<script>
import { baseUrl } from '../../api/config';
import { mapMutations } from "vuex"
export default {
  data() {
    return {
      orderid: '',
    }
  },
  // beforeRouteEnter (to, from, next) {
  //   next(vm => vm.setData())
  // },
  created() {
    // this.orderid = this.$route.query.id;
    // if(this.orderid){
    //   localStorage.setItem("orderId",this.orderid);
    //   this.setData()
    // }  
    this.getId().then(res => {
      this.orderid = res;
      localStorage.setItem("orderId",this.orderid);
    }).then(() => {
      this.setData()
    })
  },
  methods: {
    setData(){
      this.api.post('getLoginState').then( res => {
        this.setUserInfo(res);
        this.orderid = localStorage.getItem('orderId');
        if(res.code == '200') {
          this.$router.push({
            path: '/order-detail',
            query: { id: this.orderid}
          })
        }else{
          let backUrl = window.location.hash.substring(2);
          window.location.href = `${baseUrl}/shop/weChat_login_api.htm?url=order-detail?id=${this.orderid}&type=2`;
        }
      })
    },
    getId() {
      return new Promise((resolve, reject) => {
        if (this.$route.query.id) {
          resolve(this.$route.query.id)
        } else {
          reject('未找到id')
        }
      })
    },
    ...mapMutations({
      setUserInfo: 'SET_USER_INFO'
    })
  }
}
</script>

