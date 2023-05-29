<template>
  <view class="questionnaire flex-col-1">
    <template v-if="!showLoading">
      <!-- 调查问卷 -->
      <template v-if="!isEmpty">
        <view class="flex-col-1" style="overflow:hidden;">
          <page-nav :full="false">
            <template slot="title">
              <view>
                调查问卷
              </view>
            </template>
          </page-nav>
          <view class="flex-col-1 w-break" style="overflow:hidden;">
            <view class="question-progress" :style="{top:navTop+'px',width:progress}"></view>
            <scroll-view :scroll-with-animation="true" :scroll-into-view="scrollIntoView" class="scroll-view"
              customStyle="height:100%;" :scroll-y="true">
              <view class="title-group">
                <view class="question-title">{{questionDetail.title}}</view>
                <view class="question-title-tips">{{questionDetail.subTitle}}</view>
              </view>
              <!-- 遍历题目 （single_choice:单选题;multi_choice:多选题;q_a:问答题） -->
              <view v-for="(item,i) in questionList" :key="i" :id="'id'+item.topicId">
                <customRadio :ref="'customRadio'+i" v-if="item.type == 'single_choice'"
                  :question-info="{...item,index:i}" class="radio-custom-class" :style="{'animation-delay':'0.'+i+'s'}"
                  @changeSelect="changeRadio">
                </customRadio>
                <customRadioGroup :ref="'customRadioGroup'+i" v-if="item.type == 'multi_choice'"
                  :question-info="{...item,index:i}" class="radio-group-custom-class"
                  :style="{'animation-delay':'0.'+i+'s'}" @changeSelect="changeRadio"></customRadioGroup>
                <descriptionInput :ref="'descriptionInput'+i" v-if="item.type == 'q_a'"
                  :question-info="{...item,index:i}" class="description-custom-class"
                  :style="{'animation-delay':'0.'+i+'s'}" @changeInput="changeInput">
                </descriptionInput>
              </view>
              <view class="submit-area" v-if="questionDetail.state == 'STARTING'">
                <view class="submit-button flex-c-c" @click="submit">提 交</view>
              </view>
            </scroll-view>
          </view>
        </view>
      </template>
      <!-- 暂无内容 -->
      <view class="empty flex-c-c flex-col" v-show="isEmpty">
        <image class="empty-icon" :src="setStaticAddress(emptyIcon)" />
        <view class="empty-message">活动结束/活动暂未开始</view>
      </view>
    </template>
    <!-- loading----加载中 -->
    <view class="loading-view flex-c-c" v-if="showLoading">
      <loading-view></loading-view>
    </view>
    <answerRecordTips ref="recordTips" @restart="restart" @next="next"></answerRecordTips>
  </view>
</template>

