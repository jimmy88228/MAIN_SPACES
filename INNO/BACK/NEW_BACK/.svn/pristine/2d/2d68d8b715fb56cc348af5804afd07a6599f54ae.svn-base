<style lang="less">
.feedback-info{
	.feedback-steps{
		width: 80%;
		position: absolute;
		left: 100px;
		top: 15px;
	}
}	
</style>

<template>
	<div class="feedback-info">
		<Card v-show="modalShow" :dis-hover="isInner==1?true:false">
			<div slot="title">
				<Tooltip content="返回" placement="bottom-start">
					<Icon v-if="isInner==0" type="ios-arrow-dropleft" @click="goBack" style="cursor: pointer;" size="28"/>
				</Tooltip>
				
				<Steps :current="info.fb_status" class="feedback-steps">
					<Step title="已提交" content=""></Step>
					<Step title="已受理" content=""></Step>
					<Step title="已处理" content=""></Step>
					<Step title="已确认" content=""></Step>
					<Step title="已评价" content=""></Step>
					<Step title="已关闭" content=""></Step>
				</Steps>
			</div>
			
			<!--工单详情列表-->
			<feedbackInfoBox :info="info" :statusList="statusList" @on-change="reloadTalkList"></feedbackInfoBox>
			
			<!--聊天内容框-->
			<feedbackTalkList ref="talk-list" :info="info"></feedbackTalkList>
				
			<div class="form-footer-button-box">
				<Button v-if="isInner==0" @click="goBack">取消</Button>
				<Button type="primary" @click="onReply">回复</Button>
			</div>
		</Card>	
		
		<!--回复表单组件-->
		<replyForm ref="reply-form" @on-save="onFormSave"></replyForm>
		
		<!--加载提示-->
		<Spin size="large" fix v-if="spinShow"></Spin>
	</div>	
</template>

<script>
import util from '@/libs/util.js';
import replyForm from './reply-form';
import feedbackInfoBox from './feedback-info-box';
import feedbackTalkList from './feedback-info-talk-list';

export default {
	name: 'feedbackInfo',
    components: {
		replyForm,
		feedbackInfoBox,
		feedbackTalkList,
	},
	props:{
		// 是否内嵌在modal
		isInner:{
			type:Number,
			default: 0,
		}
	},
	data() {
		return{
			// 模态框
			modalShow: false,
			modalEditIndex: '',
			spinShow: false,
			
			statusList:[],
			info:{},
		}
	},
	methods: {
		// 外部 初始化组件方法
		initSet ( res ) {
			this.statusList = res.data.statusList;
		},
		// 返回列表
		goBack(){
			this.modalShow = false;
			this.$emit('on-close', {});
		},
		// 打开模态框
		openModal (index, row){
			this.modalEditIndex = index;
			this.modalShow = true;
			this.info = row;
			
			// 初始化组件
			this.$nextTick(()=>{
				this.$refs['talk-list'].initData();
			});
		},
		// 打开回复的表单
		onReply(){
			this.$refs['reply-form'].openModal( this.info.id );
		},
		// 回复表单的回调
		onFormSave( obj ){
			// 把返回的数据push 到历史数组
			this.$refs['talk-list'].pushList( obj );
		},
		// 重新加载回复列表
		reloadTalkList(){
			this.$refs['talk-list'].initData();
		},
	},
}
</script>