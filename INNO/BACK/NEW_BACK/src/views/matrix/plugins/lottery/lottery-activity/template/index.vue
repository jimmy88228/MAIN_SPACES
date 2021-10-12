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
            <FormItem label="活动名称" prop="name">
              <Input v-model="formItem.name" placeholder="请输入活动名称" class="basic_input basic_input_fixed" :maxlength="30" show-word-limit/>
            </FormItem>
            <FormItem label="活动时间" prop="validTimeRange">
              <DatePicker v-model="formItem.validTimeRange" type="datetimerange" placeholder="请选择活动时间" class="time_range" @on-change="handleTime"></DatePicker>
            </FormItem>
            <FormItem label="活动状态" prop="enable">	
              <i-switch size="large" v-model="formItem.enable" :true-value="1" :false-value="0">
                <span slot="open">开启</span>
                <span slot="close">关闭</span>
              </i-switch>
            </FormItem>
            <FormItem label="绑定手机才可参与">
              <RadioGroup v-model="formItem.limitBindPhone">
                <Radio :label="1">是</Radio>
                <Radio :label="0">否</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="活动">
							<FormItem prop="joinKind" style="display:inline-block;">
								<Select v-model="formItem.joinKind" class="basic_select" style="width:120px;">
									<Option :value="0">限定次数</Option>
									<!-- <Option :value="1">抽奖机会</Option> -->
								</Select>
							</FormItem>
              <template v-if="formItem.joinKind == 0">
								<FormItem prop="totalJoinCount" style="display:inline-block;">
									<label>单个会员总共</label>
									<InputNumber :min="0" v-model="formItem.totalJoinCount"></InputNumber>
									<label>抽奖机会</label>&nbsp;
								</label>
								</FormItem>
								<!--新增调整-->
								<FormItem prop="joinCountLimit" style="display:inline-block;">
									<label>限制天数</label>
									<Select v-model="formItem.joinCountLimit" class="basic_select" style="width:120px;">
										<Option :value="1">按天数</Option>
										<Option :value="0">按时间</Option>
									</Select>
								</FormItem>
								<template v-if="formItem.joinCountLimit == 1">
									<FormItem prop="eachJoinCount" style="display:inline-block;">
										<label>每天可参与</label>
										<InputNumber :min="0" :max="formItem.totalJoinCount" v-model="formItem.eachJoinCount"></InputNumber>
										<label>次</label>
									</FormItem>
								</template>
								<template v-else-if="formItem.joinCountLimit == 0">
									<FormItem prop="eachJoinInterval" style="display:inline-block;">
										<label>每隔</label>
										<InputNumber :min="0" :max="formItem.totalJoinCount" v-model="formItem.eachJoinInterval"></InputNumber>
										<label>分钟可参与1次</label>
									</FormItem>
								</template>
								
								
              </template>
              <template>
								<FormItem prop="joinIntegral" style="display:inline-block;">
									<label>每次消耗</label>
									<InputNumber :min="0" v-model="formItem.joinIntegral"></InputNumber>
									<label>积分</label>
								</FormItem>
              </template>
            </FormItem>
						
						
            <FormItem label="奖品">
							<div class="flex">
								<FormItem prop="givedKind">
									<Select v-model="formItem.givedKind" class="basic_select" style="width:120px;">
										<Option :value="parseInt(index)" v-for="(item, index) in kind_arr" :key="index">{{item}}</Option>
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
										<FormItem prop="totalWinningCount">
											<InputNumber :min="0" v-model="formItem.totalWinningCount" style="width:120px;"></InputNumber>
										</FormItem>
										<label>&nbsp;次数&nbsp;</label>
								</template>
								
								<!--新增调整-->
								<template>
									<FormItem prop="prizeLimit">
										<label>限制奖品&nbsp;</label>
										<Select class="basic_select" style="width:100px;" v-model="formItem.prizeLimit">
											<Option :value="1">每日中奖</Option>
											<Option :value="2">区间中奖</Option>
										</Select>
									</FormItem>
								</template>
								
							</div>
            </FormItem>
            <!-- <FormItem label="享受优惠会员等级" prop="joinRanks">
              <UserRank :value.sync="formItem.joinRanks"/>
            </FormItem> -->
            <!-- <FormItem label="绑定群ID" prop="wxgroupSelect">
              <wechat-select :data="formItem.wxgroupSelect" type="checkbox" @del-tag="handleTag">
                <Button type="dashed" @click="handleSelect('group', 'wxgroupSelect')" class="basic_select">选择微信群</Button>
              </wechat-select>
            </FormItem> -->
						
						<!--绑定规则-->
						<FormItem label="绑定规则" prop="shareRuleId">
							<div class="flex">
								<Select class="basic_select" style="width:150px;"  v-model="formItem.shareRuleId">
									<Option v-for="(item, index) in shareRuleList" :value="item.id" :key="index">{{item.name}}</Option>
								</Select>
								<p class="notice">&nbsp;*每一个活动只能绑一个规则</p>
							</div>
						</FormItem>
						
            <FormItem label="参与人数">
              <RadioGroup v-model="formItem.isShowJoins">
                <Radio :label="1">显示</Radio>
                <Radio :label="0">不显示</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="中奖名单">
              <RadioGroup v-model="formItem.isShowWinnings">
                <Radio :label="1">显示</Radio>
                <Radio :label="0">不显示</Radio>
              </RadioGroup>
            </FormItem>
            <FormItem label="虚拟参与人数" prop="virtualJoinTime">
              <InputNumber :min="0" v-model="formItem.virtualJoinTime"></InputNumber>
            </FormItem>
						<FormItem label="活动规则" prop="remark">
						  <Input
						    type="textarea"
						    class="basic_textarea basic_textarea"
						    v-model="formItem.remark"
						    placeholder="请填写活动规则"
						    :rows="3"
						    :maxlength="150"
						    show-word-limit/>
						</FormItem>
						<FormItem label="微信分享标题" prop="shareTitle">
						  <Input v-model="formItem.shareTitle" placeholder="请输入微信分享标题" class="basic_input basic_input_fixed" :maxlength="30" show-word-limit/>
						</FormItem>
            <FormItem label="微信分享图片" prop="shareImg">
              <image-edit :img="formItem.shareImg" @selectImg="openImagesModal('shareImg', formItem.shareImg )" @delImg="handleDelImg('shareImg')">
                <p class="strong_tips">图片尺寸最佳是400*400，格式为 jpg 或 png，图片大小控制在200KB</p>
              </image-edit>
            </FormItem>
            <!-- <FormItem label="微信分享说明" prop="shareDesc">
              <Input
                type="textarea"
                class="basic_textarea basic_textarea"
                v-model="formItem.shareDesc"
                placeholder="请输入微信分享说明"
                :rows="3"
                :maxlength="150"
                show-word-limit/>
            </FormItem> -->
						<FormItem label="分享海报图" prop="posterImg">
						  <image-edit :img="formItem.posterImg" @selectImg="openImagesModal('posterImg', formItem.posterImg )" @delImg="handleDelImg('posterImg')">
						    <p class="strong_tips">图片尺寸最佳是750*1400，格式为 jpg 或 png，图片大小控制在1M内</p>
						  </image-edit>
						</FormItem>
          </Form>
        </div>
        <div class="reward" v-show="currentStep === 1" key="reward">
          <slot name="content"></slot>
        </div>
        <!-- <div class="page" v-show="currentStep === 2" key="page">
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
        </div> -->
				<div class="page" v-show="currentStep === 2" key="lotteryPage">
						<lotteryPage ref="lotteryPage"></lotteryPage>
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
import lotteryPage from '@/views/matrix/plugins/lottery/lottery-page/lottery-page';
import 	{ lotteryType } from '@/views/matrix/plugins/lottery/typeMap.js';

