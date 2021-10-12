<style lang="less">
.editor-goods-list-form{
	padding:5px;

	.col-box{
		padding:5px 0;
		text-align: center;
	}

	.ivu-poptip-body-content{
		overflow: hidden;
	}

	.group-item-list{
		border-radius: 5px;
		margin-bottom:12px;
		margin-right:10px;
		position: relative;
		padding:0px;
		background: #fff;
		font-size:12px;

		.close{
			position: absolute;
			right:-10px;
			top:-10px;
			font-size: 10px;
			cursor: pointer;
			display:none;
			color:red;
			font-size: 22px;
		}
		.handle_group{
			position: absolute;
			right:25px;
			top:-10px;
			font-size: 10px;
			cursor: move;
			display:none;
			color: #2d8cf0;
			font-size: 22px;
		}
		&:hover{
			.close, .handle_group{
				display: block;
			}
		}
	}
}
</style>

<template>
	<div class="editor-goods-list-form">
		<titleBar>商品列表组件 设置</titleBar>

		<Form ref="formValidate" :model="formItem" :rules="ruleValidate" label-position="top">
			<FormItem label="列表样式">
				<RadioGroup v-model="formItem.layout">
					<Radio label="one">一行一个</Radio>
					<Radio label="two">一行两个</Radio>
					<Radio label="three">一行三个</Radio>
					<Radio label="four">一行四个</Radio>
					<Radio label="bigSmall">一大两小</Radio>
					<Radio label="list">列表形式</Radio>
				</RadioGroup>
			</FormItem>
			<FormItem v-if="formItem.layout == 'one' || formItem.layout == 'two' || formItem.layout == 'three' || formItem.layout == 'four' "
			 label="只在一行内展示，多出部分左右滑动">
				<i-switch v-model="formItem.open_slide" size="large">
					<span slot="open">启用</span>
					<span slot="close">关闭</span>
				</i-switch>
			</FormItem>
			
			<FormItem label="图片间距（有背景色的情况下，间距效果会更佳）">
				<Slider v-model="formItem.gutter" :min="0" :max="30" show-input style="margin:0 30px 0 10px;"></Slider>
			</FormItem>
			<FormItem v-if="formItem.goodsGroup.length > 1 " label="切换当前Tab ( 仅用于预览效果 )" prop="type">
				<RadioGroup v-model="formItem.currTab">
					<Radio v-for="(citem,cindex) in formItem.goodsGroup" :key="cindex" :label="'tab'+cindex">{{ citem.name }}</Radio>
				</RadioGroup>
			</FormItem>
			<FormItem label="商品分组（只有一个分组时，不会显示Tab头）">
				<draggable ghost-class="ghost" :list="formItem.goodsGroup" :group="{name:'goodsGroup'}" handle=".handle_group"
				 v-bind="dragOptions" @start="dragStart" @end="dragEnd" @change="dragChange">

					<Card v-for="(item,index) in formItem.goodsGroup" :name="index" :key="index" class="group-item-list" 
					@click.native="cardClick(index)">
						<Icon type="ios-close-circle" class="close" title="移除" @click.stop="removeGroup(index)" />
						<Icon type="md-apps" class="handle_group" title="拖拽排序" />


						<div style="padding:5px 0 0 10px;">
							分组#{{index+1}} 名称 
							<Input v-model="item.name" placeholder="请输入分组标题" style="width:180px;margin-left:5px;" 
							size="small" maxlength="8" show-word-limit></Input>
						</div>

						<div v-if="item.goodsListType == 'goods' ">
							<!--指定商品的列表-->
							<goodsItemForm :currIndex="currIndex" :groupIndex="index" @on-change="onGoodsListChange"></goodsItemForm>
						</div>
						<div v-else style="padding:5px 10px 10px 10px;">
							<div slot="content">
								<div v-if="item.goodsListType != '' ">
									<div>
										显示数量：<InputNumber v-model="item.showNum" :min="0" :max="20" size="small" /> 设置为0则不作限制
									</div>
									<div>
										已选类型：<Tag type="border" :color="item.goodsListType=='goodsBrand' ? 'orange' : ( item.goodsListType=='goodsCat' ? 'blue' : 'green') ">
											{{item.goodsListTypeName}}</Tag>
									</div>
									<div>
										已选择项：
										<Tag v-for="(em,eindex) in item.goodsList" :key="eindex" size="medium" closable 
										@on-close="itemClose(index,eindex)">
											{{em.name}}
										</Tag>
									</div>
								</div>
							</div>
						</div>
					</Card>
				</draggable>
			</FormItem>
			<Poptip v-model="showPoptip">
				<div style="width:350px;text-align:center;">
					<Button icon="md-add" long>添加分组</Button>
				</div>
				<div slot="content">
					<Row type="flex" :gutter="5">
						<Col>
						<div class="col-box">
							<Button type="success" @click="selectGoodsList('goods')" size="small">指定商品</Button>
						</div>
						</Col>
						<Col>
						<div class="col-box">
							<Button type="primary" @click="selectGoodsList('goodsCat')" size="small">商品分类</Button>
						</div>
						</Col>
						<Col>
						<div class="col-box">
							<Button type="info" @click="selectGoodsList('vcat')" size="small">自定义分类</Button>
						</div>
						</Col>
						<Col>
						<div class="col-box">
							<Button type="warning" @click="selectGoodsList('goodsBrand')" size="small">商品品牌</Button>
						</div>
						</Col>
					</Row>
				</div>
			</Poptip>
		</Form>
		
		<!--统一内容显示开关-->
		<goodsContentSwitchForm :currIndex="currIndex"></goodsContentSwitchForm>
		
		<!--绑定商品品牌的选择器-->
		<goodsBrandSelect ref="goods-brand-select" @on-ok="onGoodsBrandSelectOk"></goodsBrandSelect>

		<!--商品分类选择器-->
		<goodsCatSelect ref="goods-cat-select" @on-ok="onGoodsCatSelectOk"></goodsCatSelect>
		
		<!--商品虚拟分类选择器-->
		<goodsVcatSelect ref="goods-vcat-select" @on-ok="onGoodsVcatSelectOk"></goodsVcatSelect>
		
	</div>
