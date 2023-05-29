<template>
  <view class="class-manage flex flex-col">
    <page-nav :full="false">
      <view slot="title">班级管理</view>
    </page-nav>
    <template v-if="showLoading">
      <view class="flex-c-c show_loading">
        <loading-view v-show="showLoading"></loading-view>
      </view>
    </template>
    <view class="flex flex-col flex1" style="overflow:hidden">
      <view class="class_info flex-b-c m-t-20">
        <view class="info_item flex-col flex-c-c">
          <view class="info_title font_22 C_7f m-b-10">班级学生</view>
          <view class="info_value font-44 bold">{{classData.totalStudentCount || 0}}</view>
        </view>
        <view class="info_item flex-col flex-c-c">
          <view class="info_title font_22 C_7f m-b-10">绑定家长</view>
          <view class="info_value font-44 bold">{{classData.totalParentCount || 0}}</view>
        </view>
      </view>
      <view class="list_title flex-b-c">
        <view class="flex-s-c">
          <image class="organize-icon shrink0" :src="requireStatic(organizeIcon)" />
          <view class="font-28 bold">{{oragnize.classFullName || ''}}学生列表</view>
        </view>
        <!-- <view class="font-20 C_B2">
          按姓名字母排序中
        </view> -->
      </view>
      <view class="teacher_list flex1 p-t-15" v-if="classData && classData.studentList.length > 0">
        <scroll-view class="scroll_view" scroll-y :scroll-into-view="scrollId" :scroll-with-animation="true">
          <view class="scroll_list">
            <!-- <view v-for="alphabetItem in alphabet" :key="alphabetItem" :id="alphabetItem"> -->
              <view class="scroll_item flex-s-c" @click="selectItem" :data-id="item.userId"
                v-for="(item,index) in classData.studentList" :key="index">
                <view class="scroll_item_icon flex-c-c font-28 C_fff shrink0">{{item.name || '未知'}}</view>
                <view class="scroll_item_info flex-c-b flex-col">
                  <view class="font-26 m-b-15 text-wrap">{{item.fullName || '未知'}}</view>
                  <view class="font-26 C_7f">{{item.parentCount > 0 ? `${item.parentCount}位家长` : '未绑定家长'}}</view>
                </view>
              </view>
            <!-- </view> -->
          </view>
        </scroll-view>
        <!-- 索引 -->
        <!-- <view class="address-list">
          <view class="address-item" @touchmove="move" @touchstart="clickIndex(item)" v-for="(item,i) in alphabet"
            :key="i">{{item}}
          </view>
        </view> -->
      </view>
      <template v-else>
        <view class="flex1 relative">
          <empty imgStyle="opacity:0.5" :showBack="false">暂无学生信息噢~</empty>
        </view>
      </template>
    </view>
  </view>
</template>

<script>
  import LoadingView from '@/components/css3/loading/loading.vue';

  const app = getApp();
  const pageOption = Page.BasePage({
    data() {
      return {
        showLoading: true,
        options: {},
        //require函数
        organizeIcon: "/organize.png",
        // 组织信息
        oragnize: {},
        classData: {},
        alphabet: [],
        resultData: {},
        scrollId: '',
        addressItemDom: {}
      };
    },
    components: {
      LoadingView
    },
    computed: {

    },
    onLoad(options) {
      this.options = options
    },
    onShow() {
      this.init()
    },
    methods: {
      init() {
        this.oragnize = app.SM.structureInfo;
        this.$Http(this.$Apis.getClazzInfo, {
          data: {
            structureId: this.oragnize.classId
          }
        }).then((res) => {
          if (res.code == 1) {
            let data = res.data;
            this.classData = data;
            // this.formatterList()
            console.log(data, "获取班级管理信息")
          }
        }).finally(() => {
          setTimeout(() => {
            this.showLoading = false
          }, 200)
        })
      },
      formatterList() {
        let studentList = this.classData.studentList || [];
        // 获得索引地址
        let alphabet = []
        studentList.forEach((item) => {
          let shortName = item.shortName.toUpperCase()
          item.shortName = shortName;
          if (shortName && alphabet.indexOf(shortName) === -1) {
            alphabet.push(shortName)
          }
        })
        alphabet.sort()

        // 将源数据按照首字母分类
        let resultData = {}
        alphabet.forEach((item, index) => {
          resultData[item] = studentList.filter((it) => {
            return it.shortName === item
          })
        });

        console.log(alphabet, resultData, "索引的例子")
        this.alphabet = alphabet;
        this.resultData = resultData;

        this.$nextTick(() => {
          //创建节点选择器
          let that = this;
          var query = uni.createSelectorQuery().in(that)
          query.select('.address-list').boundingClientRect((res) => {
            that.addressItemDom = res
          }).exec()
        })
        
        return resultData
      },
      selectItem({
        currentTarget
      }) {
        console.log(currentTarget.dataset)
        this.jumpAction(`/pages/work-bench/student-info/student-info?userId=${currentTarget.dataset.id}`)
      },
      // 索引点击
      clickIndex(item) {
        console.log('点击了', item)
        this.scrollId = item
      },
      // 索引触摸监听
      move(e) {
        var y = e.touches[0].pageY;
        var itemLen = this.alphabet.length
        var height = this.addressItemDom.height
        var top = this.addressItemDom.top
        // 滑动的偏移量（偏差值）
        var offsetTop = (height + top - y)
        var itemHeight = height / itemLen
        var index = itemLen - ((offsetTop / itemHeight) | 0) - 1
        // 超出范围直接return
        if (index < 0 || index >= itemLen) {
          return
        }
        this.scrollId = this.alphabet[index]
      }
    }
  });
  export default pageOption;
</script>

<style lang="scss">
  .show_loading {
    position: fixed;
    top: 0%;
    left: 0%;
    z-index: 9;
    width: 100%;
    height: 100vh;
    background: #FFFFFF;
  }

  .class-manage {
    width: 100%;
    height: 100vh;
  }

  .class_info {
    padding: 25rpx;

    .info_item {
      width: 343rpx;
      height: 160rpx;
      background: #FFFFFF;
      box-shadow: 0px 2px 14px 0px rgba(0, 0, 0, 0.07);
      border-radius: 10rpx;

      .info_title {
        line-height: 30rpx;
      }

      .info_value {
        line-height: 62rpx;
      }
    }
  }

  .list_title {
    margin-left: 36rpx;
    padding: 35rpx 23rpx 35rpx 0rpx;
    border-bottom: 2rpx solid #DDDDDD;

    .organize-icon {
      width: 44rpx;
      height: 44rpx;
      margin-right: 8rpx
    }
  }

  .teacher_list {
    overflow: hidden;

    .scroll_view {
      height: 100%;

      .scroll_list {
        overflow: hidden;

        .scroll_item {
          padding: 36rpx 40rpx;
          border-bottom: 1rpx solid rgba($color: #E5E5E5, $alpha: 0.5);

          .scroll_item_icon {
            width: 88rpx;
            height: 88rpx;
            background: #21B014;
            border-radius: 50%;
            margin-right: 23rpx;
          }
        }
      }
    }

    .address-list {
      position: fixed;
      right: 23rpx;
      top: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;

      &>view {
        font-size: 22rpx;
        color: #B2B2B2;
        line-height: 30rpx;
      }
    }
  }
</style>