<template>
	<view class="container">
		<global-com></global-com>
		
		<u-card title="意见反馈" :thumb="thumbnail">
			<view slot="body">
				<view class="feedback-tips">请描述你遇到的具体问题，越详细越好。请尽量描述清楚操作页面与流程、设备等信息。若有相应截图，那就更完美了。</view>
				
				<u-form ref="uForm" :model="form" :error-type="errorType">
					
					<u-form-item label="" label-width="40" prop="fb_content" left-icon="edit-pen">
						<u-input v-model="form.fb_content" type="textarea" border />
					</u-form-item>
					<u-form-item label="" label-width="40" prop="mobile" left-icon="phone">
						<u-input v-model="form.mobile" border placeholder="如果有需要,可以留下联系电话"/>
					</u-form-item>
					<u-form-item label="" label-width="0">
						<u-upload 
						ref="uUpload" 
						:action="uploadUrl" 
						:size-type="['compressed']"
						width="180" 
						:max-count="3"
						:auto-upload="false"
						@on-list-change="onListChange"
						@on-progress="onProgress"
						@on-uploaded="onUploaded">
						</u-upload>
					</u-form-item>
					<u-button :disabled="btnDisable" type="primary" @click="formSubmit">提交</u-button>
				</u-form>
			</view>
		</u-card>
	</view>	
</template>

<script>
export default {
	components: {

	},
	data() {
		return {
			thumbnail:'',
			btnDisable: false,
			content_type: 3,
			
			// 会话ID，针对客服的反馈使用
			session_id: 0,
			
			uploadUrl: '',
			hasFile:false,
			form:{
				fb_content: '',
				mobile:'',
				fb_images: [],
			},
			rules: {
				fb_content: [{ required: true, message: '内容不能为空', trigger: ['blur'],}],
			},
			errorType:['toast','border-bottom'],
		};
	},
	onReady(){
		this.$refs['uForm'].setRules(this.rules);
	},
	onLoad( options ) {
		this.content_type = typeof(options.content_type) != 'undefined' ? options.content_type : 3;
		this.session_id = typeof(options.session_id) != 'undefined' ? options.session_id : 0;
		
		this.init();
	},
	methods:{
		init(){
			this.thumbnail = this.$util.apiHost + '/../assets/images/feedback.png';

			this.uploadUrl = this.$util.getUploadUrl( this );
			
			if( this.session_id > 0 ){
				// 判断客服会话的反馈是否已经评论过了
				this.$util.showLoading(this);
				this.$u.post( this.$api.feedBackHasSession, {
					session_id: this.session_id,
				})
				.then( (response) => {
					this.$util.hideLoading();
					var res = response.data;
					if( res.code ){
						uni.redirectTo({
							url: '/pages/my/setting/feedback-info?id='+res.data,
						});
					}
				});	
			}
		},
		// 提交表单
		formSubmit(){
			this.$refs['uForm'].validate( valid => {
				//进行表单检查
				if( valid ){
					// 先清空图片
					this.form.fb_images = [];
					
					// 如果有图片，先上传图片
					if( this.hasFile ){
						this.$refs.uUpload.upload();
					}
					else{
						this.postData();
					}
				}
			});
		},	
		// 发送数据
		postData(){
			this.$util.showLoading(this);
			this.btnDisable = true;
			this.$u.post( this.$api.feedBackAdd, {
				fb_content: this.form.fb_content,
				fb_images: this.form.fb_images,
				mobile: this.form.mobile,
				content_type: this.content_type,
				session_id: this.session_id,
			})
			.then( (response) => {
				// 解锁按钮
				this.btnDisable = false;
				this.$util.hideLoading();
				var res = response.data;
				if( res.code ){
					this.$u.toast( '提交成功，谢谢您的支持' );
			
					setTimeout(()=>{
						uni.redirectTo({
							url: '/pages/my/setting/feedback-info?id='+res.data,
						});
					}, 3500);
				}
				else{
					this.$u.toast(res.message);
				}
			});	
		},
		inputChange(e){
			const key = e.currentTarget.dataset.key;
			this[key] = e.detail.value;
		},
		// 上传文件变动
		onListChange( list ){
			this.hasFile = list.length > 0 ? true : false;
		},
		// 上传中
		onProgress(){
			this.btnDisable = true;
		},
		// 全部图片上传完毕
		onUploaded( lists ){
			this.btnDisable = false;
			
			for(var i in lists){
				this.form.fb_images.push( lists[i].response.data );
			}
			// 发送评论内容的数据
			this.postData();
		},
	},
	
}	
</script>

<style lang="scss">
page,.container{
	background: $page-color-base;
}

.feedback-tips{
	font-size:$font-base;
}
</style>