<style lang="less">
</style>

<template>
	<div>
		<Modal v-model="modalShow"
		title="文本内容管理"
		width="600"
		:loading="modalLoading"
		:z-index="3000"
		@on-ok="onSave">
			<Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="80">
				<FormItem prop="content" label="文本内容">
			        <Input v-model="formItem.content" type="textarea" :rows="10" 
					maxlength="500" show-word-limit placeholder=""></Input>
			    </FormItem>
				<FormItem label="">
					<div>小程序客服中加入菜单的方法：&lt;a keyword="关键词"&gt;菜单名&lt;/a&gt; </div>
					<div>注意：“关键词”是必须在关键词回复有定义的关键词，小程序才能触发事件</div>
				</FormItem>	
			</Form>
		</Modal>
	</div>
</template>

<script>
/**
 * 客服素材，添加文本素材
 */
import util from '@/libs/util.js';	

export default {
	name:'csTextForm',
	components: {
    },
    props: {

    },
    data () {
    	return {
			modalShow: false,
			modalLoading:true,
			
			formItem:{
				id: 0,
				content:'',
			},
			ruleValidate:{
				content:[{ required: true, message: '内容不能为空', trigger: 'blur'}],
			},
		}
	},
	methods: {
		openModal( row, cat_id ){
			this.modalShow = true;
			
			if( row.id == 0 ){
				this.formItem.id = 0 ;
				this.formItem.content = '';
				this.formItem.cat_id = cat_id;
			}
			else{
				this.formItem.id = row.id ;
				this.formItem.content = row.content;
				this.formItem.cat_id = row.cat_id;
			}
		},
		// 保存
		onSave(){
			this.modalLoading = true;
					
			this.$refs['formValidate'].validate((valid) => {
			    if (valid) {
			    	// ajax 提交数据
			    	util.ajax.post( ( this.formItem.id == 0 ? util.apiUrl.csMaterialAdd : util.apiUrl.csMaterialEdit ), {
						id: this.formItem.id,
						cat_id: this.formItem.cat_id,
			    		content: this.formItem.content,
			    		type: 'TEXT',
			    	})
					.then( (response) => {
						var res = response.data;
						if( res.code ){
							// 关闭模态框
							this.modalShow = false;
							
							// 通知父组件
							this.$emit('on-success');
						}
						else{
							this.modalShow = true;
			        		this.$Message.error( res.message );
			        		this.modalLoading = false;
			        
			                setTimeout(() => {
			                    this.modalLoading = true;
			                }, 50);
						}
					});
			    }
				else{
					this.$Message.error( '请输入必填项' );
					
					this.modalLoading = false;
				    setTimeout(() => {
				    	this.modalShow = true;
				        this.modalLoading = true;
				    }, 50);
				}
			});
		}
	},
}
</script>