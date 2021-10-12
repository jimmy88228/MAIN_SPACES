<template>
  <PageTopBase isSave @save="confirm">
    <div class="pop-activity">
      <div class="ui">
        <AssetsUI :color="formItem.bg_color" :coupon-data="couponData"/>
      </div>
      <div class="content">
        <Form ref="formValidate" :model="formItem" :rules="validate" :label-width="140">
          <FormItem label="活动名称" prop="name">
            <Input v-model="formItem.name" placeholder="请输入活动名称" class="basic_input basic_input_fixed" :maxlength="30" show-word-limit/>
          </FormItem>
          <FormItem label="活动时间" prop="validTimeRange">
            <DatePicker v-model="formItem.validTimeRange" type="datetimerange" placeholder="请选择活动时间" class="time_range" @on-change="handleTime"></DatePicker>
          </FormItem>
          <FormItem label="排序号">
            <edit-sort v-model="formItem.sort" @checkVaild="handleSort"></edit-sort>
          </FormItem>
          <FormItem label="弹窗背景色">
            <ColorPicker v-model="formItem.bg_color"/>
          </FormItem>
          <FormItem label="活动状态" prop="enable">
            <i-switch size="large" v-model="formItem.enable" true-value="1" false-value="0">
              <span slot="open">开启</span>
              <span slot="close">关闭</span>
            </i-switch>
          </FormItem>
          <FormItem label="提醒类型">
            <p>优惠券</p>
          </FormItem>
          <FormItem label="显示内容" prop="showContent">
            
            <CheckboxGroup v-model="formItem.showContent">
              <Row>
                <Col span="24">
                  <Checkbox label="0">即将到期
                  <InputNumber v-model="formItem.expire_day" :min="0" />天</Checkbox>
                  <span>显示用户X天内即将到期优惠券(领取时不足X天的不提醒)</span>
                </Col>
                <Col span="24">
                  <Checkbox label="1">资产总数</Checkbox>
                  <span>显示用户资产总数量</span>
                </Col>
              </Row>
            </CheckboxGroup>
          </FormItem>
          <FormItem label="推广频次">
            <RadioGroup v-model="formItem.boardType">
              <Radio label="0">1次性推送</Radio>
              <Radio label="1">
                <span>多次性推送</span>
              </Radio>
            </RadioGroup>
            <p class="strong_tips">对目标人群推送1次,活动时间内对目标人群进行多次推送</p>
            <FormItem label="每" prop="frequency" :label-width="40" v-if="formItem.boardType == 1">
              <InputNumber v-model="formItem.frequency" :min="1" placeholder="时间间隔" :disabled="formItem.boardType == 0"/>
              <span>天推送1次</span>
            </FormItem>
          </FormItem>
          <FormItem label="推广人群">
            <RadioGroup v-model="formItem.user_limit">
              <Radio label="0">所有人群</Radio>
              <Radio label="1">指定人群</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem label="享受优惠会员等级" prop="rank_data" v-show="formItem.user_limit == 1">
            <Select v-model="formItem.rank_data" multiple class="basic_select">
              <Option v-for="item in levelList" :value="item.rank_id" :key="item.rank_id">{{ item.rank_name }}</Option>
            </Select>
          </FormItem>
          <FormItem label="所属店铺" v-show="formItem.user_limit == 1">
            <store-select :data="storeData" type="checkbox" @del-tag="handleStoreClose">
              <Button type="dashed" @click="handleStoreSelected" class="basic_select">选择所属店铺</Button>
            </store-select>
          </FormItem>
          <p style="color:red;">*仅在首页显示</p>
        </Form>
      </div>
    </div>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </PageTopBase>
</template>

<script>
import PageTopBase from '@/views/my-components/page-top-base/index';
import EditSort from '@/views/my-components/edit-sort/edit-sort';
import ImageEdit from '@/views/my-components/image-edit/image-edit';
import StoreSelect from '@/views/my-components/list-component/index-edit';
import AssetsUI from './assets-ui';

