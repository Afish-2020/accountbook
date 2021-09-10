<template>
  <div>
    <label class="FormItem">
      <template v-if="type === 'date'">
        <input :type="type||'text'"
                       :value="x(value)" @input=onValueChanged($event.target.value)
                       :placeholder="placeholder"></template>
      <template v-else>
        <span class="name">{{ fieldName }}</span>
        <input class="textInput" :type="type||'text'" :value="value" @input=onValueChanged($event.target.value)
                       :placeholder="placeholder">
      </template>
    </label>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {Component, Prop, Watch} from 'vue-property-decorator';
import dayjs from 'dayjs';

@Component
export default class FormItem extends Vue {
  @Prop({default: ''}) readonly value!: string;
  @Prop({required: true}) fieldName!: string;
  @Prop() placeholder?: string;
  @Prop() type?: string;

  onValueChanged(value: string) {
    this.$emit('update:value', value);
  };

  x(isoString: string) {
    return dayjs(isoString).format('YYYY-MM-DD');
  }
}
</script>

<style lang="scss" scoped>
.FormItem {
  font-size: 14px;
  padding-left: 16px;
  display: flex;
  align-items: center;
  .name {
    padding-left: 0px;
  }
.textInput{
  padding-left: 16px;
  max-width: 12em;
}
  input {
    height: 40px;
    background: transparent;
    border: none;
    //padding-right: 16px;
  }
}
</style>