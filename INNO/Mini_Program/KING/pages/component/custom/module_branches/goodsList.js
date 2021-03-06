import PageJump from "../../../../helper/page-jump.js";
import strH from "../../../../helper/handle/strHandle.js"
const app = getApp();
Component(app.BTAB({
  options: {
    addGlobalClass: true
  },
  properties: {
    page_module_list: { // bindType = 15时，传入为单个活动的detail
      type: Object,
      value: {},
      observer:function(n){
        console.log("商品module", n);
      }
    },
    tagVal: {
      type: Object,
      value: {},
    },
    tagList: {
      type: Object,
      value: {},
    },
    m_item: {
      type: Object,
      value: {},
      observer: function(n, o) {
        console.log("商品数据", JSON.parse(JSON.stringify(n)))
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
    m_data:[]
  },
  methods: {
    goLink: function(e) {
      let that = this;
      let type = e.type;
      let dataset = e.type == "clickcallback" ? (e.detail || {}) : (e.currentTarget.dataset || {});
      let goods_id = dataset.goods_id || 0;
      if (!goods_id)return
      let page_module_list = this.properties.page_module_list || {};
      if(page_module_list.bindType == 1 ){
        dataset.name = "GOODS"
      } else if (page_module_list.bindType == 2){
        dataset.name = "GOODS_LIST"
      }
      PageJump(dataset);
    },
  }
}))

function init() {
  let init = checkInit.call(this);
  if (init) return
  let page_module_list = this.data.page_module_list || '';
  if (page_module_list.moduleStyles == '4') {
    let id = '#marquee'
    let marquee = this.selectComponent(id);
    marquee && marquee.initScroll(this.data.m_data, page_module_list);
  }
}




function checkInit() {
  let data = this.data.m_data || [];
  if (data && data.length==0) {
    setInitArr.call(this);
    return true
  }else{
    installArr.call(this);
  }
  this.setData({
    showInit: false
  })
  return false
}

function setInitArr() {
  if (this.data.setInitAlready) {
    return
  }
  this.setInitAlready = true;
  let initArr = [];
  let data = this.data.page_module_list || {};
  let style = data.moduleStyles || '';
  if (style == '1' || style == '4' || style == '6') {
    initArr = new Array(1).fill({});
  } else if (style == '2') {
    initArr = new Array(2).fill({});
  } else if (style == '3' || style == '5') {
    initArr = new Array(3).fill({});
  }
  this.setData({
    initArr: initArr
  })
  // console.log('初始化', initArr, data)

}
function installArr(){
  let data = this.data.page_module_list || {};
  let itemList = data.moduleItem && data.moduleItem.itemList || [];
  //
  if(itemList.length > 0  && (data.bindType != 15 || (data.bindType == 15 && data.bind_type == 1))){
    let m_item = this.data.m_item || [];
    sortByArr.call(this, m_item, itemList);
  }
}

function sortByArr(m_item, keyList){
  let m_json = strH.createJsonByKey(m_item,"goods_id");
  let data = []
  for (let i = 0; i < keyList.length; i++){
    let goodsId = keyList[i].goods_id;
    if(!m_json[goodsId]){
      continue
    }
    data.push(m_json[goodsId] || {})
  }
  console.log("sortByArr data", data)
  this.setData({
    m_data: data 
  })
}