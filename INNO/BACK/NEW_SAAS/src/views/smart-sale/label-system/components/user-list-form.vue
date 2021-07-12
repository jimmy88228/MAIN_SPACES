

<template>
    <div>
        <Form :model="formValidate" :label-width="100" ref="add-label-form">
            <div class="flex f-just-between m-bottom-15">
                <div class="flex">
                    <Button type="primary" @click="creatTask('msg')">发消息</Button>&nbsp;
                    <Button type="primary" @click="creatTask('coupon')">发优惠券</Button>
                </div>
                <div class="space-nowrap flex">
                    <div v-if="type == 'manual'"> <!--手动标签开放-->
                        <Button type="primary" @click="addUsersAction">+会员</Button>&nbsp;&nbsp;
                        <Poptip
                            confirm
                            placement="bottom"
                            title="确定删除选中的会员吗?"
                            @on-ok="removeUser">
                            <Button type="error">删除选中的会员</Button>&nbsp;&nbsp;
                        </Poptip>
                    </div>
                    <Input
                    class=""
                    style="width:250px"
                    v-model="formValidate.searchq"
                    placeholder="会员号、手机号、逗号隔开可以搜索多个"
                    clearable
                    search
                    enter-button
                    @on-search="search"
                    @on-clear="search"
                    @keydown.native.enter.prevent="search">
                    </Input>
                </div>
            </div>
        </Form>
        <userSelect ref="userSelectModel" @on-ok="addUserEmit"></userSelect>
        <imageText ref="imageTextModel" @on-ok="sendWechatMsg"></imageText>
        <!--任务提示-->
        <Modal 
        v-model="taskModel"
        @on-ok="sendMarketing">
            <div class="flex p-15 f-align-center">
                <div class="space-nowrap">创建任务名称</div>&nbsp;&nbsp;
                <Input placeholder="填写任务名称" v-model="taskName"></Input>
            </div>
        </Modal>
    </div>
</template>

<script>
import util from '@/libs/util.js';
import userSelect from '@/views/my-components/user-select/user-select';
import imageText from '@/views/my-components/image-text/image-text';
export default {
  name: 'addLabel',
  components: {
      userSelect,
      imageText
  },
  props: {
      type:{
          type: String,
          default(){
              return ""
          }
      }
  },
//   computed:{
//       type(){
//           return 
//       }
//   },
  data () {
    return {
        formValidate: {
            c: ""
        },
        showM: false,
        selectCoupon: [],
        taskModel: false,
        taskName: "",
        taskType: "",
    }
  },
  methods: {
      search(data){
          this.$emit("on-searchCallback", data);
      },
      addUsersAction(){
         this.$refs["userSelectModel"].openModal();
      },
      removeUser(){
          this.$emit("on-removeUserCallback");
      },
      addUserEmit(data){
          console.log("选择的用户", data);
          let idsArr = []
          for(let i = 0; i < data.length; i++){
              idsArr.push(data[i].id);
          }
          this.$emit("on-addUserCallback", idsArr);
      },
      creatTask(type){
          this.taskType = type;
          this.taskModel = true;
      },
      sendMarketing(){
          console.log("任务名称", this.taskName);
          if(!this.taskName) {
              this.$Message.warning({
                  content: "请输入任务名称"
              });
              return;
          }
          this.taskModel = false;
          if(this.taskType == 'msg'){
              this.$refs["imageTextModel"].showModal();
          } else if(this.taskType == 'coupon'){
              this.$selectContent({
                mode: 'coupon',
                type: 'checkbox',
                data: [],
                getList: (data) => {
                    let dataStr = ""
                    for(let i = 0; i < data.length; i++){
                        dataStr = dataStr ? dataStr + "," + data[i].id : data[i].id;
                    }
                    this.$emit("on-sendCouponCallback", {
                        fast_name: this.taskName,
                        fast_type: this.taskType,
                        fast_content: dataStr
                    });
                }
            });
          }
      },
      sendWechatMsg(data){
          this.$emit("on-sendWechatCallback", {
            fast_name: this.taskName,
            fast_type: this.taskType,
            fast_content: data.data
          })
      }
  },
}
</script>

<style lang="less">

</style>