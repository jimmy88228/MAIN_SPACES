<style lang="less">
	.activty-reward-area {
		overflow: hidden;
		background-color: #ffffff;
		margin: 10px;
		border-radius: 10px;
		min-height: 500px;

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

		.ivu-card.ivu-card-bordered {
			height: 150px;
		}

		.colorshow {
			margin-bottom: 5px;
		}
	}
</style>
<template>
	<Card class="activty-reward-area">
		<Form class="flex f-just-between">
			<FormItem>
				<Input class="basic_input" v-model="formSearch.searchq" placeholder="请输入活动名称" clearable search enter-button
				@on-search="loadData" @on-clear="loadData" @keydown.native.enter.prevent />
			</FormItem>
			<FormItem>
				<Button type="primary" @click="gotoMesssage(0)" icon="md-add">创建活动</Button>
			</FormItem>
		</Form>
		<div style="margin:10px;">
			<!-- <div class="oh" style="margin:10px;border-radius: 10px;background-color:#efefef;line-height: 60px;">
				<div style="margin-left:20px;display: block;">
					<div class="input_style">
						<div class="colorshow" style="color: #181818;">搜索</div>
						<Input v-model="searchOne.keyword" placeholder="活动名称" clearable style="width: 320px" />
						<Button type="primary" icon="ios-search" @click="getlist(0)">搜索</Button>
					</div>
					<div class="input_style" style="float:right;margin-right:20px;">
						<div class="colorshow" style="color: #181818;"></div>
						<Button type="primary" @click="gotoMesssage(0)" icon="md-add">创建活动</Button>
					</div>
				</div>
			</div> -->
			

			<div class="input_style_table_que">
				<!-- :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable" -->
				<Table border :columns="columns" :height="tableHeight" :data="tableData" :loading="tableLoading">
					<template slot-scope="{ row, index }" slot="from_time">
						<div class="flex f-just-center">
							<p class="f-shrink0" style="width:90px;">{{row.from_time}}</p> - 
							<p class="f-shrink0" style="width:90px;">{{row.to_time}}</p>
						</div>
					</template>
					<template slot-scope="{ row, index }" slot="switch">
						<!-- <i-switch v-model="row.is_enabled" true-value="1" false-value="0" :before-change="setState(row)">
							<span slot="open">开启</span>
							<span slot="close">关闭</span>
						</i-switch> -->
						<Button size="small" @click="setState(row)" :type="row.is_enabled == 1 ? 'primary' : 'error'">{{row.is_enabled == 1 ? '开启' : '关闭'}}</Button>
					</template>
					<template slot-scope="{ row, index }" slot="action">
						<!--  -->
						<div class="v-lines">
							<!-- <template v-if="row.handle.status"><a @click="gotoStart(row.id,0,'您确定要执行该方案吗？',row)">执行</a><span class="v-line"> | </span></template> -->
							<template v-if="row.handle.edit"><a @click="gotoMesssage(row.id)">编辑</a><span class="v-line"> | </span></template>
							<template v-if="row.handle.remove"><a @click="deleteMessage(row.id)">删除</a><span class="v-line"> | </span></template>
							<template v-if="row.handle.record"><a @click="gotoActivityRecord(row.id)">活动记录</a><span class="v-line"> | </span></template>
						</div>
						<!-- <span style="margin-right: 5px;color:#2cb7ef;cursor:pointer;" v-show="row.implement==1 "
							@click="gotoStart(row.id,0,'您确定要执行该方案吗？',row)">执行</span>
						<span style="margin-right: 5px;color:#2cb7ef;cursor:pointer;" v-show="row.stop==1 "
							@click="gotoStart(row.id,3,'您确定要停止该方案',row)">停止</span>
						<span style="margin-right: 5px;color:#2cb7ef;cursor:pointer;"
							@click="gotoMesssage(row.id)">编辑</span>
						<span style="margin-right: 5px;color:#2cb7ef;cursor:pointer;"
							@click="deleteMessage(row.id)">删除</span>
						<span style="margin-right: 5px;color:#2cb7ef;cursor:pointer;"
							@click="gotoActivityRecord(row.id)">活动记录</span> -->
					</template>
				</Table>
			</div>

			<!-- <div class="page_style">
				<Page :total="number" :page-size="page_size" show-total @on-change="getlist"></Page>
			</div> -->
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
		</div>
	</Card>
</template>

<script>
	import Mixin from './mixin.js';
	import PageHelper from '@/libs/page-helper.js';
	export default {
		mixins: [PageHelper, Mixin],
		data() {
			return {
				formSearch: {
					searchq: ""
				},
			}
		},
		methods: {
			onLoadData(page, data){
				this.$store.commit("setLoading", true);
				return this.$ajax.post(this.$api.distributionActivityAwardList, {
					searchq: this.formSearch.searchq,
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
			gotoMesssage(id) {
				this.$router.push({
					name: 'distribution-activity-award-message',
					query: {
						id: id
					}
				});
			},
			gotoActivityRecord(id) {
				this.$router.push({
					name: 'distribution-activity-award-record',
					query: {
						id: id
					}
				});
			},
			setState(row){
				this.tableLoading = true;
				let is_enabled = row.is_enabled == 1 ? 0 : 1
				return this.$ajax.post(this.$api.distributionActivityAwardStatus, {
					id: row.id,
					enable: is_enabled
				}).then((response)=>{
					let res = response.data || {};
					if(res.code){
						this.$set(this.tableData[row._index], 'is_enabled', is_enabled);
						this.$Message.success(res.message);
						return Promise.reject();
					}
					this.$Message.warning(res.message);
					return Promise.reject();
				}).finally(()=>{
					this.tableLoading = false;
				})
			},
			deleteMessage(id, index) {
				this.$Modal.confirm({
					title: '删除提示',
					content: '确定删除该活动信息吗？',
					okText: '确定删除',
					cancelText: '取消',
					onOk: () => {
						this.tableLoading = true;
						this.$ajax.post(this.$api.distributionActivityAwardRemove, {
							id: id,
						}).then((response)=>{
							let res = response.data || {};
							if(res.code){
								this.$Message.success(res.message);
								return this.loadData();
							} else {
								this.$Message.success(res.message);
							}
						}).finally(()=>{
							this.tableLoading = false;
						})
					}
				});
			},
			// gotoStart(id, status, title, row) {
			// 	this.$Modal.confirm({
			// 		title: '提示',
			// 		content: title,
			// 		okText: '确定',
			// 		cancelText: '取消',
			// 		onOk: () => {
			// 			this.loading = true;
			// 			this.tableLoading = true;
			// 			this.$ajax.post(this.$api.distributionActivityAwardStatus, {
			// 				id: id,
			// 			}).then((response)=>{
			// 				console.log("gotoStart", response)
			// 			})
			// 			return;
			// 			util.ajax.post(util.apiHost + '/DistributionTemplate/PullActivityStatus', {
			// 					id: id,
			// 					status: status,
			// 					mess: row,
			// 				})
			// 				.then((response) => {
			// 					var res = response.data;
			// 					this.loading = false;
			// 					this.$Message.info(res.message);
			// 					this.getlist(0);
			// 				});
			// 			//row.is_enabled=status;

			// 		}
			// 	});
			// },
		},
		mounted() {
			this.loadData();
		}
	}
</script>
