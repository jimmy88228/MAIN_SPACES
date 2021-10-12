<template>
	<div class="user-form">
		<Card>
			<div class="user_edit">
				<Button type="info" @click="userEdit">资料编辑</Button>
				<Button type="warning" @click="showAccountStatic('accountState')">账号变更</Button>
				<Button icon="md-refresh" @click="loadData" shape="circle" title="刷新列表"></Button>
			</div>
			<div class="user_content">
				<titleBar>基本信息</titleBar>
				<div class="user_basic">
					<div class="user_basic_avatar">
						<img class="avatar" :src="userInfo.wx_avatar" v-if="userInfo.wx_avatar" />
						<img class="avatar" src="@rs/images/default-img.jpg" :alt="userInfo.wx_nick_name" v-else></img>
						<p class="user_name">{{userInfo.wx_nick_name}}</p>
					</div>
					<div class="user_basic_info">
						<Form :label-width="100" label-colon>
							<Row class="user_basic_text">
								<Col span="8">
								<FormItem label="性别">
									<p>{{userInfo.sex === '0' ? '男' : '女'}}</p>
								</FormItem>
								<FormItem label="会员名">
									<p>{{userInfo.user_name}}</p>
								</FormItem>
								<FormItem label="绑定手机">
									<p>{{userInfo.mobile_phone ? userInfo.mobile_phone : '--'}}</p>
								</FormItem>
								<FormItem label="会员等级"><a @click="showAccountStatic('userRank')">{{userInfo.user_rank}}</a></FormItem>
								<FormItem label="会员卡号">
									<p>{{userInfo.card_num}}</p>
								</FormItem>
								<FormItem label="生日">
									<p>{{userInfo.birthday}}</p>
								</FormItem>

								<FormItem label="所属分销员">
									<p class="staff-box">
										<span style="float: left;">{{userInfo.with_dstb_name}}({{ userInfo.with_dstb_code }})</span>
										<DistributionStaffSelect v-if="rootHandleDistribution" :data="prevYuan" type="radio" @del-tag="handleTagClose">
											<Button type="dashed" @click="handleUserSelected" class="basic_select edit-distribution" style="border: none; width: 28px;">修改</Button>
										</DistributionStaffSelect>
									</p>
								</FormItem>
                                <FormItem label="修改店铺时间">
									<p>
                                        {{userInfo.store_time}}
                                        <Button type="primary" v-if="userInfo.from_store!=''" size="small" @click.native="getChangeLog('store')">查看修改记录</Button>
                                    </p>
								</FormItem>
								</Col>
								<Col span="8">
								<FormItem label="关注微信">
									<p>{{Number(userInfo.wx_subscribe) ? '是' : '否'}}</p>
								</FormItem>
								<FormItem label="注册来源">
									<p>{{userInfo.user_src ? userInfo.user_src : '--'}}</p>
								</FormItem>
								<FormItem label="平台来源">
									<p>{{userInfo.register_from_format}}</p>
								</FormItem>
								<FormItem label="注册日期">
									<p>{{userInfo.created_at_format}}</p>
								</FormItem>
								<FormItem label="最近访问">
									<p>{{userInfo.last_login_time}}</p>
								</FormItem>
								<FormItem label="资料修改">
									<p>{{userInfo.last_modify}} <a @click="refreshLastModify">更新</a></p>
								</FormItem>
                                <FormItem label="分销关系绑定时间" style="width: 285px;">
                                    <p>{{userInfo.join_time}}</p>
                                </FormItem>
                                <FormItem label="修改店员时间">
                                    <p>
                                        {{userInfo.staff_time}}
                                        <Button type="primary" v-if="userInfo.from_staff_id!=''" size="small" @click.native="getChangeLog('staff')">查看修改记录</Button>
                                    </p>
                                </FormItem>
								</Col>
								<Col span="6">
								<div class="user_store">
									<FormItem label="所属店铺">
										<div>
											<p class="name">{{userInfo.from_store_message && userInfo.from_store_message.name}}</p>
											<a @click="showAccountStatic('storeHistory')">{{userInfo.bind_store_time}}</a>
										</div>
									</FormItem>
								</div>
								<div class="user_staff">
									<FormItem label="所属店员">
										<div>
											<p class="name">{{userInfo.from_staff_message && userInfo.from_staff_message.staff_name ? userInfo.from_staff_message && userInfo.from_staff_message.staff_name : '未填写'}}</p>
											<a @click="showAccountStatic('staffHistory')">{{userInfo.bind_satff_time}}</a>
										</div>
									</FormItem>
								</div>
								<FormItem label="上级会员">
									<p>{{userInfo.up_user}}</p>
								</FormItem>
								<FormItem label="下级人数">
									<p>{{userInfo.downnum}}</p>
								</FormItem>
								</Col>
								<Col span="5">
								<div v-for="item in filterUserColumns" :key="item.value">
									<FormItem :label="item.name">
										<p>{{item.value ? item.value : '--'}}</p>
									</FormItem>
								</div>
								<Tooltip placement="left">
									<a v-if="userInfo.column && userInfo.column.length > 6" class="more">查看更多</a>
									<div slot="content" style="white-space: normal;" class="tool_inner">
										<div v-for="item in userInfo.column" :key="item.value">
											<FormItem :label="item.name">
												<p style="color:#fff;">{{item.value ? item.value : '--'}}</p>
											</FormItem>
										</div>
									</div>
								</Tooltip>
								</Col>
							</Row>
						</Form>
					</div>

                    <div style="clear:both;height:20px;"></div>
                    <div style="margin-bottom:10px;">
                        <Tabs type="card">
                            <TabPane label="账户变更">
                                <Table :columns="phone_change.column" :data="phone_change.data"></Table>
                            </TabPane>
                            <TabPane label="会员等级">
                                <Table :columns="user_rank.column" :data="user_rank.data"></Table>
                            </TabPane>
                        </Tabs>
                    </div>
				</div>
				<titleBar>会员标签</titleBar>
				<div class="user_tags">
					<Tag v-for="item in userTag" :key="item.id" type="dot" color="primary" size="large">{{item.tag_name}}</Tag>
				</div>
				<titleBar>会员资产</titleBar>
				<div class="user_assets flex">
					<Col span="5">
					<div class="user_assets_item user_point">
						<p>积分</p>
						<p class="user_assets_item_val" @click="showAccountDynamic('userPointList')" title="点击查看流水"><a>{{userInfo.pay_points}}</a></p>
						<Poptip placement="right" width="320" v-model="popVisible" v-if="rootHandlePoint">
							<p><a>调整积分</a></p>
							<div slot="title" class="user_point_title">调整积分</div>
							<div slot="content">
								<div class="user_point_content">
									<label class="sign_before">数量：</label>
									<Input class="point_input" type="number" placeholder="请输入要加/减的积分值" v-model="givePoint.number" />
									<div style="margin-left:50px;">
										<div>例如：增加10积分：输入10</div>
										<div>例如：减少10积分：输入-10</div>
									</div>
								</div>
								<div class="user_point_content">
									<label class="sign_before">备注：</label>
									<Input class="reason" type="textarea" placeholder="备注原因" v-model="givePoint.reason" />
								</div>
								<div style="text-align: right;">
									<Button size="small" type="text" @click="popCancel">取消</Button>
									<Button size="small" type="primary" @click="popConfirm">确认</Button>
								</div>
							</div>
						</Poptip>
					</div>
					</Col>
					<Col span="5">
					<div class="user_assets_item user_point">
						<p>余额</p>
						<p class="user_assets_item_val" @click="showAccountDynamic('userBalance')" title="点击查看流水"><a>{{userInfo.account_balance}}</a></p>
						<Poptip placement="right" width="320" v-model="popVisibleMoney" v-if="rootHandleMoney">
							<p><a>调整余额</a></p>
							<div slot="title" class="user_point_title">调整余额</div>
							<div slot="content">
								<div class="user_point_content">
									<label class="sign_before">数量：</label>
									<Input class="point_input" type="number" placeholder="请输入要加/减的余额值" v-model="accountBalance.number" />
								</div>
								<div class="user_point_content">
									<label class="sign_before">备注：</label>
									<Input class="reason" type="textarea" placeholder="备注原因" v-model="accountBalance.reason" />
								</div>
								<div style="text-align: right;">
									<Button size="small" type="text" @click="popCancelMoney">取消</Button>
									<Button size="small" type="primary" @click="popConfirmMoney">确认</Button>
								</div>
							</div>
						</Poptip>
					</div>
					</Col>
					<Col span="5">
					<div class="user_assets_item">
						<p>储值余额</p>
						<a class="user_assets_item_val" @click="showAccountDynamic('userStoredValue')" title="点击查看流水">{{userInfo.stored_value}}</a>
					</div>
					</Col>
					<Col span="5">
					<div class="user_assets_item">
						<p>优惠券</p>
						<a class="user_assets_item_val" @click="showAccountDynamic('userBonus')" title="点击查看流水">{{userInfo.bonusNum}}</a>
					</div>
					</Col>
                    <Col span="5">
					<div class="user_assets_item">
						<p>红包</p>
                        <a class="user_assets_item_val" @click="showAccountDynamic('userRedpack')" title="点击查看流水">{{userInfo.redpack_total_amount}}元</a>
					</div>
					</Col>
				</div>
				<titleBar>订单信息</titleBar>
				<div class="user_order flex">
					<Col span="8" class="user_order_type">
					<router-link v-if="userInfo.platform_src != 'CLOUD_SHOP'" tag="a" :to="{ name: 'order-list', params: { userId: id }, query: {isErp: 0}}" target="_blank">查看订单</router-link>
					<router-link v-if="userInfo.platform_src == 'CLOUD_SHOP'" tag="a" :to="{ name: 'shop-order-list', params: { userId: id }}" target="_blank">查看订单</router-link>
					</Col>
					<Col span="8" class="user_order_type">
					<router-link v-if="userInfo.platform_src != 'CLOUD_SHOP'" tag="a"  :to="{ name: 'return-order-list', query: {user_id: id}}" target="_blank">查看退单</router-link>
					<router-link v-if="userInfo.platform_src == 'CLOUD_SHOP'" tag="a"  :to="{ name: 'shop-return-order-list', query: {user_id: id}}" target="_blank">查看退单</router-link>
					</Col>
					<Col span="8" class="user_order_type">
					<router-link v-if="userInfo.platform_src != 'CLOUD_SHOP'" tag="a" :to="{ name: 'order-list', params: { userId: id }, query: {isErp: 1}}" target="_blank">ERP购买记录</router-link>
					</Col>
				</div>
			</div>
			<!--加载提示-->
			<Spin size="large" fix v-if="spinShow"></Spin>
			<UserCommonStatic v-if="showInfo" ref="userCommonStatic" :type="type" :user-data="userInfo">
			</UserCommonStatic>
			<UserCommonDynamic v-if="showInfoDyn" ref="userCommonDynamic" :type="typeDyn" :bouns-list="sendType" :user-data="userInfo">
			</UserCommonDynamic>
			<user-edit ref="userEdit" :user-data="userInfo" :store-list="storeList" :handle="handle" @load-data="reload" />
		</Card>
        <Modal title="历史关系" :width="50" v-model="logModal" class="store_staff" footer-hide>
            <Table :loading="logLoading" :height="450" :columns="log_col" :data="log_data"></Table>
        </Modal>
	</div>
