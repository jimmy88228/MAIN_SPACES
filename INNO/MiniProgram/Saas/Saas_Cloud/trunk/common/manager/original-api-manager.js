import WxApi from '../helper/wx-api-helper';
//官方API整理 方便查阅 (请陆续完善
class OriginalApiManager {
    static getInstance(){
      if(!OriginalApiManager.instance){
        OriginalApiManager.instance =  new OriginalApiManager();
      }
      return OriginalApiManager.instance;
    }

    constructor(){}
    
    scanCode({onlyFromCamera=true,scanType=[]}){ //扫码
        return API.scanCode(...arguments);
    }

    requestPayment({pay_info={}}){ //支付
        return API.requestPayment(...arguments);
    }
 
}

const API = {
    scanCode({onlyFromCamera,scanType}){
        // 参数:
        // 属性	            类型	         默认值	                 必填	  说明
        // onlyFromCamera	boolean	        false	                否	    是否只能从相机扫码，不允许从相册选择图片	1.2.0
        // scanType	        Array.<string>	['barCode', 'qrCode']	否	    扫码类型	1.7.0

        // 回调函数:
        // result	string	所扫码的内容
        // scanType	string	所扫码的类型
        // charSet	string	所扫码的字符集
        // path	    string	当所扫的码为当前小程序二维码时，会返回此字段，内容为二维码携带的 path
        // rawData	string	原始数据，base64编码
        return WxApi.scanCode({
            onlyFromCamera, //是否只能从相机扫码，不允许从相册选择图片
            scanType,       //扫码类型barCode/qrCode
        })
    },
    requestPayment({pay_info}){
        // 属性	类型	 默认值	    必填	 说明
        // timeStamp	string		是	    时间戳，从 1970 年 1 月 1 日 00:00:00 至今的秒数，即当前的时间
        // nonceStr	    string		是	    随机字符串，长度为32个字符以下
        // package	    string		是	    统一下单接口返回的 prepay_id 参数值，提交格式如：prepay_id=***
        // signType 	string	MD5	否  	签名算法，应与后台下单时的值一致
        // paySign	    string		是	    签名，具体见微信支付文档
        return WxApi.requestPayment({
            'timeStamp': pay_info.timeStamp + '',
            'nonceStr': pay_info.nonceStr,
            'package': pay_info.package,
            'signType': pay_info.signType,
            'paySign': pay_info.sign,
        })
    },
 
    
}
  
export default OriginalApiManager.getInstance();