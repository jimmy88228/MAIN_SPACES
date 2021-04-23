import PageJump from "../../../../helper/page-jump.js";
import strH from "../../../../helper/handle/strHandle.js"
const app = getApp();
Component(app.BTAB({
  options: {
    addGlobalClass: true
  },
  properties: {
    page_module_list: {
      type: Object,
      value: {}
    },
    tagVal: {
      type: Object,
      value: {},
    },
    tagList: {
      type: Object,
      value: {},
    },
    m_index: {
      type: Number,
      value: 0,
    },
    m_item: {
      type: Object,
      value: {},
      observer: function(n, o) {
        console.log("广告导航", JSON.parse(JSON.stringify(n)))
        this.setData({
          m_data: n
        })
        init.call(this);
      }
    },
    img_url: {
      type: String,
      value: '',
    },
    goodsTagList: {
      type: Object,
      value: {},
    },
    sysConf: {
      type: Object,
      value: {}
    },
    showSalesVolume:{
      type:Boolean,
      value:false
    }
  },
  data: {
    showInit:true,
    initArr:[],
    default_bg: "#EB213A",
    m_data:[],
    active: 0,
    detail_json: {}
  },
  methods: {
    changeNav(e){
      let dataset = e.currentTarget.dataset || {};
      let index = dataset.index || 0; 
      let detail_list = this.properties.detail_list || []
      let detail = detail_list[index] || {};
      let params = {
        index: index,
        acId: detail.activity_id,
        bindType: this.data.page_module_list.bindType || 15,
        data: this.data.page_module_list,
        module_num: this.data.m_index
      }
      this.triggerEvent('singleSwitch', params);
      if(index != this.data.active){
        this.setData({
          active: index
        })
      }
    }
  }
}))

function init() {
  let data = this.properties.page_module_list || [];
  this.setData({
    detail_list: data.detail_list || []
  })
  initAdDetail.call(this, data);
}
function initAdDetail(data){
  let detail_list = data.detail_list || [];
  let detail_json = {};
  for(let i = 0; i < detail_list.length; i++){
    let activity_id = detail_list[i].activity_id || 0
    let item = detail_list[i];
    if(data.moduleType == 5){
      detail_list[i] = {
        ...detail_list[i],
        module_id: data.moduleId,
        moduleStyles: item.module_styles,
        showGoodsPrice: item.show_goods_price,
        showGoodsName: item.show_goods_name,
        catType: item.fund_type,
        CatId: item.related_id,
        tag: item.tag,
        bindType: data.bindType // module bindType; 不同活动bind_type
      }
    }
    if(activity_id){
      // if(!detail_json[activity_id]) detail_json[activity_id] = []
      detail_json[activity_id] = detail_list[i];
    }
  }
  this.setData({
    detail_json: detail_json
  })
}





// function checkInit() {
//   let data = this.data.m_data || [];
//   if (data && data.length==0) {
//     setInitArr.call(this);
//     return true
//   }else{
//     installArr.call(this);
//   }
//   this.setData({
//     showInit: false
//   })
//   return false
// }

// function setInitArr() {
//   if (this.data.setInitAlready) {
//     return
//   }
//   this.setInitAlready = true;
//   let initArr = [];
//   let data = this.data.page_module_list || {};
//   let style = data.moduleStyles || '';
//   if (style == '1' || style == '4' || style == '6') {
//     initArr = new Array(1).fill({});
//   } else if (style == '2') {
//     initArr = new Array(2).fill({});
//   } else if (style == '3' || style == '5') {
//     initArr = new Array(3).fill({});
//   }
//   this.setData({
//     initArr: initArr,
//     detail_list: data.detail_list || []
//   })
//   // console.log('初始化', initArr, data)

// }
// function installArr(){
//   let data = this.data.page_module_list || {};
//   let itemList = data.moduleItem && data.moduleItem.itemList || [];
//   //
//   if(itemList.length > 0){
//     let m_item = this.data.m_item || [];
//     sortByArr.call(this, m_item, itemList);
//   }
// }

// function sortByArr(m_item, keyList){
//   let m_json = strH.createJsonByKey(m_item,"goods_id");
//   let data = []
//   for (let i = 0; i < keyList.length; i++){
//     let goodsId = keyList[i].goods_id;
//     if(!m_json[goodsId]){
//       continue
//     }
//     data.push(m_json[goodsId] || {})
//   }
//   this.setData({
//     m_data: data 
//   })
// }