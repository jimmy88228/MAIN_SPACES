<style lang="less">
.info-box{

	.img-box{
		background: center center no-repeat;
		background-size:100% auto;
		margin-top: 5px;
		margin-right: 5px;
		width: 40px;
		height: 40px;
		cursor: pointer;
		float: left;
		border: 1px solid #eee;
	}
	
	.ivu-form-item{
		margin-bottom: 5px;
	}
	
	.content-box{
		padding:10px 0;
		text-align: left;
		width:300px;
	}
}	
</style>
	
<template>
	<div class="info-box">
		<Form :label-width="90">
			
			<Row :gutter="10">
				<Col :span="8">
			        <FormItem label="问题描述" >
			        	<div class="clamp2" style="line-height:1.8;">
							<Tag type="border" :color="info.content_type==1?'success':'error'">{{info.content_type_format != '' ? info.content_type_format : '未分类'}}</Tag>
							{{info.fb_content}}
						</div>
			        </FormItem>
				</Col>
				<Col :span="8">
					<FormItem label="图片">
						<template v-if=" typeof(info.fb_images) != 'undefined' && info.fb_images.length > 0 ">
							<div v-for="(item,index) in info.fb_images" :key="index" 
							class="img-box"
							:style="{'background-image':'url('+item+')'}"
							@click="showImage(item)"></div>
						</template>
						<template v-else>
							无
						</template>
					</FormItem>	
				</Col>
				<Col :span="8">
					<FormItem label="工单编号">
			        	{{info.code}}
			        </FormItem>
				</Col>	
			</Row>	
			<Row :gutter="10">	
				<Col :span="8">
					<FormItem label="提交时间">
				    	{{info.created_at_format}}
				    </FormItem>
				</Col>
				
				<Col :span="8">
					<FormItem label="工单状态">
				    	<Tag v-if="info.fb_status != null" :color="statusList[ info.fb_status ]['color']">{{statusList[ info.fb_status ]['name']}}</Tag>
						
						<Poptip v-model="showPoptip" placement="right">
							<Icon type="ios-create-outline" size="16" style="margin-left: 5px;cursor:pointer" @click="openPop"></Icon>
							<div slot="content" class="content-box">
								<!--状态修改表单-->
								<feedbackStatusForm 
								ref="feedback-status-form"
								:fbId="info.id"
								:fbStatus="info.fb_status" 
								@on-success="onStatusCallback" 
								@on-cancel="onCancel">
								</feedbackStatusForm>
							</div>
						</Poptip>
						
				    </FormItem>
				</Col>
				
				<Col :span="8">
					<FormItem label="手机号">
				    	{{info.mobile}}
              <span v-if="info.user_info !=null && info.user_info.card_num !='' ">(卡号：{{info.user_info.card_num}})</span>
				    </FormItem>
				</Col>
			</Row>
			
		</Form>	
	</div>
</template>	

<script>
import util from '@/libs/util.js';
import feedbackStatusForm from './feedback-status-form.vue';

export default {
	name: 'feedbackInfoBox',
    components: {
		feedbackStatusForm,
	},
	props:{
		info:{
			type:Object,
			default:()=>{}
		},
		statusList:{
			type:Array,
			default:()=>[],
		}
	},
	data() {
		return{
			showPoptip: false,
		}
	},
	methods: {
		openPop(){
			this.$refs['feedback-status-form'].initData();
		},
		// 保存状态的回调
		onStatusCallback( val ){
			this.info.fb_status = val;
			
			this.showPoptip = false;
			this.$emit('on-change');
		},
		onCancel(){
			this.showPoptip = false;
		},
		// 查看大图
		showImage( imgSrc ){
			util.viewImage( imgSrc, this );
		}
	},
}
</script>		