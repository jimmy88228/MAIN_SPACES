<template>
  <div class="article-edit-area">
    <div class="article-edit-cont flex">
      <Form :label-width="100" style="width:auto;" :model="formData" ref="formDataRef" :rules="ruleValidate">
        <FormItem label="文章标题" prop="title">
          <custom-input size="large" class="base-320" v-model="formData.title" :show-word-limit="true" :maxlength="30"></custom-input>
        </FormItem>
        <FormItem label="摘要" prop="description">
          <custom-input class="base-320" type="textarea" :show-word-limit="true" :maxlength="200" v-model="formData.description"></custom-input>
        </FormItem>
        <FormItem label="文章封面" prop="cover_pic">
          <img-view uploadType="article" ref="coverPicImgRef" :width="87" :img="formData.cover_pic" @delImg="formData.cover_pic = ''" @selectImg="(src)=>{ selectImg(src, 'cover_pic') }"></img-view>
          <p class="desc-notice">建议尺寸：800像素 * 800像素，图片大小不得超过 2M</p>
        </FormItem>
        <FormItem label="文章分组" prop="group_id">
          <data-select :defaultValue="0" type="article-group" valueKey="group_id" nameKey="group_name" size="large" class="base-320" v-model="formData.group_id"></data-select>
        </FormItem>
        <FormItem label="文章链接" >
          <custom-input size="large" placeholder="输入公众号文章链接" class="base-320" v-model="formData.external_url" :maxlength="80"></custom-input>
        </FormItem>
        <div class="page-operate">
            <Button style="padding: 0px 30px;" type="primary" @click="confirm">确 认</Button>
        </div>
      </Form>
      <div class="editor-area flex">
        <!-- <editor class="editor" :value="formData.article_content" @input="getContent"></editor> -->
        <uEditor ref="uEditorRef" @on-content-change="onContentChange"></uEditor>
        <div>
          <Button class="pre-view-btn" type="default" @click="preView">
            <div class="flex-c-c" style="height:30px;">
              <Icon size="20" type="ios-eye" />
              <label>预览</label>
            </div>
          </Button>
        </div>
      </div>
      
    </div>
    <custom-modal :width="320" title="扫一扫预览" closable ref="modalRef">
        <div class="qrcode-box flex-c-c">
          <div id="qrcode"></div> 
        </div>
    </custom-modal>
  </div>
</template>

