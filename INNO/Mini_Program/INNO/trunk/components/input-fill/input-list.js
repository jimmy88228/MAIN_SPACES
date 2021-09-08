// pages/component/input-fill/input-list.js
import MyStr from "../../common/support/utils/string-util.js"
const app = getApp();
Component(app.BTAB({
  properties: {
    inputList: {
      type: Array,
      value: []
    }
  },
  data: {
    curTipNum:-1,
  },
  ready(){
    this.init();
  },
  methods: {
    onChange(e){
      let dataset = e.currentTarget.dataset||{};
      let item = dataset.item || {};
      let val = e.detail || "";
      // console.log(item,val,e)
      this.update(item,val);
    },
    init(e){
      this.content = this.content || {}; 
    },
    update(item={},val){
      let id = item.id;
      if(!id)return
      let curTipNum = this.data.curTipNum;
      this.content[id] || (this.content[id] = {});
      this.content[id].value = val || "";
      if(curTipNum == item.index){
        if(item.type == 'idcard' && val.length==18){
          this.setTip(-1);
        }else if(item.type != 'idcard' && item.isMust && val){
          this.setTip(-1);
        }
      }
      // this.content[id].inited || (this.content[id].name = item.name);
      // this.content[id].inited || (this.content[id].isMust = item.isMust);
      // this.content[id].inited = true;
      // console.log('刷新',id,this.content[id] && this.content[id].value);
    },
    setTip(i){
      this.setData({
        curTipNum : i
      })
    },
    checkComplete() {
      let list = this.data.inputList;
      for (let i = 0, n = list.length; i < n; i++) {
        let item = list[i];
        let value = MyStr.trim(this.content[item.id] && this.content[item.id].value) || "";
        if (!value && item.isMust) {
          throwErr(item);
        }else if(item.isMust && item.type == 'idcard' && (value && value.length!=18)){
          throwErr(item,"填写格式有误");
        }
      }
      return this.content;
    }
  }
}))

function throwErr(item,msg){
  let err = "";
  if(msg){
    err = msg;
  }else{
    err = "请填写";
    err += (item.name || "信息");
  }
  app.SMH.showToast({
    title:err
  });
  throw {i:item.index,err}
}
