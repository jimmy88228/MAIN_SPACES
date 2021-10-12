<template>
	<div class="staff_form">
		<PageTopBase isSave @save="confirm">
			<Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="140" label-colon>
				<FormItem label="员工代码" prop="staffCode">
					<Input v-model="formItem.staffCode" placeholder="请输入员工代码" class="basic_input" />
				</FormItem>
				<FormItem label="员工姓名" prop="staffName">
					<Input v-model="formItem.staffName" placeholder="请输入员工姓名" class="basic_input" />
				</FormItem>
				<FormItem label="员工电话" prop="staffMobile">
					<Input v-model="formItem.staffMobile" placeholder="请输入员工电话" class="basic_input" />
				</FormItem>
				<!-- 编辑才显示 -->
				<!-- <FormItem label="员工密码">
          <Button type="primary">重置密码</Button>
          <p>(员工初始化密码是ERP设定的密码，点击上面重置后，密码是：888888)</p>
        </FormItem> -->
				<FormItem label="绑定会员">
					<user-select :data="staffInfo"  type="radio" @del-tag="handleTagClose">
						<template v-slot:content="{ tagData, handleClose }">
							<div v-if="tagData[0]">
								<div class="avatar_wrapper">
									<Avatar :src="tagData[0].portrait_path" v-if="tagData[0].portrait_path" shape="square" size="large" />
									<Avatar :src="require('@rs/images/default-img.jpg')" shape="square" size="large" v-else />
									<Icon type="ios-close-circle-outline" class="close" title="删除" @click="handleClose(tagData[0].id)" />
								</div>
								<p>{{tagData[0].name}}</p>
							</div>
						</template>
						<Button type="dashed" @click="handleUserSelected" class="basic_select">绑定会员</Button>
					</user-select>
				</FormItem>
				<!-- 编辑才显示 -->
				<FormItem label="员工头像" prop="avatar">
					<image-edit :img="formItem.avatar" @selectImg="openImagesModal('avatar', formItem.avatar )" @delImg="handleDelImg">
						<p>建议尺寸：300X300像素，支持jpg、png两种格式，大小不超过500K。</p>
					</image-edit>
				</FormItem>
				<FormItem label="是否启用" prop="isEnabled">
					<i-switch size="large" v-model="formItem.isEnabled" true-value="1" false-value="0">
						<span slot="open">开启</span>
						<span slot="close">关闭</span>
					</i-switch>
				</FormItem>
				<FormItem label="员工状态" prop="status">
					<i-switch size="large" v-model="formItem.status">
						<span slot="open">在职</span>
						<span slot="close">离职</span>
					</i-switch>
				</FormItem>
				<FormItem label="员工岗位">
					<Select v-model="formItem.stationId" class="basic_select">
						<Option v-for="item in stationlist" :value="item.id" :key="item.id">{{ item.station_name }}</Option>
					</Select>
				</FormItem>
				<FormItem label="请选择所属店铺" prop="storeId">
					<!-- <store-select :data="storeInfo" type="radio" @del-tag="handleStoreClose">
						<Button type="dashed" @click="handleSelected" class="basic_select">选择所属店铺</Button>
					</store-select> -->
					<dataSelect v-model="formItem.storeId" type="store"></dataSelect>
				</FormItem>
				<!-- 编辑才显示 -->
				<FormItem label="创建时间" v-if="id">
					<p>{{formItem.addTime}}</p>
				</FormItem>
				<!-- 编辑才显示 -->
			</Form>
		</PageTopBase>
		<Spin size="large" fix v-if="spinShow"></Spin>
	</div>
