<template>
  <hold-layout :isFull="true" class="subscribe-page-layout">
    <searchForm :searchForm="searchForm" @search="loadData()"></searchForm>
    <rewrite-table class="no-remove full-table" ref="myTable" :columns="columns" :data="list" :loading="tableLoading" @on-selection-change="selectDataEvent">
      <template slot="request" slot-scope="{ row }">
        <div class="request">
          <p class="request-name m-b-5">{{row.petitioner || '--'}}</p>
          <p class="request-name">{{row.petitionerPhone}}</p>
        </div>
      </template>
      <template slot="refer" slot-scope="{ row }">
        <div class="refer">
          <p class="refer-name m-b-5">{{row.type == 'self' ? '本人' : (row.name || '--')}}</p>
          <p class="refer-name" v-if="row.mobilePhone && row.type != 'self'">{{row.mobilePhone}}</p>
        </div>
      </template>
      <template slot="pay_type" slot-scope="{ row }">
        {{ (row.payType == 'self' ? '自费' : '报销')}}
        <!-- {{ row.type == 'commissioner' ? '--' : (row.payType == 'self' ? '自费' : '报销')}} -->
      </template>
      <!-- <template slot="target" slot-scope="{ row }">
        <div class="target">
          <p class="target-name text-flow">{{row.source}}</p>
          <p class="target-customer text-flow" v-if="row.source != row.customerName">{{row.customerName}}</p>
        </div>
      </template> -->
      <template slot="consult_result_str" slot-scope="{ row }">
        {{row.consultResultStr}}
        <!-- <div v-for="(item, index) in resultList" :key="index" v-if="item.id == row.consultResult">{{item.name}}</div> -->
      </template>
      
      <template slot="handle" slot-scope="{ row }">
        <div class="operate-area">
          <a class="operate" v-hasAction="true" @click="checkSubscribe(row)">查看</a>
          <a class="operate" v-hasAction="[(row.handle && row.handle.dispose)]" @click="setHandle(row)">设为已处理</a>
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

    </rewrite-table>
    <rewrite-page slot="footer" :total="total" :current="page" :page-size="pageSize" :page-size-opts="pageSizeOpts" @on-change="e=>loadData(e)" @on-page-size-change="handlePageSizeChange" show-sizer show-elevator show-total transfer></rewrite-page>
    <checkSubscribe ref="checkSubscribeRef" title="预约信息" @handle="setHandle"></checkSubscribe>
    <!---->
  </hold-layout>
</template>

<script>
import ListMixin from "@/helper/mixin/list-mixin";
import searchForm from "./search-form";
import mixins from "./mixins";
import checkSubscribe from "./check-subscribe/index.vue";
export default {
  name: "gaugeIndex",
  mixins: [ListMixin, mixins],
  components: { searchForm, checkSubscribe },
  data() {
    return {
      searchForm: {
        petitioner: "",
        payType: "all",
        consultation_result: -1,
      },
      selectData: [],
    };
  },
  methods: {
    selectDataEvent(selectData) {
      this.selectData = selectData || [];
    },
    // isShowCustomName(item){
    //   let source = item.source || "";
    //   let customerName = item.customerName || "";
    //   if(get_target.target_name != get_customer.customer_name && get_customer.customer_name){
    //     return true;
    //   } else {
    //     return false;
    //   }
    // },
    onLoadData(page, extraData) {
      return this.$MainApi
        .reservationList({
          data: {
            ...this.searchForm,
            // payType: this.searchForm.payType == -1 ? '' : this.searchForm.payType,
            ...extraData,
          },
          other: {
            isErrorMsg: true
          }
        })
        .then((res) => {
          if (res.code) {
            let data = res.data || {};
            let list = data.list || [];
            this.data = {
              total: data.totalCount,
              list: list,
            };
          }
        });
    },
    checkSubscribe(row) {
      this.$refs["checkSubscribeRef"] &&
        this.$refs["checkSubscribeRef"].showDrawer({
          appointment_id: row.appointmentId
        });
    },
    // setBatchHandle(){
    //   if(!this.ids || this.ids.length == 0) {
    //     this.$Message.warning("请勾选批量处理项");
    //     return;
    //   }
    //   this.setHandleReq("reservationBatchDispose", {
    //     appointment_ids: this.ids
    //   })
    // },
    setHandle(row) {
      this.$refs["handleSubscribeRef"] && this.$refs["handleSubscribeRef"].showModal({ subscribeInfo: row })
    },
    handleSuccess(detail){
      this.$refs["checkSubscribeRef"] && this.$refs["checkSubscribeRef"].getView(detail.appointment_id);
      this.handleUpdate();
    },
    // setHandleReq(req, reqData){
    //   this.tableLoading = true;
    //   return this.$MainApi[req]({
    //       data: reqData,
    //     })
    //     .then((res) => {
    //       this.tableLoading = false;
    //       if (res.code) {
    //         this.$Message.success(res.message || "操作成功");
    //         this.handleUpdate();
    //       } else {
    //         this.$Message.warning(res.message || "操作失败");
    //       }
    //     }).catch(()=>{
    //       this.tableLoading = false;
    //     }) 
    // }
  },
  mounted() {
    this.loadData();
  },
};
</script>

<style lang="less" scoped>
.subscribe-page-layout {
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