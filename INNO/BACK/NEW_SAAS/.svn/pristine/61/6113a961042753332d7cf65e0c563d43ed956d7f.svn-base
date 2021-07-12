<template>
  <PageTopBase class="live-broadcast" isSave @save="confirm">
    <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="140">
      <FormItem label="活动名称" prop="activity_name">
        <Input v-model="formItem.activity_name" placeholder="请输入活动名称" class="basic_input basic_input_fixed" :maxlength="30" show-word-limit/>
      </FormItem>
      <FormItem label="活动时间" prop="validTimeRange">
        <DatePicker v-model="formItem.validTimeRange" type="datetimerange" placeholder="请选择活动时间" class="time_range" @on-change="handleDateChange"></DatePicker>
      </FormItem>
      <FormItem label="活动图片" prop="activity_image">
        <image-edit :img="formItem.activity_image" @selectImg="openImagesModal('activity_image', formItem.activity_image )" @delImg="handleDelImg('activity_image')">
          <p class="strong_tips">图片尺寸最佳是800*640，格式为 jpg 或 png，图片大小控制在1M</p>
        </image-edit>
      </FormItem>
      <FormItem label="是否启用" prop="is_enabled">
        <i-switch size="large" v-model="formItem.is_enabled" true-value="1" false-value="0">
          <span slot="open">启用</span>
          <span slot="close">关闭</span>
        </i-switch>
      </FormItem>
      <FormItem label="活动排序">
        <edit-sort v-model="formItem.sort" @checkVaild="handleSort"></edit-sort>
      </FormItem>
      <FormItem label="规则描述" prop="activity_rule">
        <Input
          type="textarea"
          class="basic_textarea"
          v-model="formItem.activity_rule"
          placeholder="请输入规则描述"
          :rows="3"
          :maxlength="150"
          show-word-limit/>
      </FormItem>
      <FormItem label="满足直播抽奖" prop="request_number">
        <InputNumber :min="1" v-model="formItem.request_number"></InputNumber>
        <span>抽奖人数</span>
        <p class="strong_tips">邀请人数达到后会给与满足抽奖标识</p>
      </FormItem>
      <FormItem label="邀请限制" prop="join_times">
        <InputNumber :min="1" v-model="formItem.join_times"></InputNumber>
        <p class="strong_tips">同一会员被邀请次数限制，0为不允许分享</p>
      </FormItem>
      <FormItem label="关联直播" prop="room_id">
        <Select v-model="formItem.room_id" class="basic_select">
          <Option v-for="item in roomList" :value="item.id" :key="item.id">{{item.name}}</Option>
        </Select>
      </FormItem>
      <FormItem label="活动规则">
        <Table :columns="tableColumns" :data="tableData" ref="myTable">
          <template slot-scope="{ row, index }" slot="request_number">
            <InputNumber :min="0" v-model="row.request_number" @on-change="e => handleInvitePeople(e, index)"></InputNumber>
          </template>
          <template slot-scope="{ row, index }" slot="condition_name">
            <Input v-model="row.condition_name" @on-change="e => handlePrizeName(e, index)" placeholder="请输入奖品别名"/>
          </template>
          <template slot-scope="{ row, index }" slot="gived_point">
            <InputNumber :min="0" v-model="row.gived_point" @on-change="e => handlePoints(e, index)"></InputNumber>
          </template>
          <template slot-scope="{ row, index }" slot="gived_coupons">
            <coupon-select :data="row.gived_coupons" type="checkbox" @del-tag="data => handleCouponClose(data, index)">
              <Button type="dashed" @click="handleCouponSelected(index)" class="basic_select">选择优惠券</Button>
            </coupon-select>
          </template>
          <template slot-scope="{ row, index }" slot="handle">
            <a @click="handleDel(index)">删除</a>
          </template>
        </Table>
        <Button type="primary" @click="createRule">增加一级规则</Button>
      </FormItem>
    </Form>
  </PageTopBase>
</template>

<script>
import PageTopBase from '@/views/my-components/page-top-base/index';
import ImageEdit from '@/views/my-components/image-edit/image-edit';
import EditSort from '@/views/my-components/edit-sort/edit-sort';
import CouponSelect from '@/views/my-components/list-component/index-edit';

