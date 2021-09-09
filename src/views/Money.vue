<template>
  <Layout class-prefix="layout">
    <NumberPad @update:value="onUpdateAmount" @submit="saveRecord"/>
    <Tabs :value.sync="record.type" :data-source="recordTypeList"/>
    <div class="notes">
      <FormItem field-name="备注" placeholder="在这里输入备注" :value.sync="record.notes"/>
      <FormItem field-name="日期" type="date" placeholder="在这里输入备注" :value.sync="record.createdAt"/>
    </div>
    <Tags @update:value="record.tags=$event"/>
  </Layout>
</template>

<script lang="ts">
import Vue from 'vue';
import Tags from '@/components/Money/Tags.vue';
import FormItem from '@/components/Money/FormItem.vue';
import NumberPad from '@/components/Money/NumberPad.vue';
import {Component} from 'vue-property-decorator';
import Tabs from '@/components/Tabs.vue';
import recordTypeList from '@/constants/recordTypeList';
import dayjs from 'dayjs';

@Component({
  components: {Tabs, NumberPad, FormItem, Tags},
})
export default class Money extends Vue {
  get recordList(){
    return this.$store.state.recordList;
  };
  record: RecordItem = {
    tags: [], notes: '', type: '-', amount: 0,createdAt:dayjs().format('YYYY-MM-DD')
  };
  recordTypeList=recordTypeList;
  created(){
    this.$store.commit('fetchRecords');
  };

  onUpdateAmount(value: string) {
    this.record.amount = parseFloat(value);
  };

  saveRecord() {
    if(!this.record.tags||this.record.tags.length===0){
      return window.alert('请至少选一个标签')
    }
    this.$store.commit('createRecord',this.record);
    if (this.$store.state.createRecordError===null) {
      window.alert('已保存')
    }
    this.record.notes = ''
  };
}
</script>

<style lang="scss" scoped>
::v-deep .layout-content {
  display: flex;
  flex-direction: column-reverse;
}

.notes {
  padding: 12px 0;
}
</style>
