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
        <template slot-scope="{ row }" slot="fromDate">
          <p>{{row.fromDate | initDate}}</p>
          <p>{{row.fromDate | initTime}}</p>
        </template>
        <template slot-scope="{ row }" slot="toDate">
          <p>{{row.toDate | initDate}}</p>
          <p>{{row.toDate | initTime}}</p>
        </template>
        <template slot-scope="{ row }" slot="isEnabled">
          <Tag type="dot" :color="row.isEnabled == 1 ? 'success' : (row.isEnabled == 0 ? 'error' : 'warning')">{{row.isEnabled == 1 ? '开启' : (row.isEnabled == 0 ? '关闭' : '过期')}}</Tag>
        </template>
        <template slot-scope="{ row, index }" slot="handle">
					<div class="v-lines">
						<span v-show="row.handle.edit" @click="EditActivity(row)"><a>编辑</a></span>
						<Divider class="v-line" type="vertical" v-show="row.handle.edit"/>
						<span v-show="row.handle.remove" @click="delItem(row, '删除提示', '确定删除活动吗？')"><a>删除</a></span>
						<Divider class="v-line" type="vertical" v-show="row.handle.remove"/>
						<span v-show="row.handle.spread" @click="extendActivity(row)"><a>推广</a></span>
						<Divider class="v-line" type="vertical" v-show="row.handle.spread"/>
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
      typeMap: {
        fan: 1,
        fruit: 2,
        yao: 3,
        egg: 4,
        pan: 5,
        coupon: 6,
      },
			editRow: {
				path: "pages/micro_mall/lottery/lottery",
				activityId: 0
			}
    }
  },
  mixins: [Mixin, PageHelper],
  methods: {
    onLoadData (page, data) {
      let params = Object.assign({}, data, this.condition, {
        status: this.typeMap[this.$route.query.act]
      });
      return this.$ajax.post(this.$api.lotteryActivityList, params)
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
        name: `${this.$route.query.act}-details-add`
      })
    },
    EditActivity (row) {
      this.$router.push({
        name: `${this.$route.query.act}-details-edit`,
        params: {
          id: row.id
        }
      })
    },
		extendActivity(row){
			this.editRow.activityId = row.activityId;
			this.$refs["extendCode"].showModal();
		},
    onDelItem (row) {
      return this.$ajax.post(this.$api.LotteryActivityRemove, {
        id: row.activityId
      });
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
