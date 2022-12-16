import {
	Apis
} from "../http/http.api.install.js";
import {
	Http
} from "../http/http.interceptor.js";
import storageH from "./storage-handler";
import PLM from "../manager/platform-manager.js";
const STORAGE_HOLD_SCAN = "HOLD_SCAN";
class scanCodeManager {
	static getInstance() {
		if (!scanCodeManager.instance) {
			scanCodeManager.instance = new scanCodeManager();
		}
		return scanCodeManager.instance;
	}
	constructor() {
		this._scene = "";
		this._scanInfo = {};
		this._actBaseInfo = {};
		this._appCode = ""
	}
	get scene() {
		return this._scene;
	}
	get scanInfo() {
		return this._scanInfo;
	}
	
	get appCode(){
		return this._appCode;
	}

	get actBaseInfo() {
		return this._actBaseInfo;
	}
	/**
	 *  二维码扫码逻辑： 每次扫码进入直到到达目标活动页才释放二维码获取的数据（中途除非被内存释放或者扫其他二维码进入，或者HOLD_SCAN的30秒缓存失效才清空）
	 * */
	initScan(reqData) {
		this._scene = reqData.scene || "";
		if (this._scene || !storageH.get(STORAGE_HOLD_SCAN)) this.clearData();
	}
	hideScan() { // 退出扫码到后台
		storageH.set(STORAGE_HOLD_SCAN, true, 0.5);
	}
	scan(scanType, reqData, showLoading = true) {
		let scene = (reqData && reqData.scene) || this._scene || "";
		if (!scene) return Promise.resolve();
		if (this.scanReqHold) return this.scanReqHold;
		return this.scanReqHold = scanReq.call(this, scanType, scene, showLoading).then((data) => {
			let sceneOption = data.sceneOption || {};
			let getInfoArr = [];
			if (sceneOption.appCode) {
				PLM.savePlatformInfo({
					appCode: sceneOption.appCode
				});
				this._appCode = sceneOption.appCode;
			}
			if (sceneOption.activityId) {
				getInfoArr.push(getBaseActivityInfo.call(this, sceneOption.activityId));
			}
			return Promise.all(getInfoArr).then((result) => {
				return data;
			})
		}).finally(() => {
			setTimeout(() => {
				this.scanReqHold = null;
			}, 500)
		})
	}

	getBaseActivityInfo(activityId) {
		return getBaseActivityInfo.call(this, activityId)
	}
	clearData(isFull) {
		this._scanInfo = {};
		this._actBaseInfo = {};
		this._appCode = "";
		if(isFull){
			this._scene = ""
		}
	}
}
export default scanCodeManager.getInstance();

function scanReq(scanType, scene, showLoading) {
	if (this._scanInfo[scene]) {
		return Promise.resolve(this._scanInfo[scene]);
	}
	let url = "";
	switch (scanType) {
		case "platform":
			url = Apis.getAppletCodePlatform;
			break
		case "normal":
			url = Apis.getAppletCode;
			break
	}
	return Http(url, {
		data: {
			codeKey: scene
		},
		other: {
			isShowLoad: showLoading
		}
	}).then((res) => {
		if (res.code) {
			let resData = res.data || {};
			let {
				data,
				pagePath
			} = resData;
			data = data ? JSON.parse(data) : data;
			this._scanInfo[scene] = {
				sceneOption: data,
				pagePath: pagePath
			}
			return this._scanInfo[scene] || {};
		} else {
			this._scanInfo[scene] = null;
		}
	})
}

function getBaseActivityInfo(activityId) {
	if (!Number(activityId)) return Promise.reject();
	if (this._actBaseInfo.activityId == activityId) {
		return Promise.resolve(this._actBaseInfo);
	}
	return Http(Apis.getActivityBaseInfo, {
		data: {
			activityId: activityId
		}
	}).then((res) => {
		if (res.code) {
			let data = res.data || {}
			this._actBaseInfo = data;
			return Promise.resolve(data);
		} else {
			this._actBaseInfo = {};
		}
		return Promise.resolve({});
	}).catch(() => {
		return Promise.resolve({});
	})
}