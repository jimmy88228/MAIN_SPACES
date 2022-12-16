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
		this.tempData = {};
	}
	getDataReq(type){
		type = type || ''; // 类型与数据需与列表字段 
		// console.log('进来 getDataReq',this.tempData[type]);
		return new Promise((rs, rj)=>{
			if(this.tempData[type] && this.tempData[type].length > 0){
				rs({
						items: this.tempData[type]
					})
			} else {
				rj();
			}
		})
	}
	saveData(type, items){
		this.tempData[type] = items||[];
		// console.log('进来 saveData',type,items,this.tempData)
	}
	clear(){
		this.tempData = {};
	}
	
}
export default selectDataHandle.getInstance();