<style lang="less">
	.reward-record-area {
		// overflow: hidden;
		// background-color: #ffffff;
		// margin: 10px;
		// border-radius: 10px;
		// min-height: 500px;
		.input_style {
			margin: 5px;
			float: left;
		}

		.input_style_table_que {
			margin-top: 20px;
			margin-left: 10px;
			margin-right: 10px;
			overflow: hidden;
		}
		.store-btn {
			width:200px;
		}
		.page_style {
			text-align: center;
			margin: 0 auto;
			margin-top: 10px;
			margin-bottom: 10px;
		}

		.input_style_table {
			margin-top: 10px;
			margin-left: 20px;
			margin-right: 20px;
		}

		.page_style {
			text-align: center;
			margin-bottom: 20px;
		}

		.radio_div {
			height: 200px;
			overflow: scroll;
			overflow: auto;
		}

		.colorshow {
			color: #bfc2c5;
			margin-left: 3px;
			height: 20px;
		}

		.card_style {
			margin: 20px;
		}

		.card_son {
			width: 200px;
			float: left;
			margin: 10px;
		}

		.ivu-col-span-11 {
			width: 100%;
		}

		// .ivu-card.ivu-card-bordered {
		// 	height: 150px;
		// }

		.colorshow {
			margin-bottom: 5px;
		}
	}
</style>
<template>
	<pageTopBase class="reward-record-area">
		<!-- <Spin size="large" fix v-if="spinShow"></Spin> -->
		<div style="margin:10px;">
			<!-- <div>
		<Button @click="gotoBlack" >返回</Button>
	</div> -->

			<div class="table-topbar">
					<Form class="flex" >
						<FormItem label="日期">
							<!-- <dateSelect ></dateSelect> -->
							<date-select ref="dateSelect" :customDate="[formSearch.start_time, formSearch.end_time]"  class="inline-b space-nowrap" @sT="handleStart" @eT="handleEnd" />
							<!-- <DatePicker type="datetimerange" v-model="formSearch.searchTime" format="yyyy/MM/dd" placeholder="选择日期" style="width: 210px"></DatePicker> -->
						</FormItem>&nbsp;&nbsp;
						<FormItem label="所属店铺" class="flex">
							<!-- <AutoComplete v-model="formSearch.store" :clearable="true" :filter-method="filterMethod"
								:data="storeList" placeholder="选择店铺" @on-select="selectStore" @on-change="clearStore"
								style="width:200px;" v-if="0">
							</AutoComplete>
							<Select v-model="formSearch.store_id" filterable clearable>
								<Option value="0">全部</Option>
								<Option v-for="item in storeList" :value="item.id" :key="item.id">
									{{ item.name }}（{{item.code}}）</Option>
							</Select> -->
							<Tag type="dot" class="store-btn" closable color="primary" v-if="formSearch.store_id" @on-close="removeStore">{{formSearch.store_name}}</Tag>
							<Button type="dashed" class="store-btn" @click="selectStore" v-else>所属店铺</Button>
						</FormItem>&nbsp;&nbsp;

						<FormItem label="搜索">
							<div class="flex">
								<!-- <Input v-model="formSearch.search" @on-clear="changePage(1)" style="width:200px;"
									placeholder="请输入分销员代码" clearable enter-button>
										
								</Input> -->
								<Input class="basic_input" v-model="formSearch.searchq" placeholder="请输入分销员代码" clearable search enter-button
								@on-search="loadData" @on-clear="loadData" @keydown.native.enter.prevent />&nbsp;
									
								<!-- <Button type="info" @click.native="changePage(1)">搜索</Button> -->
								<Button type="primary" @click="explode(1)">导出</Button>
							</div>
						</FormItem>
					</Form>
			</div>

			<!-- <div class="input_style_table_que">
		<Table border :columns="tableHeader" :data="messageData" :loading="loading" ref="selections">
		</Table>
	</div>
	    	 
	<div class="page_style">
			<Page :total="number" :page-size="page_size" show-total @on-change="getlist"></Page>
	</div> -->
			<Table border :height="tableHeight" :columns="columns" :data="tableData" :loading="tableLoading">

			</Table>
			<div v-show="pageTotal" class="list_page">
				<Page :total="pageTotal" :page-size="pageSize" :current="currentPage" :page-size-opts="pageSizeOpts"
					@on-change="e => changePage(e)" @on-page-size-change="ps => handlePageSize(ps)" show-elevator
					show-total show-sizer></Page>
			</div>
		</div>
		<!--异步处理导出excel组件-->
		<div class="col">
		  <notice :ref="'notice' + item" @finish="loadData" v-for="item in jobIdCol" :key="item"></notice>
		</div>
	</pageTopBase>
