import Vue from 'vue';
import Vuex from 'vuex';
import clone from '@/lib/clone';
import createId from '@/lib/createId';
import dayjs from 'dayjs';

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    recordList : [],
    createRecordError: null,
    createTagError: null,
    tagList : [],
    currentTag: undefined
  } as RootState,
  mutations: {
    setCurrentTag(state,id){
      state.currentTag = state.tagList.filter(t => t.id === id)[0];
    },
    updateTag(state,payload:{id: string, name: string}) {
      const {id, name} = payload;
      const idList = state.tagList.map(item => item.id);
      if (idList.indexOf(id) >= 0) {
        const names = state.tagList.map(item => item.name);
        if (names.indexOf(name) >= 0) {
          window.alert('标签名已存在')
        } else {
          const tag = state.tagList.filter(item => item.id === id)[0];
          tag.name = name
          store.commit('saveTags');
        }
      }
    },
    removeTag(state,id: string){
      let index = -1
      for(let i=0;i<state.tagList.length;i++){
        if(state.tagList[i].id === id){
          index = i;
          break;
        }
      }
      state.tagList.splice(index,1)
      store.commit('saveTags');
    },
    fetchRecords(state){
      state.recordList = JSON.parse(window.localStorage.getItem('recordList') || '[]') as RecordItem[];
    },
    createRecord(state,record: RecordItem){
      const record2: RecordItem = clone(record);
      record2.createdAt = record2.createdAt || dayjs().format('YYYY-MM-DD');
      state.recordList?.push(record2);
      store.commit('saveRecords')
    },
    saveRecords(state){
      window.localStorage.setItem('recordList', JSON.stringify(state.recordList));
    },
    fetchTags(state) {
      state.tagList = JSON.parse(window.localStorage.getItem('tagList') || '[]');
      if(!state.tagList||state.tagList.length===0){
        console.log('2');
        store.commit('createTag','餐饮');
        store.commit('createTag','服饰');
        store.commit('createTag','购物');
        store.commit('createTag','日用');
        store.commit('createTag','交通');
        store.commit('createTag','蔬菜');
        store.commit('createTag','水果');
        store.commit('createTag','住房');
        store.commit('createTag','旅行');
      }
    },
    createTag(state,name: string) {
      state.createTagError = null;
      const names = state.tagList.map(item=>item.name);
      if (names.indexOf(name) >= 0) {
        state.createTagError = new Error('tag is duplicated');
        return;
      }else {
      const id=createId().toString();
      state.tagList.push({id:id,name:name});
      store.commit('saveTags');
      console.log('1')
      }
    },
    saveTags(state) {
      window.localStorage.setItem('tagList', JSON.stringify(state.tagList));
    },
  },
  actions: {},
  modules: {}
});

export default store;