export default {
  props: {
    id: {
      type: [Number, String],
      default: 0
    }
  },
  components: {
    PageTopBase,
    ImageEdit,
    EditSort,
    CouponSelect
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
        activity_name: '',
        validTimeRange: [],
        from_time: '',
        to_time: '',
        activity_image: '',
        activity_rule: '',
        is_enabled: '0',
        sort: 0,
        request_number: 0,
        join_times: 0,
        room_id: 0
      },
      ruleValidate: {
        activity_name: [{required: true, message: '活动名称不能为空', trigger: 'blur'}],
        validTimeRange: [{required: true, trigger: 'change', type: 'array', validator: checkValidRange}],
        activity_image: [{required: true, message: '活动图片不能为空', trigger: 'change'}],
        room_id: [{required: true, message: '关联直播不能为空', trigger: 'change', type: 'number'}],
      },
      tableColumns: [
        {
          title: '成功邀请/(人)',
          key: '',
          slot: 'request_number'
        },
        {
          title: '奖品别名',
          key: '',
          slot: 'condition_name'
        },
        {
          title: '活动赠送 积分',
          key: '',
          slot: 'gived_point'
        },
        {
          title: '优惠券',
          key: '',
          slot: 'gived_coupons'
        },
        {
          title: '操作',
          key: 'handle',
          slot: 'handle'
        },
      ],
      tableData: [],
      spinShow: false,
      sortVaild: false,
      roomList: []
    }
  },
  methods: {
    loadExtraData() {
      this.spinShow = true;
      return this.$ajax.post(this.$api.seachLiveRoom, {
        live_status: '101,102,105'
      })
      .then(response => {
        const res = response.data;
        if (res.code) {
          let data = res.data && res.data.items;
          this.roomList = data;
          this.spinShow = false;
        }
      });
    },
    loadData () {
      this.spinShow = true;
      return this.$ajax.post(this.$api.liveBroadcastActivityInfo, {
        id: this.id
      })
      .then(response => {
        const res = response.data;
        if (res.code) {
          let data = res.data && res.data.items;
          this.formItem = Object.assign(data, {
            request_number: +data.request_number,
            join_times: +data.join_times,
            room_id: +data.room_id,
            validTimeRange: [data.from_time, data.to_time]
          })
          this.tableData = data.activity_rule_data.map(item => {
            item.gived_coupons = item.bonus_arr;
            return item;
          });
          this.spinShow = false;
        }
      });
    },
    createRule () {
      this.tableData.push({
        request_number: 0,
        condition_name: '',
        gived_point: 0,
        gived_coupons: []
      })
    },
    handleCouponSelected (index) {
      this.$selectContent({
        mode: 'coupon',
        type: 'checkbox',
        data: this.tableData[index].gived_coupons,
        getList: (data) => {
          this.tableData[index].gived_coupons = data;
        }
      })
    },
    handleCouponClose (data, index) {
      this.tableData[index].gived_coupons = data;
    },
    handleInvitePeople (val, index) {
      this.tableData[index].request_number = val;
    },
    handlePoints (val, index) {
      this.tableData[index].gived_point = val;
    },
    handlePrizeName (e, index) {
      let val = e.target.value;
      this.tableData[index].condition_name = val;
    },
    handleDel (index) {
      this.tableData.splice(index, 1);
    },
    handleDateChange ([from_time, to_time]) {
      this.formItem.from_time = from_time;
      this.formItem.to_time = to_time;
    },
    openImagesModal (name, url) {
      this.$selectMaterial({
        type: 'image',
        selectedData: url,
        getList: (item) => {
          this.formItem[name] = item.src;
          if (name === 'activity_image') this.$refs.formValidate.validateField('activity_image');
        }
      });
    },
    handleDelImg (name) {
      this.formItem[name] = '';
    },
    handleSort (bool) {
      this.sortVaild = bool;
    },
    confirm () {
      this.$refs.formValidate.validate((valid) => {
        if (valid) {
          this.spinShow = true;
          let data = JSON.parse(JSON.stringify(this.tableData));
          // ajax 保存数据，头像是通过字符串的形式上传的
          this.$ajax.post((this.id === 0 ? this.$api.liveBroadcastActivityAdd : this.$api.liveBroadcastActivityEdit), {
            ...this.formItem,
            id: this.id,
            activity_rule_data: data.map(item => {
              item.gived_coupons = item.gived_coupons.map(c => c.id).join();
              return item;
            })
          })
		    		.then((response) => {
		    			var res = response.data;

		    			if (res.code) {
		    				// 保存成功
                this.$Message.success(res.message);
                this.modalShow = false;

                // 把数据返回给父级
                this.$emit('on-success');
                this.spinShow = false;
                this.$router.go(-1);
	              } else {
		    				this.showLoading();
		    			}
		    		});
        } else {
          // 验证失败，不关闭模态框
          this.showLoading();
        }
      });
    }
  },
  created () {
    if (this.id) this.loadData();
    this.loadExtraData();
  }
}
</script>
<style lang="less">
.live-broadcast{
  .basic_input_fixed, .basic_textarea{
    max-width: 420px;
  }
  .time_range{
    width: 340px;
  }
}
</style>
<style lang="less" scoped>
.bargin-activity-select-wrapper{
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
