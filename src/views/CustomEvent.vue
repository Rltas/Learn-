<template>
  <div id="custom-event">
    custom-event
    <CustomEvent v-bind.sync="list">
      今夜你会不会来？
    </CustomEvent>
  </div>
</template>

<script>
  import CustomEvent from 'components/CustomEvent'
  export default {
    components: {
      CustomEvent,
    },
    data() {
      return {
        list:{
          id: 1,
          name: 'Rlats'
        }
      }
    }
  }
</script>

<style lang="less">
  
</style>