<template>
  <Layout class-prefix="layout">
    <NumberPad />
    <Types :xxx="333"/>
    <Notes />
    <Tags />
  </Layout>
</template>

<script>
import Tags from "@/components/Money/Tags"
import Notes from "@/components/Money/Notes"
import Types from "@/components/Money/Types"
import NumberPad from "@/components/Money/NumberPad"
export default {
  name: "money",
  components: {NumberPad, Types, Notes, Tags},
}
</script>

<style lang="scss">
.layout-content {
  display: flex;
  flex-direction: column-reverse;
}
</style>
