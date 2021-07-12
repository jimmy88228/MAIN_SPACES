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
      <div class="time-limit-form" v-show="showBaisc" key="basic">
        <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="140" v-friendly-errors>
          <FormItem label="活动名称" prop="issue_name">
            <Input v-model="formItem.issue_name" placeholder="请输入活动名称" class="basic_input basic_input_fixed" :maxlength="30" show-word-limit/>
          </FormItem>
          <FormItem label="活动时间" prop="validTimeRange">
            <DatePicker v-model="formItem.validTimeRange" type="datetimerange" placeholder="请选择活动时间" class="time_range" @on-change="handleTime"></DatePicker>
          </FormItem>
          <FormItem label="是否允许使用积分" prop="can_use_point">
            <i-switch v-model="formItem.can_use_point" true-value="1" false-value="0">
              <span slot="open">是</span>
              <span slot="close">否</span>
            </i-switch>
          </FormItem>
          <FormItem label="是否允许使用优惠券" prop="can_use_bonus">
            <i-switch v-model="formItem.can_use_bonus" true-value="1" false-value="0">
              <span slot="open">是</span>
              <span slot="close">否</span>
            </i-switch>
          </FormItem>
          <FormItem label="享受优惠会员等级" prop="user_ranks">
            <Select v-model="formItem.user_ranks" multiple class="basic_select">
              <Option v-for="item in levelList" :value="item.rank_id" :key="item.rank_id">{{ item.rank_name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="活动页面背景图片" prop="background_image">
            <image-edit :img="formItem.background_image" @selectImg="openImagesModal('background_image', formItem.background_image )" @delImg="handleDelImg('background_image')">
              <p class="strong_tips">活动图片宽度会自动满屏显示，图片尺寸最佳是360*180，格式为 jpg 或 png，图片大小控制在200KB</p>
            </image-edit>
          </FormItem>
          <FormItem label="活动页面标题图片" prop="title_image">
            <image-edit :img="formItem.title_image" @selectImg="openImagesModal('title_image', formItem.title_image )" @delImg="handleDelImg('title_image')">
              <p class="strong_tips">活动图片宽度会自动满屏显示，图片尺寸最佳是360*180，格式为 jpg 或 png，图片大小控制在200KB</p>
            </image-edit>
          </FormItem>
          <FormItem label="备注说明" prop="remark">
            <Input
              type="textarea"
              class="basic_textarea"
              v-model="formItem.remark"
              placeholder="请输入备注说明"
              :rows="3"
              :maxlength="150"
              show-word-limit/>
          </FormItem>
          <FormItem label="微信分享图片" prop="pic_path">
            <image-edit :img="formItem.pic_path" @selectImg="openImagesModal('pic_path', formItem.pic_path )" @delImg="handleDelImg('pic_path')">
              <p class="strong_tips">图片尺寸最佳是360*360，格式为 jpg 或 png，图片大小控制在200KB</p>
            </image-edit>
          </FormItem>
          <FormItem label="微信分享标题" prop="share_title">
            <Input v-model="formItem.share_title" placeholder="请输入微信分享标题" class="basic_input basic_input_fixed" :maxlength="30" show-word-limit/>
          </FormItem>
          <FormItem label="微信分享说明" prop="share_desc">
            <Input
              type="textarea"
              class="basic_textarea basic_textarea"
              v-model="formItem.share_desc"
              placeholder="请输入微信分享说明"
              :rows="3"
              :maxlength="150"
              show-word-limit/>
          </FormItem>
        </Form>
      </div>
      <div v-show="!showBaisc" key="goods" class="group-activity-select-wrapper">
        <Button type="dashed" @click="handleSelect" class="basic_select">选择商品</Button>
        <goods-page-table
          ref="goodsTable"
          :goods-data="selectedData"
          @get-data="handlePageData"
          @del-good-item="handleDelGood"
          @del-norm-item="handleDelNorm"></goods-page-table>
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
    <Spin size="large" fix v-if="spinShow"></Spin>
    <multi-norms ref="multiNorms" title="选择可用商品" :selected="selectedData" :extra="extraCondition" @get-data="handleData"></multi-norms>
  </PageTopBase>
</template>

<script>
import PageTopBase from '@/views/my-components/page-top-base/index';
import ImageEdit from '@/views/my-components/image-edit/image-edit';
import EditSort from '@/views/my-components/edit-sort/edit-sort';
import MultiNorms from '@/views/my-components/multi-norms/index';
import GoodsPageTable from './goods-page-table';
import Control from '@/libs/page-control';
import goodsSelect from './goods-select';

export default {
  props: ['id'],
  provide () {
    return {
      formInstance: this
    }
  },
  components: {
    PageTopBase,
    ImageEdit,
    EditSort,
    goodsSelect,
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
        issue_name: '',
        validTimeRange: [],
        can_use_point: '0',
        can_use_bonus: '0',
        user_ranks: [],
        background_image: '',
        title_image: '',
        remark: '',
        pic_path: '',
        share_title: '',
        share_desc: '',
        goodsSelect: [],
        goodsSpecSelect: []
      },
      selectedData: [],
      ruleValidate: {
        issue_name: [{required: true, message: '活动名称不能为空', trigger: 'blur'}],
        validTimeRange: [{required: true, trigger: 'change', type: 'array', validator: checkValidRange}],
        user_ranks: [{required: true, trigger: 'change', type: 'array', min: 1, message: '会员等级不能为空'}],
        background_image: [{required: true, message: '活动页面背景图片不能为空', trigger: 'change'}],
        title_image: [{required: true, message: '活动页面标题图片不能为空', trigger: 'change'}]
      },
      spinShow: false,
      currentStep: Number(this.$route.query.step),
      showBaisc: true,
      levelList: [],
      freezeData: [],
      goodsEditData: [],
      extraCondition: {
        is_on_sale: 1 //限时特惠商品必须上架
      }
    }
  },
  methods: {
    handleTime (date) {
      this.formItem.validTimeRange = date;
    },
    loadData () {
      this.spinShow = true;
      return this.$ajax.post(this.$api.timeLimitActivityInfo, {
        id: this.id || 0
      })
      .then(response => {
        const res = response.data;
        if (res.code) {
          let data = res.data && res.data.info;
          let levelList = res.data && res.data.rank;
          this.levelList = levelList;
          if (data) {
            this.formItem = Object.assign({}, data, {
              validTimeRange: [data.stime, data.etime],
              user_ranks: data.user_ranks.map(Number)
            });
            this.selectedData = data.goods_data.items.filter(item => {
              item.perOrder = Number(item.per_order_qty);
              item.perUser = Number(item.per_user_qty);
              item.sortOrder = Number(item.sort_order);
              item.get_products.forEach(item => {
                item.discountPrice = Number(item.seckill_price);
                item.limitNumber = Number(item.limit_qty);
              });
              return true;
            });
            this.freezeData = JSON.parse(JSON.stringify(this.selectedData));
          }
        }
        this.spinShow = false;
      });
    },
    openImagesModal (name, url) {
      this.$selectMaterial({
        type: 'image',
        selectedData: url,
        getList: (item) => {
          this.formItem[name] = item.src;
          this.$refs.formValidate.validateField(name);
        }
      });
    },
    handleDelImg (name) {
      this.formItem[name] = '';
    },
    handleSelect () {
      this.$refs.multiNorms.setData().show();
    },
    handleSpecData (specData) {
      this.formItem.goodsSpecSelect = specData;
    },
    handleClear () {
      this.formItem.goodsSelect = [];
    },
    next () {
      return this.$refs.formValidate.validate().then(valid => {
        if (valid) {
          this.currentStep = 1;
        }
      })
    },
    foward () {
      this.currentStep = 0;
    },
    handleStep (step) {
      step === 0 ? this.foward() : this.next();
    },
    goBack () {
      this.$router.go(-1);
    },
    handleData (data) {
      let rebuildData = data.filter(item => {
        item.get_products = item.selectedList;
        return true;
      });
      this.selectedData = rebuildData;
    },
    handlePageData (data) {
      let flatten = data.reduce((acc, item) => {
        return acc.concat(item);
      }, []);
      this.goodsEditData = flatten;
    },
    handleDelGood (id) {
      let index = this.selectedData.findIndex(item => item.goods_id === id);
      if (index > -1) this.selectedData.splice(index, 1);
    },
    handleDelNorm (goodsId, proId) {
      this.selectedData.forEach(item => {
        if (item.goods_id === goodsId) {
          let index = item.get_products.findIndex(item => item.product_id === proId);
          if (index > -1) item.get_products.splice(index, 1);
        }
      })
    },
    transferApi (data) {
      return data.filter(item => {
        item.per_order_qty = Number(item.perOrder);
        item.per_user_qty = Number(item.perUser);
        item.sort_order = Number(item.sortOrder);
        item.get_products.forEach(item => {
          item.seckill_price = Number(item.discountPrice);
          item.limit_qty = Number(item.limitNumber);
          item.seckill_integral = 0;//没啥卵用的
        });
        return true;
      })
    },
    confirm () {
      this.$refs.goodsTable.checkValidate(tableValid => {
        this.$refs.formValidate.validate(valid => {
        if (valid && tableValid) {
          this.spinShow = true;
          let basicP = {
            issue_name: this.formItem.issue_name,
            stime: this.formItem.validTimeRange[0],
            etime: this.formItem.validTimeRange[1],
            can_use_point: this.formItem.can_use_point,
            can_use_bonus: this.formItem.can_use_bonus,
            user_ranks: this.formItem.user_ranks.join(),
            background_image: this.formItem.background_image,
            title_image: this.formItem.title_image,
            remark: this.formItem.remark,
            pic_path: this.formItem.pic_path,
            share_title: this.formItem.share_title,
            share_desc: this.formItem.share_desc
          };
          // 组成添加，编辑，删除数组
          let addColId = [];
          let removeColId = [];
          let editColId = [];
          let addColItem = [];
          let removeColItem = [];
          let editColItem = [];
          let selectedCol = this.freezeData.map(item => item.goods_id);
          let newData = this.goodsEditData.map(item => item.goods_id);
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
          this.goodsEditData.forEach(item => {
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
            type: 2,
            add_goods_data: addColItem.length ? this.transferApi(addColItem) : null,
            edit_goods_data: editColItem.length ? this.transferApi(editColItem) : null,
            remove_goods_data: removeColItem.length ? this.transferApi(removeColItem) : null,
            ...basicP
          } : {
            goods_data: this.transferApi(this.goodsEditData),
            ...basicP
          };
          return this.$ajax.post(this.id ? this.$api.timeLimitActivityEdit : this.$api.timeLimitActivityAdd, params)
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
  watch: {
    currentStep: {
      handler(nV) {
        this.showBaisc = nV === 0 ? true : false;
      },
      immediate: true
    }
  },
  mounted () {
    this.loadData();
  }
}
</script>

<style lang="less">
.time-limit-form{
  .basic_input_fixed, .basic_textarea{
    max-width: 420px;
  }
  .time_range{
    width: 340px;
  }
}
</style>
<style lang="less" scoped>
.group-activity-select-wrapper{
  text-align: center;
}
.steps{
  position: absolute;
  width: 50%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
