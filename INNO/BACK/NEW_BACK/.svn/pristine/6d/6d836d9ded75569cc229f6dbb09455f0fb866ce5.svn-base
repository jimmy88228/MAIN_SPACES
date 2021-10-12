<template>
	<modalTemplate ref="modalTemplate" :loadParentData="onLoadData" :tableColumn="columns" :status="status" :modalWidth="1000">
		<template slot="search">
			<Form ref="formSearch" :model="formSearch" :label-width="90" inline>
				<FormItem label="抽奖机会" :label-width="120">
					<Select v-model="formSearch.joinKind">
						<Option v-for="(item, index) in stateList" :key="item.id" :value="item.id">{{item.name}}</Option>
					</Select>
				</FormItem>
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
			</Form>
		</template>
	</modalTemplate>
</template>
<script>
	import modalTemplate from '../../template/modal-template.vue';
	import eventMiXin from '../../event-mixin.js';
	export default{
		props: {},
		mixins: [eventMiXin],
		components: {
			modalTemplate
		},
		data(){
			return {
				formSearch: {
					searchq: "",
					joinKind: -1
				},
				stateList: [
					{
						id: -1,
						name: '不限次数'
					},
					{
						id: 0,
						name: '限定次数'
					},
					{
						id: 1,
						name: '需要抽奖机会'
					},
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
					},
					{
						key: "joinKindStr",
						minWidth: 100,
						align: "center",
						title: "抽奖机会"
					},
					{
						key: "isEnabled",
						minWidth: 100,
						align: "center",
						title: "活动状态",
						render (h, {row}) {
						  return h('Tag',{
								props: {
									type: 'dot',
									color: row.isEnabled == 2 ? 'error' : 'success'
								}
							}, row.isEnabled_str)
						}
					},
				],
			}
		},
		computed: {
		},
		methods: {
			onLoadData(page, exteData){
				let formSearch = this.formSearch || {};
				return this.$ajax.post( this.$api.lotteryActivityList, {
					...this.formSearch,
					...exteData
					}).then( (response) => {
							var res = response.data || {};
							if(res.code == 1){
								let data = res.data || {};
								let items = data.items || [];
								console.log("res", res);
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