<style lang="less">
</style>

<template>
	<div>
		<Modal v-model="modalShow"
		title="添加标签"
		width="500"
		:loading="modalLoading"
		:z-index="3000"
		@on-ok="onSave">
			<Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="80">

				<FormItem label="标签类型">
					<div>{{typeName}}</div>
				</FormItem>
				<FormItem prop="name" label="标签名称">
			        <Input v-model="formItem.name" style="width:200px;" maxlength="20" show-word-limit placeholder=""></Input>
			    </FormItem>

			</Form>
		</Modal>
	</div>
</template>

<script>
/**
 * 客服素材，添加文本素材
 */
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
			typeName: '',

			formItem:{
				id: 0,
				name:'',
				type: '',
			},
			ruleValidate:{
				name:[{ required: true, message: '名称不能为空', trigger: 'blur'}],
			},
		}
	},
	methods: {
		openModal( row, cat_id, tagsType, typeName ){
			this.modalShow = true;
			this.typeName = typeName;

			if( row.id == 0 ){
				this.formItem.id = 0 ;
				this.formItem.name = '';
				this.formItem.cat_id = cat_id;
				this.formItem.type = tagsType;
			}
			else{
				this.formItem.id = row.id ;
				this.formItem.name = row.name;
				this.formItem.cat_id = row.cat_id;
				this.formItem.type = row.type;
			}

		},
		// 保存
		onSave(){
			this.modalLoading = true;

			this.$refs['formValidate'].validate((valid) => {
			    if (valid) {
			    	// ajax 提交数据
			    	this.$ajax.post( ( this.formItem.id == 0 ? this.$api.tagsAdd : this.$api.tagsEdit ), {
              id: this.formItem.id,
              cat_id: this.formItem.cat_id,
			    		name: this.formItem.name,
			    		type: this.formItem.type,
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
