<template>
	<div class="tab-rule-setting">
		<Form ref="formValidate" :model="formItem" :rules="ruleValidate" label-position="left" :label-width="300">
			<FormItem label="层级一：客户优先进带参门店">
				<i-switch v-model="formItem.rule_parameter_store" size="large" disabled>
					<span slot="open">启用</span>
					<span slot="close">关闭</span>
				</i-switch>
				<div class="tips">客户点击带门店参数的链接或扫码带门店参数的二维码时，将进入带参门店</div>
			</FormItem>
			<FormItem label="层级二：客户优先进归属门店">
				<i-switch v-model="formItem.rule_binding_store" size="large">
					<span slot="open">启用</span>
					<span slot="close">关闭</span>
				</i-switch>
				<div class="tips">客户进入注册时绑定的归属门店</div>
			</FormItem>
			<FormItem label="层级三：客户优先进最近一次访问门店">
				<i-switch v-model="formItem.rule_lately_store" size="large">
					<span slot="open">启用</span>
					<span slot="close">关闭</span>
				</i-switch>
				<div class="tips">有访问记录的客户，默认进入最近一次访问的门店</div>
			</FormItem>
			<FormItem label="层级四：客户优先进隔离门店">
				<i-switch v-model="formItem.rule_partition_store" size="large">
					<span slot="open">启用</span>
					<span slot="close">关闭</span>
				</i-switch>
				<div class="tips">客户进入隔离门店后，将不能切换其它门店</div>
			</FormItem>
			<FormItem label="层级五：地区定向推荐">
				<i-switch v-model="formItem.rule_area_recommend" size="large">
					<span slot="open">启用</span>
					<span slot="close">关闭</span>
				</i-switch>
				<div class="tips">当客户定位于地区时，系统将推荐客户进入指定门店列表</div>
			</FormItem>
			<FormItem label="层级六：LBS定位推荐">
				<i-switch v-model="formItem.rule_lbs_recommend" size="large">
					<span slot="open">启用</span>
					<span slot="close">关闭</span>
				</i-switch>
				<div class="tips">当规则一至五都不能匹配时，根据LBS定位推荐附近门店列表</div>
			</FormItem>
			<FormItem label="层级七：无门店推荐结果，直接进入指定页">
				<RadioGroup v-model="formItem.rule_no_result_jump">
					<Radio :label="0">进入门店列表</Radio>
					<Radio :label=" formItem.rule_no_result_jump > 0 ? formItem.rule_no_result_jump : 1">指定门店</Radio>
				</RadioGroup>
				<div v-show="formItem.rule_no_result_jump > 0 ">
					<Tag v-if="formItem.rule_no_result_jump > 1 " closable size="large"
						@on-close="storeClose">{{store.name}} {{store.code}}</Tag>
					<Button v-else @click="onSelectStore">选择店铺...</Button>
				</div>
			</FormItem>
			<FormItem label="允许用户切换店铺">
				<i-switch v-model="formItem.rule_change_store" size="large">
					<span slot="open">允许</span>
					<span slot="close">禁止</span>
				</i-switch>
				<div class="tips">当设置了允许用户切换店铺，切换逻辑遵循进店规则的四、五、六条。如果用户没有授权地理位置，则列出全量店铺；</div>
				<div class="tips">当设置了禁止，将不出现店铺切换入口</div>
			</FormItem>
			
			<div class="form-footer-button-box">
				<Button type="primary" @click="modalOk">保存</Button>
			</div>	
		</Form>
		
		<!--店铺选择器-->
		<storeSelect ref="store-select" @on-ok="onStoreOk"></storeSelect>
				
		<!--加载提示-->
		<Spin size="large" fix v-if="spinShow"></Spin>
	</div>
</template>
	
<script>
import storeSelect from '@/views/my-components/store-select/store-select';
	
export default {
	components: {
		storeSelect,
	},
	data() {
		return {
			// 表单内容
			formItem: {
				rule_parameter_store: true,
				rule_binding_store: true,
				rule_lately_store: true,
				rule_partition_store: true,
				rule_area_recommend: true,
				rule_lbs_recommend: true,
				rule_change_store: true,
				rule_no_result_jump: 0,
			},
			
			store:{},
			
			// 表单数据规则
			ruleValidate:{
			},
			
			spinShow: false,
		}
	},
	methods: {
		// 初始化
		init() {
			this.spinShow = true;
			// ajax 保存编辑数据
			this.$ajax.post( this.$api.visitStoreRuleList, {
			})
			.then( (response) => {
				var res = response.data;
				this.spinShow = false;
				
				if( res.code ){
		
					for(var i in res.data.items){
						var val =  Number( res.data.items[i]['rule_value'] );
						if( res.data.items[i]['rule_key'] != 'rule_no_result_jump' ){
							val = val == 1 ? true : false;
						}
						this.$set( this.formItem, res.data.items[i]['rule_key'] , val );
					}
					this.store = res.data.store;
			    }
			});
		},
		// 模态框确认事件
		modalOk (){
			this.$refs['formValidate'].validate((valid) => {
		        if (valid) {
		        	this.spinShow = true;
		        	
		        	// ajax 保存编辑数据
		        	this.$ajax.post( this.$api.visitStoreRuleEdit, {
						rule_parameter_store: this.formItem.rule_parameter_store == true ? 1 : 0,
						rule_binding_store: this.formItem.rule_binding_store == true ? 1 : 0,
						rule_lately_store: this.formItem.rule_lately_store == true ? 1 : 0,
						rule_partition_store: this.formItem.rule_partition_store == true ? 1 : 0,
						rule_area_recommend: this.formItem.rule_area_recommend == true ? 1 : 0,
						rule_lbs_recommend: this.formItem.rule_lbs_recommend == true ? 1 : 0,
						rule_change_store: this.formItem.rule_change_store == true ? 1 : 0,
						rule_no_result_jump: this.formItem.rule_no_result_jump,
		        	})
		    		.then( (response) => {
		    			var res = response.data;
		    			this.spinShow = false;
		    			
		    			if( res.code ){
		    				// 保存成功
		                    this.$Message.success( res.message );
		                }
		    		});
		        }
		        else {
		            this.$Message.error('必填项不能为空！');
		        }
		   });
		},
		// 清除选中的门店
		storeClose(){
			this.$Modal.confirm({
				title: '操作提示',
				content: '确定删除关联吗？',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					this.formItem.rule_no_result_jump = 0;
				},
			});
		},
		// 打开门店选择
		onSelectStore(){
			this.$refs['store-select'].openModal( [], 'radio' );
		},
		// 选门店的组件的 回调
		onStoreOk( items ){
			this.store = items[0];
			this.formItem.rule_no_result_jump = items[0].id;
		},
	},
	mounted() {
		this.init();
	},
}	
</script>
	
<style lang="less">
.tab-rule-setting{
	.tips{
		color:#bbb;
	}
}
</style>