<template>
  <Drawer class="page-drawer-area check-count-drawer" :transfer="false" :inner="true" :closable="false" v-model="drawerShow" :width="450">
    <div class="class-edit-area" :style="'padding-top:' +  _pageScrollTop + 'px;'">
      <div class="edit-title bold">{{title}}</div>
      <div class="edit-cont" v-bar>
        <div class="edit-cont-area">
          <Form :label-width="100" :model="assessConfigInfo" ref="formDataRef" :rules="ruleValidate">
            <FormItem label="调整总次数" prop="adjustCount">
              <custom-input type="number" size="large" class="base-320" placeholder="请填写总次数"  v-model="assessConfigInfo.adjustCount" ></custom-input>
              <p class="notice">*调整次数不可低于当前值</p>
            </FormItem>
            <FormItem label="剩余次数">{{surplusCount}}</FormItem>
            <FormItem label="生效日期" prop="begin_date">
              <date-time 
              size="large" 
              :isSetTime="true" 
              :limitDate="'after ' + assessConfigInfo.end_date" 
              :disabled="!canEditBeginDate" 
              type="date" 
              v-model="assessConfigInfo.begin_date" 
              class="base-320" 
              placeholder="请选择生效日期" ></date-time>
            </FormItem>
            <FormItem label="截止日期" prop="end_date">
              <date-time 
              :isSetTime="true" 
              :isEnd="true" 
              :afterNow="true" 
              :limitDate="'before ' + assessConfigInfo.begin_date" 
              size="large" 
              type="date" 
              v-model="assessConfigInfo.end_date" 
              class="base-320" 
              placeholder="请选择截止日期"></date-time>
            </FormItem>
            <FormItem label="备注" v-if="assessConfigInfo.remark">{{assessConfigInfo.remark}}</FormItem>
          </Form>
          <div class="edit-foot">
            <Button @click="drawerShow = false">&nbsp;返回&nbsp;</Button>
            <Button type="primary" :loading="handleLoading" @click="saveAssessConfig">&nbsp;保存&nbsp;</Button>
          </div>
          <Spin fix v-if="handleLoading"></Spin>
        </div>
      </div>
    </div>
  </Drawer>
</template>

<script>
export default {
  props: {
    title: String,
  },
  components: { },
  data() {
    return {
      drawerShow: false,
      handleLoading: false,
      assessConfigInfo: {},
      ruleValidate: {
        adjustCount: [
          {
            required: true,
            validator: this._checkThanInt,
            trigger: "blur",
            message: "请输入调整总次数"
          },
        ],
        begin_date: [
          {
            required: true,
            validator: this._checkString,
            trigger: "blur",
            message: "请选择有效日期"
          },
        ],
        end_date: [
          {
            required: true,
            validator: this._checkString,
            trigger: "blur",
            message: "请选择截止日期"
          },
        ]
      },
    };
  },
  computed:{
    surplusCount(){
      let assessConfigInfo = this.assessConfigInfo || {};
      return Number(assessConfigInfo.adjustCount) - Number(assessConfigInfo.used_count)
    },
    canEditBeginDate(){
      let assessConfigInfo = this.assessConfigInfo || {};
      let nowDate = new Date();
      let beginDate = assessConfigInfo.begin_date ? new Date(assessConfigInfo.begin_date) : '';
      if(beginDate){
        return beginDate.getTime() > nowDate.getTime();
      } else {
        return true;
      }
    }
  },
  methods: {
    showDrawer(detail) {
      this.drawerShow = true;
      this.handleLoading = false;
      this.$nextTick(()=>{
        this.$refs["formDataRef"] && this.$refs["formDataRef"].resetFields();
        detail = detail ? JSON.parse(JSON.stringify(detail)) : {};
        detail.adjustCount = detail.total_count;
        detail.begin_date = detail.begin_date ? detail.begin_date.split(" ")[0] : '';
        detail.end_date = detail.end_date ? detail.end_date.split(" ")[0] : '';
        this.assessConfigInfo = detail || {}
      })
    },
    saveAssessConfig(){
      this.$refs["formDataRef"].validate((valid) => {
        if (valid) {
          this.assessConfigReq();
        } else {
          this.$Message.warning("请完善信息");
        }
      });
    },
    assessConfigReq(){
      let assessConfigInfo = this.assessConfigInfo || {};
      if((assessConfigInfo.total_count > assessConfigInfo.adjustCount)){
        this.$Message.warning("调整次数不可低于当前值(" + assessConfigInfo.total_count + ")");
        this.assessConfigInfo.adjustCount = this.assessConfigInfo.total_count;
        return;
      }
      this.handleLoading = true;
      return this.$MainApi.consultantEvaluateOrderUpdate({
          data: {
            id: assessConfigInfo.id,
            customer_id: assessConfigInfo.customer_id,
            target_id: assessConfigInfo.target_id,
            total_count: assessConfigInfo.adjustCount,
            begin_date: assessConfigInfo.begin_date,
            end_date: assessConfigInfo.end_date,
            remark: assessConfigInfo.remark
          },
        })
        .then((res) => {
          if (res.code) {
            this.$Message.warning(res.message || "保存成功");
            this.drawerShow = false;
            this.$emit("confirm");
          } else {
            this.$Message.warning(res.message || "保存失败");
          }
        }).finally(()=>{
          setTimeout(()=>{
            this.handleLoading = false;
          },200)
        })
    }
  },
  mounted() {},
};
</script>

<style lang="less" scoped>
@import "@/assets/css/variables.less";
.page-drawer-area {
  .edit-cont-area {
    border: 0 none !important;
  }
}
</style>
<style lang="less">
.check-count-drawer{
  .ivu-drawer-mask-inner {
        padding-top: 36px;
        top: -36px;
        box-sizing: unset;
    }
    .ivu-drawer-wrap-inner {
        top: -36px;
    }
}
</style>