<style lang="less">
.weixin-member-card-editor{
	
}	
</style>

<template>
	<div v-if="showModal" class="weixin-member-card-editor">
		<Card>
			<div slot="title" class="icard-header">
				<Tooltip content="返回" placement="bottom-start">
					<Icon type="ios-arrow-dropleft" @click="goBack" class="card-back"/>
				</Tooltip>
				返回 | <span style="margin-left: 10px;">设置会员卡</span>
			</div>
			<div slot="extra">
				<Button type="primary" @click="modalOk">保存</Button>
			</div>
			
			<Tabs value="tab1" name="card-tab">
				<TabPane label="卡面设置" name="tab1" tab="card-tab">
					<Row :gutter="16" type="flex" justify="start" style="min-width: 850px;">
						<Col style="width:400px;">
							<!--会员卡预览界面-->
							<weixinMemberCardView ref="weixin-member-card-view"></weixinMemberCardView>
						</Col>
						<Col style="flex: 1 1 0%; background: #fff;">
							<!--卡面表单-->
							<weixinMemberCardForm ref="weixin-member-card-form" @on-success="saveCallback"></weixinMemberCardForm>
						</Col>
					</Row>
				</TabPane>
				<TabPane label="激活设置" name="tab2" tab="card-tab">
					<Row :gutter="16" type="flex" justify="start">
						<Col style="width:360px;">
							<!--激活设置的预览界面-->
							<weixinMemberCardActview ref="weixin-member-card-actview"></weixinMemberCardActview>
						</Col>
						<Col style="flex: 1 1 0%; background: #fff;">
							<!--激活设置的表单-->
							<weixinMemberCardActform ref="weixin-member-card-actform"></weixinMemberCardActform>
						</Col>	
					</Row>
				</TabPane>	
			</Tabs>		
		
			<div class="form-footer-button-box">
				<Button type="primary" @click="modalOk">保存</Button>
			</div>
		</Card>
		
		<!--加载提示-->
		<Spin size="large" fix v-if="spinShow"></Spin>
	</div>
</template>	

<script>
import weixinMemberCardView from './weixin-member-card-view';
import weixinMemberCardForm from './weixin-member-card-form';
import weixinMemberCardActview from './weixin-member-card-actview';
import weixinMemberCardActform from './weixin-member-card-actform';

export default {
	name: 'weixinMemberCard',
    components: {
		weixinMemberCardView,
		weixinMemberCardForm,
		weixinMemberCardActview,
		weixinMemberCardActform,
    },
    data() {
    	return {
			showModal: false,
			spinShow: false,

			// 表单内容
			formItem:{},
			// 初始化的表单内容
			formItem0: {
				brand_name:'',
				logo_url:'',
				title: '',
				color:'Color010',
				background_pic_url:'',
				code_type: 'CODE_TYPE_QRCODE',
				
				service_phone: '',
				notice:'',
				prerogative: '',
				description: '',
				
				show_menus: ['integral','coupons','balance'],
				center_title: '会员中心',
				center_url: null,
				center_sub_title: '',
				balance_rules: '',
				
				custom_url_name:'',
				custom_url: null,
				custom_url_sub_title: '',
				custom_cell1_name: '',
				custom_cell1_url: null,
				custom_cell1_tips: '',
				promotion_url_name: '',
				promotion_url: null,
				promotion_url_sub_title: '',
				
				required_form: [],
				optional_form: [],
			},
		}
	},
	methods: {
		// 提供给父组件进行初始化
		openModal( id ) {
			this.showModal = true;
			this.spinShow = true;

			this.$ajax.post( this.$api.weixinMemberCardInfo, {
				id: id,
			})
			.then( (response) => {
				this.spinShow = false;
				var res = response.data;
				
				if( res.code ){
					this.formItem = res.data.info == '' ? {} : res.data.info;
					
					// 初始化form 参数，以上面的formItem 为标注，不存在的补充默认值
					for(var i in this.formItem0 ){
						if( typeof( this.formItem[ i ] ) == 'undefined' ){
							this.$set( this.formItem, i, this.formItem0[i] );
						}
					}

					// 初始化预览组件
					this.$refs['weixin-member-card-view'].initData( this.formItem );
					this.$refs['weixin-member-card-form'].initData( id, this.formItem, res.data );
					this.$refs['weixin-member-card-actview'].initData( this.formItem, res.data );
					this.$refs['weixin-member-card-actform'].initData( this.formItem, res.data );
				}
			});
		},
		// 保存按钮
		modalOk(){
			this.spinShow = true;
			this.$refs['weixin-member-card-form'].onSave();   
		},
		// 保存的回调
		saveCallback(){
			this.spinShow = false;
			this.showModal = false;
			this.$emit('on-success', {});
		},
		tabClick( val ){
			console.log( val );
			console.log( this.currTab )
		},
		// 返回列表
		goBack(){
			this.showModal = false;
			this.$emit('on-close', {});
		},
	},
}
</script>