<script>
import editor from "@/components/editor/index.vue";
import uEditor from "@/components/uEditor/uEditor.vue";
import StringUtil from "@/helper/utils/string-util.js";
import QR_CODE from "@/helper/utils/art-qrcode/artqrcode.js";
export default {
  components: { editor, uEditor },
  data() {
    return {
      formData: {
        title: "",
        cover_pic: "",
        description: "",
        article_content: "",
        group_id: 0,
        external_url:'',
        id:0,
      },
      ruleValidate: {
        title: [
          {
            required: true,
            validator: this._checkString,
            trigger: "blur",
            message: "请填写文章名称",
          },
        ],
        cover_pic: [
          {
            required: true,
            validator: this._checkString,
            trigger: "blur",
            message: "请上传文章封面图",
          },
        ],
        // external_url: [
        //   {
        //     required: true,
        //     validator: this._checkString,
        //     trigger: "blur",
        //     message: "请填写文章链接",
        //   },
        // ],
      }, 
      QR_CODE_NODE:null,
      latest:false,
      callBacked:false,
      temp_url:"",
    };
  },
  methods: {
    initEditor(){
      	this.$refs['uEditorRef'] && this.$refs['uEditorRef'].init();
    },
    loadData(){
      let pageQuery = this.pageQuery || {};
      let id = Number(pageQuery.id) || this.formData.id || 0;
      if(id){
        this.formData.id = id;
        this.$store.commit("setPageLoading", true);
        return this.$MainApi
        .getArticleInfo({
          data: {
            id: id
          },
          other: {
            isErrorMsg: true
          }
        })
        .then((res) => {
          if (res.code) {
            let data = res.data || {};
            let formData = {
              id: id,
              title: data.title || "",
              cover_pic: data.cover_pic || "",
              description: data.description || "",
              article_content: data.article_content || "",
              external_url: StringUtil.trim(data.external_url || ""),
              group_id: Number(data.group_id) || 0,
            }
            this.temp_url = StringUtil.trim(data.external_url || "");
            this.formData = formData || {};
            // ueditor
            setTimeout(()=>{
              let ue = this.$refs['uEditorRef'] && this.$refs['uEditorRef'].getUE();
              if(ue){
                ue.setContent(formData.article_content || "");
              }
            }, 1000)
            
          }
        }).finally(()=>{
          this.$store.commit("setPageLoading", false);
        })
      }
    },
    selectImg(src, key){
      this.formData[key] = src;
    },
    onContentChange( content ){
      !this.formData.external_url && (this.callBacked = false);
      this.formData.article_content = content; 
      let temp = JSON.parse(JSON.stringify(this.formData))
      this.$refs["formDataRef"] && this.$refs["formDataRef"].resetFields();
      this.formData = temp;
    },
    confirm(type) {
      return new Promise((rs,rj)=>{
        let formData = this.formData || {};
        this.$refs["formDataRef"].validate((valid) => {
          if (valid) {
            if(!StringUtil.trim(formData.external_url || '') && !formData.article_content){
              this.$Message.error("请完善文章链接或者文章内容");
              return Promise.reject();
            }
            return this.confirmReq(type).then(res=>{
              return rs();
            }).catch(e=>{
              return rj();
            });
          } else {
            this.$Message.error("请完善相关信息");
            return rj();
          }
        });
      })
    },
    confirmReq(type){
      let formData = this.formData;
      let req = Number(formData.id) ? 'articleUpdate' : 'articleAdd';
      this.$store.commit("setPageLoading", true);
      return this.$MainApi[req]({
          data: formData,
        })
        .then((res) => {
          if (res.code) {
            let data = res.data||{};
            if(type != 'preview'){
              this.$Message.success(res.message || (Number(formData.consultant_id) ? '编辑成功' : '添加成功'))
              this.$router.back();
            }
            !this.formData.id && (this.formData.id = data.article_id||0);
          } else {
            this.$Message.warning(res.message || (Number(formData.consultant_id) ? '编辑失败' : '添加失败'))
          }
          return res;
        }).finally(()=>{
          setTimeout(()=>{
            this.$store.commit("setPageLoading", false);
          }, 350)
        })
    },
    preView(){
      let curUrl = this.formData.external_url || "";
      if((curUrl != this.temp_url) && (curUrl || this.temp_url)){
        this.callBacked = false;
        this.temp_url = curUrl;
        console.log('url更改');
      }
      console.log('preView',this.callBacked)
      if(!this.callBacked){
        this.modalTipPop({content:"预览操作会先保存当前页面数据,是否继续?"}).then(()=>{
          this.confirm('preview').then(()=>{
            //接口
            this.getArticlePreview().then(res=>{
              if(res.code){
                let data = res.data||{};
                let text = data.data||"";
                if(!this.QR_CODE_NODE){
                  let options = {
                    text,
                    width: 250,
                    height: 250,
                    codeWidth: 250,
                    codeHeight: 250,
                    top: 0,
                    left: 0,
                  } 
                  console.log('QRCode',QR_CODE,options); 
                  this.QR_CODE_NODE = new QR_CODE.QRCode(document.getElementById("qrcode"), options, this.callBack);
                } else {
                  this.QR_CODE_NODE.clear();
                  this.QR_CODE_NODE.makeCode(text);
                }
              }
            })
          })
        })
      }else{
        this.$refs.modalRef.show();
      }
    },
    getArticlePreview(){
      return this.$MainApi
        .getArticlePreview({
          data: {
            id:this.formData.id||0
          },
        })
    },
    callBack(){
      !this.callBacked && this.$refs.modalRef.show();
      this.callBacked = true;
      console.log('callBack')
    },
  },
  watch:{
    'formData.title':{
      handler(nV){
        this.callBacked && (this.callBacked = false);
      },immediate:true,deep:true
    },
    'formData.description':{
      handler(nV){
        this.callBacked && (this.callBacked = false);
      },immediate:true,deep:true
    }
  },
  mounted(){
    this.loadData();
    this.initEditor();
  }
};
</script> 
<style lang="less" scoped>
.article-edit-area {
  .article-edit-cont {
    width: 100%;
    .editor-area {
      margin-left: 10%;
      // width: 500px;
      flex: 1;
      border-radius: 2px;
      .editor {
        width: 100%;
      }
    }
  }
  .page-operate{
    padding-left:100px;
  }
  .pre-view-btn{
    padding: 0;
    width: 75px;
    margin-left: 20px;
  }
}
.qrcode-box{
  // width: 400px;
  // height: 400px;
}
</style>
<style lang="less"> 
</style>