import WxApi from "../../../../../../common/utils/wxapi/index";
const App = getApp();
Page(App.BP({
  data: {
    specInfoList: [], // 所有的规格列表
    selectedSpecInfoList: [ // 已选择的规格列表
      // { 
      //   name: "性价比",
      //   specList: [{
      //       specId: 1,
      //       specName: "高"
      //     },
      //     {
      //       specId: 2,
      //       specName: "中"
      //     },
      //     {
      //       specId: 3,
      //       specName: "低"
      //     }
      //   ]
      // },
      // {
      //   name: "颜色",
      //   specList: [{
      //       specId: 1,
      //       specName: "红"
      //     },
      //     {
      //       specId: 2,
      //       specName: "蓝"
      //     },
      //     {
      //       specId: 3,
      //       specName: "白"
      //     }
      //   ]
      // }
    ],
    selectedSpecInfoRef: { // 已选择的规格字典
      // 5: { // "specCatId"
      //   1: "白色" // specId:specName
      // },
    },
    productList: [],
    invalid:false,
  },
  onLoad(options) {
    this.options = options;
  }, 
  onReady(){
    this.actProductList = this.selectComponent('#act-product-list');
    this.actProductList.init(this.options)
    this.onShowed = true;
  },
  onShow(){
    if(this.options.fromType != 'activity'){
      this.onShowed && this.actProductList.getSpecCategoryInfo();
    }
  },
}))