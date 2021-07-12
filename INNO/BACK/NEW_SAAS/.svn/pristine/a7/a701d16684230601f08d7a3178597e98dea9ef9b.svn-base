<template>
	<div class="goods-editor-basic">
		<Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="120">
			<titleBar>基本信息</titleBar>
			<FormItem label="商品名称" prop="goods_name">
				<Input v-model="formItem.goods_name" placeholder="请输入商品名称" class="basic_input" />
			</FormItem>
			<FormItem label="商品货号" prop="goods_sn">
				<Input v-model="formItem.goods_sn" placeholder="请输入商品货号" class="basic_input" />
			</FormItem>
			<!-- <template v-if="formItem.sale_type == 4 && (formItem.is_show_count_down_time == 0 || formItem.is_show_count_down_time == 1)"> -->
			<!--促销商品-->
			<!-- <FormItem label="开始时间" prop="stime">
					<DatePicker
						v-model="formItem.stime"
						:options="timeLimitOptions"
						type="datetime"
						placeholder="请输入开始时间"
            transfer></DatePicker>
				</FormItem>
				<FormItem label="结束时间" prop="etime">
					<DatePicker
						v-model="formItem.etime"
						:options="timeLimitOptions"
						type="datetime"
						placeholder="请输入结束时间"
            transfer></DatePicker>
				</FormItem>
				<FormItem label="促销商品倒计时" prop="is_show_count_down_time">
					<RadioGroup v-model="formItem.is_show_count_down_time">
						<Radio label="1">是</Radio>
						<Radio label="0">否</Radio>
					</RadioGroup>
				</FormItem> -->
			<!-- </template> -->
			<FormItem label="商品主图" prop="goods_img">
				<image-edit :img="formItem.goods_img" @selectImg="selectMaterial('goods_img', formItem.goods_img, 'image')" @delImg="handleDelImg" />
			</FormItem>
			<FormItem label="主图视频" prop="goods_videos" class="video_form">
				<div v-if="formItem.goods_videos" class="video_wrapper">
					<video :src="formItem.goods_videos" controls="controls" width="320" height="180">
						您的浏览器不支持 video 标签。
					</video>
					<Icon type="ios-close-circle-outline" class="close" title="删除" @click="delVideo" />
				</div>
				<template v-if="!formItem.goods_videos">
					<div class="image-box" @click="selectMaterial('goods_videos', formItem.goods_videos, 'video')">
						<Icon type="md-add" size="35"></Icon>
					</div>
				</template>
				<div class="strong_tips">视频大小不能超过10M,建议使用mp4格式</div>
			</FormItem>
			<FormItem label="商品品牌" prop="goods_brand_id">
				<Select v-model="formItem.goods_brand_id" class="basic_select" filterable clearable>
					<Option v-for="item in brandList" :value="item.goods_brand_id" :key="item.goods_brand_id">{{ item.goods_brand_name }}</Option>
				</Select>
			</FormItem>
			<FormItem label="商品服务" prop="goods_service">
				<Select v-model="formItem.goods_service" class="basic_select" multiple filterable>
					<Option v-for="item in serviceList" :value="item.id" :key="item.id">{{ item.name }}</Option>
				</Select>
			</FormItem>
			<FormItem label="商品卖点" prop="goods_brief">
				<Input v-model="formItem.goods_brief" placeholder="请输入商品卖点" class="basic_input" maxlength="13" show-word-limit />
			</FormItem>
			<FormItem label="关键字" prop="keywords">
				<Input v-model="formItem.keywords" placeholder="请输入关键字" class="basic_textarea" type="textarea" />
				<div class="strong_tips">此处录入的关键字将被前端用户搜索到，关键字直接请用英文逗号分隔。</div>
			</FormItem>
			<FormItem label="商品分类" prop="cat_id" v-show="isProduct">
				<Cascader class="basic_cascader" v-model="formItem.cat_id_list" :data="sortCatList" filterable change-on-select
				 transfer ref="catRef" :render-format="renderSort" :clearable="isClear" @on-change="selectSortCat"></Cascader>
			</FormItem>
			<FormItem label="扩展分类" v-show="isProduct">
				<div v-for="(item, index) in selectedVcat" :key="item.value" class="vact_item">
					<Cascader class="basic_cascader v_input" :data="sortVcatList" v-model="item.vcat_id_list" transfer :clearable="isClear"
					 trigger="hover" @on-change="(v, s) => selectSortVcat(index, v, s)">
						<div class="slot_input">
							<p>{{item.label}}</p>
							<Icon type="ios-arrow-down" class="icon" />
						</div>
					</Cascader>
					<Icon type="ios-close-circle-outline" size="20" class="del_vcat" title="删除" @click="delVcat(item.value)" />
				</div>
				<Button type="primary" icon="md-add" @click="addVcat">添加</Button>
			</FormItem>
			<FormItem label="积分抵扣" prop="point_exchange" v-show="isProduct">
				<RadioGroup v-model="formItem.point_exchange">
					<Radio label="1">是</Radio>
					<Radio label="0">否</Radio>
				</RadioGroup>
			</FormItem>
			<FormItem label="配送方式" prop="shipping_way">
				<RadioGroup v-model="formItem.shipping_way">
					<Radio label="0">无限制</Radio>
					<Radio label="1">强制自提</Radio>
					<Radio label="2">强制配送</Radio>
				</RadioGroup>
			</FormItem>
			<FormItem label="会员折扣" prop="enable_user_discount" v-show="isProduct">
				<RadioGroup v-model="formItem.enable_user_discount">
					<Radio label="1">是</Radio>
					<Radio label="0">否</Radio>
				</RadioGroup>
				<p class="strong_tips">当商品勾选了否，不享受任何会员等级折扣</p>
			</FormItem>
			<FormItem label="创建时间" prop="on_sale_time" v-show="isProduct">
				<DatePicker v-model="formItem.on_sale_time" :options="timeLimitOptions" class="basic_date" type="datetime" disabled></DatePicker>
			</FormItem>

			<titleBar>价格库存<span v-show="!isProduct"> (赠品只能存在一个SKU条码)</span></titleBar>
			<FormItem :label-width="0">
				<goods-spec ref="goodsSpec" :user-color-list="formItem.userColorList" :user-size-list="formItem.userSizeList"
				 :color-unit="colorUnit" :color-mobile-unit="colorMobileUnit" :size-unit="sizeUnit" :size-mobile-unit="sizeMobileUnit"
				 :product-list="productList" :sale-type="formItem.sale_type" :sale-status="formItem.is_on_sale" @get-color-list="handleColorList"
				 @get-size-list="handleSizeList" @get-table-list="handleTableList" @get-color-unit="handleColorUnit" @get-size-unit="handleSizeUnit"></goods-spec>
			</FormItem>
			<template v-show="isProduct">
				<titleBar>属性信息</titleBar>
				<FormItem label="商品属性">
					<goodsEditorAttr ref="goods-editor-attr" type="spec" @change-attr="handleAttr"></goodsEditorAttr>
				</FormItem>
				
				<!-- 暂时屏蔽
				<titleBar>商品参数</titleBar>
				<FormItem label="商品参数">
					<goodsEditorAttr ref="product-params-attr" type="params" @change-attr="handleAttr"></goodsEditorAttr>
				</FormItem>-->
			</template>
			
			<titleBar>关联商品</titleBar>
			<link-goods :cat-list="sortCatList" :link-goods="formItem.linkGoods" :goods-id="formItem.goods_id" @link-goods="handleLinkGoods"></link-goods>
			
			<!--
			<div class="advanced-title" @click="handleAdvanced">
				<a class="text">高级</a>
				<a v-show="!isShowAdvanced">
					<Icon type="ios-arrow-down" /></a>
				<a v-show="isShowAdvanced">
					<Icon type="ios-arrow-up" /></a>
			</div>-->
			<transition name="fade">
				<div v-show="isShowAdvanced">
					
					<titleBar>商品标签</titleBar>
					<goods-tag :goods-id="formItem.goods_id" :tag-goods="formItem.tagGoods" @edit-tag="handleTag"></goods-tag>
				</div>
			</transition>
			<!--空白站位-->
			<div style="height:50px"></div>
			<!--加载提示-->
			<Spin size="large" fix v-if="spinShow"></Spin>
		</Form>
	</div>
