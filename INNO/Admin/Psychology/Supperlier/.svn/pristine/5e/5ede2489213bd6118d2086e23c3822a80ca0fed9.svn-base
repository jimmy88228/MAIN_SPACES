<template>
  <div>
    <Drawer class="page-drawer-area" :transfer="false" :inner="true" :closable="false" v-model="drawerShow" :width="450">
      <div class="class-edit-area" :style="'padding-top:' +  _pageScrollTop + 'px;'">
        <div class="edit-title bold">{{title}}</div>
        <div class="edit-cont" v-bar>
          <div class="edit-cont-area">
            <Form :label-width="100" :model="referInfo" ref="formDataRef">
              <FormItem label="转介对象">
                <div class="flex-b-c">
                  <span>{{referInfo.get_appointment && referInfo.get_appointment.name}}</span>
                  <Button size="small" @click="checkSyrveyFile()">查看档案</Button>
                </div> 
              </FormItem>
              <FormItem label="风险等级">{{referInfo.get_appointment && referInfo.get_appointment.warning_level || '无'}}</FormItem>
              <FormItem label="联系方式">{{(referInfo.get_appointment && referInfo.get_appointment.mobile_phone) || '--'}}</FormItem>
              <FormItem label="描述">{{referInfo.get_appointment && referInfo.get_appointment.psychological_description}}</FormItem>
            </Form>
            <div class="edit-foot">
              <Button type="primary" :loading="handleLoading" @click="editMeddleEvent">干预记录</Button>
              <Button type="primary" :loading="handleLoading" @click="setHandle" v-if="referInfo.state != 2">完成转介</Button>
              <Button @click="drawerShow = false">返回</Button>
            </div>
            <Spin fix v-if="pageLoading"></Spin>
          </div>
        </div>
      </div>
    </Drawer>
    <editMeddle ref="editMeddleRef" @confirm="refeshView()"></editMeddle>
  </div>
</template>

<script>
import Conf from "@/config/index.js";
import editMeddle from "../edit-meddle/index.vue";
export default {
  components: {
    editMeddle
  },
  props: {
    title: {
      type: String,
      default: "案例详情"
    },
  },
  data() {
    return {
      drawerShow: false,
      handleLoading: false,
      referInfo: {
        id: 0,
      },
      accessToken: "",
      apiUrl: "",
      wapUrl: ""
    };
  },
  methods: {
    showDrawer({ id }) {
      this.drawerShow = true;
      this.handleLoading = false;
      this.getView(id).then(()=>{
        this.accessToken = "";
        this.getBackstageToken();
      })
    },
    getView(id) {
      if (!Number(id) && Number(id) != 0) return;
      this.pageLoading = true;
      return this.$MainApi
        .referralView({
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
            this.referInfo = data;
          }
        })
        .finally(() => {
          this.pageLoading = false;
        });
    },
    setHandle() {
      let referInfo = this.referInfo || {};
      this.handleLoading = true;
      return this.$MainApi
        .referralAccomplish({
          data: {
            id: referInfo.id,
          },
        })
        .then((res) => {
          this.tableLoading = false;
          if (res.code) {
            this.$Message.success(res.message || "操作成功");
            this.getView(referInfo.id);
            this.$emit("success");
          } else {
            this.$Message.warning(res.message || "操作失败");
          }
        })
        .finally(() => {
          this.handleLoading = false;
        });
    },
    editMeddleEvent(){
      let referInfo = this.referInfo || {};
      let appointment = referInfo.get_appointment || {};
      this.getBackstageToken().then(()=>{
        this.$refs["editMeddleRef"] && this.$refs["editMeddleRef"].showDrawer({
          userId: appointment.user_key,
          name: appointment.name,
          accessToken: this.accessToken,
          apiUrl: this.apiUrl
        });
      })
    },
    getBackstageToken(){
      let referInfo = this.referInfo || {};
      // let appointment = referInfo.get_appointment || {};
      if(this.accessToken){
        return new Promise((rs)=>{
          return rs(this.accessToken);
        })
      } else {
        return this.$MainApi
        .getBackstageToken({
          data: {
            target_id: referInfo.target_id,
            admin_name: this._adminName
          },
        }).then((res)=>{
          if(res.code){
            let data = res.data || {};
            this.accessToken = data.accessToken || "";
            this.apiUrl = data.api_url || "";
            this.wapUrl = data.wap_url || "";
            return Promise.resolve();
          } else {
            this.$Message.warning(res.message || "请求出错");
            return Promise.reject();
          }
        })
      }
    },
    checkSyrveyFile(){
      this.getBackstageToken().then(()=>{
        let referInfo = this.referInfo || {};
        let appointment = referInfo.get_appointment || {};
        if(this.wapUrl){
          window.open(`${this.wapUrl}/#/memberPsychicFiles?userId=${appointment.user_key}&accessToken=${this.accessToken}`)
        } else {
          this.$Message.info("无效第三方域名")
        }
      })
    },
    refeshView(){
      let referInfo = this.referInfo || {};
      this.getView(referInfo.id);
    }
  },
  mounted() {
    
  },
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