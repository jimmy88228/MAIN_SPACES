<template>
  <div class="base-info-view">
    <div class="flex base-info-area">
      <Form class="base-form" :label-width="100" :model="baseInfo" ref="formDataRef" :rules="ruleValidate">
          <FormItem label="标题" prop="name">
            <custom-input size="large" v-model="baseInfo.name" class="base-320" placeholder="请填写测试标题"  :maxlength="30" :showWordLimit="true"></custom-input>
          </FormItem>
          <FormItem label="引语" prop="quotation">
            <custom-input size="large" v-model="baseInfo.quotation" class="base-320" placeholder="请填写测试引语"  :maxlength="30" :showWordLimit="true"></custom-input>
          </FormItem>
          <FormItem label="封面" prop="pic_data">
            <Select multiple v-model="baseInfo.pic_data" v-show="false"></Select>
            <img-view :multiple="true" :disabled="(baseInfo.pic_data && baseInfo.pic_data.length >= 6) ? true : false" :showImgView="true" :imgs="baseInfo.pic_data" @selectImg="selectImg">
            </img-view>
            <p class="notice">最多上传6个图片</p>
          </FormItem>
          <!-- <FormItem label="已测人数" prop="virtual_number">
            <custom-input type="number" v-model="baseInfo.virtual_number" size="large" class="base-100"  ></custom-input>
          </FormItem> -->
      </Form>
      <div class="">
        <!-- <span class="inline-b m-r-5 m-t-5 fs-14" style="color:#ed4014;">*</span> -->
        <div class="m-b-10 flex-s-c">详情编辑</div>
        <uEditor ref="uEditorRef" @on-content-change="onContentChange"></uEditor>
      </div>
    </div>
    <!-- <div class="operate-area">
      <Button type="primary" @click="confirm">&nbsp;保 存&nbsp;</Button>
    </div> -->
    <Spin v-if="pageLoading" fix></Spin>
  </div>
</template>
<script>
import uEditor from "@/components/uEditor/uEditor.vue";
export default {
  components: { uEditor },
  props: {
    baseInfo: {
      type: Object,
      default: ()=>{
        return {
          name: "",
          quotation: "",
          pic_data: []
        }
      }
    },
  },
  data(){
    return {
      // baseInfo: {
      //   type: "",
      //   content: "",
      //   name: "",
      //   quotation: "",
      //   pic_data: [],
      //   virtual_number: 0,
      //   detail: ''
      // },
      pageLoading: false,
      ruleValidate: {
        name: [
          {
            required: true,
            validator: this._checkString,
            trigger: "blur",
            message: "请填写测试的标题",
          },
        ],
        pic_data:[
          {
            required: true,
            validator: this._checkArray,
            trigger: "change",
            message: "请选择封面图",
          },
        ],
      },
      inited:true,
    }
  },
  methods: {
    init(){
      // this.baseInfo.type = this.pageQuery.type;
      this.initEditor();
    },
    initEditor(){
      // this.$refs["formDataRef"] && this.$refs["formDataRef"].resetFields();
      this.$nextTick(()=>{
        this.$refs['uEditorRef'] && this.$refs['uEditorRef'].init();
      })	
    },
    selectImg(data){
      if(data.length > 0){
        let pic_data = this.baseInfo.pic_data || [];
        this.baseInfo.pic_data = pic_data.concat(data);
        let dataLen = this.baseInfo.pic_data.length;
        if(dataLen){
          this.baseInfo.pic_data.splice(6, dataLen - 1)
        }
        this.baseInfo.cover_pic = (this.baseInfo.pic_data && this.baseInfo.pic_data[0]) || ''
      }
    },
    onContentChange(content){
      this.baseInfo.detail = content;
    },
    save(){
      return new Promise((rs, rj)=>{
        this.$refs["formDataRef"] && this.$refs["formDataRef"].validate((valid) => {
          if (valid) {
            this.saveReq().then((res)=>{
              return rs(res);
            })
          } else {
            this.$Message.error("请完善相关信息");
            rj();
          }
      }) 
      })
     
    },
    saveReq(){
      let baseInfo = this.baseInfo || {};
      // if(!baseInfo.detail){
      //   this.$Message.warning("请填写详情编辑")
      //   return;
      // }
      this.pageLoading = true;
      return this.$MainApi
        .saveTasteTest({
          data: {
            ...baseInfo,
            type: baseInfo.type || this.pageQuery.type
          },
        })
        .then((res) => {
          if (res.code) {
            if(res.data){
              console.log('this.pageQuery.testId',this.pageQuery.testId)
              !this.pageQuery.testId && (this.inited = true);
              this.$router.replace({
                name: this.$route.name,
                query: {
                    ...this.pageQuery,
                    ...this.pageParams,
                    testId: res.data,
                    // $isReplace: true
                },
              })
              // this.$router.push({ 
              //   query: {
              //     ...this.pageQuery,
              //     testId: res.data
              //   }
              // })
              // this.loadData();
              setTimeout(()=>{
                this.$Modal.confirm({
                  title: "提示",
                  content: `是否进入下一步，编辑题目管理`,
                  // content: `是否进入下一步，编辑${this.pageQuery.type == 'dimension' ? '类型维护' : '结果维护'}`,
                  okText: "去编辑",
                  onOk:()=>{
                    this.$emit("next", { name: 'problems' })
                  }
                })
              }, 500)
            }
            return res;
          } else {
            return Promise.reject(res);
          }
        }).catch(e=>{
            this.$Message.info(e && e.message || "请完善基础信息");
            return Promise.reject(e);
        }).finally(()=>{
          this.pageLoading = false;
        })
    },
  }
}
</script>

<style scoped lang="less">
.base-info-view{
  width:100%;
  height:100%;
  overflow: auto;
  padding: 20px;
  position:relative;
  .base-info-area{
    position:relative;
    .base-form{
      padding-top:30px;
      width: 500px;
      flex-shrink: 0;
    }
  }
  .operate-area{
    position:sticky;
    left:0px;
    bottom: 0px;
    padding: 20px 0px;
    padding-left: 100px;
  }
}

</style>