</template>

<script>
	import Cookies from 'js-cookie';
	// import util from '@/libs/util.js';
	import Mixin from './record-mixin.js';
	import PageHelper from '@/libs/page-helper.js';
	import dateSelect from '@/views/my-components/date-select/index.vue';
	import notice from '@/views/my-components/mq-notice/mq-notice';
	import pageTopBase from "@/views/my-components/page-top-base/index.vue";
	export default {
		components: {
			dateSelect,
			notice,
			pageTopBase
		},
		mixins: [PageHelper, Mixin],
		data() {
			return {
				spinShow: false,
				loading: false,
				tableHeader: [],
				messageData: [],
				keyword: '',
				page_size: 15,
				number: 0,
				listType: {},
				messageshow: '',
				formSearch: {
					searchq: '',
					start_time: '',
					end_time: '',
					store_id: 0,
				},
				storeList: [],
				jobIdCol:[],
				editId: 0,
			}
		},
		methods: {
			initParams(){
				let query = this.$route.query || {};
				this.editId = query.id || 0;
			},
			handleStart(date){
				this.formSearch.start_time = date;
			},
			handleEnd(date){
				this.formSearch.end_time = date;
			},
			explode() {
				this.$Modal.confirm({
					title: '操作提示',
					content: '确定导出数据么',
					okText: '确定',
					cancelText: '取消',
					onOk: () => {
						let formSearch = this.formSearch;
						this.$store.commit("setLoading", true);
						return this.$ajax.post(this.$api.distributionActivityAwardRecordExport,{
							...formSearch,
							id: this.editId,
							isExport: 1,
							// page: 1,
							// pageSize: 20
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
						}).finally(()=>{
							this.$store.commit("setLoading", false);
						})
					}
				});
			},
			removeStore(){
				this.$set(this.formSearch, 'store_id', 0);
				this.$set(this.formSearch, 'store_name', "");
				this.$set(this.formSearch, 'store', "");
				this.$set(this.formSearch, 'store_code', "");
			},
			selectStore(option) {
				let formSearch = this.formSearch || {};
				this.$selectContent({
					mode: 'store',
					type: 'radio',
					data: [{
						id: formSearch.store_id,
						name: formSearch.store_name
					}],
					getList:(data)=>{
						console.log("data", data);
						let info = data[0] || {};
						this.$set(this.formSearch, 'store_id', info.id);
						this.$set(this.formSearch, 'store_name', info.name);
						this.$set(this.formSearch, 'store', info.name);
						this.$set(this.formSearch, 'store_code', info.store_code);
					}
				})
			},
			onLoadData(page, data){
				this.$store.commit("setLoading", true);
				return this.$ajax.post(this.$api.distributionActivityAwardRecord, {
					...this.formSearch,
					id: this.editId,
					...data
				}).then((response)=>{
					let res = response.data || {};
					if(res.code){
						let data = res.data || {};
						this.data = {
							items: data.items,
							total: data.total
						}
					}
				}).finally(()=>{
					this.$store.commit("setLoading", false);
				})
			},

		},
		mounted() {
			this.initParams();
			this.loadData(0);
			// this.getStoreList();
		}
	}
</script>
