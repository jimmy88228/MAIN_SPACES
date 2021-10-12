<template>
	<modalTemplate ref="modalTemplate" :loadParentData="onLoadData" :tableColumn="columns" :status="status" :modalWidth="1000">
		<template slot="search">
			<Form ref="formSearch" :model="formSearch" :label-width="90" inline>
				<FormItem prop="searchq" label="关键词">
					<Input
					class=""
					style="width:300px"
					v-model="formSearch.searchq"
					placeholder="请输入活动名称"
					clearable
					search
					enter-button
					@on-search="searchPage"
					@on-clear="searchPage"
					@keydown.native.enter.prevent="searchPage">
					</Input>
				</FormItem>
				<FormItem prop="searchq">
					<Select v-model="chooseType" @on-change="changeType" class="goods-search_select" style="width:200px;">
						<Option :value="item.key" v-for="(item, index) in chooseTypes" :key="item.key">{{item.name}}</Option>
						<!-- <Option :value="2">商品货号</Option> -->
					</Select>
				</FormItem>
			</Form>
		</template>
	</modalTemplate>
</template>
<script>
	import modalTemplate from '../../template/modal-template.vue';
	import eventMiXin from '../../event-mixin.js';
	export default{
		props: {
			isShowUsable: {
				type: Boolean,
				default: false
			}
		},
		mixins: [eventMiXin],
		components: {
			modalTemplate
		},
		data(){
			return {
				formSearch: {
					searchq: "",
				},
				chooseType: 'goods',
				chooseTypes: [
					{
						name: '热销商品',
						key: 'goods'
					},
					{
						name: '热销活动',
						key: 'act'
					}
				],
				columns: [
					{
					  type: "selection",
					  width: 60,
					  align: "center"
					},
					{
						key: "name",
						minWidth: 100,
						align: "center",
						title: "活动名称"
					}
				],
			}
		},
		computed: {
		},
		methods: {
			onLoadData(page, exteData){
				let formSearch = this.formSearch || {};
				let req = this.chooseType == 'act' ? 'distributionActivityList' : 'distributionActivityGoodList';
				return this.$ajax.post( this.$api[req], {
					...this.formSearch,
					...exteData
					}).then( (response) => {
							var res = response.data || {};
							if(res.code == 1){
								let data = res.data || {};
								let items = data.items || [];
								this.data = {
									items: items,
									total: data.total
								}
								return Promise.resolve(data)
							} else {
								return Promise.reject();
							}
				}).catch(()=>{
					
				})
			},
			changeType(){
				this.$refs["modalTemplate"].searchPage();
			},
			searchPage(){
				this.$refs["modalTemplate"].searchPage();
			}
		}
	}
</script>
<style>
	
</style>