</template>

<script>
	import titleBar from '@/views/my-components/title-bar/title-bar';
	import goodsEditorAttr from './goods-editor-attr';
	import GoodsSpec from './goods-spec/goods-spec';
	import helpTips from '@/views/my-components/help-tips/help-tips.vue';
	import LinkGoods from './link-goods/link-goods';
	import GoodsTag from './goods-tag/goods-tag';
	import MultiSelect from './multi-select';
	import InputNum from '@/views/my-components/input-num/input-num';
	import ImageEdit from '@/views/my-components/image-edit/image-edit';

	export default {
		name: 'goodsEditorBasic',
		components: {
			titleBar,
			goodsEditorAttr,
			helpTips,
			GoodsSpec,
			LinkGoods,
			GoodsTag,
			MultiSelect,
			InputNum,
			ImageEdit
		},
		data() {
			const checkGoodsWeight = function(rule, val, callback) {
				if (val < 0) {
					callback(new Error('必须是正数'));
				} else {
					callback();
				}
			};
			return {
				formItem: {
					auto_sale_start_time: '',
					auto_sale_end_time: '',
					staff_dstb_goods_commate: {
						first_level_com: 0,
						second_level_com: 0,
						second_level_com_direct: 0
					},
					userColorList: [],
					userSizeList: []
				},
				// 商品品牌列表
				brandList: [],
				serviceList: [],
				// 商品分类列表
				sortCatList: [],
				// 扩展分类列表
				sortVcatList: [],
				selectedVcat: [],
				selectedVcatRes: [],
				tempVcatData: [],
				// 上架平台列表
				goodsPlatformList: [],
				// 商品类型列表
				saleTypeList: {},
				// 售卖类型列表
				saleKindList: [],
				// 记录默认的商品属性ID
				attrList: [],
				// 记录默认的商品参数ID
				paramsGroup: [],
				tableData: [],
				ruleValidate: {
					goods_name: [{
						required: true,
						message: '商品名称不能为空',
						trigger: 'blur'
					}],
					goods_sn: [{
						required: true,
						message: '商品货号不能为空',
						trigger: 'blur'
					}],
					goods_img: [{
						required: true,
						message: '商品主图不能为空',
						trigger: 'change'
					}],
					// 赠品的不需要验证
					cat_id: [{
						required: true,
						message: '商品分类不能为空',
						trigger: 'change'
					}]
				},
				timeLimitOptions: {
					disabledDate(date) {
						return date && date.valueOf() < Date.now() - 86400000;
					}
				},
				vcat_content: '',
				// 选中第几个扩展分类
				vcatIndex: 0,
				spinShow: false,
				isProduct: true,
				// 是否为新建页面
				isAdd: true,
				colorList: [],
				sizeList: [],
				// 据说是固定的配置，不能修改
				colorUnit: '',
				sizeUnit: '',
				// 据说是移动端的配置，可修改
				colorMobileUnit: '',
				sizeMobileUnit: '',
				groupList: [],
				productList: [],
				linkData: [],
				isShowAdvanced: false,
				isClear: false,
				tagList: [],
				countVcat: 0,
				showPoptip: false,
				colorUnitEdit: '',
				sizeUnitEdit: '',
				firstLevelConfig: {
					empty: {
						t: '请输入一次分成比例'
					},
					range: {
						t: '一次分成比例不大于1',
						r: /^(\+?0\.*0*[1-9]*)$|^1$/
					}
				},
				secondLevelConfig: {
					empty: {
						t: '请输入二次分成比例'
					},
					range: {
						t: '二次分成比例不大于1',
						r: /^(\+?0\.*0*[1-9]*)$|^1$/
					}
				},
				levelCheck: {
					first: true,
					secondDirect: true,
					second: true
				}
			}
		},
		methods: {
			handleDelImg() {
				this.formItem.goods_img = '';
			},
			handleLevel(bool) {
				this.levelCheck.first = bool;
			},
			handleLevel2(bool) {
				this.levelCheck.secondDirect = bool;
			},
			handleLevel3(bool) {
				this.levelCheck.second = bool;
			},
			renderSort(labels) {
				return labels.slice(labels.length - 1).join('/');
			},
			initData(res) {
				const {
					goodsBrand: brandList,
					data: basicData,
					goodsService: serviceList,
					catTree: sortCatList,
					vcatTree: sortVcatList,
					goodsPlatform: goodsPlatformList,
					saleType: saleTypeList,
					saleKind: saleKindList,
					attrGroupTree: groupList,
					parameterGroupTree: parameterGroup,
					// 颜色单位
					color_unit_name: colorUnit,
					// 尺码单位
					size_unit_name: sizeUnit,
					color_name: colorMobileUnit,
					size_name: sizeMobileUnit
				} = res;
				this.brandList = brandList;
				this.serviceList = serviceList;
				this.goodsPlatformList = goodsPlatformList;
				this.saleTypeList = saleTypeList;
				this.saleKindList = saleKindList;
				this.colorUnit = colorUnit;
				this.sizeUnit = sizeUnit;
				this.colorMobileUnit = colorMobileUnit;
				this.sizeMobileUnit = sizeMobileUnit;
				this.productList = basicData.product_list || [];
				if (!basicData) return false;
				this.isAdd = basicData.length === 0;
				this.formItem = {
					goods_id: basicData.goods_id || 0,
					goods_name: basicData.goods_name || '',
					goods_sn: basicData.goods_sn || '',
					// 商品中文简写
					// goods_phonics: basicData.goods_phonics || '',
					// goods_ename: basicData.goods_ename || '',
					goods_img: basicData.goods_img || '',
					goods_brand_id: basicData.goods_brand_id || 0,
					goods_service: basicData.goods_service || [],
					// 商品卖点
					goods_brief: basicData.goods_brief || '',
					keywords: basicData.keywords || '',
					// 商品分类
					cat_id_list: basicData.cat_id_list && basicData.cat_id_list.map(Number) || [],
					vcat_id_list: basicData.virtual_cat_goods && basicData.virtual_cat_goods.map(item => item.vcat_id) || [],
					virtual_cat_goods: basicData.virtual_cat_goods || [],
					cat_id: basicData.cat_id || '',
					// 上架平台
					// goods_platform: (basicData.goods_platform && basicData.goods_platform.split(',')) || Object.keys(this.goodsPlatformList),
					// 上架时间
					// is_on_sale: basicData.is_on_sale || 0,
					// 注意这里的数据结构，最好返回个通用的数据结构，这里不好理解
					// 是否开启自动上下架
					// goods_auto_on_sale_enable: !!Number(basicData.goods_auto_on_sale_enable) || false,
					// auto_sale_start_time: (basicData.goods_auto_on_sale && basicData.goods_auto_on_sale[0] && basicData.goods_auto_on_sale[0].sale_time) || '',
					// auto_sale_end_time: (basicData.goods_auto_on_sale && basicData.goods_auto_on_sale[1] && basicData.goods_auto_on_sale[1].sale_time) || '',
					// 积分抵扣
					point_exchange: basicData.point_exchange || '1',
					// 配送方式
					shipping_way: (basicData.shipping_way) || '0',
					// 会员折扣
					enable_user_discount: basicData.enable_user_discount || '1',
					// 会员折扣
					is_force_sys_inventory: basicData.is_force_sys_inventory || '0',
					// 套装商品
					is_packagegoods_limit: basicData.is_packagegoods_limit || '0',
					// 上架时间
					on_sale_time: basicData.on_sale_time || new Date(),
					goods_weight: basicData.goods_weight || 0,
					stime: basicData.stime || '',
					etime: basicData.etime || '',
					// 商品类型
					// sale_type: basicData.sale_type || Object.keys(this.saleTypeList)[0],
					// 售卖类型
					// sale_kind: Number(basicData.sale_kind) || 0,
					// 促销商品倒计时
					// -1表示非促销商品
					// is_show_count_down_time: (basicData.is_show_count_down_time && basicData.is_show_count_down_time != -1) ? basicData.is_show_count_down_time : '0',
					// 商品属性组ID
					attr_group_id: basicData.attr_group_id || '0',
					parameter_group_id: basicData.parameter_group_id || '0',
					// 商品规格信息
					product_info: (basicData.product_list && basicData.product_list.filter(item => item)) || [],
					// 用户颜色规格
					userColorList: basicData.colorlist || [],
					// 用户尺码规格
					userSizeList: basicData.sizelist || [],
					linkGoods: basicData.link_goods || [],
					tagGoods: basicData.tag_goods || [],
					// 分销提成比例
					// staff_dstb_goods_commate: basicData.staff_dstb_goods_commate || {
					//   first_level_com: 0,
					//   second_level_com: 0,
					//   second_level_com_direct: 0
					// },
					goods_videos: basicData.goods_videos || ''
				};
				console.log(this.formItem)
				// 非赠品
				this.isProduct = this.formItem.sale_type != 99;
				this.$nextTick(() => {
					this.$refs['goods-editor-attr'].initData(this.formItem.attr_group_id, groupList);
					this.$refs['product-params-attr'].initData(this.formItem.parameter_group_id, parameterGroup);
				});
				this.loadExtraData();
			},
			loadExtraData() {
				this.$ajax.all(
					[
						this.$ajax.post(this.$api.ShopCatTree),
						this.$ajax.post(this.$api.ShopVcatTree)
					]
				).then(
					this.$ajax.spread((catData, vcatData) => {
						let catRes = catData.data;
						if (catRes.code) {
							this.sortCatList = this.handleSortList([...catRes.data]);
						}
						let vcatRes = vcatData.data;
						if (vcatRes.code) {
							// 缓存，利用该数组重新对比disabled
							this.tempVcatData = [...vcatRes.data];
							this.sortVcatList = this.handleSortList([...vcatRes.data]);
						}
					})
				);
			},
			addVcat() {
				this.countVcat++;
				this.selectedVcat.push({
					value: this.countVcat,
					label: '请选择',
					vcat_id_list: []
				});
			},
			delVcat(id) {
				this.selectedVcat.splice(this.selectedVcat.findIndex(item => item.value == id), 1);
				this.selectedVcatRes.splice(this.selectedVcatRes.findIndex(item => item == id), 1);
				// 重新比对
				this.sortVcatList = this.handleSortList(this.tempVcatData);
			},
			handleSortList(context) {
				const format = context.map(item => {
					return {
						value: item.cat_id || item.vcat_id,
						label: item.cat_name || item.vcat_name,
						parent_id: item.parent_id,
						disabled: item.vcat_id ? this.selectedVcatRes.includes(item.vcat_id) : false,
						children: item.children.length ? this.handleSortList(item.children) : []
					}
				});
				return format;
			},
			selectSortCat(value, selectedData) {
				this.formItem.cat_id = String(selectedData[selectedData.length - 1].value);
			},
			selectSortVcat(index, value, selectedData) {
				const selected = selectedData[selectedData.length - 1];
				const result = value[value.length - 1];
				this.selectedVcat.splice(index, 1, {
					value: selected.value,
					label: selected.label,
					vcat_id_list: value
				});
				this.selectedVcatRes.splice(index, 1, result);
				// 重新比对
				this.sortVcatList = this.handleSortList(this.tempVcatData);
			},
			getIndex(index) {
				this.vcatIndex = index;
			},
			selectMaterial(name, url, type) {
				let that = this;
				this.$selectMaterial({
					type: type,
					selectedData: url,
					getList(item) {
						console.log(item.src)
						that.$set(that.formItem, name, item.src);
						that.$refs.formValidate.validateField('goods_img');
					}
				});
			},
			delVideo() {
				this.$Modal.confirm({
					title: '删除提示',
					content: '确定删除该视频吗？',
					okText: '确定删除',
					cancelText: '取消',
					onOk: () => {
						this.formItem.goods_videos = '';
					}
				});
			},
			handleAttr(attrList, groupId, type) {
				if (type === 'spec') {
					this.attrList = [];
					this.formItem.attr_group_id = groupId;
				} else {
					this.paramsGroup = [];
					this.formItem.parameter_group_id = groupId;
				}
				if (attrList.length > 0) {
					const updateAttr = attrList.map(item => item.attr_id);
					if (type === 'spec') {
						this.attrList.forEach((item, index) => {
							if (updateAttr.indexOf(item.attr_id) != -1) {
								this.attrList.splice(index, 1);
							}
						});
						attrList.forEach(item => {
							this.attrList.push(item);
						});
						this.attrList.forEach(item => {
							if (item.defVal instanceof Array && item.defVal.length === 0) {
								// 空数组问题
								item.defVal = null;
							}
						});
					} else {
						this.paramsGroup.forEach((item, index) => {
							if (updateAttr.indexOf(item.attr_id) != -1) {
								this.paramsGroup.splice(index, 1);
							}
						});
						attrList.forEach(item => {
							this.paramsGroup.push(item);
						});
						this.paramsGroup.forEach(item => {
							if (item.defVal instanceof Array && item.defVal.length === 0) {
								// 空数组问题
								item.defVal = null;
							}
						});
					}
				} else {
					type === 'spec' ? this.attrList = [] : this.paramsGroup = [];
				}
			},
			handleStartOk() {
				const getDate = this.formItem.auto_sale_start_time.valueOf();
				const now = Date.now();
				if (getDate < now) {
					this.$Message.error('上架时间必须大于当前时间！');
					this.formItem.auto_sale_start_time = '';
				}
				this.checkDate();
			},
			handleEndOk() {
				const getDate = this.formItem.auto_sale_end_time.valueOf();
				const now = Date.now();
				if (getDate < now) {
					this.$Message.error('下架时间必须大于当前时间！');
					this.formItem.auto_sale_end_time = '';
				}
				this.checkDate();
			},
			checkDate() {
				if (this.formItem.auto_sale_start_time && this.formItem.auto_sale_end_time) {
					const getStartDate = this.formItem.auto_sale_start_time.valueOf();
					const getEndDate = this.formItem.auto_sale_end_time.valueOf();
					if (getStartDate > getEndDate) {
						this.$Message.error('下架时间必须大于上架时间！');
						this.formItem.auto_sale_start_time = '';
						this.formItem.auto_sale_end_time = '';
					}
				}
			},
			handleColorList(value) {
				this.colorList = [...value].map(item => {
					return Object.assign({}, item, {
						spec_id: item.id
					});
				});
			},
			handleSizeList(value) {
				this.sizelist = [...value].map(item => {
					return Object.assign({}, item, {
						spec_id: item.id
					});
				});
			},
			handleTableList(value) {
				console.log(value)
				this.tableData = value;
			},
			handleColorUnit(value) {
				this.colorUnitEdit = value;
			},
			handleSizeUnit(value) {
				this.sizeUnitEdit = value;
			},
			handleSaleStatus(e) {
				this.$refs.goodsSpec.updateSaleStatus(e);
			},
			handleLinkGoods(linkData) {
				this.linkData = linkData;
			},
			handleAdvanced() {
				this.isShowAdvanced = !this.isShowAdvanced;
			},
			handleTag(tag) {
				this.tagList = tag;
			},
			saveGoods() {
				// 扩展分类选择空
				if (this.selectedVcat.some(item => item.label === '请选择')) {
					this.$Message.error('请选择扩展分类！');
					return false;
				}

				// 上下架时间必填)
				// if (this.formItem.goods_auto_on_sale_enable) {
				//   if (!this.formItem.auto_sale_start_time || !this.formItem.auto_sale_end_time) {
				//     this.$Message.error('商品自动上下架时间不能为空！');
				//     return false;
				//   }
				// }

				// if (!(this.levelCheck.first && this.levelCheck.secondDirect && this.levelCheck.second)) {
				//   return false;
				// }

				if (this.tableData.length === 0) {
					this.$Message.error('请完善商品规格!');
					return false;
				}
				const hasCompleteSn = this.tableData.every(item => item.product_sn !== '');
				const validMarketPrice = this.tableData.every(item => item.market_price > 0);
				if (!hasCompleteSn) {
					this.$Message.error('请完善商品条码!');
					return false;
				}
				// if (this.formItem.sale_type == 1) {
				//   if (!validMarketPrice) {
				//     this.$Message.error('请完善商品售价!');
				//     return false;
				//   }
				// } else {
				//   const validSalePrice = this.tableData.every(item => item.sale_price > 0);
				//   if (!validMarketPrice) {
				//     this.$Message.error('请完善商品市场价!');
				//     return false;
				//   }
				//   if (!validSalePrice) {
				//     this.$Message.error('请完善商品促销价!');
				//     return false;
				//   }
				// }
				const hasCompletePic = this.colorList.every(item => item.goods_gallery.length > 0);
				const hasCompleteColorSpec = this.colorList.every(item => item.cat_id);
				const hasCompleteSizeSpec = this.sizelist.every(item => item.cat_id);
				if (!hasCompletePic) {
					this.$Message.error('请完善商品图!');
					return false;
				} else if (!hasCompleteColorSpec || !hasCompleteSizeSpec) {
					this.$Message.error('请完善商品规格!');
					return false;
				}
				this.$refs.formValidate.validate((valid) => {
					// goods_service,virtual_cat_goods,goods_platform,attrList,sizelist,link_goods,tag_ids 空數組會被qs過濾
					console.log(this.colorList);
					if (valid) {
						this.spinShow = true;
						this.$ajax.post((this.formItem.goods_id == 0 ? this.$api.ShopGoodsAdd : this.$api.ShopGoodsEdit), {
							goods_id: this.formItem.goods_id,
							goods_name: this.formItem.goods_name,
							goods_sn: this.formItem.goods_sn,
							goods_img: this.formItem.goods_img,
							// goods_phonics: this.formItem.goods_phonics,
							// goods_ename: this.formItem.goods_ename,
							goods_brand_id: this.formItem.goods_brand_id,
							goods_service: (this.formItem.goods_service.length > 0) ? this.formItem.goods_service : null,
							goods_brief: this.formItem.goods_brief,
							keywords: this.formItem.keywords,
							cat_id: this.formItem.cat_id || 0,
							virtual_cat_goods: this.selectedVcatRes || [],
							// goods_platform: (this.formItem.goods_platform.length > 0) ? this.formItem.goods_platform : null,
							// is_on_sale: this.formItem.is_on_sale,
							// goods_auto_on_sale_enable: this.formItem.goods_auto_on_sale_enable,
							// goods_auto_on_sale: [this.formItem.auto_sale_start_time, this.formItem.auto_sale_end_time],
							point_exchange: this.formItem.point_exchange,
							shipping_way: this.formItem.shipping_way,
							enable_user_discount: this.formItem.enable_user_discount,
							// is_force_sys_inventory: this.formItem.is_force_sys_inventory,
							// is_packagegoods_limit: this.formItem.is_packagegoods_limit,
							on_sale_time: this.formItem.on_sale_time,
							// goods_weight: this.formItem.goods_weight,
							stime: this.formItem.stime,
							etime: this.formItem.etime,
							// sale_type: this.formItem.sale_type,
							// sale_kind: this.formItem.sale_kind,
							// is_show_count_down_time: this.formItem.is_show_count_down_time,
							goods_desc: '',
							goods_videos: this.formItem.goods_videos || '',
							// staff_dstb_goods_commate: this.formItem.staff_dstb_goods_commate,
							attr_group_id: this.formItem.attr_group_id,
							parameter_group_id: this.formItem.parameter_group_id,
							attrList: this.attrList.length > 0 ? this.attrList : null,
							parameterList: this.paramsGroup.length > 0 ? this.paramsGroup : null,
							colorlist: this.colorList,
							sizelist: this.sizelist,
							product_list: this.tableData,
							link_goods: this.linkData.length ? this.linkData : null,
							tag_ids: this.tagList.length ? this.tagList : null,
							spec1_name_title: this.colorUnitEdit,
							spec2_name_title: this.sizeUnitEdit
						}).then((response) => {
							this.spinShow = false;
							var res = response.data;
							this.$emit('on-success');
							if (res.code) {
								// 保存成功
								this.$Message.success(res.message);
								if (this.formItem.goods_id == 0) {
									// 让添加变成编辑
									this.formItem.goods_id = res.data;
									// 新id 写入store
									this.$store.commit('setNewGoodsId', res.data);
								}
							}
						});
					} else {
						this.$Message.error('请完善内容');
					}
				});
			},
			nextStep() {
				this.$refs.formValidate.validate((valid) => {
					if (valid) {
						this.$emit('on-next-step', 1);
					} else {
						this.$Message.error('必填项不能为空');
					}
				});
			}
		},
		watch: {
			'formItem.sale_type': {
				handler(nV) {
					if (!nV) return false;
					if (nV == 1 || nV == 4) {
						this.ruleValidate.cat_id[0].required = true;
					} else if (nV == 99) {
						// 赠品不验证商品分类
						this.ruleValidate.cat_id[0].required = false;
					}
					this.isProduct = (nV == 1 || nV == 4);
				},
				deep: true
			},
			'formItem.virtual_cat_goods': {
				handler(nV) {
					if (!nV || (nV && nV.length === 0)) return false;
					this.selectedVcat = [...nV].map(item => {
						return {
							value: item.vcat_id,
							label: item.vcat_content.split('/').pop(),
							vcat_id_list: item.vcat_id_list
						}
					});
					this.selectedVcatRes = [...nV].map(item => item.vcat_id);
				},
				immediate: true,
				deep: true
			}
		}
	}
</script>

<style lang="less">
	@import './goods-editor-basic.less';
</style>
