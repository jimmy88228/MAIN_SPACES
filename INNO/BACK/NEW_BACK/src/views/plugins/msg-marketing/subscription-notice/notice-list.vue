<template>
  <div class="lottery-template">
    <Card>
			<SearchForm ref="search" @on-search="searchPage" :canCreate="canCreate" :noticeData="data"></SearchForm>
      <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable">
				<template slot-scope="{ row, index }" slot="created_at">
					
				</template>
				<template slot-scope="{ row, index }" slot="exec_time">
					
				</template>
				<template slot-scope="{ row, index }" slot="count">
					<template v-if="pushNum[row.id]">
						{{pushNum[row.id].can_push_num || 0}} / {{pushNum[row.id].push_num || 0}}
					</template>
					<template v-else>-- / --</template>
				</template>
        <template slot-scope="{ row, index }" slot="handle">
					<div class="v-lines space-nowrap">
						<template v-if="row.handle.exec && row.status == 0"><a @click="execNotice(row)">手动执行</a><span class="v-line">&nbsp;|</span></template>
						<template><a @click="editNotice(row)">查看</a><span class="v-line">&nbsp;|</span></template>
						<template v-if="row.handle.del">
							<Poptip
							transfer
							confirm
							title="确定删除该通知吗？"
							@on-ok="delNotice(index, row)">
							<a>删除</a>
							</Poptip>
							<span class="v-line">&nbsp;|</span>
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
  </div>
</template>
<script>
import SearchForm from './search-form';
import Mixin from './mixin.js';
import PageHelper from '@/libs/page-helper.js';
import PagesSelect from '@/views/my-components/list-component/index-edit';

export default {
  components: {
    SearchForm,
    PagesSelect
  },
  data () {
    return {
      canCreate: {},
	  noticeData: {},
      condition: {
        searchq: '',
				status: '-1'
      },
			pushNum:{}
    }
  },
  mixins: [Mixin, PageHelper],
  methods: {
    onLoadData (page, data) {
      return this.$ajax.post(this.$api.getSubmsgTaskList, {
				...data,
				...this.condition
			})
      .then(response => {
        const res = response.data;
        if (res.code) {
					let data = res.data || {};
					let items = data.items || [];
          this.data = data;
          this.canCreate = data && data.canCreate;
					for(let i = 0; i < items.length; i++){
						let id = items[i].id || 0;
						if(id && !this.pushNum[id]){
							this.getSubmsgTaskPushNum(id);
						}
					}
        }
      });
    },
		getSubmsgTaskPushNum(id){
			return this.$ajax.post(this.$api.getSubmsgTaskPushNum, {
				id: id
			}).then(response => {
			  const res = response.data;
			  if (res.code) {
					this.$set(this.pushNum, id, res.data || {})
			  }
			});
		},
    searchPage (searchData) {
      this.condition = searchData;
      this.loadData();
    },
    execNotice (row) {
			if(!row.id) return;
			return this.$ajax.post(this.$api.execSubmsgTask, {
				id: row.id
			})
			.then(response => {
			  const res = response.data;
			  if (res.code) {
			    this.$Message.success(res.message);
					this.loadData();
					return;
			  }
				this.$Message.warning(res.message);
			});
    },
    editNotice (row) {
			if(!row.id) return;
      this.$router.push({
				name: "sub-notice-details",
				query: {
					id: row.id
				}
			})
    },
    delNotice (index, row) {
      return this.$ajax.post(this.$api.delSubmsgTask, {
        id: row.id
      }).then(response => {
			  const res = response.data;
			  if (res.code) {
			    this.$Message.success(res.message);
					this.tableData.splice(index, 1);
					return;
			  }
				this.$Message.warning(res.message);
			});
    }
  },
  mounted() {
    this.loadData();
  }
}
</script>

<style lang="less" scoped>
.lottery-template{
  .brand-list_import{
    margin-right: 10px;
  }
  .btn-group{
    text-align: right;
  }
}
</style>
