<template>
  <frame-box>
    <template v-slot:body>
      <view class="answer flex-s-s flex-col" :class="[popupH5Bool ? 'blur' : '']">
        <!-- #ifdef MP -->
        <page-nav mode="None">
          <template v-slot:custom-content>
            <view class="progress-box flex-s-c" :style="'height:' + navHeight + 'px;'">
              <view class="progress-title C_7f f-shrink-0 bold p-r-20"><text
                  class="font-24">进度{{ answerCount }}</text>/<text
                  class="font-18 C_B2">{{ answerCount + restQuestions }}</text>
              </view>
              <!-- <view class="progress-title C_7f f-shrink-0 bold p-r-20"><text
                  class="font-24">进度{{ current + 1 }}</text>/<text class="font-18 C_B2">{{ totalCount }}</text>
              </view> -->
              <view class="progress">
                <progress :percent="getPercent(answerCount, answerCount + restQuestions)" active active-mode="forwards"
                  :duration="10" stroke-width="6" border-radius="8" activeColor="#21B014"
                  backgroundColor="rgba(216,216,216,0.3)" />
              </view>
            </view>
          </template>
        </page-nav>
        <!-- #endif -->

        <!-- #ifdef H5 -->
        <view class="margin-box">
          <view class="progress-box flex-b-c">
            <view class="msg-box">
              <view class="progress">
                <progress :percent="getPercent(answerCount, answerCount + restQuestions)" active active-mode="forwards"
                  :duration="10" stroke-width="6" border-radius="8" activeColor="#21B014"
                  backgroundColor="rgba(216,216,216,0.3)" />
              </view>
              <view class="progress-title C_7f f-shrink-0 bold p-r-20"><text
                  class="font-24">进度{{ answerCount }}</text>/<text
                  class="font-18 C_B2">{{ answerCount + restQuestions }}</text>
              </view>
              <!-- <view class="progress-title C_7f f-shrink-0 bold p-r-20"><text
                  class="font-24">进度{{ current + 1 }}</text>/<text class="font-18 C_B2">{{ totalCount }}</text>
              </view> -->
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
        <view v-show="!showLoading" class="box flex-col-1">
          <!-- <view class="tips" style="padding: 0px 80rpx" v-if="acInfo.activityInstruction">
            {{ acInfo.activityInstruction }}</view> -->
          <view id="swiperId" class="swiper flex1" :class="[isFinish ? 'showSubmit' : '']">
            <view class="swiper-item-box flex-s-s" :style="'transform:translateX(-' + current * 100 + '%);'">
              <view v-for="(item, index) in list" :key="index" class="swiper-item"
                :class="{'swiper-item-action':current == index}">
                <view class="item-box" v-show="current == index">
                  <view class="item-image" v-if="item.questionPicture">
                    <image :src="item.questionPicture" mode="aspectFill" />
                  </view>
                  <view class="title bold">
                    <view v-if="acInfo.multiChoice == 1" class="choice-type">
                      <view>多选题</view>
                    </view>
                    {{ item.question || "" }}
                  </view>
                  <template v-if="item.pictureForm">
                    <view :class="['answer-box-picture',current == index?buttonAnimation:'']" v-if="item.optionList">
                      <view
                        :class="['answer-item-picture',current == index ? buttonAnimation : 'animate-fade-out-down']"
                        @click="onAnswer(c_item.optionId, index)" v-for="(c_item, c_index) in item.optionList"
                        :key="c_index" :style="{'animation-delay':`${current == index ? c_item.showTime : 0}s`}">
                        <image :src="c_item.optionPicture" mode="aspectFill" />
                        <view class="answer-item-picture-text" v-if="c_item.optionContent">{{ c_item.optionContent }}
                        </view>
                        <view :style="filterSelect(c_item.optionId) == 1?'opacity:1':''" class="'active-view'">
                        </view>
                      </view>
                    </view>
                  </template>
                  <template v-else>
                    <view :class="['answer-box','flex-c-c','flex-col',current == index?buttonAnimation:'']"
                      v-if="item.optionList">
                      <view
                        :class="['answer-item','bold', 'flex-c-c',filterSelect(c_item.optionId) == 1 ? 'active' : '',current == index ? buttonAnimation : 'animate-fade-out-down']"
                        @click="onAnswer(c_item.optionId, index)" v-for="(c_item, c_index) in item.optionList"
                        :key="c_index" :style="{'animation-delay':`${current == index ? c_item.showTime : 0}s`}">
                        {{ c_item.optionContent }}
                      </view>
                    </view>
                  </template>
                </view>
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
            <view class="btn flex-c-c" @click="back('check')">暂停返回</view>
            <view v-if="acInfo.multiChoice == 1" class="btn next-question flex-c-c" @click="next">下一题</view>
            <view class="flex-c-c submit" :class="{ active: btnActive, dismiss: btnDismiss }" v-if="submitShow"
              @click="submitFinish">提交</view>
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
              <button class="font-30 pop-btn C_7f" @click="back('goon')">
                继续做题
              </button>
              <button class="font-30 pop-btn active" @click="back">确认退出</button>
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
    </template>
  </frame-box>
