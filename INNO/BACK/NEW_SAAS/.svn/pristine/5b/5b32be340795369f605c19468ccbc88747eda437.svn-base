<style lang="less">
.member-card-actform{
	
}	
</style>	

<template>
	<div class="member-card-actform">
		<Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="80">
			<FormItem label="激活必选项" prop="required_form">
				<Select v-model="formItem.required_form" multiple style="width:280px"
					@on-change="form1Change">
					<Option v-for="(item,index) in commonFieldIdList1" :key="index" 
					:value="item.code" :disabled="item.disabled">{{ item.name }}</Option>
				</Select>
				<span> （多选）</span>
				<div>“必填项” 是会员卡激活前，必须要用户填写的信息</div>
			</FormItem>
			<FormItem label="激活选填项" prop="optional_form">
				<Select v-model="formItem.optional_form" multiple style="width:280px"
					@on-change="form2Change">
					<Option v-for="(item,index) in commonFieldIdList2" :key="index"
					:value="item.code" :disabled="item.disabled">{{ item.name }}</Option>
				</Select>
				<span> （多选）</span>
				<div>“选填项” 是用户可以不填的信息</div>
			</FormItem>
		</Form>	
	</div>
</template>	

<script>
/**
 * 微信会员卡，卡面设置表单
 */	
export default {
	name: 'weixinMemberCardActform',
    components: {
	},
	props:{
	
	},
	data() {
		return {
			formItem:{
				required_form: [],
				optional_form: [],
			},

			commonFieldIdList1:[],
			commonFieldIdList2:[],
			
			// 表单数据规则
			ruleValidate:{
			},
		}
	},
	computed:{
		
	},
	methods: {
		// 提供给父组件使用
		initData( data, cardInfo ){
			this.formItem = data;
			
			typeof(this.formItem.required_form) == 'undefined' ? this.$set(this.formItem, 'required_form', []) : '';
			typeof(this.formItem.optional_form) == 'undefined' ? this.$set(this.formItem, 'optional_form', []) : '';
			

			for(var i in cardInfo.commonFieldIdList1){
				this.$set( this.commonFieldIdList1, i, cardInfo.commonFieldIdList1[i] );
				this.commonFieldIdList1[i].disabled = false;
			}
			
			for(var i in cardInfo.commonFieldIdList2){
				this.$set( this.commonFieldIdList2, i, cardInfo.commonFieldIdList2[i] );
				this.commonFieldIdList2[i].disabled = false;
			}
		},
		form1Change( val ){
			for( var i in this.commonFieldIdList2 ){
				if( this.formItem.optional_form.indexOf( this.commonFieldIdList2[i].code ) === -1 
					&& this.formItem.required_form.indexOf( this.commonFieldIdList2[i].code ) !== -1 ){
					this.commonFieldIdList2[i].disabled = true;
				}
				else{
					this.commonFieldIdList2[i].disabled = false;
				}
			}
		},
		form2Change( val ){
			for( var i in this.commonFieldIdList1 ){
				if( this.formItem.required_form.indexOf( this.commonFieldIdList1[i].code ) === -1 
					&& this.formItem.optional_form.indexOf( this.commonFieldIdList1[i].code ) !== -1 ){
					this.commonFieldIdList1[i].disabled = true;
				}
				else{
					this.commonFieldIdList1[i].disabled = false;
				}
			}
		},
	},
}
</script>	