<template>
  <!-- <Drawer class="page-drawer-area" :transfer="false"  :closable="false" v-model="drawerShow" :width="450" :inner="true">
    <div class="class-edit-area" :style="'padding-top:' +  _pageScrollTop + 'px;'">
      <div class="edit-title bold">{{title}}</div>
      <div class="edit-cont" v-bar>
        <div class="edit-cont-area">
          <div class="flex-b-c edit-cont-title" :class="{ 'is-handle': subscribeInfo.consultResult == 1 }">
            <div>{{subscribeInfo.createTime}}</div>
            <div>{{consultResult[subscribeInfo.consultResult]}}</div>
          </div>
          <Form :label-width="100" :model="subscribeInfo" ref="formDataRef">
            <FormItem label="姓名">{{subscribeInfo.name}}</FormItem>
            <FormItem label="联系电话">{{subscribeInfo.mobilePhone || '--'}}</FormItem>
            <FormItem label="咨询方式">{{subscribeInfo.serviceWay || '--'}}</FormItem>
            <template v-if="subscribeInfo.type != 'commissioner'">
              <FormItem label="资费方式">{{subscribeInfo.payType == 'self' ? '自费' : '报销'}}</FormItem>
            </template>
            <FormItem label="预约咨询师">{{subscribeInfo.consultantName || '--'}}</FormItem>
            <FormItem label="心理描述"><p class="w-break">{{subscribeInfo.psychologicalDescription}}</p></FormItem>
            <FormItem label="拒绝原因" v-if="subscribeInfo.remark && subscribeInfo.consultResult == 2">
              <p class="w-break">{{subscribeInfo.remark}}</p>
            </FormItem>
          </Form>
          <div class="deal-detail" v-if="subscribeInfo.consultResult == 1">
            <div class="detail-tip">处理详情</div>
            <div class="detail-row">
              <div class="row-l">预约日期</div>
              <div class="row-r">{{subscribeInfo.consultDate}}</div>
            </div>
            <div class="detail-row">
              <div class="row-l">咨询方式</div>
              <div class="row-r">{{(subscribeInfo.confirmServiceWay) || '--'}}</div>
            </div>
            <div class="detail-row">
              <div class="row-l">咨询师</div>
              <div class="row-r">{{subscribeInfo.consultantName || '--'}}</div>
            </div>
            <div class="detail-row" v-if="subscribeInfo.remark">
              <div class="row-l">备注</div>
              <div class="row-r w-break">{{subscribeInfo.remark}}</div>
            </div>
          </div>
          <div class="edit-foot">
            <Button @click="drawerShow = false">返回</Button>
          </div>
          <Spin fix v-if="pageLoading"></Spin>
        </div>
      </div>
    </div>
  </Drawer> -->
  <rewrite-drawer v-model="drawerShow" :inner="true" :width="450">
    <div class="edit-cont-area">
      <div class="flex-b-c edit-cont-title" :class="{ 'is-handle': subscribeInfo.consultResult == 1 }">
        <div>{{subscribeInfo.createTime}}</div>
        <div>{{consultResult[subscribeInfo.consultResult]}}</div>
      </div>
      <Form :label-width="100" :model="subscribeInfo" ref="formDataRef">
        <FormItem label="姓名">{{subscribeInfo.name}}</FormItem>
        <FormItem label="联系电话">{{subscribeInfo.mobilePhone || '--'}}</FormItem>
        <FormItem label="咨询方式">{{subscribeInfo.serviceWay || '--'}}</FormItem>
        <template v-if="subscribeInfo.type != 'commissioner'">
          <FormItem label="资费方式">{{subscribeInfo.payType == 'self' ? '自费' : '报销'}}</FormItem>
        </template>
        <FormItem label="预约咨询师">{{subscribeInfo.consultantName || '--'}}</FormItem>
        <FormItem label="心理描述"><p class="w-break">{{subscribeInfo.psychologicalDescription}}</p></FormItem>
        <FormItem label="拒绝原因" v-if="subscribeInfo.remark && subscribeInfo.consultResult == 2">
          <p class="w-break">{{subscribeInfo.remark}}</p>
        </FormItem>
      </Form>
      <div class="deal-detail" v-if="subscribeInfo.consultResult == 1">
        <div class="detail-tip">处理详情</div>
        <div class="detail-row">
          <div class="row-l">预约日期</div>
          <div class="row-r">{{subscribeInfo.consultDate}}</div>
        </div>
        <div class="detail-row">
          <div class="row-l">咨询方式</div>
          <div class="row-r">{{(subscribeInfo.confirmServiceWay) || '--'}}</div>
        </div>
        <div class="detail-row">
          <div class="row-l">咨询师</div>
          <div class="row-r">{{subscribeInfo.consultantName || '--'}}</div>
        </div>
        <div class="detail-row" v-if="subscribeInfo.remark">
          <div class="row-l">备注</div>
          <div class="row-r w-break">{{subscribeInfo.remark}}</div>
        </div>
      </div>
      <Spin fix v-if="pageLoading"></Spin>
    </div>
    <div slot="footer">
      <Button @click="drawerShow = false">返回</Button>
    </div>
  </rewrite-drawer>
</template>

<script>
export default {
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
      consultResult:{
        '-1':"全部",
        '0':"未处理",
        '1':"已处理",
        '2':"已拒绝",
      }
    };
  },
  methods: {
    showDrawer({ appointment_id }) {
      this.drawerShow = true;
      this.getView(appointment_id);
    },
    getView(appointment_id) {
      if (!Number(appointment_id) && Number(appointment_id) != 0) return;
      this.pageLoading = true;
      return this.$MainApi
        .reservationDetails({
          data: {
            appointmentId: appointment_id,
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
    setHandle() {
      let subscribeInfo = this.subscribeInfo || {};
      this.handleLoading = true;
      return this.$MainApi
        .reservationDispose({
          data: {
            appointment_id: subscribeInfo.appointment_id,
          },
        })
        .then((res) => {
          this.tableLoading = false;
          if (res.code) {
            this.$Message.success(res.message || "操作成功");
            this.getView(subscribeInfo.appointment_id);
            this.$emit("update");
          } else {
            this.$Message.warning(res.message || "操作失败");
          }
        })
        .catch(() => {
          this.handleLoading = false;
        });
    },
  },
  mounted() {},
};
</script>

<style lang="less" scoped>
@import "@/assets/css/variables.less";
.edit-cont-area{
    border: 1px solid #efefef;
    padding-bottom: 20px;
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
</style>