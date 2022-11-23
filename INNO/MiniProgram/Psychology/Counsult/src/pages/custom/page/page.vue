<template>
  <view>
    <custom-page v-if="!empty" :holdNav="true" ref="customPageRef"></custom-page>
    <template v-else>
      <page-nav></page-nav>
      <view class="empty">
      </view>
    </template>
  </view>
</template>

<script>
const app = getApp();
const pageOption = Page.BasePage({
  data() {
    return {
      options: {},
      empty:false,
    };
  },
  onLoad(options) {
    this.options = options || {};
  },
  methods: {
    init(){
      let options = this.options||{};
      let page_id = options.page_id || 0;
      let getData = null;
      if(page_id>0){
        getData = ()=>this.getPageDetail(page_id);
      }else if(options.type == 'psycHandbook'){ 
        getData = ()=>this.getPsycHandbook();
      };
      getData && getData().then(res=>{
        if (res.code == 1) {
          let data = res.data;
          if(!data){
            this.empty = true;
            return res;
          }
          this.$refs["customPageRef"].initData(data);
        }else{
          this.empty = true;
        }
        return res;
      }).catch(e=>{
        this.empty = true;
        setTimeout(() => {
          this.backAction();
        }, 1500);
      })
    },
    getPageDetail(pageId) {
      return this.$Http(this.$Apis.getTargetDetail, {
        data: {
          pageId
        },
        other: {
          isShowLoad: true,
        },
      })
      // .then((res) => {
      //   if (res.code == 1) {
      //     let data = res.data || {};
      //     this.$refs["customPageRef"].initData(data);
      //   }
      // })
      // .catch((err) => {
      //   setTimeout(() => {
      //     this.backAction();
      //   }, 1500);
      // });
    },
    getPsycHandbook(){
      return this.$Http(this.$Apis.getPsycHandbook, {
        data: {}, 
      })
    },
  },
  onShow() {
    this._checkLogin().then((login) => {
      if (!login) return;
      this.init();
    });
  },
});
export default pageOption;
</script>

<style lang="scss">
.empty{
  min-height: 50vh;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #7f7f7f;
  font-size: 30rpx;
  &::after{
    content: "敬请期待";
  }
}
</style>
