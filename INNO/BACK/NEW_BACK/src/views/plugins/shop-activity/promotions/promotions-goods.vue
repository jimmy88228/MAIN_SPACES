<template>
	<Modal v-model="isShowModal" title="选择商品">
		<Row class="text-r m-bottom-10">
			<Col>
				<DatePicker v-model="goods.datetime" type="datetimerange" placeholder="活动时间段" style="width: 200px"></DatePicker>
				<Input v-model="goods.keyword"  placeholder="货号/条码，支持模糊查询" clearable style="width: 200px"></Input>
				<Button type="primary" @click="changeGoodsPage(1)">搜索</Button>
				<Button type="primary" @click="exportData">导出</Button>
				<Button type="primary" @click="importData" v-if="formItem.is_finish==0">导入</Button>
				<Button type="info" @click="modalShow=true" v-if="formItem.is_finish==0">+添加商品</Button>
			</Col>
		</Row>
		<Table ref="goodsTable" class="goods_list" :columns="goods_column" :loading="tableLoading" :height="tableHeight" :data="goods_data">
		</Table>
		<div style="margin: 10px;overflow: hidden">
			<Button @click="infoShow=false">返回</Button>
			<div style="float: right;">
				<Page :total="goodsTotal" :page-size="goods.pageSize" :current="goods.page" @on-change="changeGoodsPage" show-total></Page>
			</div>
			<div class="fr">每页条数&nbsp;&nbsp;<InputNumber v-model="goods.pageSize" :step="5" :precision="0" :active-change="false" @on-change="changeGoodsPage(-1)"></InputNumber></div>
		</div>
	</Modal>
</template>
<script>
	import 
	export default{
		data(){
			isShowModal: false,
			formItem: {
				id:0,
				is_enabled:'0',
				active_name:'',
				execution_date:''
			},
			ruleValidate:{
				active_name: [ { required: true, message: '活动名称不能为空！', trigger: 'blur' } ],
			},
		},
		methods:{
			showModal(){
				this.isShowModal = true;
			},
			exportData(){
				
			},
			importData(){
				this.$UIModule({
					mode: 'batch-import',
					options: {
						canCreate: {
							upload: true,
							download: true
						},
						uploadUrl: "",
						downloadUrl: "",
					},
					success:()=>{
						
					}
				})
			}
		}
	}
</script>
<style lang="less">
	
</style>