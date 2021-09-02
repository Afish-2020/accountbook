import clone from '@/lib/clone';

const LocalStorageKeyName = 'recordList'
const recordListModel ={
  data:[] as RecordItem[],
  create(record:RecordItem){
    const record2: RecordItem = clone(record);
    record2.createdAt = new Date();
    this.data.push(record2);
  },
  fetch(){
    this.data = JSON.parse(window.localStorage.getItem(LocalStorageKeyName) || '[]') as RecordItem[];
    return this.data
  },
  save(){
    window.localStorage.setItem(LocalStorageKeyName, JSON.stringify(this.data));
  }
}

export default recordListModel;