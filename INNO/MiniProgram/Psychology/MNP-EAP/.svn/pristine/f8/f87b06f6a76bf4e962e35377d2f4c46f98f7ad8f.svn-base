<template>
  <view class="course-list-page" :style="isEmpty ? 'background-color: #fff;' : ''">
      <page-nav :isCustomContent="true">
        <view slot="custom-content">课程列表</view>
      </page-nav>
    <template v-if="!isEmpty">
      <view class="course-list">
        <view v-for="(pageItem,pageIndex) in evalList" :key="pageIndex">
          <courseItem @learnNow="learnNow(item,i,pageIndex)" :itemInfo="item" v-for="(item,i) in pageItem" :key="i">
          </courseItem>
        </view>
      </view>
    </template>
    <template v-else>
      <empty>暂无相关课程内容噢～</empty>
    </template>
  </view>
</template>

<script>
  import Conf from '@/config/config.js'
  import courseItem from './components/course-item.vue'

  const pageOption = Page.BasePage({
    data() {
      return {
        isEmpty: false,
        pageIndex: 0,
        pageSize: Conf.PAGE_SIZE,
        evalList: [],
        hasMore: true,
      }
    },
    components: {
      courseItem
    },
    onReady() {
      this.initList()
    },
    onShow() {
      if (this.clickPage) {
        this.pageIndex = this.clickPage - 1 || 0;
        this.loadData();
      }
    },
    onReachBottom() {
      console.log("到达底部");
      if (this.hasMore) {
        this.loadData();
      }
    },
    methods: {
      initList() {
        this.evalList = [];
        this.pageIndex = 0;
        this.hasMore = true;
        this.isEmpty = false;
        this.loadData();
      },
      checkPIndex(pIndex) {
        if (pIndex) {
          this.clickPage = pIndex || 0
        } else {
          this.clickPage = this.pageIndex
        }
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
        this.jumpAction(`/pages/course/course-details/course-details?courseActivityId=${id}`)
      },
      loadData() {
        let pageIndex = this.pageIndex ? this.pageIndex + 1 : 1;
        let api = 'selectCourseListByPage';
        let params = {
          pageIndex: pageIndex,
          pageSize: this.pageSize,
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
    },
    watch: {}
  });
  export default pageOption;
</script>

<style lang="scss" scoped>
  .course-list-page {
    min-height: 100vh;
    background-color: #F7F7F7;
  }

  .course-list {
    padding: 22rpx;
  }
</style>