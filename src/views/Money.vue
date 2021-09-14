<template>
  <Layout class-prefix="layout">
    <Tabs :value.sync="record.type" :data-source="recordTypeList"/>
    <Tags class="tags" @update:value="record.tag=$event"/>
    <div class="notes">
      <FormItem class="formItem" field-name="备注" placeholder="在这里输入备注" :value.sync="record.notes"/>
      <FormItem class="formDate" field-name="日期" type="date" placeholder="在这里输入备注" :value.sync="record.createdAt"/>
    </div>
    <NumberPad @update:value="onUpdateAmount" @submit="saveRecord"/>
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
    tag: [], notes: '', type: '-', amount: 0,createdAt:dayjs().format('YYYY-MM-DD')
  };
  recordTypeList=recordTypeList;
  created(){
    this.$store.commit('fetchRecords');
    this.$store.commit('fetchTags');
  };

  onUpdateAmount(value: string) {
    this.record.amount = parseFloat(value);
  };

  saveRecord() {
    if(!this.record.tag||this.record.tag.length===0){
      return window.alert('请选择一个标签')
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
  padding: 5px 0;
  background-color: white;
  //border: 1px solid ;
  //box-shadow: 0 0 3px rgba(0, 0, 0, 0.25);
  box-shadow: inset 0 -3px 3px -3px  rgba(0, 0, 0, 0.25),
  inset 0 3px 3px -3px  rgba(0, 0, 0, 0.25);
}

.formItem{
  float: left;
}
.formDate{
  padding-right: 16px;
}
.tags{
  display: flex;
  flex-direction:row-reverse;
  overflow: auto;
}
</style>
