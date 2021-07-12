<template>
	<div class="product">
		<PageTopBase :isSave="true" @save="confirm">
			<Form ref="formValidate" :model="formData" :rules="ruleValidate" :label-width="120">
				<FormItem label="等级名称" prop="rankName">
					<Input v-model="rankName" placeholder="请输入等级名称" class="basic_input"></Input>
				</FormItem>
				<FormItem label="等级代码" prop="rankCode">
					<Input v-model="rankCode" placeholder="请输入等级代码" class="basic_input"></Input>
				</FormItem>
				<FormItem label="正价折扣率" prop="discount" class="ivu-form-item-required">
					<edit-sort v-model="discount" :range="[1, 100]" dTip="请填写为1-100的整数,如填入80，表示初始折扣率为8折" eTip="折扣率不允许为空" @checkVaild="handleDiscount"></edit-sort>
				</FormItem>
				<FormItem label="折上折扣率" prop="promDiscount" class="ivu-form-item-required">
					<edit-sort v-model="promDiscount" :range="[1, 100]" dTip="请填写为1-100的整数,如填入80，表示初始折扣率为8折" eTip="折扣率不允许为空"
					 @checkVaild="handlePromDiscount"></edit-sort>
				</FormItem>
				<FormItem label="积分下限">
					<edit-sort v-model="minPoints" dTip="当会员总积分达到这个数字，就可以自动升级；0 表示不设定。" :required="false" disabledRange></edit-sort>
				</FormItem>
				<FormItem label="会员中心背景图" prop="rankImage">
					<image-edit :img="rankImage" @selectImg="openImagesModal('rankImage', rankImage )" @delImg="handleDelImg">
						<div>随用户等级变化，会员中心对应等级的背景图</div>
						<div>建议尺寸：700x300像素，支持jpg、png两种格式，大小不超过1M。</div>
					</image-edit>
				</FormItem>
				<!--
				<FormItem label="会员卡背景图" prop="rankCardImage">
				  <image-edit :img="rankCardImage" @selectImg="openCardModal('rankCardImage', rankCardImage )" @delImg="handleDelCard">
					<p>建议尺寸：700x300像素，支持jpg、png两种格式，大小不超过1M。</p>
				  </image-edit>
				</FormItem>-->
				<FormItem label="免邮下限">
					<i-switch v-model="isStartLimitFreeShipping">
						<span slot="open">开</span>
						<span slot="close">关</span>
					</i-switch>
				</FormItem>
				<FormItem label="免邮下限金额" v-show="isStartLimitFreeShipping">
					<edit-sort v-model="limitFreeShipping" dTip="会员等级免邮底线；0表示不设定；填入的数字是订单实付金额(未抵扣价)；" :required="false" disabledRange></edit-sort>
				</FormItem>
			</Form>
		</PageTopBase>
		<Spin size="large" fix v-if="spinShow"></Spin>
	</div>
</template>

<script>
	import PageTopBase from '@/views/my-components/page-top-base/index';
	import ImageEdit from '@/views/my-components/image-edit/image-edit';
	import EditSort from '@/views/my-components/edit-sort/edit-sort';
	import utils from '@/libs/vue-utils';

	export default {
		props: ['id'],
		components: {
			PageTopBase,
			ImageEdit,
			EditSort
		},
		data() {
			return {
				spinShow: false,
				discountVaild: false,
				promDiscountValid: false,
				ruleValidate: {
					rankName: [{
						required: true,
						message: '等级名称不能为空',
						trigger: 'blur'
					}],
					rankCode: [{
						required: true,
						message: '等级代码不能为空',
						trigger: 'blur'
					}]
				},
				data: {
					rankName: '',
					rankCode: '',
					discount: 100,
					promDiscount: 100,
					minPoints: 0,
					rankImage: '',
					rankCardImage: '',
					isStartLimitFreeShipping: false,
					limitFreeShipping: 0
				}
			}
		},
		computed: {
			formData: {
				get() {
					return this.data || {};
				},
				set(val) {
					this.data = Object.assign({}, this.data, val);
				}
			},
			rankName: {
				get() {
					return this.formData.rankName || '';
				},
				set(val) {
					this.formData = {
						rankName: val
					};
				}
			},
			rankCode: {
				get() {
					return this.formData.rankCode || '';
				},
				set(val) {
					this.formData = {
						rankCode: val
					};
				}
			},
			discount: {
				get() {
					return this.formData.discount || 1;
				},
				set(val) {
					this.formData = {
						discount: val
					};
				}
			},
			promDiscount: {
				get() {
					return this.formData.promDiscount || 1;
				},
				set(val) {
					this.formData = {
						promDiscount: val
					};
				}
			},
			minPoints: {
				get() {
					return this.formData.minPoints || 0;
				},
				set(val) {
					this.formData = {
						minPoints: val
					};
				}
			},
			rankImage: {
				get() {
					return this.formData.rankImage || '';
				},
				set(val) {
					this.formData = {
						rankImage: val
					};
				}
			},
			rankCardImage: {
				get() {
					return this.formData.rankCardImage || '';
				},
				set(val) {
					this.formData = {
						rankCardImage: val
					};
				}
			},
			isStartLimitFreeShipping: {
				get() {
					return this.formData.isStartLimitFreeShipping || false;
				},
				set(val) {
					this.formData = {
						isStartLimitFreeShipping: val
					};
				}
			},
			limitFreeShipping: {
				get() {
					return this.formData.limitFreeShipping || 0;
				},
				set(val) {
					this.formData = {
						limitFreeShipping: val
					};
				}
			}
		},
		methods: {
			loadData() {
				this.spinShow = true;
				return this.$ajax.post(this.$api.userRankSettingInfo, {
						id: this.id
					})
					.then(response => {
						const res = response.data;
						if (res.code) {
							this.data = res.data && Object.assign({}, utils.endToFront(res.data), {
								isStartLimitFreeShipping: !!Number(res.data.is_start_limit_free_shipping)
							});
						}
						this.spinShow = false;
					});
			},
			handleDelImg() {
				this.rankImage = '';
			},
			handleDelCard() {
				this.rankCardImage = '';
			},
			openImagesModal(name, url) {
				let that = this;
				this.$selectMaterial({
					type: 'image',
					selectedData: url,
					getList(item) {
						that.rankImage = item.src;
					}
				});
			},
			openCardModal(name, url) {
				let that = this;
				this.$selectMaterial({
					type: 'image',
					selectedData: url,
					getList(item) {
						that.rankCardImage = item.src;
					}
				});
			},
			handleDiscount(bool) {
				this.discountVaild = bool;
			},
			handlePromDiscount(bool) {
				this.promDiscountValid = bool;
			},
			confirm() {
				this.$refs.formValidate.validate((valid) => {
					if (valid && this.discountVaild && this.promDiscountValid) {
						this.spinShow = true;
						const data = {
							rank_name: this.formData.rankName,
							rank_code: this.formData.rankCode,
							discount: this.formData.discount,
							prom_discount: this.formData.promDiscount,
							min_points: this.formData.minPoints,
							rank_image: this.formData.rankImage,
							rank_card_image: this.formData.rankCardImage,
							is_start_limit_free_shipping: this.formData.isStartLimitFreeShipping ? "1" : "0",
							limit_free_shipping: this.formData.limitFreeShipping
						};
						const params = this.id ? Object.assign({}, data, {
							id: this.id
						}) : data;
						this.$ajax.post(this.id ? this.$api.userRankSettingEdit : this.$api.userRankSettingAdd, params)
							.then(response => {
								const res = response.data;
								if (res.code) {
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
