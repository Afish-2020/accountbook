<template>
  <Layout>
    <Tabs class-prefix='type' :value.sync="type" :data-source="recordTypeList"/>
    <Tabs class-prefix='interval' :value.sync="interval" :data-source="intervalList"/>
    <div class="groupWrapper" >
    <div class="chart-wrapper" ref="chartWrapper">
      <Chart class="chart" :options="chartOptions"/>
    </div>
      <ol v-if="recordList.length>0">
        <li v-for="(group,index) in groupList" :key="index">
          <h3 class="title">{{ beautify(group.title) }}<span>￥{{ group.total }}</span></h3>
          <ol>
            <li class="record" v-for="item in group.items" :key="item.id">
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
import _ from 'lodash';

@Component({
  components: {Chart, Tabs}
})
export default class Statistics extends Vue {
  get recordList() {
    return (this.$store.state as RootState).recordList;
  }

  mounted() {
    const div = (this.$refs.chartWrapper as HTMLDivElement);
    div.scrollLeft = div.scrollWidth;
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
 get x() {
    const recordTypeList = this.recordList.filter(r=>r.type===this.type)
   let array = [];
   let tags=[]
   for (let i = 0; i < recordTypeList.length; i++) {
     const tagName = recordTypeList[i].tag[0].name;
     if(tags && tags.indexOf(tagName)>=0){
       continue;
     }
     let sum = 0;
     const found = recordTypeList.filter(r => r.tag[0].name === tagName);
     found.forEach(r => {sum += r.amount;})
     tags.push(tagName)
     array.push({value:sum,name:tagName})
   }
   return array
 }

  get groupList() {
    if(this.interval==='day'){
      return this.getResult('day','YYYY-MM-DD');
    }else{
      return this.getResult('mouth','YYYY-MM');
    }
  };

  get keyValueList() {
      let array = [];
      const today = new Date();
      for (let i = 0; i <= 29; i++) {
        if(this.interval==='day'){
          const dayString = dayjs(today).subtract(i, 'day').format('YYYY-MM-DD');
          const found = _.find(this.groupList, {title: dayString});
          array.push({key: dayString, value: found ? found.total : 0});
        }else{
          const dayString = dayjs(today).subtract(i, 'month').format('YYYY-MM');
          const found = _.find(this.groupList, {title: dayString});
          array.push({key: dayString, value: found ? found.total : 0});
        }
      }
      array.sort((a, b) => {
        if (a.key > b.key) {
          return 1;
        } else if (a.key === b.key) {
          return 0;
        } else {
          return -1;
        }
      });
      return array;
  };

  // get chartOptions() {
  //   // console.log(this.recordList.map(r=>({createdAt:r.createdAt,amount:r.amount})));
  //   //  console.log(this.recordList.map(r=>_.pick(r,['createdAt','amount'])));
  //   const keys = this.keyValueList.map(r => r.key);
  //   const values = this.keyValueList.map(r => r.value);
  //   return {
  //     xAxis: {
  //       type: 'category',
  //       data: keys,
  //       axisTick: {
  //         alignWithLabel: true
  //       },
  //       axisLine: {
  //         lineStyle: {color: '#01C2C7'}
  //       },
  //       axisLabel: {
  //         formatter: function (value:string) {
  //           const date = new Date(value);
  //           if(value.length===10) {
  //             const texts = [(date.getMonth() + 1), date.getDate()];
  //             return texts.join('.');
  //           }else{
  //             return  (date.getMonth() + 1) + '月';
  //           }
  //         },
  //       }
  //     },
  //     yAxis: {
  //       type: 'value',
  //       show: false
  //     },
  //     series: [{
  //       symbol: 'emptyCircle',
  //       symbolSize: 8,
  //       itemStyle: {borderWidth: 0.5, color:'#01C2C7',borderColor: 'black'},
  //       data: values,
  //       type: 'line'
  //     }],
  //     grid: {
  //       left: 0,
  //       right: 0
  //     },
  //     tooltip: {
  //       show: true, triggerOn: 'click',
  //       formatter: '{c}',
  //       position: 'top'
  //     }
  //   };
  // };

  get chartOptions() {
    // console.log(this.recordList.map(r=>({createdAt:r.createdAt,amount:r.amount})));
    //  console.log(this.recordList.map(r=>_.pick(r,['createdAt','amount'])));
    return {
        tooltip: {
          trigger: 'item'
        },
        legend: {
          top: '5%',
          orient:'vertical',
          x:'left',
          // left: 'center'
        },
      color:['#01C2C7','#A47CFF','#FE782F','#87C66B','#BCDE53','#FFAD49','#F0E68C','#FFA07A','#BC8F8F','#D3D3D3'],
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: '40',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: this.x
          }
        ]    }
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
.chart {
  width: 100%;
  margin: auto;

  &-wrapper {
    overflow-x: auto;
    margin: auto;

    &::-webkit-scrollbar {
      display: none;
    }
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
