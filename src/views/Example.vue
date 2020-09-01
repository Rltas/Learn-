<template>
  <div id="example">
    {{obj.name}}
  </div>
</template>

<script>
  export default {
    data() {
      return {
        obj: {
          name: 'Rltas'
        }
      }
    },
    beforeCreate() {

    },
    created() {
      // Object.freeze(this.obj);
      // setTimeout(() => {
      //   this.obj.name = 'As';
      // }, 3000);
      console.log(this.$el, '根');
    },
    beforeMount() {

    },
    activated() {

    },
    deactivated() {

    },
    mounted() {
      console.log(this.$root.$el, '根');
      console.log(this.$watch)
    },
    beforeUpdate() {

    },
    updated() {

    },
    beforeDestroy() {

    },
    destroyed() {

    },
    methods: {

    }
  }
</script>