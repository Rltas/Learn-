<template>
  <div id="ele">
    <span>previous</span>
    <div class="ele ele-test" id="attr">
      <span>attributes</span>
    </div>
    <span class="next">next</span>
  </div>
</template>

<script>
  export default {
    data() {

    },
    mounted() {
      let eleAttr = document.querySelector('#attr')
      eleAttr.classList.add('ele-2')
      console.log('123px'.substr(0, -2))
      console.log(eleAttr.clientHeight, eleAttr.getBoundingClientRect().height, eleAttr.clientLeft)
      console.log(eleAttr.firstElementChild.namespaceURI)
      console.log(eleAttr.previousElementSibling, eleAttr.nextElementSibling)
      let parent = document.querySelector('#ele')
      eleAttr.before(document.createElement('p'))
      let p = document.createElement('p')
      p.innerText = '123'
      document.querySelector('.next').replaceWith(p)
      setTimeout(() => {
        console.log(123)
        eleAttr.animate(move, {
          duration: 1000,
        })
      },1000)
    }
  }
</script>

<style lang="less">
  #ele {
    font-size: .26rem;
    border-left: .1rem solid purple;
  }
  @keyframes move {
    50% {
      transform: rotate(45deg);
    }
  }
</style>