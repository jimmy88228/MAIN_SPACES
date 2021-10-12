<style lang="less">
	.questionnaire_page {
		position: relative;
		margin: 20px 20px 20px 20px;

		.input_style {
			margin: 10px;
			float: left;
		}

		.input_style_right {
			margin: 10px;
			float: right;
		}

		.input_style_table_que {

			margin-top: 20px;
			margin-left: 10px;
			margin-right: 10px;
			overflow: hidden;
		}

		.input_style_table_que table {
			width: 100%;
		}

		.page_style {
			text-align: center;
			margin: 0 auto;
			margin-top: 10px;
			margin-bottom: 10px;
		}

	}

	.body_one {
		overflow: hidden;
		background-color: #ffffff;
		margin: 10px;
		border-radius: 10px;
	}
</style>

<template>
	<div class="body_one">
		<div class="questionnaire_page">
			<Spin size="large" fix v-if="spinShow"></Spin>
			<Tabs :animated="false" v-model="this_tab">
				<TabPane label="所有投票调查" name="tabPane1">
					<div class="oh">
						<div class="input_style">
							<Button type="primary" @click="gotoinsert">新建投票调查</Button>
						</div>
						<div class="input_style_right">
							<Button type="primary" icon="ios-search" @click="searchmessage">搜索</Button>
						</div>
						<div class="input_style_right">
							<Input v-model="key" placeholder="关键字模糊查询" clearable style="width: 200px"></Input>
						</div>
					</div>
					<div class="input_style_table_que" id="show">
						<Table border :columns="allquestion" :data="all"></Table>
					</div>

					<div class="page_style">
						<Page :total="allnumber" :page-size="page_size" show-total @on-change="changePage"></Page>
					</div>
				</TabPane>
				<TabPane label="已经结束">
					<div class="oh">
						<div class="input_style">
							<Button type="primary" @click="gotoinsert">新建投票调查</Button>
						</div>
					</div>
					<div class="input_style_table_que">
						<Table border :columns="endquestion" :data="end"></Table>
					</div>

					<div class="page_style">
						<Page :total="endnumber" :page-size="page_size" show-total @on-change="changePageend"></Page>
					</div>

				</TabPane>
				<TabPane label="正在运行">
					<div class="oh">
						<div class="input_style">
							<Button type="primary" @click="gotoinsert">新建投票调查</Button>
						</div>
					</div>
					<div class="input_style_table_que">
						<Table border :columns="startquestion" :data="start"></Table>
					</div>

					<div class="page_style">
						<Page :total="startnumber" :page-size="page_size" show-total @on-change="changePagestart">
						</Page>
					</div>
				</TabPane>
				<TabPane label="未开始">
					<div class="oh">
						<div class="input_style">
							<Button type="primary" @click="gotoinsert">新建投票调查</Button>
						</div>
					</div>
					<div class="input_style_table_que">
						<Table border :columns="begquestion" :data="beg"></Table>
					</div>

					<div class="page_style">
						<Page :total="begnumber" :page-size="page_size" show-total @on-change="changePagebeg"></Page>
					</div>
				</TabPane>
			</Tabs>
		</div>
		<div>
		</div>
		<div>
			<Modal title="微信二维码" v-model="modalcopy" @on-ok="ok2()">
				<img :src="imageViewUrl" style="width: 100%">

			</Modal>
		</div>
		<template v-if="!this_tab">
			<deitQuestionnaire :serverUrl="serverUrl" :type="type" :voteData="activitymesage"
				v-on:editQuestionnaireCallback="editQuestionnaireCallback"></deitQuestionnaire>
		</template>
		<Spin v-if="showPageSpin" :fix="true"></Spin>
		<Modal title="图片预览" footer-hide v-model="imageViewShow" :width="imageViewWidth">
			<img :src="imageViewUrl" v-if="imageViewShow" style="width: 100%">
		</Modal>
		<Modal title="小程序二维码" footer-hide width="300" v-model="appletInfo.showAppletModal" class="appletModal">
			<div>
				<Select v-model="appletInfo.appid">
					<Option v-for="item in appletList" :value="item.appid" :key="item.cfg_id">{{item.applet_name}}
					</Option>
				</Select>
				<div>&nbsp;</div>
				<Button type="info" @click="appletQrcode">查看小程序二维码</Button>
			</div>
		</Modal>
	</div>

</template>


