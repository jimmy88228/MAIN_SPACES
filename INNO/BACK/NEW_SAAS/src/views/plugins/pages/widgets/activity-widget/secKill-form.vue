<template>
	<div class="sec-kill-form">
		<titleBar>秒杀组件 设置</titleBar>

		<Form ref="formValidate" :model="formItem" :rules="ruleValidate" label-position="top">

			<FormItem label="列表样式">
				<RadioGroup v-model="formItem.layout">
					<Radio label="one">一行一个</Radio>
					<Radio label="two">一行两个</Radio>
					<Radio label="three">一行三个</Radio>
					<Radio label="bigSmall">一大两小</Radio>
					<Radio label="list">列表形式</Radio>
				</RadioGroup>
			</FormItem>
			<FormItem v-if="formItem.layout == 'one' || formItem.layout == 'two' || formItem.layout == 'three' " label="只在一行内展示，多出部分左右滑动">
				<i-switch v-model="formItem.open_slide" size="large">
					<span slot="open">启用</span>
					<span slot="close">关闭</span>
				</i-switch>
			</FormItem>
			<FormItem label="图片间距（有背景色的情况下，间距效果会更佳）">
				<Slider v-model="formItem.gutter" :min="0" :max="30" show-input style="margin:0 30px 0 10px;"></Slider>
			</FormItem>
			
			<FormItem label="标签(用于统计)">
				<Input v-model="formItem.tag" style="width:180px;"></Input>
			</FormItem>
			
			<div class="goods-list-box">
				<FormItem v-if="formItem.activityGroup.length > 1 " label="切换当前Tab ( 仅用于预览效果 )" prop="type">
					<RadioGroup v-model="formItem.currTab">
						<Radio v-for="(citem,cindex) in formItem.activityGroup" :key="cindex" :label="'tab'+cindex">{{ citem.name }}</Radio>
					</RadioGroup>
				</FormItem>
				
				<FormItem label="活动分组（只有一个分组时，不会显示Tab头）">
					<draggable ghost-class="ghost" :list="formItem.activityGroup" :group="{name:'activityGroup'}" handle=".handle_group"
					 v-bind="dragOptions" @start="dragStart" @end="dragEnd" @change="dragChange">
				
						<Card v-for="(item,index) in formItem.activityGroup" :name="index" :key="index" class="group-item-list" 
						@click.native="cardClick(index)">
							<Icon type="ios-close-circle" class="close" title="移除" @click.stop="removeGroup(index)" />
							<Icon type="md-apps" class="handle_group" title="拖拽排序" />

							<div style="padding:5px 0 0 10px;">
								<span>分组#{{index+1}} 名称 </span>
								<Input v-model="item.name" placeholder="请输入分组标题" style="width:230px;margin-left:5px;" 
								size="small" maxlength="8" show-word-limit></Input>
							</div>
							<div style="padding:5px 0 0 10px;">
								<span style="margin-right:25px;">选择商品</span>
								<RadioGroup v-model="item.goodsListType">
									<Radio label="auto">自动</Radio>
									<Radio label="manual">手动</Radio>
								</RadioGroup>
							</div>
							<div v-if="item.goodsListType == 'manual' ">
								<!--指定商品的列表-->
								<goodsItemForm :currIndex="currIndex" :groupIndex="index" @on-change="onGoodsListChange"></goodsItemForm>
							</div>
							<div v-else-if=" item.goodsListType == 'auto' " style="padding:5px 10px 10px 10px;">
								<div>
									<span>自动取商品数 </span>
									<InputNumber v-model="item.show_num" :max="30" :min="1" size="small"></InputNumber>
									<span>( 最大30 )</span>
								</div>
							</div>
						</Card>
					</draggable>
				</FormItem>
				<div style="width:350px;text-align:center;">
					<Button @click="handleSeckillSelect" icon="md-add" long>选择秒杀活动</Button>
				</div>
			</div>
		</Form>
		
		<!--统一内容显示开关-->
		<activityContentSwitchForm :currIndex="currIndex"></activityContentSwitchForm>

		<!--统一活动头-->
		<activityHeaderForm :currIndex="currIndex" headerTitle="秒杀"></activityHeaderForm>
	</div>
</template>

<script>
	/**
	 * 秒杀组件
	 */
	import titleBar from '@/views/my-components/title-bar/title-bar';
	import draggable from "vuedraggable";
	import activityHeaderForm from './activity-header-form';
	import activityContentSwitchForm from './activity-content-switch-form.vue';
	import goodsItemForm from './secKill-form-goods-item.vue';
	import SeckillSelect from '@/views/my-components/list-component/index-edit';
	
	export default {
		name: 'secKillForm',
		components: {
			titleBar,
			draggable,
			activityHeaderForm,
			activityContentSwitchForm,
			goodsItemForm,
			SeckillSelect
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
					activityGroup:[]
				},

				dataList: [],

				// 表单数据规则
				ruleValidate: {},
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

				// 初始化
				if ( typeof(this.formItem.activityGroup) == 'undefined' ) {
					this.$set( this.formItem, 'layout', 'two');
					this.$set( this.formItem, 'open_slide', false );
					this.$set( this.formItem, 'gutter', 0 );
					this.$set( this.formItem, 'activityGroup', []);
					this.$set( this.formItem, 'tag', '' );
					this.$set( this.formItem, 'currTab', 'tab0' );
				}
			},
			handleSeckillSelect(){
				this.$selectContent({
					mode: 'seckill',
					type: 'radio',
					data: this.formItem.seckillData,
					getList: (data) => {
						let currActivityId = [];
						this.formItem.activityGroup.forEach( (item)=>{
							currActivityId.push( item.activity_id );
						});
						
						if( currActivityId.length == 0 || currActivityId.indexOf( data[0].id ) == -1 ){
							this.formItem.activityGroup.push({
								name: data[0].name,
								activity_id: data[0].id, // 活动ID
								goodsListType: 'auto', // 默认是自动获取活动列表
								goodsList: [],
								show_num: 8,
							});
						}
						else{
							this.$Message.error("活动已选过了！");
						}
					}
				})
			},
			// 移除分组
			removeGroup(index) {
				this.$Modal.confirm({
					title: '操作提示',
					content: '确定删除分组吗？',
					okText: '确定',
					cancelText: '取消',
					onOk: () => {
						this.$delete(this.formItem.goodsGroup, index);
					},
				});
			},
			// 指定商品列表的变动，回调
			onGoodsListChange(obj) {
				this.$set(this.formItem.activityGroup[obj.groupIndex], 'goodsList', obj.data);
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

<style lang="less">
	.sec-kill-form {
		padding: 5px;
		
		.goods-list-box{
			background-color: #efefef;
			padding:8px 5px 5px 5px;
			border-radius: 5px;
		}
		
		.group-item-list{
			border-radius: 5px;
			margin-bottom:12px;
			margin-right:10px;
			position: relative;
			padding:0px;
			background: #fff;
			font-size:13px;
		
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
		.ghost {
			opacity: 0.5;
			background: #eee;
		}
	}
</style>