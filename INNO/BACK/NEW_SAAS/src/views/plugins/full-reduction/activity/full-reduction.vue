<template>
	<PageTopBase topTitle="促销规则" isSave @save="confirm">
		<div class="full-reduction">
			<Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="140" v-friendly-errors>
				<FormItem label="活动名称" prop="ruleName">
					<Input v-model="formItem.ruleName" placeholder="请输入活动名称" class="basic_input basic_input_fixed" :maxlength="30"
					 show-word-limit />
				</FormItem>
				<FormItem label="活动简称" prop="ruleNickName">
					<Input v-model="formItem.ruleNickName" placeholder="请输入活动简称" class="basic_input" />
					<p class="strong_tips">填写活动简称后，相关商品的商品详情页下的促销内容将会显示此简称内容。</p>
				</FormItem>
				<FormItem label="是否开启" prop="isEnable">
					<RadioGroup v-model="formItem.isEnable">
						<Radio label="1">是</Radio>
						<Radio label="0">否</Radio>
					</RadioGroup>
				</FormItem>
				<FormItem label="生效日期" prop="timeType">
					<RadioGroup v-model="formItem.timeType" vertical @on-change="handleChange">
						<Radio label="0" class="radio_item">每天有效期</Radio>
						<Radio label="1" class="radio_item">每周有效期</Radio>
						<Radio label="2">每月有效期</Radio>
					</RadioGroup>
					<div class="valid_time">
						<FormItem prop="limitWeekdays" class="form_item" ref="limitWeekdays" :show-message="formItem.timeType == 1">
							<Select v-model="formItem.limitWeekdays" multiple class="basic_select basic_select_fixed" :disabled="formItem.timeType != 1">
								<Option v-for="item in week" :value="item.value" :key="item.value">{{ item.label }}</Option>
							</Select>
						</FormItem>
						<FormItem prop="limitDays" ref="limitDays" :show-message="formItem.timeType == 2">
							<Select v-model="formItem.limitDays" multiple class="basic_select" :disabled="formItem.timeType != 2">
								<Option v-for="item in day" :value="item.value" :key="item.value">{{ item.label }}</Option>
							</Select>
						</FormItem>
					</div>
				</FormItem>
				<FormItem label="生效时段" prop="validTimeRange">
					<DatePicker v-model="formItem.validTimeRange" type="datetimerange" placeholder="请选择生效时段" class="time_range"
					 @on-change="handleTimeRange"></DatePicker>
				</FormItem>
				<FormItem label="生效时间" prop="isLimit">
					<RadioGroup v-model="formItem.isLimit">
						<Radio label="1">限制</Radio>
						<Radio label="0">不限制</Radio>
					</RadioGroup>
					<TimePicker v-if="formItem.isLimit == 1" v-model="formItem.limitTimeRange" type="timerange" placement="bottom-end" placeholder="请选择限制时间" style="width: 168px" @on-change="handleLimitTimeRange"></TimePicker>
				</FormItem>
				<FormItem label="是否允许使用优惠劵" v-if="activityType != 4 && activityType != 3" prop="isAllowCoupon">
					<RadioGroup v-model="formItem.isAllowCoupon">
						<Radio label="1">是</Radio>
						<Radio label="0">否</Radio>
					</RadioGroup>
				</FormItem>
				<FormItem label="是否允许使用积分" v-if="activityType != 4 && activityType != 3" prop="isAllowPoint">
					<RadioGroup v-model="formItem.isAllowPoint">
						<Radio label="1">是</Radio>
						<Radio label="0">否</Radio>
					</RadioGroup>
				</FormItem>
				<FormItem label="是否允许使用现金劵" prop="isAllowCashcoupon">
					<RadioGroup v-model="formItem.isAllowCashcoupon">
						<Radio label="1">是</Radio>
						<Radio label="0">否</Radio>
					</RadioGroup>
				</FormItem>
				<FormItem label="是否允许使用红包" prop="isAllowRedpack">
					<RadioGroup v-model="formItem.isAllowRedpack">
						<Radio label="1">是</Radio>
						<Radio label="0">否</Radio>
					</RadioGroup>
				</FormItem>
				<FormItem label="享受优惠会员等级" prop="userRank">
					<Select v-model="formItem.userRank" multiple class="basic_select">
						<Option v-for="item in levelList" :value="item.id" :key="item.id">{{ item.name }}</Option>
					</Select>
				</FormItem>
				<FormItem label="促销活动规则说明" prop="ruleRemark">
					<Input type="textarea" class="basic_textarea" v-model="formItem.ruleRemark" placeholder="限制字符数量为50个内" :rows="3" :maxlength="50"
					 show-word-limit />
				</FormItem>
				<FormItem label="备注说明" prop="remark">
					<Input type="textarea" class="basic_textarea" v-model="formItem.remark" placeholder="请输入备注说明" :rows="3" :maxlength="150"
					 show-word-limit />
				</FormItem>
				<FormItem label="优惠条件">
					<div v-for="(item, index) in formItem.rules" :key="item.id">
						<div class="rule_title">
							<span>{{index+1}}级优惠</span>
							<span @click="delRule(index)" v-show="index !== 0"><a>删除</a></span>
						</div>
						<div class="rule_content">
							<FormItem class="form_item_24" label="优惠门槛" :label-width="80" :prop="'rules.'+index+'.condition'" :rules="[
							  {required: true, message: '优惠门槛不能为空', trigger: 'blur', type: 'number'},
							  {message: '优惠门槛需大于0', trigger: 'blur', type: 'number', min: 0.01},
							  {validator: checkCondition, trigger: 'blur', type: 'number'}
							]">
								<label>满</label>
								<Input v-model="item.condition" type="number" style="width: 100px;" number />
								<label>{{activityType == 1 || activityType == 3 ? '元' : '件'}}</label>
							</FormItem>
							<FormItem class="form_item_24" label="优惠内容" :label-width="80" :prop="'rules.'+index+'.selectDiscount'" :rules="{required: true, message: '优惠内容不能为空', trigger: 'change', type: 'array', min: 1}">
								<CheckboxGroup v-model="item.selectDiscount" class="check_vertical">
									<Checkbox label="1">优惠送优惠券</Checkbox>
									<FormItem v-show="item.selectDiscount.includes('1')" class="form_item_24" ref="couponsRef" :prop="'rules.'+index+'.coupons'"
									 :rules="{validator: checkCoupons, type: 'array'}">
									 	<Button type="dashed" @click="(selected) => handleCouponSelected(selected, index)" class="basic_select">选择优惠券</Button>
										<!-- <coupon-select :data="item.coupons" type="checkbox" @del-tag="data => handleCouponClose(data, index)">
											<Button type="dashed" @click="(selected) => handleCouponSelected(selected, index)" class="basic_select">选择优惠券</Button>
										</coupon-select> -->
										<!-- <span>数量</span>
										<Input v-model="item.couponsNum" type="number" style="width: 100px;" number /> -->
									</FormItem>
									<Table :columns="couponColumn" :data="item.coupons" ref="myTable" v-show="item.selectDiscount.includes('1') && item.coupons && !!item.coupons.length"
									 width="500">
										<template slot-scope="{ row }" slot="nums">
											<InputNumber :min="1" v-model="row.nums" @on-change="val => handleCouponNum(val, index, row.id)"></InputNumber>
										</template>
										<template slot-scope="{ row }" slot="handle">
											<span @click="delCouponItem(index, row.id)"><a>删除</a></span>
										</template>
									</Table>
									
									<Checkbox label="2">订单送赠品</Checkbox>
									<FormItem v-show="item.selectDiscount.includes('2')" class="form_item_24" ref="giftsRef" :prop="'rules.'+index+'.gifts'"
									 :rules="{validator: checkGifts, type: 'array'}">
										<Button type="dashed" @click="(selected) => handleGiftSelected(selected, index)" class="basic_select">选择赠品</Button>
									</FormItem>
									<Table :columns="giftColumn" :data="item.gifts" ref="myTable" v-show="item.selectDiscount.includes('2') && item.gifts && !!item.gifts.length"
									 width="500">
										<template slot-scope="{ row }" slot="nums">
											<InputNumber :min="1" v-model="row.nums" @on-change="val => handleGiftNum(val, index, row.id)"></InputNumber>
										</template>
										<template slot-scope="{ row }" slot="handle">
											<span @click="delGiftItem(index, row.id)"><a>删除</a></span>
										</template>
									</Table>
									<Checkbox label="3" v-if="activityType == 1 || activityType == 2">订单免运费</Checkbox>
									<Checkbox label="4">积分</Checkbox>
									<RadioGroup v-model="item.pointType" vertical v-show="item.selectDiscount.includes('4')" class="radio_group_10"
									 @on-change="(typeValue) => {handlePointTypeChange(typeValue, index)}">
										<FormItem class="form_item_24" ref="pointTimesRef" :prop="'rules.'+index+'.pointTimes'" :rules="{validator: checkPointTimes, trigger: 'blur', type: 'number'}"
										 :show-message="item.pointType == 1">
											<Radio label="1" class="radio_item_10">
												<span>订单 X倍积分</span>
												<Input v-model="item.pointTimes" type="number" style="width: 100px;" number :disabled="item.pointType != 1" />
												<label>倍积分</label>
												<span class="strong_tips">（在原获得积分的基础上额外赠送）</span>
											</Radio>
										</FormItem>
										<FormItem class="form_item_24" ref="pointRef" :prop="'rules.'+index+'.point'" :rules="{validator: checkPoint, trigger: 'blur', type: 'number'}"
										 :show-message="item.pointType == 2">
											<Radio label="2">
												<span>订单赠送积分</span>
												<Input v-model="item.point" type="number" style="width: 100px;" number :disabled="item.pointType != 2" />
												<label>积分</label>
											</Radio>
										</FormItem>
									</RadioGroup>
									<Checkbox label="5" v-if="activityType != 4 && activityType != 3">订单金额优惠</Checkbox>
									<RadioGroup v-model="item.discountType" vertical v-show="activityType != 3 && activityType != 4 && item.selectDiscount.includes('5')"
									 @on-change="(typeValue) => {handleDiscountTypeChange(typeValue, index)}">
										<FormItem class="form_item_24" ref="discountRef" :prop="'rules.'+index+'.discount'" :rules="{validator: checkDiscount, trigger: 'blur', type: 'number'}"
										 :show-message="item.discountType == 2">
											<Radio label="2">
												<span>订单以固定折扣出售</span>
												<Input v-model="item.discount" type="number" style="width: 100px;" number :disabled="item.discountType != 2" />
												<label>折</label>
												<span class="strong_tips">（例如：9.8表示98折；8表示8折；数字最大不能超过10。）</span>
											</Radio>
										</FormItem>
										<FormItem class="form_item_24" ref="priceRef" :prop="'rules.'+index+'.price'"
										 :rules="{validator: checkPrice, trigger: 'blur', type: 'number'}" :show-message="item.discountType == 1">
											<Radio label="1" class="radio_item_10">
												<span>订单减固定价格购买</span>
												<Input v-model="item.price" type="number" style="width: 100px;" number :disabled="item.discountType != 1" />
												<label>元</label>
											</Radio>
										</FormItem>
										<FormItem v-show="activityType == 2" class="form_item_24" ref="priceingRef" :prop="'rules.'+index+'.pricing'"
										 :rules="{validator: checkPricing, trigger: 'blur', type: 'number'}" :show-message="item.discountType == 4">
											<Radio label="4" class="radio_item_10">
												<span>订单定价格购买</span>
												<Input v-model="item.pricing" type="number" style="width: 100px;" number :disabled="item.discountType != 4" />
												<label>元</label>
											</Radio>
										</FormItem>
										<FormItem v-show="activityType == 2" class="form_item_24" ref="numbersRef" :prop="'rules.'+index+'.numbers'"
										 :rules="{validator: checkNumbers, trigger: 'blur', type: 'number'}" :show-message="item.discountType == 3">
											<Radio label="3" class="radio_item_10">
												<span>免X件</span>
												<Input v-model="item.numbers" type="number" style="width: 100px;" number :disabled="item.discountType != 3" />
												<label>件</label>
											</Radio>
										</FormItem>
									</RadioGroup>
								</CheckboxGroup>
							</FormItem>
						</div>
					</div>
					<Divider class="divider" />
					<Button type="primary" icon="md-add" @click="createRule">新增一级优惠</Button>
				</FormItem>
				<FormItem label="参与活动商品" prop="isAllGoods">
					<RadioGroup v-model="formItem.isAllGoods" vertical>
						<Radio label="1" class="radio_item">全部商品</Radio>
						<Radio label="0">指定商品</Radio>
					</RadioGroup>
					<div class="goods_wrapper" v-if="formItem.isAllGoods == 0">
						<FormItem prop="goodsSelect">
							<div v-for="(item,index) in formItem.goodsSelect" :key="index">
								<Tag  
								size="large" closable 
								@on-close="onCloseGoods(index)">
								{{item.goods_name}} ( {{item.goods_sn}} )
								</Tag>
							</div>
							<Button type="dashed" @click="handleSelect" class="basic_select" style="width: 200px;">选择商品</Button>
							<span v-show="formItem.goodsSelect.length">已选{{formItem.goodsSelect.length}}个商品</span>
						</FormItem>
					</div>
				</FormItem>
			</Form>
		</div>
		<expand-select ref="expandSelect" :selected="formItem.goodsSelect" title="选择满减商品" @get-goods-id="handleGoodsId" @get-goods="onSelectGoods"></expand-select>
		<Spin size="large" fix v-if="spinShow"></Spin>
	</PageTopBase>