</template>

<script>
	/**
	 * 商品小工具
	 */
	import titleBar from '@/views/my-components/title-bar/title-bar';
	import draggable from "vuedraggable";
	import goodsBrandSelect from '@/views/my-components/goods-brand-select/goods-brand-select';
	import goodsCatSelect from '@/views/my-components/goods-cat-select/goods-cat-select';
	import goodsVcatSelect from '@/views/my-components/goods-vcat-select/goods-vcat-select';
	import goodsItemForm from './goods-list-form-goods-item.vue';
	import goodsContentSwitchForm from './goods-content-switch-form.vue';
	
	export default {
		name: 'goodsListForm',
		components: {
			titleBar,
			draggable,
			goodsBrandSelect,
			goodsCatSelect,
			goodsVcatSelect,
			goodsItemForm,
			goodsContentSwitchForm,
		},
		props: {
			currIndex: {
				type: [Number, String],
				default: 0,
			}
		},
		data() {
			return {
				formItem: {
					layout: 'two',
					open_slide: false,
					gutter: 0,
					currTab: 'tab0',
					goodsGroup: [],
				},

				dataList: [],
				// 表单数据规则
				ruleValidate: {},

				showPoptip: false,
				drag: false,
			}
		},
		computed: {
			dragOptions() {
				return {
					animation: 200,
					group: "description",
					disabled: false,
					ghostClass: "ghost",
				};
			}
		},
		methods: {
			init() {
				// 双向绑定store 的数据
				this.dataList = this.$store.state.app.pageCompList;
				this.formItem = this.dataList[this.currIndex].setting;

				if (typeof(this.formItem.goodsGroup) == 'undefined') {
					this.$set(this.formItem, 'goodsGroup', []);
				}
				if (typeof(this.formItem.layout) == 'undefined') {
					this.$set(this.formItem, 'layout', 'two');
					this.$set(this.formItem, 'open_slide', false);
					this.$set(this.formItem, 'gutter', 0);
					this.$set(this.formItem, 'currTab', 'tab0');
				}
			},
			// 移除item
			itemClose(group_index, eindex) {
				this.$Modal.confirm({
					title: '操作提示',
					content: '确定移除商品关联项吗？',
					okText: '确定',
					cancelText: '取消',
					onOk: () => {
						this.$delete(this.formItem.goodsGroup[group_index].goodsList, eindex);

						// 如果全部删完，那么把分组也干掉
						if (this.formItem.goodsGroup[group_index].goodsList.length == 0) {
							this.$delete(this.formItem.goodsGroup, group_index);
						}
					},
				});
			},
			// 选择商品列表
			selectGoodsList(type) {
				console.log("type", type)
				switch (type) {
					case 'goods':
						this.formItem.goodsGroup.push({
							goodsList: [],
							name: '分组名',
							goodsListType: 'goods',
							goodsListTypeName: '指定商品',
						});
						this.showPoptip = false;
						break;
					case 'goodsCat':
						this.$refs['goods-cat-select'].openModal([], 'radio');
						break;

					case 'vcat':
						this.$refs['goods-vcat-select'].openModal([], 'radio');
						break;

					case 'goodsBrand':
						this.$refs['goods-brand-select'].openModal([], 'radio');
						break;
				}
			},
			// 商品品牌选择的，回调
			onGoodsBrandSelectOk(obj) {
				let goodsList = [];
				for (var i in obj) {
					goodsList.push({
						id: obj[i].goods_brand_id,
						name: obj[i].goods_brand_name,
					});
				}

				this.formItem.goodsGroup.push({
					goodsListType: 'goodsBrand',
					goodsListTypeName: '商品品牌',
					goodsList: goodsList,
					name: '分组名',
					showNum: 6,
				});
			},
			// 商品分类选择的，回调
			onGoodsCatSelectOk(obj) {
				let goodsList = [];
				for (var i in obj) {
					goodsList.push({
						id: obj[i].cat_id,
						name: obj[i].cat_name,
					});
				}

				this.formItem.goodsGroup.push({
					goodsListType: 'goodsCat',
					goodsListTypeName: '商品分类',
					goodsList: goodsList,
					name: '分组名',
					showNum: 6,
				});
			},
			// 商品自定义分类选择的，回调
			onGoodsVcatSelectOk(obj) {
				let goodsList = [];
				for (var i in obj) {
					goodsList.push({
						id: obj[i].vcat_id,
						name: obj[i].vcat_name,
					});
				}

				this.formItem.goodsGroup.push({
					goodsListType: 'vat',
					goodsListTypeName: '自定义分类',
					goodsList: goodsList,
					name: '分组名',
					showNum: 6,
				});


			},
			// 添加分组
			addGroup() {
				this.formItem.goodsGroup.push({
					title: '',
					openCollapse: '1',
					goodsListType: '',
				});
			},
			// 移除分组
			removeGroup(index) {
				this.$Modal.confirm({
					title: '操作提示',
					content: '确定删除商品分组吗？',
					okText: '确定',
					cancelText: '取消',
					onOk: () => {
						this.$delete(this.formItem.goodsGroup, index);
					},
				});
			},
			// 指定商品列表的变动，回调
			onGoodsListChange(obj) {
				this.$set(this.formItem.goodsGroup[obj.groupIndex], 'goodsList', obj.data);
			},
			// card 点击事件
			cardClick(index){
				this.formItem.currTab = 'tab'+index;
			},
			dragChange() {

			},
			// 拖动开始
			dragStart(e) {
				this.drag = true;
			},
			// 拖动结束
			dragEnd(e) {
				this.drag = false;
			},
		},
		watch: {
			'currIndex'(to) {
				this.init();
			}
		},
		mounted() {
			this.init();
		},
	}
</script>