</template>
<script>
	import PageTopBase from '@/views/my-components/page-top-base/index';
	import ImageEdit from '@/views/my-components/image-edit/image-edit';
	import StoreSelect from '@/views/my-components/list-component/index-edit';
	import UserSelect from '@/views/my-components/list-component/index-edit';

	export default {
		props: ['id'],
		components: {
			PageTopBase,
			ImageEdit,
			StoreSelect,
			UserSelect
		},
		data() {
			const checkPhone = function(rule, val, callback) {
				const reg = /^\d{11}$|^\d{5,6}$/;
				if (reg.test(val)) {
					callback();
				} else {
					callback(new Error('请填写正确的电话'));
				}
			}
			return {
				formItem: {
					staffCode: '',
					staffName: '',
					staffMobile: '',
					isEnabled: "1",
					status: true,
					staff_id: '0',
					storeId: '0',
					avatar: '',
					addTime: '',
					stationId: 0,
					relatedUserId: 0
				},
				storeInfo: [],
				staffInfo: [],
				stationlist: [],
				ruleValidate: {
					staffCode: [{
						required: true,
						message: '员工代码不能为空',
						trigger: 'blur'
					}],
					staffName: [{
						required: true,
						message: '员工姓名不能为空',
						trigger: 'blur'
					}],
					staffMobile: [{
						required: true,
						validator: checkPhone,
						trigger: 'blur'
					}],
					storeId: [{
						required: true,
						message: '所属店铺不能为空',
						trigger: 'change',
						type: 'number'
					}]
				},
				spinShow: false
			}
		},
		methods: {
			loadData() {
				this.spinShow = true;
				return this.$ajax.post(this.$api.staffInfo, {
						staff_id: this.id || 0
					})
					.then(response => {
						const res = response.data;
						if (res.code) {
							if (this.id) {
								this.formItem = res.data.staffMes && {
									staffCode: res.data.staffMes.staff_code,
									staffName: res.data.staffMes.staff_name,
									staffMobile: res.data.staffMes.staff_mobile,
									isEnabled: res.data.staffMes.is_enabled,
									status: res.data.staffMes.status == '0' ? true : false,
									staff_id: 0,
									storeId: Number(res.data.staffMes.store_id),
									avatar: res.data.staffMes.real_portrait_path,
									addTime: res.data.staffMes.add_time,
									stationId: Number(res.data.staffMes.station_id),
									relatedUserId: res.data.staffMes.related_user_id
								} || {};
								const storeData = res.data && res.data.get_store
								this.storeInfo = storeData //.id ? [storeData] : [];
								// 接口返回没有绑定为数组，有绑定为对象........
								this.staffInfo = Array.isArray(res.data.get_user) ? [] : [res.data.get_user];
							}
							this.stationlist = res.data && res.data.stationlist;
						}
						this.spinShow = false;
					});
			},
			handleDelImg() {
				this.formItem.avatar = '';
			},
			// 调起图片选择器
			openImagesModal(name, url) {
				let that = this;
				this.$selectMaterial({
					type: 'image',
					selectedData: url,
					getList(item) {
						that.formItem.avatar = item.src;
					}
				});
			},
			handleSelected(selected) {
				this.$selectContent({
					mode: 'store',
					type: 'radio',
					data: this.storeInfo,
					getList: (data) => {
						this.storeInfo = data;
						this.formItem.storeId = data[0].id;
						this.$refs.formValidate.validateField('storeId');
					}
				});
			},
			handleStoreClose(data) {
				this.storeInfo = data;
				this.formItem.storeId = '0';
				this.$refs.formValidate.validateField('storeId');
			},
			handleUserSelected(selected) {
				this.$selectContent({
					mode: 'user',
					type: 'radio',
					data: this.staffInfo,
					extraAddtion: {
						is_bind_applet: 1, //1绑定小程序，2未绑定
						is_bind_mobile:1
					},
					getList: (data) => {
						this.staffInfo = data;
						this.formItem.relatedUserId = data[0].id;
					}
				});
			},
			handleTagClose(data) {
				this.staffInfo = data;
				this.formItem.relatedUserId = 0;
			},
			handleUserClose(data) {
				this.staffInfo = data;
				this.formItem.relatedUserId = 0;
			},
			confirm() {
				this.$refs.formValidate.validate((valid) => {
					if (valid) {
						this.spinShow = true;
						return this.$ajax.post(this.id ? this.$api.staffEdit : this.$api.staffAdd, {
								staff_id: this.id || 0,
								staff_name: this.formItem.staffName,
								staff_code: this.formItem.staffCode,
								staff_mobile: this.formItem.staffMobile,
								store_id: this.formItem.storeId,
								is_enabled: this.formItem.isEnabled,
								status: (this.formItem.status == true ? 0 : 1),
								related_user_id: this.formItem.relatedUserId,
								real_portrait_path: this.formItem.avatar,
								station_id: this.formItem.stationId
							})
							.then(response => {
								const res = response.data;
								if (res.code) {
									this.$Message.success(res.message);
									this.$router.go(-1);
								}
								this.spinShow = false;
							}).finally(()=>{
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
<style lang="less" scoped>
	.staff_form {
		.staff_title {
			display: flex;
			align-items: center;

			.staff-form_back {
				margin-right: 20px;
			}
		}

		.basic_input,
		.basic_date,
		.basic_select {
			width: 260px;
		}

		.avatar_wrapper {
			position: relative;
			width: 40px;
			height: 40px;

			.close {
				position: absolute;
				right: -8px;
				top: -8px;
				color: #ED4014;
				font-size: 16px;
				cursor: pointer;
				font-weight: bold;
			}
		}
	}
</style>
