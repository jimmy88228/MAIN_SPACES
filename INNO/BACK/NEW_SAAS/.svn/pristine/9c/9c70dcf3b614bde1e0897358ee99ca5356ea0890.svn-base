

<template>
  <div class="">
      <Modal v-model="showM">
          <p slot="header">
              <span>标签分组</span>
          </p>
          <Form :rules="ruleValidate" :model="formValidate" :label-width="100" ref="add-group-form">
            <FormItem label="分组名" prop="cat_name">
                <Input v-model="formValidate.cat_name" placeholder="添加增加的分组名称"></Input>
            </FormItem>
          </Form>
          <div slot="footer">
            <Button type="default" @click="showM = false">取消</Button>
            <Button type="primary" @click="addGroup()">确定</Button>
        </div>
      </Modal>
  </div>
</template>

<script>
export default {
  name: 'labelGroups',
  components: {},
  props: {
    // title: {
    //   type: String,
    //   default(){
    //     return "标题"
    //   }
    // },
    // canAction: {
    //   type: Object,
    //   default(){
    //     return {}
    //   }
    // }
  },
  data () {
    return {
      showM: false,
      formValidate: {
          cat_name: ""
      },
      ruleValidate:{
          cat_name: [
              {required: true, message: '请填写分组名称', trigger: 'blur'}
          ]
      },
      editId: 0
    }
  },
  methods: {
    showModal(data){
      data = data || {}
      this.formValidate.cat_name = data.cat_name || "";
      this.editId = data.id || 0
      this.showM = true
    },
    addGroup(){
      this.$refs["add-group-form"].validate((valid)=>{
            if(valid){
                this.showM = false;
                this.submitReq();
            } else {
                this.$Message.error('填写完整信息!');
            }
        })
    },
    submitReq(){
      this.$emit("on-submitGroup", {
        formData: this.formValidate,
        editId: this.editId
      });
    }
  },
}
</script>

<style lang="less">
.list-head{
  padding-bottom:20px;
  .operate-btn{
    width:100%;
    display:flex;
    justify-content: flex-end;
  }
} 
</style>
