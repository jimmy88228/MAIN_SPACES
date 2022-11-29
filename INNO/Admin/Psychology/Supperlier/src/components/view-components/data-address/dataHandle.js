import util from '@/libs/util.js';
class addressManager {
	static getInstance() {
		if (!addressManager.instance) {
			addressManager.instance = new addressManager();
		}
		return addressManager.instance;
	}
	constructor() {

	}
	get areaList() {
		return this._areaList || [];
	}
	getAddressData(selectRange) {
		if (this.areaList.length > 0) {
			return new Promise((res, rej) => {
				let data = setSelectRange(selectRange, this.areaList)
				return res(data);
			})
		} else {
			return this.addressDataReq(selectRange);
		}
	}
	addressDataReq(selectRange) {
		console.log("进入", selectRange);
		if (this.holeReqData) {
			return this.holeReqData.then((data) => {
				if (selectRange) {
					data = setSelectRange(selectRange, data)
				}
				return data;
			})
		}
		//
		this.holeReqData = util.ajax.post(util.apiUrl.addresssMessage)
			.then(response => {
				const res = response.data;
				if (res.code) {
					let data = res.data || [];
					this._areaList = JSON.parse(JSON.stringify(data));
					return data;
				}
			}).finally(() => {
				this.holeReqData = null;
			})
		return this.holeReqData.then((data) => {
			if (selectRange) {
				data = setSelectRange(selectRange, data)
			}
			return data;
		})
	}
}

function setSelectRange(type, data) {
	data = data && JSON.parse(JSON.stringify(data));
	for (let i = 0; i < data.length; i++) {
		if (type == "prov") {
			delete data[i].children;
		} else if (type == "city") {
			let children = data[i].children || [];
			for (let j = 0; j < children.length; j++) {
				delete children[j].children;
			}
		}
	}
	return data || [];
}

export default addressManager.getInstance();
