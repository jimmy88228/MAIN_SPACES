<template>
  <view class="work-bench-detail" :style="isEmpty ? 'background-color: #fff;' : ''">
    <page-nav mode="None">
      <template slot="custom-content">
        <view class="bench-title flex-b-c">
          <view class="flex-s-c" @click="showOrganizeLsit" style="max-width: 400rpx;">
            <image class="organize-icon shrink0" :src="requireStatic(organizeIcon)" />
            <view v-if="tcrUserInfo.roleType == 'class_teacher'" class="font-24 clamp">{{oragnize.classFullName || ''}}({{oragnize.schoolYear||''}}级)
            </view>
            <view v-else class="font-24 clamp">{{schoolName || ''}}</view>
            <image class="change-icon shrink0" v-if="showChangeClass" :src="requireStatic(changeIcon)" />
          </view>
          <view class="logout flex-c-c shrink0" @click="_logout">
            <image class="shrink0" :src="requireStatic(logoutIcon)" />
            <view class="font-22 w-nowrap">登出</view>
          </view>
        </view>
      </template>
    </page-nav>

    <view class="bench-top-area flex-s-c" :style="{'top':navTop+'px'}">
      <template v-if="tcrUserInfo.roleType == 'class_teacher' || tcrUserInfo.roleType == 'psyc_teacher'">
        <view class="bench-top-item" @click="turnPage" data-mode="caring-staff">
          <oriImage class="bench-top-item-image" :src="staticAddress+caringStaffIcon" mode="widthFix" />
          <view class="C_7f font-22">
            关爱人员
          </view>
        </view>
      </template>
      <template v-if="tcrUserInfo.roleType == 'psyc_teacher'">
        <view class="bench-top-item" @click="turnPage" data-mode="reserve-supervise-list">
          <oriImage class="bench-top-item-image" :src="staticAddress+reserveSuperviseIcon" mode="widthFix" />
          <view class="C_7f font-22">
            预约督导
          </view>
        </view>
      </template>
      <view class="bench-top-item" @click="jumpAction('/pages/custom/page/page?type=psycHandbook')">
        <oriImage class="bench-top-item-image" :src="staticAddress+psychologyBookIcon" mode="widthFix" />
        <view class="C_7f font-22">
          心理手册
        </view>
      </view>
      <template v-if="tcrUserInfo.roleType == 'class_teacher'">
        <view class="bench-top-item" @click="turnPage" data-mode="class-manage">
          <oriImage class="bench-top-item-image" :src="requireStatic(classManage)" mode="widthFix" />
          <view class="C_7f font-22">
            班级管理
          </view>
        </view>
      </template>
    </view>
    <template v-if="!isEmpty">
      <template v-if="tcrUserInfo.roleType == 'class_teacher'">
        <view class="eval-list">
          <view v-for="(pageItem,pageIndex) in evalList" :key="pageIndex">
            <class-teacher-item @createCode="createCode(item)" @participation="participation(item,i,pageIndex)"
              :itemInfo="item" v-for="(item,i) in pageItem" :key="i"></class-teacher-item>
          </view>
        </view>
      </template>
      <template v-else-if="tcrUserInfo.roleType == 'teacher'">
        <view class="eval-list">
          <view v-for="(pageItem,pageIndex) in evalList" :key="pageIndex">
            <normal-teacher-item @learnNow="learnNow(item,i,pageIndex)" :itemInfo="item" v-for="(item,i) in pageItem"
              :key="i"></normal-teacher-item>
          </view>
        </view>
      </template>
      <template v-else>
        <view class="eval-list">
          <view v-for="(pageItem,pageIndex) in evalList" :key="pageIndex">
            <psyc-teacher-item @psycWarningList="psycWarningList(item,i,pageIndex)" :itemInfo="item"
              v-for="(item,i) in pageItem" :key="i"></psyc-teacher-item>
          </view>
        </view>
      </template>
    </template>
    <template v-else>
      <empty>暂无相关活动哦~
        <template slot="operate"></template>
      </empty>
    </template>
    <poster ref="poster"></poster>
    <psychologyProtocol @confirm="confirmProtocol" ref="psychologyProtocol"></psychologyProtocol>
    <work-bench @popupChange="toggleWorkBench" ref="workBench" @selected="selectClass"></work-bench>
  </view>
