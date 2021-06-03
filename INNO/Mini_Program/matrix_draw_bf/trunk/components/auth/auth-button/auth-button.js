import LM from "../../../common/manager/login-manager";
import Smm from "../../../common/helper/show-msg-helper";
const OpenType = {
	UserInfo: "getUserInfo",
	Phone: "getPhoneNumber"
}
const app = getApp();
Component({
	behaviors: [Behavior.BaseBehavior],
	properties: {
		auth: {
			type: Boolean,
			value: true,
		},
		openType: {//按钮类型
			type: String,
			value: ""
		},
		disabled: {//失效按钮
			type: Boolean,
			value: false
		}
	},
	attached() {
		this.isCanUrPf = !!wx.getUserProfile;
		this.setData({
			isCanUrPf:this.isCanUrPf
		})
		LM.getWxSessionIdAsync();
	},
	data: {},
	methods: {
		onTap(e) {
			let openType = this.properties.openType;
			this.triggerEvent("taped", { openType: openType });
		},
		onAuth(e) {
			console.log('onAuth',e)
			if (!app.clickHold("auth")) { return; };
			let openType = this.properties.openType;
			let detail = e.detail || {};
			return checkAuthorize.call(this, openType, detail).then(() => {
				this.triggerEvent("authed", { ...detail, openType });
			}).catch(rs => {
				Smm.showToast({
					title: rs
				})
			});
		},
	}
})

function checkAuthorize(openType, detail) {
	if (openType == OpenType.UserInfo) {
		// 用户授权
		// if (detail.errMsg.indexOf("ok") == -1) {
		if (detail.errMsg && detail.errMsg.indexOf("fail auth deny") != -1) {
			return Promise.reject("用户授权失败");
		} else {
			return LM.register(true).ignore(() => {
				if (!LM.isLogin)
					return Promise.reject("授权注册失败");
			});
		}
	} else if (openType == OpenType.Phone) {
		// 手机授权
		if (detail.errMsg.indexOf("ok") == -1) {
			return Promise.reject("手机授权失败");
		} else {
			return bindPhone(LM.token, LM.sessionKey, detail.encryptedData, detail.iv).catch(() => Promise.reject("手机绑定失败"));
		}
	}
}

function bindPhone(userToken, sessionKey, encryptedData, iv) {
	return app.LoginApi.bindPhone({
		params: { userToken },
		data: {
			sessionKey,
			encryptedData,
			iv
		}
	}).netData();
}