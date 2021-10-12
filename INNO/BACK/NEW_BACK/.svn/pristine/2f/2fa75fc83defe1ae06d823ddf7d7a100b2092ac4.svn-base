<template>
	<div class="store_form">
		<PageTopBase isSave @save="confirm">
			<Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="140" label-colon>

				<FormItem label="活动名称" prop="name">
					<Input v-model="formItem.name" placeholder="活动名称"  class="basic_input" />
				</FormItem>

				<FormItem label="活动时间" prop="validTimeRange">
					<DatePicker v-model="formItem.validTimeRange" type="datetimerange" placeholder="请选择活动时间" class="time_range" @on-change="handleChange"></DatePicker>
				</FormItem>

				<FormItem label="是否启用" prop="is_enabled">
					<RadioGroup v-model="formItem.is_enabled">
						<Radio label="1">开启</Radio>
						<Radio label="0">关闭</Radio>
					</RadioGroup>
				</FormItem>

				<FormItem label="强制关注公众号" prop="force_subscribe">
					<RadioGroup v-model="formItem.force_subscribe">
						<Radio label="1">开启</Radio>
						<Radio label="0">关闭</Radio>
					</RadioGroup>
					<p class="strong_tips">*勾选"关闭”，用户添加企微个人号则执行奖励;勾选“开启”，用户添加企微个人号且关注公众号，则执行奖励</p>
				</FormItem>

				<FormItem label="微企欢迎语" prop="subscribe_notice">
					<Input type="textarea" class="basic_textarea" v-model="formItem.subscribe_notice" placeholder="请输入优惠券描述" :rows="3"
						   :maxlength="150" show-word-limit style="width: 660px;" />
					<p class="strong_tips">*若企微后台设置了欢迎语，则不执行该自定义欢迎语</p>
				</FormItem>

				<FormItem label="奖励规则" prop="coupons">
					<div class="pointRule">
						<span>积分：</span>
						<Input v-model="formItem.give_point" placeholder="赠送的积分数"  class="basic_input" />
					</div>

					<coupon-select :data="formItem.coupons" type="checkbox" @del-tag="handleCouponClose">
						<span class="couponSpan">优惠券: </span>
						<Button type="dashed" @click="handleCouponSelected" class="basic_select">{{couponText}}</Button>
					</coupon-select>
				</FormItem>

				<FormItem label="活动店铺" prop="storeSelect" >
					<store-select :data="formItem.storeSelect" type="checkbox" @del-tag="handleStoreTag">
						<Button type="dashed" @click="handleSelect('store', 'storeSelect')" class="basic_select">{{storeText}}</Button>
					</store-select>
				</FormItem>
			</Form>
		</PageTopBase>
		<!--加载提示-->
		<Spin size="large" fix v-show="spinShow"></Spin>
	</div>
