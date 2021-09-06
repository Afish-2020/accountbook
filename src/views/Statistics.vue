<template>
  <Layout>
    <Tabs class-prefix='type' :value.sync="type" :data-source="recordTypeList"/>
    <Tabs class-prefix='interval' :value.sync="interval" :data-source="intervalList"/>
      <ol>
        <li v-for="(group,index) in result" :key="index">
          <h3 class="title">{{group.title}}</h3>
        <ol>
          <li class="record" v-for="item in group.items" :key="item.amount">
            <span>{{tagString(item.tag)}}</span>
            <span class="notes">{{item.notes}}</span>
            <span>￥{{item.amount}}</span>
          </li>
        </ol>
        </li>
      </ol>
  </Layout>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component} from 'vue-property-decorator';
import Tabs from '@/components/Tabs.vue';
import intervalList from '@/constants/intervalList';
import recordTypeList from '@/constants/recordTypeList';

@Component({
  components: {Tabs}
})
export default class Statistics extends Vue {
  get recordList() {
    return this.$store.state.recordList;
  }

  get result() {
    type recordValue = {title:string,items:RecordItem[]};
    const hastTable : { [key:string]:recordValue } = {};
    for(let i=0;i<this.recordList.length;i++){
      const [data,time] = this.recordList[i].createdAt.split('T');
      hastTable[data] = hastTable[data] || {title:data,items:[]}
      hastTable[data].items.push(this.recordList[i]);
    }
    return hastTable;
  };

  tagString(tag: string[]) {
    return tag.length === 0 ? '无' : tag.join(',');
  }
  beforeCreate() {
    this.$store.commit('fetchRecords');
  }

  type = '-';
  interval = 'day';
  intervalList = intervalList;
  recordTypeList = recordTypeList;

}
</script>

<style lang="scss" scoped>
::v-deep .type-tabs-item {
  background: white;

  &.selected {
    background: #c4c4c4;

    &::after {
      display: none;
    }
  }
}

::v-deep .interval-tabs-item {
  height: 48px;
}

%item {
  padding: 8px 16px;
  line-height: 24px;
  display: flex;
  justify-content: space-between;
  align-content: center;
}
.title {
  @extend %item;
}
.record {
  background: white;
  @extend %item;
}
.notes {
  margin-right: auto;
  margin-left: 16px;
  color: #999;
}
</style>
