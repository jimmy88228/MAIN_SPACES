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
        <img-gallery :img-list="imgList" @handle-list="handleList" @del-item="handleItem">
          <template v-slot:tips>
            <span style="color: red;">图片建议尺寸：800*500/500*800</span>
          </template>
        </img-gallery>
      </div>
    </Card>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>

<script>
import ImgGallery from '@/views/my-components/img-gallery/index';

export default {
  components: {
    ImgGallery
  },
  data () {
    return {
      spinShow: false,
      type: '0',
      imgList: []
    }
  },
  methods: {
    loadData () {
      this.spinShow = true;
      return this.$ajax.post(this.$api.userBgList)
      .then(response => {
        const res = response.data;
        if (res.code) {
					let data = res.data || {};
          this.imgList = data.list || [];
          this.type = data.items && data.items.cfg_value;
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
      return this.$ajax.post(this.$api.userBgSave, {
        img: this.imgList,
        cfg_value: this.type
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