</template>

<script>
	import PageTopBase from '@/views/my-components/page-top-base/index';
	import CouponSelect from '@/views/my-components/list-component/index-edit';
	import ValidFieldMixin from './valid-field-mixin';
	import Control from '@/libs/page-control';
	import StaticData from './static-data';
	import vueUntils from '@/libs/vue-utils';
	import ExpandSelect from '@/views/my-components/expand-select/index';
	const {
		transferNumber
	} = vueUntils;

	export default {
		props: ['id'],
		data() {
			return {
				formItem: {
					ruleName: '',
					ruleNickName: '',
					isEnable: '0',
					timeType: '0',
					limitWeekdays: [],
					limitDays: [],
					validTimeRange: [],
					limitTimeRange:[],
					startTime: '',
					endTime: '',
					limitStartTime: '',
					limitEndTime: '',
					isLimit: '0',
					isAllowCoupon: '0',
					isAllowPoint: '0',
					isAllowCashcoupon: '0',
					isAllowRedpack: '0',
					userRank: [],
					remark: '',
					ruleRemark: '',
					isAllGoods: '1',
					goodsSelect: [],
					goods_ids: [],
					rules: [{
						id: 1,
						condition: '',
						selectDiscount: [],
						coupons: [],
						gifts: [],
						pointType: '1',
						pointTimes: '',
						point: '',
						discountType: '2',
						price: '',
						pricing: '',
						discount: '',
						numbers: '',
						// couponsNum: '1'
					}]
				},
				levelList: [],
				spinShow: false,
				conditionType: '1' //1是满减  2是满件
			}
		},
		mixins: [ValidFieldMixin, Control, StaticData],
		computed: {
			activityType() {
				let type;
				if (this.id) {
					// 编辑先获取是常规还是全场，再通过接口请求得到对应的规则类型
					if (this.$route.query.type === 'normal') {
						type = (this.conditionType == 1) ? 1 : 2;
					} else {
						type = (this.conditionType == 1) ? 3 : 4;
					}
				} else {
					// 添加直接读取值
					type = Number(this.$route.query.type);
				}
				return type;
			}
		},
		components: {
			PageTopBase,
			CouponSelect,
			ExpandSelect
		},
		methods: {
			loadData() {
				this.spinShow = true;
				this.$ajax.post((this.activityType == 1 || this.activityType == 2) ? this.$api.fullReductionGeneralInfo : this.$api
					.fullReductionOverallInfo, {
						rule_id: this.id || 0
					}).then(response => {
					const res = response.data;
					if (res.code) {
						this.levelList = res.data && res.data.rank_list;
						this.conditionType = res.data && res.data.items && res.data.items.condition_type;
						let data = res.data && res.data.items;
						if (data) {
							this.formItem = {
								ruleName: data.rule_name,
								ruleNickName: data.rule_nick_name,
								isEnable: data.is_enable,
								timeType: data.time_type,
								limitWeekdays: data.time_type == 1 && data.limit_type_value.map(Number) || [],
								limitDays: data.time_type == 2 && data.limit_type_value.map(Number) || [],
								isLimit: data.is_limit,
								validTimeRange: [data.start_time, data.end_time],
								limitTimeRange: [data.valid_begin_time, data.valid_end_time],
								startTime: data.start_time,
								endTime: data.end_time,
								limitStartTime: data.valid_begin_time,
								limitEndTime: data.valid_end_time,
								isAllowCoupon: data.is_allow_coupon,
								isAllowPoint: data.is_allow_point,
								isAllowCashcoupon: data.is_allow_cashcoupon,
								isAllowRedpack: data.is_allow_redpack,
								userRank: data.ranks,
								remark: data.remark,
								ruleRemark: data.rule_remark,
								isAllGoods: data.is_all_goods,
								goodsSelect: data.select_goods_id,
								goods_ids: data.goods_ids,
								rules: data.condition.map((item, index) => {
									return Object.assign({}, {
										id: ++index,
										condition: Number(item.condition_number),
										selectDiscount: item.condition_select.map(String), //留意这里，就没有统一数据类型
										coupons: item.bonus_type_value.filter(item => {
											item.nums = Number(item.send_coupon_num);
											return true;
										}),
										// couponsNum: item.bonus_nums_value,
										gifts: item.send_gift_value.filter(item => {
											item.nums = Number(item.send_gift_num);
											return true;
										}),
										pointType: item.condition_select.includes(4) ? (item.x_integral_value ? '1' : '2') : '1', //选中时代表是在编辑状态,如果是创建或没选择默认为1
										pointTimes: item.x_integral_value,
										point: item.send_integral_value,
										discountType: item.condition_select.includes(5) ? (item.is_pirce_value ? '1' : (item.is_discount_value ?
											'2' : item.free_x_piece_value ? '3' : '4')) : '2',
										price: item.is_pirce_value,
										pricing: item.is_pricing_value,
										discount: item.is_discount_value,
										numbers: item.free_x_piece_value
									})
								})
							};
							// 存储原始数据
							Object.defineProperty(this, 'originData', {
								value: JSON.parse(JSON.stringify(this.formItem.rules))
							});
						}
					}
					this.spinShow = false;
				})
			},
			handleTimeRange([startTime, endTime]) {
				this.formItem.startTime = startTime;
				this.formItem.endTime = endTime;
			},
			handleLimitTimeRange([startTime, endTime]) {
				this.formItem.limitStartTime = startTime;
				this.formItem.limitEndTime = endTime;
			},
			createRule() {
				let newId = this.formItem.rules[this.formItem.rules.length - 1].id;
				this.formItem.rules.push({
					id: ++newId,
					condition: '',
					selectDiscount: [],
					coupons: [],
					gifts: [],
					pointType: '1',
					pointTimes: '',
					point: '',
					discountType: '2',
					price: '',
					pricing: '',
					discount: '',
					numbers: ''
				});
			},
			delRule(index) {
				this.formItem.rules.splice(index, 1);
			},
			handleSelect() {
				this.$refs.expandSelect.show().load();
			},
			handleCouponSelected(selected, index) {
				this.$selectContent({
					mode: 'coupon',
					type: 'checkbox',
					data: this.formItem.rules[index].coupons,
					getList: (data) => {
						// this.formItem.rules[index].coupons = data;
						this.formItem.rules[index].coupons = data.filter(item => {
							item.nums = item.nums ? item.nums : 1;
							return true;
						});
						this.$refs.formValidate.validateField(`rules.${index}.coupons`);
					}
				});
			},
			handleCouponClose(data, index) {
				this.formItem.rules[index].coupons = data;
				this.$refs.formValidate.validateField(`rules.${index}.coupons`);
			},
			handleGiftSelected(selected, index) {
				this.$selectContent({
					mode: 'gift',
					type: 'checkbox',
					data: this.formItem.rules[index].gifts,
					getList: (data) => {
						this.formItem.rules[index].gifts = data.filter(item => {
							item.nums = item.nums ? item.nums : 1;
							return true;
						});
						this.$refs.formValidate.validateField(`rules.${index}.gifts`);
					}
				});
			},
			handleCouponNum(val, index, id) {
				const curIndex = this.formItem.rules[index].coupons.findIndex(item => item.id === id);
				this.formItem.rules[index].coupons[curIndex].nums = val;
			},
			handleGiftNum(val, index, id) {
				const curIndex = this.formItem.rules[index].gifts.findIndex(item => item.id === id);
				this.formItem.rules[index].gifts[curIndex].nums = val;
			},
			delCouponItem(index, id) {
				const curIndex = this.formItem.rules[index].coupons.findIndex(item => item.id === id);
				this.formItem.rules[index].coupons.splice(curIndex, 1);
			},
			delGiftItem(index, id) {
				const curIndex = this.formItem.rules[index].gifts.findIndex(item => item.id === id);
				this.formItem.rules[index].gifts.splice(curIndex, 1);
			},
			handleChange() {
				this.$refs.limitWeekdays.validateState = '';
				this.$refs.limitDays.validateState = '';
			},
			handlePointTypeChange(typeValue, index) {
				this.$refs.pointTimesRef[index].validateState = '';
				this.$refs.pointRef[index].validateState = '';
			},
			handleDiscountTypeChange(typeValue, index) {
				// 相关的元素上不要使用v-if,会造成数据错误
				this.$refs.priceRef[index].validateState = '';
				this.$refs.discountRef[index].validateState = '';
				this.$refs.priceingRef[index].validateState = '';
				this.$refs.numbersRef[index].validateState = '';
			},
			handleGoodsId(ids) {
			// 	console.log(ids)
			// 	this.formItem.goodsSelect = ids;
			},
			onSelectGoods( items ){
				// console.log("change goodsItems", items);
				this.formItem.goodsSelect = items;
				let ids = [];
				for(let i = 0; i < items.length; i++){
					ids.push(items[i].goods_id)
				}
				this.formItem.goods_ids = ids.join(",");
			},
			onCloseGoods( index ){
				this.$Modal.confirm({
					title: '操作提示',
					content: '确定取消当前商品关联吗？',
					okText: '确定',
					cancelText: '取消',
					onOk: () => {
						this.$delete(this.formItem.goodsSelect, index);
						let ids = [];
						for(let i = 0; i < this.formItem.goodsSelect.length; i++){
							ids.push(this.formItem.goodsSelect[i].goods_id)
						}
						this.formItem.goods_ids = ids.join(",");
					},
				});
			},
			confirm() {
				this.$refs.formValidate.validate(valid => {
					if (valid) {
						let hasChange = JSON.stringify(this.formItem.rules) !== JSON.stringify(this.originData);
						let api;
						if (this.id) {
							// 编辑
							api = (this.activityType == 1 || this.activityType == 2) ? this.$api.fullReductionGeneralEdit : this.$api.fullReductionOverallEdit;
						} else {
							// 添加
							switch (this.activityType) {
								case 1:
								case 3:
									api = this.$api.fullReductionGeneralMoneyAdd;
									break;
								case 2:
								case 4:
									api = this.$api.fullReductionGeneralPieceAdd;
									break;
								default:
									break;
							}
						}
						this.spinShow = true;
						this.$ajax.post(api, {
								rule_id: this.id || 0,
								condition_state: hasChange ? 2 : 1, //优惠条件是否更改
								rule_name: this.formItem.ruleName,
								rule_nick_name: this.formItem.ruleNickName,
								is_enable: this.formItem.isEnable,
								rule_type: (this.activityType == 1 || this.activityType == 2) ? 0 : 1, //1 全场促销 0常规促销
								time_type: this.formItem.timeType, //生效日期 0 每天 1每周 2每月
								start_time: this.formItem.startTime,
								end_time: this.formItem.endTime,
								is_allow_coupon: this.formItem.isAllowCoupon,
								is_allow_point: this.formItem.isAllowPoint,
								is_allow_cashcoupon: this.formItem.isAllowCashcoupon,
								is_allow_redpack: this.formItem.isAllowRedpack,
								user_rank: this.formItem.userRank.join(),
								remark: this.formItem.remark,
								rule_remark: this.formItem.ruleRemark,
								limit_weekdays: this.formItem.limitWeekdays.join(),
								limit_days: this.formItem.limitDays.join(),
								is_all_goods: this.formItem.isAllGoods, //1全场 0选择
								goods_ids: this.formItem.goods_ids,
								is_limit: this.formItem.isLimit,
								valid_begin_time: this.formItem.limitStartTime,
								valid_end_time: this.formItem.limitEndTime,
								condition: this.formItem.rules.map(item => {
									return Object.assign({}, {
										condition_number: item.condition,
										bonus_type: transferNumber(item.selectDiscount.includes('1')), //是否送优惠卷 1是 0否
										send_gift: transferNumber(item.selectDiscount.includes('2')), //是否开启订单送赠品 1是 0否
										free_shipping: transferNumber(item.selectDiscount.includes('3')), //是否开启订单免运费 1是 0否
										x_integral: transferNumber(item.selectDiscount.includes('4') && item.pointType == 1), //是否开启订单x倍积分 1是 0否
										send_integral: transferNumber(item.selectDiscount.includes('4') && item.pointType == 2), //是否开启订单赠送积分 1是 0否
										is_discount: transferNumber(item.selectDiscount.includes('5') && item.discountType == 2), //是否开启订单以固定折扣出售 1是0否
										is_pirce: transferNumber(item.selectDiscount.includes('5') && item.discountType == 1), //是否开启订单减固定价格购买 1是 0否
										is_pricing: transferNumber(item.selectDiscount.includes('5') && item.discountType == 4), //是否开启订单定价格
										free_x_piece: transferNumber(item.selectDiscount.includes('5') && item.discountType == 3), //是否开启免x件1是0否

										bonus_type_value: item.coupons.map(item => item.id).join(), //送优惠卷的值
										bonus_nums_value: item.coupons.map(item => item.nums).join(), //送优惠券的数量
										send_gift_value: item.gifts.map(item => item.id).join(), //赠送品名称的id
										send_gift_num: item.gifts.map(item => item.nums).join(), //赠送品数量 字符串
										x_integral_value: item.pointTimes, //订单x倍积分的值
										send_integral_value: item.point, //赠送积分的值
										is_pirce_value: item.price, // 开启订单减固定价格购买的值
										is_pricing_value: item.pricing, // 开启订单定价格的值
										is_discount_value: item.discount, //是否开启订单以固定折扣出售的值
										free_x_piece_value: item.numbers //是否开启免x件的值
									})
								})
							})
							.then(response => {
								const res = response.data;
								if (res.code) {
									this.$Message.success(res.message);
									this.isGlobalLeaveTip = false;
									this.$router.go(-1);
								}
								this.spinShow = false;
							});
					}
				})
			}
		},
		mounted() {
			this.loadData();
		}
	}
</script>

<style lang="less">
	.full-reduction {
		.inline() {
			display: inline-block;
			vertical-align: top;
			margin-top: 52px;
		}

		.basic_input_fixed,
		.basic_textarea {
			max-width: 420px;
		}

		.radio_item {
			margin-bottom: 24px;
		}

		.valid_time {
			.form_item {
				margin-bottom: 24px;
			}

			.inline
		}

		.time_range {
			width: 340px;
		}

		.goods_wrapper {
			.inline
		}

		.rule_title {
			display: flex;
			align-items: center;
			justify-content: space-between;
			width: 560px;
			height: 30px;
			line-height: 30px;
			background: #f7f8fa;
			padding: 0 5px;
		}

		.check_vertical {
			display: flex;
			flex-direction: column;
		}

		.radio_item_10,
		.radio_group_10 {
			margin-bottom: 10px;
		}

		.form_item_24 {
			margin-bottom: 24px;
		}

		.divider {
			width: 560px;
			min-width: 560px;
		}
	}
</style>
