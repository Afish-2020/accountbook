const LocalStorageKeyName = 'recordList'
const model ={
  clone(data:RecordItem | RecordItem[]){
    return JSON.parse(JSON.stringify(data));
  },
  fetch(){
    return JSON.parse(window.localStorage.getItem(LocalStorageKeyName) || '[]') as RecordItem[];
  },
  save(data:RecordItem[]){
    window.localStorage.setItem(LocalStorageKeyName, JSON.stringify(data));
  }
}

export default model