<template>
  <frame-box>
    <template v-slot:body>
      <view class="answer flex-s-s flex-col" :class="[popupH5Bool ? 'blur' : '']">
        <!-- #ifdef MP -->
        <page-nav mode="None" :isTransparent="true"></page-nav>
        <template v-if="acInfo.modelIds">
          <mpAnswerProgress :modelId="modelId" :answerCount="answerCount" :restQuestions="restQuestions"
            :acInfo="acInfo"></mpAnswerProgress>
        </template>
        <!-- #endif -->

        <!-- #ifdef H5 -->
        <view class="margin-box">
          <view class="progress-box flex-b-c">
            <view class="msg-box">
              <view class="progress">
                <progress :percent="getPercent(answerCount, answerCount + restQuestions)" active active-mode="forwards"
                  :duration="10" stroke-width="6" border-radius="8" :activeColor="brandStyle.themeColor"
                  backgroundColor="rgba(216,216,216,0.3)" />
              </view>
              <view class="progress-title C_7f f-shrink-0 bold p-r-20"><text
                  class="font-24">进度{{ answerCount }}</text>/<text
                  class="font-18 C_B2">{{ answerCount + restQuestions }}</text>
              </view>
            </view>
            <view class="flex-s-c">
              <button class="sm-btn flex-c-c" @click="last">上一题</button>
              <button class="sm-btn flex-c-c" @click="back('check')">
                暂停
              </button>
            </view>
          </view>
        </view>
        <!-- #endif -->
        <view v-show="showLoading" class="loading-view flex-c-c">
          <loading-view></loading-view>
        </view>
        <view class="evaluating-bg-area-cover" v-if="answerBgImg && !isH5 && !showLoading">
          <oriImage :showLoading="false" class="evaluating-bg-area-cover-image" @load="getBgSize" :style="{height:bgHeight,width:bgWidth}"
            :src="answerBgImg" />
          <!-- <image class="evaluating-bg-area-cover-image" @load="getBgSize" :style="{height:bgHeight,width:bgWidth}"
            :src="answerBgImg" /> -->
        </view>
        <view v-show="!showLoading" class="flex-s-s flex-col flex1 main-box box flex-col-1">
          <view class="tips" style="padding: 0px 80rpx"> {{list[current].instruction || acInfo.modelInstruction }}
          </view>
          <view id="swiperId" class="swiper flex1" :class="[isFinish ? 'showSubmit' : '']">
            <view class="swiper-item-box flex-s-s" v-if="list.length>0"
              :style="'transform:translateX(-' + current * 100 + '%);'">
              <view v-for="(item, index) in list" :key="index" class="swiper-item flex-s-s"
                :class="{'swiper-item-action':current == index}">
                <scroll-view class="flex1" scroll-y>
                  <view class="item-box">
                    <view class="title bold"> {{item.title || item.question || "" }}</view>
                    <view :class="['answer-box','flex-c-c','flex-col',current == index?buttonAnimation:'' ]"
                      v-if="item.optionList || item.questionList">
                       <!-- 合题样式 -->
                       <answerGroup v-if="item.questionList" :questionDetail="item" :index="index" @onAnswer="groupAnswer" @next="groupNext" :buttonAnimation="current == index ? buttonAnimation : 'animate-fade-out-down'"></answerGroup>
                      <!-- 选择器样式 -->
                       <answerPicker v-else-if="item.optionList.length>7" :showNext="index < list.length - 1" :disableNext="disableNext" :questionDetail="item" @pickerChange="pickerChange" @selectPicker="selectPicker" :buttonAnimation="current == index ? buttonAnimation : 'animate-fade-out-down'"></answerPicker>
                       <!-- 一般样式 -->
                       <answerNormal v-else-if="item.optionList.length<=7" :index="index" :current="current" :questionDetail="item" :buttonAnimation="current == index ? buttonAnimation : 'animate-fade-out-down'" @onAnswer="onAnswer"></answerNormal>
                    </view>
                  </view>
                </scroll-view>
              </view>
            </view>
          </view>
          <!-- #ifdef H5 -->
          <safe-area v-if="submitShow" areaType="bottom" position="sticky" class="flex-c-c" :extra="0"
            boxStyle="box-sizing: border-box;padding:40rpx 0;background: #fff;box-shadow: 0 -5px 10px rgb(0,0,0,0.05);border-radius:0 0 20rpx 20rpx;">
            <button class="flex-c-c submit relative" style="position: relative; left: unset; transform: unset"
              :class="{ active: btnActive, dismiss: btnDismiss }" @click="submitFinish">
              提交
            </button>
          </safe-area>
          <!-- #endif -->

          <!-- #ifdef MP -->
          <view class="btn-box flex-s-c" id="btnBox">
            <view class="btn flex-c-c" @click="last">上一题</view>
            <view class="btn flex-c-c" @click="back('check')">暂停/返回</view>
            <view v-if="acInfo.multiChoice == 1" class="btn next-question flex-c-c" @click="next">下一题</view>
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
              <button class="pop-btn C_7f" @click="back('goon')">
                继续做题
              </button>
              <button class="pop-btn active" @click="back">确认退出</button>
            </view>
          </view>
        </template>
      </ori-popup>
      <ori-popup ref="popup_h5" type="center" :is-mask-click="false" mask-background-color="rgba(0,0,0,0.6)">
        <template v-slot:content>
          <view class="popup-content">
            <view class="C_fff">已暂停评测</view>
            <button class="goon-btn C_fff flex-c-c" @click="back('goon')">
              继续评测
            </button>
          </view>
        </template>
      </ori-popup>
      <stagePopup ref="stagePopup" :scaleInfo="scaleInfo" @jumpNewScale="nextScale"></stagePopup>
      <questionTips ref="questionTips" :tipsInfo="modelTips"></questionTips>
    </template>
  </frame-box>
