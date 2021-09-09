<template>
  <Layout>
    <Tabs class-prefix='type' :value.sync="type" :data-source="recordTypeList"/>
    <Tabs class-prefix='interval' :value.sync="interval" :data-source="intervalList"/>
    <div class="chart-wrapper" ref="chartWrapper">
      <Chart class="chart" :options="x" />
    </div>
    <ol v-if="recordList.length>0">
      <li v-for="(group,index) in groupList" :key="index">
        <h3 class="title">{{ beautify(group.title) }}<span>￥{{ group.total }}</span></h3>
        <ol>
          <li class="record" v-for="item in group.items" :key="item.id">
            <span>{{ tagString(item.tags) }}</span>
            <span class="notes">{{ item.notes }}</span>
            <span>￥{{ item.amount }}</span>
          </li>
        </ol>
      </li>
    </ol>
    <div v-else class="noResult">目前没有相关记录</div>
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
  get recordList() {
    return (this.$store.state as RootState).recordList;
  }

  mounted(){
    const div = (this.$refs.chartWrapper as HTMLDivElement);
     div.scrollLeft = div.scrollWidth;
  }

  get groupList() {
    type Result = { title: string, total?: number, items: RecordItem[] }[]

    const newList = clone(this.recordList).filter(i => i.type === this.type).sort((a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf());
    if (newList.length === 0) {return [] as Result;}
    const result: Result = [{title: dayjs(newList[0].createdAt).format('YYYY-MM-DD'), items: [newList[0]]}];
    for (let i = 1; i < newList.length; i++) {
      let current = newList[i];
      let last = result[result.length - 1];
      if (dayjs(current.createdAt).isSame(last.title, 'day')) {
        last.items.push(current);
      } else {
        result.push({title: dayjs(current.createdAt).format('YYYY-MM-DD'), items: [current]});
      }
    }
    result.map(group => {
      group.total = group.items.reduce((sum, item) => sum + item.amount, 0);
    });
    return result;
  };

  get x(){
    return {
      xAxis: {
        type: 'category',
        data: ['1', '2', '3', '4', '5', '6', '7','8','9','10',
          '10', '12', '13', '14', '15', '16', '17','18','19','20',
          '21', '23', '24', '25', '26', '27','28','29','30'],
        axisTick:{
        alignWithLabel: true
        },
        axisLine:{
          lineStyle:{color:'#666'}
        },
      },
      yAxis: {
        type: 'value',
        show: false
      },
      series: [{
        symbol:'circle',
        symbolSize: 10,
        itemStyle:{borderWidth:1, color: '#666' ,borderColor:'#666'},
        data: [150, 230, 224, 218, 135, 147, 260,150, 230,
               224, 218, 135, 147, 260,150, 230, 224, 218,
               135, 147, 260,150, 230, 224, 218, 135, 147,150, 230,224],
        type: 'line'
      }],
      grid:{
        left:0,
        right:0
      },
      tooltip:{
        show:true,triggerOn:'click',
        formatter: '{c}',
        position:'top'
    }
    }
  };

  tagString(tags: Tag[]) {
    return tags.length === 0 ? '无' : tags.map(i=>i.name).join('，');
  }

  beautify(string: string) {
    const day = dayjs(string);
    const now = dayjs();
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
.chart{
  width: 430%;
  &-wrapper{
    overflow: auto;
    &::-webkit-scrollbar {
      display: none;
    }
  }
}
.noResult{
  padding: 16px;
  text-align: center;
}
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
