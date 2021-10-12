<template>
	<baseTopbase>
		<div class="choose-custom-label">
			<div class="page-divider m-bottom-10">包含标签</div>
			<Input class="user-search_input" v-model="formSearch.includeKeyword" placeholder="请输入关键字" clearable search enter-button
			 @on-search="searchCatGoods('include')" @on-clear="searchCatGoods('include')" @keydown.native.enter.prevent="searchCatGoods('include')">
			</Input>
			<Transfer
			:list-style="listStyle"
			:data="inTotalData"
			:targetKeys="inTargetKeys"
			:render-format="renderFormat"
			:titles="['待选列表', '选定列表']"
			:filter-method="filterMethod"
			@on-change="(...args)=>changeTransfer(...args, 'include')"></Transfer>
			<div class="page-divider m-bottom-10 m-top-15">排除标签</div>
			<Input class="user-search_input" v-model="formSearch.keyword" placeholder="请输入关键字" clearable search enter-button
			 @on-search="searchCatGoods('exclude')" @on-clear="searchCatGoods('exclude')" @keydown.native.enter.prevent="searchCatGoods('exclude')">
			</Input>
			<Transfer
			:list-style="listStyle"
			:data="exTotalData"
			:titles="['待选列表', '选定列表']"
			:targetKeys="exTargetKeys"
			:filter-method="filterMethod"
			:render-format="renderFormat"
			@on-change="(...args)=>changeTransfer(...args, 'exclude')"></Transfer>
		</div>
	</baseTopbase>
