<template>
  <Drawer class="page-drawer-area" :transfer="false" :inner="true" :closable="false" v-model="drawerShow" :width="450">
    <div class="class-edit-area" :style="'padding-top:' +  _pageScrollTop + 'px;'">
      <div class="edit-title bold">{{title}}</div>
      <div class="edit-cont" v-bar>
        <div class="edit-cont-area">
          <div class="flex-b-c edit-cont-title" :class="{ 'is-handle': superviseInfo.state == 1 }">
            <div>{{superviseInfo.createTime}}</div>
            <div>
              <span v-for="item in subscribeState" v-if="item.state == superviseInfo.state" :key="item.state">{{item.name}}</span>
            </div>
          </div>
          <Form :label-width="100" :model="superviseInfo" ref="formDataRef">
            <FormItem label="EAP专员">{{superviseInfo.name}}</FormItem>
            <FormItem label="联系电话">{{superviseInfo.mobilePhone}}</FormItem>
            <FormItem label="咨询方向">{{superviseInfo.directionConsultation || '--'}}</FormItem>
            <FormItem label="督导方式">{{superviseInfo.superviseWay || '--'}}</FormItem>
            <FormItem label="备注" v-if="superviseInfo.description">{{superviseInfo.description}}</FormItem>
          </Form>
          <div class="deal-detail" v-if="superviseInfo.state == 1">
            <div class="detail-tip">处理详情</div>
            <div class="detail-row">
              <div class="row-l">预约日期</div>
              <div class="row-r">{{superviseInfo.consultDate}}</div>
            </div>
            <div class="detail-row">
              <div class="row-l">督导方式</div>
              <div class="row-r">{{superviseInfo.confirmSuperviseWay}}</div>
            </div>
            <div class="detail-row">
              <div class="row-l">督导师</div>
              <div class="row-r">{{superviseInfo.supervisor}}</div>
            </div>
          </div>
          <div class="edit-foot">
            <!-- <Button type="primary" :loading="handleLoading" @click="setHandle" v-if="superviseInfo.consult_result != 1">设为已处理</Button> -->
            <Button @click="drawerShow = false">返回</Button>
          </div>
          <Spin fix v-if="pageLoading"></Spin>
        </div>
      </div>
    </div>
    <!---->
    <!-- <handleSupervise ref="handleSuperviseRef" @success="getView"></handleSupervise> -->
  </Drawer>
</template>

<script>
// import handleSupervise from "../handle-supervise/index.vue";
export default {
  props: {
    title: String,
  },
  components: { },
  data() {
    return {
      drawerShow: false,
      handleLoading: false,
      superviseInfo: {
        consult_result: 1,
        isHandle: true
      },
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
                {
                    state: 2,
                    name: "已完成"
                }
            ]
    };
  },
  methods: {
    showDrawer({ id }) {
      this.drawerShow = true;
      this.handleLoading = false;
      this.getView(id);
    },
    getView(id) {
      if (!Number(id) && Number(id) != 0) return;
      this.pageLoading = true;
      return this.$MainApi
        .psychologicalSupervisorDetails({
          data: {
            id: id,
          },
          other: {
            isErrorMsg: true
          }
        })
        .then((res) => {
          if (res.code) {
            let data = res.data || {};
            this.superviseInfo = {
              ...data,
            };
          }
        })
        .finally(() => {
          this.pageLoading = false;
        });
    },
    setHandle() {
      this.$emit("handle");
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