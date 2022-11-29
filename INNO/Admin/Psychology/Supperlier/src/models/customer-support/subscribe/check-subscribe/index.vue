<template>
  <Drawer class="page-drawer-area" :transfer="false" :inner="true" :closable="false" v-model="drawerShow" :width="450">
    <div class="class-edit-area" :style="'padding-top:' +  _pageScrollTop + 'px;'">
      <div class="edit-title bold">{{title}}</div>
      <div class="edit-cont" v-bar>
        <div class="edit-cont-area">
          <div class="flex-b-c edit-cont-title" :class="{ 'is-handle': subscribeInfo.consult_result == 1 }">
            <div>{{subscribeInfo.create_time}}</div>
            <div>{{subscribeInfo.consult_result_str}}</div>
          </div>
          <Form :label-width="100" :model="subscribeInfo" ref="formDataRef">
            <FormItem label="姓名">{{subscribeInfo.name}}</FormItem>
            <FormItem label="联系电话">{{subscribeInfo.mobile_phone}}</FormItem>
            <FormItem label="咨询方式">{{Service_name}}</FormItem>
            <template v-if="subscribeInfo.type != 'commissioner'"><!--转介不显示-->
              <FormItem label="资费方式">{{(subscribeInfo.pay_type_str) || '--'}}</FormItem>
              <FormItem label="来源">{{Target_name? `${Target_name} （剩余${subscribeInfo.residue_degree}次）`:'--'}}</FormItem>
              <FormItem label="预约咨询师" >{{(subscribeInfo.get_consultant && subscribeInfo.get_consultant.name) || '--'}}</FormItem>
            </template>
            <FormItem label="心理描述" v-if="subscribeInfo.psychological_description">
              <p class="w-break">{{subscribeInfo.psychological_description}}</p>
            </FormItem>
            <FormItem label="拒绝原因" v-if="subscribeInfo.remark && subscribeInfo.consult_result == 2">
              <p class="w-break">{{subscribeInfo.remark}}</p>
            </FormItem>
          </Form>
          <div class="deal-detail" v-if="subscribeInfo.consult_result == 1">
            <div class="detail-tip">处理详情</div>
            <div class="detail-row">
              <div class="row-l">预约日期</div>
              <div class="row-r">{{subscribeInfo.consult_date}}</div>
            </div>
            <div class="detail-row">
              <div class="row-l">咨询方式</div>
              <div class="row-r">{{Confirm_service_name}}</div>
            </div>
            <div class="detail-row">
              <div class="row-l">咨询师</div>
              <div class="row-r">{{(subscribeInfo.get_consultant && subscribeInfo.get_consultant.name) || '--'}}</div>
            </div>
            <div class="detail-row" v-if="subscribeInfo.remark">
              <div class="row-l">备注</div>
              <div class="row-r w-break">{{subscribeInfo.remark}}</div>
            </div>
          </div>
          <div class="edit-foot">
            <template v-if="subscribeInfo.consult_result == 0">
              <!--转介不可拒绝-->
              <Button type="primary" v-if="subscribeInfo.type != 'commissioner' && subscribeInfo.pay_type != 'self'" :loading="handleLoading" @click="setHandle('refuse')">拒绝</Button>
              <Button type="primary" :loading="handleLoading" @click="setHandle('handle')">设为已处理</Button>
            </template>
            <Button @click="drawerShow = false">返回</Button>
          </div>
          <Spin fix v-if="pageLoading"></Spin>
        </div>
      </div>
    </div>
  </Drawer>
</template>

<script>
export default {
  components: {},
  props: {
    title: String,
  },
  data() {
    return {
      drawerShow: false,
      handleLoading: false,
      subscribeInfo: {
        consult_result: 1,
      },
    };
  },
  computed:{
    Target_name(){
      return this.subscribeInfo.get_target && this.subscribeInfo.get_target.target_name || ""
    },
    Service_name(){
      return this.subscribeInfo.get_consultant_service && this.subscribeInfo.get_consultant_service.service_name || "--"
    },
    Confirm_service_name(){
      return this.subscribeInfo.get_consultant_confirm_service && this.subscribeInfo.get_consultant_confirm_service.service_name || "--"
    },
  },
  methods: {
    showDrawer({ appointment_id }) {
      this.drawerShow = true;
      this.handleLoading = false;
      this.getView(appointment_id);
    },
    getView(appointment_id) {
      if (!Number(appointment_id) && Number(appointment_id) != 0 || !this.drawerShow) return;
      this.pageLoading = true;
      return this.$MainApi
        .reservationView({
          data: {
            appointment_id: appointment_id,
          },
          other: {
            isErrorMsg: true
          }
        })
        .then((res) => {
          if (res.code) {
            let data = res.data || {};
            this.subscribeInfo = data;
          }
        })
        .finally(() => {
          this.pageLoading = false;
        });
    },
    setHandle(key) {
      this.$emit(key, this.subscribeInfo);
    },
  },
  mounted() {},
};
</script>

<style lang="less" scoped>
@import "@/assets/css/variables.less";
.page-drawer-area {
  .edit-cont-area {
    border: 0 none !important;
    .edit-cont-title {
      height: 40px;
      background: #f2f2f2;
      border-radius: 4px;
      margin-bottom: 20px;
      padding: 0px 16px;
    }
    .is-handle{
      color: #42A3DB;
      background-color:#F4F8FB;
    }
    .deal-detail{
      padding: 14px 10px 20px 30px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      line-height: 20px;
      position:relative;
      background-color: #FAFAFA;
      border-radius: 0px 6px 6px 0px;
      .detail-tip{
        color: #333333;
        margin-bottom: 18px;
      }
      .detail-row{
        display: flex;
        margin-bottom: 15px;
        .row-l{
          color: #7F7F7F;
          padding-right: 12px;
          width:70px;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .row-r{
          color: #333;
        }
      }
    }
    .deal-detail::after{
      content: "";
      position:absolute;
      top: 0px;
      left: 0px;
      width: 4px;
      height:100%;
      background-color:#42A3DB;
    }
  }
}
</style>