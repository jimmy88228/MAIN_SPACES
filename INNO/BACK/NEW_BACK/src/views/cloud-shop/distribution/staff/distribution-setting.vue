<template>
  <Card class="distribution-setting">
    <div class="btn">
      <Button type="primary" @click="confirm">保存</Button>
    </div>
    <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="140">
      <FormItem label="是否启用分销" prop="is_enabled">
        <i-switch size="large" v-model="formItem.is_enabled" @on-change="onchange" true-value="Y" false-value="N">
          <span slot="open">开启</span>
          <span slot="close">关闭</span>
        </i-switch>
      </FormItem>
      <FormItem label="自下单是否计算提成" prop="is_self_order_enable">
        <i-switch size="large" v-model="formItem.is_self_order_enable" :disabled="formItem.new_second_level_cash_back_self_get == '0'" true-value="Y" false-value="N">
          <span slot="open">开启</span>
          <span slot="close">关闭</span>
        </i-switch>
      </FormItem>
      <FormItem label="启用二级分销新规则" prop="is_snd_enabled" v-if="formItem.is_dstb_new_rule">
        <i-switch size="large" v-model="formItem.is_snd_enabled" true-value="Y" false-value="N" :disabled="formItem.is_enabled == 'N'">
          <span slot="open">开启</span>
          <span slot="close">关闭</span>
        </i-switch>
        <p class="strong_tips">注：开启时二级分销员自下单和上级分销员的提成 比例按新规则直接/间接比例计算分销达标奖励</p>
      </FormItem>
      <FormItem label="分销达标奖励" prop="reward">
        <i-switch size="large" v-model="formItem.reward" true-value="1" false-value="0" :disabled="formItem.is_enabled == 'N'">
          <span slot="open">开启</span>
          <span slot="close">关闭</span>
        </i-switch>
      </FormItem>
      <FormItem label="关系保护期" prop="relation_protect">
        <Select v-model="formItem.relation_protect_time_type" style="width:120px">
            <Option value="0">分钟</Option>
            <Option value="1">小时</Option>
            <Option value="2">天</Option>
            <Option value="3">月</Option>
            <Option value="4">年</Option>
        </Select>
        <InputNumber :min="0" v-model="formItem.relation_protect"></InputNumber>
        <p class="strong_tips">注：代表更换分销员关系的有效期</p>
      </FormItem>
      <FormItem label="提成有效期" prop="relation_exprie">
        <Select v-model="formItem.relation_expire_time_type" style="width:120px">
            <Option value="0">分钟</Option>
            <Option value="1">小时</Option>
            <Option value="2">天</Option>
            <Option value="3">月</Option>
            <Option value="4">年</Option>
        </Select>
        <InputNumber :min="0" v-model="formItem.relation_exprie"></InputNumber>
        <p class="strong_tips">注：代表分销员与粉丝提成关系有效期</p>
      </FormItem>
      <FormItem label="最小提现金额" prop="min_cashout">
        <InputNumber :min="0" v-model="formItem.min_cashout"></InputNumber>
      </FormItem>
      <FormItem label="最大提现金额" prop="max_cashout">
        <InputNumber :min="1" v-model="formItem.max_cashout"></InputNumber>
      </FormItem>
      <FormItem label="单日最大提现总金额" prop="max_cashout_oneday">
        <InputNumber :min="1" v-model="formItem.max_cashout_oneday"></InputNumber>
        <p class="strong_tips">0表示不限制</p>
      </FormItem>
      <FormItem label="提现金额必须为整数" prop="cashout_mustbe_integer">
        <i-switch size="large" v-model="formItem.cashout_mustbe_integer" true-value="1" false-value="0">
          <span slot="open">是</span>
          <span slot="close">否</span>
        </i-switch>
      </FormItem>
      <FormItem label="提现审核配置" prop="auto_cashout">
        <Select v-model="formItem.auto_cashout" class="basic_select">
          <Option value="0">手动审核</Option>
          <Option value="1">自动审核并转账</Option>
        </Select>
      </FormItem>
      <FormItem label="达标奖励计算周期" prop="calcDa">
        <InputNumber :min="0" v-model="formItem.calcDa"></InputNumber>
        <label>天 </label>
      </FormItem>
      <FormItem label="达标人数" prop="daPeople">
        <InputNumber :min="0" v-model="formItem.daPeople"></InputNumber>
        <label>人</label>
      </FormItem>
      <FormItem label="达标奖励金额" prop="daAmount">
        <InputNumber :min="0" v-model="formItem.daAmount"></InputNumber>
        <label>元</label>
      </FormItem>
      <FormItem label="发展二级分销员奖励金额" prop="develop_new_benefit">
        <InputNumber :min="0" v-model="formItem.develop_new_benefit"></InputNumber>
        <label>元</label>
        <p class="strong_tips">每成功发展一个获得奖励，可重复获得</p>
      </FormItem>
      <FormItem label="购买/申请分销员是否强制为二级" prop="limit_apply_staff_dstb_second_level">
        <i-switch size="large" v-model="formItem.limit_apply_staff_dstb_second_level" true-value="1" false-value="0">
          <span slot="open">是</span>
          <span slot="close">否</span>
        </i-switch>
      </FormItem>
      <FormItem label="分销中心新手指引" prop="guide">
        <page-select :data="formItem.pageData" type="radio" @del-tag="(data)=> handlePageClose(data, 'pageData')">
          <Button type="dashed" @click="handlePageSelected(1)" class="basic_select">选择活动页</Button>
        </page-select>
      </FormItem>
      <FormItem label="分享商品时详情里显示分销员名称和头像" prop="is_show_share_staffinfo">
        <i-switch size="large" v-model="formItem.is_show_share_staffinfo" true-value="1" false-value="0">
          <span slot="open">显示</span>
          <span slot="close">隐藏</span>
        </i-switch>
      </FormItem>
      <FormItem label="二级分销员是否允许绑定有一级分销关系史会员" prop="is_allow_bind_past_userby_sec_staff">
        <i-switch size="large" v-model="formItem.is_allow_bind_past_userby_sec_staff" true-value="1" false-value="0">
          <span slot="open">显示</span>
          <span slot="close">隐藏</span>
        </i-switch>
      </FormItem>
      <FormItem label="分销提成金额是否包含储值抵扣部分" prop="dstb_comm_include_offsurplus">
        <i-switch size="large" v-model="formItem.dstb_comm_include_offsurplus" :true-value="1" :false-value="0">
          <span slot="open">包含</span>
          <span slot="close">不包</span>
        </i-switch>
      </FormItem>
      <FormItem label="允许提现的分销员状态" prop="can_apply_cashout_duty_data">
        <CheckboxGroup v-model="formItem.can_apply_cashout_duty_data">
          <Checkbox label="1">在职</Checkbox>
          <Checkbox label="0">离职</Checkbox>
          <Checkbox label="2">兼职</Checkbox>
        </CheckboxGroup>
      </FormItem>
      <FormItem label="访问佣金模块的分销员状态" prop="can_visit_commission_duty_data">
        <CheckboxGroup v-model="formItem.can_visit_commission_duty_data">
          <Checkbox label="1">在职</Checkbox>
          <Checkbox label="0">离职</Checkbox>
          <Checkbox label="2">兼职</Checkbox>
        </CheckboxGroup>
      </FormItem>
      <FormItem label="允许提现时间" prop="limit_cashout_time_type">
        <RadioGroup  v-model="formItem.limit_cashout_time_type" @on-change="timeTypeChange">
          <Radio label="0">无限制</Radio>
          <Radio label="1">每周提现期</Radio>
          <Radio label="2">每月提现期</Radio>
        </RadioGroup>
        <p class="strong_tips">*如需修改提现期，需先切换为无限制后，再点击当前提现选项！</p>
      </FormItem>
      <FormItem label="提现说明" prop="limit_cashout_remark">
        <Input v-model="formItem.limit_cashout_remark"  show-word-limit type="textarea" :rows="4" style="width:420px;" />
      </FormItem>
      <FormItem label="分销员指南" prop="dstbPageData">
        <page-select :data="formItem.dstbPageData" type="radio" @del-tag="(data)=> handlePageClose(data, 'dstbPageData')">
          <Button type="dashed" @click="handlePageSelected(2)" class="basic_select">选择活动页</Button>
        </page-select>
      </FormItem>
    </Form>
    <Modal
        v-model="showWeek"
        title="每周提现期"
        @on-ok="onOkWeek"
        @on-cancel="onCancelWeek">
        <CheckboxGroup v-model="formItem.limit_cashout_week_time_data">
          <Checkbox style="width:100px;" label="1">周一</Checkbox>
          <Checkbox style="width:100px;" label="2">周二</Checkbox>
          <Checkbox style="width:100px;" label="3">周三</Checkbox>
          <Checkbox style="width:100px;" label="4">周四</Checkbox>
          <Checkbox style="width:100px;" label="5">周五</Checkbox>
          <Checkbox style="width:100px;" label="6">周六</Checkbox>
          <Checkbox style="width:100px;" label="7">周日</Checkbox>
        </CheckboxGroup>
    </Modal>
    <Modal
        v-model="showMouth"
        title="每月提现期"
        @on-ok="onOkMouth"
        @on-cancel="onCancelMouth">
        <CheckboxGroup v-model="formItem.limit_cashout_mouth_time_data">
          <Checkbox style="width:100px;" v-for="(items,index) in mouth" :key="index" :label="items" >{{items}}日</Checkbox>
        </CheckboxGroup>
        <p class="strong_tips">注：当提现期为月末时，需注意当月是否含有29、30、31号</p>
    </Modal>
  </Card>
