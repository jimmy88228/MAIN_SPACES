<template>
	<PageTopBase topTitle="编辑签到活动" isSave @save="confirm">
		<div class="sign_activity_form">
			<Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="140">
				<FormItem label="活动名称" prop="activity_name">
					<Input v-model="formItem.activity_name" placeholder="请输入活动名称" class="basic_input basic_input_fixed" :maxlength="30"
					 show-word-limit />
				</FormItem>
				<FormItem label="活动时间" prop="validTimeRange">
					<DatePicker v-model="formItem.validTimeRange" type="datetimerange" placeholder="请选择活动时间" class="time_range"
					 @on-change="handleTimeRange"></DatePicker>
				</FormItem>
				<FormItem label="活动图片" prop="activity_image">
					<image-edit :img="formItem.activity_image" @selectImg="openImagesModal('activity_image', formItem.activity_image )"
					 @delImg="handleDelImg('activity_image')">
						<p class="strong_tips">微信签到推送图片；图片尺寸最佳是720*400，格式为 jpg 或 png，图片大小控制在500KB</p>
					</image-edit>
				</FormItem>
				<FormItem label="活动备注" prop="activity_desc">
					<Input type="textarea" class="basic_textarea basic_textarea" v-model="formItem.activity_desc" placeholder="请输入活动备注"
					 :rows="3" :maxlength="150" show-word-limit />
				</FormItem>
				<FormItem label="规则说明" prop="activity_detail">
					<rich-text ref="rich-text" :rich-text-data="formItem.activity_detail" @get-rich-text="handleRichText" />
				</FormItem>
				<FormItem label="每次签到赠送积分" prop="gift_points">
					<InputNumber :min="0" v-model="formItem.gift_points"></InputNumber>
				</FormItem>
				<FormItem label="每次签到赠送优惠券" prop="gift_bonus">
					<coupon-select :data="bonusData" type="checkbox" @del-tag="handleCouponClose">
						<Button type="dashed" @click="handleCouponSelected" class="basic_select">选择优惠券</Button>
					</coupon-select>
				</FormItem>
				<FormItem label="活动页" prop="page_id">
					<pages-select :data="pagesData" type="radio" @del-tag="handlePageTag">
						<Button type="dashed" @click="handlePageSelect" class="basic_select">选择自定义页</Button>
					</pages-select>
				</FormItem>
				<FormItem label="抽奖活动" prop="page_id">
					<lottery-select :data="formItem.lotteryData" type="radio" @del-tag="handleLotteryCloseTag">
						<Button type="dashed" @click="handleLotterySelect" class="basic_select">选择抽奖活动</Button>
					</lottery-select>
				</FormItem>
				<FormItem label="是否开启" prop="is_enable">
					<i-switch size="large" v-model="formItem.is_enable" true-value="1" false-value="0">
						<span slot="open">开启</span>
						<span slot="close">关闭</span>
					</i-switch>
					<Button type="primary" @click="addRule">添加连续签到规则</Button>
					<div v-for="(item, index) in formItem.rule_data" :key="item.id" class="rule_wrapper">
						<FormItem class="form_item_24" :label-width="0" :prop="'rule_data.'+index+'.continuous_days'" :rules="[
							{required: true, message: '天数不能为空', trigger: 'blur', type: 'number'}
						  ]">
							<label>连续签到</label>
							<InputNumber v-model="item.continuous_days" />
							<label>天</label>
						</FormItem>
						<FormItem class="form_item_24" :label-width="0" :prop="'rule_data.'+index+'.gift_points'" :rules="[
							{required: true, message: '积分不能为空', trigger: 'blur', type: 'number'}
						  ]">
							<label>额外送积分</label>
							<InputNumber v-model="item.gift_points" />
						</FormItem>
						<FormItem class="form_item_24" :label-width="0" :prop="'rule_data.'+index+'.coupon'">
							<label>额外送优惠券</label>
							<coupon-select :data="item.coupon" type="checkbox" @del-tag="e => handleMoreCouponClose(e, index)">
								<Button type="dashed" @click="handleMoreCouponSelected(index)" class="basic_select">选择优惠券</Button>
							</coupon-select>
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
					activity_name: '',
					validTimeRange: [],
					from_time: '',
					to_time: '',
					activity_image: '',
					activity_desc: '',
					activity_detail: '',
					gift_points: 0,
					gift_bonus: '',
					is_enable: '0',
					rule_data: [],
					lotteryData: []
				},
				ruleValidate: {
					activity_name: [{
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
			loadData() {
				this.spinShow = true;
				return this.$ajax.post(this.$api.signActivityInfo, {
						id: this.id
					})
					.then(response => {
						const res = response.data;
						if (res.code) {
							let data = res.data && res.data.items;
							if (data) {
								this.formItem = {
									...data,
									rule_data: data.get_sign_activity_rule.filter(item => {
										item.continuous_days = Number(item.continuous_days);
										item.gift_points = Number(item.gift_points);
										item.coupon = item.bouns_data;
										return true;
									}),
									validTimeRange: [data.from_time, data.to_time],
									gift_points: Number(data.gift_points),
									lotteryData: [data.lotter_data]
								}
								this.bonusData = data.bouns_data;
								this.freezeData = JSON.parse(JSON.stringify(this.formItem));
								this.pagesData = data.pages_data;
								
								this.$refs['rich-text'].initEditor( this.formItem.activity_detail );
							}
						}
						this.spinShow = false;
					});
			},
			handleTimeRange([from_time, to_time]) {
				this.formItem.from_time = from_time;
				this.formItem.to_time = to_time;
			},
			openImagesModal(name, url) {
				this.$selectMaterial({
					type: 'image',
					selectedData: url,
					getList: (item) => {
						this.formItem[name] = item.src;
						if (name === 'activity_image') this.$refs.formValidate.validateField('activity_image');
					}
				});
			},
			handleDelImg(name) {
				this.formItem[name] = '';
			},
			handleLotterySelect() {
				this.$selectContent({
					mode: 'lottery',
					type: 'radio',
					data: this.formItem.lotteryData,
					getList: (data) => {
						this.formItem.lotteryData = data;
					}
				})
			},
			handleLotteryCloseTag(data) {
				this.formItem.lotteryData = data;
			},
			handleCouponSelected() {
				this.$selectContent({
					mode: 'coupon',
					type: 'checkbox',
					data: this.bonusData,
					getList: (data) => {
						this.bonusData = data;
						this.formItem.gift_bonus = data.map(item => item.id).join();
					}
				})
			},
			handleCouponClose(data) {
				this.bonusData = data;
				this.formItem.gift_bonus = data.map(item => item.id).join();
			},
			handleMoreCouponSelected(index) {
				this.$selectContent({
					mode: 'coupon',
					type: 'checkbox',
					data: this.formItem.rule_data[index].coupon,
					getList: (data) => {
						this.formItem.rule_data[index].coupon = data;
					}
				})
			},
			handleMoreCouponClose(data, index) {
				this.formItem.rule_data[index].coupon = data;
			},
			addRule() {
				let lastId = this.formItem.rule_data[this.formItem.rule_data.length - 1] ? this.formItem.rule_data[this.formItem.rule_data
					.length - 1].id + 1 : 0;
				this.formItem.rule_data.push({
					id: lastId,
					continuous_days: 1,
					gift_points: 1,
					coupon: []
				});
			},
			handleRichText(content) {
				this.formItem.activity_detail = content;
			},
			handlePageSelect() {
				this.$selectContent({
					mode: 'pages',
					type: 'radio',
					data: this.pagesData,
					getList: (data) => {
						this.pagesData = data;
						this.formItem.page_id = data[0].id;
					}
				})
			},
			handlePageTag(data) {
				this.pagesData = data;
				this.formItem.page_id = 0;
			},
			confirm() {
				this.$refs.formValidate.validate(valid => {
					if (valid) {
						this.spinShow = true;
						let hasChange = JSON.stringify(this.freezeData.rule_data) !== JSON.stringify(this.formItem.rule_data);
						this.formItem['rule_data'].forEach(c => {
							c.gift_bonus = c.coupon.map(item => item.id).join();
						})
						this.$ajax.post(this.id ? this.$api.signActivityEdit : this.$api.signActivityAdd, {
								...this.formItem,
								rule_data_state: hasChange ? 2 : 1,
								gift_activity_id: this.formItem.lotteryData.map(item => item.id).join()
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
			margin-top: 24px;
		}
	}
</style>
