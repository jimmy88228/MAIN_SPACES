// pages/component/custom/module_ branches/multiActivities.js
import PageJump from "../../../../helper/page-jump.js";
const app = getApp();
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
        // console.log(this.data.m_index, '助力秒杀数据', n);
        // if (!n || (this.initAlready && this.initAlready[this.data.current_acty])) {
        //   return
        // }
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
    ac_conf:app.Conf.style.n_sk_color,
  },
  ready(){
    let l_bg_color = app.getColor(this.data.ac_conf.theme_color, 7, 164, 234, 1) || '';
    let d_bg_color = app.getColor(this.data.ac_conf.theme_color, 6, 145, 205, 1) || '';
    let rightbutton = this.data.brand_info.icon_url + "micro_mall/rightbutton.png";
    let sk_logo = this.data.brand_info.icon_url + "micro_mall/sec_kill/sk_logo.png";

    this.setData({
      l_bg_color,
      d_bg_color,
      rightbutton,
      sk_logo
    })
  },
  methods: {
    handle_change(e) { //swiper 改变响应
      let that = this;
      let dataset = e.currentTarget.dataset || {};
      let obj = {};
      if (dataset.type && dataset.type == 'swiper') { 
        let index_sort = e.detail.current;
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
      // let that = this;
      // let type = e.type;
      // let module = this.data.page_module_list||{};
      // if(module.moduleStyles!='8' && module.showMore!='1')return;
      let dataset = e.type == "clickcallback" ? (e.detail || {}) : (e.currentTarget.dataset || {});
      let goodsId = dataset.goods_id || "";
      if (dataset.type == 'detail' && (!goodsId))return
      dataset.name = "SECKILLHELP"
      PageJump(dataset);
    },
    unListen() {
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
      let height = res[0].height > 75 ? res[0].height : 75;
      that.data.mod_height_box = that.data.mod_height_box > height ? that.data.mod_height_box : height; //取最大
      that.setData({
        mod_height_box: that.data.mod_height_box || '75'
      })
      // console.log('获取swiper高度', that.data.page_module_list.moduleId, that.data.current_acty, that.data.mod_height_box, that.checked_height_box);
    }
  })

}



function init() {
  let module_list = this.data.page_module_list || {};
  if (module_list.moduleStyles == "8"){
    let moduleItem = module_list.moduleItem || {};
    this.setData({
      itemList: moduleItem.itemList
    })
  }else if (module_list.bindType == 9) {
    let detailListObj = this.data.detailListObj || {};
    let current_acty = 0;
    let init = checkInit.call(this);
    if (!this.data.current_acty) { //初始化
      current_acty = detailListObj && detailListObj[0] && detailListObj[0].activity_id || 0;
      this.initAlready = this.initAlready || {};
      this.setData({
        current_acty: current_acty,
        current_mod_sort: 0
      })
      if (init)return
    } else {
      if (init)return
    }
    initHeight.call(this);
  }
}

// 高度boxs的key value初始化
function initHeight() {
  let id = '#marquee_' + this.data.current_mod_sort;
  if (this.checked_height_box && this.checked_height_box[id]) {
    return
  };
  getHeight.call(this);
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
    current_mod_sort:this.data.current_mod_sort||0
  });
  // if (this.data.m_item && this.data.m_item[this.data.current_acty] && this.data.m_item[this.data.current_acty].length>0){
    // return //有数据 return
  // }
  // else if (this.initAlready[this.data.current_acty]){
  //   return //加载过 return
  // }
  let params = {
    index: obj.index_sort,
    acId: obj.activity_id,
    bindType: this.data.page_module_list.bindType || 9,
    data: this.data.page_module_list,
    module_num: this.data.m_index
  }
  this.triggerEvent('singleSwitch', params);
}
 

function checkInit() {
  let data = this.data.m_item;
  if (data && (JSON.stringify(data) == '{}' || JSON.stringify(data) =='[{}]')) {
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
  } else if (style == '3' || style == '5' || style == '7') {
    initArr = new Array(3).fill({});
  }
  this.setData({
    initArr: initArr
  })
}
