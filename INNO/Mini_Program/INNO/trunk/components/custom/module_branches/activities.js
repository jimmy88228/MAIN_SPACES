// pages/component/custom/module_ branches/activities.js
import PageJump from "../../../common/helper/page-jump.js";
const app = getApp();
function hasPro(obj){
  if(!obj)return false;
  for(let i in obj){
    return true
  }
  return false;
}
Component(app.BTAB({
  options: {
    addGlobalClass: true,
  },
  properties: {
    m_index: {
      type: Number,
      value: 0,
    },
    m_item: {
      type: Object,
      value: {},
      observer: function(n) {
        if (!n || (this.initAlready && this.initAlready[this.data.current_acty]) || !hasPro(n)) {
          return
        }
        let _timer = setTimeout(() => {
          init.call(this);
          clearTimeout(_timer);
        }, 100)
      }
    },
    moduleId: {
      type: String,
      value: '',
    },
    page_module_list: {
      type: Object,
      value: {},
    },
    detailListObj: {
      type: Object,
      value: {},
    },
    img_url: {
      type: String,
      value: '',
    },
    actCountDown: {
      type: Object,
      value: {},
    },
    sysConf: {
      type: Object,
      value: {},
    },
  },
  data: {
    current_mod_sort: 0,
    mod_height_box: {},
    showInit: true,
    initArr: [],
    default_bg: "#EB213A",
  },
  methods: {
    handle_change(e) { //swiper 改变响应
      let that = this;
      let dataset = e.currentTarget.dataset || {};
      let obj = {};
      if (dataset.type && dataset.type == 'swiper') {
        let index_sort = e.detail.current;
        let m_sort = dataset.m_sort || 0;
        let activity_id = this.data.detailListObj[index_sort].activity_id || 0;
        obj = {
          index_sort,
          activity_id,
          type: 'swiper'
        };
        handle_change_switch.call(that, obj); //响应效果
      } else { //点击
        if (this.isLoadingTab) {
          return
        }
        throttleFn.call(this);
        let index_sort = dataset.index_sort || 0;
        let activity_id = dataset.activity_id || 0;
        if (this.data.current_mod_sort == index_sort) {
          return
        }
        this.data.current_acty = activity_id;
        this.data.current_mod_sort = index_sort;
        this.setData({
          current_acty: this.data.current_acty,
        });
        // 节流
        longThrottleFn.call(this, () => {
          this.data.current_mod_sort = index_sort;
          this.setData({
            current_mod_sort: this.data.current_mod_sort
          });
        }, 150)
      }
    },

    goLink: function(e) { //秒杀拼团
      let that = this;
      let type = e.type;
      let dataset = e.type == "clickcallback" ? (e.detail || {}) : (e.currentTarget.dataset || {});
      console.log('dataset',dataset)
      let goods_id = dataset.goods_id || "";
      dataset.name = "SECKILL";
      if (dataset.type == 'detail' && !goods_id)return
      let page_module_list = this.data.page_module_list || {};
      if (page_module_list.bindType == 7){
        dataset.name = "SECKILL"
      } else if (page_module_list.bindType == 8){
        dataset.name = "COLLAGE"
      } else if (page_module_list.bindType == 10){
        dataset.name = "PRESALE"
      } else if (page_module_list.bindType == 11){
        dataset.name = "POINT"
      } else if (page_module_list.bindType == 12){
        dataset.name = "BARGAIN"
      } else if (page_module_list.bindType == 14){
        dataset.name = "PACKAGE";
      }
      PageJump(dataset);
    },
    unListen() {
      if (!this.marqueeListen) {
        return;
      }
      // console.log('秒杀拼团--unlisten', this.marqueeListen);
      for (let item in this.marqueeListen) {
        let listenId = 'marquee_' + this.data.moduleId + '_' + item;
        app.EB.unListen(listenId, this.marqueeListen[item]);
        delete this.marqueeListen[item];
      }
      this.marqueeListen = '';
    }
  },
  pageLifetimes: {
    hide() {
      this.unListen();
    }
  },
}))


// 获取swiper高度
function getHeight(acId = 0) {
  let that = this;
  acId = acId || this.data.current_acty || 0;
  let query = this.createSelectorQuery();
  let id = `#marquee_${this.data.current_mod_sort}`;
  query.select(id).boundingClientRect();
  query.exec(function(res) {
    if (res[0]) {
      that.checked_height_box = that.checked_height_box || {};
      that.checked_height_box[id] = that.data.showInit ? false : true;
      let height = res[0].height > 150 ? res[0].height : 150;
      that.data.mod_height_box = that.data.mod_height_box > height ? that.data.mod_height_box : height; //取最大
      that.setData({
        mod_height_box: that.data.mod_height_box || '150'
      })
      // console.log('获取swiper高度', that.data.page_module_list.moduleId, that.data.current_acty, that.data.mod_height_box, that.checked_height_box);
    }
  })

}



