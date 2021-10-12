<template>
	<div>
		<div class="flex f-align-center f-just-between m-bottom-15">
			<div>
				<Input
						class="search_input"
						v-model="formSearch.searchq"
						placeholder="请输入名称/编码"
						clearable
						search
						enter-button
						@on-search="searchPage"
						@on-clear="searchPage"
						@keydown.native.enter.prevent/>
			</div>
			<div>
				<Button type="primary" @click="addCoupon" v-if="canCreate.add">
					<Icon type="md-add" />&nbsp;添加优惠券
				</Button>
				<Button type="primary" @click="importCoupon" v-if="canCreate.import">
					<Icon type="md-cloud-upload" />&nbsp;导入优惠券
				</Button>
				<Button type="primary" @click="exportCoupon" v-if="canCreate.export">
					<Icon type="md-cloud-download" />&nbsp;导出
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
					searchq: ""
				},
				jobIdCol: []
			}
		},
		methods:{
			searchPage(){
				this.$emit("search", this.formSearch)
			},
			addCoupon(){
				this.$emit("addCoupon");
			},
			exportCoupon(){
				this.$Modal.confirm({
					title: '操作提示',
					content: '确定导出数据么',
					okText: '确定',
					cancelText: '取消',
					onOk: () => {
						return this.$ajax.post(this.$api.MatrixPrizeBonusExport).then((response) => {
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
			importCoupon(){
				this.$refs.batchImport.openModal({upload: this.canCreate.import, download: this.canCreate.import}, this.$api.MatrixPrizeBonusImport, this.$api.MatrixPrizeBonusTpl);
			},
			onImportSuccess(){
				
			}
		}
	}
</script>