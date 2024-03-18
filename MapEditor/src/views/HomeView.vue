<script setup>

</script>

<template>
  <header>
    <div class="wrapper">
      <!-- <div class="linkbtn">
        <router-link to="/mapeditor">地图编辑demo</router-link>
      </div> -->
      <!-- <div class="linkbtn">
        <router-link to="/mapcheck">地图展示demo</router-link>
      </div> -->
    </div>
  </header>
  <main>
    <router-view></router-view>
  </main>
</template>

<style lang="scss" scoped>
header {
  .wrapper {
    display: flex;
    justify-content: start;

    .linkbtn {
      width: 100px;
      height: 30px;
      border: 1px solid red;

      router-link {
        text-decoration: none;
      }
    }
  }
}
</style>
