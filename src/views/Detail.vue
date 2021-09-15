<template>
  <Layout>
    <Tabs class-prefix='type' :value.sync="type" :data-source="recordTypeList"/>
    <Tabs class-prefix='interval' :value.sync="interval" :data-source="intervalList"/>
    <div class="groupWrapper" >
      <ol v-if="recordList.length>0">
        <li v-for="(group,index) in groupList" :key="index">
          <h3 class="title">{{ beautify(group.title) }}<span>￥{{ group.total }}</span></h3>
          <ol>
            <li class="record" v-for="item in group.items" :key="item.id">
             <div  class="iconWrapper">
               <Icon v-if="tagsName.indexOf(tagString(item.tag))>=0" :name="tagString(item.tag)"/>
               <Icon v-else name="start"/>
             </div>
              <!--              <div v-if="tagsName.indexOf(tag.name)>=0" class="icon"><Icon :name="tag.name"/></div>-->
<!--              <div v-else class="icon"><Icon name="start"/></div>-->
              <span>{{tagString(item.tag)}}</span>
              <span class="notes">{{ item.notes }}</span>
              <span>￥{{ item.amount }}</span>
            </li>
          </ol>
        </li>
      </ol>
      <div v-else class="noResult">目前没有相关记录</div>
    </div>
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
import Chart from '@/components/Chart.vue';

@Component({
  components: {Chart, Tabs}
})
export default class Statistics extends Vue {
  tagsName:string[]=['餐饮','服饰','购物','日用','交通','蔬菜','水果','住房','旅行']
  get recordList() {
    return (this.$store.state as RootState).recordList;
  }

  getResult(pattern:string,unit:string){
    type Result = { title: string, total?: number, items: RecordItem[] }[]
    const newList = clone(this.recordList).filter(i => i.type === this.type).sort((a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf());
    if (newList.length === 0) {return [] as Result;}
    const result: Result = [{title: dayjs(newList[0].createdAt).format(unit), items: [newList[0]]}];
    for (let i = 1; i < newList.length; i++) {
      let current = newList[i];
      let last = result[result.length - 1];
      if(pattern==='day'){
        if (dayjs(current.createdAt).isSame(last.title, 'day')) {
          last.items.push(current);
        } else {
          result.push({title: dayjs(current.createdAt).format(unit), items: [current]});
        }
      }else {
        if (dayjs(current.createdAt).isSame(last.title, 'month')) {
          last.items.push(current);
        } else {
          result.push({title: dayjs(current.createdAt).format(unit), items: [current]});
        }
      }
    }
    result.map(group => {
      group.total = group.items.reduce((sum, item) => sum + item.amount, 0);
    });
    // console.log(this.recordList);
    // console.log(this.recordList[0].amount);
    return result;
  }

  get groupList() {
    if(this.interval==='day'){
      return this.getResult('day','YYYY-MM-DD');
    }else{
      return this.getResult('mouth','YYYY-MM');
    }
  };

  tagString(tags: Tag[]) {
    // return tags.length === 0 ? '无' : tags.map(i => i.name).join('，');
    if(tags){
      return tags![0].name;
    }
  }


  beautify(string: string) {
    const day = dayjs(string);
    const now = dayjs();
    if(this.interval==='day'){
      if (day.isSame(now, 'day')) {
        return '今天';
      } else if (day.isSame(now.subtract(1, 'day'), 'day')) {
        return '昨天';
      } else if (day.isSame(now.subtract(2, 'day'), 'day')) {
        return '前天';
      } else if (day.isSame(now, 'year')) {
        return day.format('M月D日');
      } else {
        return day.format('YYYY年M月D日');
      }
    }else{
      if (day.isSame(now, 'month')) {
        return '本月';
      }else if (day.isSame(now.subtract(1, 'month'), 'month')){
        return '上月'
      }else if (day.isSame(now, 'year')) {
        return day.format('M月');
      }else {
        return day.format('YYYY年M月');
      }
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
li {
  //border: 1px solid red;
  align-items: center;
  .iconWrapper{
    //border:1px solid red;
    height: 40px;
    width: 40px;
    border-radius: 50%;
    background: #D9D9D9;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 10px;
  }
}
  .noResult {
  padding: 16px;
  text-align: center;
}

::v-deep .type-tabs-item {
  background: white;
  color: #08ACB5;

  &.selected {
    background: #08ACB5;
    color: white;

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
.groupWrapper{
  overflow: auto;
}
</style>
