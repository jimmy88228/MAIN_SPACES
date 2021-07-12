<template>
  <div class="qrcode">
    <Card>
      <div class="header">
        <Button type="primary" @click="confirm">保存</Button>
      </div>
      <div class="content">
        <div class="wrapper">
          <label class="title">显示控制</label>
          <RadioGroup v-model="type">
            <Radio label="0">不限</Radio>
            <Radio label="1">仅公众号二维码</Radio>
            <Radio label="2">仅小程序二维码</Radio>
          </RadioGroup>
        </div>
        <img-gallery :img-list="imgList" limit-len="9" @handle-list="handleList" @del-item="handleItem">
          <template v-slot:tips>
            <span style="color: red;">图片建议尺寸：800*500/500*800</span>
          </template>
        </img-gallery>
        <template v-if="showPlaceOrder">
          <titleBar>代客下单</titleBar>
          <Form ref="formValidate" :model="formItem" :label-width="240">
            <FormItem :label="item.name" v-for="(item, key) in placeOrderOptions" :key="key">
              <i-switch v-model="formItem[key]" true-value="1" false-value="0" v-if="item.type === 'switch' && item.isShow" size="large">
                <span slot="open">{{item.option.open}}</span>
                <span slot="close">{{item.option.close}}</span>
              </i-switch>
              <Input v-model="formItem[key]" type="number" placeholder="请输入时间" style="width: 100px;" v-if="item.type === 'number' && item.isShow"/>
              <span>{{item.desc}}</span>
            </FormItem>
          </Form>
        </template>
      </div>
      <Spin size="large" fix v-if="spinShow"></Spin>
    </Card>
  </div>
</template>

<script>
import ImgGallery from '@/views/my-components/img-gallery/index';
import titleBar from '@/views/my-components/title-bar/title-bar';

export default {
  components: {
    ImgGallery,
    titleBar
  },
  data () {
    return {
      spinShow: false,
      type: '0',
      imgList: [],
      formItem: {
        valet_order_use_integral: '0',
        valet_order_use_offsurplus: '0',
        valet_order_need_sms: '1',
        valet_order_sms_time: 0,
        valet_order_sms_interval: 0
      },
      showPlaceOrder: false,
      placeOrderOptions: {}
    }
  },
  methods: {
    loadData () {
      this.spinShow = true;
      return this.$ajax.post(this.$api.staffBgList)
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.imgList = res.data && res.data.items;
          this.type = res.data && res.data.my_qrcode_create_type;
          this.showPlaceOrder = res.data && !!Number(res.data.is_valet_order);
          this.placeOrderOptions = res.data && res.data.valet;
          for (let key in this.formItem) {
            this.formItem[key] = this.placeOrderOptions[key].val;
          }
        }
        this.spinShow = false;
      });
    },
    handleList (list) {
      this.imgList = list;
    },
    handleItem (index) {
      this.imgList.splice(index, 1);
    },
    confirm () {
      this.spinShow = true;
      return this.$ajax.post(this.$api.staffBgSave, {
        items: this.imgList,
        valet: this.formItem,
        my_qrcode_create_type: this.type
      })
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.$Message.success(res.message);
        }
        this.spinShow = false;
      });
    }
  },
  mounted () {
    this.loadData();
  }
}
</script>

<style lang="less" scoped>
.qrcode{
  .header{
    text-align: right;
  }
  .content{
    .wrapper{
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      .title{
        margin-right: 10px;
      }
    }
  }
}
</style>
