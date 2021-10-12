<template>
  <div class="lottery-template">
    <PageTopBase>
      <template v-slot:action>
        <div class="steps">
          <Steps :current="currentStep">
            <Step title="创建活动" style="cursor: pointer;"></Step>
            <Step title="奖项设置" style="cursor: pointer;"></Step>
            <Step title="页面装修" style="cursor: pointer;"></Step>
          </Steps>
        </div>
      </template>
      <transition-group name="fade">
        <div class="basic" v-show="currentStep === 0" key="basic">
          <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="140" v-friendly-errors>
            <FormItem label="活动名称" prop="activityName">
              <Input v-model="formItem.activityName" placeholder="请输入活动名称" class="basic_input basic_input_fixed" :maxlength="30" show-word-limit/>
            </FormItem>
            <FormItem label="活动时间" prop="validTimeRange">
              <DatePicker v-model="formItem.validTimeRange" type="datetimerange" placeholder="请选择活动时间" class="time_range" @on-change="handleTime"></DatePicker>
            </FormItem>
            <FormItem label="活动状态" prop="isEnabled">
              <i-switch size="large" v-model="formItem.isEnabled" :true-value="1" :false-value="0">
                <span slot="open">开启</span>
                <span slot="close">关闭</span>
              </i-switch>
            </FormItem>
            <FormItem label="绑定手机才可参与">
              <RadioGroup v-model="formItem.isMobileUser">
                <Radio label="1">是</Radio>
                <Radio label="0">否</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="活动">
              <Select v-model="formItem.joinKind" class="basic_select">
                <Option value="0">限定次数</Option>
                <Option value="1">抽奖机会</Option>
              </Select>
              <template v-if="formItem.joinKind == 0">
                <label>单个会员总共</label>
                <InputNumber :min="0" :precision="0" v-model="formItem.totalJoinsTimes"></InputNumber>
                <label>抽奖机会</label>
                <label>每天可参与</label>
                <InputNumber :min="0" :precision="0" v-model="formItem.joinTimesDay"></InputNumber>
                <label>次</label>
              </template>
              <template>
                <label>每次消耗</label>
                <InputNumber :min="0" :precision="0" v-model="formItem.joinIntegral"></InputNumber>
                <label>积分</label>
              </template>
            </FormItem>
            <FormItem label="奖品">
							<div class="flex">
								<FormItem prop="givedKind">
									<Select v-model="formItem.givedKind" class="basic_select" style="width:120px;">
										<Option :value="1" :disabled="disabledGive">一次多送</Option>
										<Option :value="2">按概率送</Option>
									</Select>
								</FormItem>&nbsp;
								<label>抽取</label>&nbsp;&nbsp;
								<template>
										<label>限制</label>&nbsp;
										<FormItem prop="winningLimit">
											<Select v-model="formItem.winningLimit" class="basic_select" style="width:120px;">
												<Option :value="1">总中奖</Option>
												<Option :value="2">单品中奖</Option>
											</Select>
										</FormItem>&nbsp;
										<label>次数</label>&nbsp;&nbsp;
										<label>共</label>&nbsp;
										<FormItem prop="allowWinTimes">
											<InputNumber :min="0" :precision="0" v-model="formItem.allowWinTimes" style="width:120px;"></InputNumber>
										</FormItem>
										<label>&nbsp;次数</label>
								</template>
							</div>
            </FormItem>
            <FormItem label="享受优惠会员等级" prop="joinRanks">
              <UserRank :value.sync="formItem.joinRanks"/>
            </FormItem>
            <FormItem label="绑定群ID" prop="wxgroupSelect">
              <wechat-select :data="formItem.wxgroupSelect" type="checkbox" @del-tag="handleTag">
                <Button type="dashed" @click="handleSelect('group', 'wxgroupSelect')" class="basic_select">选择微信群</Button>
              </wechat-select>
            </FormItem>
            <FormItem label="参与人数">
              <RadioGroup v-model="formItem.isShowJoinTime">
                <Radio :label="1">显示</Radio>
                <Radio :label="0">不显示</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="中奖名单">
              <RadioGroup v-model="formItem.isShowWinnings">
                <Radio :label="1">滚动显示</Radio>
                <Radio :label="0">不显示</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="虚拟参与人数" prop="virtualJoinTime">
              <InputNumber :min="0" v-model="formItem.virtualJoinTime"></InputNumber>
            </FormItem>
            <FormItem label="微信分享图片" prop="shareImg">
              <image-edit :img="formItem.shareImg" @selectImg="openImagesModal('shareImg', formItem.shareImg )" @delImg="handleDelImg('shareImg')">
                <p class="strong_tips">图片尺寸最佳是360*360，格式为 jpg 或 png，图片大小控制在200KB</p>
              </image-edit>
            </FormItem>
            <FormItem label="微信分享标题" prop="shareTitle">
              <Input v-model="formItem.shareTitle" placeholder="请输入微信分享标题" class="basic_input basic_input_fixed" :maxlength="30" show-word-limit/>
            </FormItem>
            <FormItem label="微信分享说明" prop="shareDescription">
              <Input
                type="textarea"
                class="basic_textarea basic_textarea"
                v-model="formItem.shareDescription"
                placeholder="请输入微信分享说明"
                :rows="3"
                :maxlength="150"
                show-word-limit/>
            </FormItem>
          </Form>
        </div>
        <div class="reward" v-show="currentStep === 1" key="reward">
          <slot name="content"></slot>
        </div>
        <div class="page" v-show="currentStep === 2" key="page">
          <div class="page_inner">
            <img :src="bgSrc"/>
              <Form ref="formValidatePage" :model="formPageItem" :label-width="140">
                <FormItem label="活动规则" prop="activityDescription">
                  <Input
                    type="textarea"
                    class="basic_textarea basic_textarea"
                    v-model="formPageItem.activityDescription"
                    placeholder="请输入微信分享说明"
                    :rows="3"
                    :maxlength="150"
                    show-word-limit/>
                </FormItem>
                <FormItem label="LOGO图" prop="pushImg">
                  <image-edit :img="formPageItem.pushImg" @selectImg="openPageImagesModal('pushImg', formPageItem.pushImg )" @delImg="handlePageDelImg('pushImg')">
                    <p class="strong_tips">图片尺寸最佳是400*400，格式为 jpg 或 png，图片大小控制在200KB</p>
                  </image-edit>
                </FormItem>
                <FormItem label="背景图" prop="actBgImg">
                  <image-edit :img="formPageItem.actBgImg" @selectImg="openPageImagesModal('actBgImg', formPageItem.actBgImg )" @delImg="handlePageDelImg('actBgImg')">
                    <p class="strong_tips">图片尺寸最佳是750*1400，格式为 jpg 或 png，图片大小控制在2M</p>
                  </image-edit>
                </FormItem>
            </Form>
          </div>
        </div>
      </transition-group>
      <template v-slot:footer>
        <Divider />
        <div style="text-align: center;">
          <Button type="default" @click="goBack">取消</Button>
          <Button type="primary" @click="confirm" v-show="currentStep === 2">保存</Button>
          <Button type="success" @click="next" v-show="currentStep !== 2">下一步</Button>
          <Button type="success" @click="foward" v-show="currentStep !== 0">上一步</Button>
        </div>
      </template>
      <Spin size="large" fix v-if="spinShow"></Spin>
    </PageTopBase>
  </div>
