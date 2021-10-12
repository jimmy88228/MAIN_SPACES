<style lang="less">
.page-setting-lottery-form{
	padding: 10px;
	
	.ivu-color-picker{
		.ivu-select-dropdown{
			z-index: 1000;
		}
	}
	.form-row{
		padding:0px 20px;
	}
	.image-box{
		flex-shrink: 0;
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
		}
	}
}
</style>
	
<template>
	<div class="page-setting-lottery-form">
		<Divider>规则活动设置</Divider>
		
		<Form ref="formValidate" :model="formItem.setting" label-position="top">
			<FormItem label="规则图">
				<div class="flex f-just-between f-align-center form-row">
					<div class="image-box" 
					:style=" formItem.setting.rule.img != '' ? 'background-image: url('+formItem.setting.rule.img+');' : '' " 
					@click="selectImage('rule')">
						<Icon 
						v-if=" typeof(formItem.setting.rule.img) == 'undefined' || formItem.setting.rule.img == '' || formItem.setting.backgroundImage == null " 
						type="md-add" 
						size="25" />
						<Icon v-else type="md-close-circle" color="#f00" size="22" class="close" @click.stop="removeImage('rule')"/>
					</div>
					<div>
						<i-switch v-model="formItem.setting.rule.is_enable" :trueValue="1" :falseValue="0">
							<span slot="open">开</span>
							<span slot="close">关</span>
						</i-switch>
					</div>
				</div>
			</FormItem>
			<FormItem label="奖品图">
				<div class="flex f-just-between f-align-center form-row">
				<div class="image-box" 
				:style=" formItem.setting.prize.img != '' ? 'background-image: url('+formItem.setting.prize.img+');' : '' " 
				@click="selectImage('prize')">
					<Icon 
					v-if=" typeof(formItem.setting.prize.img) == 'undefined' || formItem.setting.prize.img == '' || formItem.setting.prize.img == null " 
					type="md-add" 
					size="25" />
					<Icon v-else type="md-close-circle" color="#f00" size="22" class="close" @click.stop="removeImage('prize')"/>
				</div>
				<div>
						<i-switch v-model="formItem.setting.prize.is_enable" :trueValue="1" :falseValue="0">
							<span slot="open">开</span>
							<span slot="close">关</span>
						</i-switch>
					</div>
				</div>
			</FormItem>
			<FormItem label="海报图">
				<div class="flex f-just-between f-align-center form-row">
				<div class="image-box" 
				:style=" formItem.setting.poster.img != '' ? 'background-image: url('+formItem.setting.poster.img+');' : '' " 
				@click="selectImage('poster')">
					<Icon 
					v-if=" typeof(formItem.setting.poster.img) == 'undefined' || formItem.setting.poster.img == '' || formItem.setting.poster.img == null " 
					type="md-add" 
					size="25" />
					<Icon v-else type="md-close-circle" color="#f00" size="22" class="close" @click.stop="removeImage('poster')"/>
				</div>
				<div>
						<i-switch v-model="formItem.setting.poster.is_enable" :trueValue="1" :falseValue="0">
							<span slot="open">开</span>
							<span slot="close">关</span>
						</i-switch>
					</div>
				</div>
			</FormItem>
			<div style="height:50px;width:100%;"></div>
		</Form>	
		
		<!--用户图片管理组件-->
		<userImages ref="user-images" @on-return-url="returnImageUrl"></userImages>
	</div>	
</template>

<script>
import userImages from '@/views/my-components/user-images/user-images';
/**
 * 页面背景设置 
 */
export default {
	name: 'pageSettingLottery',
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
				setting:{
					rule:{
						img: "",
						is_enable: 1,
					},
					prize: {
						img: "",
						is_enable: 1,
					},
					poster: {
						img: "",
						is_enable: 1,
					}
				}
			},
			operateType: ""
		}
	},
	methods: {
		// 初始化
		init(){
			setTimeout(()=>{
				// 双向绑定store 的数据
				this.formItem = this.$store.state.app.pageInfo;
				if( typeof( this.formItem.setting ) == 'undefined' || this.formItem.setting == '' ){
					this.$set(this.formItem, 'setting', {});
				}
				let setting = this.formItem.setting || {};
				if(!setting.rule){
					this.$set(this.formItem.setting, 'rule', {img: '', is_enable: 1});
				} else if(setting.rule.is_enable != 0){
					this.$set(this.formItem.setting.rule, 'is_enable', 1);
				}
				if(!setting.prize){
					this.$set(this.formItem.setting, 'prize', {img: '', is_enable: 1});
				} else if(setting.prize.is_enable != 0){
					this.$set(this.formItem.setting.prize, 'is_enable', 1);
				}
				if(!setting.poster){
					this.$set(this.formItem.setting, 'poster', {img: '', is_enable: 1});
				} else if(setting.poster.is_enable != 0){
					this.$set(this.formItem.setting.poster, 'is_enable', 1);
				}
			}, 5000);
		},
		// 选择图片（单选）
		selectImage(type){
			this.operateType = type;
			this.$refs['user-images'].showModal( {
				name:'images', 
				multi:0, 
				selectedImages: [ this.formItem.setting[type].img ], 
			});
		},
		// 图片选择组件的回调
		returnImageUrl( obj ){
			console.log("obj",obj)
			let item = obj.item || {};
			if(this.operateType){
				let editObj = this.formItem.setting[this.operateType] || {};
				this.$set(this.formItem.setting, this.operateType, {
					...editObj,
					width: item.width,
					height: item.height,
					img: obj.val
				});
				console.log("formItem", this.formItem.setting);
			}
		},
		// 清除图片
		removeImage(type){
			this.$Modal.confirm({
				title: '操作提示',
				content: '确定清除图片吗？',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					this.$set( this.formItem.setting[type], 'img', '' );
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