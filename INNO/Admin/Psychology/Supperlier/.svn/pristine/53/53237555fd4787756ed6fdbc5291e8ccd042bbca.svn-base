<template>
  <custom-modal class="hold-modal-zindex" :isSlotHeader="true" ref="modal" :width="530" :footerHide="true" :closable="true">
    <div class="count-modal-title" slot="header">新增次数</div>
    <div class="count-modal-content">
      <Form :label-width="150" :model="countInfo" ref="formDataRef" :rules="ruleValidate">
        <FormItem label="测评活动总次数" prop="total_count">
          <custom-input type="number" size="large" class="base-320" placeholder="请填写测评活动总次数" v-model="countInfo.total_count" ></custom-input>
        </FormItem>
        <FormItem label="有效日期" prop="end_date">
          <date-time size="large" type="daterange" v-model="countInfo.date" class="base-320" placeholder="请选择有效日期" @change="changeDate"></date-time>
        </FormItem>
        <FormItem label="备注" prop="remark">
          <custom-input class="base-320" type="textarea" placeholder="请填写备注" v-model="countInfo.remark" :show-word-limit="true" :maxlength="200"></custom-input>
        </FormItem>
      </Form>
    </div>
    <div class="flex-c-c footer-btns">
      <Button size="large" type="primary" :loading="btnLoading" @click="confirm">确认</Button>
    </div>
  </custom-modal>
</template>

<script>
export default {
  props: {
    isLimit: Boolean
  },
  data(){
    return {
      countInfo: {
        customer_id: 0,
        target_id: '',
        total_count: '',
        remark: "",
        begin_date: "",
        end_date: "",
        date: [],
      },
      ruleValidate: {
        total_count: [
          {
            required: true,
            validator: this._checkThanInt,
            trigger: "blur",
            message: "请输入咨询总次数"
          },
        ],
        end_date: [
          {
            required: true,
            validator: this._checkString,
            trigger: "blur",
            message: "请选择有效期"
          },
        ]
      },
      btnLoading: false
    }
  },
  methods: {
    dismiss() {
      this.$refs.modal.dismiss();
    },
    showModal(){
      this.$refs["formDataRef"] && this.$refs["formDataRef"].resetFields();
      this.countInfo = {
        customer_id: this.pageQuery.customer_id,
        target_id: this.pageQuery.target_id,
        total_count: '',
        remark: "",
        begin_date: "",
        end_date: "",
        date: [],
      }
      this.$refs.modal.show();
    },
    changeDate(date){
      let dateS = date[0] || "";
      let dateE = date[1] || "";
      let dateSArr = dateS.split(" ");
      let dateEArr = dateE.split(" ");
      let s_date = dateSArr[0] + ' 00:00' || '';
      let e_date = dateEArr[0] + ' 23:59' || ''
      this.$set(this.countInfo, "begin_date", s_date);
      this.$set(this.countInfo, "end_date", e_date);
      this.$set(this.countInfo, "date", [s_date,e_date]); 
    },
    confirm(){
      this.$refs["formDataRef"].validate((valid) => {
        if (valid) {
          this.updateCountInfo();
        } else {
          this.$Message.warning("请完善信息");
        }
      });
    },
    updateCountInfo(){
      this.btnLoading = true;
      let countInfo = this.countInfo || {};
      return this.$MainApi.consultantEvaluateOrderAdd({
          data: countInfo,
        })
        .then((res) => {
          if (res.code) {
            this.$Message.warning(res.message || "设置成功");
            this.dismiss();
            this.$emit("confirm");
          } else {
            this.$Message.warning(res.message || "设置失败");
          }
        }).finally(()=>{
          setTimeout(()=>{
            this.btnLoading = false;
          },200)
          
        })
    }

  }
}
</script>

<style scoped lang="less">
.count-modal-title{
}
.count-modal-content{
  padding-top: 10px;
  font-size: 18px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #333333;
  line-height: 30px;
  .radio{
        padding: 2px 10px;
        border-radius: 2px;
        background-color: #fff;
        transition: all 0.2s;
        border: 1px solid #DDDDDD;
        margin-right: 10px;
        .radio-cir{
            width: 16px;
            height: 16px;
            background-color: #FFFFFF;
            border: 1px solid #B2B2B2;
            position: relative;
            border-radius: 50%;
            margin-right: 10px;
        }
        &.active{
            background-color: #EFFAFF;
            color: #008ACB;
            .radio-cir{
                background-color: #008ACB;
                border: 1px solid #008ACB;
                position: relative;
                &::after{
                    content: "";
                    position: absolute;
                    width: 7px;
                    height: 7px;
                    border-radius: 50%;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%,-50%);
                    background-color: #fff;
                }
            }   
        }
    }
    .bg_f3{
        background: #f3f3f3;
        div{
            opacity: 0.5;
            color: #7f7f7f;
        }
    }
}
.footer-btns{
  padding-top: 30px;
  padding-bottom: 10px;
}
</style>