import StorageH from './storageHandle'
const OPTIONS_KEY = "OPTIONS_STORAGE";
class SubscribeHelper {
  constructor() {
    this._optionsJson = {};
  }
  setOptions(key,options){
    key = key || "base";
    this._optionsJson[key] || (this._optionsJson[key] = {});
    this._optionsJson[key] = {...this._optionsJson[key],...options};
    StorageH.set(OPTIONS_KEY,this._optionsJson || "");
  }
  getOptions(key){
    key = key||"base";
    return this.getScanOptions(key).then(data=>{
      return data;
    })
  }
  removeOptions(key){
    key && delete this._optionsJson[(key)];
    // key && StorageH.set(OPTIONS_KEY,this._optionsJson || "");
  }
  clearOptions(){
    this._optionsJson = {};
    // StorageH.remove(OPTIONS_KEY);
  }
  getScanOptions(key){
    if(key == 'options'){ //获取options
      let query = this._optionsJson[key] && this._optionsJson[key].query || {};
      if(query.scene){ //扫码进来调接口
        return Promise.resolve(this._optionsJson[key]);
      }
      return Promise.resolve(this._optionsJson[key]); //不是扫码
    }else{ //不是获取options
      return this._optionsJson[key]
    }
  }
}
 

const instance = new SubscribeHelper();
export default instance;