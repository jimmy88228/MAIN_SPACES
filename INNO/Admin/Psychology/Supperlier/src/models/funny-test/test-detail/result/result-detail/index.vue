<template>
  <custom-modal class="hold-modal-zindex" ref="modal" :width="500" :footerHide="true" :closable="true" title="编辑结果">
    <div class="result-detail-modal" v-bar>
      <Form class="result-detail-form" :label-width="100" :model="resultInfo" ref="formDataRef" :rules="ruleValidate">
          <div class="flex ivu-form-item-required" v-if="pageQuery.type == 'scoring'">
            <div class="ivu-form-item-label" style="width: 100px;">分值</div>
            <div class="flex">
              <FormItem :label-width="0" prop="min_value" >
                <div class="flex-s-c">
                <custom-input size="large" :toFixed="2" class="base-100" :max="resultInfo.max_value ? resultInfo.max_value : ''" v-model="resultInfo.min_value" placeholder="最小分值" type="number"></custom-input>
                <p class="m-l-10 m-r-10">-</p>
                </div>
              </FormItem>
              <FormItem :label-width="0" prop="max_value" v-if="pageQuery.type == 'scoring'">
                <custom-input size="large" :toFixed="2" class="base-100" v-model="resultInfo.max_value" placeholder="最大分值" type="number"></custom-input>
              </FormItem>
            </div>
          </div>
          <FormItem label="所属类型" prop="related_key" v-if="pageQuery.type == 'dimension'">
            <div class="select-type-area">
                <data-select size="large" :multiple="true" :isShowDefault="false" :isAuto="false" ref="typeSelectRef" type="tasteType" :params="{ testId: pageQuery.testId, type: pageQuery.type }" v-model="resultInfo.related_key" class="base-320" placeholder="请选择类型">
                  <a slot="expand" class="select-txt flex-c-c">选择</a>
                </data-select>
            </div>
          </FormItem>
          <FormItem label="标题" prop="name">
            <custom-input size="large" v-model="resultInfo.name" class="base-320" placeholder="请填写标题"  :maxlength="30" :showWordLimit="true"></custom-input>
          </FormItem>
          <FormItem label="副标题" prop="short_desc">
            <custom-input size="large" v-model="resultInfo.short_desc" class="base-320" placeholder="请填写副标题"  :maxlength="30" :showWordLimit="true"></custom-input>
          </FormItem>
          <FormItem label="描述" prop="description">
            <custom-input size="large" v-model="resultInfo.description" type="textarea" class="base-320 result-detail-desc" placeholder="请填写备注"  :maxlength="300" :showWordLimit="true"></custom-input>
          </FormItem>
          <FormItem style="margin:0px;">
            <Button type="primary" @click="confirm()">&nbsp;{{resultInfo.id ? '保 存' : '创 建'}}&nbsp;</Button>
          </FormItem>
          <Spin fix v-if="pageLoading"></Spin>
      </Form>
    </div>
  </custom-modal>
</template>

<script>
export default {
  props: {},
  data(){
    return {
      resultInfo: {},
      defaultResultInfo: {
        id: 0,
        test_id: '',
        name: '',
        short_desc: '',
        description:'',
        min_value: 0,
        max_value: 0,
        related_key: []
      },
      ruleValidate: {
        min_value: [
          {
            required: true,
            validator: this._checkNumber,
            trigger: "blur",
            message: "请输入最小分值",
          },
        ],
        max_value: [
          {
            required: true,
            validator: this._checkNumber,
            trigger: "blur",
            message: "请输入最大分值",
          },
        ],
        related_key: [
          {
            required: true,
            validator: this._checkArray,
            trigger: "blur",
            message: "请选择所属类型",
          },
        ],
        name: [
          {
            required: true,
            validator: this._checkString,
            trigger: "blur",
            message: "请填写标题",
          },
        ],
        description: [
          {
            required: true,
            validator: this._checkString,
            trigger: "blur",
            message: "请填写描述",
          },
        ],
      },
      pageLoading: false
    }
  },
  methods:{
    dismiss() {
      this.$refs.modal.dismiss();
    },
    showModal(detail = {}){
      detail = detail || {};
      this.$refs.modal.show();
      this.$refs["formDataRef"] && this.$refs["formDataRef"].resetFields();
      this.resultInfo = detail.id ? JSON.parse(JSON.stringify(detail)) : JSON.parse(JSON.stringify(this.defaultResultInfo));
      if(this.resultInfo.related_key && typeof(this.resultInfo.related_key) == 'string'){
        this.resultInfo.related_key = this.resultInfo.related_key.split(",")
      } else {
        this.resultInfo.related_key = [];
      }
      this.$refs["typeSelectRef"] && this.$refs["typeSelectRef"].getData();
    },
    confirm(){
     this.$refs["formDataRef"] && this.$refs["formDataRef"].validate((valid) => {
        if (valid) {
          let resultInfo = this.resultInfo || {};
          if(parseFloat(resultInfo.max_value) < parseFloat(resultInfo.min_value)){
            this.$Message.warning("分值最小值不能大于最大值");
            return;
          }
          this.save();
        } else {
          this.$Message.error("请完善相关信息");
        }
     }) 
    },
    save(){
      if(!this.pageQuery.testId){
        return Promise.reject();
      }
      let resultInfo = this.resultInfo || {};
      let req = resultInfo.id ? 'tasteTestResultUpdate' : 'tasteTestResultAdd';
      this.pageLoading = true;
      let relatedKey = resultInfo.related_key
      relatedKey.sort((a, b)=>{ return  a - b })
      return this.$MainApi[req]({
          data: {
            ...resultInfo,
            related_key: relatedKey.join(","),
            testId: this.pageQuery.testId,
            type: this.pageQuery.type
          },
      })
      .then((res) => {
          if (res.code) {
            this.$Message.success(res.message);
            this.dismiss();
            this.$emit("confirm");
          } else {
            this.$Message.warning(res.message);
          }
      }).finally(()=>{
        this.pageLoading = false;
      })
      
    }
  }
}
</script>

<style scoped lang="less">
.result-detail-modal{
  width:100%;
  height: 570px;
  margin: -10px 0px;
  // min-height: 460px;
  // max-height: 500px;
}
.select-type-area{
  position:relative;
  // display: inline-block;
  .select-txt{
    position: absolute;
    top: 50%;
    right:1px;
    padding: 0px 10px;
    height:90%;
    background-color: #fff;
    transform: translateY(-50%);
  }
}
</style>
<style lang="less">
.result-detail-form{
  .select-type-area{
    .ivu-select-selection{
      padding-right: 50px;
    }
  }
  .result-detail-desc{
    .ivu-input{
      min-height: 310px;
    }
  }
}
</style>