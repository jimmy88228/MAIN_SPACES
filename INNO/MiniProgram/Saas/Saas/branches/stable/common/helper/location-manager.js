import AS from "./authorize-set.js";
import WxApi from "./wx-api-helper.js";
import SConf from "./handle/getSystemConfig.js"
import EB from "../support/tools/event-bus.js"
import LM from "../manager/login-manager.js"
import StorageH from "./handle/storageHandle";
import {
  StoresForA
} from "../manager/log-map.js"
const Check_Name = 'scope.userLocation';
//千店一面Manager
class locationManager {
  static getInstance() {
    if (!locationManager.instance) {
      locationManager.instance = new locationManager();
    }
    return locationManager.instance;
  }
  constructor() { //退出小程序清空状态
    this._loc_obj = {}; //_loc_obj : checked 访问状态  //status 授权状态
    this._lat = "";
    this._lon = "";
  }
  checkLoctionFn() {
    console.log('checkLoctionFn',this._loc_obj)
    let that = this;
    let page = getCurrentPages().pop();
    let route = page && page.route || '';
    let p = new Promise(function(rs, rj) {
      if (that._loc_obj && that._loc_obj.checked) { //检测过 
        if (route && StoresForA[route] && StoresForA[route]['check']) { //指定页面
          return that.checkStoresForA(that, rs, rj, route, StoresForA[route]['reset'] || false);
        }
        return rs(that._loc_obj);
      };
      if (!that._loc_obj.checked) {
        that.setStatusObj(1);
        if (route && StoresForA[route] && StoresForA[route]['check']) { //指定页面
          return that.checkStoresForA(that, rs, rj, route, StoresForA[route]['reset'] || false);
        }
        return rs(that._loc_obj);
      };
    });
    return p;
  }

  setStatusObj(type = 1, boolean_val = false) {
    if (!this._loc_obj.checked) {
      this._loc_obj.checked = 1;
    }
    if (type == 2) {
      this._loc_obj.status = boolean_val || false;
      if (false && this._loc_obj.status) {
        this.reqLocation();
      }
      //   设缓存
      let location = StorageH.get("LOCATION_STATUS") || {};
      location.checked = this._loc_obj.checked || 0;
      location.status = this._loc_obj.status || false;
      StorageH.set("LOCATION_STATUS", location);
    };
  }

  getLocationXyz(reflash = false) { //获取地理位置 
    return getLocationXyzFn.call(this, this);
  }

  reqLocation() {
    if (this.reqed) {
      return
    }
    return getLocationXyzFn.call(this, this);
  }

  checkStoresForA(that, rs, rj, route = '', reset = false) {
    let prop = 'is_qiandian_side';
    that._loc_obj.storesForAChecked = that._loc_obj.storesForAChecked || {};
    // that._loc_obj.storesForAChecked[route] = true;
    return sysTemConfig.call(that, prop).then(res => { //读配置 
      let value = res.Value || false;
      if (value != 1 || !LM.userToken) {
        that._loc_obj.storesIsOpen = 0;
        let obj = {
          'storesForAOpen': 0
        };
        EB.call('storesForA', obj);
        return rs(that._loc_obj);
      } else {
        that._loc_obj.storesIsOpen = 1;
        if (reset) {
          if (!that._loc_obj.storesForAChecked[route]) {
            that._loc_obj.storesForAChecked[route] = true; 
            console.log('千面reset页第一次');
            AS.checkAuthorize(Check_Name, '', '', true);
          } else {
            console.log('千面reset页缓存');
            return getLocationXyzFn.call(that, that, rs);
          }
        } else {
          if (!that._loc_obj.storesForAChecked[route]) {
            that._loc_obj.storesForAChecked[route] = true;
            console.log('千面页第一次');
            return AS.checkAuthorize(Check_Name).then(res=>{              
              console.log('回调',res);
              return getLocationXyzFn.call(that, that, rs);
            }).catch(e=>{
              console.log('catch',e);
            }); 
          } else {
            let obj = {};
            obj.lat = that.lat;
            obj.lon = that.lon;
            obj.isUseLocation = (!!(that.lat && that.lon)) ? 1 : 0; 
            console.log('千面页缓存',obj);
            EB.call('storesForA', {
              storesForAOpen: that._loc_obj.storesIsOpen || 0,
              data: obj
            });
            return rs(res);
          } 
        }
      };
    });
  }

  get lat() {
    if (!this._lat) {
      let s_lat = StorageH.get('LOCATION') && StorageH.get('LOCATION').lat || 0;
      if (s_lat && !this._loc_obj.status) {
        this._lat = s_lat;
      }
    }
    return this._lat || 0;
  }
  get lon() {
    if (!this._lon) {
      let s_lon = StorageH.get('LOCATION') && StorageH.get('LOCATION').lon || 0;
      if (s_lon && !this._loc_obj.status) {
        this._lon = s_lon;
      }
    }
    return this._lon || 0;
  }
  get loc_obj() {
    return this._loc_obj || {};
  }

}

function getLocationXyzFn(that, rs) {
  this.reqed = true; //只初始化一次坐标标识  提供给请求头 
  return WxApi.getLocation({
    type: 'gcj02',
  }).then(res => {
    let lat = res.latitude || 0;
    let lon = res.longitude || 0;
    let isUseLocation = 1;
    return returnXyzFn.call(that, lat, lon, isUseLocation, that, rs);
  }).catch(e => {
    console.log('地理error:', e);
    return returnXyzFn.call(that, 0, 0, 0, that, rs);
  });
}


function returnXyzFn(lat_val = 0, lon_val = 0, isUse_val = 0, that, rs) {
  let lat = lat_val || 0;
  let lon = lon_val || 0;
  let isUseLocation = isUse_val || 0;
  that._lat = lat || 0;
  that._lon = lon || 0;
  that._loc_obj.lat = lat;
  that._loc_obj.lon = lon;
  that._loc_obj.isUseLocation = isUseLocation;
  let location = StorageH.get("LOCATION") || {};
  location.lat = lat;
  location.lon = lon;
  StorageH.set("LOCATION", location);
  if (rs && typeof rs == 'function') {
    let obj = {
      'storesForAOpen': 1,
      'data': that._loc_obj
    };
    EB.call('storesForA', obj);
    return rs({
      lat,
      lon,
      isUseLocation
    });
  } else {
    return Promise.resolve({
      lat,
      lon,
      isUseLocation
    });
  }
}

function sysTemConfig(params) {
  if (this._loc_obj.storesIsOpen == 1) {
    let obj = {
      Value: 1
    };
    return Promise.resolve(obj);
  } else if (this._loc_obj.storesIsOpen == 0) {
    let obj = {
      Value: 0
    };
    return Promise.resolve(obj);
  }
  return SConf.getSysConfig(params);
}

export default locationManager.getInstance();