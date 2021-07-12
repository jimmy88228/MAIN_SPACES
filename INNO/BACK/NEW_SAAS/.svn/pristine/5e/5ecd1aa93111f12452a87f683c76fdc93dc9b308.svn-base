<template>
	<PageTopBase isSave @save="confirm">
		<div class="coupon-details">
			<Row type="flex">
				<Col style="width:400px;" ref="uiRef">
					<slot name="ui" v-bind:formItem="formItem" v-bind:formShowList="formShowList"></slot>
				</Col>
				<Col style="flex:1 1 0%;min-width:450px;" ref="infoRef">
				<div class="coupon-basic-info">
					<titleBar>基本信息({{sendTypeName}}+{{bonusTypeName}})</titleBar>
					<Form ref="formValidate" :model="formItem" :rules="ruleBasicValidate" :label-width="140" v-friendly-errors>
						<FormItem label="优惠券名称" prop="typeName">
							<Input v-model="formItem.typeName" placeholder="请输入优惠券名称" class="basic_input basic_input_fixed" :maxlength="30"
							 show-word-limit />
							<Checkbox v-model="formItem.isShowName" true-value="1" false-value="0">是否显示优惠券名称</Checkbox>
						</FormItem>
						<FormItem label="优惠券描述" prop="bonusDesc">
							<Input type="textarea" class="basic_textarea" v-model="formItem.bonusDesc" placeholder="请输入优惠券描述" :rows="3"
							 :maxlength="150" show-word-limit />
						</FormItem>
						<!-- 折扣优惠券 -->
						<FormItem label="订单满" prop="discount" v-if="formShowList.isDiscount">
							<div class="discount_wrapper">
								<FormItem prop="discount.startAmount" :rules="startAmountRule">
									<Input v-model="formItem.discount.startAmount" type="number" placeholder="订单金额" class="order_count" number></Input>
									<span>-</span>
								</FormItem>
								<FormItem prop="discount.endAmount" :rules="endAmountRule">
									<Input v-model="formItem.discount.endAmount" type="number" placeholder="订单金额" class="order_count" number></Input>
									<span class="unit">元</span>
								</FormItem>
								<FormItem prop="discount.discount" :rules="discountRule">
									<label>打</label>
									<Input v-model="formItem.discount.discount" type="number" placeholder="优惠券折扣" class="order_count" number></Input>
									<label>折</label>
									<p class="strong_tips">注：65折填入0.65即可</p>
								</FormItem>
							</div>
							<p class="strong_tips">订单金额为0时，表示无门槛优惠券</p>
						</FormItem>
						<!-- 非折扣优惠券 -->
						<FormItem label="订单满" prop="fullDiscount" v-else>
							<div class="discount_wrapper">
								<FormItem prop="fullDiscount.amount" :rules="fullDiscountAmountRule">
									<Input v-model="formItem.fullDiscount.amount" type="number" placeholder="订单金额" class="order_count" number></Input>
									<span class="unit">元</span>
								</FormItem>
								<FormItem prop="fullDiscount.discount" :rules="fullDiscountRule">
									<label>抵扣</label>
									<Input v-model="formItem.fullDiscount.discount" type="number" placeholder="优惠券面值" class="order_count" number></Input>
									<span class="unit">元</span>
									<Checkbox v-model="formItem.fullDiscount.isHideMoneyShow" true-value="1" false-value="0">前端隐藏优惠券面额区域</Checkbox>
								</FormItem>
							</div>
							<p class="strong_tips">订单金额为0时，表示无门槛优惠券</p>
						</FormItem>
						<FormItem label="有效期类型" prop="validityTime">
							<RadioGroup v-model="formItem.validityTime.validityLimitType" vertical @on-change="handleChange">
								<Radio label="1" class="basic_radio">
									<span>规定时间内有效</span>
									<FormItem ref="validDateRangeItem" prop="validityTime.validDateRange" :rules="validDateRangeRule" style="display: inline-block;"
									 :show-message="formItem.validityTime.validityLimitType == 1">
										<DatePicker type="datetimerange" v-model="formItem.validityTime.validDateRange" placeholder="请选择有效期" style="width: 340px;"
										 :disabled="formItem.validityTime.validityLimitType != 1" confirm transfer></DatePicker>
									</FormItem>
								</Radio>
								<Radio label="2" class="basic_radio">
									<span>领取一段时间内有效（单位：月）</span>
									<FormItem ref="validityMonthItem" prop="validityTime.validityMonth" :rules="validityMonthRule" style="display: inline-block;"
									 :show-message="formItem.validityTime.validityLimitType == 2">
										<InputNumber :min="1" v-model="formItem.validityTime.validityMonth" :disabled="formItem.validityTime.validityLimitType != 2"></InputNumber>
									</FormItem>
								</Radio>
								<Radio label="3">
									<span>领取一段时间内有效（单位：天）</span>
									<FormItem ref="validityDayItem" prop="validityTime.validityDay" :rules="validityDayRule" style="display: inline-block;"
									 :show-message="formItem.validityTime.validityLimitType == 3">
										<InputNumber :min="1" v-model="formItem.validityTime.validityDay" :disabled="formItem.validityTime.validityLimitType != 3"></InputNumber>
									</FormItem>
								</Radio>
							</RadioGroup>
						</FormItem>

						<!--领券冻结时间-->
						<FormItem label="领券冻结时间" prop="fullDiscount" v-if="formItem.validityTime.validityLimitType != 1">
							<div class="discount_wrapper">
								<FormItem prop="fullDiscount.amount" :rules="freezeTimeRule">
									<Input v-model="formItem.validityTime.freezeTime" type="number" placeholder="领券冻结时间" class="order_count" number></Input>
									<span class="unit">单位：小时</span>
								</FormItem>
							</div>
							<p class="strong_tips">*券冻结时间从领券开始计算，优惠券冻结时间内不能使用</p>
						</FormItem>

						<FormItem label="是否开启叠加" prop="canOverlying" v-if="formShowList.canOverlying">
							<RadioGroup v-model="formItem.canOverlying" v-if="formShowList.canOverlying.isUnique">
								<Radio label="0">否</Radio>
							</RadioGroup>
							<RadioGroup v-model="formItem.canOverlying" v-else>
								<Radio label="1" :disabled="isEditStaus">是</Radio>
								<Radio label="0" :disabled="isEditStaus">否</Radio>
							</RadioGroup>
							<template v-if="formShowList.canOverlying.showNumber">
								<InputNumber :min="1" v-model="formItem.overlyingCount" :disabled="formItem.canOverlying == 0 || isEditStaus"></InputNumber>
								<p class="strong_tips"> 券可以叠加使用，自叠加次数设定在一个订单中使用该券的次数，数量1则不叠加</p>
							</template>
							<p class="strong_tips">叠加使用只在ERP中有效，微商城与小程序无法叠加使用</p>
						</FormItem>
						<FormItem label="是否与其它券叠加" prop="isMutex" v-if="formShowList.isMutex">
							<RadioGroup v-model="formItem.isMutex">
								<Radio label="1" :disabled="isEditStaus">是</Radio>
								<Radio label="0" :disabled="isEditStaus">否</Radio>
							</RadioGroup>
							<p class="strong_tips">勾选“是”，为折扣券时，只允许与满减券叠加；为满减券时，可以与满减券与折扣券叠加使用，ERP券除外</p>
						</FormItem>

						<!--是否特定券-->
						<FormItem label="是否特定券" prop="noOverlyingBonus" v-if="formItem.isMutex == '1' && this.$route.query.pid != 4">
							<RadioGroup v-model="formItem.noOverlyingBonus">
								<Radio label="1" :disabled="isEditStaus">是</Radio>
								<Radio label="0" :disabled="isEditStaus">否</Radio>
							</RadioGroup>
							<p class="strong_tips">勾选“是”，为折扣券时，只允许与满减券叠加；为满减券时，可以与满减券与折扣券叠加使用，ERP券除外</p>
						</FormItem>

						<FormItem label="是否参加常规促销" prop="canJoinPromote" v-if="formShowList.canJoinPromote">
							<RadioGroup v-model="formItem.canJoinPromote" v-if="formShowList.canJoinPromote.isUnique">
								<Radio label="0">否</Radio>
							</RadioGroup>
							<RadioGroup v-model="formItem.canJoinPromote" v-else>
								<Radio label="1" :disabled="isEditStaus">是</Radio>
								<Radio label="0" :disabled="isEditStaus">否</Radio>
							</RadioGroup>
							<p class="strong_tips">勾选‘是’，则该券可以与‘满减' 和 '满件'活动叠加使用</p>
						</FormItem>

						<FormItem label="是否还原商品原价" prop="restoreMarketPrice" v-if="formShowList.restoreMarketPrice">
							<RadioGroup v-model="formItem.restoreMarketPrice">
								<Radio label="1" :disabled="isEditStaus">是</Radio>
								<Radio label="0" :disabled="isEditStaus">否</Radio>
							</RadioGroup>
							<p class="strong_tips">选择否，商品在促销价基础上使用满减券；选择是，商品在原价基础上使用满减券</p>
						</FormItem>
						<FormItem label="是否折上折" prop="isMultipleDiscount" v-if="formShowList.isMultipleDiscount">
							<RadioGroup v-model="formItem.isMultipleDiscount">
								<Radio label="1" :disabled="isEditStaus">是</Radio>
								<Radio label="0" :disabled="isEditStaus">否</Radio>
							</RadioGroup>
							<p class="strong_tips">选择是，商品在促销价基础上使用折扣劵 ，选着否，商品在原价基础上使用折扣劵</p>
						</FormItem>
						<FormItem label="折扣券商品数量限制" prop="maxUseGoods" v-if="formShowList.maxUseGoods">
							<InputNumber :min="1" v-model="formItem.maxUseGoods"></InputNumber>
							<p class="strong_tips">折扣劵最大可使用商品的数量</p>
						</FormItem>
						<FormItem label="是否计算运费" prop="inShippingfee" v-if="formShowList.inShippingfee">
							<RadioGroup v-model="formItem.inShippingfee">
								<Radio label="1" :disabled="isEditStaus">是</Radio>
								<Radio label="0" :disabled="isEditStaus">否</Radio>
							</RadioGroup>
							<p class="strong_tips">不计算则按订单实付金额，计算则按订单实付+运费计算满足条件</p>
						</FormItem>

						<FormItem label="是否计算分销提成" prop="isCalcComm" v-if="formShowList.isCalcComm">
							<RadioGroup v-model="formItem.isCalcComm">
								<Radio label="1" :disabled="isEditStaus">是</Radio>
								<Radio label="0" :disabled="isEditStaus">否</Radio>
							</RadioGroup>
							<p class="strong_tips">*勾选“是”，订单分销提成机制保持原有不变；勾选“否”，当订单使用了这张券时，则不计算该订单的提成；</p>
						</FormItem>
					</Form>
				</div>
				<slot name="extend" v-bind:data="data" v-bind:editData="editData"></slot>
				</Col>
			</Row>
		</div>
		<Spin size="large" fix v-if="spinShow"></Spin>
	</PageTopBase>
