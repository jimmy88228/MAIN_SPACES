// pages/component/indexHead/storeHead/storeHead.js

import storeH from "../../../common/helper/handle/storeHandle.js";
let app = getApp();
Component(app.BTAB({ 
  properties: {

  }, 
  data: {

  }, 
  methods: {

  },
  pageLifetimes: {
    show: function() {
      getStoreInfo.call(this);
    },
  }
}))

function getStoreInfo(){
   
  let storeInfo = storeH.storeInfo||{};
  // app.StorageH.get(STORE_KEY) || {};
  console.log('storeId',this.storeId,storeInfo.storeId,storeInfo)
  if(!this.storeId || (this.storeId != storeInfo.storeId)){
    this.storeId = storeInfo.storeId;
    this.setData({
      storeInfo
    })
  } 
}