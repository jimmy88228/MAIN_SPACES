import QQMapWX from "../../support/tools/qqmap-wx1.2/qqmap-wx-jssdk.min";
import StorageH from "./storageHandle";
import Conf from "../../../conf"
const LOCATION_STOAGE = "LOCATION_STOAGE";

const LOCATION_KEY = Conf.ext_params && Conf.ext_params.qq_map_api_key || "IQABZ-UE2C2-F7OU6-CGV3S-D74G6-ERFMR";

//qqmap-wx-jssdk 该功能只对接目前用到API，需要可到腾讯位置服务查看
class WxMap {
  static getInstance() {
    if (!WxMap.instance) {
      WxMap.instance = new WxMap();
    }
    return WxMap.instance;
  }
  constructor() {
    this._qqmapsdk = new QQMapWX({
        key: LOCATION_KEY
    });
  }
  get qqmapsdk(){
    return this._qqmapsdk || new QQMapWX({
        key: LOCATION_KEY
    });
  }
  get locationInfo(){
    return StorageH.get(LOCATION_STOAGE);
  }
  reverseGeocoder(location){ // location : latitude, longitude
    return new Promise((rs, rj)=>{
      if(this.locationInfo){
        return rs(this.locationInfo);
      }
      this.qqmapsdk.reverseGeocoder({
        location: location,
        success(res){
          console.log("reverseGeocoder", res)
          if(res.status == 0){
            StorageH.set(LOCATION_STOAGE, res.result, 30);
            rs(res.result);
          } else {
            console.log(res.message);
          }
        },
        fail(error){
          console.log('error',error);
          rj(error);
        }
      })
    })
    
  }
}


export default WxMap.getInstance();