</template>
<script>
	import baseTopbase from "@/views/my-components/page-top-base/index.vue";
	export default{
		props: ["title"],
		components:{baseTopbase},
		data(){
			return {
				modalShow: false,
				goodsCatList: [],
				formSearch: {
					includeKeyword: "",
					excludeKeyword: "",
					chooseCat: []
				},
				listStyle: {
					width: "400px",
					height: "400px"
				},
				// totalData: [],
				// targetKeys: [],
				inLeftData: [],
				inRightData: [],
				exLeftData: [],
				exRightData: []
			}
		},
		computed:{
			chooseCatId:{
				get(){
					let chooseCat = this.formSearch.chooseCat || [];
					console.log("chooseCat", chooseCat);
					return chooseCat.slice(-1)[0];
				},set(){}
			},
			inTotalData: {
				get(){
					let leftData = this.inLeftData || [];
					let rightData = this.inRightData || [];
					return leftData.concat(rightData);
				},set(){}
			},
			inTargetKeys: {
				get(){
					let rightData = this.inRightData || [];
					let keys = [];
					for(let i = 0; i < rightData.length; i++){
						let key = rightData[i].key || "";
						if(key){
							keys.push(key);
						}
					}
					return keys;
				},set(){}
			},
			exTotalData: {
				get(){
					let leftData = this.exLeftData || [];
					let rightData = this.exRightData || [];
					return leftData.concat(rightData);
				},set(){}
			},
			exTargetKeys: {
				get(){
					let rightData = this.exRightData || [];
					let keys = [];
					for(let i = 0; i < rightData.length; i++){
						let key = rightData[i].key || "";
						if(key){
							keys.push(key);
						}
					}
					return keys;
				},set(){}
			}
		},
		methods: {
			initParams(){
				let query = this.$route.query || {};
				this.vcat_id = query.vcat_id || 0;
			},
			loadData(type){
				if(!this.vcat_id) return;
				let formSearch = this.formSearch || {};
				return this.$ajax.post(this.$api.vcatSearchTag, {
					vcat_id: this.vcat_id,
					keyword: type == "include" ? formSearch.includeKeyword : formSearch.excludeKeyword,
					relation_type: type
				}).then((response) => {
						var res = response.data;
						if (res.code) {
							let data = res.data || {};
							if(type == 'include'){
								this.inLeftData = this.installTransfer(data.left) || [];
								this.inRightData = this.installTransfer(data.right) || [];
							} else if(type == 'exclude'){
								this.exLeftData = this.installTransfer(data.left) || [];
								this.exRightData = this.installTransfer(data.right) || [];
							}
						}
					});
			},
			// saveVcatTagData(type){
			// 	if(!this.vcat_id) return;
			// 	let formSearch = this.formSearch || {};
			// 	return this.$ajax.post(this.$api.vcatTagSave, {
			// 		"vcat_id":"1151",
			// 		"tag_ids":"2034,2038",
			// 		"relation_type": "include",    //include(包含)  exclude（排除）
			// 		"type": "add"
			// 	}).then((response) => {
			// 			var res = response.data;
			// 			if (res.code) {
			// 				let data = res.data || {};
			// 				if(type == 'include'){
			// 					this.inLeftData = data.left || [];
			// 					this.inRightData = data.right || [];
			// 				} else if(type == 'exclude'){
			// 					this.exLeftData = data.left || [];
			// 					this.exRightData = data.right || [];
			// 				}
			// 				this.formSearch.chooseCat = [data[0].cat_id];
			// 				this.goodsCatList = this.installTransfer(data);
			// 			}
			// 		});
			// },
			searchCatGoods(type){
				this.loadData(type);
			},
			// showModal(data){
			// 	console.log("showModal",data)
			// 	this.modalShow = true;
			// 	this.editCatId = data.vcat_id || 0;
			// 	if(!this.editCatId) {
			// 		this.$Message.error("无效分类ID");
			// 		return;
			// 	}
			// 	if(!this.getCatTree || this.getCatTree.length == 0){
			// 		this.getCatTree();
			// 	}
			// 	this.getThisVcatGoods();
			// },
			// getCatTree(){
			// 	return this.$ajax.post(this.$api.catTree).then((response) => {
			// 			var res = response.data;
			// 			if (res.code) {
			// 				let data = res.data || [];
			// 				this.formSearch.chooseCat = [data[0].cat_id];
			// 				this.goodsCatList = this.installCatTree(data);
			// 			}
			// 		});
			// },
			// getThisVcatGoods(){
			// 	return this.$ajax.post(this.$api.getVcatGoods, {
			// 		vcat_id: this.editCatId
			// 	}).then((response) => {
			// 		var res = response.data;
			// 		if (res.code) {
			// 			let data = res.data || [];
			// 			this.rightData = this.installTransfer(data);
			// 			console.log("rightData",this.rightData);
			// 		}
			// 	});
			// },
			// searchCatGoods(){
			// 	return this.$ajax.post(this.$api.vcatGoodsCatSearch, {
			// 			vcat_id: this.editCatId || 0,
			// 			cat_id: this.chooseCatId || 0,
			// 			keyword: this.formSearch.keyword || ""
			// 		})
			// 		.then((response) => {
			// 			this.showSpin = false;
			// 			var res = response.data;
			// 			if (res.code) {
			// 				let data = res.data || [];
			// 				this.leftData = this.installTransfer(data);
			// 			}
			// 		});
			// },
			changeTransfer(targetKeys, direction, moveKeys, relationType){
				console.log("targetKeys", targetKeys);
				console.log("direction", direction);
				console.log("moveKeys", moveKeys);
				if(moveKeys.length > 0){
					let goodsIds = moveKeys.join(",");
					this.saveChangeTransfer(goodsIds, direction, relationType).then(()=>{
						this.loadData(relationType);
					})
				}
			},
			saveChangeTransfer(goodsIds = "", direction, relationType){
				if(!goodsIds) return;
				direction = direction == 'left' ? 'del' : 'add'
				return this.$ajax.post(this.$api.vcatTagSave, {
					"vcat_id": this.vcat_id,
					"tag_ids": goodsIds,
					"relation_type": relationType, //include(包含)  exclude（排除）
					"type": direction
				}).then((response) => {
					this.showSpin = false;
					var res = response.data;
					if (res.code) {
						this.$Message.success('编辑成功');
						return Promise.resolve()
					}
					return Promise.reject();
				});
			},
			transferOk(){
				this.$emit("transferCallback");
			},
			// installCatTree(data){
			// 	for(let i = 0; i < data.length; i++){
			// 		data[i].value = data[i].cat_id;
			// 		data[i].label = data[i].cat_name;
			// 		if(data[i].children && data[i].children.length > 0){
			// 		  this.installCatTree(data[i].children);
			// 		}
			// 	}
			// 	return data;
			// },
			filterMethod(data, query){
				return data.label.indexOf(query) > -1;
			},
			installTransfer(data){
				for(let i = 0; i < data.length; i++){
					data[i].key = data[i].tag_id;
					data[i].label = data[i].tag_name;
				}
				return data;
			},
			renderFormat(item){
				return item.tag_name;
			}
		},
		mounted(){
			this.initParams();
			this.loadData('include');
			this.loadData('exclude');
		}
	}
</script>
<style lang="less">
	.choose-custom-label{
		.user-search_input{
			width:200px;
			margin-bottom:10px;
		}
		.transfer-img{
			width: 40px;
			height:40px;
			position:relative;
			overflow: hidden;
			margin-right: 10px;
			img{
				width:100%;
				position:absolute;
				top:0px;
				left:0px;
				display: block;
			}
		}
		.ivu-transfer{
			.ivu-transfer-list-content-item{
				display: flex;
				align-items: center;
			}
		}
	}
</style>
