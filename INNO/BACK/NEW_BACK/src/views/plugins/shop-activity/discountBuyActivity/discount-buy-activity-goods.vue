<template>
	<div class="activity_goods">
		<div class="activity_info">
			<Form ref="formDataRef" :model="formData" :rules="ruleListValidate" style="position:relative;">
				<FormItem prop="ruleList">
					<div v-for="(item, i) in formData.ruleList" :key="i">
						<div style="margin-bottom:20px;" class="flex f-align-center">
							<FormItem>满&nbsp;</FormItem>
							<FormItem :prop="`ruleList.${i}.rule_condition`" :rules="ruleListValidate.rule_condition">
								<Input style="width:100px;" v-model="item.rule_condition"
									type="number"></Input>&nbsp;元换购商品&nbsp;&nbsp;
							</FormItem>
							<template v-if="item.get_discount_buy_goods.length > 0">
								<!-- <FormItem> -->
								<Button type="info"
									@click.native="showRuleGoods(i)">{{'已选择' + item.get_discount_buy_goods.length + '个商品'}}</Button>
								<!-- </FormItem> -->
							</template>
							<template v-else>
								<FormItem :prop="`ruleList.${i}.get_discount_buy_goods`"
									:rules="ruleListValidate.get_discount_buy_goods">
									<Button type="info" @click.native="showRuleGoods(i)">选择换购商品</Button>
								</FormItem>
							</template>
							<FormItem>
								&nbsp;&nbsp;
								<Poptip confirm transfer title="确定删除该规则？" @on-ok="removeRule(i)">
									<Button>删除</Button>
								</Poptip>
							</FormItem>
						</div>
					</div>
					<div class="no-data-tip" v-if="!formData.ruleList || formData.ruleList.length == 0">
						<Icon type="ios-alert-outline" />&nbsp;暂无换购规则，请添加规则选择商品
					</div>
				</FormItem>
				<div>
					<Button type="dashed" @click.native="addRule" style="width:120px;">添加奖励</Button>
				</div>
				<Spin size="large" fix v-if="spinShow"></Spin>
			</Form>
		</div>

		<Modal v-model="activityGoodsModal" title="选择活动商品" :width="1000" class="bonus_list">

			<div class="table-topbar flex" style="padding:0px 20px; padding-bottom:10px;">
				<Input style="width:200px;" class="brand-search_input" v-model="formSearch.searchq"
					placeholder="请输入商品名称" clearable search enter-button @on-search="filterGoods" @on-clear="filterGoods"
					@keydown.native.enter.prevent="filterGoods">
				</Input>
				&nbsp;&nbsp;
				<Button type="info" icon="plus-round" @click.native="searchGoods">添加活动商品</Button>&nbsp;&nbsp;
				<!-- <Button type="primary" @click.native="uploadModal=true;">导入商品</Button> -->
			</div>
			<div>
				<Form ref="goodsFormRef" :mode="goodsForm" :rules="goodsListValidate">
					<Table :columns="columns" ref="goods-table" :data="goodsForm.editGoodsList" :height="400"
						:loading="tableLoading" @on-selection-change="(data)=>{handleSelectAll(data, )}"
						@on-expand="expandRowEvent" no-data-text="请点击添加商品" :row-class-name="rowClassName">
						<template slot-scope="{ row }" slot="goods_img">
							<div class="upload_cont">
								<img :src="row.goods_img" width="100%" />
							</div>
						</template>
						<template slot-scope="{ row,index }" slot="goods_name">
							<Input v-model.trim="row.goods_name" maxlength="40"
								@on-change="(event)=>changeInput(event.target.value, index, 'goods_name')"></Input>
						</template>

						<template slot-scope="{row, index}" slot="user_buy_limit">
							<FormItem :prop="`editGoodsList.${index}.user_buy_limit`">
								<InputNumber :min=0 v-model="row.user_buy_limit"
									@on-change="(value)=>changeInput(value,index, 'user_buy_limit')"></InputNumber>
							</FormItem>
						</template>
						<template slot-scope="{row, index}" slot="order_buy_limit">
							<FormItem :prop="`editGoodsList.${index}.order_buy_limit`">
								<InputNumber :min=0 v-model="row.order_buy_limit"
									@on-change="(value)=>changeInput(value,index, 'order_buy_limit')"></InputNumber>
							</FormItem>
						</template>
						<template slot-scope="{row, index}" slot="sort">
							<FormItem :prop="`editGoodsList.${index}.sort`">
								<InputNumber :min=0 v-model="row.sort"
									@on-change="(value)=>changeInput(value,index, 'sort')"></InputNumber>
							</FormItem>
						</template>
						<template slot-scope="{index }" slot="action">
							<div class="v-lines">
								<!-- <template><a>编辑</a> <span class="v-line">|</span></template> -->
								<template>
									<Poptip confirm transfer title="确定删除该商品？" @on-ok="removeGoods(index)">
										<a>删除</a>
									</Poptip><span class="v-line">|</span>
								</template>
							</div>
						</template>
					</Table>
				</Form>
			</div>
			<div slot="footer">
				<Button type="default" @click="activityGoodsModal = false">取消</button>
				<Button type="primary" @click="saveRuleGoods">确定</Button>
			</div>
		</Modal>
		<!-- <Modal title="图片预览" v-model="imageViewShow" :width="imageViewWidth">
			<img :src="imageViewUrl" v-if="imageViewShow" style="width: 100%">
	</Modal> -->
	<multi-norms ref="multiNorms" title="选择可用商品" :isShowImport="true" @get-data="handleGoodsData"></multi-norms>

	</div>
