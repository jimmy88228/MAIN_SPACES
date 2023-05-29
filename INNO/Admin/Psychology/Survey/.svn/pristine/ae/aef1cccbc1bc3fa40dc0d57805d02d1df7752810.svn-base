<template>
	<div class='goods-select'>
		<modalTemplate ref="modalTemplate" :loadParentData="onLoadData" :tableColumn="columns" :propData="$props" :modalWidth="1000">
			<template slot="search">
				<rewrite-area>
					<Form ref="searchForm" :model="searchForm" :label-width="90" inline class="no-tip flex-b-c">
						<FormItem :label-width="0">
							<rewrite-search v-model="searchForm.searchq" @search="searchPage" placeholder="请输入关键词"></rewrite-search>
						</FormItem>
						<FormItem label="区" v-if="_structureLimit(['edu_customer'])">
								<data-select ref="areaSelectRef" :initCallback="initAreaData" v-model="searchForm.area_id" style="max-width:150px;" type="adminArea" valueKey="area_id" nameKey="area_name" @changeData="changeAreaData"></data-select>
						</FormItem>
						<FormItem label="街道" v-if="_structureLimit(['edu_customer', 'edu_area'])">
								<data-select ref="streetSelectRef" :params="{ area_id: getAreaId }" v-model="searchForm.street_id" style="max-width:150px;" type="street" valueKey="street_id" nameKey="street_name" @changeData="changeStreetData"></data-select>
						</FormItem>
					</Form>
				</rewrite-area>
			</template>
		</modalTemplate>

	</div>
</template>
<script>
	import modalTemplate from '../../template/modal-template.vue';
	import eventMiXin from '../../event-mixin.js';
	import Mixin from './mixin';
	export default{
		mixins: [eventMiXin, Mixin],
		components: {
			modalTemplate,
		},
		props: {
			title: {
				type: String,
				default: "选择学校"
			}
		},
		data(){
			return {
				searchForm: {
					searchq: "",
					street_id: 0,
					area_id: 0,
					structure_id: 0,
					structure_name: "",
					structure_type: ""
				},
				isClear: true,
			}
		},
		computed: {
			getAreaId(){
					if(this._structureType == 'edu_customer'){
							return this.searchForm.area_id || 0;
					} else if(this._structureType == 'edu_area'){
							return this._structureId;
					} else {
							return 0
					}
			}
		},
		methods: {
			beforeShowModal(props){
				return new Promise((rs, rj)=>{
					rs();
				})
			},
			changeArea(){
					this.$nextTick(()=>{
							this.$refs["streetSelectRef"] && this.$refs["streetSelectRef"].getData();
							this.searchPage();
					}) 
			},
			changeAreaData(data){
					this.searchForm.area_id = data.area_id;
					this.searchForm.structure_type = data.structure_type;
					this.searchForm.area_name = data.area_name;
					this.$nextTick(()=>{
							this.$refs["streetSelectRef"] && this.$refs["streetSelectRef"].getData();
							this.searchPage();
					})
			},
			changeStreetData(data){
					this.searchForm.street_id = data.street_id;
					this.searchForm.street_name = data.street_name;
					this.searchForm.structure_type = data.structure_type;
					this.searchPage();
			},
			onLoadData(page, extraData){
				let searchForm = this.searchForm || {};
				return this.$MainApi.schoolMaintList({
					data: {
						...searchForm,
						structure_id: searchForm.street_id || searchForm.area_id || 0,
						...extraData
					},
					other:{
						isErrorMsg: true
					}
				}).then((res)=>{
					if(res.code){
						let data = res.data || {};
						let items = data.items || [];
						items.map((item)=>{
							item.name = item.structure_name
						})
						let result = {
							list: items,
							total: data.total
						}
						return Promise.resolve(result)
					} else {
						return Promise.reject();
					}
				})
			},
			searchPage(){
				this.$refs["modalTemplate"].searchPage();
			},
			addAdmin(){
				
			}
		},
		mounted(){}
	}
</script>
<style lang="less"></style>