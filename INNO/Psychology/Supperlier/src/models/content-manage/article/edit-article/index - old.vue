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
      </Form>
      <div class="editor-area">
        <editor class="editor" :value="formData.article_content" @input="getContent"></editor>
      </div>
    </div>
    <div class="page-operate">
        <Button style="padding: 0px 30px;" type="primary" @click="confirm">确 认</Button>
    </div>
  </div>
</template>

<script>
import editor from "@/components/editor/index.vue";
export default {
  components: { editor },
  data() {
    return {
      formData: {
        title: "",
        cover_pic: "",
        description: "",
        article_content: "",
        group_id: 0
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
        // description: [
        //   {
        //     required: true,
        //     validator: this._checkString,
        //     trigger: "blur",
        //     message: "请填写文章摘要",
        //   },
        // ],
        article_content: [
          {
            required: true,
            validator: this._checkString,
            trigger: "blur",
            message: "请填写文章内容",
          },
        ],
        // group_id: [
        //   {
        //     required: true,
        //     validator: this._checkThanInt,
        //     message: "请选择文章分组",
        //     trigger: "blur",
        //   },
        // ],
      },
    };
  },
  methods: {
    loadData(){
      let pageQuery = this.pageQuery || {};
      let id = Number(pageQuery.id) || 0;
      if(id){
        this.formData.id = id;
        this.$store.commit("setPageLoading", true);
        return this.$MainApi
        .getArticleInfo({
          data: {
            id: id
          },
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
              group_id: Number(data.group_id) || 0
            }
            this.formData = formData || {};
          }
        }).finally(()=>{
          this.$store.commit("setPageLoading", false);
        })
      }
    },
    selectImg(src, key){
      this.formData[key] = src;
    },
    getContent(html){
      this.formData.article_content = html;
    },
    confirm() {
      this.$refs["formDataRef"].validate((valid) => {
        if (valid) {
          this.confirmReq();
        } else {
          this.$Message.error("请完善相关信息");
        }
      });
    },
    confirmReq(){
      let formData = this.formData;
      let req = Number(formData.id) ? 'articleUpdate' : 'articleAdd';
      this.$store.commit("setPageLoading", true);
      return this.$MainApi[req]({
          data: formData,
        })
        .then((res) => {
          if (res.code) {
            this.$Message.success(res.message || (Number(formData.consultant_id) ? '编辑成功' : '添加成功'))
            this.$router.back();
          } else {
            this.$Message.warning(res.message || (Number(formData.consultant_id) ? '编辑失败' : '添加失败'))
          }
        }).finally(()=>{
          setTimeout(()=>{
            this.$store.commit("setPageLoading", false);
          }, 350)
        })
    }
  },
  mounted(){
    this.loadData();
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
}
</style>