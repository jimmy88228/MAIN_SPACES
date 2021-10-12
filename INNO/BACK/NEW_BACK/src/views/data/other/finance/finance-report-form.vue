<template>
	<div class="search-form">
		<Form inline :label-width="80">
			<div class="flex f-just-between">
				<div>
					<FormItem label="下单时间">
						<div class="flex f-align-center">
							<date-select ref="dateSelect" class="space-nowrap" dateType="report" defaultTime="yesterday"
								@sT="handleStart" @eT="handleEnd" @extra="search" extra />
							<!-- &nbsp;&nbsp;<Button type="primary" @click="search" icon="ios-search">搜索</Button>&nbsp;&nbsp; -->
							<!-- <a class="space-nowrap" @click="isShowExtra = !isShowExtra">{{ isShowExtra ? "普通搜索" :"高级搜索" }}</a> -->
						</div>
					</FormItem>
					<FormItem label="选择店铺">
						<store-select class="basic-width" :data="storeData" type="radio" @del-tag="delStore">
							<Button type="dashed" @click="handleStoreSelected" class="basic-width">选择筛选店铺</Button>
						</store-select>
					</FormItem>
					<FormItem label="订单来源">
						<Select v-model="formSearch.platform_src" class="basic-width">
							<Option v-for="(item, index) in orderSources" :key="item.key" :value="item.key">{{ item.name }}</Option>
						</Select>
					</FormItem>
					<FormItem :label-width="0">
						<Button type="primary" @click="handleExport">
							<Icon type="md-cloud-download" />导出
						</Button>
					</FormItem>
				</div>
				<FormItem label="搜索">
					<Input class="" style="width:230px" v-model="formSearch.searchq" placeholder="订单号/货号" clearable
						search enter-button @on-search="search" @on-clear="search"
						@keydown.native.enter.prevent="search"></Input>
				</FormItem>
			</div>
		</Form>
	</div>
</template>
<script>
	import util from '@/libs/util.js';
	import DateSelect from '@/views/my-components/date-select/index.vue';
	import StoreSelect from '@/views/my-components/list-component/index-edit';
	export default {
		name: "searchForm",
		components: {
			DateSelect,
			StoreSelect
		},
		props: ["formSearch"],
		data() {
			return {
				isShowExtra: false,
				orderSources: [
					{
						key: '',
						name: '不限'
					},
					{
						key: 'WXAPP',
						name: '小程序'
					},
					{
						key: 'ERP',
						name: '门店'
					},
					{
						key: 'WAP',
						name: '公众号'
					},
				],
				orderTypes: [{
					id: 0,
					name: "全部"
				}, {
					id: 1,
					name: "普通订单"
				}, {
					id: 2,
					name: "积分抵扣订单"
				}, {
					id: 3,
					name: "现金券抵扣订单"
				}, {
					id: 4,
					name: "优惠券抵扣订单"
				}],
				agentList: [],
				storeData: [],
			}
		},
		mounted() {
			this.initParams();
		},
		methods: {
			initParams() {
				let query = this.$route.query || {};
				this.brandId = query.brandId;
			},
			handleStoreSelected(selected) {
				this.$selectContent({
					mode: 'store',
					type: 'radio',
					extraAddtion: {
						brand_id: (this.brandId || 0)
					},
					data: this.storeData,
					getList: (data) => {
						this.storeData = data;
						this.formSearch.store_id = data[0].id;
					}
				});
			},
			delStore(data){
				this.storeData = data || [];
				this.formSearch.store_id = 0;
			},
			handleStart(date) {
				this.formSearch.start_time = date;
			},
			handleEnd(date) {
				this.formSearch.end_time = date;
			},
			handleExport() {
				this.$emit("on-handleExport", this.formSearch);
			},
			search() {
				this.$emit("on-search", this.formSearch);
			}
		}
	}
</script>
<style lang="less">
	.search-form {
		.basic-width {
			width: 180px;
		}
	}
</style>
