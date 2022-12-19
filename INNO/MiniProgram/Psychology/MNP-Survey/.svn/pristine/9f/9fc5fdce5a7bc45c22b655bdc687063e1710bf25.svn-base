<template>
  <view class="message-box flex flex-col" :style="isEmpty ? 'background-color: #fff;' : ''">
    <page-nav :full="false">
      <view slot="custom-content">消息列表</view>
    </page-nav>
    <template v-if="!isEmpty">
      <view v-for="(pgItem,pgIndex) in list" :key="pgIndex">
        <view class="message_item" v-for="(item,i) in pgItem" :key="i">
          <view class="flex-c-c"><text class="message_create_time flex-c-c">{{item.messageItemDate}}</text></view>
          <view class="message_item_info">
            <view class="message_item_title flex-s-c">
              <image class="protect_icon m-r-25" :src="requireStatic(protectIcon)" />
              <view class="font-26 bold">绑定验证</view>
            </view>
            <view class="message_item_content">{{item.messageContent}}</view>
            <view class="button_group flex-c-c">
              <template v-if="item.messageState != 2">
                <view v-if="item.state == 2" class="font-28 C_B2">已拒绝</view>
                <view v-if="item.state == 1" class="font-28 C_B2">已同意</view>
                <view v-if="item.state == 0" class="button_group_two flex-b-c">
                  <view class="button_group_item font-28 flex1 flex-c-c C_7f" :data-apply="0" :data-pg-index="pgIndex"
                    :data-item="item" @click="controlBind">拒绝</view>
                  <view class="button_splite"></view>
                  <view class="button_group_item font-28 flex1 flex-c-c" :data-apply="1" :data-pg-index="pgIndex"
                    :data-item="item" @click="controlBind">同意</view>
                </view>
              </template>
              <template v-else>
                <view class="font-28 C_B2">已失效</view>
              </template>
            </view>
          </view>
        </view>
      </view>
    </template>
    <template v-else>
      <empty :showBack="false">暂无消息哦~</empty>
    </template>
  </view>
</template>

