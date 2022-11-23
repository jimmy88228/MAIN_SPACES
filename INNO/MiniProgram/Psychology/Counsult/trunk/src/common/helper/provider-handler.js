import SMH from "./show-msg-handler.js";
const providerConfig = {
	// // 授权oauth，分享 share
	// weixin: "weixin",
	// qq: "qq",
	// sinaweibo: "sinaweibo",
	// xiaomi: "xiaomi",
	// univerify: "univerify",
	// apple: "apple",
	// // 支付payment
	// alipay: "alipay",
	// wxpay: "wxpay",
	// baidu: "baidu",
	// appleiap: "appleiap",
	// "google-pay": "google-pay",
	// paypal: "	paypal",
	// stripe: "stripe",
	// // 推送 push
	// unipush: "unipush",
	// igexin: "igexin",
	// mipush: "mipush"
}
class prociderManager {
  static getInstance() {
    if (!prociderManager.instance) {
      prociderManager.instance = new prociderManager();
    }
    return prociderManager.instance;
  }
  constructor() { }
	get(service){ 
		//#ifdef MP
		return this.provider(service); 
		//#endif

		//#ifdef H5 
		return Promise.resolve();
		//#endif  
	}
	provider(service){
		return new Promise((rs, rj)=>{
			if(service){
				if(providerConfig[service]){
					return rs(providerConfig[service]);
				}
				uni.getProvider({
				    service: service,
				    success: function (res) {
								let provider = res.provider || [];
								if(provider[0]){
									providerConfig[service] = provider[0];
									return rs(provider[0]);
								} else {
									return rj();
								}
				    },
						fail(error){
							SMH.showToast({
								title: error.errMsg
							})
							return rj();
						}
				})
			} else {
				SMH.showToast({
					title: "service 类型不能为空"
				})
				return rj();
			}
		})
	}
}

export default prociderManager.getInstance();