</template>

<script type="text/javascript">
	import expandRow from './product-row.vue';
	import activityGoodsMixin from "./activity-goods-mixin.js";
	import MultiNorms from '@/views/my-components/multi-norms/index';
	export default {
		name: "activityGoods",
		mixins: [activityGoodsMixin],
		components: {
			expandRow,
			MultiNorms
		},
		data() {
			return {
				ruleActivityId: 0,
				storeModal: false,
				formSearch: {
					searchq: ""
				},
				formData: {
					ruleList: [],
				},
				editRuleIndex: null,
				temRuleItem: {
					rule_condition: 1,
					get_discount_buy_goods: []
				},
				editRule: null,
				ruleListValidate: {
					// ruleList: [{ required: true, message: '请选择换购商品', trigger: 'blur', type: 'array', min: 1 }],
					get_discount_buy_goods: [{
						required: true,
						message: '请选择换购商品',
						trigger: 'blur',
						type: 'array',
						min: 1
					}],
					rule_condition: [{
						required: true,
						trigger: 'blur',
						validator: this.validateNumberInput
					}],
				},
				goodsForm: {
					editGoodsList: [],
				},
				goodsListValidate: {
					user_buy_limit: [{
						required: true,
						trigger: 'blur',
						validator: this.validateNumberInput
					}],
					order_buy_limit: [{
						required: true,
						trigger: 'blur',
						validator: this.validateNumberInput
					}],
					sort: [{
						required: true,
						trigger: 'blur',
						validator: this.validateNumberInput
					}],
				},
				activityGoodsModal: false,
				spinShow: false,
				tableLoading: true,
				tableLoadingTimer: null,
				//
				imageViewWidth: 600,
				// imageViewShow: false,
				imageViewUrl: '',
				//
				hiddenIds: {},
				selectedData: [],
				extraCondition: {}
			}
		},

		computed: {
			editGoodsIds: {
				get() {
					let editGoodsList = this.goodsForm.editGoodsList || [];
					let ids = {};
					for (let i = 0; i < editGoodsList.length; i++) {
						let goods_id = editGoodsList[i].goods_id;
						ids[goods_id] = {}
					}
					return ids;
				},
				set() {}
			}
		},
		methods: {
			init() {},
			rowClassName(row, index) {
				let goods_id = row.goods_id || 0;
				if (this.hiddenIds[goods_id]) {
					return "hide_none";
				} else {
					return "";
				}
			},
			filterGoods() {
				let formSearch = this.formSearch || {};
				let editGoodsList = this.goodsForm.editGoodsList;
				let filterIndex = null;
				if (formSearch.searchq) {
					console.log("editGoodsList", editGoodsList);
					console.log("formSearch.searchq", formSearch.searchq);
					for (let i = 0; i < editGoodsList.length; i++) {
						let goods_name = editGoodsList[i].goods_name || "";
						if (goods_name && goods_name.match(RegExp(formSearch.searchq))) {
							delete this.hiddenIds[editGoodsList[i].goods_id];
						} else {
							this.hiddenIds[editGoodsList[i].goods_id] = true
						}
					}
				} else {
					this.hiddenIds = {};
				}
			},
			getActivityRule(id, ruleList) {
				this.ruleActivityId = id || 0;
				this.formData.ruleList = ruleList || [];
				// this.$ajax.post( this.$api.getDiscountBuyActivityRule,{id: id}).then((response)=>{
				// 	let res = response.data || {};
				// 	if(res.code){
				// 		let data = res.data || {};
				// 		this.formData.ruleList = data || [];
				// 	} else {
				// 		this.$Message.error(res.msg)
				// 	}
				// })
			},
			// 奖励
			addRule() {
				this.$refs["formDataRef"].validate((valid) => {
					if (valid) {
						this.formData.ruleList.push(JSON.parse(JSON.stringify(this.temRuleItem)));
					} else {
						this.$Message.error("请完善规则信息！");
					}
				})
			},
			removeRule(index) {
				this.formData.ruleList.splice(index, 1);
			},
			validateNumberInput(rule, value, callback) {
				if (!Number(value)) {
					callback(new Error('输入数字'));
				}
				if (!(value > 0)) {
					callback(new Error('输入大于0的数字'));
				} else {
					callback();
				}
			},
			showRuleGoods(index) {
				let ruleList = this.formData.ruleList || [];
				let goods = ruleList[index].get_discount_buy_goods || [];
				for (let i = 0; i < goods.length; i++) {
					goods[i].user_buy_limit = parseInt(goods[i].user_buy_limit);
					goods[i].order_buy_limit = parseInt(goods[i].order_buy_limit);
					goods[i].sort = parseInt(goods[i].sort);
					goods[i].id = goods[i].goods_id;
					goods[i].name = goods[i].goods_name;
				}
				this.goodsForm.editGoodsList = goods || [];
				this.activityGoodsModal = true;
				this.tableLoading = false;
				this.editRuleIndex = index || 0;
			},
			searchGoods() {
				this.$refs.multiNorms.setData().show();
				// this.$selectContent({
				// 	mode: 'goods-by-sn',
				// 	type: 'checkbox',
				// 	extraParam: {},
				// 	data: [],
				// 	getList: (data) => {
				// 		console.log("data", data);
				// 		let userFulData = [];
				// 		for (let i = 0; i < data.length; i++) {
				// 			let goods_id = data[i].goods_id || 0;
				// 			if (!this.editGoodsIds[goods_id] && goods_id) {
				// 				let item = this.installParams(data[i])
				// 				item._expanded = true;
				// 				userFulData.push(item);
				// 			}
				// 		}
				// 		this.goodsForm.editGoodsList = this.goodsForm.editGoodsList.concat(userFulData);
				// 		console.log("this.editGoodsList", this.goodsForm.editGoodsList);
				// 	}
				// })
			},
			handleGoodsData(data){
				console.log("选择商品", data);
				console.log("data", data);
				let userFulData = [];
				for (let i = 0; i < data.length; i++) {
					let goods_id = data[i].goods_id || 0;
					data[i].id = goods_id;
					data[i].activity_id = this.ruleActivityId || 0;
					data[i].goods_img = data[i].goods_img || data[i].goods_thumb2;
					if (!this.editGoodsIds[goods_id] && goods_id) {
						let item = this.installParams(data[i])
						item._expanded = true;
						userFulData.push(item);
					}
				}
				this.goodsForm.editGoodsList = this.goodsForm.editGoodsList.concat(userFulData);
				console.log("this.editGoodsList", this.goodsForm.editGoodsList);
			},
			expandRowEvent(row, status) {
				let editGoodsList = this.goodsForm.editGoodsList || [];
				let index = null
				for (let i = 0; i < editGoodsList.length; i++) {
					if (row.goods_id == editGoodsList[i].goods_id) {
						index = i;
						break;
					}
				}
				if (index == 0 || index) {
					this.$set(this.goodsForm.editGoodsList[index], "_expanded", status);
				}
			},
			changeInput(value, index, name) {
				console.log(value);
				this.$nextTick(() => {
					this.$set(this.goodsForm.editGoodsList[index], name, value);
				})
			},
			installParams(item) {
				item = JSON.parse(JSON.stringify(item)) || {};
				item.user_buy_limit = parseFloat(item.user_buy_limit) || 0;
				item.order_buy_limit = parseFloat(item.order_buy_limit) || 0;
				item.sort = parseInt(item.sort) || 0;
				if (!item.sku && item.selectedList.length > 0) {
					let sku = [];
					for (let i = 0; i < item.selectedList.length; i++) {
						sku.push({
							"product_id": parseInt(item.selectedList[i].product_id),
							"market_price": parseFloat(item.selectedList[i].market_price) || 0,
							"price": parseFloat(item.selectedList[i].sale_price) || 0,
							"enable": 1
						})
					}
					item.sku = sku;
				}
				delete item.selectedList;
				delete item.get_products;
				return item;
			},
			removeGoods(index) {
				this.goodsForm.editGoodsList.splice(index, 1);
			},
			saveRuleGoods() {
				let editGoodsList = this.goodsForm.editGoodsList || [];
				let checkInputs = [];
				for (let i = 0; i < editGoodsList.length; i++) {
					this.$refs["expandRow" + i] && checkInputs.push(this.$refs["expandRow" + i].checkInput());
				}
				Promise.all(checkInputs).then(res => {
					let hasNoData = false;
					for (let i = 0; i < res.length; i++) {
						if (!res[i]) {
							this.$Message.error("请完善换购商品规格！");
							this.$set(this.goodsForm.editGoodsList[i], "_expanded", true);
							hasNoData = true;
							break;
						}
					}
					if (!hasNoData) {
						this.$set(this.formData.ruleList[this.editRuleIndex], "get_discount_buy_goods", this
							.goodsForm.editGoodsList);
						this.$nextTick(() => {
							this.goodsForm.editGoodsList = [];
							this.activityGoodsModal = false;
						})
					}
				})
			},
			checkSave() {
				this.$refs["formDataRef"].validate((valid) => {
					if (valid) {
						this.saveRuleReq();
					} else {
						this.$Message.error("请完善规则信息！");
					}
				})
			},
			saveRuleReq() {
				if (!this.ruleActivityId) return;
				this.spinShow = true;
				let ruleList = JSON.parse(JSON.stringify(this.formData.ruleList)) || [];
				for(let i = 0; i < ruleList.length; i++){
					ruleList[i].goods = ruleList[i].get_discount_buy_goods;
					delete ruleList[i].get_discount_buy_goods;
				}
				this.$ajax.post(this.$api.BargainBuyGooodsSave, {
					id: this.ruleActivityId,
					list: ruleList
				}).then((response) => {
					let res = response.data || {};
					if (res.code) {
						this.$Message.info(res.message);
					} else {
						this.$Message.error(res.message);
					}
				}).finally(() => {
					this.spinShow = false;
				})
			},
		},
		mounted() {
			this.init();
		}
	}
