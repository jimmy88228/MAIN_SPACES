<template>
  <frame-box :showPage="mixShowPage" :loginOutCallback="loginOutCallback">
    <template v-slot:body>
      <view class="answer flex-s-s flex-col" :class="[popupH5Bool ? 'blur' : '']">
        <!-- #ifdef MP -->
        <page-nav :isTransparent="true" :isCustomContent="true" mode="None"></page-nav>
        <template v-if="acInfo.modelIds">
          <mpAnswerProgress :modelId="modelId" :answerCount="answerCount" :restQuestions="restQuestions"
            :acInfo="acInfo"></mpAnswerProgress>
        </template>
        <!-- #endif -->

        <!-- #ifdef H5 -->
        <h5AnswerProgress @last="last" @back="back" :modelId="modelId" :answerCount="answerCount"
          :restQuestions="restQuestions" :acInfo="acInfo">
        </h5AnswerProgress>
        <!-- #endif -->
        <view v-show="showLoading" class="loading-view flex-c-c">
          <loading-view></loading-view>
        </view>
        <view class="evaluating-bg-area-cover" v-if="answerBgImg && !isH5 && !showLoading">
          <oriImage :showLoading="false" @load="getBgSize" customStyle="{height:bgHeight,width:bgWidth}" :src="answerBgImg" ></oriImage>
        </view>
        <view v-show="!showLoading" class="box flex-col-1 flex-s-c" :style="!isH5?'padding-bottom: 180rpx':''">
          <view class="tips" style="padding: 0px 80rpx">
            {{ (list[current] && list[current].instruction) || acInfo.modelInstruction }}</view>
          <view id="swiperId" class="swiper flex1" :class="[isFinish?'showSubmit':'']">
            <view class="swiper-item-box flex-s-s" :style="'transform:translateX(-' + current * 100 + '%);'">
              <view v-for="(item, index) in list" :key="index" class="swiper-item flex-s-s"
                :class="{'swiper-item-action':current == index}">
                <scroll-view class="flex1" scroll-y>
                  <view class="item-box">
                    <view class="title bold"> {{ item.question || "" }} </view>
                    <view :class="['answer-box','flex-c-c','flex-col']" v-if="item.optionList">
                       <!-- 选择器样式 -->
                       <answerPicker v-if="item.optionList.length>7" :showNext="index < list.length - 1" :disableNext="disableNext" :questionDetail="item" @pickerChange="pickerChange" @selectPicker="selectPicker" :buttonAnimation="current == index ? buttonAnimation : 'animate-fade-out-down'"></answerPicker>
                       <!-- 一般样式 -->
                       <answerNormal v-else-if="item.optionList.length<=7" :index="index" :current="current" :questionDetail="item" :buttonAnimation="current == index ? buttonAnimation : 'animate-fade-out-down'" @onAnswer="onAnswer"></answerNormal>
                    </view>
                  </view>
                </scroll-view>
              </view>
            </view>
          </view>
          <!-- #ifdef H5 -->
          <safe-area v-if="submitShow || shinishShow" areaType="bottom" position="sticky" class="flex-c-c" :extra="0"
            boxStyle="box-sizing: border-box;padding:40rpx 0;background: #fff;box-shadow: 0 -5px 10px rgb(0,0,0,0.05);border-radius:0 0 20rpx 20rpx;">
            <button v-if="shinishShow" class="flex-c-c submit relative"
              style="position: relative; left: unset;transform:unset;"
              :class="{ active: btnActive, dismiss: btnDismiss }" @click="submitFinish">
              提交
            </button>
            <button v-else-if="submitShow" class="flex-c-c submit relative"
              style="position: relative; left: unset;transform:unset;"
              :class="{ active: btnActive, dismiss: btnDismiss }" @click="nextScale">
              进入新的量表
            </button>
          </safe-area>
          <!-- #endif -->

          <!-- #ifdef MP -->
          <view class="btn-box flex-s-c" id="btnBox">
            <view class="btn flex-c-c" @click="last">上一题</view>
            <view class="btn flex-c-c" @click="back('check')">暂停返回</view>
            <view class="flex-c-c submit" :class="{ active: btnActive, dismiss: btnDismiss }" v-if="shinishShow"
              @click="submitFinish">提交</view>
            <view class="flex-c-c submit" :class="{ active: btnActive, dismiss: btnDismiss }" v-if="submitShow"
              @click="nextScale">进入新的量表</view>
          </view>
          <!-- #endif -->
        </view>
        <view class="touch-stop-box fixed" v-show="clickHoldMap['answer']" @click.stop="noAction"></view>
      </view>
    </template>
    <template v-slot:common>
      <ori-popup ref="popup" type="bottom" :is-mask-click="false" background-color="#fff"
        mask-background-color="transparent">
        <template v-slot:content>
          <view class="popup-content">
            <view class="popip-title font-38 bold C_222">确认暂停测评吗？</view>
            <view class="popip-tips font-28 C_7f">为你保留当前进度，休息一会记得回来噢～
            </view>
            <view class="pop-btn-box font-30 flex-c-c">
              <button class="pop-btn C_B2" @click="back('goon')">继续做题</button>
              <button class="pop-btn active" @click="back">确认退出</button>
            </view>
          </view>
        </template>
      </ori-popup>
      <ori-popup ref="popup_h5" @change="popupH5Change" type="center" :is-mask-click="false"
        mask-background-color="transparent">
        <template v-slot:content>
          <view class="popup-content-h5 flex-c-c flex-col">
            <view class="C_fff font-46 opa-0" :style="{'opacity':htmlPopupShow?1:0,'transition':'0.4s all'}">已暂停测评
            </view>
            <button class="goon-btn-h5 C_fff flex-c-c opa-0"
              :style="{'opacity':htmlPopupShow?1:0,'transition':'0.4s all'}" @click="back('goon')">
              继续测评
            </button>
            <view class="filter-blur-background" :style="{'opacity':htmlPopupShow?1:0}"></view>
          </view>
        </template>
      </ori-popup>
      <stagePopup ref="stagePopup" :scaleInfo="scaleInfo" @close="initTiming" @jumpNewScale="nextScale"></stagePopup>
    </template>
  </frame-box>
