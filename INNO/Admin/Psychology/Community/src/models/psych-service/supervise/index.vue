<template>
  <hold-layout :isFull="true" class="supervise-page-layout">
    <searchForm :searchForm="searchForm" :subscribeState="subscribeState" @search="loadData()"></searchForm>
    <Table class="no-remove full-table" ref="myTable" :columns="columns" :data="list" border :loading="tableLoading" @on-selection-change="selectDataEvent">

      <!-- <template slot="consult" slot-scope="{ row }">
        <div class="consult flex-s-c">
          <div class="consult-img">
            <img :src="row.get_consultant && row.get_consultant.picture" />
          </div>
          <p class="consult-name">{{row.get_consultant && row.get_consultant.name}}</p>
        </div>
      </template> -->
      <template slot="target" slot-scope="{ row }">
        <div class="target">
          <p class=" text-flow" :class="row.customerName && row.customerName != row.source ? 'target-name' : ''">{{row.source}}</p>
          <p class="target-customer text-flow" v-if="row.customerName && row.customerName != row.source">{{row.customerName}}</p>
        </div>
      </template>
      <template slot="directionConsultation" slot-scope="{ row }">
        {{row.directionConsultation || '--'}}
      </template>
      <template slot="superviseWay" slot-scope="{ row }">
        {{row.superviseWay || '--'}}
      </template>
      <template slot="sub_str" slot-scope="{ row }">
        <div v-for="item in subscribeState" :key="item.state" v-if="row.state == item.state">{{item.name}}</div>
      </template>
      <template slot="handle" slot-scope="{ row }">
        <div class="operate-area">
          <a class="operate" v-hasAction="true" @click="checkSupervise(row)">查看</a>
          <!-- <Poptip
            v-hasAction="[(row.handle && row.handle.dispose)]"
            confirm
            title="确定设为已处理吗？"
            placement="left-end"
            @on-ok="setHandle(row)">
            <a class="operate" >设为已处理</a>
          </Poptip> -->
          
          <!-- <a class="operate" v-hasAction="true">删除</a> -->
        </div>
      </template>

    </Table>
    <rewrite-page slot="footer" :total="total" :current="page" :page-size="pageSize" :page-size-opts="pageSizeOpts" @on-change="e=>loadData(e)" @on-page-size-change="handlePageSizeChange" show-sizer show-elevator show-total transfer></rewrite-page>
    <checkSupervise ref="checkSuperviseRef" title="预约信息" @handle="setHandle"></checkSupervise>
    <!---->
    <!-- <handleSupervise ref="handleSuperviseRef" @success="handleSuccess()"></handleSupervise> -->
  </hold-layout>
</template>

<script>
import ListMixin from "@/helper/mixin/list-mixin";
import searchForm from "./search-form";
import mixins from "./mixins";
import checkSupervise from "./check-supervise/index.vue";
// import handleSupervise from "./handle-supervise/index.vue";
export default {
  name: "gaugeIndex",
  mixins: [ListMixin, mixins],
  components: { searchForm, checkSupervise },
  data() {
    return {
      searchForm: {
        searchq: "",
        source_id: 0,
        state: -1,
      },
      selectData: [],
      subscribeState: [
                {
                    state: -1,
                    name: "全部"
                },
                {
                    state: 0,
                    name: "等待分配"
                },
                {
                    state: 1,
                    name: "已分配"
                },
                // {
                //     state: 2,
                //     name: "已完成"
                // }
            ]
    };
  },
  computed: {
    ids() {
      let selectData = this.selectData || [];
      let ids = [];
      if (selectData instanceof Array) {
        for (let i = 0; i < selectData.length; i++) {
          if (selectData[i].id || selectData[i].id + "" == 0) {
            ids.push(selectData[i].id);
          }
        }
      }
      return ids;
    },
  },
  methods: {
    selectDataEvent(selectData) {
      this.selectData = selectData || [];
    },
    isShowCustomName(item){
      let get_target = item.get_target || {};
      let get_customer = get_target.get_customer || {};
      if(get_target.target_name != get_customer.customer_name && get_customer.customer_name){
        return true;
      } else {
        return false;
      }
    },
    onLoadData(page, extraData) {
      return this.$MainApi
        .psychologicalSupervisorList({
          data: {
            ...this.searchForm,
            ...extraData,
          },
          other: {
            isErrorMsg: true
          }
        })
        .then((res) => {
          if (res.code) {
            let data = res.data || {};
            let items = data.list || [];
            this.data = {
              total: data.totalCount,
              list: items,
            };
          }
        });
    },
    checkSupervise(row) {
      this.$refs["checkSuperviseRef"] &&
        this.$refs["checkSuperviseRef"].showDrawer({
          id: row.id
        });
    },
    setHandle(row) {
      this.$refs["handleSuperviseRef"] &&
        this.$refs["handleSuperviseRef"].showModal({});
    },
    handleSuccess(){
      this.$refs["checkSuperviseRef"] &&
        this.$refs["checkSuperviseRef"].getView();
    },
    setHandleReq(req, reqData){
      this.tableLoading = true;
      return this.$MainApi[req]({
          data: reqData,
        })
        .then((res) => {
          this.tableLoading = false;
          if (res.code) {
            this.$Message.success(res.message || "操作成功");
            this.handleUpdate();
          } else {
            this.$Message.warning(res.message || "操作失败");
          }
        }).catch(()=>{
          this.tableLoading = false;
        }) 
    }
  },
  mounted() {
    this.loadData();
  },
};
</script>

<style lang="less" scoped>
.supervise-page-layout {
  .consult {
    .consult-img {
      width: 44px;
      height: 44px;
      position: relative;
      margin-right: 10px;
      background-color: #f2f2f2;
      overflow: hidden;
      img {
        width: 100%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
  .target {
      .target-name {
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #171717;
        line-height: 22px;
        margin-bottom: 6px;
      }
      .target-customer {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #7f7f7f;
        line-height: 17px;
      }
    }
}
</style>