import PinyinSort from './pinyinSort'
class localeCompare {
  static getInstance() {
    if (!localeCompare.instance) {
      localeCompare.instance = new localeCompare();
    }
    return localeCompare.instance;
  }
  constructor() {}
  getIndexes(arr) {
    return _pinyinSort.call(this,arr)
  }
}

export default localeCompare.getInstance(); 

function _pinyinSort(data) {
  let pinyinArray = [];
  for (let i = 0; i < data.length; i++) {
    let o = {};
    let ken = PinyinSort.getSpell(data[i].shippingName[0], function (charactor, spell) {
      spell.sort((a,b)=>{
        return a.charCodeAt() - b.charCodeAt()
      })
      return spell[0];
    });
    o.data = data[i]
    o.pinyin = ken.split(',').join('')
    pinyinArray.push(o)
  }
  let map = {
    key: '',
    datas: []
  }
  pinyinArray.forEach((item, index) => {
    if (!map[item.pinyin[0].toUpperCase()]) {
      map[item.pinyin[0].toUpperCase()] = {
        key: item.pinyin[0].toUpperCase(),
        datas: []
      }
    }
    map[item.pinyin[0].toUpperCase()].datas.push(item.data)
  }
  )
  let result = [];
  let letters = "*ABCDEFGHIJKLNMOPQRSTUVWXYZ".split('');
  for (let i = 1; i < letters.length; i++) {
    if (map[letters[i]]) {
      let obj = {}; 
      obj.key = letters[i]
      obj.datas = map[letters[i]].datas
      result.push(obj)
    }
  }
  return result;
}