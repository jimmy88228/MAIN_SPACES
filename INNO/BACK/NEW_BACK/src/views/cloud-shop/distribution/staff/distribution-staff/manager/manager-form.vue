<template>
	<PageTopBase isSave @save="confirm" class="manager">
		<div>
			<Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="140">
				<FormItem label="分销员代码" prop="dstb_staff_code">
					<Input v-model="formItem.dstb_staff_code" placeholder="请输入分销员代码" class="basic_input basic_input_fixed" :maxlength="30"
					 show-word-limit />
					<p class="strong_tips">注：当分销员为店员时，代码需和店员代码保持一致</p>
				</FormItem>
				<FormItem label="分销员姓名" prop="dstb_staff_name">
					<Input v-model="formItem.dstb_staff_name" placeholder="请输入分销员姓名" class="basic_input basic_input_fixed" :maxlength="30"
					 show-word-limit />
				</FormItem>
				<FormItem label="分销员手机" prop="dstb_staff_phone">
					<Input type="number" v-model="formItem.dstb_staff_phone" placeholder="请输入分销员手机" class="basic_input basic_input_fixed"
					 :maxlength="30" show-word-limit />
				</FormItem>
				<FormItem label="分销身份" prop="dstb_staff_level">
					<Select v-model="formItem.dstb_staff_level" class="basic_select">
						<Option value="1">等级一</Option>
						<Option value="2">等级二</Option>
					</Select>
				</FormItem>
				<!-- <FormItem label="分销等级" prop="staff_dstb_rank_id">
					<Select v-model="formItem.staff_dstb_rank_id" class="basic_select">
						<Option value="1">普通合伙人</Option>
						<Option value="2">高级合伙人</Option>
						<Option value="3">总裁合伙人</Option>
					</Select>
				</FormItem> -->
				<FormItem label="上级分销员" prop="prevYuan" v-show="formItem.dstb_staff_level == 2">
					<DistributionStaffSelect :data="formItem.prevYuan" type="radio" @del-tag="handleTagClose">
						<Button type="dashed" @click="handleUserSelected" class="basic_select">绑定上级分销员</Button>
					</DistributionStaffSelect>
				</FormItem>
				<FormItem label="绑定用户" prop="member">
					<user-select :data="formItem.member" type="radio" @del-tag="handleTagClose2">
						<Button type="dashed" @click="handleUserSelected2" class="basic_select">绑定用户</Button>
					</user-select>
				</FormItem>
				<FormItem label="是否开启" prop="is_enabled">
					<i-switch size="large" v-model="formItem.is_enabled" true-value="Y" false-value="N">
						<span slot="open">开启</span>
						<span slot="close">关闭</span>
					</i-switch>
				</FormItem>
				<FormItem label="是否参与排行榜" prop="is_join_rank">
					<i-switch size="large" v-model="formItem.is_join_rank" true-value="1" false-value="0">
						<span slot="open">开启</span>
						<span slot="close">关闭</span>
					</i-switch>
				</FormItem>
				<FormItem label="分销员状态" prop="status">
					<Select v-model="formItem.status" class="basic_select">
						<Option value="1">在职</Option>
						<Option value="0">离职</Option>
						<Option value="2">兼职</Option>
					</Select>
				</FormItem>
				<FormItem label="所属店铺" prop="storeData">
					<store-select :data="formItem.storeData" type="radio" @del-tag="handleStoreClose">
						<Button type="dashed" @click="handleStoreSelected" class="basic_select">选择所属店铺</Button>
					</store-select>
				</FormItem>
			</Form>
		</div>
		<Spin size="large" fix v-if="spinShow"></Spin>
	</PageTopBase>
</template>

