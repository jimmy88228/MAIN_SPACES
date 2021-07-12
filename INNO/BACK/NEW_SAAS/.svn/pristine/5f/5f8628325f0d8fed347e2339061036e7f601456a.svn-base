<style lang="less">
@import "./home.less";
@import "../../styles/common.less";
</style>
<template>
    <Card class="home-main">
			<Tabs value="member-data" name="home-main-tab">
					<TabPane label="会员数据看板" name="member-data" tab="home-main-tab">
						<memberData :info="info" :data="homeUserData"></memberData>
					</TabPane>
					<TabPane label="订单数据看板" name="order-data" tab="home-main-tab">
						<orderData :data="homeOrderData"></orderData>
					</TabPane>
			</Tabs>
        <!-- <Row :gutter="10">
            <Col :md="24" :lg="8">
                <Row class-name="home-page-row1" :gutter="10">
                    <Col :md="12" :lg="24" :style="{marginBottom: '10px'}">
                        <Card>
                            <Row type="flex" class="user-infor">
                                <Col span="8">
                                    <Row class-name="made-child-con-middle" type="flex" align="middle">
                                        <img class="avator-img" :src="avatarFormat" />
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
                            <Row class="margin-top-8">
                                <Col span="8"><p class="notwrap">上次登录时间:</p></Col>
                                <Col span="16" class="padding-left-8">{{info.last_login}}</Col>
                            </Row>
                            <Row class="margin-top-8">
                                <Col span="5"><p class="notwrap">绑定手机:</p></Col>
                                <Col span="7" class="padding-left-5 notwrap">
                                	<span v-if="(info.mobile!=''?true:false)">{{info.mobile}}</span>
                                	<Button v-else size="small" @click="goUserCenter">去绑定</Button>
                                </Col>
                                <Col span="5"><p class="notwrap notwrap">绑定微信：</p></Col>
                                <Col span="7" class="padding-left-5">
                                	<span v-if="(info.wx_nick_name != '' && info.wx_nick_name != null)">{{info.wx_nick_name}}</span>
                                	<Button v-else size="small" @click="goUserCenter">去绑定</Button>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col :md="12" :lg="24" :style="{marginBottom: '10px'}"></Col>
                </Row>
            </Col>

            <Col :md="24" :lg="16">
                <Row :gutter="5">
                    <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                        <infor-card
                            id-name="user_created_count"
                            :end-val="count.createUser"
                            iconType="android-person-add"
                            color="#2d8cf0"
                            intro-text="今日新增用户"
                        ></infor-card>
                    </Col>
                    <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                        <infor-card
                            id-name="visit_count"
                            :end-val="count.visit"
                            iconType="ios-eye"
                            color="#64d572"
                            :iconSize="50"
                            intro-text="今日用户登录数"
                        ></infor-card>
                    </Col>
                    <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                        <infor-card
                            id-name="collection_count"
                            :end-val="count.collection"
                            iconType="upload"
                            color="#ffd572"
                            intro-text="今日新增设备数"
                        ></infor-card>
                    </Col>
                    <Col :xs="24" :sm="12" :md="6" :style="{marginBottom: '10px'}">
                        <infor-card
                            id-name="transfer_count"
                            :end-val="count.transfer"
                            iconType="shuffle"
                            color="#f25e43"
                            intro-text="今日设备报警数"
                        ></infor-card>
                    </Col>
                </Row>
                <Row>
                    <Card :padding="0">
                        <p slot="title" class="card-title">
                            <Icon type="map"></Icon>
                            今日服务调用地理分布
                        </p>
                        <div class="map-con">
                            <Col span="10">
                                <map-data-table :cityData="cityData" height="281" :style-obj="{margin: '12px 0 0 11px'}"></map-data-table>
                            </Col>
                            <Col span="14" class="map-incon">
                                <Row type="flex" justify="center" align="middle">
                                    <home-map :city-data="cityData"></home-map>
                                </Row>
                            </Col>
                        </div>
                    </Card>
                </Row>
            </Col>
        </Row> -->

        <!-- <Row :gutter="10" class="margin-top-10">
            <Col :md="24" :lg="8" :style="{marginBottom: '10px'}">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="android-map"></Icon>
                        上周每日来访量统计
                    </p>
                    <div class="data-source-row">
                        <visite-volume></visite-volume>
                    </div>
                </Card>
            </Col>
            <Col :md="24" :lg="8" :style="{marginBottom: '10px'}">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="ios-pulse-strong"></Icon>系统来源统计
                    </p>
                    <div class="data-source-row">
                        <data-source-pie></data-source-pie>
                    </div>
                </Card>
            </Col>
            <Col :md="24" :lg="8">
                <Card>
                    <p slot="title" class="card-title">
                        <Icon type="android-wifi"></Icon> 终端来源统计
                    </p>
                    <div class="data-source-row">
                        <data-source-pie></data-source-pie>
                    </div>
                </Card>
            </Col>
        </Row> -->
        <!-- <Row class="margin-top-10">
            <Card>
                <p slot="title" class="card-title">
                    <Icon type="ios-shuffle-strong"></Icon>
                    上周新增设备数
                </p>
                <div class="line-chart-con">
                    <service-requests></service-requests>
                </div>
            </Card>
        </Row> -->
    </Card>
