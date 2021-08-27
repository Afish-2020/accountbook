<template>
  <div class="nav-wrapper">
    <div class="content">
      <slot></slot>
    </div>
    <Nav/>
  </div>
</template>

<script>
export default {
  name: "Layout"
}
</script>

<style scoped>
.nav-wrapper{
  border: 1px solid green;
  display: flex;
  flex-direction: column;
  height: 100vh;  /* 设置等于屏幕高度 */
}
.content {
  overflow: auto;  /*可滚动*/
  flex-grow: 1; /*尽量把所有的高度都给content*/
}
</style>