<script>
  import descriptionInput from '../components/description-input.vue'
  import customRadioGroup from '../components/custom-radio-group.vue'
  import customRadio from '../components/custom-radio.vue'
  import answerRecordTips from '../components/answer-record-tips.vue'
  import LoadingView from "@/components/css3/loading/loading.vue";
  import oriScrollView from "@/components/ori-comps/scroll/ori-scroll-view.vue";
  import SIH from "@/common/helper/sys-infos-handler"
  import storageH from "@/common/helper/storage-handler.js";

  const app = getApp();
  const pageOption = Page.BasePage({
    components: {
      answerRecordTips,
      descriptionInput,
      customRadioGroup,
      customRadio,
      LoadingView,
      oriScrollView,
    },
    data() {
      return {
        emptyIcon: "/questionnaire/empty.png",
        navTop: SIH.navPlace,
        scrollIntoView: '',
        questionDetail: {},
        questionList: [],
        showLoading: true,
        isEmpty: false
      };
    },
    onLoad(options) {
      this.options = options
    },
    onShow() {},
    onReady() {
      this.loadData()

    },
    computed: {
      progress() {
        let questionList = this.questionList || [];
        let questionCount = questionList.length;
        let answerCount = 0;
        let progress = 0;
        questionList.forEach(item => {
          let answerResult = item.answerResult
          let essayContent = answerResult.essayContent || '';
          let optionList = answerResult.optionList || [];
          if (essayContent.trim().length > 0 || optionList.length > 0) {
            answerCount += 1
          }
        })
        progress = (answerCount / questionCount) * 100 + '%'
        return progress
      }
    },
    methods: {
      loadData() {
        return this.$Http(this.$Apis.getQuestionaireQuestionList, {
          data: {
            qId: this.options.id || 0
          }
        }).then(res => {
          if (res.code) {
            let questionDetail = res.data || {};
            this.questionDetail = questionDetail;
            let questionList = questionDetail.questionList || [];
            if(questionDetail.isRandom){
                  questionList = this.randomSort(questionList)
            }
            // 初始化
            questionList.forEach(item => {
              item.answerResult = {
                essayContent: "",
                optionList: [],
              }
              // 检查题目是否需要随机
              if (item.random_option) {
                let optionInfos = item.optionInfos;
                item.optionInfo = this.randomSort(optionInfos)
              }
            })
            this.questionList = questionList;
            this.$nextTick(() => {
              // 如果有记录询问是否继续作答
              if (storageH.get("QUESTIONNAIRE") && storageH.get("QUESTIONNAIRE")[this.options.id]) {
                this.$refs['recordTips'] && this.$refs['recordTips'].showBench()
              }
            })
            return questionDetail
          }
        }).finally(() => {
          this.showLoading = false
        })
      },
      // 数组随机
      randomSort(arr) {
          if (arr instanceof Array) {
            let sortArr = arr.sort((a, b) => {
              return Math.random() > 0.5 ? -1 : 1
            })
            return sortArr
          } else {
            return []
          }
      },
      restart() {
        this.clearAnswerRecord();
        this.$refs['recordTips'] && this.$refs['recordTips'].hideBench();
      },
      next() {
        let questionList = JSON.parse(JSON.stringify(this.questionList))
        let recordQuestionList = storageH.get("QUESTIONNAIRE")[this.options.id] || [];
        questionList.forEach(item => {
          for (let i = 0; i < recordQuestionList.length; i++) {
            if (item.topicId == recordQuestionList[i].topicId) {
              item.answerResult = recordQuestionList[i].answerResult || []
              break
            }
          }
        })
        this.questionList = questionList;
        this.$refs['recordTips'] && this.$refs['recordTips'].hideBench();
      },
      setAnswerRecord() {
        let questionDetail = this.questionDetail || {};
        if(questionDetail.state !== 'STARTING') return
        let qid = this.options.id || "";
        let questionList = this.questionList || {};
        let questionnaire = storageH.get("QUESTIONNAIRE") || {};
        // 检查是否全部题目都为空，如果是则删除对应问卷id的缓存
        let hasAnswer = false;
        for (let i = 0; i < questionList.length; i++) {
          let item = questionList[i];
          let answerResult = item.answerResult || {};
          let essayContent = answerResult.essayContent || '';
          let optionList = answerResult.optionList || [];
          if(essayContent.trim().length !== 0 || optionList.length !== 0){
            hasAnswer = true;
            break
          }
        }
        if(hasAnswer){
          questionnaire[qid] = questionList;
        }else{
          delete questionnaire[qid];
        }
        storageH.set("QUESTIONNAIRE", questionnaire)
        
      },
      clearAnswerRecord() {
        let qid = this.options.id || "";
        let questionnaire = storageH.get("QUESTIONNAIRE") || {};
        if (questionnaire[qid] && JSON.stringify(questionnaire[qid]) != '{}') {
          delete questionnaire[qid];
        }
        storageH.set("QUESTIONNAIRE", questionnaire)
      },
      changeRadio(e) {
        let index = e.index;
        let valueGroup = e.valueGroup || [];
        let questionList = JSON.parse(JSON.stringify(this.questionList)) || [];
        questionList[index].answerResult.optionList = valueGroup;
        this.questionList = questionList;
        this.$nextTick(() => {
          this.setAnswerRecord()
        })
      },
      changeInput(e) {
        let index = e.index;
        let value = e.value || "";
        let questionList = JSON.parse(JSON.stringify(this.questionList)) || [];
        questionList[index].answerResult.essayContent = value;
        this.questionList = questionList;
        this.$nextTick(() => {
          this.setAnswerRecord()
        })
      },
      submit() {
        let questionList = this.questionList;
        let submitArray = [];
        let showError = false;
        for (let i = 0; i < questionList.length; i++) {
          let item = questionList[i] || {};
          let answerResult = item.answerResult || {};
          let essayContent = answerResult.essayContent || '';
          let optionList = answerResult.optionList || [];
          if (item.isMust && essayContent.trim().length == 0 && optionList.length === 0) {
            // 提示
            if (item.type == 'q_a') {
              this.$refs['descriptionInput' + i][0] && this.$refs['descriptionInput' + i][0].showError()
            } else if (item.type == 'single_choice') {
              this.$refs['customRadio' + i][0] && this.$refs['customRadio' + i][0].showError()
            } else if (item.type == 'multi_choice') {
              this.$refs['customRadioGroup' + i][0] && this.$refs['customRadioGroup' + i][0].showError()
            }
            if (!showError) {
              this.scrollIntoView = "id" + item.topicId;
              app.SMH.showToast({
                title: "有必答题还未作答噢~"
              })
              // 清空上次
              this.$nextTick(() => {
                this.scrollIntoView = "";
              })
              showError = true
            }
          } else {
            submitArray.push({
              essayContent,
              optionList,
              topicId: item.topicId
            })
          }
        }
        if (!showError) {
          this.$Http(this.$Apis.questionaireSubmitAnswer, {
            data: {
              qid: this.options.id,
              questionList: submitArray,
            }
          }).then(res => {
            if (res.code) {
              // 删除缓存记录
              this.clearAnswerRecord();
              this.reLaunchAction('/pages/questionnaire/result/result')
            }
          })
        }
      },
    }
  });
  export default pageOption;