</template>

<script>
  import Conf from "@/config/config.js"
  import SMH from "@/common/helper/show-msg-handler.js";
  import SIH from "@/common/helper/sys-infos-handler"
  import structureManage from '@/common/manager/structure-manage.js'
  import poster from '@/components/poster/index.vue';
  import psychologyProtocol from '@/components/psychology-protocol/psychology-protocol.vue';
  import workBench from "@/components/custom-page/work-bench/work-bench"
  import classTeacherItem from './components/class-teacher-item.vue'
  import psycTeacherItem from './components/psyc-teacher-item.vue'
  import normalTeacherItem from './components/normal-teacher-item.vue'
  import oriImage from "@/components/ori-comps/image/ori-image"

  const app = getApp();
  const pageOption = Page.BasePage({
    components: {
      poster,
      psychologyProtocol,
      workBench,
      classTeacherItem,
      psycTeacherItem,
      normalTeacherItem,
      oriImage,
    },
    data() {
      return {
        activityIcon: "/activity-icon.jpg",
        caringStaffIcon: "/caring-staff.png",
        reserveSuperviseIcon: "/reserve-supervise.png",
        psychologyBookIcon: "/psychology-book.png",
        greenCodeIcon: "/green-code.png",
        bgreyCodeIcon: "/grey-code.png",
        participationIcon: "/participation.png",
        //require函数
        organizeIcon: "/organize.png",
        logoutIcon: "/logout.png",
        changeIcon: "/change.png",
        classManage: "class-manage/class-manage.png",
        navTop: SIH.navPlace,
        statusBarHeight: SIH.statusBarHeight,
        // 组织信息
        oragnize: {},
        oldStructureID: '',
        tcrUserInfo: {},
        schoolName: "",
        // 分页
        isEmpty: false,
        pageIndex: 0,
        pageSize: Conf.PAGE_SIZE,
        hasMore: true,
        evalList: [],
        activityAppletCode: {},
      }
    },
    computed: {
      showChangeClass() {
        let tcrUserInfo = this.tcrUserInfo
        let show = tcrUserInfo.roleType == 'class_teacher' && tcrUserInfo.classList.length > 1
        return show
      }
    },
    onLoad(options) {
      this.options = options;
    },
    onReady() {
      this.init(this.initList);

    },
    onShow() {
      if (this.clickPage) {
        this.pageIndex = this.clickPage - 1 || 0;
        this.loadData();
      }
    },
    methods: {
      init(callback) {
        let oragnize = app.SM.structureInfo;
        app.IM.getUserInfoByToken(true).then(res => {
          let userInfo = res || {};
          console.log(userInfo.schoolName, "学校名")
          this.$nextTick(() => {
            this.schoolName = userInfo.schoolName || "";
          })
        })
        app.SM.getStructureList().then(res => {
          let tcrUserInfo = app.IM.tcrUserInfo;

          if (tcrUserInfo.roleType == "class_teacher") {
            let classId = oragnize.classId
            let selected = res.filter(item => {
              return item.classId == classId
            })
            if (selected.length > 0) {
              app.SM.saveStructureInfo(selected[0])
              this.oragnize = selected[0];
              this.tcrUserInfo = tcrUserInfo
              typeof (callback) == "function" && callback()
            } else {
              SMH.showToast({
                title: "当前绑定的班级已失效，请重新选择"
              })
              let ref = "workBench";
              this.$refs[ref].loadData()
            }
          } else {
            this.oragnize = app.SM.structureInfo;
            this.tcrUserInfo = tcrUserInfo;
            typeof (callback) == "function" && callback()
          }
        })
      },
      initList() {
        this.evalList = [];
        this.pageIndex = 0;
        this.hasMore = true;
        this.isEmpty = false;
        this.loadData();
      },
      loadData() {
        let pageIndex = this.pageIndex ? this.pageIndex + 1 : 1;
        let api = 'getActivityListByPsycTeacher';
        let params = {
          pageIndex: pageIndex,
          pageSize: this.pageSize,
        }
        if (this.tcrUserInfo.roleType == 'class_teacher') {
          api = 'getActivityListByClassTeacher';
          params.structureId = this.oragnize.classId || 0;
        }
        if (this.tcrUserInfo.roleType == 'teacher') {
          api = 'selectCourseListByPage';
        }
        return this.$Http(this.$Apis[api], {
          data: params,
        }).then((res) => {
          if (res.code == 1) {
            let data = res.data || {};
            this.pageIndex = pageIndex;
            let currPage = pageIndex - 1 ? pageIndex - 1 : 0;
            this.evalList[currPage] = data.list || [];
            this.hasMore = this.pageIndex * this.pageSize < data.totalCount;
            this.setEmpty(this.evalList);
          }
          return res;
        });
      },
      formatDate(date) {
        return date.slice(0, 10)
      },
      checkStatus(status) {
        let tips = ""
        switch (status) {
          case 0:
            tips = "待开始";
            break
          case 1:
            tips = "进行中"
            break
          case 2:
            tips = "已结束";
            break
          case 3:
            tips = "已关闭";
            break
          default:
            break
        }
        return tips
      },
      checkPIndex(pIndex) {
        if (pIndex) {
          this.clickPage = pIndex || 0
        } else {
          this.clickPage = this.pageIndex
        }
      },
      participation(item, i, pIndex) {
        console.log(item)
        if (item.receiveCount == 0) {
          SMH.showToast({
            title: "活动暂无参与人员"
          })
          return
        }
        this.checkPIndex(pIndex)
        let id = item.activityId
        this.jumpAction(`/pages/work-bench/participation/participation?activityId=${id}`)
      },
      psycWarningList(item, i, pIndex) {
        if (item.warningCount == 0) {
          SMH.showToast({
            title: "活动暂无预警人员"
          })
          return
        }
        this.checkPIndex(pIndex)
        let id = item.activityId
        this.jumpAction(`/pages/work-bench/warning-list/warning-list?activityId=${id}`)
      },
      learnNow(item, i, pIndex) {
        if (item.contentCount == 0) {
          SMH.showToast({
            title: "当前课程暂无内容"
          })
          return
        }
        this.checkPIndex(pIndex)
        let id = item.activityId
        this.jumpAction(`/pages/work-bench/course-details/course-details?courseActivityId=${id}`)
      },

      turnPage({
        currentTarget
      }) {
        let mode = currentTarget.dataset.mode;
        if (mode == "caring-staff") {
          this.$refs.psychologyProtocol.showModal();
          return
        }
        this.checkPIndex(currentTarget.dataset.pIndex)
        this.jumpAction(`/pages/work-bench/${mode}/${mode}`)
      },

      confirmProtocol() {
        this.checkPIndex()
        this.jumpAction(`/pages/work-bench/caring-staff/caring-staff`)
      },

      setEmpty(data) {
        if (data instanceof Array) {
          if (data.length == 0 || !data[0] || (data[0] && data[0].length == 0)) {
            this.isEmpty = true;
          } else {
            this.isEmpty = false;
          }
        } else {
          this.isEmpty = false;
        }
      },
      createCode(item = {}) {
        return this.createActivityAppletCode(item.activityId).then(code => {
          this.showPoster({
            title: app.IM.bsnUserInfo.schoolName || "",
            tips: item.activityName || "",
            code: code,
            key: item.activityId
          });
        })
      },
      createActivityAppletCode(id) {
        if (this.activityAppletCode[id]) return Promise.resolve(this.activityAppletCode[id]);
        let params = {
          "activityId": id || 0,
          "structureId": structureManage.structureInfo.classId || 0,
        }
        return this.$Http(this.$Apis.createActivityAppletCode, {
          data: {
            "activityId": params.activityId,
            "structureId": params.structureId,
            "data": {
              ...params
            }
          }
        }).then(res => {
          if (res.code) {
            this.activityAppletCode[id] = res.data || "";
            return this.activityAppletCode[id]
          }
          return Promise.reject(res);
        })
      },
      imgerror(e, img_index, index) {
        var _this = this;
        var imgChildList = _this.evalList[index];
        if (imgChildList.length > 0) {
          imgChildList[img_index].logo = this.staticAddress + this.activityIcon;
        }
        this.$forceUpdate()
      },
      showOrganizeLsit() {
        if (!this.showChangeClass) return
        let ref = "workBench";
        this.$refs[ref].loadData();
      },
      selectClass() {
        this.oragnize = app.SM.structureInfo || {};
        this.tcrUserInfo = app.IM.tcrUserInfo || {}
        this.initList()
      },
      toggleWorkBench(e) {
        if (!e && !this.oragnize.classId) {
          this._logout()
        }
      },
      showPoster(posterData) {
        let arr = [];
        let top = 84;
        arr.push({
          type: "image",
          url: posterData.code,
          css: {
            width: 448,
            height: 448,
            top,
            left: 101,
          }
        });
        top += (448 + 68);
        arr.push({
          type: "text",
          text: posterData.title.slice(0, 10),
          css: {
            textAlign: 'center',
            fontSize: 42,
            fontStyle: "bold",
            color: '#333',
            top,
            left: 0
          }
        });
        if (posterData.title.length > 10) {
          top += (42 + 8);
          arr.push({
            type: "text",
            text: this.setEllipsis(posterData.title.slice(10), 10),
            css: {
              textAlign: 'center',
              fontSize: 42,
              fontStyle: "bold",
              color: '#333',
              top,
              left: 0
            }
          });
        }
        top += (42 + 20);
        arr.push({
          type: "text",
          text: posterData.tips.slice(0, 20),
          css: {
            textAlign: 'center',
            fontSize: 24,
            fontStyle: "bold",
            color: '#333',
            top,
            left: 0
          }
        });
        if (posterData.tips.length > 20) {
          top += (24 + 8);
          arr.push({
            type: "text",
            text: this.setEllipsis(posterData.tips.slice(20), 20),
            css: {
              textAlign: 'center',
              fontSize: 24,
              fontStyle: "bold",
              color: '#333',
              top,
              left: 0
            }
          });
        }
        console.log('arrarr', arr)
        this._getRefs("poster").showModal({
          view: arr,
          key: posterData.key || ""
        })
      },
      setEllipsis(title, len) {
        let result = title;
        if (title.length > len) {
          result = title.slice(0, len - 1) + '...';
        }
        return result;
      }
    },
    onReachBottom() {
      console.log("到达底部");
      if (this.hasMore) {
        this.loadData();
      }
    }
  })
  export default pageOption
