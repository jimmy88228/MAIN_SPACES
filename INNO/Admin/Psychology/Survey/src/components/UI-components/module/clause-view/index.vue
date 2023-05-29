<template>
  <custom-modal ref="modal" class="page-drawer-area hold-modal-zindex" :footerHide="true" :width="503" :closable="true">
    <div class="class-edit-area">
      <div class="edit-title bold">{{title}}</div>
      <div class="edit-cont">
        <div class="edit-cont-area">
          <div class="edit-cont-clause" v-bar>
            <div class="agree-content">
              <p>本协议是保障心理咨询过程正常开展的基本框架，为了保障来访者的个人隐私不被外泄，您的咨询能顺利有效的进行，请仔细阅读以下内容并确认表示同意。</p>
              <p class="bold">保密条款</p>
              <p class="p-line">一、心理咨询师本着尊重、保护来访者个人隐私的态度,对心理咨询过程中的有关信息,包括个案记录、测评报告、信件、录音和其他资料,均属保密信息,都应在严格保密的情况下进行保存。</p>
              <p class="p-line">二、心理咨询师必须严格遵守职业道德中保密原则的有关规定,对咨询个案的相关资料及历史心理档案信息进行严格保密。</p>
              <p class="p-line">三、上述保密资料,除您本人之外的任何人〔包括其他心理咨询师〕均不得查阅。</p>
              <div class="p-line">四、保密例外（包括但不限于）:
                <p class="p-line">1.心理咨询师发现求助者可能存在伤害自身或伤害他人的严重风险时；</p>
                <p class="p-line">2.求助者有致命的传染性疾病且可能危及他人生命健康时；</p>
                <p class="p-line">3.有未成年人可能处于受到性侵犯或虐待的情境时；</p>
                <p class="p-line">4.法律规定需要披露时；</p>
              </div>
            </div>
          </div>
          <Checkbox class="clause-checkbox" v-model="isAgree"><a>我已阅读并同意《{{title}}》</a></Checkbox>
          <div class="edit-foot flex-c-c">
            <Button type="primary" @click="confirm">确&nbsp;&nbsp;认</Button>
          </div>
        </div>
      </div>
    </div>
  </custom-modal>
</template>

<script>
export default {
  components: {},
  props: {
    title: {
      type: String,
      default: "保密条款",
    },
  },
  data() {
    return {
      isAgree: false,
      agreeContent: "",
    };
  },
  computed: {},
  methods: {
    dismiss() {
      this.$refs.modal.dismiss();
    },
    showModal(item) {
      this.item = item;
      this.$refs.modal.show();
      this.isAgree = false;
    },
    confirm() {
      if (!this.isAgree) {
        this.$Message.warning("请勾选协议！");
        return;
      }
      this.dismiss();
      this.$emit("success");
    },
  },
  mounted() {},
};
</script>

<style lang="less" scoped>
.page-drawer-area {
  .edit-cont-area {
    border: 0 none !important;
  }
  .edit-title {
    padding-left: 22px;
    font-size: 18px;
    margin-bottom: 20px;
    font-weight: bold;
  }
  .edit-cont-clause {
    width: 100%;
    height: 300px;
    background: #fcfcfc;
    border-radius: 4px;
    border: 1px solid #dddddd;
    .agree-content {
      padding: 15px;
      line-height: 1.6;
      p{
        margin-bottom: 10px;
      }
      .p-line {
        padding-left: 10px;
      }
    }
  }
  .clause-checkbox {
    padding: 10px;
  }
}
</style>