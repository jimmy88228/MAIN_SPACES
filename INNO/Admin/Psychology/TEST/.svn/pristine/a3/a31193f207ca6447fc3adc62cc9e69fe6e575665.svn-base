class selectDataHandle {
	static getInstance(){
		if (!selectDataHandle.instance) {
		  selectDataHandle.instance = new selectDataHandle();
		}
		return selectDataHandle.instance;
	}
	constructor() {
		this.storeList = [];
		this.pageList = [];
		this.couponList = [];
		this.allTagList = [];
		this.levelList = [];
		this.inventoryList = [];
		this.dataReq = {};
		
	}
	getDataReq(type){
		type = type || ''; // 类型与数据需与列表字段一直 type + 'list';
		return new Promise((rs, rj)=>{
			if(this[type + 'List'] && this[type + 'List'].length > 0){
				rs({
						items: this[type + 'List']
					})
			} else {
				rj();
			}
		})
	}
	saveData(type, items){
		this[type + 'List'] = items || [];
	}
	
}
export default selectDataHandle.getInstance();