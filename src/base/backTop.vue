<template>
  <div class="back-top">
    <span class="icon ion-arrow-up-b"></span>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      probeType: {
        type: Number,
        default: 1
      },
      click: {
        type: Boolean,
        default: true
      }
    }
  }
</script>

<style lang="less">
    .back-top{
        position: fixed;
        bottom: .4rem;
        right: .4rem;
        width: .56rem;
        height: .56rem;
        background-color: rgba(0,0,0,.6);
        border-radius: 50%;
        .icon {
            color: rgba(255,255,255,.9);
            display: block;
            line-height: .56rem;
            width: .56rem;
            text-align: center;
            font-size: .24rem;
        }
        
    }
</style>
