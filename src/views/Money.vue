<template>
  <Layout class-prefix="layout">
    <NumberPad />
    <Types/>
    <Notes />
    <Tags :data-source.sync="tags"/>
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
  data(){
    return{
      tags: ['衣','食','住','行']
    }
  }
}
</script>

<style lang="scss">
.layout-content {
  display: flex;
  flex-direction: column-reverse;
}
</style>
