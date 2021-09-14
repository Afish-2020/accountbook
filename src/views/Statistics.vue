<template>
  <Layout>
    <Tabs class-prefix='type' :value.sync="type" :data-source="recordTypeList"/>
    <Tabs class-prefix='interval' :value.sync="interval" :data-source="intervalList"/>
    <div class="groupWrapper" >
    <ol class="chart-wrapper" ref="chartWrapper">
      <li class="chartTitle">消费比例</li>
      <li><Chart class="chart" :options="chartOptions"/></li>
      <li class="chartTitle">支出统计</li>
      <li><Chart class="chart line" :options="lineOptions"/></li>
    </ol>
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
 get nameValueList() {
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

  get lineOptions() {
    // console.log(this.recordList.map(r=>({createdAt:r.createdAt,amount:r.amount})));
    //  console.log(this.recordList.map(r=>_.pick(r,['createdAt','amount'])));
    const keys = this.keyValueList.map(r => r.key);
    const values = this.keyValueList.map(r => r.value);
    return {
      xAxis: {
        type: 'category',
        data: keys,
        axisTick: {
          alignWithLabel: true
        },
        axisLine: {
          lineStyle: {color: '#01C2C7'}
        },
        axisLabel: {
          formatter: function (value:string) {
            const date = new Date(value);
            if(value.length===10) {
              const texts = [(date.getMonth() + 1), date.getDate()];
              return texts.join('.');
            }else{
              return  (date.getMonth() + 1) + '月';
            }
          },
        }
      },
      yAxis: {
        type: 'value',
        show: false
      },
      series: [{
        symbol: 'emptyCircle',
        symbolSize: 4,
        itemStyle: {borderWidth: 0.5, color:'#01C2C7',borderColor: 'black'},
        data: values,
        type: 'line'
      }],
      grid: {
        // top:0,
        left: 10,
        right: 10
      },
      tooltip: {
        show: true, triggerOn: 'click',
        formatter: '{c}',
        position: 'top'
      }
    };
  };

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
          icon: "circle",
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
            data: this.nameValueList
          }
        ]    }
  };

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
  width: 95%;
  margin: auto;
background: white;
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
.chartTitle{
  padding: 8px;
}
</style>
