<script setup>
import { onMounted, reactive, ref } from 'vue';
let map = ref('')
function init() {
  let elements = document.getElementsByClassName('bmap-container');
  console.log(elements);
        if (elements && elements.length > 0) {
            map = new AMap.Map(elements[0], {
                center: [120.228831, 30.288598],
                zoom: 14.2,
            });
        }
    }

    onMounted(()=>{
      init()
})



</script>

<template>
  <main>
    <div id='allmap' class='bmap-container'></div>
  </main>
</template>

<style scoped lang="scss">


  main{
    .bmap-container{
      width: 100%;
      height: 100vh;
    }
  }

</style>