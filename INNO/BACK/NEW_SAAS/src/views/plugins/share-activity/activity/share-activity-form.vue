<template>
  <PageTopBase isSave @save="confirm">
    <div class="birthday-love-form">
      <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="140">
        <FormItem label="活动名称" prop="active_name">
          <Input v-model="formItem.active_name" placeholder="请输入活动名称" class="basic_input basic_input_fixed" :maxlength="30" show-word-limit/>
        </FormItem>

        <FormItem label="活动时间" prop="activityDate">
          <DatePicker v-model="formItem.activityDate" type="datetimerange" placeholder="请选择活动时间" class="time_range"  @on-change="handleTimeRange"></DatePicker>
        </FormItem>

        <FormItem label="是否启用" prop="is_enabled">
          <i-switch v-model="formItem.is_enabled" true-value="1" false-value="0">
            <span slot="open">启用</span>
            <span slot="close">关闭</span>
          </i-switch>
        </FormItem>

        <FormItem label="活动页面" prop="page_id">
          <Select v-model="formItem.page_id" style="width:300px;" filterable clearable>
            <Option value="0">请选择页面</Option>
            <Option :value="item.page_id" v-for="(ind,item) in formItem.pageList" :key="ind">{{item.page_name}}</Option>
          </Select>
        </FormItem>

        <FormItem label="活动进度" prop="rewardArr">
          <div v-for="(item,i) in rewardArr">
            <div>
              奖励名称 <Input class="w_200" v-model="item.rule_name"/> 满<InputNumber v-model="item.member" :min=1 :precision="0"></InputNumber>位好友助力&nbsp;&nbsp;
              <Button @click.native="delBonus('reward','',i)">删除</Button>&nbsp;&nbsp;<!--<Button type="info" @click.native="showBonus('rewardArr',i)">选择优惠券</Button>-->
            </div>
            <div style="margin: 5px auto 45px; padding: 25px auto;">
              <span>送优惠券：</span><coupon-select :data="item.bonusArr" type="checkbox" @del-tag="handleClose">
                <Button type="dashed" @click="handleSelected(i)" class="basic_select">选择优惠券</Button>
              </coupon-select>
            </div>

          </div>
          <div>
            <Button type="info" @click.native="addPrize" v-if="rewardArr.length<3">添加奖励</Button>
          </div>
        </FormItem>


      </Form>
      <Spin size="large" fix v-if="spinShow"></Spin>
    </div>
  </PageTopBase>
</template>

