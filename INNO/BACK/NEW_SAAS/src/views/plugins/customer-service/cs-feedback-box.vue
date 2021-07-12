<style lang="less">
.cs-feedback-box{
	.ivu-cell-title{
		font-size: 13px;
	}
}	
</style>

<template>
	<div class="cs-feedback-box">
		<div v-if="sessInfo.get_user_info != null">
			<Row type="flex" style="padding:0 15px;font-size:12px;">
				<Col style="flex:1 1 0%;">客服工单</Col>
				<Col style="width:70px;text-align: right;">
					<a href="#" @click.prevent="addFeedback" style="margin-right:5px;">新建</a>
					<a href="#" v-if="dataList.length >0 " @click.prevent="moreFeedback">更多</a>
				</Col>
			</Row>
			
			<CellGroup :style="{height: dataList.length > 0 ? '250px' : '5px'}">
				<vue-scroll ref="vue-scroll" :ops="scrollOptions">
					<Cell v-for="(item, index) in dataList" :key="index" 
					:label="item.created_at_format"
					@click.native="viewInfo(index,item)">
						<div class="clamp" style="width:150px;">
							{{item.fb_content}}
						</div>
						<div slot="extra">
							<Tag :color="item.fb_status_color" @click.native="viewInfo(index,item)">{{item.fb_status_format}}</Tag>
							<div class="clamp" style="width:50px;font-size:12px;text-align:center;">{{item.get_handler_info != null ? item.get_handler_info.name : '未指派'}}</div>
						</div>	
					</Cell>
				</vue-scroll>
			</CellGroup>
			
			<div v-if="dataList.length ==0 " style="text-align: center;padding:10px;">暂无工单</div>
			<!--加载提示-->
			<Spin size="large" fix v-if="spinShow" style="z-index:1000"></Spin>
		</div>
		
		<!--添加客服的表单组件-->
		<csFeedbackForm ref="cs-feedback-form" @on-save="loadData"></csFeedbackForm>
		
		<Modal footer-hide
		    v-model="modalShow"
			width="840"
		    :loading="modalLoading"
			:styles="{top: '20px'}"
			@on-visible-change="onModalChange">
			<feedbackInfo ref="feedback-info" :isInner="1"></feedbackInfo>
		</Modal>
	</div>
</template>

<script>
import csFeedbackForm from './cs-feedback-form';
import feedbackInfo from '@/views/plugins/user-feedback/feedback-info.vue';

/**
 * 客服工单框组件
 */	
export default {
	name: 'csFeedbackBox',
    components: {
		csFeedbackForm,
		feedbackInfo,
	},
	data () {
	    return {
			// 会话详情
			sessInfo:{
				get_user_info: null
			},
			dataList:[],
			catTree:[],
			levelList: [],
			
			// 模态框
			modalShow: false,
			modalLoading: false,
			
			spinShow: false,
			
			// 虚拟滚动条
			scrollOptions:{
				mode: 'native',
				bar:{
					keepShow: true,
					background: '#c8c8c8',
					size:'3px',
				},
				// 滚动轨道
				rail:{
					size:'3px',
				},
				scrollPanel:{
					scrollingX:false,
				}
			},
		}
	},
	methods: {
		init(){
			
		},
		// 加载工单列表
		loadData(){
			this.spinShow = true;
			// ajax 请求获取数据
			this.$ajax.post( this.$api.feedbackList, {
				content_types: [5], // 绑定是5 （客服人员报的工单）
				user_id: this.sessInfo.user_id,
			})
			.then( (response) => {
				this.spinShow = false;
				var res = response.data;
				if( res.code ){
					this.dataList = res.data.items;
					this.catTree = res.data.catTree;
					this.levelList = res.data.levelList;
					
					this.$refs['feedback-info'].initSet ( res );
				}
			});
		},
		// 添加工单
		addFeedback(){
			this.$refs['cs-feedback-form'].openModal( this.sessInfo, this.catTree, this.levelList );
		},
		// 更多工单
		moreFeedback(){
			window.open('/plugins/cs-comment-task');
		},
		viewInfo( index, row ){
			this.modalShow = true;
			this.$refs['feedback-info'].openModal(index, row);
		},
		onModalChange( visible ){
			if( visible == false ){
				this.loadData();
			}
		},

	},
	mounted () {
	    this.init();
	},
	watch:{
		'$store.state.app.selectedCsSession' ( to ){
			this.sessInfo = to;
			this.loadData();
		}
	}
}
</script>