<style lang="less">
.text-scroll-form{
	padding:5px;
	
	.item-list{
		border-radius: 5px;
		margin-bottom:12px;
		margin-right:10px;
		position: relative;
		padding:5px;
		background: #fff;
		box-shadow: 0 0 4px 0 rgba(10,42,97,.2);
		
		.close{
			position: absolute;
			right:-10px;
			top:-10px;
			font-size: 10px;
			cursor: pointer;
			display:none;
			color:red;
			font-size: 22px;
			z-index: 10;
		}
		.handle_text{
			position: absolute;
			right:25px;
			top:-10px;
			font-size: 10px;
			cursor: move;
			display:none;
			color: #2d8cf0;
			font-size: 22px;
			z-index: 10;
		}
		&:hover{
			.close, .handle_text{
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
	<div class="text-scroll-form">
		<titleBar>文字滚动组件 设置</titleBar>
		
		<Form ref="formValidate" :model="formItem" :rules="ruleValidate" label-position="top">
			<FormItem label="滚动方向">
				<RadioGroup v-model="formItem.option.direction">
					<Radio :label="0">往下</Radio>
					<Radio :label="2">往左</Radio>
					<Radio :label="1">往上</Radio>
					<Radio :label="3">往右</Radio>
				</RadioGroup>
			</FormItem>
			<FormItem label="文字大小">
				<Slider v-model="formItem.fontSize" :min="14" :max="30" show-input style="margin:0 30px 0 10px;"></Slider>
			</FormItem>	
			<FormItem label="颜色主题">
				<RadioGroup v-model="formItem.type">
					<Radio label="none">默认</Radio>
					<Radio label="primary">蓝色</Radio>
					<Radio label="success">绿色</Radio>
					<Radio label="error">红色</Radio>
					<Radio label="warning">橙色</Radio>
				</RadioGroup>
			</FormItem>
			<FormItem label="在下面时间段内显示公告">
				<div>
				开始时间：<DatePicker
					v-model="formItem.startTime"
					:options="timeLimitOptions"
					type="datetime"
					placeholder="请输入开始时间" transfer
					@on-change="startTimeChange"></DatePicker>
				</div>	
				
				<div>
				结束时间：<DatePicker
					v-model="formItem.endTime"
					:options="timeLimitOptions"
					type="datetime"
					placeholder="请输入结束时间" transfer
					@on-change="endTimeChange"></DatePicker>	
				</div>	
			</FormItem>	
			<FormItem label="显示左侧图标">
				<i-switch v-model="formItem.showIcon" size="large">
					<span slot="open">显示</span>
					<span slot="close">隐藏</span>
				</i-switch>
			</FormItem>	
			<FormItem label="文本内容" style="padding:0 5px;">
				<draggable
					ghost-class="ghost"
					:list="formItem.textList"
					:group="{name:'textList'}"
					handle=".handle_text"
					v-bind="dragOptions"
					@start="dragStart"
					@end="dragEnd"
					@change="dragChange">
					
					<div v-for="(item,index) in formItem.textList" :name="index" :key="index" class="item-list">
						<Icon type="ios-close-circle" class="close" title="移除" @click="removeItem(index)" />
						<Icon type="md-apps" class="handle_text" title="拖拽排序" />
						
						<Row :gutter="0">
							<Col span="6">
								<i-switch v-model="item.is_enable" size="large" style="margin-top:22px;">
									<span slot="open">显示</span>
									<span slot="close">隐藏</span>
								</i-switch>
							</Col>
							<Col span="18">
								<div>
									<Input v-model="item.text" size="small" placeholder="文本内容" type="textarea" :rows="3" style="width:100%;" />
								</div>
							</Col>
						</Row>
					</div>
				</draggable>
				
				<Button long @click="addText">
					<Icon type="md-add" size="18" style="margin-right:5px;"></Icon>添加文本（可以添加多行）
				</Button>
			
			</FormItem>	
		</Form>	
	</div>
</template>

<script>
/**
 * 文字滚动组件
 */
import titleBar from '@/views/my-components/title-bar/title-bar';
import draggable from "vuedraggable";

export default {
	name: 'textScrollForm',
	components: {
		titleBar,
		draggable,
	},	
	props:{
		currIndex:{
			type: [Number,String],
			default: 0,
		}
	},
	data () {
	    return {
			formItem:{
				option:{
					direction: 2, // 滚动方向：0 往下 1 往上 2 向左 3 向右
					limitMoveNum:2,
				},
				showIcon: true,
				type: 'none',
				fontSize: 14,
				textList:[],
			},
			
			// 表单数据规则
			ruleValidate:{},
			
			timeLimitOptions: {
				disabledDate(date) {
					return date && date.valueOf() < Date.now() - 86400000;
				}
			},
							
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
		// 初始化
		init(){
			// 双向绑定store 的数据
			this.dataList = this.$store.state.app.pageCompList;
			this.formItem = this.dataList[ this.currIndex ].setting;

			if( typeof( this.formItem.textList ) == 'undefined' ){
				this.$set(this.formItem, 'textList', [] );
				this.$set(this.formItem, 'showIcon', true );
				this.$set(this.formItem, 'type', 'none' );
				this.$set(this.formItem, 'startTime', '' );
				this.$set(this.formItem, 'endTime', '' );
				this.$set(this.formItem, 'fontSize', 14 );
				this.$set(this.formItem, 'option', {
					direction: 2,
					limitMoveNum: 2,
				});
			}
			if( this.formItem.textList.length == 0 ){
				// 要两个以上才会滚动
				this.formItem.textList = [{
					is_enable: true,
					text: '请在这里输入滚动的文本。。。'
				},{
					is_enable: true,
					text: '请在这里输入滚动的文本。。。'
				}];
			}
		},
		addText(){
			this.formItem.textList.push({
				is_enable: true,
				text: ''
			});
		},
		// 删除项
		removeItem( index ){
			this.$Modal.confirm({
				title: '操作提示',
				content: '确定移除吗？',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					this.$delete( this.formItem.textList, index );
				},
			});
		},
		startTimeChange( val ){console.log(val);
			this.formItem.startTime = val;
		},
		endTimeChange( val ){console.log(val);
			this.formItem.endTime = val;
		},
		dragChange(){
			
		},
		// 拖动开始
		dragStart( e ){
			this.drag = true;
		},
		// 拖动结束
		dragEnd( e ){
			this.drag = false;
		},
	},
	watch:{
		'currIndex' (to){
			this.init();
		}
	},
	mounted () {
		this.init();
	},
}
</script>