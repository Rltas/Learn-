<template>
  <div style="width:100%;">
    <p style="text-align:center;color:#999;line-height:.24rem">长按保存图片</p>
    <img :src="imgUrl" alt="">
  </div>
</template>
<script>
export default {
  created(){
    this.imgUrl = localStorage.getItem('canvasImg');
  },
  data(){
    return {
      imgUrl:''
    }
  }
}
</script>
<style lang="less" scoped>
  img{
    width: 100%;
  }
</style>


