<template>
  <PageTopBase isSave @save="confirm">
    <div class="birthday-love-form">
      <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="140">
        <FormItem label="小程序路径" prop="path">
          <Input v-model="formItem.path" placeholder="请输入小程序路径" :disabled="formItem.id > 0 ? true : false" class="basic_input basic_input_fixed" :maxlength="30" show-word-limit/>
        </FormItem>

        <FormItem label="链接备注" prop="remark">
          <Input v-model="formItem.remark" placeholder="请输入链接备注" class="basic_input basic_input_fixed" :maxlength="30" show-word-limit/>
        </FormItem>

        <FormItem label="有效期类型" prop="is_expire">
          <Row>
            <Col>
              <RadioGroup v-model="formItem.is_expire" >
                <Radio label="1" :disabled="formItem.id > 0 ? true : false">短期</Radio>
                <Radio label="0" :disabled="formItem.id > 0 ? true : false">永久</Radio>
              </RadioGroup>
            </Col>
          </Row>
          <Row>
            <Col  v-if="formItem.is_expire == '1'">
              <span style="margin-left:10px;color:red;">*短期有效期最大不超过30天</span>
            </Col>
            <Col v-else>
              <span style="margin-left:10px;color:red;">*永久链接最多可生成10条</span>
            </Col>
          </Row>
        </FormItem>

        <FormItem label="有效期" prop="expire_day" v-if="formItem.is_expire == '1'" >
          <InputNumber  v-model="formItem.expire_day" :disabled="formItem.id > 0 ? true : false"></InputNumber> &nbsp; 单位：天  &nbsp; &nbsp; <span style="color:red">*请输入值为7~30天</span>
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
            const checkBrandCode = (rule, val, callback) => {
                if( /^[\w]{4,20}$/.test(val) ){
                    callback();
                }
                else{
                    callback(new Error('品牌代码只能用四位以上字母、数字和"_"组成'));
                }
            };
            const checkVal = (rule,value,callback) => {
                if (this.formItem.is_expire == '1') {
                    if (value>0) {
                        callback();
                    }else{
                        callback( new Error('有效天数不能为空'));
                    }
                } else {
                    callback();
                }

            };
            return {
                formItem: {
                    id:this.id,
                    path:'',
                    remark:'',
                    expire_day: 7,
                    is_expire: '1',
                },
                // 表单数据规则
                ruleValidate:{
                    path:[{ required: true, message: '小程序路径不能为空', trigger: 'blur' }],
                    remark:[{ required: true, message: '链接备注不能为空', trigger: 'blur' }],
                    is_expire:[{ required: true, message: '请选择有限期类型', trigger: 'blur' }],
                    expire_day:[{ validator: checkVal, trigger: 'blur' }],
                },
                spinShow: false
            }
        },
        methods: {
            loadData (page, data) {
                this.rewardArr = [];
                this.spinShow = true;
                let params = Object.assign({}, data);
                return this.$ajax.post(this.$api.sponsoredLinkInfo, {
                    id: this.id || 0
                })
                .then(response => {
                    const res = response.data;
                    if (res.code) {
                        let data = res.data;
                        console.log('返回数据222：', data, 'id: ',this.id);
                        if (this.id) {
                            this.formItem = data;
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
                        this.$ajax.post(this.$api.sponsoredLinkSave, {
                            id:this.formItem.id,
                            path:this.formItem.path,
                            remark:this.formItem.remark,
                            expire_day:this.formItem.expire_day,
                            is_expire: this.formItem.is_expire,
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