</template>

<script>
import PageSelect from '@/views/my-components/list-component/index-edit';

export default {
  components: {
    PageSelect
  },
  data () {
    return {
      formItem: {
        is_enabled:'N',
        is_self_order_enable:'N',
        is_snd_enabled:'N',
        reward: '0',
        relation_protect: 0,
        relation_protect_time_type:'0',
        relation_exprie: 0,
        relation_expire_time_type:'0',
        min_cashout: 0,
        max_cashout: 1,
        max_cashout_oneday: 1,
        cashout_mustbe_integer: '0',
        auto_cashout: '-1',
        calcDa: 0,
        daPeople: 0,
        daAmount: 0,
        develop_new_benefit: 0,
        limit_apply_staff_dstb_second_level: '0',
        is_show_share_staffinfo: '0',
        is_allow_bind_past_userby_sec_staff: '0',
        dstb_comm_include_offsurplus:0,
        new_second_level_cash_back_self_get:0,
        can_apply_cashout_duty_data: [],
        can_visit_commission_duty_data: [],
        limit_cashout_week_time_data: [],
        limit_cashout_mouth_time_data: [],
        limit_cashout_time_value:'',
        limit_cashout_time_type:'0',
        limit_cashout_remark:'',
        pageData: [],
        dstbPageData:[],
        is_dstb_new_rule: false,
      },
      showWeek:false,
      showMouth:false,
      mouth:['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16',
      '17','18','19','20','21','22','23','24','25','26','27','28','29','30','31'],
      ruleValidate: {

      }
    }
  },
  methods: {
    onchange(){
      if(this.formItem.is_enabled=='N'){
        this.formItem.reward='0';
      }
    },
    timeTypeChange(){
      if(this.formItem.limit_cashout_time_type==1){
          this.showWeek=true;
      }
      if(this.formItem.limit_cashout_time_type==2){
          this.showMouth=true;
      }
      if(!this.formItem.limit_cashout_time_type){
          this.formItem.limit_cashout_time_value='';
      }
    },
    onOkWeek(){
       this.formItem.limit_cashout_time_value=this.formItem.limit_cashout_week_time_data.join(",");
    },
    onCancelWeek(){
       this.showWeek=false;
    },
    onOkMouth(){
       this.formItem.limit_cashout_time_value=this.formItem.limit_cashout_mouth_time_data.join(",");
       
    },
    onCancelMouth(){
       this.showMouth=false;
    },
    handlePageSelected  (row) {
      this.$selectContent({
        mode: 'pages',
        type: 'radio',
        data:row==1?this.formItem.pageData:this.formItem.dstbPageData,
        getList: (data) => {
          if(row==1){
              this.formItem.pageData = data;
          }else{
            this.formItem.dstbPageData = data;
          }
        }
      })
    },
    handlePageClose (data, type) {
      this.formItem.type = data;
    },
    confirm () {
      this.$store.commit('setLoading', true);
      return this.$ajax.post(this.$api.CloudDistributionSettingSave, {
        is_enabled: this.formItem.is_enabled,   //是否启用分销 Y 是 N 否
        is_snd_enabled: this.formItem.is_snd_enabled,  //是否启用二级分销 Y 是 N 否
        is_self_order_enable: this.formItem.is_self_order_enable,	//自下班是否计算提成Y 是 N 否
        is_new_snd_enabled: this.formItem.is_new_snd_enabled,	//是否启用二级分销新规则 Y 是 N 否
        relation_protect: this.formItem.relation_protect,	//关系保护期
        relation_protect_time_type: this.formItem.relation_protect_time_type,	//关系保护期类型
        relation_exprie: this.formItem.relation_exprie,		//提成有效期
        relation_expire_time_type: this.formItem.relation_expire_time_type,		//提成有效期类型
        min_cashout: this.formItem.min_cashout,	//最小提现金额
        max_cashout: this.formItem.max_cashout,	//最大提现金额
        max_cashout_oneday: this.formItem.max_cashout_oneday, //单日最大提现总金额
        cashout_mustbe_integer: this.formItem.cashout_mustbe_integer,	//提现金额必须为整数 1是 0否
        auto_cashout: this.formItem.auto_cashout,	//提现审核配置   0 手动审核  1自动审核
        develop_new_benefit: this.formItem.develop_new_benefit,  //发展二级分销员奖励金额
        limit_apply_staff_dstb_second_level: this.formItem.limit_apply_staff_dstb_second_level, ///购买/申请分销员是否强制为2级  1是 0否
        is_show_share_staffinfo: this.formItem.is_show_share_staffinfo,  //分享商品时详情里显示分销员名称和头像 1是 0否
        is_allow_bind_past_userby_sec_staff: this.formItem.is_allow_bind_past_userby_sec_staff,//二级分销员是否允许绑定有一级分销关系史会员  1是 0否
        dstb_comm_include_offsurplus: this.formItem.dstb_comm_include_offsurplus, //分销提成金额是否包含储值抵扣部分 1是 0否

        limit_cashout_time_type: this.formItem.limit_cashout_time_type, //允许提现时间
        limit_cashout_time_value: this.formItem.limit_cashout_time_value, //允许提现时间的值limit_cashout_remark
        limit_cashout_remark: this.formItem.limit_cashout_remark, //提现说明

        can_apply_cashout_duty: this.formItem.can_apply_cashout_duty_data.join(), //允许提现的分销员状态 1在职 2兼职 0离职
        can_visit_commission_duty: this.formItem.can_visit_commission_duty_data.join(),	//访问佣金模块的分销员状态 1在职 2兼职 0离职
        guide_page: this.formItem.pageData.map(item => item.id).join(),
        dstb_guide_page: this.formItem.dstbPageData.map(item => item.id).join(),
        activity_info: {
          benefit_money: this.formItem.daAmount, //达标奖励金额
          deadline_days: this.formItem.calcDa, //达标奖励计算周期
          is_enabled: this.formItem.reward, //分销达标奖励 1是 0否
          requires_mans: this.formItem.daPeople, //达标人数
          active_name: '' //默认
        }
      })
      .then(response => {
        const res = response.data;
        if (res.code) {
          this.$Message.success('保存成功!');
          return this.loadData();
        }
      }).finally(()=>{
        this.$store.commit('setLoading', false);
      })
    },
    loadData() {
      this.$store.commit('setLoading', true);
      return this.$ajax.post(this.$api.CloudDistributionSettingInfo)
      .then(response => {
        const res = response.data;
        if (res.code) {
          let data = res.data.items;
          this.formItem = Object.assign({}, data, {
            is_self_order_enable:data.is_self_order_enable,
            reward: data.activity_info.is_enabled,
            calcDa: +data.activity_info.deadline_days,
            daPeople: +data.activity_info.requires_mans,
            develop_new_benefit: +data.develop_new_benefit,
            daAmount: +data.activity_info.benefit_money,
            relation_protect: +data.relation_protect,
            relation_exprie: +data.relation_exprie,
            min_cashout: +data.min_cashout,
            max_cashout: +data.max_cashout,
            max_cashout_oneday: +data.max_cashout_oneday,
            pageData: [data.page_data],
            dstbPageData: [data.dstb_page_data],
            new_second_level_cash_back_self_get:+data.new_second_level_cash_back_self_get,
          })
        }
      }).finally(()=>{
        this.$store.commit('setLoading',false);
      })
    }
  },
  created () {
    this.loadData();
  }
}
</script>

<style lang="less" scoped>
.distribution-setting{
  .btn{
    text-align: right;
    margin-bottom: 24px;
  }
}
</style>
