// pages/component/tag-list/tag-list.js
const app = getApp();
import TLH from '../../components/template/help/tag-list-help'
Component(app.BTAB({
  properties: {
    tagList:{
      type:Array,
      value:[],
      observer:function (n,o){
        setTagJson.call(this,n);
      }
    },
    idKey:{ //接口的goods_id实际字段
      type:String,
      value:"goods_id"
    },
    pathKey:{ //接口的标签路径实际字段
      type:String,
      value:"pic_path"
    },
    goods_id:{
      type:Number,
      value:0,
    }, 
    boxStyle:{
      type:String,
      value:""
    },
  }, 
  data: {
    tagJson:{}
  }, 
  methods: {
    loadTag(e){
      TLH.loadTag(e,this);
      // let dataset = e.currentTarget.dataset || {};
      // let id = dataset.id;
      // let index = dataset.index;
      // let width = e.detail.width;
      // let height = e.detail.height;
      // let key = `tagJson.${id}[${index}].width`;
      // let key2 = `tagJson.${id}[${index}].height`;
      // this.setData({
      //   [key]: width,
      //   [key2]: height
      // })
    }
  }
}))


function setTagJson(tagList){
  let tagJson = this.data.tagJson;
  let pathKey = this.data.pathKey;
  let idKey = this.data.idKey;
  tagJson = TLH.setTagJson({tagList,tagJson,pathKey,idKey})
  this.setData({
    tagJson
  })
  // let tagJson = this.data.tagJson || {};
  // let pathKey = this.data.pathKey||"pic_path";
  // let idKey = this.data.idKey||"goods_id";
  // tagList && tagList.forEach(item => {
  //   let urlTemp = item[pathKey];
  //   let keyIndex = urlTemp.lastIndexOf("/");
  //   let urlKey = urlTemp.slice(keyIndex + 1);
  //   let goods_id = item[idKey];
  //   if (!(tagJson[goods_id] instanceof Array)){
  //     tagJson[goods_id] = [];
  //   }else{
  //     for(let i = 0; i < tagJson[goods_id].length; i++){
  //       if(tagJson[goods_id][i].pic_key == urlKey){  //同一个goods_id下存在相同的图片，不再添加
  //         return;
  //       }
  //     }
  //   }
  //   tagJson[goods_id].push({
  //     path: urlTemp,
  //     pic_key: urlKey
  //   })
  // })
  // this.setData({
  //   tagJson: tagJson
  // })
  // console.log("tagJson",tagJson);
}