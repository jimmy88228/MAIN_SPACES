<template>
	<PageTopBase topTitle="编辑签到下单赠送" isSave @save="confirm">
		<div class="sign_activity_form">
			<Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="160">
				<FormItem label="活动名称" prop="name">
					<Input v-model="formItem.name" placeholder="请输入活动名称" class="basic_input basic_input_fixed" :maxlength="30"
					 show-word-limit />
				</FormItem>
				<FormItem label="活动时间" prop="validTimeRange">
					<DatePicker v-model="formItem.validTimeRange" type="datetimerange" placeholder="请选择活动时间" class="time_range"
					 @on-change="handleTimeRange"></DatePicker>
				</FormItem>

				<FormItem label="“立即下单”跳转链接" prop="jump_path">
					<Input v-model="formItem.jump_path" placeholder="请输入立即下单跳转链接" class="basic_input basic_input_fixed" :maxlength="30"
						   show-word-limit />
				</FormItem>

				<FormItem label="是否开启" prop="is_enabled">
					<i-switch size="large" v-model="formItem.is_enabled" true-value="1" false-value="0">
						<span slot="open">开启</span>
						<span slot="close">关闭</span>
					</i-switch>

					<Button type="primary" @click="addRule">添加连续签到规则</Button>
					<div v-for="(item, index) in formItem.rule_data" :key="item.id" class="rule_wrapper">
						<div class="rule_title">
							<span>{{index+1}}级赠送</span>
							<span @click="delRule(index)"><a>删除</a></span>
						</div>

						<FormItem class="form_item_24" :label-width="0" :prop="'rule_data.'+index+'.continuous_days'" :rules="[{required: true, message: '连续签到不能为空', trigger: 'blur', type: 'number'} ]">
							<label v-if="index > 0">在{{index}}级基础上再</label>
							<label>连续签到</label>
							<InputNumber v-model="item.continuous_days" />
							<label>天</label>
						</FormItem>

						<FormItem class="form_item_24" :label-width="0" :prop="'rule_data.'+index+'.coupon'">
							<label>并下单赠送</label>
							<coupon-select :data="item.coupon" type="checkbox" @del-tag="e => handleMoreCouponClose(e, index)">
								<Button type="dashed" @click="handleMoreCouponSelected(index)" class="basic_select">选择赠品</Button>
							</coupon-select>
							<label>赠品库存：<InputNumber disabled="disabled" v-model="item.total_number" /> 已领数量：{{ item.receive_number }}</label>
						</FormItem>
					</div>
				</FormItem>
			</Form>
		</div>
		<Spin size="large" fix v-if="spinShow"></Spin>
	</PageTopBase>
</template>

<script>
	import PageTopBase from '@/views/my-components/page-top-base/index';
	import ImageEdit from '@/views/my-components/image-edit/image-edit';
	import CouponSelect from '@/views/my-components/list-component/index-edit';
	import RichText from '@/views/my-components/rich-text/index';
	import PagesSelect from '@/views/my-components/list-component/index-edit';
	import LotterySelect from '@/views/my-components/list-component/index-edit';

	export default {
		props: ['id'],
		components: {
			PageTopBase,
			ImageEdit,
			CouponSelect,
			RichText,
			PagesSelect,
			LotterySelect
		},
		data() {
			const checkValidRange = (rule, value, callback) => {
				if (!value[0] && !value[1]) {
					callback(new Error('活动时间不能为空'));
				} else {
					callback();
				}
			}
			return {
				formItem: {
				    id: 0,
					name: '',
					validTimeRange: [],
                    jump_path:'',
					from_time: '',
					to_time: '',
					gift_bonus: '',
                    is_enabled: '0',
					rule_data: [],
					lotteryData: []
				},
				ruleValidate: {
					name: [{
						required: true,
						message: '活动名称不能为空',
						trigger: 'blur'
					}],
					validTimeRange: [{
						required: true,
						trigger: 'change',
						type: 'array',
						validator: checkValidRange
					}],
				},
				bonusData: [],
				pagesData: [],
				freezeData: [],
				spinShow: false
			}
		},
		methods: {
		    //删除赠送商品
            delRule(index) {
                this.formItem.rule_data.splice(index, 1);
            },
			loadData() {
				this.spinShow = true;
				return this.$ajax.post(this.$api.signOrderGiveInfo, {
						id: this.id
					})
					.then(response => {
						const res = response.data;
						if (res.code) {
							let data = res.data && res.data.items;
							if (data) {
								this.formItem = {
									...data,
									rule_data: data.order_details.filter(item => {
                                        item.coupon = [
											{
											 	goods_id: item.goods_id,
												id: item.goods_id,
												name: item.goods_name
											}
										];
										item.detail_id = Number(item.id);
										item.continuous_days = Number(item.continue_day);
										item.total_number = Number(item.total_number);
										item.receive_number = Number(item.receive_number);
										return true;
									}),
									validTimeRange: [data.start_time, data.end_time],
								};
							}
						}
						this.spinShow = false;
					});
			},
			handleTimeRange([from_time, to_time]) {
				this.formItem.from_time = from_time;
				this.formItem.to_time = to_time;
			},
			//筛选
			handleMoreCouponSelected(index) {
                console.log("this.formItem.rule_data[index]", this.formItem.rule_data[index])
                this.$selectContent({
                    mode: 'gift',
                    type: 'radio',
                    listKey: 'goods_id',
                    data: this.formItem.rule_data[index].coupon,
                    getList: (data) => {
                        this.formItem.rule_data[index].total_number = Number(data[0].goods_number);
                        this.formItem.rule_data[index].receive_number = '0';
                        this.formItem.rule_data[index].coupon = data.filter(item => {
                            item.goods_number = item.goods_number ? item.goods_number : 0;
                            return true;
                        });
                    }
                });
			},
			handleMoreCouponClose(data, index) {
                let indx = Number(index);
				this.formItem.rule_data[indx].coupon = data;
			},
			addRule() {
				let lastId = this.formItem.rule_data[this.formItem.rule_data.length - 1] ? this.formItem.rule_data[this.formItem.rule_data
					.length - 1].id + 1 : 0;
				this.formItem.rule_data.push({
					id: lastId,
					continuous_days: 1,
                    detail_id: 0,
                    total_number: 1,
					coupon: []
				});
			},
			confirm() {
				this.$refs.formValidate.validate(valid => {
					if (valid) {
						this.spinShow = true;
						this.$ajax.post(this.id ? this.$api.signOrderGiveEdit : this.$api.signOrderGiveAdd, {
								...this.formItem,
							})
							.then(response => {
								const res = response.data;
								if (res.code) {
									this.data = res.data;
									this.$Message.success(res.message);
									this.$router.go(-1);
								}
								this.spinShow = false;
							});
					}
				});
			}
		},
		mounted() {
			if (this.id) this.loadData();
		}
	}
</script>

<style lang="less" scoped>
	.sign_activity_form {

		.basic_input_fixed,
		.basic_textarea {
			max-width: 420px;
		}

		.time_range {
			width: 340px;
		}

		.form_item_24 {
			display: inline-block;
			margin-bottom: 24px;
		}

		.rule_wrapper {
			margin-top: 14px;
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
	}
</style>
