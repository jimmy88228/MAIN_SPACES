<style lang="less">
.user-center-header-view{
  border-bottom: 4px solid #eee;

  .header-box{
    background: center center no-repeat #eee;
    background-size: 100% auto;
    min-height: 100px;
  }

  .avatar{
    position: absolute;
    left:10px;
    top:40px;
  }
  .user-qrcode{
    position: absolute;
    right:0;
    top:0;
  }
  .dynamic-code{
    position: absolute;
    right:0;
    top:70px;
  }
  .barcode-box{
    padding:10px 5px;
    .txt{
      font-size:12px;
      text-align: center;
    }
  }
}
</style>

<template>
	<div class="user-center-header-view" >

    <div class="header-box" :style="{'background-image':'url('+info.header_bg+')'}">
      <Row type="flex" class="avatar" align="middle" :gutter="8">
        <Col style="width:60px;"><Avatar icon="ios-person" size="50" /></Col>
        <Col style="flex:1 1 0%;">
          <div>会飞的鱼</div>
          <div style="font-size:12px">vip会员</div>
        </Col>
      </Row>
    </div>
    <div v-show="info.myQRcode" class="barcode-box">
      <img :src="imgHost+'/../image/show/assets-images-buildcode.png'" style="width:100%;height:auto;" />
      <div class="txt">
        <span v-if="info.barcode_card==1">18012345678</span>
        <span v-else-if="info.barcode_card==0">VIP88888</span>
        <span v-else-if="info.barcode_card==2">VIP99999</span>
      </div>
    </div>
    <Icon v-show="info.user_qrcode" class="ionmy ion-my-qrcode user-qrcode" size="25"></Icon>
    <img v-show="info.dynamicCode" :src="imgHost+'/../image/show/assets-icons-dynamicCode.png'" class="dynamic-code" />
	</div>
</template>

<script>
/**
 * 我的资产 条（个人中心） - 组件
 */
export default {
  name: 'assetsBarView',
  components: {

  },
  props: {
    currIndex: {
      type: [Number, String],
      default: 0
    }
  },
  data () {
	    return {
      info: {},
      dataList: [],

      imgHost: '',
    }
  },
  computed: {

  },
  methods: {
    init () {
      this.dataList = this.$store.state.app.pageCompList;
      this.info = this.dataList[this.currIndex].setting;

      this.imgHost = this.$util.apiHost;
    }
  },
  mounted () {
	    this.init();
  }
}
</script>
