export default {
	computed: {
		storeIds(){
			let storeList = this.storeList || [];
			let ids = "";
			for(let i = 0; i < storeList.length; i++){
				let id = storeList[i].id || 0;
				if(id){
					ids = ids ? ids + "," + id : id;
				}
			}
			return ids || "0";
		}
	},
	data(){
		return {
			storeList: [],
		}
	},
	methods:{
		changeStore(data){
			console.log("storeMixin")
			if(data){
				this.storeList = data;
				this.searchData();
			}
		}
	}
}