function init() {
  if (this.data.page_module_list.bindType == 7) {
    let detailListObj = this.data.detailListObj || {};
    let current_acty = 0;
    let init = checkInit.call(this);
    if (!this.data.current_acty) { //初始化
      current_acty = detailListObj && detailListObj[0] && detailListObj[0].activity_id || 0;
      this.initAlready = this.initAlready || {};
      if (!init) {
        this.initAlready[current_acty] = true;
      }
      this.setData({
        current_acty: current_acty,
        current_mod_sort: 0
      })
      
    } else {
      if (this.initAlready[this.data.current_acty]) { //初始化过
        return
      } else { //点击tab 需要初始化
        this.initAlready = this.initAlready || {};
        this.initAlready[this.data.current_acty] = true;
      }
    }
    initHeight.call(this);
  } else { //拼团
    let id = 'marquee'
    let marquee = this.selectComponent("#marquee");
    marquee && marquee.initScroll(this.data.m_item, this.data.page_module_list, id);
  }
}

// 高度boxs的key value初始化
function initHeight() {
  let id = '#marquee_' + this.data.current_mod_sort;
  if (this.checked_height_box && this.checked_height_box[id]) {
    return
  };
  this.marquee = this.marquee || {};
  this.marquee[this.data.current_mod_sort] = this.selectComponent(id);
  let marquee = this.marquee[this.data.current_mod_sort];
  if (marquee && marquee.initScroll) { //秒杀左右滑动
    initMarquee.call(this, marquee, id);
  } else { //正常样式
    let detailListTemp = JSON.parse(JSON.stringify(this.data.detailListObj));
    let moduleId = this.data.moduleId || 0;
    this.mod_height_box = this.mod_height_box || '';
    this.mod_height_box = 150;
    getHeight.call(this);
  }
}

function longThrottleFn(handleTap, time = 200) {
  this.LoadingHideLock && clearTimeout(this.LoadingHideLock);
  delete this.LoadingHideLock;
  this.LoadingHideLock = setTimeout(() => {
    clearTimeout(this.LoadingHideLock);
    handleTap();
  }, time)
}

function throttleFn() {
  this.isLoadingTab = true
  this.LoadingLock = setTimeout(() => {
    clearTimeout(this.LoadingLock);
    this.isLoadingTab = false
  }, 50)
}

// 秒杀、拼团的tab点击 或 swiper变化函数
function handle_change_switch(obj) {
  this.data.current_acty = obj.activity_id;
  this.data.current_mod_sort = obj.index_sort;
  this.setData({
    current_acty: this.data.current_acty || '',
  });
  if (this.data.m_item && this.data.m_item[this.data.current_acty] && this.data.m_item[this.data.current_acty].length>0){
    return //有数据 return
  } else if (this.initAlready[this.data.current_acty]){
    return //加载过 return
  }
  let params = {
    index: obj.index_sort,
    acId: obj.activity_id,
    bindType: this.data.page_module_list.bindType || 7,
    data: this.data.page_module_list,
    module_num: this.data.m_index
  }
  this.triggerEvent('singleSwitch', params);
  // let min = parseInt(this.data.mod_height_box[obj.activity_id]);
  // if (this.data.mod_height_box[obj.activity_id] && min>150) {
  //   return
  // }
  // let id = '#marquee_' + this.data.current_mod_sort;
  // let marquee = this.marquee[this.data.current_mod_sort] || this.selectComponent(id);
  // if (marquee) {
  //   initMarquee.call(this, marquee);
  // } else {
  //   getHeight.call(this, obj.activity_id);
  // }
}

function initMarquee(marquee, id = '') {  //左右滚动高度回调监听
  if (this.marqueeListen && this.marqueeListen[this.data.current_mod_sort] && id && this.checked_height_box && this.checked_height_box[id]) {
    return;
  }
  this.marqueeListen = this.marqueeListen || {};
  let listenId = 'marquee_' + this.data.moduleId + '_' + this.data.current_mod_sort;
  this.marqueeListen[this.data.current_mod_sort] = app.EB.listen(listenId, () => {
    app.EB.unListen(listenId, this.marqueeListen[this.data.current_mod_sort]);
    getHeight.call(this, this.data.current_acty);
  });
  let base_data = this.data.page_module_list || {}
  base_data.currentId = this.data.current_acty
  marquee && marquee.initScroll(this.data.m_item[this.data.current_acty], base_data, listenId);
}

function checkInit() {
  let data = this.data.m_item;
  // if (typeof data == 'object' && Object.keys(data).length <= 0) { 
  if (data && JSON.stringify(data) == '{}') {
    setInitArr.call(this);
    return true
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
}