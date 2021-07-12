<template>
  <div class="normal-activity">
      <template>
        <div class="handle">
					<Button type="dashed" @click="checkRelationGoods" v-if="canCreate && canCreate.searchq">查看商品</Button>
          <Button type="primary" icon="md-add" :to="fullReductionRoute" v-if="canCreate && canCreate.moneyadd">添加满减规则</Button>
          <Button type="primary" icon="md-add" :to="fullReductionRoute2" v-if="canCreate && canCreate.pieceadd">添加满件规则</Button>
        </div>
      </template>
      <Table :loading="tableLoading" :height="tableHeight" :columns="tableColumns" :data="tableData" ref="myTable">
        <template slot-scope="{ row }" slot="type">
          <p>{{row.condition_type == 2 ? '商品数量' : '商品金额'}}</p>
        </template>
        <template slot-scope="{ row }" slot="startTime">
          <p>{{row.start_time | initDate}}</p>
          <p>{{row.start_time | initTime}}</p>
        </template>
        <template slot-scope="{ row }" slot="endTime">
          <p>{{row.end_time | initDate}}</p>
          <p>{{row.end_time | initTime}}</p>
        </template>
        <template slot-scope="{ row }" slot="handle">
          <span v-show="row.handle.edit" @click="editItem(row)"><a>编辑</a></span>
          <Divider type="vertical" v-show="row.handle.remove"/>
          <span v-show="row.handle.remove" @click="delItem(row, '删除提示', '确定删除该活动吗？')"><a>删除</a></span>
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
			<checkGoods ref="checkGoods"></checkGoods>
  </div>
</template>
<script>
import PageHelper from '@/libs/page-helper.js';
import Mixin from './mixin';
import checkGoods from './check-goods/check_goods.vue';

export default {
  data () {
    return {
      canCreate: {},
      fullReductionRoute: {
        name: 'full-reduction-add',
        query: {
          type: this.$route.query.act === 'normal-activity' ? 1 : 3
        }
      },
      fullReductionRoute2: {
        name: 'full-numbers-add',
        query: {
          type: this.$route.query.act === 'normal-activity' ? 2 : 4
        }
      }
    }
  },
  computed: {
    isNormal () {
      return this.$route.query.act === 'normal-activity';
    }
  },
	components:{
		checkGoods
	},
  mixins: [Mixin, PageHelper],
  methods: {
    onLoadData (page, data) {
      return this.$ajax.post(this.isNormal ? this.$api.fullReductionGeneralList : this.$api.fullReductionOverallList, data)
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.data = res.data;
          this.canCreate = res.data && res.data.canCreate;
        }
      });
    },
    editItem (row) {
      this.$router.push({
        name: row.condition_type == 1 ? 'full-reduction-edit' : 'full-numbers-edit', //满减还是满件
        params: {
          id: row.rule_id
        },
        query: {
          type: this.isNormal ? 'normal' : 'global' //这里接口请求数据时候需要判断：常规(1/2)还是全场(3/4)
        }
      })
    },
    onDelItem (row) {
      return this.$ajax.post(this.isNormal ? this.$api.fullReductionGeneralRemove : this.$api.fullReductionOverallRemove, {
        rule_id: row.rule_id
      });
    },
    updateAsync (id, val) {
      this.tableLoading = true;
      return this.$ajax.post(this.$api.fullReductionEnableEdit, {
        rule_id: id,
        is_enable: Number(val) ? 0 : 1
      })
      .then((response) => {
        var res = response.data;
        if (res.code) {
          this.$Message.success(res.message);
          this.loadData();
        }else{
          this.tableLoading = false;
          return Promise.reject();
        }
      }).finally(()=>{
        // 
      })
    },
		checkRelationGoods(){
			this.$refs["checkGoods"].showModal();
		}
  },
  watch: {
    '$route.query.act' () {
      this.fullReductionRoute = {
        name: 'full-reduction-add',
        query: {
          type: this.$route.query.act === 'normal-activity' ? 1 : 3
        }
      }
      this.fullReductionRoute2 = {
        name: 'full-numbers-add',
        query: {
          type: this.$route.query.act === 'normal-activity' ? 2 : 4
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.normal-activity{
  .handle{
    text-align: right;
    margin-bottom: 24px;
  }
}
</style>
