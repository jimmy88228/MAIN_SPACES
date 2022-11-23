import LM from "../manager/login-manager.js";
class baseManager {
    // static getInstance() {
    //     if (!baseManager.instance) {
    //         baseManager.instance = new baseManager();
    //     }
    //     return baseManager.instance;
    // }
		constructor(pageOps) {
			console.log("pageOps", pageOps);
			return this.initPage(pageOps);
		}
		
		initPage(pageOps){
			this.onLoad = (...args)=> {
				pageOps.onLoad && pageOps.onLoad.call(this, ...args);
			}
			this.onShow = (...args)=> {
				pageOps.onShow && pageOps.onShow.call(this, ...args);
			}
			this.onReady = (...args)=> {
				pageOps.onReady && pageOps.onReady.call(this, ...args);
			}
			this.onHide = ()=> {
				try {
					getPageState.call(this, "onHide");
				} catch (e) {}
				pageOps.onHide && pageOps.onHide.call(this);
			}
			this.onUnload = ()=> {
				try {
					getPageState.call(this, "onUnload");
				} catch (e) {}
				pageOps.onUnload && pageOps.onUnload.call(this);
			}
			this.onShareAppMessage = (...args)=> {
				let shareData = pageOps.onShareAppMessage && pageOps.onShareAppMessage.call(this, ...args);
				shareData.path = shareData.path || pageOps.route;
				if(LM.userToken){
					shareData.path = shareData.path.indexOf("?") != -1 ? shareData.path + "&userToken=" + LM.userToken : shareData.path + "?userToken=" + LM.userToken;
				};
				shareData.title = shareData.title + "aaaaaa";
				console.log("base page shareData",shareData)
				return shareData;
			}
			this.onShareTimeline = (...args)=>{
				let shareData = (this.onShareAppMessage && this.onShareAppMessage()) || {};
				let shareTimeData = (pageOps.onShareTimeline && pageOps.onShareTimeline.call(this, ...args)) || {};
				let path = shareData.path || '';
				if(path){
					shareData.query = path.substr(parseInt(path.indexOf("?")) + 1);
				}   
				return {
					...shareData,
					...shareTimeData
				}
			}
			return {
				...pageOps,
				...this
			};
		}
		// onShow(...args) {
		// 	this.po.onShow && this.po.onShow.call(this, ...args);
		// }
		// onReady(...args){
		// 	this.po.onReady && this.po.onReady.call(this, ...args);
		// }
		// onHide() {
		// 	try {
		// 		getPageState.call(this, "onHide");
		// 	} catch (e) {}
		// 	this.po.onHide && this.po.onHide.call(this);
		// }
		// onUnload() {
		// 	try {
		// 		getPageState.call(this, "onUnload");
		// 	} catch (e) {}
		// 	this.po.onUnload && this.po.onUnload.call(this);
		// }
		// onShareAppMessage = function(...args){
		// 	let shareData = this.po.onShareAppMessage && this.po.onShareAppMessage.call(this, ...args);
		// 	shareData.path = shareData.path || this.po.route;
		// 	if(LM.userToken){
		// 		shareData.path = shareData.path.indexOf("?") != -1 ? shareData.path + "&userToken=" + LM.userToken : shareData.path + "?userToken=" + LM.userToken;
		// 	};
		// 	shareData.title = shareData.title + "aaaaaa";
		// 	console.log("base page shareData",shareData)
		// 	return shareData;
		// }
		// onShareTimeline = function(...args){
		// 	let shareData = (this.onShareAppMessage && this.onShareAppMessage()) || {};
		// 	let shareTimeData = (this.po.onShareTimeline && this.po.onShareTimeline.call(this, ...args)) || {};
		// 	let path = shareData.path || '';
		// 	if(path){
		// 		shareData.query = path.substr(parseInt(path.indexOf("?")) + 1);
		// 	}   
		// 	return {
		// 		...shareData,
		// 		...shareTimeData
		// 	}
		// }
		
}

// export default baseManager;

class pageManage extends baseManager{
	constructor(ops) {
		super(ops);
	}
}
Page.pageManage = pageManage;
