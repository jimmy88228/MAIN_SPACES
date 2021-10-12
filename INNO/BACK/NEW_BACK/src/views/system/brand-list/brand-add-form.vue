<style lang="less">
.brand-add-form{
	.default-input{
		width:300px;
	}
}	
</style>

<template>
	<Card class="brand-add-form" v-show="modalShow">
		<div slot="title" class="icard-header">
			<Tooltip content="返回" placement="bottom-start">
				<Icon type="ios-arrow-dropleft" @click="goBack" class="card-back"/>
			</Tooltip>
			创建品牌商超管账号
		</div>
		<div slot="extra">
			<Button type="primary" @click="modalOk">保存</Button>
		</div>
		
		<Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="160">
			
			<FormItem prop="brandName" label="品牌商名称">
			    <Input v-model="formItem.brandName" class="default-input" placeholder="请输入品牌商名称" clearable></Input>
			</FormItem>
			
			<FormItem prop="brandName" label="品牌商英文简称">
			    <Input v-model="formItem.brandNameEn" class="default-input" placeholder="请输入品牌商英文简称" clearable></Input>
				<div>这个简称用于二级域名或前缀等</div>
			</FormItem>
			
			<FormItem prop="userName" label="品牌商超管用户名">
			    <Input v-model="formItem.userName" class="default-input" placeholder="用户名只能由英文字符数字和‘_’组成" clearable>
					<span slot="prepend">{{formItem.brandNameEn}}_</span>
				</Input>
				<div>用户名的前缀就是品牌英文简称，一个品牌只能有一个超管</div>
			</FormItem>
			<FormItem prop="password" label="品牌商超管用户密码">
			    <Input v-model="formItem.password" class="default-input" style="width:190px;" placeholder="请输入密码, 长度不少于6位"></Input>
				<Button @click="randPassword">生成随机密码</Button>
			</FormItem>
			<FormItem prop="card_no_prefix" label="会员卡卡号前缀">
			    <Input v-model="formItem.card_no_prefix" class="default-input" style="width:190px;" placeholder="请输入会员卡卡号前缀"></Input>
			</FormItem>
			<FormItem prop="card_no_length" label="会员卡卡号长度">
			    <InputNumber  v-model="formItem.card_no_length" :min="5" style="width:190px;" class="default-input"  placeholder="请输入会员卡卡号长度"></InputNumber>
				<div>（不包括前缀）长度不少于5位</div>
			</FormItem>
			
			<div class="form-footer-button-box">
				<Button type="default" @click="goBack">取消</Button>
				<Button type="primary" @click="modalOk">保存，下一步</Button>
			</div>
		</Form>
		
		<!--加载提示-->
		<Spin size="large" fix v-if="spinShow"></Spin>
	</Card>	
</template>

<script>
export default {
	name: "brandAddForm",
    components: {

    },
    data () {
		// 检查用户
		const checkUsername = (rule, val, callback) => {
			if( /^[a-zA-Z0-9_]{4,20}$/.test(val) ){
		    	callback();
		    }
			else{
				callback(new Error('用户名只能由英文字符数字和‘_’组成'));
		    }
		};
		
        return {
			// 模态框
			modalShow: false,
			
			formItem:{
				userName:'',
				brandName:'',
				brandNameEn:'',
				password:'',
				card_no_prefix:'',
				card_no_length:5,
			},
			
			// 表单验证规则
			ruleValidate:{
				brandName:[{ required: true, message: '品牌商名称不能为空', trigger: 'blur' },
						{ type: 'string', max:30, message: '大于30个字符', trigger: 'blur' },],
				userName:[{ required: true, message: '用户名不能为空', trigger: 'blur' },
							{ type: 'string', min: 4, max:20, message: '用户名不能少于4个字符，大于20个字符', trigger: 'blur' },
							{validator:checkUsername,message:'用户名只能由英文字符数字和‘_’组成',trigger:'blur'}],
				password:[{ required: true, message: '不能为空', trigger: 'blur' },
							{ type: 'string', min: 6, message: '密码长度不能少于6位', trigger: 'blur' }],
				card_no_prefix:[{ required: true, message: '不能为空', trigger: 'blur' }],
				card_no_length:[{ required: true, message: '不能为空', type: 'number', trigger: 'blur' }],
			},
			
			spinShow: false,
		}
	},
	methods: {
		init(){
			
		},
		openModal(){
			this.modalShow = true;
			
			// 重置表单
			this.$refs['formValidate'].resetFields();
		},
		// 提交表单
		modalOk(){
			this.$refs.formValidate.validate((valid) => {
			    if (valid) {
			    	// 显示加载层
			    	this.spinShow = true;
					
					// ajax 保存账号信息
					this.$ajax.post( this.$api.brandAdd, {
					    user_name: this.formItem.userName,
					    brand_name: this.formItem.brandName,
						brand_name_en: this.formItem.brandNameEn,
					    password: this.formItem.password,
					    card_no_prefix: this.formItem.card_no_prefix,
					    card_no_length: this.formItem.card_no_length,
					})
					.then( (response) => {
						this.spinShow = false;
						const res = response.data;
						
						if( res.code ){
							this.$Message.success( res.message );
							this.modalShow = false;
							
							// 通知父组件
							this.$emit('on-success', res.data );
						}
					});
				}
			});		
		},
		// 生成随机密码
		randPassword(){
			let random_charset = [
				'0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
				, 'a', 'b', 'c', 'd', 'e', 'f', 'g'
				, 'h', 'i', 'j', 'k', 'l', 'm', 'n'
				, 'p', 'q', 'r', 's', 't'
				, 'u', 'v', 'w', 'x', 'y', 'z'
				, 'A', 'B', 'C', 'D', 'E', 'F', 'G'
				, 'H', 'I', 'J', 'K', 'L', 'M', 'N'
				, 'P', 'Q', 'R', 'S', 'T'
				, 'U', 'V', 'W', 'X', 'Y', 'Z'];
			let nonce = "";
			let len = random_charset.length - 1;
			for(let i = 0; i < 20; i++) {
				let id = Math.ceil( Math.random() * len );
				if( typeof(random_charset[id]) != 'undefined' ){
					nonce += random_charset[id];
				}
				
				if( nonce.length == 6 )break;
			}
			this.formItem.password = nonce;
		},
		// 返回列表
		goBack(){
			this.modalShow = false;
			
			this.$emit('on-close', {});
		},
	},
	mounted () {
		this.init();
	},
}
</script>	