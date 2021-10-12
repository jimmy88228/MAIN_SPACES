<template>
  <PageTopBase isSave @save="confirm">
    <div class="pop-activity">
      <div class="ui">
        <ActivityUi :color="formItem.bg_color" :top-img="formItem.top_picture" :content="formItem.adList"/>
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
          <FormItem label="顶部宣传图" prop="top_picture">
            <image-edit :img="formItem.top_picture" @selectImg="openImagesModal('top_picture', formItem.top_picture )" @delImg="handleDelImg('top_picture')">
              <p class="strong_tips">图片尺寸最佳是640*200，格式为 jpg, gif 或 png，图片大小控制在200KB</p>
            </image-edit>
          </FormItem>
          <FormItem label="弹窗背景色">
            <ColorPicker v-model="formItem.bg_color"/>
          </FormItem>
          <FormItem label="广告位" prop="adList">
            <p class="strong_tips">图片尺寸最佳是580*400/580*200，格式为 jpg 或 png，图片大小控制在200KB</p>
            <Button type="primary" @click="handleAdList">选择广告位</Button>
            <Table :columns="columns" :data="formItem.adList" width="600" ref="myTable">
              <template slot-scope="{ row }" slot="src">
                <div class="img_list_wrap">
                  <div class="img_fixed">
                    <img :src="row.src" v-if="row.src" v-viewer/>
                    <img src="@rs/images/default-img.jpg" v-viewer v-else/>
                  </div>
                </div>
              </template>
              <template slot-scope="{ row, index }" slot="link">
                <Input v-model="row.link" @on-change="handleLinkChange(index, row.link)" placeholder="请输入跳转地址"/>
              </template>
              <template slot-scope="{ index }" slot="handle">
                <p><a @click="handleDel(index)">删除</a></p>
              </template>
            </Table>
          </FormItem>
          <FormItem label="活动状态" prop="enable">
            <i-switch size="large" v-model="formItem.enable" true-value="1" false-value="0">
              <span slot="open">开启</span>
              <span slot="close">关闭</span>
            </i-switch>
          </FormItem>

          <FormItem label="推广频次">
            <RadioGroup v-model="formItem.frequency_type">
              <Radio label="0">一次性推送</Radio>
              <Radio label="1">
                <span>每多天推送</span>
              </Radio>
              <Radio label="2">
                <span>每天推送多次</span>
              </Radio>
            </RadioGroup>

            <p class="strong_tips" v-if="formItem.frequency_type != 0">对目标人群推送1次,活动时间内对目标人群进行多次推送</p>
            <FormItem label="每" prop="frequency_day" :label-width="40" v-if="formItem.frequency_type == 1">
              <InputNumber v-model="formItem.frequency_day" :min="1" placeholder="时间间隔"/>
              <span>天推送1次</span>
            </FormItem>
            <FormItem label="每天推送" prop="frequency" :label-width="80" v-if="formItem.frequency_type == 2">
              <InputNumber v-model="formItem.frequency" :min="1" placeholder="时间间隔"/>
              <span>次</span>
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
          <FormItem label="所属店铺" prop="store_data" v-show="formItem.user_limit == 1">
            <store-select :data="storeData" type="radio" @del-tag="handleStoreClose">
              <Button type="dashed" @click="handleStoreSelected" class="basic_select">选择所属店铺</Button>
            </store-select>
          </FormItem>
          <FormItem label="推广页面">
				<CheckboxGroup v-model="formItem.is_index" >
					<Checkbox label="1">首页</Checkbox>
                    <Checkbox label="2">个人中心</Checkbox>
                    <Checkbox label="3">签到</Checkbox>
					<Checkbox label="0">自定义页</Checkbox>
                    <Checkbox label="4">支付成功页</Checkbox>
				</CheckboxGroup>
            <store-select :data="pageData" type="checkbox" @del-tag="handlePageClose" v-show="showCustom">
              <Button type="dashed" @click="handlePageSelected" class="basic_select">选择页面</Button>
            </store-select>
          </FormItem>
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
import PageSelect from '@/views/my-components/list-component/index-edit';
import ActivityUi from './activity-ui';

