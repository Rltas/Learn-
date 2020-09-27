<template>
  <div>
    这是一个拆分路由
  </div>
</template>

<script>
export default {
  data() {
    return {

    }
  },

  created() {
    let obj = {
      name: 'wuguang',
      age: 18,
      work: 'front-end engineer'
    }
    console.log({...obj})
    console.log((12345678/10000).toFixed(3) + '万')
  }
}
</script>