<script>
	import PageTopBase from '@/views/my-components/page-top-base/index';
	import UserSelect from '@/views/my-components/list-component/index-edit';
	import StoreSelect from '@/views/my-components/list-component/index-edit';
	import DistributionStaffSelect from '@/views/my-components/list-component/index-edit';

	export default {
		props: ['id'],
		components: {
			PageTopBase,
			UserSelect,
			StoreSelect,
			DistributionStaffSelect
		},
		data() {
			return {
				formItem: {
					prevYuan: [],
					member: [],
					storeData: [],

					dstb_staff_code: '', //分销员代码 (注：当分销员为店员时，代码需和店员代码保持一致)
					dstb_staff_name: '', //分销员姓名
					dstb_staff_phone: '', //分销员手机
					dstb_staff_level: '1', //分销身份 1 等级一 2等级二
					parent_staff_id: 0, // 分销身份为等级2时，才有的上级分销员dstb_staff_id
					staff_dstb_rank_id: '0', //分销等级 id
					user_id: 0, //绑定用户user_id
					staff_store_id: 0, //所属店铺 id
					is_enabled: 'Y', //是否启用 Y是 N否
					status: '1', //分销员状态 0离职 1在职 2兼职
					is_join_rank: '1', // 是否参与排行榜 1是 0否
				},
				ruleValidate: {
					dstb_staff_code: [{
						required: true,
						message: '分销员代码不能为空',
						trigger: 'blur'
					}],
					dstb_staff_name: [{
						required: true,
						message: '分销员姓名不能为空',
						trigger: 'blur'
					}],
					dstb_staff_phone: [{
						required: true,
						message: '分销员手机不能为空',
						trigger: 'blur'
					}],
				},
				spinShow: false
			}
		},
		methods: {
			loadData() {
				this.spinShow = true;
				return this.$ajax.post(this.$api.CloudDistributionStaffDetailsInfo, {
						dstb_staff_id: this.id
					})
					.then(response => {
						const res = response.data;
						if (res.code) {
							let data = res.data && res.data.items;
							if (data) {
								this.formItem = Object.assign({}, data, {
									prevYuan: [{
										id: data.get_staff_dstb_info != null ? data.get_staff_dstb_info.dstb_staff_id : 0,
										name: data.get_staff_dstb_info != null ? data.get_staff_dstb_info.name : ''
									}],
									member: [{
										id: data.get_members != null ? data.get_members.user_id : 0,
										name: data.get_members != null ? data.get_members.card_num : ''
									}],
									storeData: [
										// data.get_store
										{
											id : data.get_store != null ? data.get_store.id : 0,
											code: data.get_store != null ? data.get_store.code : '',
											name: data.get_store != null ? data.get_store.name : ''
										}
									],
								});
							}
						}
						this.spinShow = false;
					});
			},
			handleUserSelected(selected) {
				console.log(this.formItem.prevYuan)
				this.$selectContent({
					mode: 'distributionStaff',
					type: 'radio',
					data: this.formItem.prevYuan,
					getList: (data) => {
						this.formItem.prevYuan = data;
					}
				});
			},
			handleTagClose(data) {
				this.formItem.prevYuan = data;
			},
			handleUserSelected2(selected) {
				this.$selectContent({
					mode: 'user',
					type: 'radio',
					data: this.formItem.member,
					extraAddtion: {
						is_bind_applet: 1 //1绑定小程序，2未绑定
					},
					getList: (data) => {
						this.formItem.member = data;
					}
				});
			},
			handleTagClose2(data) {
				this.formItem.member = data;
			},
			handleStoreSelected(selected) {
				this.$selectContent({
					mode: 'store',
					type: 'radio',
					data: this.formItem.storeData,
					getList: (data) => {
						this.formItem.storeData = data;
					}
				});
			},
			handleStoreClose(data) {
				this.formItem.storeData = data;
			},
			confirm() {
				this.$refs.formValidate.validate((valid) => {
					if (valid) {
						this.spinShow = true;
						this.$ajax.post(this.id ? this.$api.CloudDistributionStaffEdit : this.$api.CloudDistributionStaffAdd, {
								...this.formItem,
								dstb_staff_id: this.id,
								parent_staff_id: this.formItem.prevYuan.map(item => item.id).join(),
								user_id: this.formItem.member.map(item => item.id).join(),
								staff_store_id: this.formItem.storeData.map(item => item.id).join(),
								// is_enabled: this.formItem.is_enabled === 'Y' ? 'Y' : 'N'
							})
							.then(response => {
								const res = response.data;
								if (res.code) {
									this.$Message.success(res.message);
									this.$router.go(-1);
								}
								this.spinShow = false;
							});
					}
				})
			}
		},
		mounted() {
			if (this.id) this.loadData();
		}
	}
</script>

<style lang="less">
	.manager {

		.basic_input_fixed,
		.basic_textarea {
			max-width: 420px;
		}

		.time_range {
			width: 340px;
		}
	}
</style>