</template>

<script>
	import titleBar from '@/views/my-components/title-bar/title-bar';
	// 展示带有表格的数据
	import UserCommonStatic from './user-common-static';
	import UserCommonDynamic from './user-common-dynamic';
	import UserEdit from './user-edit';
    import DistributionStaffSelect from '@/views/my-components/list-component/index-edit';

	export default {
		name: 'userForm',
		props: ['id'],
		components: {
			titleBar,
			UserCommonStatic,
			UserCommonDynamic,
			UserEdit,
            DistributionStaffSelect
		},
		data() {
			return {
				spinShow: false,
				type: 'storeHistory',
				typeDyn: 'userPointList',
				userInfo: {},
                prevYuan: [],
				sendType: {},
				storeList: [],
				rankList: {},
				showInfo: false,
				showInfoDyn: false,
				givePoint: {
					number: '',
					reason: ''
				},
				accountBalance: {
					number: '',
					reason: ''
				},
				popVisible: false,
				popVisibleMoney: false,
				handle: {},
				rootHandlePoint: true,
				rootHandleMoney: true,
                rootHandleDistribution: true,
				userTag: [],
                logModal:false,
                qiweiModal:false,
                log_col:[],
                log_data:[],
                logLoading:false,
                phone_change:{
                    column:[
                        {'title':'新账户', 'key':'to_phone_number', 'align':'center'},
                        {'title':'旧账户', 'key':'from_phone_number', 'align':'center'},
                        {'title':'变更时间', 'key':'create_time', 'align':'center'}
                    ],
                    data:[],
                },
                user_rank:{
                    column:[
                        {'title':'当前等级名称', 'key':'new_rank_name', 'align':'center'},
                        {'title':'旧等级名称', 'key':'old_rank_name', 'align':'center'},
                        {'title':'变更时间', 'key':'change_time', 'align':'center'},
                        {'title':'变更说明', 'key':'remark', 'align':'center'}
                    ],
                    data:[],
                },
			}
		},
		computed: {
			filterUserColumns() {
				return this.userInfo.column && this.userInfo.column.length > 6 ? this.userInfo.column.slice(0, 5) : this.userInfo.column;
			}
		},
		methods: {
            handleUserSelected(selected) {
                this.$selectContent({
                    mode: 'distributionStaff',
                    type: 'radio',
                    data: this.prevYuan,
                    getList: (data) => {
						this.userInfo.with_dstb_name = data[0]['name'];
						this.userInfo.with_dstb_code = data[0]['dstb_staff_phone'];
                        this.prevYuan = [];

                        return this.$ajax.post( this.$api.userEditDistribution,{
                            new_staff_id:data[0]['id'],
                            old_staff_id:this.userInfo.with_dstb_id,
							user_id: this.userInfo.user_id
                        }).then( (response)=>{
                            this.logLoading = false;
                            let res = response.data;
                            if (res.code) {
                                this.$Message.success(res.message);
                            } else {
                                this.$Message.error(res.message);
                            }
                        });
                    }
                });
            },
            handleTagClose(data) {
                this.prevYuan = data;
            },
            getChangeLog(type){
                this.logModal = true;
                this.logLoading = true;
                return this.$ajax.post( this.$api.userStoreStaffChange,{
                    user_id:this.id,
                    type:type
                }).then( (response)=>{
                    this.logLoading = false;
                    console.log(response.data);
                    if (response.data.code==1) {
                        this.log_col = response.data.data.column;
                        this.log_data = response.data.data.items;
                    }
                });
            },
			loadData() {
				this.spinShow = true;
				return this.$ajax.post(this.$api.userEdit, {
						user_id: this.id
					})
					.then(response => {
						const res = response.data;
						if (res.code) {
							this.data = res.data;
							this.userInfo = res.data && res.data.UserInfo;
                            this.phone_change.data = res.data.UserInfo.phone_change_list;
                            this.user_rank.data = res.data.UserInfo.user_rank_list;
							this.storeList = res.data && res.data.storeList;
							this.rankList = res.data && res.data.rankList;
							this.sendType = res.data && res.data.send_type;
							this.handle = res.data && res.data.handle;
							this.userTag = this.userInfo.userTag;
							this.rootHandlePoint = this.handle.edit_point || false;
							this.rootHandleMoney = this.handle.edit_money || false;
							this.rootHandleDistribution = this.handle.edit_distribution || false;
							this.spinShow = false;
						}
					});
			},
			showAccountStatic(type) {
				this.type = type;
				this.showInfo = true;
				this.$nextTick(() => {
					this.$refs.userCommonStatic.openModal();
				});
			},
			showAccountDynamic(type) {
				this.typeDyn = type;
				this.showInfoDyn = true;
				this.$nextTick(() => {
					this.$refs.userCommonDynamic.openModal();
				});
			},
			userEdit() {
				this.$refs.userEdit.openModal();
			},
			popCancel() {
				this.popVisible = false;
			},
			popConfirm() {
				if (!this.givePoint.number) {
					this.$Message.error('请填写积分');
					return false;
				}
				if (!this.givePoint.reason) {
					this.$Message.error('请填写调整原因');
					return false;
				}
				this.popVisible = false;
				return this.$ajax.post(this.$api.userEditOther, {
						user_id: this.id,
						point: this.givePoint.number,
						remark: this.givePoint.reason,
						change_type: 3 // 修改会员积分
					})
					.then(response => {
						const res = response.data;
						if (res.code) {
							this.userInfo.pay_points = res.data.pay_points;
							this.$Message.success(res.message);
						} else {
							this.$Message.error(res.message);
						}
					});
			},
			popCancelMoney() {
				this.popVisibleMoney = false;
			},
			popConfirmMoney() {
				if (!this.accountBalance.number) {
					this.$Message.error('请填写调整余额');
					return false;
				}
				if (!this.accountBalance.reason) {
					this.$Message.error('请填写调整原因');
					return false;
				}
				this.popVisibleMoney = false;
				return this.$ajax.post(this.$api.userEditOther, {
						user_id: this.id,
						money: this.accountBalance.number,
						remark: this.accountBalance.reason,
						change_type: 4 // 修改账户余额
					})
					.then(response => {
						const res = response.data;
						if (res.code) {
							this.userInfo.account_balance = res.data.account_balance;
							this.$Message.success(res.message);
						} else {
							this.$Message.error(res.message);
						}
					});
			},
			refreshLastModify() {
				return this.$ajax.post(this.$api.userEditOther, {
						user_id: this.id,
						change_type: 5 // 新会员资料最后修改时间
					})
					.then(response => {
						const res = response.data;
						if (res.code) {
							this.userInfo.last_modify = res.data.newtime;
							this.$Message.success(res.message);
						} else {
							this.$Message.error(res.message);
						}
					});
			},
			reload() {
				this.loadData();
			}
		},
		mounted() {
			this.loadData();
		}
	}