</template>

<script>
import cityData from './map-data/get-city-value.js';
import homeMap from './components/map.vue';
import dataSourcePie from './components/dataSourcePie.vue';
import visiteVolume from './components/visiteVolume.vue';
import serviceRequests from './components/serviceRequests.vue';
import userFlow from './components/userFlow.vue';
import countUp from './components/countUp.vue';
import inforCard from './components/inforCard.vue';
import mapDataTable from './components/mapDataTable.vue';
import toDoListItem from './components/toDoListItem.vue';
import memberData from './components/memberData.vue';
import orderData from './components/orderData.vue';
import util from '@/libs/util.js';

/**
 * home 模块
 * @module home
 */
export default {
  name: 'home',
  components: {
    homeMap,
    dataSourcePie,
    visiteVolume,
    serviceRequests,
    userFlow,
    countUp,
    inforCard,
    mapDataTable,
    toDoListItem,
		memberData,
		orderData
  },
  data () {
    return {
      arr: [1,2,3],
        	info: {
        		mobile: '',
        		wx_nick_name: '',
        		last_login: ''
        	},
      toDoList: [
        {
          title: '去学习组件'
        }
      ],
      cityData: cityData,
      showAddNewTodo: false,
      newToDoItemValue: '',
      // avatarFormat: '',
			homeUserData: {},
			homeOrderData: {}
    };
  },
  computed: {
    avatorPath () {
      return window.localStorage.avatorImgPath;
    }
  },
  methods: {
		init () {
			// ajax 请求获取数据，然后动态更新下面数据源
			util.ajax.post(util.apiUrl.homeTables)
			.then((response) => {
				var res = response.data;
				if (res.code) {
					// 初始化图表数据
					let data = res.data || {};
					this.info = data;
					this.avatarFormat = data.avatar_format;
					this.homeUserData = data.home_table_user_data || {};
					this.homeOrderData = data.home_table_order_data || {};
				}
			});
		},
		// getData(){
		// 	util.ajax.post(util.apiUrl.homeTableData)
		// 	.then((response) => {
		// 		var res = response.data;
		// 		if (res.code) {
		// 			// 初始化图表数据
		// 			this.info = res.data;
		// 			this.avatarFormat = res.data.avatar_format;
		// 		}
		// 	});
		// },
    addNewToDoItem () {
      this.showAddNewTodo = true;
    },
    addNew () {
      if (this.newToDoItemValue.length !== 0) {
        this.toDoList.unshift({
          title: this.newToDoItemValue
        });
        setTimeout(() => {
          this.newToDoItemValue = '';
        }, 200);
        this.showAddNewTodo = false;
      } else {
        this.$Message.error('请输入待办事项内容');
      }
    },
    cancelAdd () {
      this.showAddNewTodo = false;
      this.newToDoItemValue = '';
    },
    goUserCenter () {
        	this.$router.push('/settings/ownspace');
    }
  },
  mounted () {
    this.init();
  }
};
</script>