<script>
	import Cookies from 'js-cookie';
	import util from '@/libs/util.js';
	import deitQuestionnaire from './edit-questionnaire';

	export default {
		components: {
			deitQuestionnaire
		},
		data() {
			return {
				spinShow: false,
				type: '',
				this_tab: "tabPane1",
				showPageSpin: false,
				activitymesage: "",
				serverUrl: {},
				modalcopy: false,
				imageViewUrl: '',
				key: '',
				allquestion: [],
				all: [],
				startquestion: [],
				start: [],
				endquestion: [],
				end: [],
				begquestion: [],
				beg: [],
				allnumber: 0,
				startnumber: 0,
				endnumber: 0,
				begnumber: 0,
				page_size: 15,
				imgServiceUrl: {},

				// 小程序二维码
				appletInfo: {
					appid: '',
					activityId: 0,
					showAppletModal: false
				},
				appletList: [],
				// 图片
				cdnHost: util.cdnHost,
				imageViewWidth: 300,
				imageViewShow: false,
				imageViewUrl: '',
			}
		},

		methods: {
			//初始化
			getlist() {
				this.spinShow = true;
				util.ajax.post(util.apiUrl.activityTable, {
					page: 1,
					pageSize: this.page_size,
					key: this.key,
				}).then((response) => {
					var res = response.data;
					var serverUrl = {};
					this.allquestion = res.tablehead;
					this.all = res.dateall.data;
					serverUrl.del_image_url = res.dateall.del_image_url;
					serverUrl.edit_image_url = res.dateall.edit_image_url;
					serverUrl.up_image_url = res.dateall.up_image_url;
					this.serverUrl = serverUrl;
					this.edittype(this.allquestion, this.allquestion.length, this.all);
					this.allnumber = Number(res.dateall.count);
					this.startquestion = res.tableheadone;
					this.start = res.datestart.data;
					this.edittype(this.startquestion, this.startquestion.length, this.start);
					this.startnumber = Number(res.datestart.count);
					this.endquestion = res.tableheadtwo;
					this.end = res.dateend.data;
					this.edittype(this.endquestion, this.endquestion.length, this.end);
					this.endnumber = Number(res.dateend.count);
					this.begquestion = res.tableheadthree;
					this.beg = res.datebeg.data;
					this.edittype(this.begquestion, this.begquestion.length, this.beg);
					this.begnumber = Number(res.datebeg.count);
					this.spinShow = false;
				});
			},
			changePage(page) { //分页
				util.ajax.post(util.apiUrl.activityGetMore, {
						page: page,
						pageSize: this.page_size,
						key: this.key,
						type: 'all',
					})
					.then((response) => {
						var res = response.data;
						this.all = res.data.data;
						this.allquestion = res.tablehead;
						this.edittype(this.allquestion, this.allquestion.length, this.all);
						this.allnumber = Number(res.data.count);
					});
			},
			changePagestart(page) { //分页
				util.ajax.post(util.apiUrl.activityGetMore, {
						page: page,
						pageSize: this.page_size,
						type: 'start',
					})
					.then((response) => {
						var res = response.data;
						this.start = res.data.data;
						this.startquestion = res.tablehead;
						this.edittype(this.startquestion, this.startquestion.length, this.start);
						this.startnumber = Number(res.data.count);
					});
			},
			changePageend(page) { //分页
				util.ajax.post(util.apiUrl.activityGetMore, {
						page: page,
						pageSize: this.page_size,
						type: 'end',
					})
					.then((response) => {
						var res = response.data;
						this.end = res.data.data;
						this.endquestion = res.tablehead;
						this.edittype(this.endquestion, this.endquestion.length, this.end);
						this.endnumber = Number(res.data.count);
					});
			},
			changePagebeg(page) { //分页
				util.ajax.post(util.apiUrl.activityGetMore, {
						page: page,
						pageSize: this.page_size,

						type: 'beg',
					})
					.then((response) => {
						var res = response.data;
						this.beg = res.data.data;
						this.begquestion = res.tablehead;
						this.edittype(this.begquestion, this.begquestion.length, this.beg);
						this.begnumber = Number(res.data.count);
					});
			},
			edittype(name, length, type) {
				name[(length - 2)]['render'] = (h, params) => {
					const row = params.row;
					const color = row.is_enabled == 1 ? '#08b92f' : '#f93f11';
					const text = row.is_enabled == 1 ? '开启中' : '未开启';
					return h('div', [
						h('Button', {
							props: {
								type: 'primary',
								size: 'small'

							},
							style: {
								background: color,
								border: '0px',
								cursor: 'pointer'
							},
							on: {
								click: () => {
									util.ajax.post(util.apiUrl.activityActivityType, {
										activity_id: type[params.index]['id'],
										is_enabled: type[params.index]['is_enabled'],
									}).then((response) => {
										var res = response.data;
										if (res.code == '1') {
											type[params.index]['is_enabled'] = res.type;
											this.$Message.info(res.message);
										} else {
											this.$Message.info(res.message);
										}

									});
								}
							}
						}, text)
					])
				};

				name[(length - 1)]['render'] = (h, params) => {
					return h('div', [
						h('span', {
							props: {
								type: 'primary',
								size: 'small'
							},
							style: {
								marginRight: '5px',
								color: '#2cb7ef',
								cursor: 'pointer'
							},
							on: {
								click: () => {
									this.copy(type[params.index]['id'])
								}
							}
						}, '复制-'),
						h('span', {
							props: {
								type: 'error',
								size: 'small'
							},
							style: {
								marginRight: '5px',
								color: '#2cb7ef',
								cursor: 'pointer'
							},
							on: {
								click: () => {
									if (type[params.index]['is_enabled'] == '1') {
										this.$Message.info('开启中的活动不能进行编辑！');
									} else if (type[params.index]['activity_num'] > 0 && type[params
											.index]['is_enabled'] == '0') {
										this.$Message.info('开启过的活动中有用户参与，不能进行编辑！');
									} else {
										this.editmessage(type[params.index]['id']);
										this.type = 0;
									}
								}
							}
						}, '编辑-'),
						h('span', {
							props: {
								type: 'error',
								size: 'small'
							},
							style: {
								marginRight: '5px',
								color: '#2cb7ef',
								cursor: 'pointer'
							},
							on: {
								click: () => {
									this.remove(type[params.index]['id'])
								}
							}
						}, '删除-'),
						h('span', {
							props: {
								type: 'error',
								size: 'small'
							},
							style: {
								marginRight: '5px',
								color: '#2cb7ef',
								cursor: 'pointer'
							},
							on: {
								click: () => {
									this.showlink(type[params.index]['id'], type[params.index][
										'mobile_url'
									])
								}
							}
						}, '链接-'),
						h('span', {
							props: {
								type: 'error',
								size: 'small'
							},
							style: {
								marginRight: '5px',
								color: '#2cb7ef',
								cursor: 'pointer'
							},
							on: {
								click: () => {
									var id = type[params.index]['id'];
									// alert( this.$route.params.token);
									this.$router.push('/question/questionmessage/' + id + '/' + Cookies
										.get('accessToken'));
								}
							}
						}, '查看结果-'),
						h('span', {
							props: {
								type: 'error',
								size: 'small'
							},
							style: {
								marginRight: '5px',
								color: '#2cb7ef',
								cursor: 'pointer'
							},
							on: {
								click: () => {
									this.showApplet(params.row);
									// this.weixincode(type[params.index]['id'])
								}
							}
						}, '小程序码-'),
						h('span', {
							props: {
								type: 'error',
								size: 'small'
							},
							style: {
								marginRight: '5px',
								color: '#2cb7ef',
								cursor: 'pointer'
							},
							on: {
								click: () => {
									this.editmessage(type[params.index]['id']);
									this.type = 1;
								}
							}
						}, '查看')


					]);
				};
			},
			//复制
			copy(index) {
				if (confirm("确定要复制该调查吗？")) {

					util.ajax.post(util.apiUrl.activityCopy, {
							activity_id: index,
						})
						.then((response) => {
							var res = response.data;
							if (res.code.code == 1) {
								this.getlist();
							} else {
								this.$Message.info(res.code.msg);
							}

						});
				}
			},
			//删除
			remove(index) {
				if (confirm("确定要删除该调查吗？")) {
					//activityDelActivity
					util.ajax.post(util.apiUrl.activityDelActivity, {
							activity_id: index,
						})
						.then((response) => {
							var res = response.data;
							if (res.code == 1) {
								this.getlist();
								this.$Message.info('删除成功');
							} else {
								this.$Message.info(res.msg);
							}

						});
				}
			},
			//查看链接
			showlink(id, url) {
				// 分享出去的链接必须带上 from=singlemessage，这样微信才会刷新页面
				//url = url.replace('#','?from=singlemessage#');
				url = 'pages/micro_mall/questionnaire/questionnaire?voteActivityId=' + id;
				this.$Modal.confirm({
					title: '活动链接',
					content: '<input value="' + url + '" style="width:100%;border:0px;">',
					okText: '复制',
					cancelText: '取消',
					onOk: () => {
						var some = url; //前端链接
						var oInput = document.createElement('input');
						oInput.value = some;
						document.body.appendChild(oInput);
						oInput.select(); // 选择对象
						document.execCommand("Copy"); // 执行浏览器复制命令
						oInput.className = 'oInput';
						oInput.style.display = 'none';
						this.$Message.info('复制成功');
					},
					onCancel: () => {
						// this.$Message.info('Clicked cancel');
					}
				})

			},
			//二维码    
			weixincode(index) {
				this.modalcopy = true;
				util.ajax.post(util.apiUrl.activityWeixinCode, {
						activity_id: index,
					})
					.then((response) => {
						var res = response.data;
						this.imageViewUrl = res.data.pic_path;

					});
				//this.modalcopy=true;

			},

			//编辑
			editmessage(index) {
				this.showPageSpin = true;
				this.this_tab = "";
				util.ajax.post(util.apiUrl.activityEdit, {
					activity_id: index,
				}).then((response) => {
					var res = response.data;
					this.activitymesage = res.data;
					this.showPageSpin = false;
				});
			},
			//新增
			gotoinsert() {
				// document.getElementById("show").style.display="none";
				// document.getElementById("EleId").style.display="inline";
				// this.$set(this.activitymesage,"voteActivityId",0);
				this.this_tab = "";
				this.activitymesage = {};

			},
			ok2() {
				/*   var some=this.imageViewUrl;//前端链接
                                   var oInput = document.createElement('input');
                                   oInput.value = some;
                                   document.body.appendChild(oInput);
                                   oInput.select(); // 选择对象
                                   document.execCommand("Copy"); // 执行浏览器复制命令
                                   oInput.className = 'oInput';
                                   oInput.style.display='none';
                                   this.$Message.info('复制成功'); */
			},
			searchmessage() { //搜索
				util.ajax.post(util.apiUrl.activitySearch, {
					key: this.key,
				}).then((response) => {
					var res = response.data;
					this.all = res.data.data;
					this.allquestion = res.tablehead;
					this.edittype(this.allquestion, this.allquestion.length, this.all);
					this.allnumber = Number(res.data.count);
				});
			},
			//添加编辑保存
			newactivity() {
				util.ajax.post(util.apiUrl.activityInsert, {
					fromdata: '' //数据结构
				}).then((response) => {
					var res = response.data;
					if (res.code == '1') { //成功

					} else { //失败

					}
				});
			},
			editQuestionnaireCallback() {
				this.this_tab = "tabPane1";
				this.getlist();
			},
			// 小程序
			getAppletList() {
				util.ajax.post(util.apiUrl.appletList).then((response) => {
					if (response.data.code == 1) {
						this.appletList = response.data.data;
					}
				})
			},
			// 小程序二维码,多个小程序则弹出选择框
			showApplet(item) {
				this.appletInfo.activityId = item.id;
				if (this.appletList.length == 1) {
					this.appletInfo.appid = this.appletList[0]['appid'];
					this.appletQrcode();
				} else {
					this.appletInfo.appid = '';
					this.appletInfo.showAppletModal = true;
				}

			},
			appletQrcode() {
				if (!this.appletInfo.appid) {
					this.$Message.error('请选择小程序');
					return false;
				}
				if (!this.appletInfo.activityId) {
					this.$Message.error('参数错误，请刷新重试！');
					return false;
				}
				util.ajax.post(util.apiHost + '/common/getAppletQrcode', {
					appid: this.appletInfo.appid,
					req_id: this.appletInfo.activityId,
					opKind: 'Vote'
				}).then((response) => {
					this.appletInfo.appid = '';
					this.appletInfo.req_id = 0;
					this.appletInfo.showAppletModal = false;
					if (response.data.code == 1) {
						this.imageViewShow = true;
						this.imageViewUrl = response.data.data;
					} else {
						this.$Message.error(response.data.msg);
					}
				})
			},

		},
		mounted() {
			this.getlist();
			this.getAppletList();
		},

	} //结尾
</script>