</script>
<style lang="less" scoped>
	.user-form {
		.user_title {
			display: flex;
			align-items: center;

			.user-form_back {
				margin-right: 20px;
			}
		}

		.user_edit {
			text-align: right;
		}

		.user_content {
			.user_basic {
				padding: 0 20px;

				.user_basic_avatar {
					display: flex;
					align-items: center;
					justify-content: flex-start;

					.avatar {
						display: inline-block;
						width: 60px;
						height: 60px;
						border-radius: 50%;
					}

					.user_name {
						font-size: 16px;
						margin-left: 10px;
					}
				}

				.user_basic_info {
					margin-left: 70px;

					.user_basic_text {
						margin-bottom: 10px;

						.user_store,
						.user_staff {
							display: flex;

							.name {
								margin-bottom: 8px;
							}
						}
					}

					.more {
						display: inline-block;
						width: 100px;
						text-align: right;
						padding: 4px 12px 10px 0;
					}
				}
			}

			.user_add {
				padding: 0 20px;
			}

			.user_tags {
				padding: 0 20px;
			}

			.user_assets {
				height: 72px;
				padding: 0 20px;

				.user_assets_item {
					text-align: center;

					.user_assets_item_val {
						font-size: 22px;
						font-weight: 600;
					}

					&.user_point {
						.user_point_title {
							font-weight: 600;
							font-size: 14px;
							text-align: left;
						}

						.user_point_content {
							text-align: left;
							margin-bottom: 10px;

							.sign_before::before {
								content: '*';
								color: red;
							}

							.point_input,
							.reason {
								width: 200px;
							}
						}
					}
				}
			}

			.user_order {
				padding: 0 20px;
				height: 60px;
				line-height: 60px;

				.user_order_type {
					text-align: center;
				}
			}
		}
	}
	.staff-box{
		display: flex;
		align-items: center;
	}
	.staff-box .edit-distribution{
		color: #2d8cf0;;
	}
</style>
<style lang="less">
	.user-form {
		.ivu-form-item {
			margin-bottom: 4px;
		}

		.ivu-form-item-label {
			white-space: nowrap;
			overflow: hidden;
		}

		.tool_inner {
			.ivu-form-item-label {
				color: #fff;

				.ivu-form-item {
					white-space: pre-wrap;
				}
			}
		}
	}
</style>
