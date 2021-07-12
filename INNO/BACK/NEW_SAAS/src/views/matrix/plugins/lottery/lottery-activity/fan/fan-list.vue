<template>
  <div class="fan-list">
    <Card>
      <Row>
        <Col span="12">
          <SearchForm ref="search" @on-search="searchPage"></SearchForm>
        </Col>
        <Col span="12" class="btn-group">
          <Button type="primary" icon="md-add" @click="createActivity">添加活动</Button>
        </Col>
      </Row>
      <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable">
        <template slot-scope="{ row }" slot="joinKindStr">
					
					<div v-if="row.join_kind== 0">
						<p v-if="row.join_count_limit == 0">总共{{row.total_join_count}}次/每{{row.each_join_interval}}分钟1次</p>
						<p v-else-if="row.join_count_limit == 1">
							总共{{row.total_join_count}}次/每天{{row.each_join_count}}次
						</p>
					</div>
					<div v-else>需要抽奖机会</div>
        </template>
				<template slot-scope="{ row }" slot="fromDate">
          <p>{{row.start_time | initDate}}</p>
          <p>{{row.start_time | initTime}}</p>
        </template>
        <template slot-scope="{ row }" slot="toDate">
          <p>{{row.end_time | initDate}}</p>
          <p>{{row.end_time | initTime}}</p>
        </template>
				<template slot-scope="{ row }" slot="get_lottery_share_rule">
				  <p style="margin:10px 0px;">{{row.get_lottery_share_rule.name}}</p>
				</template>
        <template slot-scope="{ row }" slot="isEnabled">
          <Tag type="dot" :color="getIsEnabled(row) == 1 ? 'success' : (getIsEnabled(row) == 0 ? 'error' : 'warning')">{{getIsEnabled(row) == 1 ? '开启' : (getIsEnabled(row) == 0 ? '关闭' : '过期')}}</Tag>
        </template>
        <template slot-scope="{ row, index }" slot="handle">
					<div class="v-lines">
						<template v-if="row.handle.edit" >
							<a @click="EditActivity(row)">编辑</a><span class="v-line">&nbsp;|&nbsp;</span>
						</template>
						<template v-if="row.handle.remove" >
							<a @click="delItem(row, '删除提示', '确定删除活动吗？')">删除</a><span class="v-line">&nbsp;|&nbsp;</span>
						</template>
						<template v-if="row.handle.code" >
							<a @click="extendActivity(row)">推广</a><span class="v-line">&nbsp;|&nbsp;</span>
						</template>
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
    </Card>
		<extendActivity ref="extendCode" :path="editRow.path" :pathParams="{activityId: editRow.activityId}"></extendActivity>
  </div>
</template>
<script>
import SearchForm from './search-form';
import Mixin from './mixin.js';
import PageHelper from '@/libs/page-helper.js';
import extendActivity from '@/views/my-components/applet/extendCode.vue';
import 	{ lotteryType } from '@/views/matrix/plugins/lottery/typeMap.js';
export default {
  components: {
    SearchForm,
		extendActivity
  },
  data () {
    return {
      canCreate: {},
      condition: {
        searchq: '',
        enabled: -1
      },
			editRow: {
				path: "pages/matrix/matrix",
				activityId: 0
			}
    }
  },
  mixins: [Mixin, PageHelper],
  methods: {
    onLoadData (page, data) {
      let params = Object.assign({}, data, this.condition, {
        type: lotteryType[this.$route.query.act]
      });
      return this.$ajax.post(this.$api.MatrixLotteryActivityList, params)
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.data = res.data;
          this.canCreate = res.data && res.data.canCreate;
        }
      });
    },
    searchPage (searchData) {
      this.condition = searchData;
      this.loadData();
    },
    createActivity () {
      this.$router.push({
        name: `matrix-${this.$route.query.act}-details-add`
      })
    },
    EditActivity (row) {
			let act = this.$route.query.act || "";
			if(act && row.id){
				this.$router.push({
				  name: `matrix-${act}-details-edit`,
				  params: {
				    id: row.id
				  }
				})
			}
      
    },
		extendActivity(row){
			this.editRow.activityId = row.id;
			this.$refs["extendCode"].showModal(row);
		},
    onDelItem (row) {
      return this.$ajax.post(this.$api.MatrixLotteryActivityRemove, {
        activityId: row.id
      });
    },
		getIsEnabled(row){
			let isEnabled = row.enable;
			let end_time = row.end_time;
			if(end_time){
				let now_time = new Date().getTime();
				if(now_time > new Date(end_time).getTime()){
					isEnabled = ""; //已过期
				} 
			}
			return isEnabled
		}
  }
}
</script>

<style lang="less" scoped>
.fan-list{
  .brand-list_import{
    margin-right: 10px;
  }
  .btn-group{
    text-align: right;
  }
}
</style>
