<style lang="less">

</style>

<template>
  <Modal
    :mask-closable="false"
    v-model="showM">
    <p slot="header">
        <span>新增标签</span>
    </p>
    <div>
        <Form :rules="ruleValidate" :model="formValidate" :label-width="100" ref="add-label-form">
            <FormItem label="标签名称" prop="tag_name">
                <Input v-model="formValidate.tag_name" placeholder="输入标签名称"></Input>
            </FormItem>
            <FormItem label="标签分组" prop="cat_id">
                <Select v-model="formValidate.cat_id" :loading="showSpan">
                    <Option v-for="(item, index) in groupList" :disabled="item.is_enabled != '1'" :key="index" :value="item.id">{{item.cat_name}}</Option>
                </Select>
            </FormItem>
            <FormItem label="标签代码" prop="identity_code">
                <Input v-model="formValidate.identity_code" placeholder="输入标签代码"></Input>
            </FormItem>
            <FormItem label="是否启用" prop="is_enabled">
                <i-switch v-model="formValidate.is_enabled" :true-value="1" :false-value="0"></i-switch>
            </FormItem>
            <FormItem label="活动标签描述" prop="remark">
                <Input v-model="formValidate.remark" type="textarea" placeholder="填写标签描述"></Input>
            </FormItem>
        </Form>
    </div>
    <div slot="footer">
        <Button type="default" @click="showM = false">取消</Button>
        <Button type="primary" @click="submitAddLabel()">确定</Button>
    </div>
</Modal>
</template>

<script>
import util from '@/libs/util.js';
export default {
  name: 'addLabel',
  components: {},
  data () {
    return {
        formValidate: {
            tag_name: "",
            cat_id: 0,
            remark:"",
            identity_code: "",
            is_enabled: 0
        },
        ruleValidate: {
            tag_name: [
                {required: true, message: '请填写标签名称', trigger: 'blur'}
            ],
            identity_code: [
                {required: true, message: '请填写标签代码', trigger: 'blur'}
            ],
            cat_id: [
                {required: true,  type: 'number', message: '请选择标签分组', trigger: 'change'}
            ]
        },
        editId: 0,
        groupList: [],
        showM: false,
        showSpan: false,
    }
  },
  methods: {
      showModal(data = {}){
        this.formValidate = {
            tag_name: data.tag_name || "",
            cat_id: parseInt(data.cat_id) || 0,
            identity_code: data.identity_code || "",
            is_enabled: data.is_enabled ? 1 : 0,
            remark: ""
        }
        this.editId = data.id || 0;
        this.showM = true
        this.getSelectGroup();
      },
      submitAddLabel(){
          console.log("formValidate", this.formValidate);
          this.$refs["add-label-form"].validate((valid)=>{
              if(valid){
                  this.showM = false;
                  this.submitReq();
              } else {
                  this.$Message.error('填写完整信息!');
              }
          })
      },
      submitReq(){
          this.$emit("on-submitLabel", {
              formData: this.formValidate,
              editId: this.editId
          })
      },
      getSelectGroup(){
        this.showSpan = true;
        return util.ajax.post(util.apiUrl.ErpTagLabelCateDate).then(e =>{
            let res = e.data || {};
            if(res.code && res.data) {
                this.groupList = (res.data && res.data.items) || []
                console.log("分组数据",res);
            }
        }).finally(()=>{
            this.showSpan = false
        })
      }
  },
}
</script>