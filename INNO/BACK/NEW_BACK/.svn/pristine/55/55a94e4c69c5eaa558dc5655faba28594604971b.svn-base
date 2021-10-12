<template>
	<modalTemplate ref="modalTemplate" :loadParentData="onLoadData" :tableColumn="columns" :status="status" :modalWidth="1000">
		<template slot="search">
			<Form ref="formSearch" :model="formSearch" :label-width="90" inline>
				<FormItem prop="search" label="关键词">
					<Input
					class=""
					style="width:300px"
					v-model="formSearch.search"
					placeholder="请输入名称"
					clearable
					search
					enter-button
					@on-search="searchPage"
					@on-clear="searchPage"
					@keydown.native.enter.prevent="searchPage">
					</Input>
				</FormItem>
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
					searchq:''
				},
				columns: [
					{
					  type: "selection",
					  width: 60,
					  align: "center"
					},
					{
						key: "act_name",
						title: "活动名称",
						minWidth: 100,
						align: "left"
					},
					{
						key: "is_enabled_str",
						minWidth: 100,
						align: "center",
						title: "活动状态",
						render (h, {row}) {
						  return h('Tag',{
								props: {
									type: 'dot',
									color: row.is_enabled == 1 ? 'success' : 'error'
								}
							}, row.is_enabled_str)
						}
					},
				],
			}
		},
		computed: {
			status() {
				let props = this.$props || {};
				return props
			}
		},
		methods: {
			onLoadData(page, exteData){
				let formSearch = this.formSearch || {};
				return this.$ajax.post( this.$api.distributionCouponsActivityList, {
					...this.formSearch,
					...exteData
					}).then( (response) => {
							var res = response.data || {};
							if(res.code == 1){
								let data = res.data || {};
								let items = data.items || [];
								for(let i = 0; i < items.length; i++){
									items[i].name = items[i].act_name || "";
								}
								data.items = items;
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