export default {
  props: ['id'],
  components: {
    PageTopBase,
    EditSort,
    ImageEdit,
    StoreSelect,
    ActivityUi,
    PageSelect
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
        top_picture: '',
        bg_color: '#8240de',
        enable: '1',
        boardType: '0',
        frequency_type: '0',
        frequency: 1,
        frequency_day:0,
        user_limit: '0',
        rank_data: [],
        store_data: 0,
        adList: [],
        is_index: [],
        page_id:'0',
      },
      validate: {
        name: [{
          required: true,
          message: '活动名称不能为空',
          trigger: 'blur'
        }],
        validTimeRange: [{required: true, trigger: 'change', type: 'array', validator: checkValidRange}],
        top_picture: [{required: true, message: '活动图片不能为空', trigger: 'change'}],
        /*frequency: [{
          required: true,
          message: '天数不能为空',
          trigger: 'blur',
          type: 'number'
        }],*/
        adList: [
          {
            required: true,
            message: '广告图不能为空',
            trigger: 'change',
            type: 'array',
            min: 1
          }
        ]
      },
      storeData: [],
      pageData: [],
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
      sortVaild: false,
      freezeAd: [],
      spinShow: false
    }
  },
  computed:{
	  showCustom(){
		  let is_index = this.formItem.is_index;
		  return is_index.indexOf("0") != -1;
	  }
  },
  methods: {
    loadData () {
      this.spinShow = true;
      this.$ajax.post(this.$api.popupAdvertInfo, {
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
                var frequency = 1;
                var frequency_day = 1;
                if (data.frequency_type == 1){
                    frequency_day = parseInt(data.frequency);
                } else if (data.frequency_type == 2){
                    frequency = parseInt(data.frequency);
                }

              this.formItem = {
                ...res.data.items,
                validTimeRange: [data.begin_time, data.end_time],
                start_time: data.begin_time, //有空去统一字段吧，暂时随意
                sort: +data.sort,
                adList: data.get_items.filter(item => {
                  item.src = item.picture;
                  item.link = item.jump_value;
                  return true;
                }),
                boardType: +data.frequency > 0 ? '1' : '0',
                frequency_type: data.frequency_type,
                frequency: frequency,
                frequency_day: frequency_day,
                rank_data: data.rank_data.map(item => item.rank_id),
				        is_index: !(data.is_index instanceof Array) ? (data.is_index + "").split(",") : data.is_index
              };
              this.freezeAd = JSON.parse(JSON.stringify(this.formItem.adList));
              this.storeData = data.store_data;
              this.pageData = data.page_data;
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
          if (name === 'top_picture') this.$refs.formValidate.validateField('top_picture');
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
    handlePageSelected (selected) {
      this.$selectContent({
        mode: 'pages',
        type: 'checkbox',
        data: this.pageData,
        getList: (data) => {
          this.pageData = data;
          let page_ids= data.map(item => item.id);
          this.formItem.page_id =page_ids.join(',');
         
        }
      });
    },
    handlePageClose (data) {
      this.pageData = data;
      if(data.length>0){
        let page_ids= data.map(item => item.id);
        this.formItem.page_id =page_ids.join(',');
      }else{
        this.formItem.page_id ='0';
      }
    },
    confirm (){
      this.$refs.formValidate.validate(valid => {
        if (valid) {
          this.spinShow = true;
					let formItem = this.formItem || {};
					let hasCustom = formItem.is_index instanceof Array && (formItem.is_index.indexOf("0") != -1 || formItem.is_index.indexOf(0) != -1)
        this.$ajax.post(this.id ? this.$api.popupAdvertEdit : this.$api.popupAdvertAdd, {
            id: this.id,
            advertising_data_state: JSON.stringify(this.freezeAd) === JSON.stringify(formItem.adList) ? 1 : 2,
            user_limit_state: 2,
            name: formItem.name,
            start_time: formItem.start_time,
            end_time: formItem.end_time,
            sort: formItem.sort,
            top_picture: formItem.top_picture,
            bg_color: formItem.bg_color,
            enable: formItem.enable,
            user_limit: formItem.user_limit,
            frequency_type: formItem.frequency_type,
            frequency: formItem.frequency,
            frequency_day: formItem.frequency_day,
            is_index: formItem.is_index,
            page_id: hasCustom ? formItem.page_id : '0',
            advertising_data: formItem.adList.map(item => {
              return {
                picture: item.src,
                jump_value: item.link
              }
            }),
            rank_data: formItem.rank_data.join(),
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
