// components/custom/embed_custom/embed_custom.js
import PH from "../../../common/helper/handle/paramsHandle.js";
const app = getApp();
Component(app.BTAB({
  properties: {
    m_item: {
      type: Array,
      value: []
    },
    type:{
      type:String,
      value:""
    }
  },
  data: {
    navList: [],
    swiperCurr: 0,
    tabCurr: 0,
    isTabPage: false,
    sysConf: {},
  },

  _options: {},
  attached() {
    this.current_customName = '';
    this.signStatus = true;
    app.sysTemConfig().then(sysConf => {
      this.setData({
        sysConf: sysConf
      })
    })
  },
  methods: {
    onUnloadFn() {
      this.current_customName && this[this.current_customName].unListen();
    },
    getPageData(options= {}) {
      options = options || {};
      // this.options = JSON.parse(JSON.stringify(options));
      // this._options = JSON.parse(JSON.stringify(options));
      // if (this._options.scene) {
      //   analysisParams.call(this);
      // } else {
      //   console.log("不是扫码进入的");
      //   getCustomTabRequest.call(this, this._options);
      // } 
      getItemData.call(this, options);
      if (app.LM.isLogin) {
        this.setData({
          isLogin: true
        })
        return;
      }
      this.listenLoginStatuId = app.EB.listen("LoginStateChange", () => {
        this.setData({
          isLogin: app.LM.isLogin
        })
      });
    }, 
    onUnloadFn() {
      this.current_customName && this[this.current_customName].unListen();
    },
    _noFn() {},
  },

  pageLifetimes: {
    hide() {
      if (this.listenLoginStatuId) {
        app.EB.unListen("LoginStateChange", this.listenLoginStatuId);
      }
      if (this.sceneParamsChangeId) {
        app.EB.unListen("SceneParamsChange", this.sceneParamsChangeId);
      }
    }
  }, 
}))

//获取数据
function getItemData(options = {}) {
  // test.call(this);
  let ModuleList = options && options.ModuleList || [];
  ModuleList && mapData.call(this, ModuleList);
  this.setData({
    ImgDomain: options.ImgDomain || '',
    ModuleList: options.ModuleList || [],
  })
  console.log('======', this.data.ModuleList, options)
}


function mapData(list = []) {
  for (let item in list) {
    let data = list[item].ItemList || list[item].itemList || [];
    if (data.length > 0) {
      data.forEach((item, index) => {
        let extend_content = item.extend_content || "";
        let func_type = item.func_type || "";
        item.customData = {
          func_type: func_type,
          related_id: item.related_id || '',
          link_url: item.link_url,
          stringJump: extend_content,
          tag:item.tag||""
        }
        // console.log(item.customData, "customData");
        if (extend_content && func_type == "RD") {
          let map_data = extend_content.replace(/'/g, '"');
          map_data = JSON.parse(map_data);
          for (let k in map_data) {
            map_data[k].x = map_data[k].x * 100;
            map_data[k].y = map_data[k].y * 100;
            map_data[k].w = map_data[k].ex * 100 - map_data[k].x;
            map_data[k].h = map_data[k].ey * 100 - map_data[k].y;
          }
          item.map_data = map_data;
        }
      })
    }
  }
}

//扫码进入
// function analysisParams() {
//   let paramsJson = app.PH.paramsJson();
//   app.SHP.getParams(["page_id", "staff_code", "staffCode"]).then((params) => {
//     console.log(params, "000000 params");
//     this._options = {
//       ...this._options,
//       ...params
//     }
//     console.log(this._options, "000000000this._options")
//     getCustomTabRequest.call(this, this._options);
//   })
//   // this.sceneParamsChangeId = app.EB.listen('SceneParamsChange', () => {
//   //   if (paramsJson.page_id) {
//   //     this._options.page_id = paramsJson.page_id;
//   //   }
//   //   if (paramsJson.staff_code) {
//   //     this._options.staffCode = paramsJson.staff_code;
//   //   }
//   //   getCustomTabRequest.call(this, this._options);
//   // }) 
// } 
 