</template>

<script>
	import titleBar from '@/views/my-components/title-bar/title-bar';
	import PageTopBase from '@/views/my-components/page-top-base/index';
	import ValidFieldMixin from './valid-field-mixin';
	import SaveInfoMixin from './save-info-mixin';

	export default {
		name: 'CouponBasicInfo',
		mixins: [ValidFieldMixin, SaveInfoMixin],
		props: {
			formShowList: {
				type: Object,
				required: true
			}
		},
		components: {
			titleBar,
			PageTopBase
		},
		data() {
			return {
				data: {},
				editData: {},
				// 基础信息
				formItem: {
					typeName: '',
					bonusDesc: '',
					isShowName: '0',
					canOverlying: '0',
					overlyingCount: 1,
					isMutex: '1',
                    noOverlyingBonus: '1',
					canJoinPromote: '0',
					isMultipleDiscount: '0',
					inShippingfee: '1',
                    isCalcComm: '1', //是否计算分销提成
					restoreMarketPrice: '0',
					maxUseGoods: 1,
					fullDiscount: {
						amount: '',
						discount: '',
						isHideMoneyShow: '0'
					},
					discount: {
						startAmount: '',
						endAmount: '',
						discount: ''
					},
					validityTime: {
						validityLimitType: '1',
						validDateRange: [],
						validityMonth: 1,
						validityDay: 1,
                        freezeTime: 0
					}
				},
				// 扩展信息
				extendFormItem: {},
				extendForm: {},
				sendTypeName: '',
				bonusTypeName: '',
				spinShow: false
			}
		},
		computed: {
			isEditStaus() {
				return this.$route.query.isEdit && Number(this.$route.query.isEdit) ? true : false;
			}
		},
		methods: {
			loadAddData() {
				this.spinShow = true;
				return this.$ajax.post(this.$api.couponsAddInfo)
					.then(response => {
						const res = response.data;
						if (res.code) {
							this.data = res.data;
						}
						this.spinShow = false;
					});
			},
			loadEditData() {
				this.spinShow = true;
				return this.$ajax.post(this.$api.couponsInfo, {
						type_id: this.$route.params.id,
						show_type: this.isEditStaus ? 'edit' : 'copy'
					})
					.then(response => {
						const res = response.data;
						if (res.code) {
							const {
								// 发放类型中文名称
								send_type_name,
								// 优惠券类型中文名称
								bonus_type_name,
								type_name,
								bonus_desc,
								is_show_name,
								can_overlying,
								overlying_count,
								is_mutex,
                                no_overlying_bonus,
								can_join_promote,
								is_multiple_discount,
								in_shippingfee,
                                is_calc_comm,
								restore_market_price,
								max_use_goods,
								// 非折扣优惠券
								min_goods_amount,
								type_money,
								is_hide_money_show,
								// 折扣优惠券
								min_amount,
								max_amount,
								discount,
								// 有效期
								validity_limit_type,
                                freeze_time,
								use_start_date,
								use_end_date,
								validity_value
							} = res.data.items;
							this.editData = res.data.items;
							this.formItem = {
								typeName: type_name,
								bonusDesc: bonus_desc,
								isShowName: is_show_name,
								canOverlying: can_overlying,
								overlyingCount: Number(overlying_count),
								isMutex: is_mutex,
                                noOverlyingBonus: no_overlying_bonus,
								canJoinPromote: can_join_promote,
								isMultipleDiscount: is_multiple_discount,
								inShippingfee: in_shippingfee,
                                isCalcComm: is_calc_comm,
								restoreMarketPrice: restore_market_price,
								maxUseGoods: Number(max_use_goods),
								fullDiscount: {
									amount: min_goods_amount,
									discount: type_money,
									isHideMoneyShow: is_hide_money_show
								},
								discount: {
									startAmount: Number(min_amount),
									endAmount: Number(max_amount),
									discount: discount
								},
								validityTime: {
									validityLimitType: validity_limit_type,
									validDateRange: [use_start_date, use_end_date],
									validityMonth: validity_limit_type == 2 ? Number(validity_value) : 1,
									validityDay: validity_limit_type == 3 ? Number(validity_value) : 1,
                                    freezeTime: freeze_time
								}
							};
							this.sendTypeName = send_type_name;
							this.bonusTypeName = bonus_type_name;
						}
						this.spinShow = false;
					});
			},
			handleChange() {
				this.$refs.validDateRangeItem.validateState = '';
				this.$refs.validityMonthItem.validateState = '';
				this.$refs.validityDayItem.validateState = '';
			}
		},
		mounted() {
			if (!this.$route.params.id) {
				this.loadAddData();
			} else {
				this.loadAddData().then(() => {
					this.loadEditData();
				});
			}
		},
		watch: {
			formShowList(nV) {
				//是否参加常规促销 默认值有别
				if (nV.canJoinPromote && !nV.canJoinPromote.isUnique) {
					this.formItem.canJoinPromote = String(nV.canJoinPromote.defaultValue);
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	.coupon-basic-info {

		.basic_input_fixed,
		.basic_textarea {
			max-width: 420px;
		}

		.order_count {
			width: 130px;
		}

		.unit {
			display: inline-block;
			margin-right: 10px;
		}

		.basic_radio {
			margin-bottom: 24px;
		}

		.discount_wrapper {
			display: flex;
			align-items: flex-start;
		}
	}
</style>