</template>

<script>
import PageTopBase from '@/views/my-components/page-top-base/index';
import WechatSelect from '@/views/my-components/list-component/index-edit';
import ImageEdit from '@/views/my-components/image-edit/image-edit';
import UserRank from '@/views/my-components/user-rank/index';

export default {
  props: ['type', 'id'],
  components: {
    PageTopBase,
    WechatSelect,
    ImageEdit,
    UserRank
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
      currentStep: 0,
      spinShow: false,
      mapType: {
        'fan': 1,
        'fruit': 2,
        'yao': 3,
        'egg': 4,
        'pan': 5,
        'coupon': 6
      },
      formItem: {
        activityName: '',
        validTimeRange: [],
        fromDate: '',
        toDate: '',
        isEnabled: 0,
        isMobileUser: '0',
        joinKind: '0',
        totalJoinsTimes: 0,
        joinTimesDay: 0,
        joinIntegral: 0,
        givedKind: 0,
        winningLimit:1,
        allowWinTimes: 0,
        joinRanks: [],
        wxgroupSelect: [],
        isShowJoinTime: 1,
        isShowWinnings: 1,
        virtualJoinTime: 0,
        shareImg: '',
        shareTitle: '',
        shareDescription: ''
      },
      formPageItem: {
        activityDescription: '',
        pushImg: '',
        actBgImg: ''
      },
      ruleValidate: {
        activityName: [{required: true, message: '活动名称不能为空', trigger: 'blur'}],
        validTimeRange: [{required: true, trigger: 'change', type: 'array', validator: checkValidRange}],
        joinRanks: [{
          required: true,
          message: '会员等级不能为空',
          trigger: 'change',
          type: 'array',
          min: 1
        }],
				givedKind: [{required: true, type:'number', trigger: 'change', validator:(rule, value, callback) => {
							if (value === 0 || !value) {
										callback(new Error('奖品抽取不能为空'));
							} else {
										callback();
							}
				}}],
				winningLimit: [{required: true, type:'number', trigger: 'change', validator:(rule, value, callback) => {
							if (value === 0 || !value) {
										callback(new Error('限制奖品不能为空'));
							} else {
										callback();
							}
				}}],
				allowWinTimes: [{required: true, type:'number', trigger: 'blur', validator:(rule, value, callback) => {
							if (value === 0 || !value) {
										callback(new Error('奖品次数不能为空'));
							} else {
										callback();
							}
				}}]
      },
      levelList: [],
      prizesList: [],
      thanksArr: []
    }
  },
  computed: {
    disabledGive() {
      return this.type === 'fan' || this.type === 'fruit' || this.type === 'pan' || this.type === 'coupon';
    },
    bgSrc() {
      let src;
      switch (this.type) {
        case 'fan':
          src = require('@rs/images/sx.jpg');
          break;
        case 'fruit':
          src = require('@rs/images/sgj.jpg');
          break;
        case 'yao':
          src = require('@rs/images/yyy.jpg');
          break;
        case 'egg':
          src = require('@rs/images/zjd.jpg');
          break;
        case 'pan':
          src = require('@rs/images/zp.jpg');
          break;
        case 'coupon':
          src = require('@rs/images/ydjs.jpg');
          break;
        default:
          break;
      }
      return src;
    }
  },
  methods: {
    loadData () {
      this.spinShow = true;
      this.$ajax.post(this.$api.lotteryActivityInfo, {
        id: this.id
      })
      .then(response => {
        const res = response.data;
        if (res.code) {
          let data = res.data,
              main = data.data,
              imgCol = data.bg_img;
          if (data) {
            if (main) {
              this.formItem = {
                ...main,
                wxgroupSelect: main.channelLimitList,
                validTimeRange: [main.fromDate, main.toDate]
              };
              this.formPageItem.activityDescription = main.activityDescription;
              this.formPageItem.pushImg = main.pushImg;
              this.formPageItem.actBgImg = main.actBgImg;
              this.prizesList = main.prizesList;
              // 接口没处理，自己处理下
              this.thanksArr = {
                prizeIntegral: 0,
                prizeName: '',
                prizeTotals: 0,
                joinPoolNumber: 0,
                sort: 0,
                isDefault: true, //标识默认
                ...main.thanksArr,
                prizesType: 4 //不取接口的，前端自己处理,最后传值再按接口来
              };

            }
            this.$emit('getPrizeList', this.prizesList, this.thanksArr, imgCol);
          }
        }
        this.spinShow = false;
      });
    },
    handleTime ([fromDate, toDate]) {
      this.formItem.validTimeRange = [fromDate, toDate];
      this.formItem.fromDate = fromDate;
      this.formItem.toDate = toDate;
    },
    handleSelect (mode, name) {
      this.$selectContent({
        mode: mode,
        type: 'checkbox',
        data: this.formItem[name],
        getList: (data) => {
          this.formItem[name] = data;
          if (mode === 'group') {
            this.$refs.formValidate.validateField('wxgroupSelect');
          }
        }
      })
    },
    handleTag (data) {
      this.formItem.wxgroupSelect = data;
    },
    openImagesModal (name, url) {
      this.$selectMaterial({
        type: 'image',
        selectedData: url,
        getList: (item) => {
          this.formItem[name] = item.src;
        }
      });
    },
    handleDelImg (name) {
      this.formItem[name] = '';
    },
    openPageImagesModal (name, url) {
      this.$selectMaterial({
        type: 'image',
        selectedData: url,
        getList: (item) => {
          this.formPageItem[name] = item.src;
        }
      });
    },
    handlePageDelImg (name) {
      this.formPageItem[name] = '';
    },
    next () {
      if (this.currentStep === 0) {
        return this.$refs.formValidate.validate().then(valid => {
          if (valid) {
            this.currentStep++;
          }
        });
      } else if (this.currentStep === 1) {
        // 直接找到插槽内容
        let p = this.$slots.content[0].context;
        return p.handleValidate(valid => {
          if (valid) {
            this.currentStep++;
          }
        })
      }
    },
    foward () {
      this.currentStep--;
    },
    goBack () {
      this.$router.go(-1);
    },
    handleData (obj) {
      return obj.map(item => {
        return {
          ...item,
          prizeId: item.prizeId ? item.prizeId : 0,
          prizeCoupons: item.couponData.map(item => item.id).join(),
          prizeGoodsId: item.giftData.map(item => item.id).join(),
          prizeProductId: 0, //没啥卵用
          personTimes: 0, //没啥卵用
          isEnabled: 1, //没啥卵用
          prizesType: item.isDefault ? 99 : item.prizesType,
          prizeImg: item.pic,
          lave_count: 0, //没啥卵用
          giftPackageName: '', //没啥卵用
          giftPackageImg: '', //没啥卵用
          displayName: item.couponData.map(item => item.name).join() //卵用都没有
        }
      })
    },
    confirm () {
      let p = this.$slots.content[0].context;
      let thanksArr = p.tableData.data.filter(item => item.isDefault),
          prizesList = p.tableData.data.filter(item => !item.isDefault);
      thanksArr = this.handleData(thanksArr);
      prizesList = this.handleData(prizesList);
      this.spinShow = true;
      return this.$ajax.post(this.id ? this.$api.lotteryActivityEdit : this.$api.lotteryActivityAdd, {
        ...this.formItem,
        ...this.formPageItem,
        id: this.id,
        activityType: this.mapType[this.type],
        joinRanks: this.formItem.joinRanks.join(),
        group_id: this.formItem.wxgroupSelect.map(item => item.id).join(),
        thanksArr: thanksArr[0],
        packageArr: {
          prizeImg: '',
          prizeRate: 0,
          prizeName: ''
        },
        prizesList
      })
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.$Message.success(res.message);
          this.$emit('allow');
          this.$router.go(-1);
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
.lottery-template{
  .basic_input_fixed, .basic_textarea{
    max-width: 420px;
  }
  .time_range{
    width: 340px;
  }
  .page{
    .page_inner{
      display: flex;
      align-items: flex-start;
    }
  }
}
.steps{
  position: absolute;
  width: 50%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
