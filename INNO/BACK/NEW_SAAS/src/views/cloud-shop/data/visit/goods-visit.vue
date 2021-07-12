
<template>
  <Card class="goods-visit-page statistics-page">
	<stats-back type="store" :isBack="false" :showHead="true" :data="storeList" @on-changeData="changeStore"></stats-back>
	<goodsForm 
	:formSearch="formSearch"
	@on-search="searchData" 
	@on-handleExport="handleExport"
	></goodsForm>
    <div class="model-area">
      <Row type="flex" justify="center" >
          <div class="total-item" v-for="(item, index) in totalData" :key="index">
            <p class="total-name">{{ item.name }}</p>
            <p class="total-val">{{ item.data }}</p>
          </div>
      </Row>
    </div>
    <Divider orientation="left">商品效果</Divider>
	<Table :max-height="500" :columns="columns" :data="tableData" @on-sort-change="getSort" ref="myTable">
		<template slot-scope="{ row }" slot="goodsInfo">
			<div class="img_list_wrap">
				<p class="img_fixed" v-if="row.group_img"><img :src="row.group_img" /></p>
				<p class="sort_wrapper text-clamp3">{{ row.group_name }}</p>
			</div>
		</template>
	</Table>
	<div v-show="pageTotal" class="list_page">
		<Page
		:total="pageTotal"
		:page-size="pageSize"
		:current="currentPage"
		:page-size-opts="pageSizeOpts"
		@on-change="e => changePage(e)"
		@on-page-size-change="ps => handlePageSize(ps)"
		show-elevator
		show-total
		show-sizer></Page>
	</div>
	<!--异步处理导出excel组件-->
    <div class="col">
      <notice :ref="'notice' + item" @finish="handleFinish" v-for="item in jobIdCol" :key="item"></notice>
    </div>
  </Card>
</template>

<script>
import util from '@/libs/util.js';
import goodsMixin from './mixins/goodsMixin.js';
import PageHelper from '@/libs/page-helper.js';
import notice from '@/views/my-components/mq-notice/mq-notice';
import goodsForm from './search-form/goods-form';
import statsBack from '@/views/data/components/stats-back';
import storeMixin from '@/views/cloud-shop/data/storeMixin';
export default {
	name: 'goodsVisit',
	mixins: [PageHelper, goodsMixin, storeMixin],
	components: {notice, goodsForm, statsBack},
	data () {
		return {
			formSearch:{
				start_time: "",
				end_time: "",
				styleType: 1,
				sortField: "visits",
				sortBy: "ASC"
			},
			jobIdCol: [],
		}
	},
	watch: {
		timeRangeV(newData) {
			this.dateRange = this.getFixDate(newData);
		}
	},
	computed: {},
	mounted(){
		this.initParams();
		this.loadData();
	},
	methods: {
		initParams(){
			let query = this.$route.query || {};
			this.brandId = query.brandId;
			this.brandName = query.brandName;
		},
		searchData(formData){
			this.formSearch = formData || this.formSearch;
			this.loadData();
		},
		onLoadData(page, extData){
			let params = {
				...this.formSearch,
				is_desc: this.is_desc,
				sortField: this.sortField,
				storeIds: this.storeIds,
				...extData
			}
			this.showSpin = true;
			return util.ajax.post(util.apiUrl.CloudGoodsVisitView, params).then(e =>{
				let res = e.data || {};
				if(res.code) {
					let data = res.data || {};
					let sum = data.sumary;
					for(let i = 0; i < this.totalData.length; i++){
						let key = this.totalData[i].key;
						this.totalData[i].data = sum[key] || 0;
					}
					this.data = {
						total: data.total,
						items: data.items
					}
					return Promise.resolve();
				}
				return Promise.reject();
			}).finally(()=>{
				this.showSpin = false
			})
		},
		getSort(sort){
			this.is_desc = sort.order == "desc" ? 1 : 0;
			this.sortField = sort.key;
			this.loadData();
		},
		handleFinish () {
			// 异步下载结束后刷新
			this.loadData();
			this.currentPage = 1;
		},
		handleExport () {
			this.$Modal.confirm({
				title: '操作提示',
				content: '确定导出数据么',
				okText: '确定',
				cancelText: '取消',
				onOk: () => {
					return this.$ajax.post(this.$api.CloudGoodsVisitExport,{
						...this.formSearch,
						sortField: this.sortField,
						is_desc: this.is_desc,
						storeIds: this.storeIds,
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
	}
}
</script>

