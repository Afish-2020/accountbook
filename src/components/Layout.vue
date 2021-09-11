<template>
  <div class="layout-wrapper">
    <div class="content" :class="classPrefix && `${classPrefix}-content`">
      <slot></slot>
    </div>
    <div class="navbar"><Nav/></div>
    <div class="blank"></div>
  </div>
</template>

<script>
export default {
  name: "Layout",
  props: ['classPrefix']
}
</script>

<style scoped>
.layout-wrapper{
  display: flex;
  flex-direction: column;
  min-height: 100vh;  /* 设置等于屏幕高度 */
}
.content {
  overflow: auto;  /*可滚动*/
  flex-grow: 1; /*尽量把所有的高度都给content*/
}
.navbar{
  width: 100%;
  position:fixed;bottom:0px;
  z-index: 1010;
}
.blank{
  height: 54px;
}
</style>