</template>

<script>
  import LoadingView from '@/components/css3/loading/loading.vue';
  import sysInfosHandler from "@/common/helper/sys-infos-handler";
  import SMH from "@/common/helper/show-msg-handler";
  import oriPopup from "@/components/ori-comps/popup/ori-popup";
  import safeArea from "@/components/safe-area/index.vue";

  const app = getApp();
  const pageOption = Page.BasePage({
    components: {
      LoadingView,
      oriPopup,
      safeArea,
    },
    data() {
      return {
        buttonAnimation: 'animate-fade-in-right',
        showLoading: true,
        noneFn: "",
        submitShow: false,
        navHeight: sysInfosHandler.navHeight || 40,
        current: 0,
        pageIndex: 0,
        pageSize: 5,
        totalCount: 0,
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

        // 跳题
        questionIndex: 0,
        restQuestions: 0,
        answerCount: 0
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
    computed: {
      CurPreviewNum() {
        return this.current + this.preview;
      },
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
    methods: {
      init() {
        let allCount = parseInt(this.acInfo.questionCount || 0);
        let lastPageIndex = Math.ceil(allCount / this.pageSize);
        let lastPageSize = lastPageIndex * this.pageSize;
        this.loadData(1, lastPageSize).then(() => {
          if (this.acInfo.lastQuestion) {
            if (!this.acInfo.lastQuestion.nextQuestionId && this.acInfo.lastQuestion.questionId) {
              this.searchTargetQuestion(this.acInfo.lastQuestion.questionId, this.acInfo.lastQuestion
                .fromQuestionId)
              this.isFinish = true;
              this.setSubmitBtn()
            } else {
              this.searchTargetQuestion(this.acInfo.lastQuestion.nextQuestionId, this.acInfo.lastQuestion
                .questionId)
            }
          }
          this.pageIndex = lastPageIndex;
          this.getBoxH();
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
          this.loadData()
          return;
        }
        let question = list.filter((item, i) => {
          if (item.questionId == nextQuestionId) current = i
          return item.questionId == nextQuestionId
        })
        if (question && question.length > 0) {
          this.restQuestions = question[0]?.restQuestions;
          // console.log(this.list[current], fromQuestionId)
          // if(fromQuestionId) this.$set(this.list[current],"fromQuestionId",fromQuestionId)
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
        return this.$Http(this.$Apis.getFunTestPage, {
          data: {
            testId: this.options.testId,
          },
        }).then((res) => {
          if (res.code == 1) {
            let data = res.data || {};
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

            this.acInfo = data;
          }
        });
      },
      // 查找是否选择
      filterSelect(id) {
        let current = this.current;
        let selectQuestion = this.list[current].selectedOptionIds;
        if (!selectQuestion) return false
        return selectQuestion.indexOf(id) == -1 ? 0 : 1
      },
      loadData(pageIndex = 0, pageSize = 0) {
        if (!this.hasMore) {
          return Promise.reject();
        }
        if (!pageIndex) pageIndex = this.pageIndex + 1;
        if (!pageSize) pageSize = this.pageSize;
        return this.$Http(this.$Apis.getFunTestQuestionListByPage, {
          data: {
            testId: this.options.testId || 0,
            // pageIndex: pageIndex,
            // pageSize: pageSize
            skip: parseInt(pageIndex - 1) * this.pageSize, // 跳过行数
            take: pageSize, // 取得行数
          },
        }).then((res) => {
          if (res.code == 1) {
            this.pageIndex = pageIndex;
            let data = res.data || {};
            let list = data.list || [];
            list.forEach(item => {
              let time = 0.1;
              item.pictureForm = false
              item.optionList.forEach((oItem, index) => {
                oItem.showTime = (index * time).toFixed(1);
                if (oItem.optionPicture.trim()) {
                  item.pictureForm = true
                }
              })
              if (!item.selectedOptionIds) item.selectedOptionIds = []
            })
            this.totalCount = data.totalCount || 0;
            this.hasMore = pageIndex * pageSize < this.totalCount;
            this.list = this.list.concat(list);
          }
          return res;
        });
      },
      onAnswer(id, index) {
        if (this.answerPadding) return
        if (this.list[this.current].questionId != this.list[index].questionId) return
        // if (this.answerPadding) return;
        // if (index != this.totalCount - 1) {
        //   let check = this._clickHold("answer", 400);
        //   if (!check) return;
        // }
        let item = this.list[index];
        let multiChoice = this.acInfo.multiChoice;
        if (multiChoice == 1) {
          if (item.selectedOptionIds.indexOf(id) == -1) {
            item.selectedOptionIds.push(id)
          } else {
            item.selectedOptionIds.splice(item.selectedOptionIds.indexOf(id), 1)
          }
          if (this.submitShow) this.next()
        } else {
          item.selectedOptionIds = [];
          item.selectedOptionIds.push(id)
          this.next()
        }
      },

      submit(index) {
        let item = this.list[index] || {};
        let selectedOptionIds = item.selectedOptionIds

        if (item.selectOptionId <= 0) {
          SMH.showToast({
            title: `第${index + 1}道题目答案异常`,
          });
          return;
        }
        let answerInfoList = [];
        selectedOptionIds.forEach(selectItem => {
          answerInfoList.push({
            optionId: selectItem,
            questionId: item.questionId
          })
        })
        return this.$Http(this.$Apis.submitFunTest, {
          data: {
            testId: this.options.testId || 0,
            answerInfoList,
          },
          other: {
            isShowLoad: true,
          },
        }).then((res) => {
          if (res.code == 1) {
            let data = res.data || {};
            this.isFinish = data.isFinish || false;
            return Promise.resolve(res);
          } else {
            return Promise.reject(res);
          }
        });
      },
      setSubmitBtn(bool = true) {
        let list = this.list;
        if (bool) {
          if (this.submitShow) return;
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
      next() {
        let list = this.list;
        let current = this.current;
        let item = list[current];
        let selectedOptionIds = item.selectedOptionIds;
        if (selectedOptionIds.length == 0) {
          app.SMH.showToast({
            title: "请先选择选项噢~"
          })
          return
        }
        if (this.answerPadding) return
        // 答案上传中
        this.answerPadding = true;
        let optionList = item.optionList;
        let nextQuestionId = 0;
        optionList.forEach(optionItem => {
          if (optionItem.optionId == selectedOptionIds[0]) {
            nextQuestionId = optionItem.nextQuestionId
            return
          }
        })
        this.submit(current)
          .then(() => {
            if (this.isFinish || item.restQuestions == 0 || nextQuestionId == 0) {
              this.setSubmitBtn();
              this.restQuestions = 0;
              list.map((item, i) => {
                if (i > current) {
                  item.questionIndex = 0;
                  item.selectOptionId = 0;
                }
              })
              this.list = list;
              return
            } else {
              this.setSubmitBtn(false);
            }
            if (
              this.isFinish ||
              (nextQuestionId == 0 &&
                this.list[this.current] &&
                this.list[this.current].selectOptionId > 0)
            ) {
              this.setSubmitBtn();
            } else if (item.restQuestions > 0) {
              this.searchTargetQuestion(nextQuestionId, item.questionId)
              this.answerCount += 1
              if (this.submitShow) this.setSubmitBtn(false);
              if (this.isFinish) this.isFinish = false;
            }
          })
          .finally(() => {
            uni.pageScrollTo({
              scrollTop: 0,
              duration: 0
            })
            setTimeout(() => {
              this.answerPadding = false;
            }, 600)
          });
      },
      last() {
        if (this.current == 0) {
          app.SMH.showToast({
            title: "已经是第一题了噢~"
          })
          return
        }
        if (this.submitShow) this.setSubmitBtn(false);
        if (this.isFinish) this.isFinish = false;
        this.answerCount -= 1;
        let list = this.list;
        // 计算剩余题目数
        let restQuestions;
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
        this.isH5 && (ref = "popup_h5");
        if (type == "check") {
          this.isH5 && (this.popupH5Bool = true);
          this.$refs[ref].show();
        } else if (type == "goon") {
          this.isH5 && (this.popupH5Bool = false);
          this.$refs[ref].dismiss();
        } else {
          this.backAction();
        }
      },
      getPercent(cur, len) {
        return Number((cur / len).toFixed(2)) * 100;
      },
      submitFinish() {
        // let index = -1;
        // let check = this.list.every((item, i) => {
        //   index = i;
        //   return item.selectOptionId > 0;
        // });
        if (!this.isFinish) {
          SMH.showToast({
            title: `第${index + 1}道题目还没答题`,
          });
          // this.current = index;
          return;
        }
        return this.$Http(this.$Apis.finishFunTest, {
          customUrl: this.$Apis.finishFunTest.u +
            `?testId=${this.options.testId || 0}`,
          other: {
            isShowLoad: true,
          },
        }).then((res) => {
          if (res.code) {
            this.redirectAction(
              `/pages/activities/fun-assessment/answer/answer-result?recordId=${res.data}&testId=${this.options.testId}`
            );
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



  .animate-fade-in-right {
    animation-name: fadeInRight;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
  }

  .animate-fade-in-left {
    animation-name: fadeInLeft;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
  }

  .animate-fade-out-down {
    animation-name: fadeOutDown;
    animation-iteration-count: 1;
    animation-fill-mode: forwards;
  }

  .loading-view {
    position: fixed;
    z-index: 99;
    left: 0;
    top: 0;
    width: 100%;
    min-height: 100vh;
  }

  .answer {
    .msg-box {
      width: 320rpx;
    }

    .box {
      padding-top: 30rpx;
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
      overflow-y: auto;

      &.showSubmit {
        // padding-bottom: 190rpx;
        padding-bottom: 40rpx;
      }
    }

    .swiper-item-box {
      flex-wrap: nowrap;
      transition: transform 0.35s;
      width: 100%;
    }

    .swiper-item {
      width: 100%;
      flex-shrink: 0;
      padding-bottom: 175rpx;
      transition: 0.35s all;
      opacity: 0;
    }

    .swiper-item-action {
      opacity: 1;
    }

    .sp-item {
      width: 100%;
      height: 100%;
    }

    .item-box {
      // padding: 0 90rpx;
    }

    .item-image {
      width: 100%;
      height: 366rpx;

      // background-color: #8E8E8E;
      image {
        width: 100%;
        height: 100%;
      }
    }

    .title {
      font-size: 38rpx;
      padding-top: 34rpx;
      padding-bottom: 60rpx;
      text-align: left;
      // width: 100%;
      width: 630rpx;
      margin: 0 auto;
      text-align: justify;

      &>text {
        margin: 0 auto;
      }

      .choice-type {
        position: relative;
        display: inline-block;
        width: 83rpx;
        height: 40rpx;
        background: rgba($color: #008ACB, $alpha: 0.1);
        border-radius: 4rpx;
        margin-right: 15rpx;
        transform: translateY(7rpx);

        view {
          font-size: 22rpx;
          color: #0083CE;
          line-height: 30rpx;
          white-space: nowrap;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
    }

    .answer-box-picture {
      animation-duration: 0.6s;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      padding: 0 40rpx;


      .answer-item-picture {
        position: relative;
        animation-duration: 0.5s;
        opacity: 0;
        width: 317rpx;
        background: #FFFFFF;
        box-shadow: 0px 2px 17px 0px rgba(181, 181, 181, 0.17);
        font-size: 26rpx;
        overflow: hidden;
        border-radius: 10rpx;
        margin-bottom: 45rpx;


        &>image {
          width: 100%;
          height: 288rpx;
        }

        &>.answer-item-picture-text {
          padding: 22rpx 20rpx 30rpx;
          text-align: justify;
        }

        &>.active-view {
          transition: opacity 0.2s;
          position: absolute;
          left: 0px;
          top: 0px;
          height: 100%;
          width: 100%;
          border-radius: 10rpx;
          border: 3px solid #21B014;
          box-sizing: border-box;
          opacity: 0;
        }
      }
    }

    .answer-box {
      animation-duration: 0.6s;
      text-align: center;
    }

    .answer-item {
      transition: border 0.2s;
      animation-duration: 0.5s;
      opacity: 0;
      border-radius: 10rpx;
      font-size: 26rpx;
      margin-bottom: 20rpx;
      box-sizing: border-box;
      width: 630rpx;
      min-height: 106rpx;
      padding: 0 60rpx;
      background: #FAFAFA;
      color: #333333;
      border: 1px solid #EFEFEF;
      line-height: 37rpx;

      &:last-child {
        margin-bottom: 0;
      }

      &.active {
        // color: #fff;
        // background: $uni-main-color;
        border: solid #21B014;
      }

      &.unactive:hover {
        background: rgba($color: #F3F3F3, $alpha: 1);
      }
    }

    .btn-box {
      position: fixed;
      bottom: 0rpx;
      left: 0;
      width: 100%;
      padding-left: 35rpx;
      box-sizing: border-box;
      background: #FFFFFF;
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
      background: #AED3AB;
      color: #FFFFFF;
    }

    .submit {
      width: 435rpx;
      height: 100rpx;
      border-radius: 58rpx;
      background-color: #35952E;
      color: #fff;
      box-shadow: 0px 9rpx 44rpx 0px rgba($color: #35952E, $alpha: 0.32);
      position: absolute;
      left: 275rpx;
      transform: scale3d(0, 1, 1);
      transform-origin: right;
      opacity: 0;
      font-size: 36rpx;
      font-weight: bold;

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
      background: rgba($color: #35952E, $alpha: 0.2);
      color: #35952E;
      margin-left: 28rpx;
    }
  }

  @keyframes fadeInRight {
    from {
      opacity: 0;
      transform: translateX(20%);
    }

    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes fadeInLeft {
    from {
      opacity: 0;
      transform: translateX(-20%);
    }

    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes fadeOutDown {
    from {
      opacity: 1;
    }

    to {
      opacity: 0;
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