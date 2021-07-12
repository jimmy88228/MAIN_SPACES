<style lang="less">
.jobs-list{
}
</style>

<template>
	<Card class="jobs-list">

		<div class="table-topbar">
			<Row type="flex" style="margin-bottom: 10px;">
		        <Col style="width:500px;">

            </Col>
		        <Col style="flex:1 1 0%;text-align: right;">
          <Button icon="md-refresh" @click="init" shape="circle" title="刷新列表"></Button>
				</Col>
		    </Row>
		</div>

		<Table :loading="tableLoading" :height="tableHeight" :columns="columns" :data="data"></Table>
		<div v-show="pageTotal>0" class="table-pager-footer">
	        <div style="float: right;">
	            <Page :total="pageTotal" :page-size="pageSize" :current="1" @on-change="changePage" show-total></Page>
	        </div>
	    </div>

	</Card>
</template>

<script>
export default {
	components: {

	},
	data () {

		return {
			columns:[],
			data:[],
			tableHeight: 500,
			tableLoading: false,
			pageTotal: 0,
			pageSize: 20,
		}
	},
	methods: {
		// 初始化方法
		init () {
			// 动态计算表高度
			this.tableHeight = document.body.clientHeight - 200;

			this.tableLoading = true;
			// ajax 请求获取初始化数据
			this.$ajax.post( this.$api.jobsList, {
				isInit: 1,
			})
			.then( (response) => {
				this.tableLoading = false;
				var res = response.data;

				if( res.code ){

					this.columns = res.data.columns;

					// 执行结果
					this.columns[ 1 ]['render'] = (h, params) => {
						var text = params.row.job_result != null && params.row.job_result_format.percent == 100 
            ? '已处理完毕' : params.row.job_result_format.message;
						return h('span', {

						}, text);
					};

					this.columns[ 2 ]['render'] = (h, params) => {
						var text = ( params.row.status == 1 || params.row.status == 0) && params.row.job_result != null 
            ? params.row.job_result_format.percent + '%' : '异常';
						return h('span', {

						}, text);
					};

					// 状态标识
					this.columns[ (this.columns.length-2) ]['render'] = (h, params) => {
						const row = params.row;
						const color = row.status_color;
						const text = row.status_name;

						return h('Tag', {
							props: {
								type: 'dot',
								color: color
							}
						}, text);
					};

					// 操作按钮
					this.columns[ (this.columns.length-1) ]['render'] = (h, params) => {
						var buttons = [];

						if( params.row.job_result != null && params.row.status == 1 && params.row.job_result_format.isDownload == 1 ){

							// 按钮
							buttons.push(
								h('span',
									{
										attrs:{
											title:'下载文件'
										}
									},
							        [ h('span', {
							            class:'table-handle-button',
							            on: {
							                click: () => {
							                    window.open( params.row.job_result_format.downloadUrl );
							                }
							            }
							        },'下载') ]
								)
							);
						}
						return h('div', buttons.length > 0 ? buttons : '-');
					}

					// 初始化表数据
					this.data = res.data.items;
					this.pageTotal = Number( res.data.total );
					this.pageSize = Number( res.data.pageSize );
				}

			});
		},
		// 切换分页
		changePage ( page ) {

			this.tableLoading = true;
			// ajax 请求获取数据
			this.$ajax.post( this.$api.jobsList, {
				page:page,
			})
			.then( (response) => {
				var res = response.data;
				if( res.code ){
					// 初始化表数据
					this.data = res.data.items;
					this.pageTotal = Number( res.data.total );
					this.pageSize = Number( res.data.pageSize );
				}

				this.tableLoading = false;
			});
		},
	},
	mounted () {
		this.init();
	},
}
</script>