<script>
    import PageTopBase from '@/views/my-components/page-top-base/index';
    import CouponSelect from '@/views/my-components/list-component/index-edit';


    export default {
        props: ['id'],
        components: {
            PageTopBase,
            CouponSelect
        },
        data () {
            const checkPrize = (rule,value,callback) => {
                console.log(value);
                if(value.length==0){
                    callback( new Error('奖励还没设置哦！'));
                }else{
                    var member = 0;
                    var error_msg = '';
                    for(var k in value){
                        var i = parseInt(k)+1;
                        if(!value[k]['rule_name'] || value[k]['rule_name']==''){
                            error_msg += '\r 第'+i+"级奖励名称不能为空！ \r\n";
                        }
                        if(member>0 && value[k]['member']<=member){
                            error_msg +=　"\r 第"+i+"级奖励条件不能小于等于上级奖励条件哦！\n\r";
                        }
                        console.log(value[k]['bonusArr'])
                        if ((JSON.stringify(value[k]['bonusArr']) === '{}') || value[k]['bonusArr'].length===0) {
                            error_msg += '\r 第'+i+'级的奖励为空哦！'; // 如果为空,返回false
                        }
                        member = parseInt(value[k]['member']);
                    }
                    if(error_msg !=''){
                        callback( new Error(error_msg));
                    }else{
                        callback();
                    }
                }
            };
            const checkDay = (rule, value, callback) => {
                if (this.formItem.send_rule == 2) {
                    if (!value) {
                        callback(new Error('天数不能为空'))
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            };
            const checkMonth = (rule, value, callback) => {
                if (this.formItem.send_rule == 3) {
                    if (!value) {
                        callback(new Error('天数不能为空'))
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            };
            return {
                formItem: {
                    id: this.id,
                    active_name: '',
                    activityDate: [],
                    is_enabled: '0',
                    page_id:'0',
                    rewardArr:{},
                    pageList:[],
                    couponData: [],

                    /*rankData: [],
                    send_rule: '1',
                    day: 1,
                    month: 1,
                    integral: 0*/
                },
                ruleValidate: {
                    active_name: [{
                        required: true, message: '活动名称不能为空', trigger: 'blur'
                    }],
                    day: [{
                        validator: checkDay, trigger: 'blur', type: 'number'
                    }],
                    page_id:[{ required: true,  message:'请选择页面', trigger:'change', type: 'number'}],
                    rewardArr:[{validator:checkPrize,trigger:'blur'}],
                    month: [{
                        validator: checkMonth, trigger: 'blur', type: 'number'
                    }],
                    rankData: [
                        {required: true, message: '优惠会员等级不能为空', trigger: 'change', type: 'array', min: 1}
                    ]
                },
                rewardArr:[
                    {id: 0, rule_name:'',member:1,bonusIds:'',bonusArr:{}}
                ],
                spinShow: false
            }
        },
        methods: {
            loadData (page, data) {
                this.rewardArr = [];
                this.spinShow = true;
                let params = Object.assign({}, data);
                return this.$ajax.post(this.$api.shareActivityInfo, {
                    id: this.id || 0
                })
                .then(response => {
                    const res = response.data;
                    if (res.code) {
                        let data = res.data;
                        console.log('返回数据222：', data);
                        if (this.id) {
                            this.formItem = data;
                            let rewardArr = data.rewardArr;
                            for (let i = 0; i < rewardArr.length; i++) {
                                rewardArr[i].member = Number(rewardArr[i].member)
                            }
                            this.rewardArr = rewardArr;
                        }else {
                            this.formItem.pageList = data.pageList;
                        }
                        this.spinShow = false;
                    }
                });
            },
            handleTimeRange ([from_time, to_time]) {
                this.formItem.from_time = from_time;
                this.formItem.to_time = to_time;
            },
            handleChange () {
                this.$refs.day.validateState = '';
                this.$refs.month.validateState = '';
            },
            handleSelected (index) {
                this.$selectContent({
                    mode: 'coupon',
                    type: 'checkbox',
                    //data: this.formItem.couponData,
                    data: this.rewardArr[index]['bonusArr'],
                    getList: (data) => {
                        this.rewardArr[index]['bonusArr'] = data;
                        this.$refs.formValidate.validateField('rewardArr');
                    }
                });
            },
            handleClose (data) {
                this.formItem.couponData = data; console.log('handleClose: ', data);
                this.$refs.formValidate.validateField('couponData');
            },
            // 奖励
            addPrize(){
                this.rewardArr.push({rule_name:'',member:1,bonusArr:{}})
            },
            // 删除
            delBonus(type,item,index){
                if (type == 'package') {
                    this.$delete(this.formItem.packageArr,item.type_id);
                    if (this.bonusStock>-1) {
                        this.bonusStock = -1;
                        for (var i in this.formItem.packageArr) {
                            if (this.formItem.packageArr[i]['stock']>this.bonusStock && this.bonusStock==-1) {
                                this.bonusStock = this.formItem.packageArr[i]['stock'];
                            }
                        }
                    }

                }else if(type == 'reward'){
                    this.$delete(this.rewardArr,index);
                }else if (type == 'reward_bonus') {
                    console.log(this.rewardArr[index]['bonusArr']);
                    this.$delete(this.rewardArr[index]['bonusArr'],item.type_id);
                }
            },
            confirm() {
                this.formItem.rewardArr = this.rewardArr;
                this.$refs.formValidate.validate(valid => {
                    if (valid) {
                        let rewardArray = this.rewardArr;
                        let newReward = [];
                        for (let i = 0; i < rewardArray.length; i++) {
                            newReward.push({id: rewardArray[i]['id'],rule_name: rewardArray[i]['rule_name'], member: rewardArray[i]['member'], bonusArr: rewardArray[i]['bonusArr'].map(item => item.id).join()});
                        }
                        this.spinShow = true;
                        this.$ajax.post(this.$api.shareActivityEdit, {
                            id: this.id || 0,
                            active_name: this.formItem.active_name,
                            activityDate: this.formItem.activityDate,
                            is_enabled: this.formItem.is_enabled,
                            page_id: this.formItem.page_id,
                            rewardArr: newReward,
                            couponData: this.formItem.couponData
                        })
                            .then(response => {
                                const res = response.data;
                                if (res.code) {
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
  .birthday-love-form{
    .ivu-switch-large {
      width: 56px;
    }
    .w_200 {
      width: 200px;
    }
    .basic_input_fixed, .basic_textarea{
      max-width: 420px;
    }
    .time_range{
      width: 340px;
    }
    .content{
      display: inline-block;
      vertical-align: bottom;
    }
    .radio_item{
      margin-bottom: 24px;
    }
    .form_item{
      margin-bottom: 20px;
      &:last-child{
        margin-bottom: 0;
      }
    }
  }
</style>
