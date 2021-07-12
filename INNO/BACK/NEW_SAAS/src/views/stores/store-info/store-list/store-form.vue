<template>
	<div class="store_form">
		<PageTopBase isSave @save="confirm">
			<Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="140" label-colon>
				<FormItem label="渠道类型" prop="agentId">
					<Cascader class="basic_input" v-model="agentCol" :data="agentList" :clearable="isClear" ref="agentRef" filterable
					 change-on-select transfer :render-format="renderSort" @on-change="selectAgent"></Cascader>
				</FormItem>
				<FormItem label="店铺代码" prop="code">
					<Input v-model="formItem.code" placeholder="请输入店铺代码" class="basic_input" />
				</FormItem>
				<FormItem label="店铺名称" prop="name">
					<Input v-model="formItem.name" placeholder="请输入店铺名称" class="basic_input" />
				</FormItem>
				<FormItem label="是否允许自提">
					<i-switch size="large" v-model="formItem.isSelf" true-value="1" false-value="0">
						<span slot="open">开启</span>
						<span slot="close">关闭</span>
					</i-switch>
					<span>备注：微信商城结算时，可选择的自提店铺</span>
				</FormItem>
				<FormItem label="地址" prop="areaId">
					<Cascader class="basic_input" v-model="areaCol" :data="areaList" :clearable="isClear" :style="areaStyle" ref="areaRef"
					 filterable change-on-select transfer :render-format="formatArea" @on-change="selectArea"></Cascader>
					<div class="addr_wrapper">
						<Input v-model="formItem.addr" type="textarea" :rows="rows" placeholder="请输入街道" class="basic_input" />
					</div>
				</FormItem>
				<FormItem label="电话" prop="phone">
					<Input v-model="formItem.phone" placeholder="请输入电话" class="basic_input" />
				</FormItem>
				<FormItem label="联系人" prop="contact">
					<Input v-model="formItem.contact" placeholder="请输入联系人" class="basic_input" />
				</FormItem>
				<FormItem label="简介" prop="remark">
					<Input v-model="formItem.remark" type="textarea" placeholder="请输入简介" class="basic_input" />
				</FormItem>
				<FormItem label="坐标">
					<Input v-model="formItem.lon" placeholder="经度" class="basic_input" />
					<Input v-model="formItem.lat" placeholder="纬度" class="basic_input" />
					<Button @click="selectAddress">请选择经纬度</Button>
					<qqMapGetPoint ref="qq-map" @on-success="getPointSuccessCb"></qqMapGetPoint>
				</FormItem>
				<FormItem label="大屏支付">
					大屏支付
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
					callback(new Error('请填写正确的电话'));
				}
			}
			return {
				areaCol: [], //传递省+市+区
				agentCol: [],
				formItem: {
					areaId: '0',
					addr: '',
					agentId: '0',
					code: '',
					name: '',
					isSelf: '1',
					phone: '',
					contact: '',
					remark: '',
					lon: 0,
					lat: 0
				},
				ruleValidate: {
					agentId: [{
						required: true,
						message: '渠道类型不能为空',
						trigger: 'change',
						type: 'number'
					}],
					areaId: [{
						required: true,
						message: '区域不能为空',
						trigger: 'change',
						type: 'number'
					}],
					code: [{
						required: true,
						message: '店铺代码不能为空',
						trigger: 'blur'
					}],
					name: [{
						required: true,
						message: '店铺名称不能为空',
						trigger: 'blur'
					}],
					//phone: [{ validator: checkPhone, trigger: 'blur' }]
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
				return this.$ajax.post(this.$api.storeInfo, {
						store_id: this.id
					})
					.then(response => {
						const res = response.data;
						if (res.code) {
							this.data = res.data;
							this.agentList = res.data && res.data.agent;
							this.areaList = res.data && res.data.address;
							if (this.id) {
								const storeMes = (res.data && res.data.storeMes) || {};
								this.areaCol = storeMes.area_id_list && storeMes.area_id_list.map(item => String(item));
								this.agentCol = storeMes.agent_id_list && storeMes.agent_id_list.map(item => String(item));
								this.formItem.addr = storeMes.addr;
								this.formItem.code = storeMes.code;
								this.formItem.name = storeMes.name;
								this.formItem.phone = storeMes.phone;
								this.formItem.contact = storeMes.contact;
								this.formItem.remark = storeMes.remark;
								this.formItem.lon = storeMes.lon;
								this.formItem.lat = storeMes.lat;
								this.formItem.isSelf = storeMes.enable_self_get;
								this.formItem.areaId = Number(storeMes.area_id);
								this.formItem.agentId = Number(storeMes.agent_id);
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
						this.$ajax.post(this.id ? this.$api.storeEdit : this.$api.storeAdd, {
								store_id: this.id ? this.id : 0,
								code: this.formItem.code,
								name: this.formItem.name,
								lon: this.formItem.lon,
								lat: this.formItem.lat,
								agent_id: this.formItem.agentId,
								enable_self_get: this.formItem.isSelf,
								phone: this.formItem.phone,
								contact: this.formItem.contact,
								remark: this.formItem.remark,
								area_id: this.formItem.areaId,
								addr: this.formItem.addr,
								area_name: ''
							})
							.then((response) => {
								const res = response.data;
								if (res.code) {
									this.$Message.success(res.message);
									this.spinShow = false;
									this.$router.go(-1);
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
			this.loadData();
		}
	}
</script>

<style lang="less">
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
