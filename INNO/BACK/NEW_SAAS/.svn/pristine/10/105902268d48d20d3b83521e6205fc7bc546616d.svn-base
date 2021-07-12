<template>
  <div class="article_form">
    <PageTopBase isSave @save="confirm">
      <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="80">
        <FormItem label="文章标题" prop="title">
          <Input v-model="formItem.title" placeholder="请输入文章标题" class="basic_input"/>
        </FormItem>
      </Form>
      <rich-text :rich-text-data="richTextData" @get-rich-text="handleRichText"/>
    </PageTopBase>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>

<script>
import PageTopBase from '@/views/my-components/page-top-base/index';
import RichText from '@/views/my-components/rich-text/index';

export default {
  props: ['id'],
  components:{
    PageTopBase,
    RichText
  },
  data () {
    return {
      formItem: {
        title: '',
        desc: ''
      },
      richTextData: '',
      ruleValidate: {
        title: [{ required: true, message: '文章标题不能为空', trigger: 'blur' }]
      },
      spinShow: false
    }
  },
  methods: {
    loadData () {
      this.spinShow = true;
      return this.$ajax.post(this.$api.protocolArticleInfo, {
        id: this.id
      })
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.formItem.title = res.data && res.data.article_title;
          this.formItem.desc = res.data && res.data.article_content;
          this.richTextData = this.formItem.desc;
        }
        this.spinShow = false;
      });
    },
    confirm () {
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          this.spinShow = true;
          const params = this.id ? {
            id: this.id
          } : {};
          this.$ajax.post(this.id ? this.$api.protocolArticleEdit : this.$api.protocolArticleAdd, {
            ...params,
            article_title: this.formItem.title,
            article_content: this.formItem.desc
          })
          .then(response => {
            const res = response.data;
            if (res.code) {
              this.$Message.success(res.message);
              this.$router.go(-1);
            }
            this.spinShow = false;
          });
        }
      })
    },
    handleRichText (content) {
      this.formItem.desc = content;
    }
  },
  mounted () {
    if (this.id) this.loadData();
  }
}
</script>

<style lang="less" scoped>
.article_form{
  .article_title{
    label{
      padding-right: 10px;
    }
    margin-bottom: 10px;
  }
}
</style>
