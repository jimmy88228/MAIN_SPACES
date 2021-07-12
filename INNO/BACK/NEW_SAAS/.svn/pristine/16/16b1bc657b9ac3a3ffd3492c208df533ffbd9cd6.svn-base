<template>
  <div class="lottery-share-rule-list">
    <Card>
			<!-- <select>
				<option ></option>
			</select> -->
      <div class="flex f-just-between f-align-center">
        <div>
          <SearchForm ref="search" @on-search="searchPage" :canCreate="canCreate"></SearchForm>
        </div>
        <div>
          <div class="btn-group">
            <Button type="primary" @click="createRuleActive">创建规则</Button>
          </div>
        </div>
      </div>
      <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable">
        <template slot-scope="{ row }" slot="time">
        	<div >
        		{{row.start_time}} - {{row.end_time}}
        	</div>
        </template>
				<template slot-scope="{ row }" slot="activitys">
					<div style="margin:10px 0px;">
						<div v-for="(item, index) in row.get_lottery_activity" :key="item.id" v-if="index < 5">
							{{item.name}}
						</div>
						<template v-if="row.get_lottery_activity.length > 5">
							<Poptip transfer>
									<!-- <Button type="primary" style="margin-top:10px;" @click="showLotteryActivty(row.get_lottery_activity)"></Button> -->
									<a style="margin-top:10px;">查看全部(共{{row.get_lottery_activity.length}}个)</a>
									<div slot="title"><i>绑定的抽奖活动</i></div>
									<div slot="content" >
										<div style="max-width:500px;" class="space-wrap">
											<Button type="dashed" style="margin-bottom:10px;" class="m-right-10" v-for="(item, index) in row.get_lottery_activity" :key="item.id">{{item.name}}</Button>
										</div>
									</div>
							</Poptip>
						</template>
					</div>
				</template>
				<template slot-scope="{ row }" slot="enable">
					<div >
						<Button v-if="row.enable == 1">
							<span class="open-switch-btn switch-btn" ></span>启用
						</Button>
						<Button v-else>
							<span class="close-switch-btn switch-btn" ></span>关闭
						</Button>
					</div>
				</template>
				<template slot-scope="{ row }" slot="handle">
					<div class="v-lines">
						<template v-if="row.handle.edit"><a @click="createRuleActive(row)">编辑</a>&nbsp;<span class="v-line">|&nbsp;</span></template>
						<template v-if="row.handle.remove">
							<Poptip
							:transfer="true"
							confirm
							title="确定删除该规则么?"
							@on-ok="removeRule(row)">
							<a >删除</a>
							</Poptip>&nbsp;<span class="v-line">|&nbsp;</span>
						</template>
						<template v-if="row.handle.viewdetails" ><a @click="goDetails(row)">查看明细</a>&nbsp;<span class="v-line">|&nbsp;</span></template>
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

export default {
  components: {
    SearchForm,
  },
  data () {
    return {
      canCreate: {},
      condition: {
        searchq: '',
        status: 0,
        start_time: '',
        end_time: ''
      }
    }
  },
  mixins: [Mixin, PageHelper],
  methods: {
    onLoadData (page, data) {
      let params = Object.assign({}, data, this.condition);
      return this.$ajax.post(this.$api.MatrixSharingRulesList, params)
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
    goDetails (row) {
      this.$router.push({
        name: 'matrix-check-sharing-rules',
        query: {
          id: row.id || 0,
					activityId: (row.get_lottery_activity && row.get_lottery_activity[0] && row.get_lottery_activity[0].id) || 0
        }
      })
    },
		createRuleActive(row = {}){
			this.$router.push({
				name: "matrix-edit-sharing-rules",
				query: {
					id: row.id
				}
			})
		},
		removeRule(row){
			if(!row.id) return;
			return this.$ajax.post(this.$api.MatrixSharingRulesRemove, {
				id: row.id
			}).then(response => {
			  const res = response.data;
			  if (res.code) {
					this.loadData();
			    this.$Message.success(res.message);
			  } else {
			  	this.$Message.error(res.message);
			  }
			});
		},
  },
  mounted () {
    this.loadData();
  }
}
</script>

<style lang="less" scoped>
.lottery-share-rule-list{
	.switch-btn{
		display:inline-block;
		width:10px;
		height:10px;
		border-radius:100%;
		margin-right:5px;
	}
  .open-switch-btn{
		background-color:#19be6b;
	}
	.close-switch-btn{
		background-color:#ed4014;
	}
}
</style>
