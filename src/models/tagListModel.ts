const LocalStorageKeyName = 'tagList';
type TagListModel = {
  data: string[],
  fetch: () => string[],
  create: (name: string) => 'success' | 'duplicated',
  save: () => void
}
const tagListModel: TagListModel = {
  data: [],
  fetch() {
    this.data = JSON.parse(window.localStorage.getItem(LocalStorageKeyName) || '[]');
    return this.data;
  },
  create(name: string) {
    if (this.data.indexOf(name) >= 0) {return 'duplicated';}
    this.data.push(name);
    this.save();
    return 'success';
  },
  save() {
    window.localStorage.setItem(LocalStorageKeyName, JSON.stringify(this.data));
  }
};

export default tagListModel;