import LM from "../../../common/manager/login-manager";
import Smm from "../../../common/helper/show-msg-helper";
const OpenType = {
	UserInfo: "getUserInfo",
	Phone: "getPhoneNumber"
}
const app = getApp();
Component({
	behaviors: [Behavior.BaseBehavior],
	lifetimes: {
		created() {
				Object.defineProperties(this, {
					authPhoneWd: { get: () => this.findView("#authPhoneWdId", "showAuthPhoneWd") }, 
				})
		},
		attached() {
			LM.getWxSessionIdAsync(); 
		},
	},
	properties: {
		auth: {
			type: Boolean,
			value: true,
		},
		openType: {//按钮类型
			type: String,
			value: ""
		},
		actionType: {//按钮类型
			type: String,
			value: ""
		},
		disabled: {//失效按钮
			type: Boolean,
			value: false
		},
		needCheckPhone:{
			type:Boolean,
			value:false
		}
	},
	ready() {
		this.isCanUrPf = !!wx.getUserProfile;
		this.setData({
			isCanUrPf:this.isCanUrPf
		})
		console.log('isCanUrPf',this.data.isCanUrPf)
		// LM.getWxSessionIdAsync();
	},
	data: {},
	methods: {
		onTap(e) {
			if (!app.clickHold("auth",2000)) { return; };
			console.log('已注册',e);
			let openType = this.properties.openType;
			checkBindPhone.call(this).then(()=>{
				// this.triggerEvent("taped", { openType: openType });
				this.triggerEvent("authed", { openType: openType, });
			})
		},
		onAuth(e) {
			console.log('onAuth',e)
			if (!app.clickHold("auth",2000)) { return; };
			let openType = this.properties.openType;
			let detail = e && e.detail || {};
			return checkAuthorize.call(this, openType, detail).then(() => {
				checkBindPhone.call(this).then(()=>{
					this.triggerEvent("authed", { ...detail, openType ,isChange:true });
				})
			}).catch(rs => {
				Smm.showToast({
					title: rs
				})
			});
		},
		onPhoneWd(e){
			if (!app.clickHold("auth",2000)) { return; };
			let detail = e && e.detail || {};
			let openType = this.properties.openType;
			this.triggerEvent("authed", { ...detail, openType ,isChange:true });
		}
	}
})

function checkAuthorize(openType, detail) {
	if (openType == OpenType.UserInfo) {
		// 用户授权
		console.log('用户授权',openType, detail)
		// if (detail.errMsg.indexOf("ok") == -1) {
		if (detail.errMsg && detail.errMsg.indexOf("fail auth deny") != -1) {
			return Promise.reject("用户授权失败");
		} else {
			let actionType = this.data.actionType||"";
			return LM.register(true,{actionType}).ignore(() => {
				let page = getCurrentPages().pop();
				page.checkLoginChange();
				if (!LM.isLogin)
					return Promise.reject("授权注册失败");
			});
		}
	} else if (openType == OpenType.Phone) {
		// 手机授权
		console.log('手机授权',openType, detail)
		if (detail.errMsg.indexOf("ok") == -1) {
			return Promise.reject("手机授权失败");
		} else {
			return bindPhone(LM.sessionId, detail.encryptedData, detail.iv).catch(() => Promise.reject("手机绑定失败"));
		}
	}
}

function bindPhone(sessionId, encryptedData, iv) {
	return app.RegApi.bindWxPhone({
		data: {
			sessionId,
			encryptedData,
			iv
		}
	}).netData();
}

function checkBindPhone(){
	let isBind = false;
	if(!isBind && this.data.needCheckPhone){
		this.authPhoneWd.show();
		return Promise.reject();
	}else{
		return Promise.resolve();
	}
}