</template>

<script>
  import LoadingView from '@/components/css3/loading/loading.vue';
  import utils from '@/common/support/utils.js'
  import sysInfosHandler from "@/common/helper/sys-infos-handler";
  import SMH from "@/common/helper/show-msg-handler";
  import oriPicker from "@/components/ori-comps/picker/ori-picker.vue";
  import oriPopup from "@/components/ori-comps/popup/ori-popup";
  import safeArea from "@/components/safe-area/index.vue";
  import oriImage from "@/components/ori-comps/image/ori-image";
  import stagePopup from "./components/stage-popup/stage-popup.vue"
  // 回答题目的样式
  import answerNormal from "./components/answer-normal/answer-normal.vue"
  import answerPicker from "./components/answer-picker/answer-picker.vue"
  import animateCustom from "@/components/animate-custom/animate-custom.vue"
  // 小程序答题进度条（多量表、单量表通用）
  import mpAnswerProgress from "./components/mp-answer-progress/mp-answer-progress.vue"
  // h5答题进度条（多量表、单量表通用）
  import h5AnswerProgress from "./components/h5-answer-progress/h5-answer-progress.vue"

  const app = getApp();
  const pageOption = Page.BasePage({
    components: {
      oriPopup,
      safeArea,
      oriImage,
      oriPicker,
      stagePopup,
      mpAnswerProgress,
      h5AnswerProgress,
      LoadingView,
      animateCustom,
      answerNormal,
      answerPicker,
    },
    data() {
      return {
        // *答题定时器
        totalTime: 0,
        answerTimer: '',
        //*********/
        // *背景图
        bgHeight: 0,
        bgWidth: 0,
        //********/
        disableNext: false,
        buttonAnimation: 'animate-fade-in-right',
        beginAnswer: false,
        showLoading: true,
        scaleInfo: {},
        modelId: 0,
        noneFn: "",
        shinishShow: false,
        submitShow: false,
        navHeight: sysInfosHandler.navHeight || 40,
        current: 0,
        pageIndex: 0,
        pageSize: 5,
        // preview: 5, //提前X道题预加载题目
        btnActive: false,
        btnDismiss: false,
        list: [],
        hasMore: true,
        isFinish: false,
        swiperStyle: "",
        acInfo: {},
        popupH5Bool: false,
        //
        screenPage: 3, // 仅加载前 中 后3屏数据
        answerIng: false,

        // 跳题
        totalCount: 0, 
        questionIndex: 0,
        restQuestions: 0,
        answerCount: 0,
        // H5Pupup展示
        htmlPopupShow: false
      };
    },
    onLoad(options) {
      this.options = options;

    },
    onReady() {
      this.getActInfo().then(() => {
        this.init();
      });
    },
    onShow() {
      // 开始计算答题时间
      !this.answerTimer && this.initTiming()
      app.LM.userToken || ''
    },
    onHide() {
      // 如果有时间则上传答题时间
      this.totalTime && this.uploadAnswerTime()
    },
    onUnload() {
      // 如果有时间则上传答题时间
      this.totalTime && this.uploadAnswerTime()
    },
    computed: {
      // CurPreviewNum() {
      //   return this.current + this.preview;
      // },
      answerBgImg() {
        let acInfo = this.acInfo;
        let evaluateActivitySetting = acInfo.evaluateActivitySetting || {};
        let answerBgImg = evaluateActivitySetting.answerBgImg || ''
        return answerBgImg
      }
    },
    // onShareAppMessage(e){},
    methods: {
      showStagePopup() {
        let modelId = this.modelId;
        let modelIds = this.acInfo.modelIds;
        let successIndex = Number(modelIds.indexOf(modelId))
        this.scaleInfo = {
          modelId,
          modelIds,
          successIndex
        }
        this.$refs.stagePopup.showStagePopup()
        this.uploadAnswerTime(false)
      },
      initTiming() {
        // 当total>1时上传时间才会有意义
        if (this.totalTime > 1) {
          this.totalTime = 0;
          if (this.answerTimer) {
            clearInterval(this.answerTimer)
            this.answerTimer = null
          }
        }
        if (!this.answerTimer) {
          this.answerTimer = setInterval(() => {
            this.totalTime += 1
          }, 1000)
        }
      },
      uploadAnswerTime(upload = true) {
        if (!this.beginAnswer || !app.LM.userToken) return;
        if (this.answerTimer) {
          clearInterval(this.answerTimer)
          this.answerTimer = null
        }
        if (upload) {
          return this.$Http(this.$Apis.updateEvaluateUsedTime, {
            customUrl: this.$Apis.updateEvaluateUsedTime.u +
              `?usedTime=${this.totalTime}&modelId=${this.modelId}&activityId=${this.acInfo.activityId}`
          }).then(res => {
            if (res.code) {
              this.totalTime = 0;
              return res
            }
          })
        } else {
          this.totalTime = 0;
          return Promise.resolve()
        }
      },
      loginOutCallback(){
        if(this.totalTime){
          return this.uploadAnswerTime();
        }
        return true;
      },
      init() {
        let allCount = parseInt(this.acInfo.questionCount || 0);
        let lastPageIndex = Math.ceil(allCount / this.pageSize);
        let lastPageSize = lastPageIndex * this.pageSize;
        this.showLoading = true;
        this.list = [];
        this.isFinish = false;
        this.pageIndex = 0;
        this.hasMore = true;
        this.loadData(1, lastPageSize).then(() => {
          // 开始计算答题时间
          !this.answerTimer && this.initTiming()
          if (!this.acInfo.lastQuestion.nextQuestionId && this.acInfo.lastQuestion.questionId) {
            this.searchTargetQuestion(this.acInfo.lastQuestion.questionId, this.acInfo.lastQuestion
              .fromQuestionId)
            this.isFinish = true;
            console.log(this.checkLastScale(),"this.checkLastScale()")
            if (!this.checkLastScale()) {
              this.setSubmitBtn();
            } else {
              this.setFinishBtn()
            }
          } else {
            this.searchTargetQuestion(this.acInfo.lastQuestion.nextQuestionId, this.acInfo.lastQuestion
              .questionId)
          }

          this.pageIndex = lastPageIndex;
          // this.getBoxH();
        }).finally(() => {
          setTimeout(() => {
            this.showLoading = false
          }, 300);
        });
      },
      searchTargetQuestion(nextQuestionId, fromQuestionId) {
        let list = this.list;
        let current;
        if (!nextQuestionId) {
          this.current = 0;
          this.loadData();
          return;
        }
        let question = list.filter((item, i) => {
          if (item.questionId == nextQuestionId) current = i
          return item.questionId == nextQuestionId
        })
        if (question && question.length > 0) {
          this.restQuestions = question[0]?.restQuestions;
          if (fromQuestionId) this.list[current].fromQuestionId = fromQuestionId;
          this.current = current
        } else {
          this.loadData().then((res) => {
            if (res.code) {
              this.searchTargetQuestion(nextQuestionId, fromQuestionId)
            }
          })
        }
      },
      getActInfo() {
        return this.$Http(this.$Apis.getActivityInfo, {
          data: {
            activityId: this.options.activityId,
          },
        }).then((res) => {
          if (res.code == 1) {
            let data = res.data || {};
            this.modelId = data.modelId;
            this.acInfo = data;
            this.beginAnswer = data.totalAnswerCount > 0;
            // 判断剩余题目
            if (!data.answerCount) {
              this.restQuestions = Number(data.questionCount) - 1;
              this.answerCount = 1;
            } else if (!data.lastQuestion.nextQuestionId && data.lastQuestion.questionId) {
              this.restQuestions = 0
              this.answerCount = Number(data.answerCount)
            } else {
              this.restQuestions = Number(data.lastQuestion.restQuestions) - 1;
              this.answerCount = Number(data.answerCount) + 1;
            }
            return data
          }
        });
      },
      loadData(pageIndex = 0, pageSize = 0) {
        if (!this.hasMore) {
          return Promise.reject();
        }
        if (!pageIndex) pageIndex = this.pageIndex + 1;
        if (!pageSize) pageSize = this.pageSize;
        return this.$Http(this.$Apis.getQuestionList, {
          data: {
            activityId: this.options.activityId || 0,
            // pageIndex: pageIndex,
            // pageSize: pageSize
            modelId: this.modelId,
            skip: parseInt(pageIndex - 1) * this.pageSize, // 跳过行数
            take: pageSize, // 取得行数
          },
        }).then((res) => {
          if (res.code == 1) {
            this.pageIndex = pageIndex;
            let data = res.data || {};
            let list = data.questionList.list || [];
            this.totalCount = data.totalCount || 0;
            this.hasMore = pageIndex * pageSize < this.totalCount;

             list.forEach((item) => {
              let optionList = item.optionList;
              let selectOptionId = item.selectOptionId;
              // 适配选择器样式
              if (selectOptionId == 0) {
                item.pickerValue = -1
              } else {
                for (let i = 0; i < optionList.length; i++) {
                  if (optionList[i].optionId == selectOptionId) {
                    item.pickerValue = i
                    continue;
                  }
                }
              }
            })

            this.list = this.list.concat(list);
            this.mixShowPage = true;
          }
          return res;
        });
      },
      getBgSize({
        detail
      }) {
        let width = detail.width;
        let height = detail.height;
        utils.getBgSize(width, height).then(res => {
          this.bgWidth = res.imgW + "px"
          this.bgHeight = res.imgH + "px"
        })
      },
      pickerChange({
        detail
      }) {
        let selectIndex = detail.value;
        let index = this.current;
        let list = this.list;
        let currentItem = list[this.current];
        let optionList = currentItem.optionList;
        let optionItem = optionList[selectIndex];
        let id = optionItem.optionId;
        if (this.answerPadding) return;
        if (index != this.totalCount - 1) {
          let check = this._clickHold("answer", 400);
          if (!check) return;
        }
        // 答案上传中
        this.answerPadding = true;
        // 如果后续题目路线不一样，清空后续选项
        let lastSelectItem = currentItem.optionList.filter(optionChild => {
          return optionChild.optionId == currentItem.selectOptionId
        });
        if (lastSelectItem.length > 0 && (lastSelectItem[0].nextQuestionId != optionItem.nextQuestionId)) {
          list.map((item, i) => {
            if (i > index) {
              item.questionIndex = 0;
              item.selectOptionId = 0;
            }
          })
          this.list = list;
        }
        currentItem.pickerValue = selectIndex;
        currentItem.selectOptionId = id;
        this.submit(index, currentItem).then((res) => {
          // 答题完成
          if (this.isFinish || currentItem.restQuestions == 0 || optionItem.nextQuestionId == 0) {
            this.restQuestions = 0;
            if (!this.checkLastScale()) {
              this.setSubmitBtn();
            } else {
              this.setFinishBtn()
            }
            return
          }

        }).catch((err) => {
          if (err.msg == '参与次数已达上限') {
            this.disableNext = true
          }
        }).finally(() => {
          setTimeout(() => {
            this.answerPadding = false;
          }, 300);
        })
      },
       selectPicker() {
        let list = this.list;
        let index = this.current;
        let currentItem = list[index];
        let optionList = currentItem.optionList;
        let optionItem = optionList.filter((item) => {
          return item.optionId == currentItem.selectOptionId
        })[0];
        if (this.disableNext) {
          SMH.showToast({
            title: "参与次数已达上限"
          })
          return
        }
        if (currentItem.selectOptionId == 0 || currentItem.pickerValue == -1) {
          SMH.showToast({
            title: "请先选择选项"
          })
          return
        }

        if (
          this.isFinish ||
          (optionItem.nextQuestionId == 0 &&
            this.list[this.current] &&
            this.list[this.current].selectOptionId > 0)
        ) {
          this.restQuestions = 0;
          if (!this.checkLastScale()) {
            this.setSubmitBtn();
          } else {
            this.setFinishBtn()
          }
        } else if (currentItem.restQuestions > 0) {
          this.searchTargetQuestion(optionItem.nextQuestionId, currentItem.questionId)
          this.answerCount += 1
          if (this.submitShow) this.setSubmitBtn(false);
          if (this.shinishShow) this.setFinishBtn(false);
          if (this.isFinish) this.isFinish = false;
        }

      },
      onAnswer({id, index, optionItem}) {
        if (this.list[this.current].questionId != this.list[index].questionId) return
        if (index != this.totalCount - 1) {
          let check = this._clickHold("answer", 400);
          if (!check) return;
        }
        if (this.answerIng) return;
        this.answerIng = true;
        let questionItem = this.list[index];
        let list = this.list;
        // 如果后续题目路线不一样，清空后续选项
        let lastSelectItem = questionItem.optionList.filter(optionChild => {
          return optionChild.optionId == questionItem.selectOptionId
        });
        if (lastSelectItem.length > 0 && (lastSelectItem[0].nextQuestionId != optionItem.nextQuestionId)) {
          list.map((item, i) => {
            if (i > index) {
              item.questionIndex = 0;
              item.selectOptionId = 0;
            }
          })
          this.list = list;
        }
        questionItem.selectOptionId = id;
        this.submit(index, questionItem).then(() => {
          // 答题完成
          if (this.isFinish || questionItem.restQuestions == 0 || optionItem.nextQuestionId == 0) {
            this.restQuestions = 0;
            if (!this.checkLastScale()) {
              this.setSubmitBtn();
            } else {
              this.setFinishBtn()
            }
          }

          if (
            this.isFinish ||
            (optionItem.nextQuestionId == 0 &&
              this.list[this.current] &&
              this.list[this.current].selectOptionId > 0)
          ) {
            if (!this.checkLastScale()) {
              this.setSubmitBtn();
            } else {
              this.setFinishBtn()
            }
          } else if (questionItem.restQuestions > 0) {
            this.searchTargetQuestion(optionItem.nextQuestionId, questionItem.questionId)
            this.answerCount += 1
            if (this.submitShow) this.setSubmitBtn(false);
            if (this.shinishShow) this.setFinishBtn(false);
            if (this.isFinish) this.isFinish = false;
          }
        }).finally(() => {
          setTimeout(() => {
            this.answerIng = false;
          }, 300)
        })
      },
      // 查答案id 
      searchQueItem(id) {
        let list = this.list;
        return list.filter(item => {
          return id == item.questionId
        })
      },
      checkLastScale() {
        let modelId = this.modelId;
        let modelIds = this.acInfo.modelIds;
        let modelIdIdx = modelIds.indexOf(modelId)
        if (modelIdIdx < modelIds.length - 1) {
          return false
        } else {
          return true
        }
      },
      submit(index, item) {
        if (item.selectOptionId <= 0) {
          SMH.showToast({
            title: `第${index + 1}道题目答案异常`,
          });
          return;
        }
        let answerList = [{
          optionId: item.selectOptionId || 0,
          questionId: item.questionId || 0,
        }, ];
        return this.$Http(this.$Apis.submitAnswer, {
          data: {
            activityId: this.options.activityId || 0,
            answerList,
            modelId: this.modelId,
            usedTime: this.totalTime
          },
          other: {
            isShowLoad: true,
          },
        }).then((res) => {
          if (res.code == 1) {
            let data = res.data || {};
            this.isFinish = data.isFinish || false;
            this.beginAnswer = true
            this.initTiming()
            return Promise.resolve(res);
          } else {
            return Promise.reject(res);
          }
        });
      },
      // 下一个量表按钮显示/隐藏
      setSubmitBtn(bool = true) {
        let list = this.list;
        if (bool) {
          if (this.submitShow) return;
          this.showStagePopup();
          this.submitShow = true;
          this.restQuestions = 0;
          setTimeout(() => {
            this.btnDismiss = false;
            this.btnActive = true;
          }, 50);
        } else {
          if (this.btnDismiss) return;
          this.btnActive = false;
          this.btnDismiss = true;
          setTimeout(() => {
            this.submitShow = false;
            this.btnDismiss = false;
          }, 400);
        }
      },
      // 提交整个答卷按钮显示/隐藏
      setFinishBtn(bool = true) {
        if (bool) {
          if (this.shinishShow) return;
          this.shinishShow = true;
          this.restQuestions = 0;
          setTimeout(() => {
            console.log(this.btnDismiss,this.btnActive,"his.btnDismiss this.btnActive")
            this.btnDismiss = false;
            this.btnActive = true;
          }, 50);
        } else {
          if (this.btnDismiss) return;
          this.btnActive = false;
          this.btnDismiss = true;
          setTimeout(() => {
            this.shinishShow = false;
            this.btnDismiss = false;
          }, 400);
        }
      },
      last() {
        if (this.current == 0) {
          app.SMH.showToast({
            title: "已经是第一题了噢~"
          })
          return
        }
        if (this.submitShow) this.setSubmitBtn(false);
        if (this.shinishShow) this.setFinishBtn(false);
        if (this.isFinish) this.isFinish = false;
        this.answerCount -= 1;
        let list = this.list;
        // 计算剩余题目数
        let restQuestions = this.restQuestions;
        let fromQuestionId = this.list[this.current].fromQuestionId;
        list.map((item, i) => {
          if (item.questionId == fromQuestionId) restQuestions = item.restQuestions
        })
        this.restQuestions = restQuestions;
        // 计算剩余题目数 End
        this.searchTargetQuestion(this.list[this.current].fromQuestionId);
      },
      back(type) {
        let ref = "popup";
        // #ifdef H5
        ref = "popup_h5"
        // #endif
        if (type == "check") {
          // #ifdef H5
          this.popupH5Bool = true
          // #endif
          this.$refs[ref].show();
          this.uploadAnswerTime()
        } else if (type == "goon") {
          // #ifdef H5
          this.popupH5Bool = false
          // #endif
          this.$refs[ref].dismiss();
          this.initTiming()
        } else {
          this.backAction();
        }
      },
      getPercent(cur, len) {
        return Number((cur / len).toFixed(2)) * 100;
      },
      nextScale() {
        this.submitFinish().then(() => {
          this.setSubmitBtn(false)
          this.getActInfo().then(() => {
            this.init();
          });
        })
      },
      submitFinish() {
        if (!this.isFinish) {
          SMH.showToast({
            title: `还有未打完的题目，请检查`,
          });
          return;
        }
        return this.$Http(this.$Apis.finishSurvey, {
          customUrl: this.$Apis.finishSurvey.u +
            `?activityId=${this.options.activityId || 0}&modelId=${this.acInfo.modelId}&usedTime=${this.totalTime}`,
          other: {
            isShowLoad: true,
          },
        }).then((res) => {
          if (res.code) {
            this.initTiming()
            if (this.checkLastScale()) {
              this.redirectAction(
                `/pages/activities/evaluating/answer/answer-result?recordId=${res.data}`
              );
            } else {
              return res
            }
          } else {
            app.SMH.showToast({
              title: res.msg,
            });
          }
        });
      },
      popupH5Change(e) {
        if (e.show) {
          setTimeout(() => {
            this.htmlPopupShow = true
          }, 200);
        } else {
          this.htmlPopupShow = false
        }
      },
      // getBoxH() {
      //   return this._getQuery("#swiperId,#btnBox", "all").then((res) => {
      //     let swiperInfo = (res[0] && res[0][0]) || {};
      //     let footerInfo = (res[0] && res[0][1]) || {};
      //     let height =
      //       footerInfo.top - swiperInfo.top > 0 ?
      //       footerInfo.top - swiperInfo.top + "px" :
      //       "70vh";
      //     this.swiperStyle = `height:${height};`;
      //     return this.swiperStyle;
      //   });
      // },
    },
    watch: {
      current: {
        handler(nV, oV) {
          if (nV < oV) {
            this.buttonAnimation = "animate-fade-in-left"
          } else {
            this.buttonAnimation = "animate-fade-in-right"
          }
        }
      }
    },
  });
  export default pageOption;
