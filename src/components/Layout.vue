<template>
  <div class="layout-wrapper">
    <main class="content" :class="classPrefix && `${classPrefix}-content`">
      <slot></slot>
    </main>
    <Nav/>
  </div>
</template>

<script>
export default {
  name: "Layout",
  props: ['classPrefix']
}
</script>

<style scoped lang="scss">
.layout-wrapper {
  min-height: 100vh; /* 设置等于屏幕高度 */
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 500px;
  .content {
    flex-grow: 1; /*尽量把所有的高度都给content*/
    max-height: 100vh;
    overflow: auto;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
}

.blank{
  height: 54px;
}
</style>