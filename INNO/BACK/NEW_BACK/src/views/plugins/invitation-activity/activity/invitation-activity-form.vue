<template>
  <PageTopBase>
    <template v-slot:action>
      <div class="steps">
        <Steps :current="currentStep">
            <Step title="填写活动信息" @click.native="handleStep(0)" style="cursor: pointer;"></Step>
            <Step title="完善自定义编辑" @click.native="handleStep(1)" style="cursor: pointer;"></Step>
        </Steps>
      </div>
    </template>
    <transition-group name="fade">
      <div class="invitation-activity-form" v-show="showBaisc" key="basic">
        <titleBar>活动信息</titleBar>
        <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="140" v-friendly-errors>
          <FormItem label="活动名称" prop="activityName">
            <Input v-model="formItem.activityName" placeholder="请输入活动名称" class="basic_input basic_input_fixed" :maxlength="30" show-word-limit/>
          </FormItem>
          <FormItem label="是否启用" prop="isEnabled">
            <i-switch size="large" v-model="formItem.isEnabled" true-value="1" false-value="0">
              <span slot="open">开启</span>
              <span slot="close">关闭</span>
            </i-switch>
          </FormItem>
          <FormItem label="是否启用自取" prop="selfGet">
            <i-switch size="large" v-model="formItem.selfGet" true-value="1" false-value="0">
              <span slot="open">开启</span>
              <span slot="close">关闭</span>
            </i-switch>
          </FormItem>
          <FormItem label="转发人数" prop="shareNumber">
            <InputNumber :min="0" v-model="formItem.shareNumber"></InputNumber>
            <span>次</span>
          </FormItem>
          <FormItem label="活动时间" prop="validTimeRange">
            <DatePicker v-model="formItem.validTimeRange" type="datetimerange" placeholder="请选择活动时间" class="time_range" @on-change="handleTime"></DatePicker>
          </FormItem>
          <FormItem label="活动礼包" prop="couponData">
            <Button type="dashed" @click="handleSelected" class="basic_select coupon_select">选择优惠券</Button>
            <coupon-select :data="formItem.couponData" @get-data="handleSetData"/>
          </FormItem>
          <FormItem label="活动进度奖励设置">
            <div v-for="(item, index) in formItem.discountList" :key="item.id">
              <FormItem
                class="form_item_24"
                label="奖励名称"
                :label-width="80"
                :prop="'discountList.'+index+'.name'"
                :rules="[
                  {required: true, message: '奖励名称不能为空', trigger: 'blur'}
                ]">
                <Input v-model="item.name" style="width: 100px;"/>
              </FormItem>
              <FormItem
                class="form_item_24"
                :label-width="0"
                :prop="'discountList.'+index+'.people'"
                :rules="[
                  {required: true, message: '好友不能为空', trigger: 'blur', type: 'number'}
                ]">
                <label>满</label>
                <InputNumber v-model="item.people" :min="0" style="width: 100px;"/>
                <label>位好友兑换礼包</label>
              </FormItem>
              <FormItem
                class="form_item_24"
                label="送优惠券"
                :label-width="80"
                :prop="'discountList.'+index+'.coupon'"
                :rules="[
                  {required: true, message: '优惠券不能为空', trigger: 'blur', type: 'array', len: 1}
                ]">
                <Button type="dashed" @click="handleSelectedSingle(index)" class="basic_select coupon_select">选择优惠券</Button>
                <Table
                  :columns="miniCoupon"
                  :data="item.coupon"
                  width="500"
                  class="table">
                    <template slot-scope="{ row }" slot="simpleName">
                      <Input v-model="row.simpleName" placeholder="请输入名称" class="basic_input basic_input_fixed" @on-change="e => handleSimple(e.target.value, index)"/>
                    </template>
                    <template slot-scope="{ row }" slot="icon">
                        <image-edit :img="row.icon" @selectImg="openCouponPic(index)" @delImg="handleCouponPic(index)">
                          <p class="strong_tips">尺寸最佳是110*170</p>
                        </image-edit>
                    </template>
                    <template slot="handle">
                      <span @click="delCouponPic(index)"><a>删除</a></span>
                    </template>
                </Table>
              </FormItem>
              <Button @click="handleDelDiscount(index)">删除奖励</Button>
            </div>
            <Button type="primary" @click="addDiscount">添加奖励</Button>
          </FormItem>
          <FormItem label="兑换状态判断" prop="status">
            <RadioGroup v-model="formItem.status">
              <Radio :label="0">所有劵都兑换</Radio>
              <Radio :label="1">任意券兑换</Radio>
              <Radio :label="2">指定劵兑换</Radio>
            </RadioGroup>
            <div v-show="formItem.couponData.length && formItem.status === 2">
              <RadioGroup v-model="formItem.canUseCoupon" v-for="item in formItem.couponData" :key="item.type_id">
                <Radio :label="item.type_id">{{item.name}}</Radio>
              </RadioGroup>
            </div>
          </FormItem>
          <titleBar>礼包库存</titleBar>
          <p>当前活动礼包数0件，已领取0件，剩余0件</p>
          <FormItem label="预计发放礼包数" prop="packageNumber">
            <InputNumber :min="0" :max="maxPackageNumber" v-model="formItem.packageNumber"></InputNumber>
            <span> 剩余礼包劵数量：{{maxPackageNumber}}</span>
            <p class="strong_tips">新增礼包数量需要小于或等于当前剩余礼包劵数量</p>
          </FormItem>
          <titleBar>分享卡片</titleBar>
          <FormItem label="分享标题" prop="shareTitle">
            <Input v-model="formItem.shareTitle" placeholder="请输入分享标题" class="basic_input basic_input_fixed" :maxlength="30" show-word-limit/>
          </FormItem>
          <FormItem label="分享图片" prop="sharePic">
            <image-edit :img="formItem.sharePic" @selectImg="openShare" @delImg="handleShareImg">
              <p class="strong_tips">尺寸最佳是110*170</p>
            </image-edit>
          </FormItem>
        </Form>
      </div>
      <div class="invitation-activity-form edit" v-show="!showBaisc" key="edit">
        <Form ref="formValidate2" :model="formItem2" :label-width="140">
          <FormItem label="是否启用自取" prop="invitePic">
            <image-edit :img="formItem2.invitePic" @selectImg="openImagesModal('invitePic')" @delImg="handleDelImg('invitePic', index)">
              <p class="strong_tips">尺寸最佳是750*786</p>
            </image-edit>
          </FormItem>
          <FormItem label="受邀者活动图" prop="invitedPic">
            <image-edit :img="formItem2.invitedPic" @selectImg="openImagesModal('invitedPic')" @delImg="handleDelImg('invitedPic', index)">
              <p class="strong_tips">尺寸最佳是750*1334</p>
            </image-edit>
          </FormItem>
          <FormItem label="活动列表图片" prop="activityPic">
            <image-edit :img="formItem2.activityPic" @selectImg="openImagesModal('activityPic')" @delImg="handleDelImg('activityPic', index)">
              <p class="strong_tips">尺寸最佳是690*220</p>
            </image-edit>
          </FormItem>
          <FormItem label="我要送礼提醒" prop="myTip">
            <image-edit :img="formItem2.myTip" @selectImg="openImagesModal('myTip')" @delImg="handleDelImg('myTip', index)">
              <p class="strong_tips">尺寸最佳是640*100</p>
            </image-edit>
          </FormItem>
          <FormItem label="完善个人资料提醒" prop="infoTip">
            <image-edit :img="formItem2.infoTip" @selectImg="openImagesModal('infoTip')" @delImg="handleDelImg('infoTip', index)">
              <p class="strong_tips">尺寸最佳是640*100</p>
            </image-edit>
          </FormItem>
          <FormItem label="转发礼包提醒" prop="shareLimit">
            <Input
              type="textarea"
              class="basic_textarea"
              v-model="formItem.shareLimit"
              placeholder="请输入转发礼包提醒"
              :rows="3"
              :maxlength="120"
              show-word-limit/>
          </FormItem>
          <FormItem label="领取礼包提醒" prop="getTip">
            <Input
              type="textarea"
              class="basic_textarea"
              v-model="formItem.getTip"
              placeholder="请输入领取礼包提醒"
              :rows="3"
              :maxlength="120"
              show-word-limit/>
          </FormItem>
          <FormItem label="礼包兑换须知" prop="exchangeTip">
            <Input
              type="textarea"
              class="basic_textarea"
              v-model="formItem.exchangeTip"
              placeholder="请输入礼包兑换须知"
              :rows="3"
              :maxlength="120"
              show-word-limit/>
          </FormItem>
        </Form>
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
  </PageTopBase>
