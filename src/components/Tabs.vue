<template>
  <ul class="tabs">
    <li v-for="item in dataSource" :key="item.value" class="tabs-item"
        :class="{[classPrefix+'-tabs-item']:classPrefix,'selected':item.value === value}" @click="select(item)">
      <div>{{ item.text }}</div>
    </li>
  </ul>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component, Prop} from 'vue-property-decorator';

type DataSourceItem = { text: string, value: string }
@Component
export default class Tabs extends Vue {
  @Prop({required: true, type: Array}) dataSource!: DataSourceItem[];
  @Prop(String) readonly value!: string;
  @Prop() classPrefix?: string;

  select(item: DataSourceItem) {
    this.$emit('update:value', item.value);
  }
}
</script>

<style scoped lang="scss">
.tabs {
  background:  #01C2C7;
  color: white;
  display: flex;
  text-align: center;
  font-size: 24px;

  &-item {
    width: 50%;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    &.selected::after { /*当前li被选中时*/
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 4px;
      background: #666;
    }
  }
}

</style>