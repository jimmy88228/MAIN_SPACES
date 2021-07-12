<template>
  <PageTopBase>
    <template v-slot:action>
      <div class="steps">
        <Steps :current="currentStep">
          <Step title="填写活动设置信息" @click.native="handleStep(0)" style="cursor: pointer;"></Step>
          <Step title="完善活动商品信息" @click.native="handleStep(1)" style="cursor: pointer;"></Step>
        </Steps>
      </div>
    </template>
    <transition-group name="fade">
      <div class="package-detail-form" v-show="showBaisc" key="basic">
        <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="140">
          <FormItem label="套餐名称" prop="package_name">
            <Input v-model="formItem.package_name" placeholder="请输入套餐名称" class="basic_input basic_input_fixed" :maxlength="30" show-word-limit/>
          </FormItem>
          <FormItem label="套餐编码" prop="package_code">
            <Input v-model="formItem.package_code" placeholder="请输入套餐编码" class="basic_input basic_input_fixed" :maxlength="30" show-word-limit/>
          </FormItem>
          <FormItem label="套餐介绍" prop="package_decription">
            <Input
              type="textarea"
              class="basic_textarea"
              v-model="formItem.package_decription"
              placeholder="请输入套餐介绍"
              :rows="3"
              :maxlength="150"
              show-word-limit/>
          </FormItem>
          <FormItem label="活动状态" prop="is_enabled">
            <i-switch size="large" v-model="formItem.is_enabled" true-value="1" false-value="0">
              <span slot="open">开启</span>
              <span slot="close">关闭</span>
            </i-switch>
          </FormItem>
          <FormItem label="活动图片" prop="package_bg_image">
            <image-edit :img="formItem.package_bg_image" @selectImg="openImagesModal('package_bg_image', formItem.package_bg_image )" @delImg="handleDelImg('package_bg_image')">
              <p class="strong_tips">图片尺寸最佳是360*360，格式为 jpg 或 png，图片大小控制在200KB</p>
            </image-edit>
          </FormItem>
          <FormItem label="活动时间" prop="validTimeRange">
            <DatePicker v-model="formItem.validTimeRange" type="datetimerange" placeholder="请选择活动时间" class="time_range" @on-change="handleTime"></DatePicker>
          </FormItem>
          <FormItem label="基础优惠">
            <Checkbox v-model="formItem.is_free_shipping" true-value="1" false-value="0">卖家承担运费（包邮）</Checkbox>
            <p class="strong_tips">此处若不勾选，则按正常运费规则计算</p>
            <Checkbox v-model="formItem.is_join_promotion" true-value="1" false-value="0">参与其他优惠</Checkbox>
            <p class="strong_tips">此处若不勾选，则套餐内商品在结算时不参与促销优惠、积分抵扣和优惠券抵扣等优惠。</p>
          </FormItem>
          <FormItem label="最少数量" prop="minimum_qty">
            <InputNumber :min="1" v-model="formItem.minimum_qty"></InputNumber>
            <label>款</label>
            <p class="strong_tips">用户在前端选择套餐子商品必须大于等于此数量才能享受套餐优惠</p>
          </FormItem>
          <FormItem label="最多数量" prop="max_qty">
            <InputNumber :min="0" v-model="formItem.max_qty"></InputNumber>
            <label>款</label>
            <p class="strong_tips">用户在前端选择套餐子商品最多允许选中的款数，0表示不限制</p>
          </FormItem>
        </Form>
      </div>
      <div v-show="!showBaisc" key="goods" class="group-activity-select-wrapper">
        <Button type="dashed" @click="handleSelect" class="basic_select">选择商品</Button>
        <goods-page-table ref="goodsTable" :goods-data="selectedData" :id-disabled="idDisabled" @get-data="handlePageData" @get-edit-data="handleEditData"></goods-page-table>
      </div>
    </transition-group>
    <template v-slot:footer>
      <Divider />
      <div style="text-align: center;">
        <Button type="default" @click="goBack">取消</Button>
        <Button type="primary" @click="confirm" v-show="currentStep === 1">保存</Button>
        <Button type="success" @click="next" v-show="currentStep === 0">下一步</Button>
        <Button type="success" @click="foward" v-show="currentStep === 1">上一步</Button>
      </div>
    </template>
    <multi-norms ref="multiNorms" title="选择可用商品" :selected="selectedData" @get-data="handleData"></multi-norms>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </PageTopBase>
