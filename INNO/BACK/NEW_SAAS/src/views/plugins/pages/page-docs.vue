<style lang="less">
.page-docs{
	
}	
</style>

<template>
	<div>
		<Card class="page-docs">
			<Row type="flex" style="margin-bottom: 10px;">
				<Col style="flex:1 1 0%;">
					
				</Col>
				<Col style="width:170px;text-align: right;">
					<Button type="info" @click="downLoadExcel" id="downLoadExcel">导出文档</Button>
					<Button icon="md-refresh" @click="initData" shape="circle" title="刷新列表"></Button>
				</Col>
			</Row>
			
			<Table row-key="name" :loading="tableLoading" :columns="columns" :data="data" id="page-docs"></Table>
		</Card>
	</div>
</template>

<script>
export default {
    components: {

	},
    data() {
        return {
			columns: [],
			tableLoading: false,
			data: [],
		}
	},
	methods: {
		initData(){
			this.tableLoading = true;
			this.$ajax.post( this.$api.goodsPageDocs, {
				isInit: 1
			})
			.then( response => {
				this.tableLoading = false;
				let res = response.data;
				if (res.code) {
					this.columns = res.data.columns;
					
			        this.data = res.data.items;
			    }
			});
		},
		// 下载excel
		downLoadExcel(){
			this.tableLoading = true;
			this.$ajax.post( this.$api.goodsPageDocs, {
				download: 1
			})
			.then( response => {
				this.tableLoading = false;
				let res = response.data;
				if (res.code) {
					location.href= res.data ;
			    }
			});
		}
	},
	mounted () {
		this.initData();
	}
}
</script>	