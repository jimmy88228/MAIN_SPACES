<style lang="less">
	.link-to{
	.ivu-tag{
		text-overflow: ellipsis;
	    white-space: nowrap;
	    overflow: hidden;
	    max-width: 200px;
	}
}
</style>

<template>
	<span class="link-to">
		<template v-if="selectLink.code=='' || selectLink.code== null || selectLink.name== null || selectLink.name== '' ">
			<Select v-model="selectLink.code" size="small" style="width:120px;" placeholder="请选择" clearable @on-change="onChange">
				<template v-for="(item,index) in linktoList">
					<template v-if="isPc == 1 && item.canPc == 1">
						<Option :value="item.code" :name="index">
							{{ item.name }}
						</Option>
					</template>
					<template v-if="isPc == 0">
						<Option :value="item.code" :name="index">
							{{ item.name }}
						</Option>
					</template>
				</template>
			</Select>
		</template>
		<template v-else>
			<Poptip confirm v-model="showPoptip" title="确定删除链接吗？" @on-ok="closeTag">
				<Tag type="border" closable @click.native.stop="showPop" @on-close="showPop" style="cursor: pointer;">
					{{sourceTypeName}} {{selectLink.name}}
				</Tag>
			</Poptip>
		</template>

		<!--选择链接的源-->
		<selectSourceId ref="select-source-id" @on-ok="onSourceOk" @on-cancel="onSourceCancel"></selectSourceId>

		<!--自定义url地址-->
		<customUrl ref="custom-url" @on-ok="onSourceOk" @on-cancel="onSourceCancel"></customUrl>
		<!--选择商品-->
		<goodsSelect ref="goods-select" @on-ok="onGoodsSelectOk"></goodsSelect>
		<!--选择微页面-->
		<goodsPageSelect ref="page-select" @on-ok="onPagesSelect"></goodsPageSelect>
		<!--选择商品分类-->
		<goodsCatSelect ref="goods-cat-select" @on-ok="onGoodsCatSelectOk"></goodsCatSelect>

		<!--选择商品分类-->
		<goodsVcatSelect ref="goods-vcat-select" @on-ok="onGoodsVcatSelectOk"></goodsVcatSelect>
	</span>
</template>

