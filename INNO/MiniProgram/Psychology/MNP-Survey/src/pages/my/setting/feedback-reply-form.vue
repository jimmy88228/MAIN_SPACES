<template>
	<view>
		<u-popup v-model="showPopup" mode="bottom" closeable>
			<u-card title="反馈回复" :border="false">
				<view slot="body">

					<u-form ref="uForm" :model="form" :error-type="errorType">
						
						<u-form-item label="" label-width="40" prop="fb_content" left-icon="edit-pen">
							<u-input v-model="form.fb_content" type="textarea" border />
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
		</u-popup>
	</view>	
</template>

<script>
export default {
	components: {

	},
	data() {
		return {
			showPopup: false,
			btnDisable: false,
			feedbackId: 0,
			
			uploadUrl: '',
			hasFile:false,
			form:{
				fb_content: '',
				fb_images: [],
			},
			rules: {
				fb_content: [{ required: true, message: '内容不能为空', trigger: ['blur'],}],
			},
			errorType:['toast','border-bottom'],
		};
	},
	methods:{
		openPopup( feedbackId ){
			this.uploadUrl = this.$util.getUploadUrl( this );
			this.showPopup = true;
			this.feedbackId = feedbackId;
			
			this.form.fb_content = '';
			this.form.fb_images = [];
		},
		// 提交表单
		formSubmit(){
			this.$refs['uForm'].setRules(this.rules);
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
			this.$u.post( this.$api.feedBackReplyAdd, {
				feedback_id: this.feedbackId,
				content: this.form.fb_content,
				images: this.form.fb_images.join(','),
			})
			.then( (response) => {
				// 解锁按钮
				this.btnDisable = false;
				this.$util.hideLoading();
				var res = response.data;
				if( res.code ){
					this.$u.toast( '提交成功，谢谢您的支持' );
					
					this.showPopup = false;
					this.$emit('on-success', {});
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

</style>