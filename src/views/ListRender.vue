<template>
  <div id="list-render">
    list-render
    <ul>
      <li v-for="(value, name, index) in object_1" :key="index">
       {{index}} --- {{name}} --- {{value}}
      </li>
    </ul>
    <ul v-for="(set, index) in sets">
        <li v-for="n in even(set)">{{n}}</li>
    </ul>
    <ul>
      <li is="List" v-for="(value, name, index) in object_1" :item="value" :key="index"></li>
      <!-- <List v-for="(value, name, index) in object_1" :item="value" :key="index"></List> -->
    </ul>
    <List v-bind="post" @customEvent="customEvent"></List>
  </div>
</template>

<script>
import List from 'components/List'
export default {
  components: {
    List
  },
  data() {
    return {
      object_1: {
        name: 'wuguang',
        age: '27'
      },
      arr: [1,2,3],
      arr_1: [],
      sets: [[ 1, 2, 3, 4, 5 ], [6, 7, 8, 9, 10]],
      post: {
        item: '测试',
        id: '512'
      }
    }
  },
  created() {
    console.log(Object.keys(this.object_1), Object.values(this.object_1));
    this.arr_1 = this.arr.slice();
    this.arr[0] = 5;
    console.log(this.arr_1);
    console.log('  856  '.trim())
  },
  methods: {
    even(num) {
      return num.filter(n => n % 2 === 0);
    },
    customEvent() {
      console.log('自定义事件')
    }
  }
}
</script>

<style lang="less">
  
</style>