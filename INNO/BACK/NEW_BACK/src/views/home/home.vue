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
			<pendingTip ref="pendingTip"></pendingTip>
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
import pendingTip from './components/pendingTip.vue';
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
		orderData,
		pendingTip
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
					this.$refs["pendingTip"].showModal(this.homeOrderData.totalOrderEntity);
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
