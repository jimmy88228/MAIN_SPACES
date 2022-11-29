<template>
  <custom-modal class="hold-modal-zindex" :isSlotHeader="true" ref="modal" :width="530" :footerHide="true" :closable="true">
    <div class="count-modal-title" slot="header">
      {{countInfo.id ? '编辑次数' : '新增次数'}}
    </div>
    <div class="count-modal-content">
      <Form :label-width="150" :model="countInfo" ref="formDataRef" :rules="ruleValidate">
        <FormItem label="预约咨询总次数" prop="total_count">
          <custom-input type="number" size="large" class="base-320" placeholder="请填写总咨询次数" v-model="countInfo.total_count" ></custom-input>
        </FormItem>
        <FormItem label="调整使用期限">
          <div class="radio-box flex-s-c">
              <div v-for="item in limitType" :key="item.key" class="radio flex-c-c pointer" :class="[countInfo.limit_time == item.key?'active':'']" @click="radioClick(item.key, 'limit_time')">
                  <div class="radio-cir"></div>
                  <div class="radio-name">{{item.name}}</div>
              </div>
          </div>
        </FormItem>
        <FormItem label="有效日期" prop="end_date" v-if="countInfo.limit_time">
          <date-time size="large" type="daterange" v-model="countInfo.date" class="base-320" placeholder="请选择有效日期" @change="changeDate"></date-time>
        </FormItem>
        <FormItem label="备注" prop="remark">
          <custom-input class="base-320" type="textarea" placeholder="请填写备注" v-model="countInfo.remark" :show-word-limit="true" :maxlength="200"></custom-input>
        </FormItem>
      </Form>
    </div>
    <div class="flex-c-c footer-btns">
      <Button size="large" type="primary" :loading="btnLoading" @click="confirm">确认开启</Button>
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
        id: 0,
        customer_id: 0,
        total_count: '',
        remark: "",
        begin_date: "",
        end_date: "",
        date: [],
        limit_time: 0
      },
      limitType: [
        {
          key: 0,
          name: "不限制"
        },
        {
          key: 1,
          name: "限制"
        }
      ],
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
    showModal(countInfo = {}){
      this.$refs["formDataRef"] && this.$refs["formDataRef"].resetFields();
      this.countInfo.id = countInfo.id || 0;
      this.countInfo.customer_id = countInfo.customer_id || 0;
      this.countInfo.total_count = countInfo.total_count || '';
      this.countInfo.remark = countInfo.remark || '';
      this.countInfo.begin_date = countInfo.begin_date || "";
      this.countInfo.end_date = countInfo.end_date || "";
      this.countInfo.limit_time = countInfo.limit_time || 0;
      this.countInfo.date = [];
      if(this.countInfo.begin_date && this.countInfo.end_date){
        this.countInfo.date = [this.countInfo.begin_date, this.countInfo.end_date];
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
    radioClick(value, key){
      this.$set(this.countInfo, key, value);
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
      let req = Number(countInfo.id) ? 'consultantAppointmentOrderUpdate' : 'consultantAppointmentOrderAdd';
      return this.$MainApi[req]({
          data: this.countInfo,
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