<template>
	<div>
			<Row class="flex" :gutter="10">
				<Col :md="24" :lg="6">
					<Row class-name="home-page-row1" style="height:100%;">
					    <Col :md="12" :lg="24" :style="{marginBottom: '10px', height: '100%'}">
					        <Card style="height:100%">
					            <Row type="flex" class="user-infor">
					                <Col span="8">
					                    <Row class-name="made-child-con-middle" type="flex" align="middle">
					                        <img class="avator-img" :src="info.avatar_format" />
					                    </Row>
					                </Col>
					                <Col span="16" style="padding-left:6px;">
					                    <Row class-name="made-child-con-middle" type="flex" align="middle">
					                        <div>
					                            <b class="card-user-infor-name">{{info.name}}</b>
					                            <p style="text-align: center;">{{info.wx_nick_name}}</p>
					                        </div>
					                    </Row>
					                </Col>
					            </Row>
					            <Divider />
					            <Row class="m-top-10">
					                <Col span="8"><p class="notwrap">上次登录时间:</p></Col>
					                <Col span="16" class="padding-left-8 text-r">{{info.last_login}}</Col>
					            </Row>
											<Row class="m-top-10">
												<Col span="8"><p class="notwrap">绑定手机:</p></Col>
												<Col span="16" class="padding-left-5 notwrap text-r">
													<span v-if="(info.mobile!=''?true:false)">{{info.mobile}}</span>
													<Button v-else size="small" @click="goUserCenter">去绑定</Button>
												</Col>
											</Row>
					            <Row class="m-top-10">
					                <Col span="8"><p class="notwrap notwrap">绑定微信：</p></Col>
					                <Col span="16" class="padding-left-5 text-r">
					                	<span v-if="(info.wx_nick_name != '' && info.wx_nick_name != null)">{{info.wx_nick_name}}</span>
					                	<Button v-else size="small" @click="goUserCenter">去绑定</Button>
					                </Col>
					            </Row>
					        </Card>
					    </Col>
					</Row>
				</Col>
				<Col :md="24" :lg="18">
						<Row :gutter="5">
							<Col flex="1" :style="{marginBottom: '10px'}">
									<infor-card
											id-name="all_users"
											:end-val="userTotal.all_users"
											iconType="md-contacts"
											color="#E04E5F"
											intro-text="总会员"
									></infor-card>
							</Col>
								<Col flex="1" :style="{marginBottom: '10px'}">
										<infor-card
												id-name="totday_users"
												:end-val="userTotal.totday_users"
												iconType="md-person-add"
												color="#2d8cf0"
												intro-text="今日新增会员"
										></infor-card>
								</Col>
								<Col flex="1" :style="{marginBottom: '10px'}">
										<infor-card
												id-name="yesterday_users"
												:end-val="userTotal.yesterday_users"
												iconType="md-person-add"
												color="#64d572"
												:iconSize="50"
												intro-text="昨天新增会员"
										></infor-card>
								</Col>
								<Col flex="1" :style="{marginBottom: '10px'}">
										<infor-card
												id-name="cur_month"
												:end-val="userTotal.cur_month"
												iconType="md-person-add"
												color="#ffd572"
												intro-text="当月新增会员"
										></infor-card>
								</Col>
								<Col flex="1" :style="{marginBottom: '10px'}">
										<infor-card
												id-name="alive_past_nigty_days"
												:end-val="userTotal.alive_past_nigty_days"
												iconType="md-desktop"
												color="#f25e43"
												intro-text="活跃会员-过去90天"
										></infor-card>
								</Col>
						</Row>
						<Row>
							<Col style="width:100%">
								<Card>
								    <p slot="title" class="card-title">
								        <Icon type="ios-shuffle-strong"></Icon>
								        过去30天新增会员数
								    </p>
								    <div class="line-chart-con" style="height:250px;">
								        <service-requests :data="monthData" :total="userTotal"></service-requests>
								    </div>
								</Card>
							</Col>
						</Row>
				</Col>
			</Row>
			<Row :gutter="10" class="margin-top-10">
			    <Col :md="24" :lg="8" :style="{marginBottom: '10px'}">
							<topRank :data="storeTopRank" dataKey="store_code" dataVal="users" title="店铺会员总数排名"></topRank>
			    </Col>
			    <Col :md="24" :lg="8" :style="{marginBottom: '10px'}">
							<topRank :data="[]" dataKey="store_code" dataVal="users" title="智慧支付店铺排名TOP10"></topRank>
			    </Col>
			    <Col :md="24" :lg="8">
							<topRank :data="todayTopRang" dataKey="store_code" dataVal="users" title="今日新增会员数排名TOP10"></topRank>
			    </Col>
			</Row>
	</div>
</template>
<script>
	import cityData from '../map-data/get-city-value.js';
	import inforCard from './inforCard.vue';
	import mapDataTable from './mapDataTable.vue';
	import serviceRequests from './serviceRequests.vue';
	import dataSourcePie from './dataSourcePie.vue';
	import visiteVolume from './visiteVolume.vue';
	import topRank from './topRank.vue';
	export default{
		props:['info', 'data'],
		components:{ 
			inforCard,
			mapDataTable,
			serviceRequests,
			dataSourcePie,
			visiteVolume,
			topRank
		},
		data(){
			return {
				cityData: cityData,
			}
		},
		computed:{
			userTotal(){
				let data = this.data || {};
				return data.secondStaticUsersEntity || {
					alive_past_nigty_days: 0,
					all_users: 0,
					cur_month: 0,
					totday_users: 0,
					yesterday_users: 0
				}
			},
			storeTopRank(){
				let data = this.data || {};
				return data.topStoreUsersEntities || [];
			},
			todayTopRang(){
				let data = this.data || {};
				return data.topTodayStoreUsersEntities || [];
			},
			monthData(){
				let data = this.data || {};
				return data.staticUsersByDayEntities || [];
			}
		},
		watch:{},
		methods:{
			goUserCenter() {
			  this.$router.push('/settings/ownspace');
			}
		}
	}
</script>