<style lang="less">
.ad-form{
	padding:5px;
	
	.images-list-box{
		background-color: #efefef;
		padding:8px 5px 5px 5px;
		border-radius: 5px;
		
		.ivu-form-item{
			margin-bottom: 5px;
		}
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
	.ghost {
		opacity: 0.5;
		background: #eee;
	}
}
</style>

<template>
	<div class="ad-form">
		<titleBar>会员卡片组件 设置</titleBar>

		<Form ref="formValidate" :model="formItem" label-position="top">

			<FormItem label="一列展示图片数量" >
				<RadioGroup v-model="formItem.row" @on-change="changeRow">
					<Radio :label="1">1张</Radio>
					<Radio :label="2">2张</Radio>
				</RadioGroup>
			</FormItem>
			<FormItem label="登录状态">
				<RadioGroup v-model="formItem.login_status" @on-change="changeLoginState">
					<Radio label="1">仅登录</Radio>
					<Radio label="2">登录+非登录</Radio>
				</RadioGroup>
			</FormItem>
			<FormItem label="图片间距（有背景色的情况下，间距效果会更佳）">
				<Slider v-model="formItem.gutter" :min="0" :max="30" show-input style="margin:0 30px 0 10px;"></Slider>
			</FormItem>

			<div class="images-list-box">
				<FormItem v-if="formItem.imagesGroup != null && formItem.imagesGroup.length > 1 " 
				label="切换当前Tab ( 仅用于预览效果 )">
					<RadioGroup v-model="formItem.currTab">
						<Radio v-for="(citem,cindex) in formItem.imagesGroup" :key="cindex" :label="'tab'+cindex">{{ citem.name }}</Radio>
					</RadioGroup>
				</FormItem>
				
				<FormItem label="卡片分组( 只有一个分组时，不会显示Tab头 )">
					<draggable ghost-class="ghost" :list="formItem.imagesGroup" :group="{name:'imagesGroup'}" handle=".handle_group"
					 v-bind="dragOptions" @start="dragStart" @end="dragEnd" @change="dragChange">
					
						<Card v-for="(item,index) in formItem.imagesGroup" :name="index" :key="index" class="group-item-list" 
						@click.native="cardClick(index)">
							<Icon type="ios-close-circle" class="close" title="移除" @click.stop="removeGroup(index)" />
							<Icon type="md-apps" class="handle_group" title="拖拽排序" />
					
							<div style="padding:5px 0 0 10px;">
								分组#{{index+1}} 名称 
								<Input v-model="item.name" placeholder="请输入分组标题" style="width:180px;margin-left:5px;" 
								size="small" maxlength="8" show-word-limit></Input>
							</div>
							
							<!--图片列表-->
							<userCardItemForm :currIndex="currIndex" :groupIndex="index" @on-change="onImagesListChange"></userCardItemForm>
							
						</Card>
					</draggable>
					
					<!-- <div style="width:350px;text-align:center;">
						<Button icon="md-add" long type="primary" @click="addGroup">添加卡片分组</Button>
					</div> -->
				</FormItem>
			</div>
		</Form>

	</div>
</template>

<script>
	/**
	 * 用户卡片小工具
	 */
	import draggable from 'vuedraggable';
	import titleBar from '@/views/my-components/title-bar/title-bar';
	import userCardItemForm from './user-card-form-item.vue';
	
	export default {
		name: 'userCardForm',
		components: {
			draggable,
			titleBar,
			userCardItemForm
		},
		props: {
			currIndex: {
				type: [Number, String],
				default: 0
			}
		},
		data() {
			return {
				formItem: {
					type: 't1',
					row: 1,
					gutter: 0,
					currTab: 'tab0',
					imagesGroup: [],
				},

				dataList: [],
				drag: false
			}
		},
		computed: {
			dragOptions() {
				return {
					animation: 200,
					group: 'description',
					disabled: false,
					ghostClass: 'ghost'
				};
			}
		},
		methods: {
			// 初始化
			init() {
				// 双向绑定store 的数据
				this.dataList = this.$store.state.app.pageCompList;
				this.formItem = this.dataList[this.currIndex].setting;

				if (typeof(this.formItem.login_status) == 'undefined') {
					this.$set(this.formItem, 'login_status', '1');
					this.$set(this.formItem, 'row', 1);
					this.$set(this.formItem, 'imagesGroup', [{
						name:'',
						images:[
							{title:'',tag:'',},
							{title:'',tag:'',},
						],
					}]);
					this.$set(this.formItem, 'currTab', 'tab0' );
				}

			},
			// // 添加分组
			// addGroup() {
			// 	this.formItem.imagesGroup.push({
			// 		name: '分组名',
			// 		images: [],
			// 	});
			// },
			// 移除分组
			removeGroup(index) {
				this.$Modal.confirm({
					title: '操作提示',
					content: '确定删除分组吗？',
					okText: '确定',
					cancelText: '取消',
					onOk: () => {
						this.$delete(this.formItem.imagesGroup, index);
						
					},
				});
			},
			changeRow(val){
				let imagesGroup = this.formItem.imagesGroup || [];
				let login_status = this.formItem.login_status || 1;
				for(let i = 0; i < imagesGroup.length; i++){
					let images = imagesGroup[i].images || [];
					if(val > images.length){
						images.push({
							title:'',
							tag:''
						})
					} else if(val < images.length){
						let len = images.length - parseInt(val);
						images.splice(-1, len);
					}
				}
			},
			changeLoginState(){
				
			},
			
			// 指定广告图片列表的变动，回调
			onImagesListChange(obj){console.log(obj);
				this.$set(this.formItem.imagesGroup[obj.groupIndex], 'images', obj.data);
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
			}
		},
		watch: {
			'currIndex'(to) {
				this.init();
			}
		},
		mounted() {
			this.init();
		}
	}
</script>
