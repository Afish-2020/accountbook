<template>
  <Layout class-prefix="layout">
    <NumberPad @update:value="onUpdateAmount" @submit="saveRecord"/>
    <Tabs :value.sync="record.type" :data-source="recordTypeList"/>
    <div class="notes">
      <FormItem field-name="备注" placeholder="在这里输入备注" @update:value="onUpdateNotes"/>
    </div>
    <Tags/>
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

@Component({
  components: {Tabs, NumberPad, FormItem, Tags},
})
export default class Money extends Vue {
  get recordList(){
    return this.$store.state.recordList;
  };
  record: RecordItem = {
    tag: [], notes: '', type: '-', amount: 0
  };
  recordTypeList=recordTypeList;
  created(){
    this.$store.commit('fetchRecords');
  };

  onUpdateNotes(value: string) {
    this.record.notes = value;
  };

  onUpdateAmount(value: string) {
    this.record.amount = parseFloat(value);
  };

  saveRecord() {
    this.$store.commit('createRecord',this.record);
  };
}
</script>

<style lang="scss">
.layout-content {
  display: flex;
  flex-direction: column-reverse;
}

.notes {
  padding: 12px 0;
}
</style>
