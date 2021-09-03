import clone from '@/lib/clone';

const LocalStorageKeyName = 'recordList';
const recordStore = {  // record store
  recordList : [] as RecordItem[],
  fetchRecords(){
  this.recordList = JSON.parse(window.localStorage.getItem(LocalStorageKeyName) || '[]') as RecordItem[];
  return this.recordList
},
  createRecord(record: RecordItem){
    const record2: RecordItem = clone(record);
    record2.createdAt = new Date();
    this.recordList?.push(record2);
    recordStore.saveRecords();
  },
  saveRecords(){
    window.localStorage.setItem(LocalStorageKeyName, JSON.stringify(this.recordList));
  }
}

recordStore.fetchRecords();

export default recordStore;