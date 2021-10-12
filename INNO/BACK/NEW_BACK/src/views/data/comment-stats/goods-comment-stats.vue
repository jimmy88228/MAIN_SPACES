<style lang="less">
  
</style> 

<template>
  <Card>
		<stats-back style="margin-top:-15px;" :isBack="brandId" :type="brandId ? 'brand':''" :data="{id: brandId, name: brandName}" @on-changeData="changeBrand"></stats-back>
		<div class="page-divider m-bottom-10">微商城评论统计</div>
		<searchForm :formData="formData" :currTabKey="commentTabs[currTab].key" @searchData="searchData" @handleExport="handleExport"></searchForm>
		<div>
			<commentModule 
			commentType="goods" 
			ref="commentModule" 
			:commentTabs="commentTabs" 
			:currTab="currTab" 
			@changeTab="changeTab"
			@changePage="changePage"
			></commentModule>
		</div>
		<!--异步处理导出excel组件-->
		<div class="col">
			<notice :ref="'notice' + item" @finish="searchData" v-for="item in jobIdCol" :key="item"></notice>
		</div>
  </Card>
</template>

<script>
import searchForm from './search-form/search-form.vue';
import commentModule from './components/comment-module.vue';
import notice from '@/views/my-components/mq-notice/mq-notice';
import statsBack from '@/views/data/components/stats-back';
import Conf from '@/config/index.js';
export default {
	name: 'goodsCommentStats',
    components: {
			searchForm,
			commentModule,
			notice,
			statsBack
    },
    data () {
			let that = this;
      return {
				formData: {
					type: 1, //判断请求哪个接口 1.商品评价汇总 2.商品评价明细 3.服务评价汇总 4.服务评价明细 
					start_time: '',  //开始时间 默认 7天
					end_time: '', //结束时间 默认 7天
					searchq:'',   //搜索参数
					searchq_type: '1', //搜索类型 默认1 2 3
					level_kind: '0',  //评论类型 默认0
					from_level: '1', //最小星级 默认1 
					to_level: '1', //最大星级 默认1
					pageSize: (this.$store && this.$store.state && this.$store.state.app.pageSize) || Conf.PAGE_SIZE_DEF,
					page: 1
				},
				commentTabs: [
					{
						name: '商品评价汇总',
						key: 1,
					},
					{
						name: '商品评价明细',
						key: 2,
					},
					{
						name: '服务评价汇总',
						key: 3,
					},
					{
						name: '服务评价明细',
						key: 4,
					}
				],
				currTab: 0,
				commentData: [],
				brandId: 0,
				brandName: "",
				jobIdCol: []
      }
    },
    methods: {
			initParams(){
				let query = this.$route.query || {};
				this.brandId = query.brandId || 0;
				this.brandName = query.brandName || "";
			},
			changeTab(index){
				this.currTab = index;
				this.formData.type = this.commentTabs[index].key;
				this.formData.page = 1;
				this.getData();
			},
			changePage(extraData){
				this.getData(extraData);
			},
			getData(extraData = {}){
				this.$refs["commentModule"].setLoading(true);
				return this.$ajax.post(this.$api.commentStatsGoods, {
					...this.formData,
					brand_id: this.brandId || 0,
					...extraData
				}).then((response)=>{
					console.log("response", response);
					let res = response.data || {};
					if(res.code){
						let data = res.data || {};
						data.page = extraData.page || 1
						this.$refs["commentModule"].setData(data);
					}
				}).finally(()=>{
					this.$refs["commentModule"].setLoading(false);
				})
			},
			handleExport () {
				this.$Modal.confirm({
					title: '操作提示',
					content: '确定导出数据么',
					okText: '确定',
					cancelText: '取消',
					onOk: () => {
						let formSearch = this.formSearch;
						return this.$ajax.post(this.$api.commentStatsGoodsExport,{
							...this.formData,
							brand_id: this.brandId || 0,
						}).then((response) => {
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
			searchData(formData){
				this.formSearch = formData || this.formSearch;
				this.getData();
			},
			changeBrand(data){
				if(data){
					let brandInfo = data[0] || {};
					this.brandId = brandInfo.brandId;
					this.brandName = brandInfo.brandName;
					this.getData();
				}
			}
    },
		mounted(){
			this.initParams();
			this.searchData();
		}
}
</script>