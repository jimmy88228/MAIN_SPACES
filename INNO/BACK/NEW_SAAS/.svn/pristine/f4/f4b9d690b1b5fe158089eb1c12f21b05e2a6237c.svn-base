<template>
	<div>
		<div class="flex f-align-center f-just-between m-bottom-15">
			<div>
				<Input
						class="search_input"
						v-model="formSearch.searchq"
						placeholder="请输入名称/货号"
						clearable
						search
						enter-button
						@on-search="searchPage"
						@on-clear="searchPage"
						@keydown.native.enter.prevent>
							<Select v-model="formSearch.searchqType" slot="prepend" style="width: 100px;">
								<Option value="goods_name" >商品名称</Option>
								<Option value="goods_sn" >商品货号</Option>
							</Select>
						</Input>
			</div>
			<div>
				<Button type="primary" @click="addGoods" v-if="canCreate.add">
					<Icon type="md-add" />&nbsp;发布商品
				</Button>
				<Button type="primary" @click="importGoods" v-if="canCreate.import">
					<Icon type="md-cloud-upload" />&nbsp;导入商品
				</Button>
				<Button type="primary" @click="exportGoods" v-if="canCreate.export">
					<Icon type="md-cloud-download" />&nbsp;导出商品
				</Button>	
				<Button icon="md-refresh" @click="searchPage" shape="circle" title="刷新列表"></Button>
			</div>
			
		</div>
		<BatchImport ref="batchImport" @on-success="onImportSuccess"></BatchImport>
		<!--异步处理导出excel组件-->
		<div class="col">
			<notice :ref="'notice' + item" @finish="searchPage" v-for="item in jobIdCol" :key="item"></notice>
		</div>
	</div>
</template>
<script>
	import notice from '@/views/my-components/mq-notice/mq-notice';
	import BatchImport from '@/views/my-components/batch-import/batch-import';
	export default{
		props: {
			canCreate:{
				type: Object,
				default(){
					return {}
				}
			}
		},
		components:{
			notice,
			BatchImport
		},
		data(){
			return {
				formSearch:{
					searchq: "",
					searchqType: "goods_name"
				},
				jobIdCol: []
			}
		},
		methods:{
			searchPage(){
				this.$emit("search", this.formSearch)
			},
			addGoods(){
				this.$emit("addGoods");
			},
			exportGoods(){
				this.$Modal.confirm({
					title: '操作提示',
					content: '确定导出数据么',
					okText: '确定',
					cancelText: '取消',
					onOk: () => {
						return this.$ajax.post(this.$api.MatrixPrizeGoodsExport).then((response) => {
								var res = response.data;
								if (res.code) {
									var jobId = res.data;
									// 打开异步提示组件
									this.jobIdCol.push(jobId);
									this.$nextTick(() => {
										this.$refs[`notice${jobId}`][0].showNotice(jobId);
									});
									this.$Message.success(res.message);
								} else {
									this.$Message.error(res.message);
								}
						});
					}
				});
			},
			importGoods(){
				this.$refs.batchImport.openModal({upload: this.canCreate.import, download: this.canCreate.import}, this.$api.MatrixPrizeGoodsImport, this.$api.MatrixPrizeGoodsTpl);
			},
			onImportSuccess(){
				
			}
		}
	}
</script>