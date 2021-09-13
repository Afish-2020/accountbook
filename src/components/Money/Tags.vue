<template>
  <div class="tags">
<!--    <div class="new">-->
<!--      <button @click="createTag">新增标签</button>-->
<!--    </div>-->
    <ul class="current">
      <li v-for="tag in tagList" :key="tag.id" :class="{selected:selectedTags.indexOf(tag)>=0}" @click="toggle(tag)"><div class="icon"><Icon :name="tag.name"/></div><span class="text">{{tag.name}}</span></li>
      <li @click="createTag"><div class="icon" ><Icon name="add"/></div><span class="text">添加</span></li>
    </ul>
  </div>

</template>

<script lang="ts">
import Vue from 'vue';
import {Component} from 'vue-property-decorator';
import {mixins} from 'vue-class-component';
import TagHelper from '@/mixins/TagHelper';

@Component
export default class Tags extends mixins(TagHelper){
  get tagList(){
    return this.$store.state.tagList
  };
  created(){
    this.$store.commit('fetchTags')
  };
  selectedTags: string[] = [];
  toggle(tag:string){
    const index = this.selectedTags.indexOf(tag);
    if(index>=0){
      this.selectedTags.splice(index,1)
    }else{
      this.selectedTags = [];
      this.selectedTags.push(tag);
    }
    this.$emit('update:value',this.selectedTags)
  };
}
</script>

<style lang="scss" scoped>
.tags {
  background: white;
  //padding: 16px;
  flex-grow: 1;
  display: flex;
  justify-content: center;
  > .current {
    display: flex;
    flex-wrap: wrap;
    margin: 8px 34px;
    > li {
      font-size: 20px;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      $bg: #D9D9D9;
      $h: 40px;
      line-height: $h;
      width: 20%;
      margin-top: 4px;
      >.icon{
        height: 40px;
        width: 40px;
        border-radius: 50%;
        background: $bg;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .text{
        margin: -5px 0;
        font-size: 10px;
      }
      &.selected {
        color: white;
        .text{
          color: black;
        }
        .icon{
          background: #01C2C7;
        }
      }
    }
  }
  > .new {
    padding-top: 16px;
    button {
      background: transparent;
      border: none;
      color: #999;
      border-bottom: 1px solid;
      padding: 0 4px;
    }
  }
}
</style>