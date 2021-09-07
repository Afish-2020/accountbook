<template>
  <div class="layout-wrapper">
    <div class="content" :class="classPrefix && `${classPrefix}-content`">
      <slot></slot>
    </div>
    <Nav/>
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
</style>