</template>

<script>
  import utils from '@/common/support/utils/utils.js'
  import LoadingView from '@/components/css3/loading/loading.vue';
  import sysInfosHandler from "@/common/helper/sys-infos-handler";
  import SMH from "@/common/helper/show-msg-handler";
  import oriPicker from "@/components/ori-comps/picker/ori-picker.vue";
  import oriPopup from "@/components/ori-comps/popup/ori-popup";
  import safeArea from "@/components/safe-area/index.vue";
  import stagePopup from "./components/stage-popup/stage-popup.vue"
  // 开始答题前的弹窗
  import questionTips from "./components/question-tips/question-tips.vue"
  // 回答题目的样式
  import answerNormal from "./components/answer-normal/answer-normal.vue"
  import answerPicker from "./components/answer-picker/answer-picker.vue"
  import answerGroup from "./components/answer-group/answer-group.vue"
  // 小程序答题进度条（多量表、单量表通用）
  import mpAnswerProgress from "./components/mp-answer-progress/mp-answer-progress.vue"
  import oriImage from "@/components/ori-comps/image/ori-image";

  const app = getApp();
  const pageOption = Page.BasePage({
    components: {
      LoadingView,
      oriPopup,
      safeArea,
      oriPicker,
      stagePopup,
      mpAnswerProgress,
      answerNormal,
      answerPicker,
      answerGroup,
      questionTips,
      oriImage,
    },
    data() {
      return {
        // *答题定时器
        totalTime: 0,
        answerTimer: '',
        beginAnswer: false,
        //*********/
        // *背景图
        bgHeight: 0,
        bgWidth: 0,
        //********/
        modelTips:{},
        disableNext: false,
        buttonAnimation: 'animate-fade-in-right',
        scaleInfo: {},
        showLoading: true,
        modelId: 0,
        noneFn: "",
        shinishShow: false,
        submitShow: false,
        navHeight: sysInfosHandler.navHeight || 40,
        current: 0,
        pageIndex: 0,
        pageSize: 5,
        totalCount: 0,
        answerCount: 0,
        restQuestions: 0,
        preview: 5, //提前X道题预加载题目
        answerPadding: false,
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
        optionsPickerValue: -1
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
    },
    onHide() {
      // 如果有时间则上传答题时间
      this.totalTime && this.uploadAnswerTime()
    },
    onUnload() {
      // 如果有时间则上传答题时间
      this.totalTime && this.uploadAnswerTime()
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
    computed: {
      CurPreviewNum() {
        return this.current + this.preview;
      },
       answerBgImg() {
        let acInfo = this.acInfo;
        let evaluateActivitySetting = acInfo.evaluateActivitySetting || {};
        let answerBgImg = evaluateActivitySetting.answerBgImg || ''
        return answerBgImg
      }
    },
    // onShareAppMessage(e){},
    methods: {
      // 显示下一题量表
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
      init() {
        let acInfo = this.acInfo || {}
        let allCount = parseInt(acInfo.questionCount || 0);
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
          if (!acInfo.lastQuestion.nextQuestionId && acInfo.lastQuestion.questionId) {
            this.searchTargetQuestion(acInfo.lastQuestion.questionId, acInfo.lastQuestion
              .fromQuestionId)
            this.isFinish = true;
            this.restQuestions = 0;
            if (!this.checkLastScale()) {
              this.setSubmitBtn();
            } else {
              this.setFinishBtn()
            }
          } else {
            this.searchTargetQuestion(acInfo.lastQuestion.nextQuestionId, acInfo.lastQuestion
              .questionId)
          }
          this.pageIndex = lastPageIndex;
          // 如果还没开始回答则弹出量表提示框
          // 延迟300毫秒防止弹框卡顿
          if(this.answerCount <= 1 && acInfo.guide.toString().trim().length !== 0){
          setTimeout(() => {
            this.modelTips = {
              guide:acInfo.guide,
              guideDesc:acInfo.guideDesc,
              guideKeywords:acInfo.guideKeywords,
            }
            this.$nextTick(()=>{
              this.$refs.questionTips.show()
            })}, 300)
          }
          // this.getBoxH();
        }).finally(() => {
          setTimeout(() => {
            this.showLoading = false
          }, 300);
        })
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
        if (!this.beginAnswer || !this.totalTime) return
        if (this.answerTimer) {
          clearInterval(this.answerTimer)
          this.answerTimer = null
        }
        if (upload) {
          return this.$Http(this.$Apis.updateEvaluateUsedTime, {
            customUrl: this.$Apis.updateEvaluateUsedTime.u +
              `?usedTime=${this.totalTime}&modelId=${this.modelId}&activityId=${this.acInfo.activityId}`,
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
      searchTargetQuestion(nextQuestionId, fromQuestionId) {
        let list = this.list;
        let current;
        // 用于进入下一个量表
        if (!nextQuestionId) {
          this.current = 0;
          // this.loadData()
          return;
        }
        let question = list.filter((item, i) => {
          let canJump = item.questionId == nextQuestionId || (item.questionIds && item.questionIds.includes(nextQuestionId));
            if (canJump) current = i
            return canJump
        })
        if (question && question.length > 0) {
          this.restQuestions = question[0]?.restQuestions;
          if (fromQuestionId){
              this.list[current].fromQuestionId = fromQuestionId;
          } 
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
            let questionGroupList = data.questionGroupList || []
            list = this.formatData(list, questionGroupList)
            console.log("list", list)
            this.list = this.list.concat(list);
            // 初始化进度条
            this.initProgress()
          }
          return res;
        });
      },
      // 进度条初始化
      initProgress(){
        let acInfo =  this.acInfo || {};
        let questionCount = acInfo.questionCount;
        let answerCount = acInfo.answerCount;
        let lastQuestion = acInfo.lastQuestion;
        let questionId = lastQuestion.questionId;
        let nextQuestionId = lastQuestion.nextQuestionId;
        let restQuestions = lastQuestion.restQuestions;

        // 判断剩余题目
        if (!answerCount) {
          // 如果答了0题
          this.restQuestions = Number(questionCount) - 1;
          this.answerCount = 1;
        } else if (!nextQuestionId && questionId) {
          // 如果剩余0题
          this.restQuestions = 0
          this.answerCount = Number(answerCount)
        } else {
          this.restQuestions = Number(restQuestions) - 1;
          this.answerCount = Number(answerCount) + 1;
        }
      },
      // 数据格式化
      formatData(list, groupList = []){
        console.log(this.answerCount,this.restQuestions,this.acInfo)
        groupList = JSON.parse(JSON.stringify(groupList));
        let installList = [];
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
          //给组合题目分组
          let inGroup = -1;
          let groupItem = {}
          groupList = groupList.filter((gItem)=>{
          let byGIndex = gItem.questionIds.indexOf(item.questionId);
          if(byGIndex != -1){
            groupItem = gItem
            inGroup = typeof(gItem.inGroup) == 'undefined' ? installList.length : gItem.inGroup;
            gItem.inGroup = inGroup;
            gItem.questionIds.splice(byGIndex, 1);
          }
          return gItem.questionIds.length;
          })
          if(inGroup != -1){
            if(typeof(installList[inGroup])=='undefined'){
              installList[inGroup] = {
                title:groupItem.title,
                fromQuestionId:item.fromQuestionId,
                questionId:item.questionId,
                restQuestions:item.restQuestions,
                questionIds:[],
                questionList:[]
              }
            }
            installList[inGroup].questionList.push(item)
            installList[inGroup].questionIds.push(item.questionId)
          } else {
            installList.push(item)
          }
        })

        return installList
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
      //** 答题组选择*/
      groupAnswer({optionId, qId, optionItem}){
        let index = this.current;
        let list = this.list;
        let currentItem = list[index].questionList[qId];
        currentItem.selectOptionId = optionId;       
      },
      groupNext({lastOptionItem,allOptionItem}){
        let index = this.current;
        let list = this.list;
        let currentItem = list[index];
         if (this.disableNext) {
          SMH.showToast({
            title: "参与次数已达上限"
          })
          return
        }
        // **组合题暂不做清空后续题目选项*/
        // 答案上传中
        this.answerPadding = true;
        // 全部一起提交答案
         this.submit(index, allOptionItem).then(()=>{
          // 答题完成
          if (this.isFinish || currentItem.restQuestions == 0 || lastOptionItem.nextQuestionId == 0) {
            this.restQuestions = 0;
            if (!this.checkLastScale()) {
              this.setSubmitBtn();
            } else {
              this.setFinishBtn()
            }
          }else if (currentItem.restQuestions > 0) {
            this.searchTargetQuestion(lastOptionItem.nextQuestionId, currentItem.questionId)
            this.answerCount += this.checkQuesCount(lastOptionItem.questionId)
            if (this.submitShow) this.setSubmitBtn(false);
            if (this.shinishShow) this.setFinishBtn(false);
            if (this.isFinish) this.isFinish = false;
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
      //** 选择器选择*/ 
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
              if(item.questionList instanceof Array){
                item.questionList.forEach(qItem=>{
                  qItem.selectOptionId = 0;
                })
              }else{
                item.questionIndex = 0;
                item.selectOptionId = 0;
              }
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
        // let optionItem = optionList[selectIndex];
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
          this.answerCount += 1
          this.restQuestions = currentItem.restQuestions - 1;
          this.searchTargetQuestion(optionItem.nextQuestionId, currentItem.questionId)
          if (this.submitShow) this.setSubmitBtn(false);
          if (this.shinishShow) this.setFinishBtn(false);
          if (this.isFinish) this.isFinish = false;
        }

      },
      //** 普通选择*/
      onAnswer({id, index, optionItem}) {
        if (this.list[this.current].questionId != this.list[index].questionId) return
        if (index != this.totalCount - 1) {
          let check = this._clickHold("answer", 400);
          if (!check) return;
        }
        if (this.answerPadding) return;
        this.answerPadding = true;
        let currentItem = this.list[index];
        let list = this.list;
        // 如果后续题目路线不一样，清空后续选项
        let lastSelectItem = currentItem.optionList.filter(optionChild => {
          return optionChild.optionId == currentItem.selectOptionId
        });
        if (lastSelectItem.length > 0 && (lastSelectItem[0].nextQuestionId != optionItem.nextQuestionId)) {
          list.map((item, i) => {
            if (i > index) {
             if(item.questionList instanceof Array){
                item.questionList.forEach(qItem=>{
                  qItem.selectOptionId = 0;
                })
              }else{
                item.questionIndex = 0;
                item.selectOptionId = 0;
              }
            }
          })
          this.list = list;
        }
        currentItem.selectOptionId = id;
        this.submit(index, currentItem).then(() => {
          // 定时300毫秒防止动画卡顿
          setTimeout(() => {
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
              this.answerCount += 1
              this.searchTargetQuestion(optionItem.nextQuestionId, currentItem.questionId)
              if (this.submitShow) this.setSubmitBtn(false);
              if (this.shinishShow) this.setFinishBtn(false);
              if (this.isFinish) this.isFinish = false;
            }
          }, 300);
        }).finally(() => {
          setTimeout(() => {
            this.answerPadding = false;
          }, 300)
        })
      },
      // 检查有多少题
      checkQuesCount(questionId){
        let list = this.list || [];
        let isGroup = false;
        let question = {};
        for(let i = 0;i<list.length;i++){
          let item = list[i] || {};
          isGroup = typeof(item.questionIds) != 'undefined';
          if((isGroup && item.questionIds.includes(questionId)) || item.questionId == questionId){
            question = item;
            break
          }
        }
        let questionCount = isGroup?question.questionIds.length : 1
        return questionCount
      },
      // 检查是否为最后一个量表
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
        let answerList = []
        if(item instanceof Array){
          item.forEach(oItem=>{
            answerList.push({
              optionId: oItem.selectOptionId || 0,
              questionId: oItem.questionId || 0
            })
          })
        }else{
          answerList = [{
            optionId: item.selectOptionId || 0,
            questionId: item.questionId || 0
          }, ];
        }
        return this.$Http(this.$Apis.submitAnswer, {
          data: {
            activityId: this.options.activityId || 0,
            answerList,
            usedTime: this.totalTime,
            modelId: this.modelId
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
            return data
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
          setTimeout(() => {
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
        let current = this.current;
        if (current == 0) {
          app.SMH.showToast({
            title: "已经是第一题了噢~"
          })
          return
        }
        if (this.submitShow) this.setSubmitBtn(false);
        if (this.shinishShow) this.setFinishBtn(false);
        if (this.isFinish) this.isFinish = false;
        let list = this.list;
        // 计算剩余题目数
        let restQuestions = this.restQuestions;
        let curInfo = list[current] || {};
        let fromQuestionId = curInfo.fromQuestionId;
        let lastQuestionCount = this.checkQuesCount(fromQuestionId)
        this.answerCount -= lastQuestionCount;
        this.restQuestions = restQuestions;
        // 计算剩余题目数 End
        this.searchTargetQuestion(list[current].fromQuestionId);
      },
      back(type) {
        let ref = "popup";
        this.isH5 && (ref = "popup_h5");
        if (type == "check") {
          this.isH5 && (this.popupH5Bool = true);
          this.$refs[ref].show();
          this.uploadAnswerTime()
        } else if (type == "goon") {
          this.isH5 && (this.popupH5Bool = false);
          this.$refs[ref].dismiss();
          this.initTiming()
        } else {
          this.backAction();
        }
      },
      getPercent(cur, len) {
        console.log(cur, len, "百分比")
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
        let index = -1;
        let check = this.list.every((item, i) => {
          index = i;
          return item.selectOptionId > 0;
        });
        if (!check && !this.isFinish) {
          SMH.showToast({
            title: `第${index + 1}道题目还没答题`,
          });
          this.current = index;
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
      getBoxH() {
        return this._getQuery("#swiperId,#btnBox", "all").then((res) => {
          let swiperInfo = (res[0] && res[0][0]) || {};
          let footerInfo = (res[0] && res[0][1]) || {};
          let height =
            footerInfo.top - swiperInfo.top > 0 ?
            footerInfo.top - swiperInfo.top + "px" :
            "70vh";
          this.swiperStyle = `height:${height};`;
          console.log("_getQuery", res, this, this.swiperStyle);
          return this.swiperStyle;
        });
      },
    },
  });
  export default pageOption;
</script>

<style lang="scss" scoped>
  @import "./H5.scss";
  @import "./MP.scss";
  @import "./animate.scss";

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

    .main-box {
      // flex: 1
    }

    .box {
      padding-top: 80rpx;
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
      flex-shrink: 0;
      padding-bottom: 175rpx;
      transition: opacity 0.35s;
      opacity: 0;
      height: 100%;
      box-sizing: border-box;
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
      animation-duration: 0.6s;
    }


    .btn-box {
      position: fixed;
      bottom: 0rpx;
      left: 0;
      width: 100%;
      padding-left: 35rpx;
      box-sizing: border-box;
      // padding-top: 20rpx;
      // padding-bottom: 25rpx;
      height: 140rpx;
    }

    .btn,
    .sm-btn {
      width: 200rpx;
      height: 100rpx;
      border-radius: 58rpx;
      font-size: 28rpx;
      color: #7f7f7f;
      // background: #F3F3F3;
      background: #F3F3F3;
      margin-right: 45rpx;

      &:last-child {
        margin-right: 0;
      }
    }

    .next-question {
      background: #F5FAFF;
      color: $uni-main-color;
    }

    .submit {
      width: 420rpx;
      height: 110rpx;
      border-radius: 58rpx;
      background-color: $uni-main-color;
      color: #fff;
      box-shadow: 0px 9rpx 44rpx 0px rgba(6, 80, 155, 0.32);
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
      display: flex;
      justify-content: space-between;
      align-items: center;
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

  .goon-btn {
    width: 440rpx;
    height: 140rpx;
    background: #21b014;
    border-radius: 20rpx;
    margin-top: 160rpx;
    font-size: 24rpx;
  }

  .popup-content {
    box-shadow: 0 -15rpx 30rpx 1px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    text-align: center;
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
    background: #F3F3F3;
    border-radius: 58rpx;
    width: 300rpx;
    height: 100rpx;

    &.active {
      background: rgba($color: $uni-main-color, $alpha: 0.2);
      color: $uni-main-color;
      margin-left: 28rpx;
    }
  }
</style>