</template>

<script>
import PageTopBase from '@/views/my-components/page-top-base/index';
import Control from '@/libs/page-control';
import ImageEdit from '@/views/my-components/image-edit/image-edit';
import MultiNorms from '@/views/my-components/multi-norms/index';
import GoodsPageTable from './goods-page-table';

export default {
  props: ['id'],
  components: {
    PageTopBase,
    ImageEdit,
    MultiNorms,
    GoodsPageTable
  },
  mixins: [Control],
  data () {
    const checkValidRange = (rule, value, callback) => {
      if (!value[0] && !value[1]) {
        callback(new Error('活动时间不能为空'));
      } else {
        callback();
      }
    }
    return {
      formItem: {
        package_name: '',
        package_code: '',
        package_decription: '',
        is_enabled: '0',
        package_bg_image: '',
        validTimeRange: [],
        from_date: '',
        to_date: '',
        is_free_shipping: '0',
        is_join_promotion: '',
        minimum_qty: 1,
        max_qty: 0
      },
      ruleValidate: {
        package_name: [{required: true, message: '套餐名称不能为空', trigger: 'blur'}],
        package_code: [{required: true, message: '套餐编码不能为空', trigger: 'blur'}],
        package_decription: [{required: true, message: '套餐介绍不能为空', trigger: 'blur'}],
        package_bg_image: [{required: true, message: '活动图片不能为空', trigger: 'change'}],
        validTimeRange: [{required: true, trigger: 'change', type: 'array', validator: checkValidRange}],
        minimum_qty: [{required: true, message: '最少数量不能为空', trigger: 'blur', type: 'number'}],
        max_qty: [{required: true, message: '最多数量不能为空', trigger: 'blur', type: 'number'}]
      },
      currentStep: 0,
      showBaisc: true,
      spinShow: false,
      selectedData: [],
      freezeData: []
    }
  },
  computed: {
    idDisabled() {
      return this.formItem.is_enabled === '0' ? false : true;
    }
  },
  methods: {
    loadData () {
      this.spinShow = true;
      return this.$ajax.post(this.$api.packageInfo, {
        id: this.id || 0
      })
      .then(response => {
        const res = response.data;
        if (res.code) {
          let data = res.data && res.data.items;
          if (data) {
            this.formItem = Object.assign({}, data, {
              validTimeRange: [data.from_date, data.to_date],
              minimum_qty: Number(data.minimum_qty),
              max_qty: Number(data.max_qty)
            });
            this.selectedData = data.goods_data.filter(item => {
              item.main = Number(item.is_master);
              item.request = Number(item.is_must);
              item.packageNum = Number(item.qty);
              item.get_products.forEach(item => {
                item.packagePrice = Number(item.sale_price);
                item.sortOrder = Number(item.sort);
                item.enable = Number(item.is_enabled);
              });
              return true;
            });
            this.freezeData = JSON.parse(JSON.stringify(this.selectedData));
          }
        }
        this.spinShow = false;
      });
    },
    next () {
      return this.$refs.formValidate.validate().then(valid => {
        if (valid) {
          this.currentStep = 1;
          this.showBaisc = false;
        }
      })
    },
    foward () {
      this.currentStep = 0;
      this.showBaisc = true;
    },
    handleStep (step) {
      step === 0 ? this.foward() : this.next();
    },
    goBack () {
      this.$router.go(-1);
    },
    handleTime ([from, to]) {
      this.formItem.from_date = from;
      this.formItem.to_date = to;
    },
    openImagesModal (name, url) {
      this.$selectMaterial({
        type: 'image',
        selectedData: url,
        getList: (item) => {
          this.formItem[name] = item.src;
          if (name === 'package_bg_image') this.$refs.formValidate.validateField('package_bg_image');
        }
      });
    },
    handleSelect () {
      this.$refs.multiNorms.setData().show();
    },
    handleData (data) {
      let rebuildData = data.filter(item => {
        item.get_products = item.selectedList;
        item.price = 0;
        item.packagePrice = 0;
        item.packageNum = Number(item.packageNum) || 0;
        item.main = Number(item.main) || 0;
        item.request = Number(item.request) || 0;
        item.get_products.forEach(c => {
          c.price = c.price || 0;
          c.packagePrice = c.packagePrice || 0;
          c.sortOrder = c.sortOrder || 0;
          c.enable = c.enable || 0;
        });
        return true;
      });
      this.selectedData = rebuildData;
    },
    handlePageData (data) {
      this.selectedData = data;
    },
    handleEditData (key, index, value) {
      this.selectedData[index][key] = value;
    },
    handleDelImg (name) {
      this.formItem[name] = '';
    },
    transferApi (data) {
      return data.filter(item => {
        item.is_master = Number(item.main);
        item.is_must = Number(item.request);
        item.qty = Number(item.packageNum);
        item.get_products.forEach(item => {
          item.sale_price = Number(item.packagePrice);
          item.sort = Number(item.sortOrder);
          item.is_enabled = item.enable;
        });
        return true;
      })
    },
    confirm() {
      this.$refs.goodsTable.checkValidate(tableValid => {
        this.$refs.formValidate.validate(valid => {
          if (valid && tableValid) {
            let basicP = this.formItem;
            // 组成添加，编辑，删除数组
            let addColId = [];
            let removeColId = [];
            let editColId = [];
            let addColItem = [];
            let removeColItem = [];
            let editColItem = [];
            let selectedCol = this.freezeData.map(item => item.goods_id);
            let newData = this.selectedData.map(item => item.goods_id);
            newData.forEach(item => {
              if (!selectedCol.includes(item)) {
                addColId.push(item);
              }
            });
            selectedCol.forEach(item => {
              if (!newData.includes(item)) {
                removeColId.push(item);
              }
            });
            newData.forEach(item => {
              if (![...addColId, ...removeColId].includes(item)) {
                editColId.push(item);
              }
            });
            this.selectedData.forEach(item => {
              if (addColId.includes(item.goods_id)) {
                addColItem.push(item);
              } else if (editColId.includes(item.goods_id)) {
                editColItem.push(item);
              }
            });
            this.freezeData.forEach(item => {
              if (removeColId.includes(item.goods_id)) {
                removeColItem.push(item);
              }
            })
            let params = this.id ? {
              id: this.id,
              add_goods_data: addColItem.length ? this.transferApi(addColItem) : null,
              edit_goods_data: editColItem.length ? this.transferApi(editColItem) : null,
              remove_goods_data: removeColItem.length ? this.transferApi(removeColItem) : null,
              ...basicP
            } : {
              goods_data: this.transferApi(this.selectedData),
              ...basicP
            };
            this.spinShow = true;
            return this.$ajax.post(this.id ? this.$api.packageEdit : this.$api.packageAdd, params)
            .then(response => {
              const res = response.data;
              if (res.code) {
                this.$Message.success(res.message);
                this.isGlobalLeaveTip = false;
                this.$router.go(-1);
              }
              this.spinShow = false;
            });
          }
        })
      });
    }
  },
  mounted () {
    if (this.id) this.loadData();
  }
}
</script>

<style lang="less" scoped>
.steps{
  position: absolute;
  width: 50%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.group-activity-select-wrapper{
  text-align: center;
}
.package-detail-form{
  .basic_input_fixed, .basic_textarea{
    max-width: 420px;
  }
  .time_range{
    width: 340px;
  }
}
</style>