</template>

<script>
import PageTopBase from '@/views/my-components/page-top-base/index';
import CouponSelect from './coupon-select';
import ImageEdit from '@/views/my-components/image-edit/image-edit';
import titleBar from '@/views/my-components/title-bar/title-bar';

export default {
  components: {
    PageTopBase,
    CouponSelect,
    ImageEdit,
    titleBar
  },
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
        activityName: '',
        isEnabled: '0',
        selfGet: '0',
        shareNumber: 0,
        validTimeRange: [],
        couponData: [],
        discountList: [
          {
            id: 0,
            name: '',
            people: 1,
            coupon: []
          }
        ],
        status: 0,
        canUseCoupon: 0,
        packageNumber: 1,
        activityPackage: [
          {
            time: '',
            number: ''
          }
        ],
        shareTitle: '',
        sharePic: ''
      },
      formItem2: {
        invitePic: '',
        invitedPic: '',
        activityPic: '',
        myTip: '',
        infoTip: '',
        shareLimit: '',
        getTip: '',
        exchangeTip: ''
      },
      miniCoupon: [
        {
          title: '优惠券',
          key: 'name'
        },
        {
          title: '别名',
          key: 'simpleName',
          slot: 'simpleName'
        },
        {
          title: '图片',
          key: 'icon',
          slot: 'icon'
        },
        {
          title: '操作',
          key: 'handle',
          slot: 'handle'
        }
      ],
      ruleValidate: {
        activityName: [{required: true, message: '活动名称不能为空', trigger: 'blur'}],
        shareNumber: [{required: true, message: '转发人数不能为空', trigger: 'blur', type: 'number'}],
        validTimeRange: [{required: true, trigger: 'change', type: 'array', validator: checkValidRange}],
        couponData: [{required: true, message: '活动礼包不能为空', trigger: 'change', type: 'array', min: 1}],
        shareTitle: [{required: true, message: '分享标题不能为空', trigger: 'blur'}],
        sharePic: [{required: true, message: '分享图片不能为空', trigger: 'blur'}],
      },
      spinShow: false,
      currentStep: 0,
      showBaisc: true,
      maxPackageNumber: 99
    }
  },
  methods: {
    openImagesModal (key) {
      this.$selectMaterial({
        type: 'image',
        selectedData: this.formItem2[key],
        getList: (item) => {
          this.formItem2[key] = item.src;
        }
      });
    },
    handleDelImg (key) {
      this.formItem2[key] = '';
    },
    openShare () {
      this.$selectMaterial({
        type: 'image',
        selectedData: this.formItem.sharePic,
        getList: (item) => {
          this.formItem.sharePic = item.src;
          this.$refs.formValidate.validateField('sharePic');
        }
      });
    },
    handleShareImg () {
      this.formItem.sharePic = '';
    },
    handleSelected (selected) {
      this.$selectContent({
        mode: 'coupon',
        type: 'checkbox',
        data: this.formItem.couponData,
        getList: (data) => {
          let newData = [];
          let oldData = [];
          data.forEach(item => {
            let hasItem;
            if (hasItem = this.formItem.couponData.find(c => c.type_id === item.type_id)) {
              oldData.push(hasItem);
            } else {
              newData.push(item);
            }
          })
          let result = [...oldData, ...newData].filter((item, index) => {
            item.simpleName = item.simpleName || '';
            item.pic = item.pic || '';
            item.iconPic = item.iconPic || '';
            item.isMain = item.isMain || '0';
            return true;
          })
          this.formItem.couponData = result;
          this.formItem.canUseCoupon = result[0].type_id; //默认第一个赋值
          this.$refs.formValidate.validateField('couponData');
        }
      });
    },
    handleSelectedSingle (index) {
      this.$selectContent({
        mode: 'coupon',
        type: 'radio',
        data: this.formItem.discountList[index].coupon,
        getList: (data) => {
          this.formItem.discountList[index].coupon = [
            {
              name: data[0].name,
              simpleName: '',
              icon: ''
            }
          ];
          this.$refs.formValidate.validateField(`discountList.${index}.coupon`);
        }
      });
    },
    handleTime (date) {
      this.formItem.validTimeRange = date;
    },
    next () {
      return this.$refs.formValidate.validate().then(valid => {
        // if (valid) {
        //   this.currentStep = 1;
        //   this.showBaisc = false;
        // }
        this.currentStep = 1;
        this.showBaisc = false;
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
    handleSetData (nV) {
      this.formItem.couponData = nV;
    },
    handleSimple (val, index) {
      this.formItem.discountList[index].coupon[0].simpleName = val;
    },
    openCouponPic (index) {
      this.$selectMaterial({
        type: 'image',
        selectedData: this.formItem.discountList[index].coupon[0].icon,
        getList: (item) => {
          this.formItem.discountList[index].coupon[0].icon = item.src;
        }
      });
    },
    handleCouponPic (index) {
      this.formItem.discountList[index].coupon[0].icon = '';
    },
    delCouponPic (index) {
      this.formItem.discountList[index].coupon = [];
    },
    addDiscount () {
      let lastId = this.formItem.discountList[this.formItem.discountList.length - 1] ? this.formItem.discountList[this.formItem.discountList.length - 1].id + 1 : 0;
      this.formItem.discountList.push({
        id: lastId,
        name: '',
        people: 1,
        coupon: []
      });
    },
    handleDelDiscount (index) {
      this.formItem.discountList.splice(index, 1);
    },
    confirm () {

    }
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
.invitation-activity-form{
  .basic_input_fixed, .basic_textarea{
    max-width: 420px;
  }
  .time_range{
    width: 340px;
  }
  .coupon_select{
    margin-bottom: 24px;
  }
  .form_item_24{
    display: inline-flex;
    margin-bottom: 24px;
  }
}
</style>
