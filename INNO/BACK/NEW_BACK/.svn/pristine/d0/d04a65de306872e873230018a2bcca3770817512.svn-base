<template>
	<div>
		<Modal class="attr-form" v-model="modalShow" :title="modalTitle" :loading="modalLoading" @on-ok="modalOk">
			<Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="100">
				<FormItem label="属性名" prop="name">
					<Input v-model="formItem.name" placeholder="请输入属性名称" style="width:300px;"></Input>
				</FormItem>
				<FormItem label="前端筛选" prop="can_filter">
					<i-switch v-model="formItem.can_filter" size="large">
						<span slot="open">启用</span>
						<span slot="close">关闭</span>
					</i-switch>
					<!-- <Poptip trigger="hover" placement="top-end">
                <Icon type="ios-help-circle-outline" size="25" style="margin-left:20px;"></Icon>
                <div slot="title">帮助提示</div>
                <div slot="content">
                  启用的情况下，前端商品列表，<br />
                  可以对这个属性进行筛选
                </div>
              </Poptip> -->
					<p class="strong_tips">启用的情况下，前端商品列表可以对这个属性进行筛选</p>
				</FormItem>
				<FormItem label="是否多选" prop="is_multi">
					<i-switch v-model="formItem.is_multi" size="large">
						<span slot="open">多选</span>
						<span slot="close">单选</span>
					</i-switch>
					<!-- <Poptip trigger="hover" placement="top-end">
                <Icon type="ios-help-circle-outline" size="25" style="margin-left:20px;"></Icon>
                <div slot="title">帮助提示</div>
                <div slot="content">
                  多选是指，创建商品的时候，<br />
                  当前属性可以选择多个属性值，
                </div>
              </Poptip> -->
					<p class="strong_tips">多选是指，创建商品的时候，当前属性可以选择多个属性值</p>
				</FormItem>
				<FormItem label="唯一属性" prop="attr_type">
					<i-switch v-model="formItem.attr_type" size="large">
						<span slot="open">是</span>
						<span slot="close">否</span>
					</i-switch>
				</FormItem>
				<FormItem label="排序号">
					<edit-sort v-model="formItem.sortOrder" @checkVaild="handleSort"></edit-sort>
				</FormItem>
				<FormItem label="可选择列表">
					<Input type="textarea" placeholder="请填写属性值可选值" v-model="attr_values" :rows="4"/>
					<p class="strong_tips">注意：多个可选值的输入，用换行表示</p>
				</FormItem>
			</Form>
		</Modal>
	</div>
</template>

<script>
	import EditSort from '@/views/my-components/edit-sort/edit-sort';

	export default {
		name: 'attrForm',
		components: {
			EditSort
		},
		data() {
			return {
				// 表单内容
				formItem: {
					id: 0,
					// 属性名
					name: '',
					// 前端筛选
					can_filter: true,
					// 是否多选
					is_multi: false,
					// 唯一属性
					attr_type: false,
					// 排序
					sortOrder: '0'
				},
				attr_values: '',
				// 表单数据规则
				ruleValidate: {
					name: [{
						required: true,
						message: '名称不能为空',
						trigger: 'blur'
					}]
				},
				// 模态框
				modalShow: false,
				modalTitle: '',
				modalLoading: true,
				modalEditIndex: '',
				catId: 0,
				sortVaild: false
			}
		},
		methods: {
			// 打开模态框
			openModal(row, catId) {
				this.catId = catId;
				// 屏蔽 确定按钮
				this.modalShow = true;
				// 重置表单
				this.$refs.formValidate.resetFields();
				this.attr_values = '';
				// 初始化表单数据
				this.formItem.id = typeof(row.attr_id) !== 'undefined' ? Number(row.attr_id) : 0;
				if (this.formItem.id == 0) {
					this.modalTitle = '添加商品属性';
				} else {
					this.modalTitle = '修改商品属性';

					// 编辑时候的初始化数据
					this.formItem.name = row.attr_name;
					this.formItem.can_filter = row.is_join_filter == 1;
					this.formItem.is_multi = row.attr_input_type == 1;
					this.formItem.attr_type = row.attr_type == 1;
					this.formItem.sortOrder = String(row.sort_order);
					this.attr_values = row.attr_values;
				}
			},
			// 模态框确认事件
			modalOk() {
				this.$refs.formValidate.validate((valid) => {
					if (valid && this.sortVaild) {
						// ajax 保存数据
						this.$ajax.post((this.formItem.id == 0 ? this.$api.ShopGoodsAttrAdd : this.$api.ShopGoodsAttrEdit), {
								cat_id: this.catId,
								attr_id: this.formItem.id,
								attr_name: this.formItem.name,
								is_join_filter: this.formItem.can_filter,
								attr_input_type: this.formItem.is_multi,
								attr_type: this.formItem.attr_type,
								sort_order: this.formItem.sortOrder,
								attr_values: this.attr_values
							})
							.then((response) => {
								var res = response.data;
								if (res.code) {
									// 保存成功
									this.$Message.success(res.message);
									this.modalShow = false;

									// 把数据返回给父级
									this.$emit('on-success', {
										data: res.data,
										type: (this.formItem.id == 0 ? 'add' : 'edit')
									});
								} else {
									this.modalShow = true;
									this.modalLoading = false;

									setTimeout(() => {
										this.modalLoading = true;
									}, 50);
								}
							});
					} else {
						// 验证失败，不关闭模态框
						this.modalShow = true;
						this.modalLoading = false;

						setTimeout(() => {
							this.modalLoading = true;
						}, 50);
					}
				})
			},
			handleSort(bool) {
				this.sortVaild = bool;
			}
		}
	}
</script>

<style lang="less">
	.attr-form {
		.ivu-poptip-rel {
			line-height: 30px;
			vertical-align: sub;
		}

		.ivu-form-item {
			margin-bottom: 20px;
		}

		.ivu-select-dropdown {
			max-height: 200px;
		}
	}
</style>