</script>

<style lang="scss" scoped>
  @import "./H5.scss";
  @import "./MP.scss";

  .loading-view {
    position: fixed;
    z-index: 99;
    left: 0;
    top: 0;
    width: 100%;
    min-height: 100vh;
  }

  .answer {
    height: 100vh;
    width: 100%;

    .evaluating-bg-area-cover {
      position: fixed;
      top: 0px;
      left: 0px;
      width: 100%;
      height: 100%;
      z-index: -1;

      .evaluating-bg-area-cover-image {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      }
    }

    .msg-box {
      width: 320rpx;
    }

    .box {
      padding-top: 80rpx;
      box-sizing: border-box;
      overflow-y: hidden;
    }

    .tips {
      font-size: 26rpx;
      color: #b2b2b2;
      text-align: center;
    }

    .swiper {
      width: 100%;
      box-sizing: border-box;
      overflow-x: hidden;
      overflow-y: hidden;

      &.showSubmit {
        // padding-bottom: 190rpx;
        padding-bottom: 40rpx;
      }
    }

    .swiper-item-box {
      flex-wrap: nowrap;
      transition: transform 0.45s;
      width: 100%;
      height: 100%;
    }

    .swiper-item {
      width: 100%;
      height: 100%;
      transition: opacity 0.35s;
      opacity: 0;
      flex-shrink: 0;
    }

    .swiper-item-action {
      opacity: 1;
    }

    .sp-item {
      width: 100%;
      height: 100%;
    }

    .item-box {
      padding: 0 90rpx;
    }

    .title {
      font-size: 38rpx;
      padding-top: 35rpx;
      padding-bottom: 60rpx;
      text-align: center;
    }

    .answer-box {
      text-align: center;
      padding-bottom: 90rpx;
    }
    .answer-select {
      width: 558rpx;
      height: 120rpx;
      background: #FAFAFA;
      border-radius: 10rpx;
      padding: 0 30rpx 0 40rpx;
    }
    .answer-confirm {
      animation-duration: 0.5s;
      margin-top: 26rpx;
      width: 325rpx;
      height: 100rpx;
      border-radius: 10rpx;
      margin: 26rpx auto 0;
      transition: 0.5s all;
    }
     .primary-button {
      color: #FFFFFF;
      background-color: $uni-main-color;
    }

    .grey-button {
      color: #000000;
      background-color: #FAFAFA;
    }
    .answer-item {
      border-radius: 58rpx;
      font-size: 32rpx;
      margin-bottom: 43rpx;
      box-sizing: border-box;
      padding: 0 60rpx;
      border: 1px solid #e4e4e4;
      background: unset;

      &:last-child {
        margin-bottom: 0;
      }

      &.active {
        // color: #fff;
        border: 2px solid $uni-main-color;
      }

      &.unactive:hover {
        background: rgba($color: #fafafa, $alpha: 1);
      }
    }

    .btn-box {
      position: fixed;
      bottom: 45rpx;
      left: 0;
      width: 100%;
      padding-left: 35rpx;
      box-sizing: border-box;
    }

    .btn,
    .sm-btn {
      width: 200rpx;
      height: 110rpx;
      border-radius: 58rpx;
      font-size: 28rpx;
      color: #b2b2b2;
      background: #fafafa;
      margin-right: 20rpx;

      &:last-child {
        margin-right: 0;
      }
    }

    .submit {
      width: 420rpx;
      height: 110rpx;
      border-radius: 58rpx;
      background-color: $uni-main-color;
      color: #fff;
      box-shadow: 0 9rpx 44rpx 0 rgba(40, 176, 20, 0.45);
      position: absolute;
      left: 255rpx;
      transform: scale3d(0, 1, 1);
      transform-origin: right;
      opacity: 0;

      &.active {
        animation: activeAnim 0.6s forwards;
      }

      &.dismiss {
        animation: dismissAnim 0.4s forwards;
      }
    }

    .margin-box {
      padding: 20px;
      box-sizing: border-box;
      border-radius: 20rpx;
    }

    .progress-box {
      padding: 0 38rpx;
      box-sizing: border-box;
      width: 550rpx;
    }

    .progress {
      width: 100%;
    }

    .touch-stop-box {
      width: 100%;
      height: 100vh;
      z-index: 9999;
      background-color: transparent;
    }

    .blur {
      filter: blur(3px);
    }
  }

  .goon-btn-h5 {
    width: 260rpx;
    height: 88rpx;
    background: #21b014;
    border-radius: 78rpx;
    margin-top: 120rpx;
    font-size: 26rpx;
  }

  .popup-content {
    box-shadow: 0 -15rpx 30rpx 1px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    text-align: center;
  }

  .popup-content-h5 {
    width: 100vw;
    height: 100vh;
    box-shadow: 0 -15rpx 30rpx 1px rgba(0, 0, 0, 0.1);
    background-color: transparent;
    text-align: center;
    position: relative;
  }

  .filter-blur-background {
    position: fixed;
    transition: 0.3s all;
    opacity: 0;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(20rpx);
    z-index: -1;
  }

  .popip-title {
    padding: 65rpx 0 45rpx 0;
  }

  .popip-tips {
    padding-bottom: 65rpx;
  }

  .pop-btn-box {
    padding-bottom: 50rpx;
    box-sizing: border-box;
  }

  .pop-btn {
    background: #fafafa;
    border-radius: 58rpx;
    width: 300rpx;
    height: 100rpx;

    &.active {
      background: #eefaef;
      color: #5ecf68;
      margin-left: 28rpx;
    }
  }
  @keyframes activeAnim {
  0% {
    border-radius: 50%;
    opacity: 0;
    transform: scale3d(0.15, 1, 1);
  }

  50% {
    border-radius: 58rpx;
    opacity: 1;
  }

  100% {
    border-radius: 58rpx;
    opacity: 1;
    transform: scale3d(1, 1, 1);
  }
}

@keyframes dismissAnim {
  0% {
    border-radius: 58rpx;
    opacity: 1;
    transform: scale3d(1, 1, 1);
  }

  20% {
    border-radius: 58rpx;
    color: transparent;
  }

  100% {
    border-radius: 50%;
    box-shadow: 0 9rpx 44rpx 0 transparent;
    font-size: 0;
    opacity: 0;
    transform: scale3d(0.15, 1, 1);
  }
}
</style>