import Wxp from "../support/tools/wx-api-promise";
import Smm from "./show-msg-helper";
import { SubApi } from "../manager/http-manager";
import Conf from "../../conf";
const STATE = {
	accept: 1,//已订阅  
	reject: 2,//已拒绝 
	ban: 3// 模板被禁
};
class SubscribeHelper {
	setSubscribe(userToken, type, toSubscribe, { showToast = true, keyId = 0 }) {
		let p;
		if (toSubscribe)
			p = getMsgTpls(type)
				.then(tpls => wxSubscribe(tpls))
				.then(subs => setSub(userToken, type, keyId, toSubscribe, subs));
		else
			p = setSub(userToken, type, keyId, toSubscribe);

		if (!showToast) return p;

		return p.then(isSub => {
			Smm.showToast({ title: isSub ? "订阅成功" : "取消订阅成功" });
			return isSub;
		});
	}
	checkSettings(type) {
		return getMsgTpls(type)
			.then(tpls => checkSettings(tpls));
	}
	showSettingsDialog(dialog, err) {
		if (err && err.subError) {
			const tap = (_, d) => (d.dismiss(), wx.openSetting({ withSubscriptions: true }));
			dialog.setTitle("订阅失败")
				.setContent(err.msg)
				.setTwoBtn(null, { name: "去设置", tap })
				.show();
			return Promise.reject();
		}
		return Promise.reject(err);
	}
}

function wxSubscribe(tpls) {
	if (!tpls || tpls.length <= 0) return null;//不需要订阅
	return checkSettings(tpls).then(ids => {
		if (!ids || ids.length <= 0) return null;//不需要订阅
		return Wxp.requestSubscribeMessage({ tmplIds: ids })
			.then(subs => {
				let rs = createData(tpls, subs);
				if (!rs || rs.length <= 0) return Promise.reject();//订阅被取消
				return rs;
			})
	});
}

function checkSettings(tpls) {
	if (!tpls || tpls.length <= 0)
		return Promise.resolve();
	let tmplIds = tpls.map(tpl => tpl.tplId);
	return Wxp.getSetting({ withSubscriptions: true }).then(rs => {
		let subSet = rs.subscriptionsSetting || {};
		if (!subSet.mainSwitch)//总开关关闭
			return Promise.reject({ subError: 1, msg: "消息订阅被禁用，如需订阅请前往恢复" });

		let itemSettings = subSet.itemSettings || {};
		let resolveCount = 0, rejectCount = 0, banCount = 0;
		tmplIds.forEach(tmplId => {
			let state = itemSettings[tmplId];
			if (state) {
				if (STATE[state] == STATE.accept)
					resolveCount++;
				else if (STATE[state] == STATE.reject)
					rejectCount++;
				else if (STATE[state] == STATE.ban)
					banCount++;
			}
		})
		if (rejectCount == tmplIds.length) {//全部订阅模板被用户关闭
			return Promise.reject({ subError: 2, msg: "消息模板被禁用，如需订阅请前往恢复" });
		} else if (banCount == tmplIds.length) {//全部订阅模板被后台封禁
			// return Promise.reject("消息模板已失效，请联系管理员");
			return; //用户没办法处理后台问题，所以不报错
		}
		return tmplIds;
	})
}

function createData(tpls, subs) {
	if (!tpls || tpls.length <= 0)
		return null;
	let rs = [];
	tpls.forEach(tpl => {
		if (STATE[subs[tpl.tplId]] == STATE.accept) {
			rs.push({
				typeId: tpl.typeId,
				type: tpl.type
			});
		}
	})
	return rs;
}

let msgTplsTasks = {};
let msgTpls = {};
function getMsgTpls(type) {
	let brandCode = Conf.BRAND_CODE;
	let tpls = msgTpls[type];
	if (tpls && tpls.length > 0)
		return Promise.resolve(tpls);
	let task = msgTplsTasks[type];
	if (task)
		return task;
	task = msgTplsTasks[type] = SubApi.getSubMsgTpls({
		params: { brandCode, type }
	}).netData().then(data => {
		msgTpls[type] = data;
		return data;
	}).finally(() => {
		msgTplsTasks[type] && (msgTplsTasks[type] = undefined);
	});
	return task;
};

function setSub(userToken, type, keyId, isSub, list = null) {
	let brandCode = Conf.BRAND_CODE;
	return SubApi.setSub({
		params: { userToken },
		data: { brandCode, type, keyId: keyId || 0, isSub: isSub ? 1 : 0, list }
	}).netData();
};

const instance = new SubscribeHelper();
export default instance;
