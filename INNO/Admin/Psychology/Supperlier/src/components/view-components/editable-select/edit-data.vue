<template>
<div class="" v-if="isShow">
  <custom-modal :transfer="true" class="edit-dimension-modal hold-modal-zindex" ref="modal" :width="560" :closable="true" :isSlotHeader="true" :isSlotFooter="true">
    <div slot="header">编辑与创建</div>
    <div class="edit-modal-cont _edit-modal-cont">
      <span class="add-dimension flex-c-c" @click="addDimension"><Icon type="md-add" />新增{{typeData.name}}</span>
      <div class="dimension-list-area">
        <div class="dimension-list-hold" v-bar>
          <Form class="dimension-list" ref="formDataRef" :model="formData">
            <FormItem 
            :prop="'editData.'+ index +'.'+item.nameKey" 
            :rules="{required: true, message: typeData.name+'名称不能为空', validator: _checkString,  trigger: 'blur'}"
            class="dimension-item" 
            v-for="(item, index) in formData.editData" 
            :key="index">
              <custom-input v-model="item[item.nameKey]" size="large"></custom-input>
              <Icon v-if="!Number(item.id)" @click="removeItem(index)" class="close-icon" :size="20" type="md-close-circle" />
            </FormItem>
          </Form>
        </div>
      </div>
    </div>
    <div slot="footer">
      <Button @click="dismiss">取消</Button>
      <Button type="primary" @click="confirm()">保存</Button>
    </div>
    <Spin fix v-if="pageLoading"></Spin>
  </custom-modal>
</div>
</template>

<script>
import dimensionH from "./list-data.js";
export default {
  props: {
    id: {
      type: Number | String,
      default: 0
    },
    type:String,
  },
  data(){
    return {
      defaultData:{ 
        gauge:{
          id:0,
          nameKey:"dimension_name",
          dimension_name:"",
          description:"",
        },
        funnyTest:{
          id:0,
          nameKey:"name",
          name:"",
          remark:"",
          type: "dimension",
          testId: this.id||""
        },
      }, 
      formData: {
        editData: [],
      },
      isShow: false
    }
  },
  computed: {
    typeData() {
      return dimensionH.typeData && dimensionH.typeData[this.type] || {}
    }
  },
  methods: {
    dismiss() {
      this.$refs.modal.dismiss();
      this.isShow = false;
    },
    showModal(detail){
      let editData = JSON.parse(JSON.stringify(detail.editData || []));
      editData = editData.filter((item)=>{
        return Number(item.id) != 0
      })
      this.formData.editData = editData || [];
      console.log('this.formData.editData',this.formData.editData)
      this.isShow = true;
      this.$nextTick(()=>{
        this.$refs.modal.show();
      })
    },
    addDimension(){
      this.formData.editData.push(JSON.parse(JSON.stringify(this.defaultData[this.type])))
    },
    removeItem(index){
      if(index || index == 0){
        this.formData.editData.splice(index, 1)
      }
    },
    confirm(){
      this.$refs["formDataRef"] && this.$refs["formDataRef"].validate((valid) => {
        if (valid) {
          this.save();
        } else {
          this.$Message.warning(`请完善${this.typeData.name}信息`);
        }
      })
    },
    save(){
        this.pageLoading = true
        return this.$MainApi[this.typeData.saveUrl]({
            data:this.getParams(),
        }).then(res=>{
            if(res.code){
              this.dismiss();
              dimensionH.loadData(this.id,this.type);
            }
            res.message && this.$Message.warning(res.message);
            return Promise.reject(res);
        }).finally(()=>{
          this.pageLoading = false;
        })
    },
    getParams(){
      let params = {};
      let arr = JSON.parse(JSON.stringify(this.formData.editData||[]));
      arr.forEach(item=>{
        delete item.nameKey
      })
      switch (this.type) {
        case 'gauge':
          params = {
            model_id:Number(this.id || 0),
            dimension_data: arr
          }
          break;
        case 'funnyTest':
          params = {
            id:Number(this.id || 0),
            type_data: arr
          }
          break; 
        default:
          break;
      }
      return params
    },
  }
}
</script>

<style lang="less" scoped>
.edit-dimension-modal{
  .add-dimension{
    width: 124px;
    height: 40px;
    background: #ECF8FE;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #008ACB;
    line-height: 20px;
    margin-bottom: 10px;
    cursor: pointer;
  }
  .dimension-list-area{
      max-height: 400px;
      display: flex;
  }
  .dimension-list-hold{
    flex: 1;
  }
  .dimension-list{
    padding: 10px 0px;
  }
  .dimension-item{
    display: inline-block;
    width: 166px;
    margin-right:10px;
    margin-bottom: 18px;
    position: relative;
  }
  .close-icon{
    cursor: pointer;
    opacity: 0;
    z-index: 2;
    position: absolute;
    top: 0px;
    right: 0px;
    transform: translate(40%, -40%);
    transition: opacity .35s;
    color: #158BC9;
  }
  .dimension-item:hover{
    .close-icon{
      opacity: 1;
    }
  }
  .edit-modal-cont{
    margin: -10px 0px;
  }
}
</style>
<style lang="less">
._edit-modal-cont{
  .ivu-form-item-error-tip{
    padding-top: 2px;
  }
}

</style>