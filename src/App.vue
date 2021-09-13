<template>
  <div id="app">
    <router-view class="router-view"></router-view>
  </div>
</template>

<style lang="scss">
@import "~@/assets/style/helper.scss";
@import "~@/assets/style/reset.scss";

body {
  line-height: 1.5;
  font-family: $font-hei;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #333;
  font-size: 16px;
  background: #f5f5f5;
  max-width: 500px;
  margin: 0 auto;
}

#app{
  //max-width: 500px;
  //margin: 0 auto;
  position: relative;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  height: 100%;
}
.router-view {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
