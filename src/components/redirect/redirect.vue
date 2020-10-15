<template>
<div>
  <p style="text-align:center; margin-top:2rem">载入中.....</p>
</div>
</template>
<script>
export default {
  data() {
    return {
      goodsid: '',
      isIntegral: false,
      userId:'',
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => vm.setData(from.name))
  },
  created() {
    this.goodsid = this.$route.query.goodsid;
    this.userId = this.$route.query.userId;
    this.isIntegral = this.$route.query.integral_;
  },
  methods: {
    setData(url){
      if(this.goodsid){
          this.$router.push({
          	name: 'goodsdetail',
            query: { goodsid: this.goodsid, integral_: this.isIntegral,userId:this.userId, isShareShow:0}
          })
      }else{
        this.$router.push({
          name: 'home',
          query: { isShareShow:0 }
        })
      }
    }
  }
}
</script>

