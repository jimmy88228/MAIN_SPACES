<template>
	<div class="store_form">
		<PageTopBase isSave @save="confirm">
			<Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="140" label-colon>

				<FormItem label="群ID" prop="chat_id">
					<Input v-model="formItem.chat_id" placeholder="群ID" disabled class="basic_input" />
				</FormItem>
				<FormItem label="内部ID" prop="chat_no">
					<Input v-model="formItem.chat_no" placeholder="内部ID" class="basic_input" />
				</FormItem>

				<FormItem label="群名" prop="name">
					<Input v-model="formItem.name" placeholder="群名" disabled class="basic_input" />
				</FormItem>
				<FormItem label="群主ID" prop="owner_user_id">
					<Input v-model="formItem.owner_user_id" placeholder="群主ID" disabled class="basic_input" />
				</FormItem>

				<FormItem label="关联店员" prop="staff_code">
					<Input  placeholder="关联店员" v-model.trim="formItem.staff_code" class="basic_input"/>
					<Button @click.native="relatedStaff" type="primary">关联店员/店铺</Button>
					<span style="color: red;">*根据关联代码去匹配所属店员身份</span>
				</FormItem>

				<FormItem label="店员代码" prop="staff_code">
					<Input v-model="formItem.staff_code" placeholder="店员代码" disabled class="basic_input" />
				</FormItem>

				<FormItem label="所属店员" prop="staff_name">
					<Input v-model="formItem.staff_name" placeholder="所属店员" disabled class="basic_input" />
				</FormItem>

				<FormItem label="所属店铺" prop="store_name">
					<Input v-model="formItem.store_name" placeholder="所属店铺" disabled class="basic_input" />
				</FormItem>

				<FormItem label="开启状态" prop="is_enabled">
					<i-switch v-model="formItem.is_enabled" size="large">
						<span slot="open">启用</span>
						<span slot="close">关闭</span>
					</i-switch>
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
                    id: 0,
                    chat_id: 0,
                    chat_no: 0,
                    store_code: '',
                    store_name: '',
                    staff_code: '',
                    staff_name: '',
                    name: '',
                    owner_user_id: '',
                    is_enabled: ''
                },
                ruleValidate: {
                    chat_no: [{
                        required: true,
                        message: '内部ID不能为空',
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
                this.spinShow = true;
                return this.$ajax.post(this.$api.qwChatEdit, {
                    chat_id: this.formItem.brand_id
                })
                    .then(response => {
                        const res = response.data;
                        if (res.code) {
                            if (res.data.id != undefined) {
                                var tmpData = res.data;
                                this.formItem.id = tmpData.id;
                                this.formItem.chat_id = tmpData.chat_id;
                                this.formItem.chat_no = tmpData.chat_no;
                                this.formItem.store_name = tmpData.store_name ? tmpData.store_name+' ('+tmpData.store_code+')' : '未匹配到店铺';
                                this.formItem.store_code = tmpData.store_code;
                                this.formItem.staff_code = tmpData.staff_code;
                                this.formItem.staff_name = tmpData.employee_name ? tmpData.employee_name+' ('+tmpData.employee_code+')' : '未匹配到店员';
                                this.formItem.owner_user_id = tmpData.owner_user_id;
                                this.formItem.is_enabled = tmpData.is_enabled == 1 ? true : false;
                                this.formItem.name = tmpData.name;
							}
                        }else {
                            this.$Message.error(res.message);
						}
                        this.spinShow = false;
                    });
            },
            relatedStaff(){
                //根据员工编码获取员工信息
                var staff_code = this.formItem.staff_code;
                return this.$ajax.post(this.$api.getStoreStaffByStaffCode, {staff_code: staff_code})
				.then(response => {
					var staffData = response.data;
					var store_name = '未匹配到店铺';
					var staff_code = staff_code;
					var staff_name = '未匹配到店员';
					var store_code = '';
					if (staffData.code == 1){
						store_code = staffData.data.store_code;
						store_name = staffData.data.store_name ? staffData.data.store_name + '('+staffData.data.store_code+')' : '未匹配到店铺';
						staff_code = staffData.data.employee_code;
						staff_name = staffData.data.employee_name ? staffData.data.employee_name + '('+staffData.data.employee_code+')' : '未匹配到店员';
					}
					this.formItem.store_code = store_code;
					this.formItem.store_name = store_name;
					this.formItem.staff_code = staff_code;
					this.formItem.staff_name = staff_name;
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
                        this.$ajax.post( this.$api.qwChatSave, this.formItem)
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
