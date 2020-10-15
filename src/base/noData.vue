<template>
  <div class="no-data">
      <div class="icon">
          <i :class="icon"></i>
      </div>
      <div class="tip">
          <span>{{tip}}</span>
      </div>
  </div>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      tip: {
        type: String,
        default: '没有数据'
      },
      icon: {
        type: String,
        default: 'ion-coffee'
      }
    }
  }
</script>

<style lang="less">
    .no-data{
        .icon {
            font-size: 1rem;
            text-align: center;
            color: #aaa;
        }
        .tip {
            text-align: center;
            font-size: 0.2rem;
            color: #aaa;
        }
    }
</style>
