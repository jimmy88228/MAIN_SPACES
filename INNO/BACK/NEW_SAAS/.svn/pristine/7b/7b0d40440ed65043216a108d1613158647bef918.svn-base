<template>
	<div class="store_form">
		<PageTopBase isSave @save="confirm">
			<Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="140" label-colon>

				<FormItem label="品牌中文名" prop="brand_name_cn">
					<Input v-model="formItem.brand_name_cn" placeholder="请输入品牌中文名" class="basic_input" />
				</FormItem>
				<FormItem label="品牌英文名" prop="brand_name_en">
					<Input v-model="formItem.brand_name_en" placeholder="请输入品牌英文名" class="basic_input" />
					<span class="red">注意：不能超过6个字母</span>
				</FormItem>

				<FormItem label="公司中文名" prop="company_name_cn">
					<Input v-model="formItem.company_name_cn" placeholder="请输入公司中文名" class="basic_input" />
				</FormItem>
				<FormItem label="公司英文名" prop="company_name_en">
					<Input v-model="formItem.company_name_en" placeholder="请输入公司英文名" class="basic_input" />
					<span class="red">注意：不能超过6个字母</span>
				</FormItem>

				<FormItem label="公司电话" prop="company_phone">
					<Input v-model="formItem.company_phone" placeholder="请输入公司电话" class="basic_input" />
				</FormItem>

				<FormItem label="联系人" prop="contact_name">
					<Input v-model="formItem.contact_name" placeholder="请输入联系人" class="basic_input" />
				</FormItem>

				<FormItem label="联系电话" prop="contact_mobile">
					<Input v-model="formItem.contact_mobile" placeholder="请输入联系电话" class="basic_input" />
				</FormItem>

				<FormItem label="邮件" prop="contact_email">
					<Input v-model="formItem.contact_email" placeholder="请输入邮件" class="basic_input" />
				</FormItem>

				<FormItem label="跟进人" prop="follow_user">
					<Input v-model="formItem.follow_user" placeholder="请输入跟进人" class="basic_input" />
				</FormItem>

				<FormItem label="跟进人" prop="db_key">
					<Select label="远程数据库" v-model="formItem.db_key" class="basic_select">
						<Option value="db1" >db1</Option>
					</Select>
				</FormItem>
			</Form>
		</PageTopBase>
		<!--加载提示-->
		<Spin size="large" fix v-show="spinShow"></Spin>
	</div>
</template>
<script>
    import PageTopBase from '@/views/my-components/page-top-base/index';
    import qqMapGetPoint from '@/views/my-components/qq-map/get-point.vue';

    export default {
        props: {
            id: {
                type: Number,
                default: 0
            }
        },
        components: {
            PageTopBase,
            qqMapGetPoint
        },
        data() {
            const checkPhone = function(rule, val, callback) {
                const reg = /^\d{11}$|^\d{5,6}$/;
                if (reg.test(val) || val === '') {
                    callback();
                } else {
                    callback(new Error('请填写正确的联系电话'));
                }
            };
            const checkEmail = function (rule, val, callback) {
                const reg = /^\w+((.\w+)|(-\w+))@[A-Za-z0-9]+((.|-)[A-Za-z0-9]+).[A-Za-z0-9]+$/;
                if (reg.test(val) || val === '') {
                    callback();
                } else {
                    callback(new Error('请填写正确的邮件'));
                }
            };
            return {
                areaCol: [], //传递省+市+区
                agentCol: [],
                formItem: {
                    brand_id: 0,
                    brand_name_cn: '',
                    brand_name_en: '',
                    company_name_cn: '',
                    company_name_en: '',
                    company_phone: '',
                    contact_name: '',
                    contact_mobile: '',
                    contact_email: '',
                    follow_user: '',
                    db_key: 'db1'
                },
                ruleValidate: {
                    brand_name_cn: [{
                        required: true,
                        message: '品牌中文不能为空',
                        trigger: 'blur',
                    }],
                    brand_name_en: [{
                        required: true,
                        message: '品牌英文名不能为空',
                        trigger: 'blur',
                    }],
                    company_name_cn: [{
                        required: true,
                        message: '公司中文名不能为空',
                        trigger: 'blur',
                    }],
                    company_name_en: [{
                        required: true,
                        message: '公司英文名不能为空',
                        trigger: 'blur',
                    }],
                    company_phone: [{
                        required: true,
                        message: '公司电话不能为空',
                        trigger: 'blur',
                    }],
                    contact_name: [{
                        required: true,
                        message: '联系人不能为空',
                        trigger: 'blur',
                    }],
                    contact_mobile: [{
                        required: true,
                        //message: '联系电话不能为空',
                        validator: checkPhone,
                        trigger: 'blur',
                    }],
                    contact_email: [{
                        required: true,
                        validator: checkEmail,
                        trigger: 'blur',
                    }]
                },
                spinShow: false,
                calcWidth: 'auto',
                areaList: [],
                agentList: [],
                isClear: false,
                rows: 3
            }
        },
        computed: {
            areaStyle() {
                return {
                    width: this.calcWidth
                }
            }
        },
        methods: {
            renderSort(labels) {
                return labels.slice(labels.length - 1).join('/');
            },
            formatArea(labels) {
                this.$nextTick(() => {
                    // 获取到文字的宽度+关闭按钮的宽度
                    this.calcWidth = this.$refs.areaRef.$el.childNodes[0].childNodes[4].offsetWidth + 14 + 'px';
                });
                return labels.join('/');
            },
            selectAddress() {
                this.$refs['qq-map'].initSet(this.formItem.lon, this.formItem.lat, '');
            },
            loadData() {
                //this.spinShow = true;
                return this.$ajax.post(this.$api.brandInfoUpdate, {
                    brand_id: this.formItem.brand_id
                })
                    .then(response => {
                        const res = response.data;
                        if (res.code) {
                            if (res.data.brand_id != undefined) {
                                this.formItem = res.data;
							}
                            this.spinShow = false;
                        }
                    });
            },
            selectArea(value, selectedData) {
                this.formItem.areaId = Number(selectedData[selectedData.length - 1].value);
                this.$refs.formValidate.validateField('areaId');
                this.$nextTick(() => {
                    // 获取到文字的宽度+关闭按钮的宽度
                    this.calcWidth = this.$refs.areaRef.$el.childNodes[0].childNodes[4].offsetWidth + 14 + 'px';
                });
            },
            selectAgent(value, selectedData) {
                this.formItem.agentId = Number(selectedData[selectedData.length - 1].value);
                this.$refs.formValidate.validateField('agentId');
            },
            confirm() {
                this.$refs.formValidate.validate((valid) => {
                    if (valid) {
                        this.spinShow = true;
                        this.$ajax.post( this.$api.brandInfoSave, this.formItem)
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
            },
            getPointSuccessCb(obj) {
                this.formItem.lon = obj.lon;
                this.formItem.lat = obj.lat;
            }
        },
        mounted() {
            var query = this.$route.query || {};
			this.formItem.brand_id = query.id;
			this.loadData();
        }
    }
</script>

<style lang="less">
	.red {
		color: red;
	}
	.store_form {
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
			width: 260px;
		}

		.mini_input {
			width: 100px;
		}

		.addr_wrapper {
			margin: 10px 0 0 0;
		}
	}
</style>