</script>

<style lang="scss" scoped>
  .loading-view {
    width: 100%;
    height: 100vh;
  }

  .questionnaire {
    box-sizing: border-box;
    padding: 0rpx 25rpx;
    background: #F7F7F7;
    height: 100vh;
    text-align: center;
  }

  .question-progress {
    position: fixed;
    top: 0;
    left: 0;
    height: 4rpx;
    width: 0;
    transition: width 0.5s ease-in-out;
    background: #5ECF68;
    z-index: 3;
  }

  .scroll-view {
    height: 100%;
    overflow: hidden;
  }

  .title-group {
    padding: 42rpx 27rpx 35rpx;
    text-align: left;

    .question-title {
      margin-bottom: 14rpx;
      font-size: 36rpx;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;
      color: #333333;
      line-height: 46rpx;
    }

    .question-title-tips {
      font-size: 24rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #A1A1A1;
      line-height: 40rpx;
    }
  }

  .radio-custom-class,
  .description-custom-class,
  .radio-group-custom-class {
    opacity: 0;
    display: block;
    width: 100%;
    text-align: left;
    margin-bottom: 22rpx;
    animation-name: fadeInUp;
    animation-duration: 0.6s;
    animation-fill-mode: forwards;
    animation-timing-function: ease-in-out;
  }

  .submit-area {
    width: 100%;
    padding: 25rpx 0rpx;
    box-sizing: border-box;
  }

  .submit-button {
    width: 100%;
    height: 100rpx;
    background: #21B014;
    border-radius: 19rpx;
    font-size: 32rpx;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #FFFFFF;
    line-height: 40rpx;
  }

  // 暂无内容
  .empty {
    width: 100%;
    flex: 1;

    .empty-icon {
      width: 346rpx;
      height: 346rpx;
    }

    .empty-message {
      margin-top: 34rpx;
      font-size: 24rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #A1A1A1;
      line-height: 33rpx;
    }
  }

  @keyframes fadeInUp {
    0% {
      opacity: 0;
      transform: translateY(-10px);
    }

    40% {
      opacity: 0;
      transform: translateY(-10px);
    }

    100% {
      opacity: 100%;
      transform: translate(0, 0);
    }
  }
</style>