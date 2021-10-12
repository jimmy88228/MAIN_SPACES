<template>
  <div>
    <Modal
      class="manager-form"
      v-model="modalShow"
      :title="modalTitle"
      :loading="modalLoading"
      :mask-closable="false"
      @on-ok="confirm">
      <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="100">
        <FormItem label="水印分类" prop="watermark_cat">
          <Select v-model="formItem.watermark_cat">
            <Option v-for="(value, name) in watermarkCat" :value="name" :key="name">{{value}}</Option>
          </Select>
        </FormItem>
        <FormItem label="水印名称" prop="watermark_name">
          <Input v-model="formItem.watermark_name" placeholder="请输入水印名称"></Input>
        </FormItem>
        <FormItem label="水印图片" prop="logo" class="mark_pic">
          <image-edit :img="formItem.logo" @selectImg="openImagesModal('logo', formItem.logo )" @delImg="handleDelImg">
            <p>支持png格式，大小不超过2M。</p>
          </image-edit>
        </FormItem>
        <FormItem label="获取商品" prop="watermark_goods_sn">
          <Input v-model="formItem.watermark_goods_sn" type="textarea" v-if="formItem.watermark_goods_sn" class="manager-form_sn"/>
          <Button type="dashed" @click="onSelectGoods"> 选择商品</Button>
        </FormItem>
        <FormItem label="自动打印时间" prop="getDateRange">
          <DatePicker
              type="datetimerange"
              placeholder="请选择日期"
              :value="formItem.getDateRange"
              :options="disableRange"
              @on-change="handleChange"></DatePicker>
          <p class="strong_tips">每天凌晨自动更新</p>
        </FormItem>
        <FormItem label="自动清除水印时间" prop="expiredTime">
          <DatePicker
              type="datetime"
              placeholder="请选择日期"
              :value="formItem.expiredTime"
              @on-change="handleExpiredChange"></DatePicker>
        </FormItem>
      </Form>
    </Modal>

    <!--绑定微商品的选择器-->
    <goodsSelect ref="goods-select" @on-ok="onGoodsSelectOk"></goodsSelect>
  </div>
</template>
<script>
import goodsSelect from '@/views/my-components/goods-select/goods-select';
import util from '@/libs/util.js';
import ImageEdit from '@/views/my-components/image-edit/image-edit';

export default {
  components: {
    goodsSelect,
    ImageEdit
  },
  data () {
    return {
      modalShow: false,
      modalTitle: '',
      modalLoading: true,
      formItem: {
        logo: '',
        watermark_name: '',
        watermark_cat: '',
        watermark_goods_sn: '',
        cron_start_time: '',
        cron_end_time: '',
        getDateRange: [],
        expiredTime: '',
        watermarkGoods: []
      },
      // 表单数据规则
      ruleValidate: {
        watermark_cat: [
          { required: true, message: '水印分类必须选择', trigger: 'change' }
        ],
        watermark_name: [
          { required: true, message: '水印名称必须填写', trigger: 'blur' }
        ],
        logo: [
          { required: true, message: '水印图片必须上传', trigger: 'change' }
        ]
      },
      watermarkCat: null,
      disableRange: {
        disabledDate (date) {
          return date && date.valueOf() < Date.now() - 3600 * 1000 * 24;
        }
      },
      selectObj: null
    }
  },
  methods: {
    handleDelImg () {
      this.formItem.logo = '';
    },
    confirm () {
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          // ajax 保存数据，头像是通过字符串的形式上传的
          this.$ajax.post((this.formItem.id === 0 ? this.$api.goodsWatermarkWaterAdd : this.$api.goodsWatermarkWaterEdit), {
            id: this.formItem.id,
            watermark_name: this.formItem.watermark_name,
            watermark_cat: this.formItem.watermark_cat,
            watermark_goods_sn: this.formItem.watermark_goods_sn,
            cron_start_time: this.formItem.cron_start_time,
            cron_end_time: this.formItem.cron_end_time,
            watermark_url: this.formItem.logo,
            expired_time: this.formItem.expiredTime
          })
          .then((response) => {
            var res = response.data;

            if (res.code) {
              // 保存成功
              this.$Message.success(res.message);
              this.modalShow = false;

              // 把数据返回给父级
              this.$emit('on-success', {
                type: this.formItem.id === 0 ? 'add' : 'edit',
                  data: res.data
              });
            } else {
              this.modalShow = true;
              this.modalLoading = false;

              setTimeout(() => {
                this.modalLoading = true;
              }, 50);
            }
        });
        } else {
          // 验证失败，不关闭模态框
          this.moodalShow = true;
          this.modalLoading = false;

          setTimeout(() => {
            this.modalLoading = true;
          }, 50);
        }
      });
    },
    // 打开模态框
    openModal (row, watermarkCat) {
      this.watermarkCat = watermarkCat;
      this.modalShow = true;

      // 重置表单
      this.$refs.formValidate.resetFields();

      // 初始化表单数据
      this.formItem.id = typeof (row.id) !== 'undefined' ? Number(row.id) : 0;
      if (this.formItem.id === 0) {
        this.modalTitle = '添加水印图片';
      } else {
        this.modalTitle = '编辑水印图片';
        this.formItem.logo = row.watermark_url;
        this.formItem.watermark_name = row.watermark_name;
        for (const key in watermarkCat) {
          if (watermarkCat[key] == row.watermark_cat) this.formItem.watermark_cat = key;
        }
        this.formItem.watermark_goods_sn = row.watermark_goods_sn;
        this.formItem.cron_start_time = row.cron_start_time;
        this.formItem.cron_end_time = row.cron_end_time;
        this.formItem.watermarkGoods = row.watermark_goods_mess;
        this.formItem.expiredTime = row.expired_time;
        const startTime = util.format(new Date(row.cron_start_time), 'yyyy-MM-dd hh:mm:ss');
        const endTime = util.format(new Date(row.cron_end_time), 'yyyy-MM-dd hh:mm:ss');
        this.formItem.getDateRange = [startTime, endTime];
        // const snObj = row.watermark_goods_sn.split(',');
      }
    },
    // 调起图片选择器
    openImagesModal (name, url) {
      let that = this;
      this.$selectMaterial({
        type: 'image',
        selectedData: url,
        getList (item) {
          that.$set(that.formItem, name, item.src);
          that.$refs.formValidate.validateField('logo');
        }
      });
    },
    // 选择商品
    onSelectGoods () {
      let selectedItem = [];
      if (this.formItem.watermark_goods_sn && this.formItem.watermarkGoods) {
        selectedItem = this.formItem.watermarkGoods;
      }
      this.$refs['goods-select'].openModal(selectedItem, 'checkbox');
    },
    // 商品选择的，回调
    onGoodsSelectOk (goods) {
      const snCollection = [];
      goods.forEach(item => {
        snCollection.push(item.goods_sn);
      });
      this.formItem.watermark_goods_sn = snCollection.join(',');
    },
    handleChange (date) {
      this.formItem.cron_start_time = date[0];
      this.formItem.cron_end_time = date[1];
    },
    handleExpiredChange (date) {
      this.formItem.expiredTime = date;
    }
  }
}
</script>
<style lang="less">
.manager-form{
  .update_tip{
    color: red;
  }
  .manager-form_sn{
    margin-bottom: 10px;
  }
}
</style>