export default {
  props: ['type', 'id'],
  components: {
    PageTopBase,
    WechatSelect,
    ImageEdit,
    UserRank,
		lotteryPage
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
        name: '',
        validTimeRange: [],
        fromDate: '',
        toDate: '',
        enable: 0,
        limitBindPhone: 0,
        joinKind: 0,
        totalJoinCount: 0,
        joinTimesDay: 0,
        joinIntegral: 0,
        givedKind: 0,
        winningLimit:1,
				eachJoinCount: 0,
				joinCountLimit: 0,
				eachJoinInterval: 0,
        totalWinningCount: 0,
        joinRanks: [],
        wxgroupSelect: [],
        isShowJoinTime: 1,
        isShowWinnings: 1,
        virtualJoinTime: 0,
        shareImg: '',
        shareTitle: '',
        remark: '',
				shareDesc: '',
				shareRuleId: 0,
				posterImg: ''
      },
      formPageItem: {
        activityDescription: '',
        pushImg: '',
        actBgImg: ''
      },
      ruleValidate: {
        name: [{required: true, message: '活动名称不能为空', trigger: 'blur'}],
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
				totalWinningCount: [{required: true, type:'number', trigger: 'change', validator:(rule, value, callback) => {
							if (value === 0 || !value) {
										callback(new Error('奖品次数不能为空'));
							} else {
										callback();
							}
				}}],
				// joinKind: [{required: true, type:'number', trigger: 'change', validator:(rule, value, callback) => {
				// 			if (value === 0 || !value) {
				// 						callback(new Error('限定类型不能为空'));
				// 			} else {
				// 						callback();
				// 			}
				// }}],
				totalJoinCount: [{required: true, type:'number', trigger: 'change', validator:(rule, value, callback) => {
							if (value === 0 || !value) {
										callback(new Error('单个会员参与次数不能为空'));
							} else {
										callback();
							}
				}}],
				eachJoinCount: [{required: true, type:'number', trigger: 'change', validator:(rule, value, callback) => {
							if (value === 0 || !value) {
										callback(new Error('每天可参与次数不能为空'));
							} else {
										callback();
							}
				}}],
				eachJoinInterval: [{required: true, type:'number', trigger: 'change', validator:(rule, value, callback) => {
							if (value === 0 || !value) {
										callback(new Error('间隔分钟数不能为空'));
							} else {
										callback();
							}
				}}],
				prizeLimit: [{required: true, trigger: 'change', validator:(rule, value, callback) => {
							if (value === 0 || !value) {
										callback(new Error('中奖类型不能为空'));
							} else {
										callback();
							}
				}}],
				shareRuleId: [{required: true, trigger: 'change', validator:(rule, value, callback) => {
							if (value === 0 || !value) {
										callback(new Error('请绑定分享规则'));
							} else {
										callback();
							}
				}}]
      },
      levelList: [],
      prizesList: [],
      thanksArr: [],
			shareRuleList:[],
			customPage: {},
			kind_arr: {}
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
			console.log("type",this.type)
      this.spinShow = true;
      this.$ajax.post(this.$api.MatrixLotteryActivityInfo, {
				type: lotteryType[this.type],
        activityId: this.id
      })
      .then(response => {
        const res = response.data;
        if (res.code) {
          let data = res.data,
              main = data.data,
              imgCol = data.bg_img;
          if (data) {
            if (main) {
							let activityInfo = main.activityInfo || {};
              this.formItem = {
                ...activityInfo,
                wxgroupSelect: main.channelLimitList,
                validTimeRange: [activityInfo.startTime, activityInfo.endTime]
              };
              this.formPageItem.activityDescription = main.activityDescription || "";
              this.formPageItem.pushImg = main.pushImg || "";
              this.formPageItem.actBgImg = main.actBgImg || "";
              this.prizesList = main.prizeList;
							this.customPage = main.customPage || {};
              // 接口没处理，自己处理下
              this.thanksArr = {
                relatedValue: 0,
                prizeName: '',
                prizeTotals: 0,
                joinPoolNumber: 0,
                sort: 0,
                isDefault: true, //标识默认
                prizeType: 0, //不取接口的，前端自己处理,最后传值再按接口来
								prizeLimitValue: 0,
								prizeRate: 0,
								...main.thanksArr,
              };
            }
						if(this.$refs["lotteryPage"]){
							if(this.id){
								this.$refs["lotteryPage"].initModuleData(this.customPage);
							} else {
								this.$refs["lotteryPage"].initModuleData(data.customPage);
							}
							
						}
						this.kind_arr = data.kind_arr || {};
						this.shareRuleList = data.share_rule || [];
            this.$emit('getPrizeList', this.prizesList, this.thanksArr, imgCol);
						this.$emit('getActivityInfo', (main && main.activityInfo) || {});
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
						//动态调整下一步的奖项列表标题
						this.$emit('getActivityInfo', this.formItem || {});
          } else{
						this.$Message.error("请完善活动信息");
					}
        });
      } else if (this.currentStep === 1) {
        // 直接找到插槽内容
        let p = this.$slots.content[0].context;
        return p.handleValidate(valid => {
          if (valid) {
            this.currentStep++;
          } else {
						this.$Message.error("请完善奖项信息");
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
        }
      })
    },
    confirm () {
      let p = this.$slots.content[0].context;
      let prizesList = p.tableData.data || [];
      prizesList = this.handleData(prizesList);
      this.spinShow = true;
			let formItem = this.formItem || {};
			formItem.startTime = (formItem.validTimeRange && formItem.validTimeRange[0]) || "";
			formItem.endTime = (formItem.validTimeRange && formItem.validTimeRange[1]) || "";
			if(!formItem.activityId) formItem.activityId = 0;
      return this.$ajax.post(this.id ? this.$api.MatrixLotteryActivityEdit : this.$api.MatrixLotteryActivityAdd, {
        activityInfo: {
					...this.formItem,
					joinRanks: '',
					typeCode: lotteryType[this.type],
				},
				packageInfo: {
					giftPackageName: "",
					giftPackageImg: "",
					prizeRate: 0,
				},
				prizeList: prizesList,
				customPage: this.customPageHandle()
      })
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.$Message.success(res.message || "编辑成功");
          this.$emit('allow');
          // this.$router.go(-1);
					this.$router.push({
					  name: `matrix-lottery-activity-list`
					})
        }
        this.spinShow = false;
      });
    },
		customPageHandle(){
			let customPage = this.customPage || {};
			let moduleList = JSON.parse(JSON.stringify(this.$store.state.app.pageCompList)) || [];
			let setting = JSON.parse(JSON.stringify(this.$store.state.app.pageInfo.setting)) || {};
			for(let i = 0; i < moduleList.length; i++){
				let _setting = moduleList[i].setting || "";
				moduleList[i].setting = JSON.stringify(_setting);
			}
			// console.log(JSON.stringify({
			// 	pageId: this.customPage.pageId || 0,
			// 	setting: (setting && JSON.stringify(setting)) || "",
			// 	moduleList: moduleList 
			// }))
			return {
				pageId: this.customPage.pageId || 0,
				setting: (setting && JSON.stringify(setting)) || "",
				moduleList: moduleList 
			}
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
