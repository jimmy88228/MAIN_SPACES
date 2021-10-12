<style lang="less">
.page-setting-weixin{
	padding: 10px;
	
	.ivu-color-picker{
		.ivu-select-dropdown{
			z-index: 1000;
		}
	}
	
	.image-box{
		width: 75px;
		height:75px;
		line-height:75px;
		border: 1px solid #eee;
	    border-radius: 5px;
	    text-align: center;
	    cursor: pointer;
	    background: center center no-repeat;
	    background-size: 100% auto;
	    margin-right:5px;
	    position: relative;
		
		.close{
			position: absolute;
			top: -8px;
			right: -8px;
      line-height:1;
		}
	}
}	
</style>
	
<template>
	<div class="page-setting-weixin">
		<Divider>微信分享设置</Divider>
		
		<Form ref="formValidate" :model="formItem" :rules="ruleValidate" label-position="top">
			<FormItem label="微信分享标题" prop="name">
				<Input v-model="formItem.wx_share_title" placeholder="请输入微信分享标题" maxlength="30" show-word-limit></Input>
			</FormItem>
			<FormItem label="微信分享详情" prop="page_desc">
				<Input v-model="formItem.wx_share_desc" placeholder="请输入微信分享详情" type="textarea" maxlength="100" show-word-limit :rows="3"></Input>
			</FormItem>
			<FormItem label="微信分享图片">
				<div class="image-box" 
				:style=" formItem.wx_share_image != '' ? 'background-image: url('+formItem.wx_share_image+');' : '' " 
				@click="selectImage('wx_share_image')">
					<Icon 
					v-if=" typeof(formItem.wx_share_image) == 'undefined' || formItem.wx_share_image == '' || formItem.wx_share_image == null " 
					type="md-add" 
					size="25" />
					<Icon v-else type="md-close-circle" color="#f00" size="22" class="close" @click.stop="removeImage"/>
				</div>
			</FormItem>
			<FormItem label="微信海报图片">
				<div class="image-box" 
				:style=" formItem.wx_poster_image != '' ? 'background-image: url('+formItem.wx_poster_image+');' : '' " 
				@click="selectImage('wx_poster_image')">
					<Icon 
					v-if=" typeof(formItem.wx_poster_image) == 'undefined' || formItem.wx_poster_image == '' || formItem.wx_poster_image == null " 
					type="md-add" 
					size="25" />
					<Icon v-else type="md-close-circle" color="#f00" size="22" class="close" @click.stop="removePoster"/>
				</div>
			</FormItem>
		</Form>
		
		<!--用户图片管理组件-->
		<userImages ref="user-images" @on-return-url="returnImageUrl"></userImages>
	</div>
</template>	

<script>
import userImages from '@/views/my-components/user-images/user-images';
	
/**
 * 微信分享设置 
 */
export default {
	name: 'pageSettingWeixin',
	components: {
		userImages,
	},
	props:{
		currIndex:{
			type: [Number,String],
			default: 0,
		},
	},
	data () {
	    return {
			formItem:{
				wx_share_title: '',
				wx_share_desc: '',
				wx_share_image: '',
				wx_poster_image: '',
			},
			
			// 表单数据规则
			ruleValidate:{
			},
		}
	},
	methods: {
		// 初始化
		init(){
			setTimeout(()=>{
				// 双向绑定store 的数据
				this.formItem = this.$store.state.app.pageInfo;
			}, 5000);
		},
		// 选择图片（单选）
		selectImage( name ){
			this.$refs['user-images'].showModal( {
				name: name, 
				multi:0, 
				selectedImages: [], 
			});
		},
		// 图片选择组件的回调
		returnImageUrl( obj ){
			this.$set(this.formItem, obj.name, obj.val );
		},
		// 清除图片
		removeImage(){
			this.$Modal.confirm({
				title: '操作提示',
				content: '确定清除分享图片吗？',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					this.$set( this.formItem, 'wx_share_image', '' );
				},
			});
		},
		// 清除海报
		removePoster(){
			this.$Modal.confirm({
				title: '操作提示',
				content: '确定清除海报图片吗？',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					this.$set( this.formItem, 'wx_poster_image', '' );
				},
			});
		}
	},
	watch:{
		
	},
	mounted () {
		this.init();
	},
}
</script>	