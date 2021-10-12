<template>
	<modalTemplate 
	ref="modalTemplate" 
	:modalClass="'material-template'" 
	:loadParentData="onLoadData" 
	:tableColumn="columns" 
	:status="status" 
	:UIMold="formSearch.type == 'image' ? 'largerImage' : ''" 
	:modalWidth="900">
		<template slot="search">
			<Form ref="formSearch" :model="formSearch">
				<div class="flex">
					<FormItem label="类型" :label-width="90">
						<Select v-model="formSearch.type" class="basic_select" style="width:200px;" @on-change="changeType">
							<Option :value="item.type" v-for="(item, index) in materialList" :key="item.type">{{item.label}}</Option>
						</Select>
					</FormItem>
					<FormItem :lavel-width="0">
						<Button type="primary" icon="md-search" @click="searchPage"></Button>
					</FormItem>
				</div>
			</Form>
		</template>
	</modalTemplate>
</template>
<script>
	import util from '@/libs/util.js';
	import modalTemplate from '../../template/modal-template.vue';
	import eventMiXin from '../../event-mixin.js';
	import newsMixin from './news-mixin.js';
	export default{
		mixins: [eventMiXin, newsMixin],
		components: {
			modalTemplate
		},
		data(){
			return {
				materialList: [
					{
						type: 'image',
						label: '图片'
					},
					{
						type: 'video',
						label: '视频'
					},
					{
						type: 'voice',
						label: '语音'
					},
					{
						type: 'news',
						label: '图文'
					}
				],
				formSearch: {
					type: 'image'
				},
				columns: []
			}
		},
		computed: {},
		methods: {
			changeType(data){
				console.log("触发", data);
				
			},
			beforeShowModal(_props = {}){
				_props.title = "选择微信素材";
				this.status = _props || {};
				return this.getLimitMaterialType(_props.extraParam || {});
			},
			getLimitMaterialType(extraParam){
				return new Promise((rs, rj)=>{
					let limitSelect = extraParam.limitSelect || [];
					let materialList = this.materialList || [];
					let view = [], chooseType = limitSelect[0] || 'image';
					for(let i = 0; i < materialList.length; i++){
						if(limitSelect.indexOf(materialList[i].type) != -1){
							view.push(materialList[i])
						}
					}
					this.materialList = view;
					this.$nextTick(()=>{
						this.setColumns(chooseType);
						this.$set(this.formSearch, 'type', chooseType);
						rs();
					})
				})
			},
			setColumns(chooseType){
				if(chooseType == 'news'){
					this.columns = this.newsColumns;
				}
			},
			onLoadData(page, exteData){
				let formSearch = this.formSearch || {};
				return this.$ajax.post( this.$api.OnceMarketingGetMaterial, {
					...formSearch,
					...exteData
					}).then( (response) => {
							var res = response.data || {};
							if(res.code == 1){
								let data = res.data || {};
								let items = data.item || [];
								console.log("formSearch", formSearch);
								for(let i = 0; i < items.length; i++){
									items[i].img = 'http://' + items[i].local_path || "";
									items[i].id = items[i].media_id;
									if(formSearch.type == 'news'){
										let content = items[i].content || {};
										let news_item = content.news_item[0];
										items[i].name = news_item.title || "";
									}
								}
								data.items = items || [];
								data.total = data.total_count || 0;
								return Promise.resolve(data)
							} else {
								return Promise.reject();
							}
				}).catch(()=>{
					
				})
			},
			searchPage(){
				this.$refs["modalTemplate"].searchPage();
			}
		}
	}
</script>
<style lang="less">
	.material-template{
		.larger-items{
			.larger-item{
				height:130px;
			}
		}
	}
	
</style>