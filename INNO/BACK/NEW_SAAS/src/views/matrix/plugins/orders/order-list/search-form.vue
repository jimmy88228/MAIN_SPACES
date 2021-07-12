<template>
	<div class="order-search-form">
		<Form ref="formSearch" :model="formSearch" inline :label-width="90">
			<FormItem :label-width="0" class="search_wrapper">
				<Input v-model="formSearch.keywords" style="width:390px;" placeholder="关键词搜索" clearable search enter-button
				 @on-search="searchPage" @on-clear="searchPage" @keydown.native.enter.prevent="searchPage">
				<Select v-model="formSearch.search_type" slot="prepend" style="width:100px;">
					<Option v-for="(val, key) in searchTypeList" :value="key" :key="key">{{ val }}</Option>
				</Select>
				</Input>
				<a @click="showExtra" class="search_btn">{{isShowExtra ? '普通搜索' : '高级搜索'}}</a>
			</FormItem>
			<transition name="fade">
				<div v-show="isShowExtra">
					<FormItem label="领取时间" class="date_wrapper">
						<date-select ref="dateSelect" @sT="handleStart" @eT="handleEnd" extra />
					</FormItem>
					<FormItem label="发货时间" class="date_wrapper">
						<date-select ref="dateSelect" @sT="handleShippingStart" @eT="handleShippingEnd" />
					</FormItem>
					<!-- <Row>
						<Col span="8">
						<FormItem label="订单来源" prop="platform_src">
							<Select v-model="formSearch.platform_src" class="basic_select">
								<Option v-for="(val, key) in orderFrom" :value="key" :key="key">{{ val }}</Option>
							</Select>
						</FormItem>
						</Col>
						<Col span="8">
						<FormItem label="订单类型" prop="order_type">
							<Select v-model="formSearch.order_type" class="basic_select">
								<Option v-for="(item, index) in orderTypeList" :value="index" :key="index">{{ item }}</Option>
							</Select>
						</FormItem>
						</Col>
						<Col span="8">
						<FormItem label="售卖类型" prop="sale_kind">
							<Select v-model="formSearch.sale_kind" class="basic_select">
								<Option v-for="(item, index) in saleKind" :value="index" :key="index">{{ item }}</Option>
							</Select>
						</FormItem>
						</Col>
					</Row>
					<Row>
						<Col span="8">
						<FormItem label="支付方式" prop="pay_method">
							<Select v-model="formSearch.pay_method" class="basic_select">
								<Option v-for="(item, index) in payMethod" :value="index" :key="index">{{ item }}</Option>
							</Select>
						</FormItem>
						</Col>
						<Col span="8">
						<FormItem label="配送方式" prop="shipping_ways">
							<Select v-model="formSearch.shipping_ways" class="basic_select">
								<Option v-for="(item, index) in shippingWays" :value="index" :key="index">{{ item }}</Option>
							</Select>
						</FormItem>
						</Col>
						<Col span="8">
						<FormItem label="订单状态" prop="orderStatus">
							<Select v-model="formSearch.orderStatus" class="basic_select">
								<Option v-for="(val, key) in orderStatusList" :value="key" :key="key">{{ val }}</Option>
							</Select>
						</FormItem>
						</Col>
					</Row>
					<Row>
						<Col span="8">
						<FormItem label="订单抵扣项" prop="check_order">
							<Select v-model="formSearch.check_order" class="basic_select" multiple>
								<Option v-for="(val, key) in checkOrder" :value="key" :key="key">{{ val }}</Option>
							</Select>
						</FormItem>
						</Col>
						<Col span="8">
						<FormItem label="所属店铺">
							<store-select :data="storeData" type="radio" @del-tag="handleTag">
								<Button type="dashed" @click="handleSelect" class="basic_select">选择所属店铺</Button>
							</store-select>
						</FormItem>
						</Col>
					</Row> -->
					<Row>
						<Col span="24">
						<div style="margin-bottom: 10px;text-align: center;">
							<Button @click="clearCondition">重置</Button>
							<Button type="primary" @click="searchPage">搜索</Button>
							<a @click="showExtra" class="search_btn" style="margin-left:10px">
								<Icon type="ios-arrow-up" /> 收起选项</a>
						</div>
						</Col>
					</Row>
				</div>
			</transition>
		</Form>
	</div>
</template>

<script>
	import StoreSelect from '@/views/my-components/list-component/index-edit';
	import DateSelect from '@/views/my-components/date-select/index.vue';

	export default {
		name: 'searchForm',
		props: ['orderStatusList', 'storeList', 'orderFrom', 'orderTypeList', 'saleKind', 'payMethod', 'shippingWays',
			'checkOrder', 'searchTypeList', 'orderStatusSelect'
		],
		components: {
			StoreSelect,
			DateSelect
		},
		data() {
			return {
				// 搜索表单
				formSearch: {
					startTime: '',
					endTime: '',
					startTimeShipping: '',
					endTimeShipping: '',
					orderStatus: '0',
					store_id: '0',
					platform_src: '0',
					order_type: 0,
					sale_kind: 0,
					pay_method: 0,
					shipping_ways: 0,
					point: 0,
					keywords: '',
					search_type: 'order_sn'
				},
				isShowExtra: false,
				storeData: []
			}
		},
		methods: {
			showExtra() {
				this.isShowExtra = !this.isShowExtra;
			},
			// 搜索按钮触发
			searchPage() {
				this.$emit('on-search', this.formSearch);
			},
			clearCondition() {
				this.formSearch = {
					startTime: '',
					endTime: '',
					startTimeShipping: '',
					endTimeShipping: '',
					orderStatus: '0',
					store_id: '0',
					platform_src: '0',
					order_type: 0,
					sale_kind: 0,
					pay_method: 0,
					shipping_ways: 0,
					point: 0,
					keywords: '',
					search_type: 'order_sn'
				};
				this.$refs.dateSelect.reset();
				this.storeData = [];
				this.formSearch.store_id = 0;
			},
			handleStart(date) {
				this.formSearch.startTime = date;
			},
			handleEnd(date) {
				this.formSearch.endTime = date;
			},
			handleShippingStart(date) {
				this.formSearch.startTimeShipping = date;
			},
			handleShippingEnd(date) {
				this.formSearch.endTimeShipping = date;
			},
			handleSelect() {
				this.$selectContent({
					mode: 'store',
					type: 'radio',
					data: this.storeData,
					getList: (data) => {
						this.storeData = data;
						this.formSearch.store_id = data[0].id;
					}
				})
			},
			handleTag(data) {
				this.storeData = data;
				this.formSearch.store_id = 0;
			},
		},
		watch: {
			orderStatusSelect(nV) {
				this.formSearch.orderStatus = nV;
			}
		}
	}
</script>

<style lang="less" scoped>
	.order-search-form {
		.ivu-input-icon-clear {
			right: 50px;
		}

		.date_wrapper {
			width: 100%;
		}
	}
</style>

<style lang="less">
	.order-search-form {
		.search_wrapper {
			.ivu-form-item-content {
				display: flex;
				align-items: center;
			}

			.search_btn {
				display: inline-block;
				margin-left: 10px;
			}
		}

		.ivu-input-icon {
			right: 50px;
		}

		.ivu-form-item {
			width: 100%;
			margin-bottom: 10px;
			padding-right: 10px;
		}

		.ivu-form-item-label {
			text-align: left;
		}
	}
</style>
