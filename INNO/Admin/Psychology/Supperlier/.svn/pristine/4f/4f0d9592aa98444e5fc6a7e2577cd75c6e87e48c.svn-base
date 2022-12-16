<template>
  <hold-layout :isFull="true" class="subscribe-page-layout">
    <searchForm :searchForm="searchForm" @search="loadData()"></searchForm>
    <Table class="no-remove full-table" ref="myTable" :columns="columns" :data="list" border :loading="tableLoading" @on-selection-change="selectDataEvent">
      <template slot="request" slot-scope="{ row }">
        <div class="request">
          <p class="request-name m-b-5">{{row.petitioner || '--'}}</p>
          <p class="request-name">{{row.petitioner_phone}}</p>
        </div>
      </template>
      <template slot="pay_type" slot-scope="{ row }">
        {{ row.type == 'commissioner' ? '--' : row.pay_type_str}}
      </template>
      <template slot="refer" slot-scope="{ row }">
        <div class="refer">
          <p class="refer-name m-b-5">{{row.name || '--'}}</p>
          <p class="refer-name" v-if="row.mobile_phone && row.type != 'self'">{{row.mobile_phone}}</p>
        </div>
      </template>
      <template slot="create_time" slot-scope="{ row }">
        {{row.create_time || '--'}}
      </template>
      <template slot="target" slot-scope="{ row }">
        <div class="target">
          <p class=" text-flow" :class="isShowCustomName(row) ? 'target-name' : ''">{{row.get_target && row.get_target.target_name}}</p>
          <p class="target-customer text-flow" v-if="isShowCustomName(row)">{{row.get_target && row.get_target.get_customer && row.get_target.get_customer.customer_name}}</p>
        </div>
      </template>
      <template slot="schedule_day" slot-scope="{ row }">
        {{(row.getSchedule && row.getSchedule.scheduleTime) || '--'}}
      </template>
      <template slot="handle" slot-scope="{ row }">
        <div class="operate-area">
          <a class="operate" v-hasAction="true" @click="checkSubscribe(row)">查看</a>
          <a class="operate" v-hasAction="[(row.handle && row.handle.dispose)]" @click="setHandle(row)">信息处理</a>
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
    <checkSubscribe ref="checkSubscribeRef" title="预约信息" @handle="setHandle" @refuse="setRefuse"></checkSubscribe>
    <!---->
    <handleSubscribe ref="handleSubscribeRef" @success="handleSuccess"></handleSubscribe>
    <handleRefuse ref="handleRefuseRef" @success="handleSuccess"></handleRefuse>
  </hold-layout>
</template>

<script>
import ListMixin from "@/helper/mixin/list-mixin";
import searchForm from "./search-form";
import mixins from "./mixins";
import checkSubscribe from "./check-subscribe/index.vue";
import handleSubscribe from "./handle-subscribe/index.vue";
import handleRefuse from "./refuse-subscribe/index.vue";
export default {
  name: "gaugeIndex",
  mixins: [ListMixin, mixins],
  components: { searchForm, checkSubscribe, handleSubscribe,handleRefuse },
  data() {
    return {
      searchForm: {
        searchq: "",
        customer_id: 0,
        consultant_id: 0,
        pay_type: -1
      },
      selectData: [],
    };
  },
  computed: {
    ids() {
      let selectData = this.selectData || [];
      let ids = [];
      if (selectData instanceof Array) {
        for (let i = 0; i < selectData.length; i++) {
          if (selectData[i].appointment_id || selectData[i].appointment_id + "" == 0) {
            ids.push(selectData[i].appointment_id);
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
        .reservationList({
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
            let items = data.items || [];
            items.map((item)=>{
              if(item.consult_result == 1 || (item.handle && !item.handle.dispose)){
                item._disabled = true
              }
              let getSchedule = item.get_consultant_schedule;
              if(getSchedule){
                // 增加剔除最后秒数
                if(getSchedule.begin_time){
                  let beginTimeArr = getSchedule.begin_time.split(":");
                  beginTimeArr.length > 2 && beginTimeArr.splice(-1, 1);
                  getSchedule.beginTime = beginTimeArr.join(":")
                }
                if(getSchedule.end_time){
                  let endTimeArr = getSchedule.end_time.split(":");
                  endTimeArr.length > 2 && endTimeArr.splice(-1, 1);
                  getSchedule.endTime = endTimeArr.join(":")
                }
                getSchedule.scheduleTime = getSchedule.schedule_day + ' '+getSchedule.beginTime + '-' + getSchedule.endTime
                item.getSchedule = getSchedule
              }
              
            })
            this.data = {
              total: data.total,
              list: data.items,
            };
          }
        });
    },
    checkSubscribe(row) {
      this.$refs["checkSubscribeRef"] &&
        this.$refs["checkSubscribeRef"].showDrawer({
          appointment_id: row.appointment_id
        });
    },
    setHandle(row) {
      this.$refs["handleSubscribeRef"] && this.$refs["handleSubscribeRef"].showModal({ subscribeInfo: row })
    },
    setRefuse(row) {
      if(row.pay_type == 'self'){
        this.$Message.warning("自费的不可拒绝")
        return;
      }
      this.$refs["handleRefuseRef"] && this.$refs["handleRefuseRef"].showModal({ subscribeInfo: row })
    },
    handleSuccess(detail){
      this.$refs["checkSubscribeRef"] && this.$refs["checkSubscribeRef"].getView(detail.appointment_id);
      this.handleUpdate();
    },
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