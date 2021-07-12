<style lang="less">
	.brand-form{
	.ivu-col-span-8{
		width:32%;
	}
}
</style>

<template>
	<div class="brand-form">
		<Card v-show="modalShow">
			<div slot="title">
				<Tooltip content="返回">
					<Icon type="ios-arrow-dropleft" @click="goBack" style="cursor: pointer;" size="28" />
				</Tooltip>
				<span>编辑品牌商信息</span>
			</div>
			<div slot="extra">
				<Button v-if="formItem.handle.edit" type="primary" @click="modalOk">保存</Button>
			</div>

			<!--审核组件-->
			<brandVerifyLog ref="brand-verify-log" @on-save="onLogSave"></brandVerifyLog>

			<!--用户图片管理组件-->
			<userImages ref="userImages" @on-return-url="returnImageUrl"></userImages>

			<Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="120">
				<Row :gutter="30">
					<Col :span="12">
					<FormItem label="品牌Logo：" prop="logo">
						<div class="image-box" @click="openImagesModal('logo',formItem.logo_format)" :style="'background-image: url('+formItem.logo_format+');'">
							<Icon type="md-add" size="30" v-show="(formItem.logo_format==''?true:false)"></Icon>
						</div>
					</FormItem>
					</Col>
					<Col :span="12">
					<FormItem label="服务号二维码：" prop="wx_qrcode">
						<div class="image-box" @click="openImagesModal('wx_qrcode', formItem.logo_format)" :style="'background-image: url('+formItem.wx_qrcode_format+');'">
							<Icon type="md-add" size="30" v-show="(formItem.wx_qrcode_format==''?true:false)"></Icon>
						</div>
					</FormItem>
					</Col>
				</Row>

				<Row :gutter="30">
					<Col :span="12">
					<FormItem label="审核状态：">
						<span :style="statusTxtStyle">{{formItem.status_text}}</span>
					</FormItem>

					<FormItem v-if="formItem.status==1 || formItem.status==2" label="启用/锁定：">
						<i-switch v-model="formItem.status_format" size="large">
							<span slot="open">启用</span>
							<span slot="close">锁定</span>
						</i-switch>
					</FormItem>
					</Col>
					<Col :span="12">
					<FormItem label="产品授权" prop="group_ids_str">
						<Select v-model="formItem.group_ids" placeholder="请选择产品" multiple class="default-input" @on-change="onGroupChange">
							<Option v-for="(group,gi) in pluginsGroup" :key="gi" :value="group.id" style="text-indent:10px;">
								{{group.name}}
							</Option>
						</Select>
						<div>一个商户可以授权多个产品，最终的授权取多个产品的交集</div>
					</FormItem>
					</Col>
				</Row>

				<Row :gutter="30">
					<Col :span="12">
					<FormItem label="品牌名称：" prop="brand_name">
						<Input v-model="formItem.brand_name" placeholder="品牌名称"></Input>
					</FormItem>
					</Col>
					<Col :span="12">
					<FormItem label="联系人：">
						<Input v-model="formItem.linkman" placeholder="品牌联系人"></Input>
					</FormItem>
					</Col>
				</Row>

				<Row :gutter="30">
					<Col :span="12">
					<FormItem label="联系电话：">
						<Input v-model="formItem.tel" placeholder="品牌联系电话"></Input>
					</FormItem>
					</Col>
					<Col :span="12">
					<FormItem label="手机号：">
						<Input v-model="formItem.mobile" placeholder="品牌联系人手机号"></Input>
					</FormItem>
					</Col>
				</Row>

				<Row :gutter="30">
					<Col :span="12">
					<FormItem label="省/市/区：">
						<al-selector v-model="formItem.arr_area" level="2" />
					</FormItem>
					</Col>
					<Col :span="12">
					<FormItem label="详细地址：">
						<Input v-model="formItem.address" placeholder="请输入详细地址"></Input>
					</FormItem>
					</Col>
				</Row>

				<Row :gutter="30">
					<Col :span="12">
					<FormItem label="绑定子品牌：">
						<Tag v-for="(item,index) in formItem.sub_brands" :key="index" size="large" closable @on-close="subBrandClose(index)">
							{{item.brand_id}} : {{item.brand_name}}
						</Tag>
						<Button @click="selectSubBrand">选择子品牌...</Button>
					</FormItem>
					</Col>
					<Col :span="12">

					</Col>
				</Row>

				<Row :gutter="30">
					<Col :span="12">
					<FormItem label="英文简称：">
						{{formItem.brand_name_en}}
					</FormItem>
					</Col>
					<Col :span="12">
					<FormItem label="二级域名：">
						<Input v-model="formItem.brand_url" placeholder="绑定的二级域名"></Input>
						<div>例如：{{formItem.brand_name_en}}.innourl.com （不用加http）</div>
					</FormItem>
					</Col>
				</Row>

				<Row :gutter="30">
					<Col :span="12">
					<FormItem label="注册时间：">
						{{formItem.created_at_format}}
					</FormItem>
					</Col>
					<Col :span="12">
					<FormItem label="最后修改时间：">
						{{formItem.updated_at_format}}
					</FormItem>
					</Col>
				</Row>

				<div class="form-footer-button-box">
					<Button type="default" @click="goBack">取消</Button>
					<Button type="primary" @click="modalOk">保存</Button>
				</div>
			</Form>

			<!--加载提示-->
			<Spin size="large" fix v-if="spinShow"></Spin>

		</Card>

		<!--品牌选择-->
		<brandSelect ref="brand-select" @on-ok="selectSubBrandCallback"></brandSelect>
	</div>