</template>
<script>
    import PageTopBase from '@/views/my-components/page-top-base/index';
    import WechatSelect from '@/views/my-components/list-component/index-edit';
    import StoreSelect from '@/views/my-components/list-component/index-edit';
    import CouponSelect from '@/views/my-components/list-component/index-edit';

    export default {
        props: {},
        components: {
            PageTopBase,
            WechatSelect,
            StoreSelect, //门店插件
            CouponSelect //优惠券
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
                agentCol: [],
                formItem: {
                    id: 0,
                    name: '',
                    start_time: '',
                    end_time: '',
                    validTimeRange: [],//活动时间
                    is_enabled: '1',
                    force_subscribe: '1',
                    subscribe_notice: '',
                    give_point: '', //积分
                    tagId: [],
                    storeSelect: [], //选择门店数据
                    coupons: [], //优惠券
                },
                ruleValidate: {
                    name: [{
                        required: true,
                        message: '活动名称不能为空',
                        trigger: 'blur',
                    }],
                    validTimeRange: [{
                        required: true,
						trigger: 'change',
						type: 'array',
						validator: checkValidRange
                    }],
                    /*storeSelect: [{
                        required: true,
                        message: '请选择活动店铺',
                        type: 'array',
						min: 1
                    }]*/
                },
                spinShow: false
            }
        },
        computed: {
            couponText () {
                const len = this.formItem.coupons.length;
                return len > 0 ? `选择优惠券(已选${len}张)` : '点我选择优惠券';
            },
			storeText () {
                const len = this.formItem.storeSelect.length;
                return len > 0 ? `选择所属店铺(已选${len}张)` : `选择所属店铺`;
			}
        },
        methods: {
            initParams(){
                var query = this.$route.query || {};
                this.formItem.id = query.id;
			},
			//日期
            handleChange ([start_time, end_time]) {
                this.formItem.start_time = start_time;
                this.formItem.end_time = end_time;
                this.formItem.validTimeRange = [start_time, end_time];
            },
            handleCouponSelected () {
                this.$selectContent({
                    mode: 'coupon',
                    type: 'checkbox',
                    data: this.formItem.coupons,
                    getList: (data) => {
                        this.formItem.coupons = data;
                        this.$refs.formValidate.validateField('coupons');
                    }
                });
            },
            handleCouponClose (data) {
                this.formItem.coupons = data;
                this.$refs.formValidate.validateField('coupons');
            },
            handleSelect (mode, name) {
                this.$selectContent({
                    mode: mode,
                    type: 'checkbox',
                    data: this.formItem[name],
                    getList: (data) => {
                        this.formItem[name] = data;
                        if (mode === 'group') {
                            this.$refs.formValidate.validateField('wxgroupSelect');
                        } else if (mode === 'tag') {
                            this.$refs.formValidate.validateField('tagId');
                        } else if (mode === 'store') {
                            this.$refs.formValidate.validateField('storeSelect');
                        }
                    }
                })
            },
            handleStoreTag (data) {
                this.formItem.storeSelect = data; ////选择门店信息
            },
            handleTag (data) {
                this.formItem.wxgroupSelect = data;
            },
            handleAllTag (data) {
                this.formItem.tagId = data;
            },
            renderSort(labels) {
                return labels.slice(labels.length - 1).join('/');
            },
            loadData() {
				if (this.formItem.id) {
                    this.spinShow = true;
                    return this.$ajax.post(this.$api.qwRewardEdit, {
                        id: this.formItem.id
                    })
					.then(response => {
						const res = response.data;
						if (res.code) {
							if (res.data.id != undefined) {
								var tmpData = res.data;
								this.formItem.id = tmpData.id;
								this.formItem.name = tmpData.name;
								this.formItem.start_time = tmpData.from_time;
								this.formItem.end_time = tmpData.to_time;
								this.formItem.validTimeRange = [tmpData.from_time, tmpData.to_time];
								this.formItem.subscribe_notice = tmpData.subscribe_notice;
								this.formItem.give_point = tmpData.give_point;
								this.formItem.coupons = tmpData.give_coupon_ids;
								this.formItem.storeSelect = res.stores;
                                this.formItem.is_enabled = tmpData.is_enabled == 1 ? '1' : '0';
                                this.formItem.force_subscribe = tmpData.force_subscribe == 1 ? '1' : '0';
							}
						}else {
							this.$Message.error(res.message);
						}
						this.spinShow = false;
					});
				}
            },
            confirm() {
                this.$refs.formValidate.validate((valid) => {
                    if (valid) {
                        this.spinShow = true;
                        this.$ajax.post( this.$api.qwRewardSave, {
							id: this.formItem.id,
							name: this.formItem.name,
							start_time: this.formItem.start_time,
							end_time: this.formItem.end_time,
							is_enabled: this.formItem.is_enabled,
							force_subscribe: this.formItem.force_subscribe,
							subscribe_notice: this.formItem.subscribe_notice,
							give_point: this.formItem.give_point, //积分
							storeSelect:  this.formItem.storeSelect.map(item => item.id).join(), //选择门店数据
							coupons: this.formItem.coupons.map(item => item.id).join() //优惠券
						})
                            .then((response) => {
                                const res = response.data;
                                if (res.code) {
                                    this.$Message.success(res.message);
                                    this.spinShow = false;
                                    this.$router.go(-1);
                                }else {
                                    this.$Message.error(res.message);
                                    this.spinShow = false;
                                    return false;
								}
                            });
                    }
                })
            }
        },
        mounted() {
			this.initParams();
			this.loadData();
        }
    }
</script>

<style lang="less">
	.red {
		color: red;
	}
	.store_form {
		.pointRule {
			margin: 0 auto 20px;
		}
		.pointRule span {
			display: inline-block;
			width: 60px;
		}
		.couponSpan {
			display: inline-block;
			float: left;
			width: 60px;
		}
		.time_range {
			width: 330px;
		}
		.ivu-cascader-label {
			width: auto;
			text-overflow: unset;
			overflow: visible;
		}

		.store_title {
			display: flex;
			align-items: center;

			.store-form_back {
				margin-right: 20px;
			}
		}

		.basic_input,
		.basic_date,
		.basic_select {
			width: 320px;
		}

		.mini_input {
			width: 100px;
		}

		.addr_wrapper {
			margin: 10px 0 0 0;
		}
	}
</style>
