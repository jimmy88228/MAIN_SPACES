<template>
	<div >
		<Modal
				class="transfer-modal"
				v-model="modalShow"
				:title="title"
				:width="900"
				@on-ok="transferOk"
				@on-cancel="">
				<div class="">
					<div class="flex f-align-center m-bottom-10">
						<div>
							<Cascader slot="prepend" :data="goodsCatList" v-model="formSearch.chooseCat"></Cascader>
						</div>
						<div>
							<Input class="user-search_input" v-model="formSearch.keyword" placeholder="请输入关键字" clearable search enter-button
							 @on-search="searchCatGoods" @on-clear="searchCatGoods" @keydown.native.enter.prevent="searchCatGoods">
							</Input>
						</div>
					</div>
				</div>
				<div>
					<Transfer
					:list-style="listStyle"
					:data="totalData"
					:targetKeys="targetKeys"
					:render-format="renderFormat"
					@on-change="changeTransfer"></Transfer>
				</div>
		</Modal>
	</div>
</template>
<script>
	
	export default{
		props: ["title"],
		data(){
			return {
				modalShow: false,
				goodsCatList: [],
				formSearch: {
					keyword: "",
					chooseCat: []
				},
				listStyle: {
					width: "400px",
					height: "400px"
				},
				// totalData: [],
				// targetKeys: [],
				leftData: [],
				rightData: []
			}
		},
		computed:{
			chooseCatId:{
				get(){
					let chooseCat = this.formSearch.chooseCat || [];
					console.log("chooseCat", chooseCat);
					return chooseCat.slice(-1)[0];
				},
				set(){}
			},
			totalData: {
				get(){
					let leftData = this.leftData || [];
					let rightData = this.rightData || [];
					console.log("totalData", leftData.concat(rightData));
					return leftData.concat(rightData);
				},
				set(){}
			},
			targetKeys: {
				get(){
					let rightData = this.rightData || [];
					let keys = [];
					for(let i = 0; i < rightData.length; i++){
						let key = rightData[i].key || "";
						if(key){
							keys.push(key);
						}
					}
					console.log("targetkey", keys);
					return keys;
				},
				set(){}
			}
		},
		methods: {
			showModal(data){
				console.log("showModal",data)
				this.modalShow = true;
				this.editCatId = data.vcat_id || 0;
				if(!this.editCatId) {
					this.$Message.error("无效分类ID");
					return;
				}
				if(!this.getCatTree || this.getCatTree.length == 0){
					this.getCatTree();
				}
				this.getThisVcatGoods();
			},
			getCatTree(){
				return this.$ajax.post(this.$api.catTree).then((response) => {
						var res = response.data;
						if (res.code) {
							let data = res.data || [];
							this.formSearch.chooseCat = [data[0].cat_id];
							this.goodsCatList = this.installCatTree(data);
						}
					});
			},
			getThisVcatGoods(){
				return this.$ajax.post(this.$api.getVcatGoods, {
					vcat_id: this.editCatId
				}).then((response) => {
					var res = response.data;
					if (res.code) {
						let data = res.data || [];
						this.rightData = this.installTransfer(data);
						console.log("rightData",this.rightData);
					}
				});
			},
			searchCatGoods(){
				return this.$ajax.post(this.$api.vcatGoodsCatSearch, {
						vcat_id: this.editCatId || 0,
						cat_id: this.chooseCatId || 0,
						keyword: this.formSearch.keyword || ""
					})
					.then((response) => {
						this.showSpin = false;
						var res = response.data;
						if (res.code) {
							let data = res.data || [];
							this.leftData = this.installTransfer(data);
						}
					});
			},
			changeTransfer(targetKeys, direction, moveKeys){
				console.log("targetKeys", targetKeys);
				console.log("direction", direction);
				console.log("moveKeys", moveKeys);
				if(moveKeys.length > 0){
					let goodsIds = moveKeys.join(",");
					this.saveChangeTransfer(goodsIds, direction).then(()=>{
						this.searchCatGoods();
						this.getThisVcatGoods();
					})
				}
			},
			saveChangeTransfer(goodsIds = "", direction){
				if(!goodsIds) return;
				let type = direction == 'left' ? 'del' : 'add'
				return this.$ajax.post(this.$api.vcatGoodsSave, {
					vcat_id: this.editCatId || 0,
					goods_ids: goodsIds,
					type: type
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
			installCatTree(data){
				for(let i = 0; i < data.length; i++){
					data[i].value = data[i].cat_id;
					data[i].label = data[i].cat_name;
					if(data[i].children && data[i].children.length > 0){
					  this.installCatTree(data[i].children);
					}
				}
				return data;
			},
			installTransfer(data){
				for(let i = 0; i < data.length; i++){
					data[i].key = data[i].goods_id;
					data[i].label = data[i].goods_name || "";
				}
				return data;
			},
			renderFormat(item){
				return '<div class="flex f-align-center"><div class="transfer-img f-shrink0"><img src="' + (item.goods_img || "") + '"></div><p>' + (item.goods_name || "") + '(' + (item.goods_sn || "") + ')</p></div>';
			}
		}
	}
</script>
<style lang="less">
	.transfer-modal{
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
