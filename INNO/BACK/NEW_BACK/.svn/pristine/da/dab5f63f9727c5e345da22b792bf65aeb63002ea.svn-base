<template>
  <div class="recycle-order-info">
    <Card>
      <order-details
        :data="data"
        :sn="sn"></order-details>
      <goods-details
        :data="data"></goods-details>
      <!--加载提示-->
      <Spin size="large" fix v-if="spinShow"></Spin>
    </Card>
  </div>
</template>

<script>
import OrderDetails from './order-details';
import GoodsDetails from './goods-details';

export default {
  props: ['sn'],
  data () {
    return {
      spinShow: false,
      data: {}
    }
  },
  components: {
    OrderDetails,
    GoodsDetails
  },
  mounted () {
    this.loadData();
  },
  methods: {
    loadData() {
      this.spinShow = true;
      return this.$ajax.post(this.$api.groupOrderView, {
        id: this.sn
      }).then(response => {
        const res = response.data;
        if (res.code) {
          this.spinShow = false;
          let {
            items
          } = res.data;
          this.data = items;
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.recycle-order-info{
  .order_title{
    display: flex;
    align-items: center;
    .order-form_back{
      margin-right: 20px;
    }
  }
  .order_header{
    border: 1px solid #ddd;
    padding: 5px;
    border-radius: 5px;
    .order_header_inner{
      display: flex;
      align-items: center;
      .order_intro{
        border-right: 1px solid #ddd;
        padding-right: 5px;
        .order_status{
          font-size: 14px;
        }
        .order_handle{
          margin-top: 10px;
          .btn{
            margin-right: 4px;
          }
        }
        .hor_divider{
          margin: 10px 0;
        }
      }
      .order_steps{
        padding-left: 5px;
      }
    }
  }
}
</style>
<style lang="less">
.order-info{
  .ivu-form-item{
    margin-bottom: 0;
  }
}
</style>
