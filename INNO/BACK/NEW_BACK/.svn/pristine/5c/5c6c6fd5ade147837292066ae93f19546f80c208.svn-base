<template>
	<div class="page-list-sort">
		<Poptip v-model="showPoptip" placement="right">
			<span>{{sort}}</span>
			<Icon type="ios-create-outline" size="16" style="margin-left: 5px;cursor:pointer"></Icon>
			<div slot="content" class="content-box">
				<Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="60">
				
					<FormItem label="排序值" prop="sort">
						<Input v-model="formItem.sort" type="number" style="width:55px" size="small" />
						<span class="desc">数字小排前</span>
					</FormItem>
					
					<div style="text-align: center;">
						<Button size="small" @click="onCancel">取消</Button>
						<Button type="primary" size="small" @click="onSave">确定</Button>
					</div>
				</Form>
				
				<!--加载提示-->
				<Spin size="large" fix v-if="spinShow"></Spin>
			</div>
		</Poptip>
	</div>
</template>
	
<script>
/**
 * 列表排序 - 组件
 */
export default {
	name:'pageListSort',
	components: {
	},
	props: {
		itemId:{
			type: Number,
			default: 0,
		},
		sort:{
			type: [Number,String],
			default: 0,
		}
	},
	data() {
		const checkSort = (rule, value, callback) => {
			if( Number( value ) < 0 ){
		    	callback(new Error('数值必须大于0'));
		    }
		    else {
		        callback();
		    }
		};
		
		return {
			showPoptip: false,
			
			formItem:{
				sort: 0,
			},
			ruleValidate:{
				sort:[{ required: true, message: '排序不能为空', trigger: 'blur' },
						{ validator: checkSort, trigger: 'blur' }],
			},
			
			spinShow: false,
		}
	},
	mounted() {
		this.init();
	},
	methods: {
		init(){
			this.formItem.sort = String( this.sort );
		},
		// 保存排序
		onSave(){
			this.$refs['formValidate'].validate((valid) => {
			    if (valid) {
					this.spinShow = true;
					this.$ajax.post( this.$api.cloudGoodsPageSort, {
						id : this.itemId,
						sort: this.formItem.sort,
					})
					.then( (response) => {
						this.spinShow = false;
						var res = response.data;
						
						if( res.code ){
							this.showPoptip = false;
							
							this.$emit('on-success');
						}
					});	
					
				}
			});
		},
		onCancel(){
			this.showPoptip = false;
		}
	},
}
</script>	

<style lang="less">
.page-list-sort{

	.content-box{
		padding:10px 0;
		text-align: left;
		.desc{
			margin-left:5px;
			font-size:12px;
			margin-bottom: 5px;
			width:100%;
		}
	}
}	
</style>