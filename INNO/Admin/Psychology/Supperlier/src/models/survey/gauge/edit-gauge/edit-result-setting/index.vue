<template>
  <custom-modal footerHide :width="560" ref="modalId" :title="(formData.id ? '编辑':'新增')+(currentTab=='total'?'结果':'维度')">
    <div class="result-setting-modal form-view-box">
        <Form
            class="box"
            :label-width="80"
            ref="formId"
            :model="formData"
            :rules="ruleValidate"
        >
            <div class="modalTitle">{{currentTab=='total'?'总分结果': ((formData.id ? '编辑':'新增') + '结果')}}</div> 
            <FormItem label="维度" prop="addDimension" v-if="currentTab=='dimension'">
                <dimensionSelect @change="dimensionAdd" type="gauge" :defaultEmpty="false" :id="pageQuery.id" :canEdit="false" v-model="formData.addDimension" style="width: 166px;" placeholder="选择维度"></dimensionSelect>
            </FormItem> 
            <FormItem label="统计方式" prop="rule_type">
              <div v-if="isLimitStatistics">
                {{formData.rule_type ? ((statisticsType[formData.rule_type] && statisticsType[formData.rule_type].name) || '--') : '--'}}
              </div>
              <div class="flex" v-else>
                <div class="statistics-radio flex-c-c" v-for="item in statisticsRadios" :key="item.key" @click="changeStatistics(item.key)">
                  <span class="radio-rect" :class="{active: formData.rule_type == item.key}" ></span>
                  <span>{{item.name}}</span>
                </div>
              </div>
            </FormItem>
            <FormItem >
                <div slot="label" class="label-require">分值</div>
                <div class="flex-s-c">
                    <FormItem :label-width="0" prop="min_value">
                        <div class="flex-s-c">
                            <custom-input
                                style="width: 66px"
                                v-model="formData.min_value"
                                type="number"
                                placeholder="" 
                            ></custom-input>
                        </div>
                    </FormItem> 
                    <div class="font-18 p-l-5">
                        ≤
                    </div>
                    <div class="p-l-5 p-r-5">
                        得分
                    </div>
                    <div class="font-18 p-r-5">
                        &lt;
                    </div>
                    <FormItem :label-width="0" prop="max_value">
                        <div class="flex-s-c">
                            <custom-input
                                style="width: 66px"
                                v-model="formData.max_value"
                                type="number"
                                placeholder="" 
                            ></custom-input>
                        </div>
                    </FormItem> 
                    <div class="errorDistrict" v-if="showErrorDistrict">{{showErrorDistrict}}</div>
                </div>
            </FormItem>
            <FormItem label="结论" prop="range_name">
                <custom-input
                    style="width: 280px"
                    v-model="formData.range_name"
                    type="text"
                    placeholder=""
                    :maxlength="30"
                ></custom-input>
            </FormItem>
            <FormItem label="概述" prop="short_desc">
                <custom-input
                    style="width: 280px"
                    v-model="formData.short_desc"
                    type="textarea"
                    placeholder=""
                    :maxlength="64"
                ></custom-input>
            </FormItem> 
            <FormItem label="结果描述" prop="description">
                <custom-input
                    style="width: 280px"
                    v-model="formData.description" 
                    type="textarea"
                    placeholder=""
                    :maxlength="150"
                    :rows="3"
                ></custom-input>
            </FormItem> 
        </Form>
        <div class="flex-c-c m-t-10">
            <Button @click="cancel" class="m-r-20">取消</Button>
            <Button @click="confirm" type="primary" :loading="isLoading" class="m-r-20">保存设置</Button>
        </div> 
    </div>
</custom-modal>
</template>