</script>

<style lang="less">
	.activity_goods {
		padding: 1rem;
		background-color: #fff;
		width: 100%;
		min-width: 1080px;
	}

	.upload_cont {
		width: 100px;
		height: 100px;
		border-radius: 5px;
		border: 1px solid #efefef;
		margin: 10px auto;
		position: relative;
		overflow: hidden;

		img {
			width: 100%;
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			display: block;
		}
	}

	.activity_info {
		background-color: #fff;
		padding: 1rem;

		.ivu-icon-ios-loading {
			right: 10px;
		}

		.image-upload-list {
			display: inline-block;
			width: 100px;
			height: 100px;
			text-align: center;
			line-height: 60px;
			border: 1px solid transparent;
			border-radius: 4px;
			overflow: hidden;
			background: #fff;
			position: relative;
			box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
			margin-right: 4px;

			.bg {
				background: no-repeat center center / 100% auto;
				width: 100px;
				height: 100px;
				border: 1px solid #eee;
			}

			img {
				width: 100%;
				height: 100%;
			}

			.image-upload-list-cover {
				i {
					line-height: 100px;
				}
			}
		}

		.image-list-small {
			display: inline-block;
			width: 60px;
			height: 60px;
			text-align: center;
			line-height: 60px;
			border: 1px solid transparent;
			border-radius: 4px;
			overflow: hidden;
			background: #fff;
			position: relative;
			box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
			margin-right: 4px;

			.bg {
				background: no-repeat center center / 100% auto;
				width: 60px;
				height: 60px;
				border: 1px solid #eee;
			}
		}

		.image-upload-list-cover {
			display: none;
			position: absolute;
			top: 0;
			bottom: 0;
			left: 0;
			right: 0;
			background: rgba(0, 0, 0, .4);

			i {
				color: #fff;
				font-size: 30px;
				cursor: pointer;
				margin: 0 2px;
			}
		}

		.ivu-progress-outer {
			margin-top: 20px;
		}

		.image-upload-list:hover .image-upload-list-cover,
		.image-list-small:hover .image-upload-list-cover {
			display: block;
		}
	}

	.ivu-modal-body {
		padding-left: 0px;
		padding-right: 0px;
	}

	.appletModal {
		.ivu-modal-body {
			padding: 10px 15px;
		}

		.ivu-modal-footer {
			display: none;
		}
	}

	.t_title {
		height: 3rem;
		line-height: 3rem;
		padding: 0 16px;
		background-color: #e3ecf3;
	}

	.t_item {
		border-bottom: 1px solid #ccc;
		display: flex;
		/*width:100%;*/
		box-sizing: border-box;
		-moz-box-sizing: border-box;
		-webkit-box-sizing: border-box;
		margin: 0 16px;
		/*justify-content: center;*/
		align-items: center;

		.ivu-col {
			/*display:table-cell;*/
			vertical-align: middle;
			float: none;
			padding: 15px 10px;
			padding-left: 0px;
			box-sizing: border-box;
			-moz-box-sizing: border-box;
			-webkit-box-sizing: border-box;
			word-wrap: break-word;
		}
	}

	.t_item:after {
		display: none;
	}

	.t_item:before {
		display: none;
	}

	.w_200 {
		width: 200px;
	}

	.w_300 {
		width: 300px;
	}

	.spin-container {
		display: inline-block;
		width: 100%;
		height: 450px;
		position: relative;
		border: 1px solid #eee;
		overflow-y: scroll;
	}
</style>