export default {
  props: ['id'],
  components: {
    PageTopBase,
    EditSort,
    ImageEdit,
    StoreSelect,
    AssetsUI
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
        name: '',
        validTimeRange: [],
        start_time: '',
        end_time: '',
        sort: 0,
        activeImage: '',
        bg_color: '#8240de',
        showContent: [],
        expire_day:0,
        enable: '1',
        boardType: '0',
        frequency: 1,
        user_limit: '0',
        rank_data: [],
        adList: []
      },
      validate: {
        name: [{
          required: true,
          message: '活动名称不能为空',
          trigger: 'blur'
        }],
        validTimeRange: [{required: true, trigger: 'change', type: 'array', validator: checkValidRange}],
        activeImage: [{required: true, message: '活动图片不能为空', trigger: 'change'}],
        frequency: [{
          required: true,
          message: '天数不能为空',
          trigger: 'blur',
          type: 'number'
        }],
        adList: [
          {
            required: true,
            message: '广告图不能为空',
            trigger: 'change',
            type: 'array',
            min: 1
          }
        ],
        showContent: [{
          required: true,
          message: '显示内容不能为空',
          trigger: 'change',
          type: 'array',
          min: 1
        }]
      },
      storeData: [],
      levelList: [],
      columns: [
        {
          title: '广告图',
          key: 'src',
          slot: 'src'
        },
        {
          title: '跳转地址',
          key: 'link',
          slot: 'link'
        },
        {
          title: '操作',
          key: 'handle',
          slot: 'handle'
        }
      ],
      couponData: {
        name: 'super',
        num: 10,
        list: [
          {
            name: '折扣券',
            outday: 2,
            discount: 1.8,
            type: 1,
            canUse: true
          },
          {
            name: '满减券',
            outday: 1,
            discount: 100,
            type: 2,
            canUse: false
          }
        ]
      },
      sortVaild: false,
      spinShow: false
    }
  },
  methods: {
    loadData () {
      this.spinShow = true;
      this.$ajax.post(this.$api.popupAdvertRemindInfo, {
        id: this.id
      })
      .then(response => {
          const res = response.data;
          if (res.code) {
            if (res.data && res.data.rank) {
              this.levelList = res.data.rank;
            }
            let data = res.data && res.data.items;
            if (data) {
              this.formItem = {
                ...res.data.items,
                validTimeRange: [data.begin_time, data.end_time],
                start_time: data.begin_time, //有空去统一字段吧，暂时随意
                sort: +data.sort,
                showContent: +data.assets_content === 3 ? ['0', '1'] : (+data.assets_content === 2 ? ['1'] : ['0']),
                expire_day:Number(data.expire_day),
                boardType: +data.frequency > 0 ? '1' : '0',
                frequency: +data.frequency,
                rank_data: data.rank_data.map(item => item.rank_id)
              };
              this.storeData = data.store_data;
            }
          }
          this.spinShow = false;
        });
    },
    handleTime ([start_time, end_time]) {
      this.formItem.start_time = start_time;
      this.formItem.end_time = end_time;
    },
    handleSort (bool) {
      this.sortVaild = bool;
    },
    openImagesModal (name, url) {
      this.$selectMaterial({
        type: 'image',
        selectedData: url,
        getList: (item) => {
          this.formItem[name] = item.src;
          if (name === 'activeImage') this.$refs.formValidate.validateField('activeImage');
        }
      });
    },
    handleDelImg (name) {
      this.formItem[name] = '';
    },
    handleAdList () {
      this.$selectMaterial({
        type: 'image',
        multi: 1,
        selectedData: this.formItem.adList.map(item => item.src),
        getList: (item) => {
          item.forEach(c => {
            let ids = this.formItem.adList.map(item => item.id);
            if (!ids.includes(c.id)) {
              this.formItem.adList.push({
                ...c,
                link: ''
              });
            }
          });
          this.$refs.formValidate.validateField('adList');
        }
      });
    },
    handleLinkChange (index, val) {
      this.formItem.adList[index].link = val;
    },
    handleDel (index) {
      this.formItem.adList.splice(index, 1);
    },
    handleStoreSelected (selected) {
      this.$selectContent({
        mode: 'store',
        type: 'checkbox',
        data: this.storeData,
        getList: (data) => {
          this.storeData = data;
        }
      });
    },
    handleStoreClose (data) {
      this.storeData = data;
    },
    confirm (){
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          this.spinShow = true;
          this.$ajax.post(this.id ? this.$api.popupAdvertRemindEdit : this.$api.popupAdvertRemindAdd, {
            id: this.id,
            user_limit_state: 2,
            name: this.formItem.name,
            start_time: this.formItem.start_time,
            end_time: this.formItem.end_time,
            sort: this.formItem.sort,
            bg_color: this.formItem.bg_color,
            enable: this.formItem.enable,
            user_limit: this.formItem.user_limit,
            frequency: this.formItem.frequency,
            expire_day:this.formItem.expire_day,
	          assets_type: 'BONUS',
            assets_content: this.formItem.showContent.includes('0') && this.formItem.showContent.includes('1') ? 3 : (this.formItem.showContent.includes('0') ? 1 : 2),
            rank_data: this.formItem.rank_data.join(),
            store_data: this.storeData.map(item => item.id).join()
          })
          .then(response => {
            const res = response.data;
            if (res.code) {
              this.data = res.data;
              this.$Message.success(res.message);
              this.$router.go(-1);
            }
            this.spinShow = false;
          });
        }
      })
    }
  },
  mounted () {
    this.loadData();
  }
}
</script>

<style lang="less" scoped>
.pop-activity{
  display: flex;
  align-items: flex-start;
  .ui{
    margin-right: 24px;
  }
  .basic_input_fixed, .basic_textarea{
    max-width: 420px;
  }
  .time_range{
    width: 340px;
  }
}
</style>
