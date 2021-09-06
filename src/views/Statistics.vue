<template>
  <Layout>
    <Tabs class-prefix='type' :value.sync="type" :data-source="recordTypeList"/>
    <Tabs class-prefix='interval' :value.sync="interval" :data-source="intervalList"/>
      <ol>
        <li v-for="(group,index) in groupList" :key="index">
          <h3 class="title">{{beautify(group.title)}}</h3>
        <ol>
          <li class="record" v-for="item in group.items" :key="item.id">
            <span>{{tagString(item.tags)}}</span>
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
import dayjs from 'dayjs';
import clone from '@/lib/clone';

@Component({
  components: {Tabs}
})
export default class Statistics extends Vue {
  get recordList() {
    return (this.$store.state as RootState).recordList;
  }

  get groupList() {
    if(this.recordList.length === 0){return []};
    const newList = clone(this.recordList).sort((a,b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf());
    const result = [{title:dayjs(newList[0].createdAt).format('YYYY-MM-DD'),items:[newList[0]]}]
    for(let i=1;i<newList.length;i++){
      let current = newList[i]
      let last = result[result.length-1]
      if(dayjs(current.createdAt).isSame(last.title,'day')){
        last.items.push(current)
      }else {
        result.push({title:dayjs(current.createdAt).format('YYYY-MM-DD'),items: [current]});
      }
    }
    return result;
  };

  tagString(tags: Tag[]) {
    return tags.length === 0 ? '无' : tags.join(',');
  }
  beautify(string:string){
    const day=dayjs(string);
    const now=dayjs();
    if(day.isSame(now,'day')){
      return '今天'
    }else if(day.isSame(now.subtract(1,'day'),'day')){
      return '昨天'
    }else if(day.isSame(now.subtract(2,'day'),'day')){
      return '前天'
    } else if(day.isSame(now,'year')) {
      return day.format('M月D日')
    }else{
      return day.format('YYYY年M月D日')
    }
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