<script>
const ERROR_MSG = "与现有的区间重叠，请调整范围";
import dimensionSelect from "@/components/view-components/editable-select/index.vue";
export default {
  components: { dimensionSelect },
  props: {
    statisticsType: {
      type: Object,
      default: () => {},
    },
    currentTab: String,
    viewData: {
      type: Array,
      default: () => [],
    },
    initDimensionList: {
      type: Array,
      default: () => [],
    }
  },
  computed: {
      statisticsRadios(){
        let statisticsType = this.statisticsType || {};
        let currentTab = this.currentTab;
        let data = [];
        for(let i in statisticsType){
            let isGet = currentTab == 'dimension' ? (i.indexOf('dimension') != -1) : (i.indexOf('dimension') == -1)
            if(i && isGet || i == 't_score'){
                data.push({
                    key: i,
                    ...statisticsType[i]
                })
            }
        }
        return data;
      },
  },
  data(){
    return {
      formData:{
          id:0,
          addDimension:0,
          total:0,
          min_value:0,
          max_value:0,
          range_name: '',
          short_desc :'',
          description:'',
          is_red: 0,
          is_warn: 0,
          rule_id: 0,
          rule_type: '',
          ruleDescription: '',
          rule_name: '',
          warningArea: 0
      },
      isLoading: false,
      isLimitStatistics: false,
      ruleValidate:{  
        addDimension: [
            {
                required: true,
                validator: (rule, value, callback)=>{
                    if(Number(value) > 0){  
                        this.$refs.formId.validateField('min_value');
                        this.$refs.formId.validateField('max_value');
                        callback();
                    } else {
                        callback(new Error('请选择维度'));
                    }
                },
                trigger: "change",
            },
        ],
        rule_type: [
            {
                required: true,
                validator: this._checkString,
                message: "统计方式不能为空",
                trigger: "change",
            },
        ],
        range_name: [
            {
                required: true,
                validator: this._checkString,
                message: "结论不能为空",
                trigger: "blur",
            },
        ],
        short_desc: [
            {
                required: true,
                validator: this._checkString,
                message: "概述不能为空",
                trigger: "blur",
            },
        ],
        description: [
            {
                required: true,
                validator: this._checkString,
                message: "描述不能为空",
                trigger: "blur",
            },
        ],
        min_value: [
            {
                required: true,
                validator: (rule, value, callback)=>{
                    let check = this.checkDistrict('min');
                    if(check && check.bool){
                        this.bothCheck();
                        value || value===0 ? callback() : callback("");
                    }else{
                        callback("");
                    }
                },
                trigger: "blur",
            },
        ],
        max_value: [
            {
                required: true,
                validator: (rule, value, callback)=>{
                    let check = this.checkDistrict('max')
                    if(check && check.bool){
                        this.bothCheck();
                        value || value===0 ? callback() : callback("");
                    }else{
                        callback("");
                    }
                },
                trigger: "blur",
            },
        ],
      },
      minInited:false,
      maxInited:false,
      showErrorDistrict: ERROR_MSG,
    }
  },
  methods: {
    cancel(){
        this.$refs.modalId.dismiss();
    },
    showModal(detail){
      // this.$refs.formId.resetFields();
      detail = detail || {};
      let { ruleType } = this.checkLimitStatistics(detail.id, detail.addDimension);
      detail.rule_type = detail.rule_type || ruleType || ''; 
      this.formData.id = detail.id || 0;
      this.formData.min_value = detail.min_value||0;
      this.formData.max_value = detail.max_value||0;
      this.formData.short_desc = detail.short_desc||"";
      this.formData.description = detail.description||"";
      this.formData.range_name = detail.range_name || "";
      this.formData.is_warn = detail.is_warn || 0;
      this.formData.is_red = detail.is_red || 0;
      this.formData.addDimension = detail.addDimension||0;
      this.formData.warningArea = detail.warningArea || 0;
      this.formData.rule_id = detail.rule_id || 0;
      this.formData.rule_type = detail.rule_type || '';
      this.formData.rule_name = detail.rule_name || "";
      this.formData.ruleDescription = detail.ruleDescription || "";
      this.showErrorDistrict = "";
      this.minInited=false;
      this.maxInited=false;
      this.$refs.modalId.show();
    },
    checkLimitStatistics(editId, dimensionId){
      editId = parseInt(editId);
      dimensionId = parseInt(dimensionId);
      let viewData = this.viewData || [];
      let result = {};
      if(viewData.length){
        if(this.currentTab == 'total'){
          result = {
            ruleType: (viewData[0].rule_info && viewData[0].rule_info.rule_type) || ''
          }
          this.isLimitStatistics = true;
        } else {
          if(dimensionId){
            let currRule = {};
            for(let i = 0; i < viewData.length; i++){
              let rule_info = viewData[i].rule_info || {};
              let range_list = viewData[i].range_list || [];
              if(rule_info.dimension_id == dimensionId){
                currRule = rule_info
                if(editId){
                  for(let j = 0; j < range_list.length; j++){
                    if(editId == range_list[j].id){
                      result = {
                        ruleType: rule_info.rule_type || ''
                      }
                    }
                    break;
                  }
                } else {
                  if(!result.ruleType){
                    result = {
                      ruleType: rule_info.rule_type || ''
                    }
                    break;
                  }
                }
              }
              if(result.ruleType){ break; }
            }
            if(!result.ruleType){
              result = {
                ruleType: currRule.rule_type || ''
              }
            }
            this.isLimitStatistics = result.ruleType ? true : false;
          } else {
            this.isLimitStatistics = false;
          }
        }
      } else {
        this.isLimitStatistics = false;
      }
      
      return result;
    },
    validate(){
      return new Promise((rs,rj)=>{
          try{
              this.$refs.formId.validate((valid) => {
                  if (valid) {
                      return this.bothCheck().then(()=>{
                          return rs();
                      }).catch(()=>{
                          return rj();
                      })
                  }else{ 
                      return rj();
                  }
              })

          }catch(e){
              console.log('catch',e)
          }
      })
  },
  bothCheck(){
      return new Promise((rs,rj)=>{
          let check = this.checkDistrict('both');
          if(check && !check.bool){
              return rj(check);
          }else{
              this.showErrorDistrict = "";
              return rs(check);
          }
      })
  },
  checkDistrict(type){ 
      let check = {bool:true,min:-1,max:-1};
      let list = this.viewData || [];
      let curId = this.formData.id || 0, minVal = Number(this.formData.min_value), maxVal = Number(this.formData.max_value), RangError = "最大值需要大于最小值";
      let rangeCheck=(minVal>=maxVal || this.checkEmpty(this.formData.min_value,this.formData.max_value));
      type == 'min' && (this.minInited = true);
      type == 'max' && (this.maxInited = true);
      if(this.dimensionGet().length<=0 && (minVal>=maxVal)){
        
          type == 'min' && this.maxInited && (this.showErrorDistrict = RangError );
          type == 'max' && this.minInited && (this.showErrorDistrict = RangError );
          type == 'both' && (this.minInited && this.maxInited) && (this.showErrorDistrict = RangError);
          this.showErrorDistrict && (check.bool = false);
          return check
      }
      
      for(let i = 0,len=list.length;i<len;i++){
          let l_item = list[i]||{};
          let range = l_item.range_list || [];
          if(this.currentTab == 'dimension' && this.formData.addDimension && l_item.rule_info){ //维度遍历过滤
              if(l_item.rule_info.dimension_id != this.formData.addDimension){
                  continue;
              }
          }
          for(let j = 0,jLen=range.length;j<jLen;j++){
              let r_item = range[j]||{};
              if((!curId || (curId>0 && curId!=r_item.id))){
                  let referArr = [Number(r_item.min_value),Number(r_item.max_value)-0.01];
                  switch (type) {
                      case 'both': //最小最大值交集校验
                          if((minVal>=maxVal) || this.isIntersect([minVal,maxVal-0.01],referArr)){
                              check.bool = false;
                              check.min = r_item.min_value;
                              check.max = r_item.max_value;
                              (this.minInited && this.maxInited) && (this.showErrorDistrict = rangeCheck ? RangError : ERROR_MSG);
                          }
                          break; 
                      case 'min': //最小值交集校验
                          if(this.isIntersect([minVal],referArr)){
                              check.bool = false;
                              check.min = r_item.min_value;
                              check.max = r_item.max_value;
                              this.maxInited && (this.showErrorDistrict = rangeCheck ? RangError : ERROR_MSG );
                          };
                          break;
                      case 'max': //最大值交集校验
                          if(this.isIntersect([maxVal-0.01],referArr)){
                              check.bool = false;
                              check.min = r_item.min_value;
                              check.max = r_item.max_value;
                              this.minInited && (this.showErrorDistrict = rangeCheck ? RangError : ERROR_MSG );
                          }
                          break;
                      default:
                          break;
                  }
                  if(!check.bool){
                      break
                  } 
              }
          };
          if(!check.bool){
              break;
          }
      }
      return check;
    },
    changeStatistics(ruleType){
      if(this.formData.rule_type != ruleType){
        this.formData.rule_type = ruleType;
      }
    },
    dimensionAdd(e,item){
        this.formData.rule_name = item.dimension_name||"";
        let { ruleType } = this.checkLimitStatistics(this.formData.id, this.formData.addDimension);
        console.log("ruleType", ruleType)
        this.formData.rule_type = ruleType || "";
    },
    checkEmpty(a,b){
      return (a==='' || b==='')
    },
    isIntersect(arr1,arr2){
      let start = [Math.min(...arr1),Math.min(...arr2)];
      let end = [Math.max(...arr1),Math.max(...arr2)];
      return Math.max(...start) <= Math.min(...end);
    },
    dimensionGet(){
        return this.initDimensionList.filter(item=>item.rule_info && ((item.rule_info.dimension_id == (this.formData.addDimension)) || this.formData.addDimension==0));
    },
    confirm(){
      this.validate().then(()=>{
        this.isLoading = true;
        setTimeout(()=>{
          this.isLoading = false;
        }, 500)
        this.$emit("confirm", this.formData);
      }).catch(()=>{
        this.$Message.warning("请完善信息")
      })
    }
  }
}
</script>

<style lang="less">
.result-setting-modal{
  .errorDistrict{
      position: absolute;
      left: 0;
      top: 100%;
      color: #ed4014;
  }
  .modalTitle{ 
      font-size: 14px; 
      font-weight: 600;
      color: #000000;
      margin-bottom: 16px;
      padding-left: 12px;
  }
  .statistics-radio{
    margin-right: 10px;
    cursor: pointer;
  }
  .radio-rect{
      display: inline-block;
      width: 14px;
      height: 14px;
      background: #FFFFFF;
      border-radius: 2px;
      border: 1px solid #B2B2B2;
      cursor: pointer;
      position: relative;
      margin-right: 5px;
      &.active{
          background: #3598D2;
          &::after{
              content:"";
              width: 60%;
              height: 5px;
              border-left: 2px solid #fff;
              border-bottom: 2px solid #fff;
              position: absolute;
              left: 50%;
              top: calc(50% - 1px);
              transform: translate(-50%,-50%) rotate(-45deg);
          }
      }
  }
  .disabled{
      color: #7f7f7f;
      opacity: 0.7; 
  }
}
</style>