</script>

<style lang="scss" scoped>
  .work-bench-detail {
    min-height: 100vh;
    background-color: #F7F7F7;

    .bench-title {
      // top: 0;
      // left: 0;
      width: 100%;
      background: #FFFFFF;
      // 右侧胶囊固定站位100个px
      // padding-right: 110px;
      padding-left: 36rpx;
      box-sizing: border-box;
      z-index: 999;

      .organize-icon {
        width: 50rpx;
        height: 50rpx;
        margin-right: 15rpx
      }

      .change-icon {
        width: 18rpx;
        height: 18rpx;
        margin-left: 12rpx;
        /* Chrome, Safari, Opera */
        -webkit-filter: sepia(100%);
        filter: gsepia(100%);
      }

      .logout {
        width: 110rpx;
        height: 58rpx;
        background: #FAFAFA;
        border-radius: 33rpx;

        &>image {
          margin-right: 5rpx;
          width: 36rpx;
          height: 36rpx;
          line-height: 30rpx;
        }
      }
    }

    .nav-stay {
      width: 100%;
    }

    .bench-top-area {
      position: sticky;
      z-index: 1;
      padding: 33rpx 36rpx;
      background-color: #FFFFFF;

      .bench-top-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-right: 68rpx;

        .bench-top-item-image {
          width: 80rpx;
          height: 80rpx;
          border-radius: 12rpx;
          margin-bottom: 16rpx;
        }
      }
    }

    .eval-list {
      padding: 22rpx;
    }

    .img-poster {
      margin: auto;
      width: 650rpx;
      height: 816rpx;
    }

    .btn-save {
      width: 650rpx;
      height: 100rpx;
      background: $uni-main-color;
      border-radius: 16rpx;
      position: fixed;
      bottom: 48rpx;
      left: 50%;
      transform: translateX(-50%);
      font-size: 36rpx;

      &.loading {
        opacity: 0.5;
      }
    }
  }
</style>