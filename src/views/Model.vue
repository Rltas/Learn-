<template>
  <div>
    <V :onProps.sync="msg"/>
  </div>
</template>

<script>
import V from './V.vue'
export default {
  components: {
    V
  },

  data() {
    return {
      msg: '123456'
    }
  }
}
</script>