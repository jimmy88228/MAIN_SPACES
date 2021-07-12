<style lang="less">
.release-item-form{
	
}
</style>

<template>
	<Card v-show="modalShow" class="release-item-form">
		<div slot="title" class="icard-header">
			<Tooltip content="返回" placement="bottom-start">
				<Icon type="ios-arrow-dropleft" @click="goBack" class="card-back"/>
			</Tooltip>
			{{releaseInfo.name}} {{releaseInfo.alias_name}} - 编辑明细项
		</div>
		<div slot="extra">
			<Button type="primary" @click="modalOk">保存</Button>
		</div>
		
		<!--表单-->
		<Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="100">
			<FormItem label="类型" prop="type">
				<RadioGroup v-model="formItem.type">
					<Radio v-for="(item,index) in typeList" :key="index" :label="index">{{item.name}}</Radio>
				</RadioGroup>
			</FormItem>	
			<FormItem label="负责人" prop="author_str">
				<CheckboxGroup v-model="formItem.author" @on-change="onAuthorChange">
					<Checkbox v-for="(citem,cindex) in authorList" :key="cindex" 
					v-if="citem.enable == true" 
					:label="citem.name"></Checkbox>
				</CheckboxGroup>
			</FormItem>	
			<FormItem label="更新说明" prop="notes">
				<Input v-model="formItem.notes" 
				placeholder="更新说明..." 
				type="textarea" 
				style="width:380px;"></Input>
				<div>例如：用简洁的话说明一下即可，不用写得太详细</div>
			</FormItem>
			<div class="form-footer-button-box">
				<Button type="default" @click="goBack">取消</Button>
				<Button type="primary" @click="modalOk">保存</Button>
			</div>
		</Form>	
		
		<!--加载提示-->
		<Spin size="large" fix v-if="spinShow"></Spin>
	</Card>	
</template>

<script>
/**
 * 编辑发布日志项表单
 */	
export default {
	name: 'releaseItemForm',
	components: {
	},
	props: {
	},
	data () {
    	return {
			modalShow: false,
			
			// 表单内容
			formItem: {
				id: 0,
				notes: '',
				type: '',
				author: [],
				author_str: '',
			},
			
			releaseInfo:{},
			typeList: [],
			authorList: [],
			
			// 表单数据规则
			ruleValidate:{
				notes:[{ required: true, message: '内容不能为空', trigger: 'blur' },],
				type:[{ required: true, message: '类型不能为空', trigger: 'blur' },],
				author_str:[{ required: true, message: '负责人不能为空', trigger: 'blur' },],
			},
			
			options: {
				disabledDate (date) {
					return date && date.valueOf() < Date.now() - 86400000;
				}
			},

			// 加载提示
			spinShow: false,
		}
	},
	methods: {
		// 打开模态框
		openModal (row, releaseInfo, authorList, typeList ){
			this.modalShow = true;
			this.releaseInfo = releaseInfo;
			this.typeList = typeList;
			this.authorList = authorList;
			
			if( typeof(row.id) == 'undefined' || row.id == 0 ){
				this.formItem.id = 0;
				this.formItem.notes = '';
				this.formItem.type = '';
				this.formItem.author = [];
				this.formItem.author_str = '';
			}
			else{
				// 编辑时候的初始化数据
				this.formItem.id = row.id;
				this.formItem.notes = row.notes;
				this.formItem.type = row.type;
				this.formItem.author = row.author;
				this.formItem.author_str = 'OK';
				
				this.onAuthorChange( row.author );
			}
		},
		// 保存按钮
		modalOk(){
			this.$refs['formValidate'].validate((valid) => {
		        if (valid) {
		        	this.spinShow = true;
					
					this.$ajax.post( ( this.formItem.id == 0 ? this.$api.releaseItemAdd : this.$api.releaseItemEdit ), {
						id: this.formItem.id,
						release_id: this.releaseInfo.id,
						notes: this.formItem.notes,
						type: this.formItem.type,
						author: this.formItem.author,
					})
					.then( (response) => {
						var res = response.data;
						this.spinShow = false;
						
						if( res.code ){
							this.$Message.success( res.message );
							
							this.modalShow = false;
							this.$emit('on-success', res );
						}
					});
				}
			});
		},
		onAuthorChange( val ){
			if( val.length > 0 ){
				this.formItem.author_str = 'OK';
			}
			else{
				this.formItem.author_str = '';
			}
			
			// 检查某个字段
			this.$refs['formValidate'].validateField('author_str', ( msg )=>{
			});
		},
		// 返回列表
		goBack(){
			this.modalShow = false;
			this.$emit('on-close', {});
		},
	},
}
</script>	