<script>
	/**
	 * 活动页：链接到，公共组件
	 */
	import selectSourceId from '@/views/my-components/link-to/select-source-id';
	import customUrl from '@/views/my-components/link-to/custom-url';
	import goodsSelect from '@/views/my-components/goods-select/goods-select';
	import goodsPageSelect from '@/views/my-components/goods-page-select/goods-page-select';
	import goodsCatSelect from '@/views/my-components/goods-cat-select/goods-cat-select';
	import goodsVcatSelect from '@/views/my-components/goods-vcat-select/goods-vcat-select';

	export default {
		name: 'linkTo',
		components: {
			selectSourceId,
			customUrl,
			goodsSelect,
			goodsPageSelect,
			goodsCatSelect,
			goodsVcatSelect,
		},
		props: {
			// 已选中的
			selectLink: {
				type: [Object, Array],
				default: {
					code: '',
					id: 0,
					name: ''
				}
			},
			// 父数组索引
			itemIndex: {
				type: Number,
				default: 0
			},
			// 是否 pc 前端使用的链接
			isPc: {
				type: Number,
				default: 0,
			}
		},
		data() {
			return {
				linktoList: [],
				showPoptip: false,
				// 源类型名称
				sourceTypeName: '',
				modelLink: {
					code: '',
					name: '',
					id: 0
				}
			}
		},
		methods: {
			// 初始化
			init() {
				this.$nextTick(() => {
					this.initData();
				});
			},
			initData() {
				var mainData = JSON.parse(this.$util.cache.get('mainFrameData'));
				if (mainData != null && typeof(mainData.data) !== 'undefined') {
					this.linktoList = mainData.data.linkTo;
					this.modelLink = this.selectLink;

					for (var i in this.linktoList) {
						if (this.linktoList[i].code == this.selectLink.code) {
							this.sourceTypeName = '[' + this.linktoList[i].name + ']';
							break;
						}
					}

					if (typeof(this.modelLink) === 'undefined') {
						this.modelLink = {
							code: '',
							name: '',
							id: 0,
							sn: ''
						};
					}
				}
			},
			showPop() {
				if (this.showPoptip == false) {
					this.showPoptip = true;
				}
			},
			// 选中了 需要选择源的选项；
			onChange(code) {
				var mustSource = false;
				var selectName = '';
				for (var i in this.linktoList) {
					if (this.linktoList[i].code == code) {
						selectName = this.linktoList[i].name;

						// 判断是否要弹出选项框
						if (this.linktoList[i].mustSourceId == 1) {
							mustSource = true;
						}
						break;
					}
				}

				if (mustSource) {
					// 需要弹出选项框
					switch (code) {
						case 'customUrl':
							// 打开自定义URL的组件
							this.$refs['custom-url'].openBox(code, 0);
							break;

						case 'goodsUrl':
							this.$refs['goods-select'].openModal([], 'radio');
							break;

						case 'pageUrl':
							this.$refs['page-select'].openModal([], 'radio');
							break;

						case 'goodsCatUrl':
							this.$refs['goods-cat-select'].openModal([], 'radio');
							break;

						case 'goodsVcatUrl':
							this.$refs['goods-vcat-select'].openModal([], 'radio');
							break;

						default:
							// 打开选择源ID的组件
							this.$refs['select-source-id'].openBox(code, 0, this.isPc);
					}
				} else {
					// 只是单选，无需弹出选项框，无需选择源，传递参数给父组件
					this.$set(this.modelLink, 'name', selectName);
					this.$set(this.modelLink, 'code', code);

					this.$emit('on-selected', this.itemIndex, {
						code: code,
						id: 0,
						name: selectName,
						sn: ''
					});
				}
			},
			// 源取消
			onSourceCancel() {
				this.$set(this.modelLink, 'code', null);
			},
			// 关闭选择的镖旗
			closeTag() {
				this.$set(this.selectLink, 'code', null);
				this.$set(this.selectLink, 'name', null);
				this.showPoptip = false;
				this.$emit('on-reset');
			},
			// 商品选择的，回调
			onGoodsSelectOk(obj) {
				// 选择源后，传递参数给父组件
				this.$emit('on-selected', this.itemIndex, {
					code: 'goodsUrl',
					id: obj[0].id,
					name: obj[0].name,
					sn: obj[0].code, // 链接带的参数统一用sn 标识
					typeName: '商品', // 类型名称
				});
			},
			// 微页面的选中回调
			onPagesSelect(obj) {
				// 选择源后，传递参数给父组件
				this.$emit('on-selected', this.itemIndex, {
					code: 'pageUrl',
					id: obj[0].id,
					name: obj[0].name,
					sn: obj[0].code, // 链接带的参数统一用sn 标识
					typeName: '微页面', // 类型名称
				});
			},
			// 商品分类选择的，回调
			onGoodsCatSelectOk(obj) {
				// 选择源后，传递参数给父组件
				this.$emit('on-selected', this.itemIndex, {
					code: 'goodsCatUrl',
					id: obj[0].cat_id,
					name: obj[0].cat_name,
					sn: '', // 链接带的参数统一用sn 标识
					typeName: '商品分类', // 类型名称
				});
			},
			// 商品虚拟分类选择的，回调
			onGoodsVcatSelectOk(obj) {
				// 选择源后，传递参数给父组件
				this.$emit('on-selected', this.itemIndex, {
					code: 'goodsVcatUrl',
					id: obj[0].vcat_id,
					name: obj[0].vcat_name,
					sn: '', // 链接带的参数统一用sn 标识
					typeName: '商品分类', // 类型名称
				});
			},
			// 源框勾选了某项 子组件回调
			onSourceOk(code, row) {
				this.$set(this.modelLink, 'name', row.name);
				this.$set(this.modelLink, 'code', code);

				for (var i in this.linktoList) {
					if (this.linktoList[i].code == code) {
						this.sourceTypeName = '[' + this.linktoList[i].name + (code == 'customUrl' ? row.sn : '') + ']';
						break;
					}
				}

				// 选择源后，传递参数给父组件
				this.$emit('on-selected', this.itemIndex, {
					code: code,
					id: code == 'qmenu' ? row.router : row.id,
					name: row.name,
					sn: row.sn, // 链接带的参数统一用sn 标识
					typeName: this.sourceTypeName // 类型名称
				});
			}
		},
		watch: {
			// 监听菜单是否已经初始化完毕
			'isInitMenu'(to) {
				if (to == true) {
					// 这里异步是防止cook 未写完就去读
					window.setTimeout(() => {
						this.initData();
					}, 500);
				}
			},
			'selectLink'(to) {
				for (var i in this.linktoList) {
					if (this.linktoList[i].code == to.code && to.code != 'customUrl') {
						this.sourceTypeName = '[' + this.linktoList[i].name + ']';
						break;
					}
				}
			}
		},
		mounted() {
			this.init();
		}
	}
</script>
