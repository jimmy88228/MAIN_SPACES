<style lang="less">
.plugins-group-form{
	.list-item{
		width: 300px;
		background:#f8f8f8;
		float:left;
		margin-right:10px;
		margin-bottom: 10px;
	
		.title{
			font-weight: bold;
			font-size:13px;
			color:#000;
			line-height: 2;
		}
		.desc{
			color:#999;
			font-size:12px;
			text-overflow: ellipsis;
		    white-space: nowrap;
		    max-width: 130px;
		    overflow: hidden;
			line-height: 2;
		}
		
		.icon-box{
			text-align: center;
			padding:20px 10px 20px 15px;
			cursor:pointer;
			width:60px;
			
			.icon{
				color:#fff;
				background: green;
			    padding: 5px;
			    border-radius: 5px;
			    font-size:30px;
			}
		}
		.txt-box{
			padding:15px 20px 5px 10px;
			cursor:pointer;
			flex:1 1 0%;
		}
		.ivu-tooltip-inner{
			white-space:unset;
		}
	}
}	
</style>

<template>
    <div>
    	<Modal
	        v-model="modalShow"
	        :title="modalTitle"
	        :loading="modalLoading"
			class="plugins-group-form"
			:width="980"
			:styles="{top:'20px'}"
	        @on-ok="modalOk">
	        
			<div :style="{height: modalHeight +'px',overflow: 'hidden auto'}">
				<Form ref="formValidate" :model="formItem" :rules="ruleValidate" label-position="top">
					<FormItem label="产品名称" prop="name">
						<Input v-model="formItem.name" placeholder="请输入产品名称" maxlength="30" show-word-limit></Input>
					</FormItem>
					<FormItem>
						<Tabs :value="groupTab" type="card">
							<TabPane v-for="(group,gi) in pluginsTree" :key="gi" :label="group.name" :name="'group'+gi">
								<Row>
									<Col v-for="(item, index) in group.children" :key="item.code" class="list-item">
										<Row type="flex">
											<Col class="icon-box">
												<Icon :type="item.icon" :class="item.icon_class" :style="item.icon_color != '' ? 'background:'+item.icon_color : ''" />
											</Col>
											<Col class="txt-box">
												<Tooltip :content="item.desc" placement="bottom" theme="light">
													<div class="title">{{ item.name }}</div>
													<div class="desc">{{ item.desc }}</div>
												</Tooltip>
											</Col>
											<Col style="width:70px;">
												<i-switch v-model="item.is_enable" size="large" style="margin-top:30px;">
												  <span slot="open">启用</span>
												  <span slot="close">关闭</span>
												</i-switch>
											</Col>
										</Row>
									</Col>
								</Row>
							</TabPane>
						</Tabs>
					</FormItem>	
				</Form>
	        </div>
	    </Modal>
    </div>	
</template> 

<script>
export default {
    name: 'pluginsGroupForm',
    components: {

    },
    data () {
    	return{
			groupTab: 'group0',
			
    		// 表单内容
        	formItem: {
        		id: 0,
        		name: '',
        	},
        	modalHeight: 500,
			pluginsTree: [],
			
        	// 表单数据规则
        	ruleValidate:{
        		name:[{ required: true, message: '名称不能为空', trigger: 'blur' }],
        	},
        	// 模态框
        	modalShow: false,
        	modalTitle: '',
        	modalLoading: true,
        	modalEditIndex: '',
    	}
    },
	computed: {

	},
    methods: {
    	// 打开模态框
        openModal (row, pluginsTree){
			this.modalHeight = document.body.clientHeight - 190;

			// 屏蔽 确定按钮
        	this.modalShow = true;
			// 初始化后台菜单树
			this.initTree( row, pluginsTree );

    		// 初始化表单数据
        	this.formItem.id = typeof(row.id) != 'undefined' ? Number(row.id) : 0; 
        	if( this.formItem.id == 0 ){
        		this.modalTitle = '添加产品';

        		// 新建时候的初始化数据
        		this.formItem.name = '';
        	}
        	else{
        		this.modalTitle = '修改产品';
        		
        		// 编辑时候的初始化数据
        		this.formItem.name = row.name;
        	}
			
			this.groupTab = 'group0';
        },
		// 初始化树
		initTree( row, pluginsTree ){
			this.pluginsTree = pluginsTree;
			for(var i in this.pluginsTree){
				for(var j in this.pluginsTree[i]['children']){
					if( typeof(row.codes) != 'undefined' 
					&& row.codes.length > 0 
					&& row.codes.indexOf( this.pluginsTree[i]['children'][j]['code'] ) !== -1 
					){
						this.pluginsTree[i]['children'][j]['is_enable'] = true;
					}
					else{
						this.pluginsTree[i]['children'][j]['is_enable'] = false;
					}
				}
			}
		},
		// 从tree 获取 code
		getCodesFromTree(){
			var codes = [];
			for(var i in this.pluginsTree){
				for(var j in this.pluginsTree[i]['children']){
					if( this.pluginsTree[i]['children'][j]['is_enable'] ){
						codes.push( this.pluginsTree[i]['children'][j]['code'] );
					}
				}
			}
			
			return codes;
		},
        // 模态框确认事件
        modalOk (){
        	this.$refs['formValidate'].validate((valid) => {
                if (valid) {
                	var codes = this.getCodesFromTree();
					if( codes.length > 0 ){
						// ajax 保存数据
						this.$ajax.post( (this.formItem.id == 0 ? this.$api.pluginsGroupAdd : this.$api.pluginsGroupEdit ), {
							id : this.formItem.id,
							name: this.formItem.name,
							codes: codes,
						})
						.then( (response) => {
							var res = response.data;
							
							if( res.code ){
								// 保存成功
								this.$Message.success( res.message );
								this.modalShow = false;
								
								// 把数据返回给父级
								this.$emit('on-success', {
									data: res.data, 
									type: ( this.formItem.id == 0 ? 'add' : 'edit' ),
								});
							}
							else{
								this.modalShow = true;
								this.modalLoading = false;
						
								setTimeout(() => {
									this.modalLoading = true;
								}, 50);
							}
						});
		    		}
					else{
						// 验证失败，不关闭模态框
						this.modalShow = true;
						this.$Message.error('启用组件不能为空！');
						this.modalLoading = false;
						
						setTimeout(() => {
						    this.modalLoading = true;
						}, 50);
					}
                } 
                else {
                	// 验证失败，不关闭模态框
                	this.modalShow = true;
                    this.$Message.error('必填项不能为空！');
                    this.modalLoading = false;
                    
                    setTimeout(() => {
	                    this.modalLoading = true;
	                }, 50);
                }
            })
        },
    },
}
</script>