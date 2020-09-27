<template>
  <div id="two">
    子组件
    <Three v-bind="$attrs" v-on="$listeners"></Three>
    <span @click="son">{{age}}</span>
    <button @click="clickBtn">{{fooAncestor}}</button>
    <input type="text" v-model="syncInfo" @input="ceshi(syncInfo)">
  </div>
</template>

<script>
  import Three from './Three.vue'
  export default {
    props: ['age', 'syncInfo'],
    inject: ['fooAncestor', 'ancestorMethod'],
    components: {
      Three
    },
    data() {
      return {
        twoMsg: '子组件的数据'
      }
    },
    mounted() {
      console.log(this.$attrs,'值')
      this.$emit()
    },
    methods: {
      son() {
        this.$emit('son')
      },
      clickBtn() {
        this.ancestorMethod();
        this.fooAncestor = '改变完毕'
      },
      ceshi(val) {
        this.$emit("update:syncInfo", val)
      }
    }
  }
</script>

<style lang="less">

</style>