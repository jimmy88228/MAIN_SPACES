<style lang="less">
	.system-log{
	.table-topbar{
	    .ivu-form-item{
	        margin-bottom: 10px;
	    }
	    .ivu-input-icon-clear{
		right:50px;
	    }
	}
}
</style>

<template>
	<div class="system-log">
		<Card>
			<div class="table-topbar">
				<Row type="flex">
					<Col style="flex:1 1 0%;">
						<Form ref="formSearch" :model="formSearch" inline>
							<FormItem v-show="false">
								<Select v-model="formSearch.logType" placeholder="请选择日志类型" style="width:130px" clearable>
									<Option v-for="(item, key) in logTypeList" :value="key" :key="key">{{ item.name }}</Option>
								</Select>
							</FormItem>
							<FormItem>
								<Select v-model="formSearch.logLevel" placeholder="日志错误等级" style="width:130px" clearable>
									<Option v-for="(item, key) in logLevel" :value="key" :key="key">{{ item }}</Option>
								</Select>
							</FormItem>
							<FormItem>
								<DatePicker v-model="formSearch.searchTime" type="datetimerange" format="yyyy-MM-dd HH:mm" placeholder="请选择日志时间"
								 style="width:245px"></DatePicker>
							</FormItem>
							<FormItem>
								<Input v-model="formSearch.searchq" placeholder="日志内容" style="width:150px" clearable search enter-button
								 @on-search="searchPage" @on-clear="searchPage" @keydown.native.enter.prevent="searchPage"></Input>
							</FormItem>
						</Form>
					</Col>
					<Col style="width:60px;text-align: right;">
						<Button icon="md-refresh" @click="init" shape="circle" title="刷新列表"></Button>
					</Col>
				</Row>
			</div>

			<Table :loading="tableLoading" :height="tableHeight" :columns="columns" :data="data"></Table>
			<div v-show="pageTotal>0" style="margin: 10px;overflow: hidden">
				<div style="float: right;">
					<Page :total="pageTotal" :page-size="pageSize" :current="1" @on-change="changePage" show-total></Page>
				</div>
			</div>
		</Card>

		<Modal v-model="modalShow" :title="modalTitle" :loading="modalLoading" :footer-hide="modalFooterHide" :width="700"
		 @on-ok="modalOk">

			<Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="100">

				<FormItem label="日志状态" prop="logStatus">
					<i-switch v-model="formItem.logStatus" size="large">
						<span slot="open">已处理</span>
						<span slot="close">未处理</span>
					</i-switch>
				</FormItem>
				<FormItem label="备注信息" prop="adminRemark">
					<Input type="textarea" :rows="4" v-model="formItem.adminRemark" placeholder="请填写备注信息"></Input>
				</FormItem>
			</Form>
		</Modal>
	</div>
</template>

