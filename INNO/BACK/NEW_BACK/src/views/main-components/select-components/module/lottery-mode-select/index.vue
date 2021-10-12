<template>
	<modalTemplate ref="modalTemplate" :loadParentData="onLoadData" :tableColumn="columns" :status="status" UIMold="largerImage" :modalWidth="900">
		<template slot="search">
			<Form ref="formSearch" :model="formSearch" :label-width="90" inline>
				<!-- <FormItem prop="searchq" label="关键词">
					<Input
					class=""
					style="width:250px"
					v-model="formSearch.searchq"
					placeholder="请输入名称/货号搜索"
					clearable
					search
					enter-button
					@on-search="searchPage"
					@on-clear="searchPage"
					@keydown.native.enter.prevent="searchPage">
					</Input>
				</FormItem> -->
			</Form>
		</template>
	</modalTemplate>
</template>
<script>
	import util from '@/libs/util.js';
	import modalTemplate from '../../template/modal-template.vue';
	import eventMiXin from '../../event-mixin.js';
	export default{
		mixins: [eventMiXin],
		components: {
			modalTemplate
		},
		data(){
			return {
				formSearch: {
					// active_id:0,
					// cat_id:0,
					// vcat_id:0,
					// sale_type:'-1',
					// is_on_sale:'-1',
					// is_page: 1,
					// searchq:""
				},
				columns: [
					{
					  type: "selection",
					  width: 60,
					  align: "center"
					},
					{
						key: "logo",
						title: "模板图片",
						render: (h, params) => {
							return h('div', [
								h('Avatar', {
									props: {
										icon:(params.row.logo !='' ? '' : 'images'),
										shape:'square',
										size:'large',
									},
									style:{
										margin:'5px 0',
										width:'50px',
										height:'50px',
										border:'1px solid #eee',
										background: (params.row.logo !='' ? 'url(' + params.row.logo + ') center center/100% no-repeat' : '') ,backgroundSize: '100% auto',
									},
								})
							]);
						}
					},
					{
						key: "name",
						title: "模板名称"
					},
					{
						key: "type_code",
						title: "模板类型code"
					}
				],
			}
		},
		computed: {
			status() {
				let props = this.$props || {};
				props.title = "选择营销模板";
				return props
			}
		},
		methods: {
			onLoadData(page, exteData){
				let formSearch = this.formSearch || {};
				return this.$ajax.post( this.$api.MatrixLotteryActivityType, {
					...this.formSearch,
					...exteData
					}).then( (response) => {
							var res = response.data || {};
							if(res.code == 1){
								let data = res.data || {};
								let items = data.items || [];
								for(let i = 0; i < items.length; i++){
									items[i].img = items[i].logo;
								}
								data.items = items || [];
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
<style>
	
</style>