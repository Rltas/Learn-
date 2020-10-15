<template>
  <div id="file-test">
    <input type="file" class="uploadFile" @change="uploadFile($event)">
    <div class="img-bg"></div>
    <div class="all-box">
      <div v-for="item in arr" :key="item">
        {{item}}
      </div>
    </div>

    <input type="text" v-model="fullNmae">
    <p>{{firstName}}</p>
    <p>{{lastNmae}}</p>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        arr: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        firstName: 'w',
        lastNmae: 'g',
        arrOne:'',
      obj: {
        name: '123456789'
      },
      objP:''
      }
    },
    created() {
      [this.arrOne] = this.arr;
      console.log(this.arrOne,'*********')
     let { name } = this.obj
    },
    computed: {
      fullNmae: {
        get() {
          return this.firstName + this.lastNmae;
        },
        set(newVal) {
          // this.firstName = newVal.split('')[0];
          // this.lastNmae = newVal.split('')[1];
        }
      }
    },
    mounted() {
      // console.log(document.querySelectorAll('.all-box div')[2].clientX);
//       var str="Hello world!"
// document.write(str.blink())
async function asTest() {
  return 'hello world'
}
asTest().then(res => {
  console.log(res)
})
let arr = [{name: 'one'},{name: 'two'},{name: 'three'}];
this.testArr(arr)
    },
    methods: {
      uploadFile(e) {
        let file = e.target.files[0];
        let type;
        console.log(file);
        let fileReader = new FileReader();
        fileReader.onload = () => {
          if (type == 1) {
            document.querySelector('.img-bg').style.background = `url(${fileReader.result})`;
          } else {
            document.querySelector('.img-bg').innerHTML = fileReader.result;
          }
        }
        if (file.type.includes('image')) {
          fileReader.readAsDataURL(file);
          type = 1;
        } else {
          fileReader.readAsText(file);
        }
      },
      upsetArr(arr) {
        arr.sort((a, b) => {
          return Math.random() > 0.5 ? -1 : 1;
        })
      },
      shuffle(els, arr) {
        this.upsetArr(arr);
        els.forEach((value, index, array) => {
          let el = els[index];
          el.setAttribute('index', index);
          el.style.transform = 'translate(' + arr[i].x + 'vw,' + arr[i].y + 'vh' + ')';
        })
      },
      generateMatrix(n, dx, dy) {
        let arr = [],
          index = 0;
        for (let i = 0; i < n; i++) {
          for (let j = 0; j < n; j++) {
            arr.push({
              x: j * dx,
              y: i * dy,
              index: index
            });
            index++;
          }
        }
      },
      swap(index_a, index_b) {
        [arr[index_a], arr[index_b]] = [arr[index_b], arr[index_a]];
      },
      generateImag() {
        let canvas = document.createElement('canvas');
        if (canvas.getContext) {
          let winW = window.innerWidth,
            winH = window.innerHeight,
            ctx = canvas.getContext('2d');
          canvas.width = winW;
          canvas.height = winH;
          let line = ctx.createLinearGradient(0, 0, 0, winH);
          line.addColorStop(0, '#a1c4fd');
          line.addColorStop(1, '#c2e9fb');
          ctx.fillStyle(line);
        }
      },
      async loadInfo(item) {
      let res = await this.api.post('getLoginState')
        console.log(res.code++, '******',item.name)
      },
       testArr(arr) {
        arr.map(async (item, index) =>{
        await this.loadInfo(item);
          console.log(index)
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .img-bg {
    width: 200px;
    height: 200px;
  }

  .all-box {
    width: 100%;
    height: 3.75rem;
    display: flex;
    flex-wrap: wrap;

    div {
      width: calc(3.75rem / 3);
      height: calc(3.75rem / 3);
      text-align: center;
      line-height: 1.25rem;
    }
  }
</style>