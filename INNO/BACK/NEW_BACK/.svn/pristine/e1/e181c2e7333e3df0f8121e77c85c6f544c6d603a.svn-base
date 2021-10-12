<style lang="less">
</style>

<template>
	<div>
		<Card v-if="showModal">
			<div slot="title" class="icard-header">
				<Tooltip content="返回" placement="bottom-start">
					<Icon type="ios-arrow-dropleft" @click="goBack" class="card-back"/>
				</Tooltip>
				返回 | <span style="margin-left: 10px;">设置会员卡</span>
			</div>

			<Alert show-icon>注意：每个公众号最多可以创建25个模板</Alert>
			<Table :loading="tableLoading" :height="tableHeight" :columns="columns" :data="data"></Table>

		</Card>
	</div>
</template>

<script>
export default {
	name: 'tplmessageList',
	components: {
	},
	data () {
		return {
			showModal: false,

			columns:[],
			data:[],
			tableHeight: 500,
			tableLoading: false,
		}
	},
	mounted () {

	},
	methods:{
		// 初始化方法(提供给父组件使用)
		openModal () {
			this.showModal = true;

			// 动态计算表高度
			this.tableHeight = document.body.clientHeight - 340;

			this.loadData();
		},
		// 获取现有的模板ID
		loadData(){
			this.tableLoading = true;
			// ajax 请求获取初始化数据
			this.$ajax.post( this.$api.weixinTemplateIdList, {

			})
			.then( (response) => {
				this.tableLoading = false;
				var res = response.data;

				if( res.code ){
					// 初始化表
					this.initTable( res );

					this.data = res.data.items;
          
				}
			});
		},
		// 初始化表
		initTable( res ){
			this.columns = res.data.columns;

			// 例子
			this.columns[ (this.columns.length-2) ]['render'] = (h, params) => {
				return h('div',{
					style:{
						margin: '10px 0',
					},
					domProps: {
						innerHTML: params.row.example
					}
				});
			}

			// 操作按钮
			this.columns[ (this.columns.length-1) ]['render'] = (h, params) => {
			    var buttons = [];

          if( params.row.related_name != null && params.row.related_name != '' ){
            // 删除
            buttons.push(
              h('span',
                {
                  attrs:{
                    title:'删除模板ID'
                  }
                },
                [ h('span', {
                  class:'table-handle-button',
                  on: {
                    click: () => {
                      this.removeTemplateId(params.index, params.row )
                    }
                  }
                },'删除模板ID') ]
              )
            );
          }
          else{
            buttons.push(
              h('span',
                {
                  attrs:{}
                },
                [ h('span', {
                  class:'table-handle-button',
                },'非系统模板') ]
              )
            );
          }

			    return h('div',buttons);
			}
		},
		// 删除模板ID
		removeTemplateId (index,row){
			this.$Modal.confirm({
		        title: '操作提示',
		        content: '确定删除微信模板消息ID吗？删除后不能恢复！只能重新创建，确定吗？',
		        okText: '确定删除',
		        cancelText: '取消',
		        onOk: () => {

		        	this.tableLoading = true;
		        	// ajax 请求获取数据
		        	this.$ajax.post( this.$api.weixinTemplateIdRemove, {
		        		template_id: row.template_id,
		        	})
		    		.then( (response) => {
					this.tableLoading = false;
		    			var res = response.data;
		    			if( res.code ){
		    				// 修改表数据
		    				this.$delete(this.data, index );
		    				this.$Message.success( res.message );
		    			}

					});

		        }
		    });
		},
		// 返回列表
		goBack(){
			this.showModal = false;
			this.$emit('on-close', {});
		},
	}
}
</script>
