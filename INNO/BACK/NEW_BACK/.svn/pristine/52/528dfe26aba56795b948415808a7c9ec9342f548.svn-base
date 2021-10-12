<style lang="less">
	.cron {
		.table-topbar {
			margin-bottom: 10px;
		}
	}
</style>

<template>
	<Card class="cron">
		<div class="table-topbar">
			<Row>
				<Col span="14">
					<Alert type="error">
			
					进行下面操作前，请确保 queue:listen 进程和 cron:listen 进程是开启的<br />
					linux 下queue和cron都做到了shell，每N秒触发一次cron；<br />
					windows下queue 做到了service，cron 为计划任务一分钟触发一次；<br />
					如果心跳日志不是连续的，那么说明cron 没有触发成功
		
					</Alert>
				</Col>
				<Col span="10">
				</Col>
			</Row>
		</div>

		<Table :loading="tableLoading" :height="tableHeight" :columns="columns" :data="data"></Table>

	</Card>
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
				tableLoading: false
			}
		},
		methods: {
			init() {
				// 动态计算表高度
				this.tableHeight = document.body.clientHeight - 220;

				this.tableLoading = true;
				// ajax 请求获取初始化数据，然后动态更新下面数据源
				util.ajax.post(util.apiUrl.cronList, {
						isInit: 1
					})
					.then((response) => {
						this.tableLoading = false;
						var res = response.data;

						if (res.code) {
							this.columns = res.data.columns;

							this.columns[2].render = (h, params) => {
								var buttons = [];
								var spans = [];
								spans.push(
									h('span', {
										slot: 'open'
									}, '启用')
								);
								spans.push(
									h('span', {
										slot: 'close'
									}, '禁用')
								);
								buttons.push(h('i-switch', {
									props: {
										size: 'large',
										value: (params.row.enable == 1)
									},
									on: {
										'on-change': (val) => {
											this.editCron(params.index, params.row, val)
										}
									}
								}, spans));
								return h('div', {
									style: {
										textAlign: 'center'
									}
								}, buttons);
							};

							// 操作按钮
							this.columns[(this.columns.length - 1)].render = (h, params) => {
								var buttons = [];

								if (params.row.handle.exec && params.row.enable == true) {
									// 查看按钮
									buttons.push(h('Button', {
										props: {
											type: 'primary',
											size: 'small'
										},
										style: {
											marginRight: '5px'
										},
										on: {
											click: () => {
												this.execCron(params.index, params.row);
											}
										}
									}, '立即执行'));
								}
								if (params.row.handle.log) {
									// 查看按钮
									buttons.push(h('Button', {
										props: {
											type: 'success',
											size: 'small'
										},
										style: {
											marginRight: '5px'
										},
										on: {
											click: () => {
												this.$router.push('/system/cron-log/' + params.row.code);
											}
										}
									}, '查看日志'));
								}
								return h('div', {
									style: {
										textAlign: 'center'
									}
								}, buttons);
							}

							// 初始化表数据
							this.data = res.data.items;
						}
					});
			},
			// 编辑任务
			editCron(index, row, val) {
				this.tableLoading = true;

				// ajax 请求获取初始化数据，然后动态更新下面数据源
				util.ajax.post(util.apiUrl.cronEdit, {
						code: row.code,
						enable: (val == true ? 1 : 0)
					})
					.then((response) => {
						this.tableLoading = false;
						var res = response.data;
						if (res.code) {
							this.$set(this.data[index], 'enable', val);

							this.$Notice.success({
								title: '操作成功',
								desc: res.message
							});
						} else {
							this.$Notice.error({
								title: '操作失败',
								desc: res.message
							});
						}
					});
			},
			// 执行任务
			execCron(index, row) {
				this.tableLoading = true;

				// ajax 请求获取初始化数据，然后动态更新下面数据源
				util.ajax.post(util.apiUrl.cronExec, {
						code: row.code
					})
					.then((response) => {
						this.tableLoading = false;
						var res = response.data;
						if (res.code) {
							this.$Notice.success({
								title: '操作成功',
								desc: res.message
							});
						} else {
							this.$Notice.error({
								title: '操作失败',
								desc: res.message
							});
						}
					});
			}
		},
		mounted() {
			this.init();
		}
	};
</script>