<script>
  const app = getApp();
  const pageOption = Page.BasePage({
    data() {
      return {
        protectIcon: "class-manage/protect.png",
        isEmpty: false,
        list: [],
        pageIndex: 0,
        pageSize: app.Conf.PAGE_SIZE,
        hasMore: true,
        isEmpty: false,
      };
    },
    components: {},
    computed: {},
    onLoad(options) {
      this.options = options
    },
    onReady() {
      this.loadData()
    },
    methods: {
      loadData() {
        let pageIndex = this.pageIndex ? this.pageIndex + 1 : 1
        return this.$Http(this.$Apis.getBindMessageList, {
          data: {
            pageIndex: pageIndex,
            pageSize: this.pageSize
          }
        }).then(res => {
          if (res.code == 1) {
            let data = res.data || {};
            let baseListResp = data.baseListResp || {};
            // 格式化获取回来的列表
            let list = this.formatMessage(baseListResp.list) || []

            this.pageIndex = pageIndex;
            let currPage = pageIndex - 1 ? pageIndex - 1 : 0;
            this.list[currPage] = list || [];
            this.hasMore = this.pageIndex * this.pageSize < baseListResp.totalCount;
            this.setEmpty(this.list);

            return data
          }
        })
      },
      controlBind({
        currentTarget
      }) {
        let item = currentTarget.dataset.item;
        let messageId = item.messageId || 0;
        let recordId = item.recordId || 0;
        let apply = currentTarget.dataset.apply;

        return this.$Http(this.$Apis.applyBind, {
          data: {
            messageId,
            recordId,
            state: apply
          }
        }).then(res => {
          if (res.code == 1) {
            let pgIndex = currentTarget.dataset.pgIndex
            this.pageIndex = pgIndex || 0;
            this.loadData()
          }
        })
      },
      formatMessage(list) {
        if (Object.prototype.toString.call(list) === '[object Array]' && list.length > 0) {
          list.forEach((item, i) => {
            let date = new Date()
            let nowWeek = date.getDay()
            let messageItemDate = "";
            let createTime = item.createTime;
            let formatTime = createTime.slice(11, 16)
            let fullDate = createTime.slice(0, 10);
            let fullDateStamp = new Date(fullDate).getTime();
            let fullDateWeek = new Date(fullDate).getDay();
            if (this.checkLastWeek(fullDateStamp) == true) {
              messageItemDate = fullDate + ' ' + formatTime
            } else {
              let weekDay = this.formatterWeekDay(fullDate)
              if (fullDateWeek == nowWeek) {
                messageItemDate = formatTime
              } else {
                messageItemDate = weekDay + ' ' + formatTime
              }
            }
            item.messageItemDate = messageItemDate;

            // 匹配手机号添加**
            let messageContent = item.messageContent || '';
            if (messageContent) {
              let reg = /1[2-9]{1}\d{9}/g;
              item.messageContent = messageContent.replace(reg, this._phoneEllipsis(reg.exec(
                messageContent)[0]))
            }
          })
          return list
        } else {
          return []
        }
      },
      // 检查日期是否为上星期
      checkLastWeek(checkStamp) {
        // 当天
        let nowDate = new Date();
        // 24小时毫秒数
        let dayStamp = 24 * 60 * 60 * 1000;
        let nowDay = nowDate.getDay() == 0 ? 7 : nowDate.getDay();
        // 前n天
        let preDate = new Date(nowDate.getTime() - nowDay * dayStamp).getTime();
        if (checkStamp < preDate) {
          return true
        } else {
          return false
        }
      },
      formatterWeekDay(time) {
        const weekNum = new Date(time).getDay();
        let week = "";
        switch (weekNum) {
          case 0:
            week = "周日";
            break;
          case 1:
            week = "周一";
            break;
          case 2:
            week = "周二";
            break;
          case 3:
            week = "周三";
            break;
          case 4:
            week = "周四";
            break;
          case 5:
            week = "周五";
            break;
          case 6:
            week = "周六";
            break;
        }
        return week;
      },
      setEmpty(data) {
        if (data instanceof Array) {
          if (data.length == 0 || !data[0] || (data[0] && data[0].length == 0)) {
            this.isEmpty = true;
          } else {
            this.isEmpty = false;
          }
        } else {
          this.isEmpty = false
        }
      }
    },
    onReachBottom() {
      console.log(this.hasMore, "到达底部")
      if (this.hasMore) {
        console.log("获取更多")
        this.loadData();
      }
    },
    onShow() {

    },
  });
  export default pageOption;
</script>

<style lang="scss">
  .message-box {
    width: 100%;
    min-height: 100vh;
    box-sizing: border-box;
    padding-bottom: 26rpx;
    background: #EFEFEF;
  }

  .message_item {


    .message_create_time {
      margin: 26rpx auto;
      background: #D8D8D8;
      border-radius: 19rpx;
      min-width: 130rpx;
      height: 40rpx;
      color: #FFFFFF;
      font-size: 22rpx;
      padding: 0 12rpx;
    }

    .message_item_info {
      margin: 0 auto;
      width: 680rpx;
      background: #FFFFFF;
      border-radius: 16rpx;

      .message_item_title {
        padding: 38rpx 42rpx 30rpx;

        .protect_icon {
          width: 60rpx;
          height: 60rpx;
        }
      }

      .message_item_content {
        padding: 0 42rpx 37rpx;
        line-height: 40rpx;
      }

      .button_group {
        border-top: 1rpx solid rgba($color: #979797, $alpha: 0.1);
        width: 100%;
        height: 108rpx;

        .button_splite {
          width: 2rpx;
          height: 39rpx;
          opacity: 0.1;
          background: #979797;
        }

        .button_group_two {
          width: 100%;
          height: 100%;

          .button_group_item {
            height: 100%;
            flex: 1;
          }
        }
      }
    }

  }
</style>