</template>

<script>
	import util from '@/libs/util.js';
	import userImages from '@/views/my-components/user-images/user-images.vue';
	import brandVerifyLog from './brand-verify-log';
	import brandSelect from '@/views/my-components/brand-select/brand-select';

	/**
	 * 品牌编辑 表单组件
	 */
	export default {
		name: 'brandForm',
		components: {
			userImages,
			brandVerifyLog,
			brandSelect,
		},
		data() {
			return {
				// 品牌 表单内容
				formItem: {
					brand_id: 0,
					brand_name: '',
					brand_name_en: '',
					arr_area: [],
					brand_logo: '',
					logo_format: '',
					linkman: '',
					mobile: '',
					tel: '',
					wx_qrcode: '',
					wx_qrcode_format: '',
					brand_url: '',
					group_ids: [],
					group_ids_str: '',
					sub_brands: [],
					status_text: '',
					status: 0,
					created_at_format: '',
					updated_at_format: '',
					handle: {
						edit: false
					}
				},

				sub_brand_is_change: false,

				// 表单数据规则
				ruleValidate: {
					brand_name: [{
						required: true,
						message: '名称不能为空',
						trigger: 'blur'
					}],
					group_ids_str: [{
						required: true,
						message: '不能为空',
						trigger: 'blur'
					}],
				},

				// 模态框
				modalShow: false,
				modalEditIndex: 0,

				// 插件组
				pluginsGroup: [],

				spinShow: false
			}
		},
		methods: {
			// 初始化方法
			init() {},
			// 提供给父级调用
			initSet(index, row, pluginsGroup) {
				this.modalEditIndex = index;

				this.modalShow = true;
				this.sub_brand_is_change = false;

				// 初始化表单数据
				row.status_format = (row.status == 1);
				//this.formItem = row;

				this.formItem.brand_id = row.brand_id;
				this.formItem.brand_name = row.brand_name;
				this.formItem.brand_name_en = row.brand_name_en;
				this.formItem.brand_logo = row.brand_logo;
				this.formItem.logo_format = row.logo_format;
				this.formItem.linkman = row.linkman;
				this.formItem.tel = row.tel;
				this.formItem.mobile = row.mobile;
				this.formItem.wx_qrcode = row.wx_qrcode;
				this.formItem.wx_qrcode_format = row.wx_qrcode_format;
				this.formItem.status_format = row.status_format;
				this.formItem.arr_area = row.arr_area_format;
				this.formItem.group_ids = row.group_ids;
				this.formItem.group_ids_str = typeof(row.group_ids) != 'undefined' && row.group_ids.length > 0 ? 'OK' : '';
				this.formItem.sub_brands = row.sub_brands;
				this.formItem.brand_url = row.brand_url;
				this.formItem.status = row.status;
				this.formItem.status_text = row.status_text;
				this.formItem.handle = row.handle;
				this.formItem.updated_at_format = row.updated_at_format;
				this.formItem.created_at_format = row.created_at_format;
				
				// 插件组
				this.pluginsGroup = pluginsGroup;
			},
			// 返回列表
			goBack() {
				this.modalShow = false;

				if (this.sub_brand_is_change) {
					this.$emit('on-save', {});
				} else {
					this.$emit('on-close', {});
				}
			},
			// 调起图片选择器
			openImagesModal(name, url) {
				var obj = {
					name: name,
					selectedImage: url
				};
				this.$refs.userImages.showModal(obj);
			},
			// 图片选择组件的回调
			returnImageUrl(obj) {
				this.$set(this.formItem, obj.name + '_format', obj.val);
				// 获取图片的相对名称
				this.$set(this.formItem, obj.name, this.basename(obj.val));
			},
			// 类似php 的basename 函数
			basename(str) {
				var idx = str.lastIndexOf('/')
				idx = idx > -1 ? idx : str.lastIndexOf('\\')
				if (idx < 0) {
					return str;
				}
				return str.substring(idx + 1);
			},
			// 保存事件
			modalOk() {
				this.$refs.formValidate.validate((valid) => {
					if (valid) {
						this.spinShow = true;

						// ajax 保存编辑数据
						util.ajax.post(util.apiUrl.brandEdit, {
								brand_id: this.formItem.brand_id,
								brand_name: this.formItem.brand_name,
								brand_logo: this.formItem.logo_format,
								status: this.formItem.status_format,
								wx_qrcode: this.formItem.wx_qrcode,
								linkman: this.formItem.linkman,
								tel: this.formItem.tel,
								mobile: this.formItem.mobile,
								brand_url: this.formItem.brand_url,
								arr_area: this.formItem.arr_area,
								address: this.formItem.address,
								group_ids: this.formItem.group_ids,
							})
							.then((response) => {
								var res = response.data;
								this.spinShow = false;

								if (res.code) {
									// 保存成功
									this.$Message.success(res.message);
									this.modalShow = false;
									this.$emit('on-save', {});
								} else {
									this.$Message.error(res.message);
								}
							});
					} else {
						this.$Message.error('必填项不能为空！');
					}
				});
			},
			// 审核组件回调函数
			onLogSave(obj) {
				this.$set(this.formItem, 'status_text', obj.status_text);
				this.$set(this.formItem, 'status', obj.status);
				this.$set(this.formItem, 'status_format', (obj.status == 1));
			},
			// 插件组变动回调
			onGroupChange(val) {
				if (val.length > 0) {
					this.formItem.group_ids_str = 'OK';
				} else {
					this.formItem.group_ids_str = '';
				}

				// 检查某个字段
				this.$nextTick(() => {
					this.$refs.formValidate.validateField('group_ids_str', (msg) => {});
				});
			},
			// 选择子品牌
			selectSubBrand() {
				this.$refs['brand-select'].openModal(this.formItem, 'checkbox');
			},
			// 删除关联
			subBrandClose(index) {
				this.$Modal.confirm({
					title: '操作提示',
					content: '确认取消子品牌关联吗？',
					okText: '确定',
					cancelText: '取消',
					onOk: () => {
						// ajax 保存编辑数据
						util.ajax.post(util.apiUrl.subBrandRemove, {
								brand_id: this.formItem.brand_id,
								sub_brand_id: this.formItem.sub_brands[index].brand_id,
							})
							.then((response) => {
								var res = response.data;
								if (res.code) {
									this.$delete(this.formItem.sub_brands, index);
									this.sub_brand_is_change = true;
								}
							});
					},
				});
			},
			// 选中品牌的回调
			selectSubBrandCallback(obj) {
				var hasBrands = [];
				this.formItem.sub_brands.forEach((sitem, sindex) => {
					hasBrands.push(sitem.brand_id);
				});

				var newBrandIds = [];
				obj.forEach((item, index) => {
					if (hasBrands.indexOf(item.brand_id) === -1 && item.brand_id != this.formItem.brand_id) {
						this.formItem.sub_brands.push(item);
						newBrandIds.push(item.brand_id);
					}
				});

				if (newBrandIds.length > 0) {
					// ajax 保存添加的数据
					util.ajax.post(util.apiUrl.subBrandAdd, {
							brand_id: this.formItem.brand_id,
							sub_brand_ids: newBrandIds,
						})
						.then((response) => {
							var res = response.data;
							if (res.code) {
								this.$Message.success("保存绑定子品牌成功！");
								this.sub_brand_is_change = true;
							}
						});
				}
			}
		},
		computed: {
			statusTxtStyle() {
				var color = ' font-weight:bold;margin-right:20px;';
				switch (this.formItem.status) {
					case 0:
						color += 'color:orange;';
						break;
					case 1:
						color += 'color:green;';
						break;
					case 2:
						color += 'color:red;';
						break;
					case 3:
						color += 'color:red;';
						break;
				}
				return color;
			}
		},
		mounted() {
			this.init();
		}
	}
</script>
