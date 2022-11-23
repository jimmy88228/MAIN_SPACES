<template>
  <view class="main">
    <swiper class="swiper_area" @change="swiperChange" :current="swiperCurrent">
      <swiper-item
        class="swiper_item"
        v-for="(item, index) in tabData"
        :key="index"
      >
        <ori-scroll-view
          :ref="'scroll'+index"
          :refresh="refresh"
          customStyle="height:100%;padding:30rpx;background:#F6F6F6;box-sizing: border-box;"
          @scrolltolower="scrolltolower"
          @refresherrefresh="refresherrefresh"
        >
          <!-- 这里只适用于小程序 -->
          <slot name="data{{index}}"></slot>

          <!-- 非小程序会报: v-slot不支持动态插槽名 -->
          <!-- <slot :name="'data'+index"></slot> -->
        </ori-scroll-view> 
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
import oriScrollView from "@/components/ori-comps/scroll/ori-scroll-view.vue"
const BaseComp =  Page.BaseComp({
  components: {
    oriScrollView
  },
  data() {
    return {
      swiperCurrent: 0,
      timer: null,
      refreshTimer: null,
      refreshTriggered: false,
    };
  },
  props: {
    isSwiper: {
      type: Boolean,
      default: false,
    },
    current: {
      type: Number,
      default: 0,
    },
    tabData: {
      type: Array,
      default: () => [],
    },
    listData: {
      type: Array,
      default: () => [],
    },
    refresh: {
      type: Boolean,
      default: true,
    },
  },
  watch: {
    current(n) {
      if (this.swiperCurrent != n) {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
          this.swiperCurrent = n;
        }, 350);
      }
    },
  },
  methods: {
    swiperChange(e) {
      let detail = e.detail || {};
      let current = detail.current;
      this.$emit("swiperChange", { current });
    },
    scrolltolower() {
      this.$emit("scrolltolower", { current: this.swiperCurrent });
    },
    refresherrefresh() {
      this.$emit("refresherrefresh", { current: this.swiperCurrent });
    }, 
    refreshEnd(){ 
      let ref = 'scroll' + this.swiperCurrent;
      this.getRefs(ref).refreshEnd && this.getRefs(ref).refreshEnd();
    },
    refreshShow(){
      let ref = 'scroll' + this.swiperCurrent;
      this.getRefs(ref).refreshShow && this.getRefs(ref).refreshShow();
    },
  },
});
export default BaseComp
</script>

<style lang="scss" scoped>
.main {
  height: 100%;
  .swiper_area {
    height: 100%;
  }
}
</style>