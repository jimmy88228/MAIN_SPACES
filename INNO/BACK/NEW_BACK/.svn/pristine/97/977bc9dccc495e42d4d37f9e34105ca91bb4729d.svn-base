<template>
	<modalTemplate ref="modalTemplate" :loadParentData="onLoadData" :tableColumn="columns" :status="status" :modalWidth="1000">
		<template slot="search">
			<Form class="search-form-area" ref="formSearch" :model="formSearch" :label-width="70" inline>
				<FormItem label="所属地区">
					<Cascader class="basic-cascader" v-model="area" :data="areaList" ref="areaRef" filterable change-on-select
					 transfer :clearable="isClear" :render-format="renderSort" @on-change="selectArea"></Cascader>
				</FormItem>
				<FormItem label="渠道类型">
					<Cascader class="basic-cascader" v-model="agentCol" :data="agentList" ref="agentRef" filterable change-on-select
					 transfer :clearable="isClear" :render-format="renderSort" @on-change="selectAgent"></Cascader>
				</FormItem>
				<FormItem :label-width="0">
				  <Input
				    style="width:300px;"
				    v-model="formSearch.search"
				    placeholder="店铺名称/代码，支持模糊搜索"
				    clearable
				    search
				    enter-button
				    @on-search="searchPage(formSearch)"
				    @on-clear="searchPage(formSearch)"
				    @keydown.native.enter.prevent>
				      <Select v-model="formSearch.search_type" slot="prepend" style="width:100px;">
				        <Option :value="1">店铺名称</Option>
				        <Option :value="2">门店编码</Option>
				      </Select>
				  </Input>
				</FormItem>
				<!-- <FormItem label="店铺自提">
					<Select v-model="formSearch.self_get" class="basic_select">
						<Option :value="0">全部</Option>
						<Option :value="1">开启</Option>
						<Option :value="2">不开启</Option>
					</Select>
				</FormItem> -->
			</Form>
		</template>
	</modalTemplate>
</template>
<script>
	import util from '@/libs/util.js';
	import modalTemplate from '../../template/modal-template.vue';
	import eventMiXin from '../../event-mixin.js';
	import addressSelect from "@/views/my-components/address/index";
	export default{
		mixins: [eventMiXin],
		components: {
			modalTemplate,
			addressSelect
		},
		data(){
			return {
				formSearch: {
					search:'',
					search_type: 1,
					area: [],
					agent_id: 0,
					is_default: 0,
					self_get: 0,
					isInit: 1,
					is_trash: 0
				},
				areaList: [],
				agentList: [],
				agentCol: [],
				isClear: true,
				columns: [
					{
					  type: "selection",
					  width: 60,
					  align: "center"
					},
					{
						key: "name",
						title: "门店名称",
						minWidth: 100,
						align: "left"
					},
					{
						key: "store_code",
						title: "门店代码",
						minWidth: 100,
						align: "left"
					},
					{
						key: "addr",
						title: "门店地址",
						minWidth: 100,
						align: "left"
					}
				],
			}
		},
		computed: {
			// status() {
			// 	let props = this.$props || {};
			// 	return props
			// },
			agentId(){
				return this.agentCol.slice(-1)[0] || 0;
			}
		},
		methods: {
			renderSort(labels) {
				return labels.join('/');
				return labels.slice(labels.length - 1).join('/');
			},
			selectArea(){
				
			},
			selectAgent(){
				
			},
			onLoadData(page, exteData){
				let formSearch = this.formSearch || {};
				return this.$ajax.post( this.$api.storeList, {
					...this.formSearch,
					agent_id: this.agentId,
					...exteData
					}).then( (response) => {
							var res = response.data || {};
							if(res.code == 1){
								let data = res.data || {};
								this.areaList = data.address || [];
								this.agentList = data.agent || [];
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
	.search-form-area{
		.basic-cascader{
			width:120px;
		}
	}
</style>