<script>
	import util from '@/libs/util.js';

	export default {
		components: {

		},
		data() {
			return {
				columns: [],
				data: [],
				tableHeight: 500,
				tableLoading: false,
				pageTotal: 0,
				pageSize: 20,

				logTypeList: [],
				logLevel: [],

				adminUserList: [],
				formSearch: {
					searchq: '',
					logType: '',
					logLevel: '',
					searchTime: ''
				},

				// 模态框
				modalShow: false,
				modalTitle: '',
				modalLoading: true,
				modalEditIndex: '',
				modalFooterHide: false,

				// 表单内容
				formItem: {
					logStatus: false,
					adminRemark: ''
				},

				// 表单数据规则
				ruleValidate: {
					adminRemark: [{
						required: true,
						message: '备注信息不能为空',
						trigger: 'blur'
					}]
				}
			}
		},
		methods: {
			init() {
				// 动态计算表高度
				this.tableHeight = document.body.clientHeight - 210;

				this.tableLoading = true;
				// ajax 请求获取初始化数据，然后动态更新下面数据源
				util.ajax.post(util.apiUrl.systemLogList, {
						isInit: 1
					})
					.then((response) => {
						this.tableLoading = false;
						var res = response.data;

						if (res.code) {
							this.columns = res.data.columns;

							// 文字颜色
							this.columns[2].render = (h, params) => {
								var spanColor = params.row.log_level == 'ERROR' ? '#ed3f14' :
									params.row.log_level == 'WARN' ? '#ff9900' :
									params.row.log_level == 'INFO' ? '#2d8cf0' : 'auto';
								return h('div', [
									h('strong', {
										style: {
											color: spanColor
										}
									}, params.row.log_level)
								]);
							};

							// 处理结果
							this.columns[(this.columns.length - 3)].render = (h, params) => {
								// const row = params.row;
								// const color = row.log_status == 1 ? 'error' : row.log_status == 2 ? 'success' : 'error';
								// const text = row.log_status == 1 ? '未处理' : row.log_status == 2 ? '已处理' : '未知状态';

								return h('div', {

									}, (params.row.nick_name != null ? params.row.nick_name + ' : ' : '') +
									params.row.admin_remark != null ? params.row.admin_remark : '');
							};

							// 处理状态
							this.columns[(this.columns.length - 2)].render = (h, params) => {
								const row = params.row;
								const color = row.log_status == 1 ? 'error' : row.log_status == 2 ? 'success' : 'error';
								const text = row.log_status == 1 ? '未处理' : row.log_status == 2 ? '已处理' : '未知状态';

								return h('Tag', {
									props: {
										type: 'dot',
										color: color
									}
								}, text);
							};

							// 操作按钮
							this.columns[(this.columns.length - 1)].render = (h, params) => {
								var buttons = [];

								if (params.row.handle.edit) {
									// 编辑按钮
									buttons.push(h('span', {
										class: 'table-handle-button',
										on: {
											click: () => {
												this.editLog(params.index, params.row, true);
											}
										}
									}, '编辑'));
								}

								return h('div', {
									style: {
										textAlign: 'center'
									}
								}, buttons);
							}

							// 初始化表数据
							this.data = res.data.items;
							this.pageTotal = Number(res.data.total);
							this.pageSize = Number(res.data.pageSize);

							// 初始化类型
							this.logTypeList = res.data.logTypeList;
							// 错误等级
							this.logLevel = res.data.logLevel;
						}
					});
			},
			// 切换分页
			changePage(page) {
				this.tableLoading = true;
				// ajax 请求获取数据，然后动态更新下面数据源
				util.ajax.post(util.apiUrl.systemLogList, {
						searchq: this.formSearch.searchq,
						searchType: this.formSearch.logType,
						searchTime: this.formSearch.searchTime,

						page: page
					})
					.then((response) => {
						var res = response.data;
						if (res.code) {
							// 初始化表数据
							this.data = res.data.items;
							this.pageTotal = Number(res.data.total);
							this.pageSize = Number(res.data.pageSize);
						}

						this.tableLoading = false;
					});
			},
			// 搜索日志
			searchPage() {
				this.tableLoading = true;
				// ajax 请求获取数据，然后动态更新下面数据源
				util.ajax.post(util.apiUrl.systemLogList, {
						searchq: this.formSearch.searchq,
						searchType: this.formSearch.logType,
						searchLevel: this.formSearch.logLevel,
						searchTime: this.formSearch.searchTime
					})
					.then((response) => {
						var res = response.data;
						if (res.code) {
							// 初始化表数据
							this.data = res.data.items;
							this.pageTotal = Number(res.data.total);
							this.pageSize = Number(res.data.pageSize);
						}

						this.tableLoading = false;
					});
			},
			// 编辑按钮
			editLog(index, row, showFooter) {
				this.modalEditIndex = index;
				// 打开编辑模态框
				this.openModal(row);
				this.showBatch = false;

				if (showFooter == true) {
					this.modalFooterHide = false;
					this.modalTitle = '修改日志';
				} else {
					// 屏蔽 确定按钮
					this.modalFooterHide = true;
					this.modalTitle = '查看日志';
				}
			},
			// 打开模态框
			openModal(row) {
				this.modalShow = true;

				// 重置表单
				this.$refs.formValidate.resetFields();

				this.modalTitle = '日志信息';

				// 初始化表单数据
				this.formItem.logId = Number(row.id);
				this.formItem.logStatus = (row.log_status != 1);
				this.formItem.adminRemark = row.admin_remark;
			},
			// 模态框确认事件
			modalOk() {
				this.$refs.formValidate.validate((valid) => {
					if (valid) {
						util.ajax.post(util.apiUrl.systemLogEdit, {
								logId: this.formItem.logId,
								logStatus: (this.formItem.logStatus == true ? 2 : 1),
								adminRemark: this.formItem.adminRemark
							})
							.then((response) => {
								var res = response.data;
								if (res.code) {
									// 初始化表数据
									this.pageTotal = Number(res.data.total);
									this.modalShow = false;

									this.$Message.success(res.message);
									this.$Notice.success({
										title: '操作成功',
										desc: res.message
									});

									// 修改：更新data 数据即可,更新数据用 this.$set()
									this.$set(this.data[this.modalEditIndex], 'log_status', (this.formItem.logStatus == true ? 2 : 1));
									this.$set(this.data[this.modalEditIndex], 'admin_remark', this.formItem.adminRemark);
								} else {
									this.modalShow = true;
									this.$Message.error(res.message);
									this.modalLoading = false;

									setTimeout(() => {
										this.modalLoading = true;
									}, 50);
								}
								this.tableLoading = false;
							});
					} else {
						// 验证失败，不关闭模态框
						this.modalShow = true;
						this.$Message.error('必填项不能为空！');
						this.modalLoading = false;

						setTimeout(() => {
							this.modalLoading = true;
						}, 50);
					}
				});
			}
		},
		mounted() {
			this.init();
		}
	};
</script>
