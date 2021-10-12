

<template>
      <page-top isSave @save="saveLabelEvent">
          <Form class="add-label-page" :model="formData" :rules="ruleValidate" ref="label-form">
            <FormItem label="标签名称" prop="tag_name" :label-width="100">
                <div class="limit-width">
                    <Input placeholder="请输入标签名，10字以内" v-model="formData.tag_name"></Input>
                </div>
            </FormItem>
            <FormItem label="标签分组" prop="cat_id" :label-width="100">
                <div class="limit-width">
                    <Select v-model="formData.cat_id">
                        <Option v-for="(item, index) in groupList" :key="index" :value="item.id">{{item.cat_name}}</Option>
                    </Select>
                </div>
            </FormItem>
            <FormItem label="标签备注" prop="remark" :label-width="100">
                <div class="limit-width">
                    <Input type="textarea" v-model="formData.remark" placeholder="请输入备注，40字以内"></Input>
                </div>
            </FormItem>
            <FormItem label="自动标签" prop="is_auto_label" size="large" :label-width="100">
                <i-switch false-color="#333333" v-model="formData.is_auto_label" true-value="1" false-value="0">
                    <span slot="open">开</span>
                    <span slot="close">关</span>
                </i-switch>
            </FormItem>
            <FormItem label="自动标签" prop="is_auto_label" size="large" :label-width="100" v-if="formData.is_auto_label == 1">
                <dataSelect :customDate="execTimeRange" @sT="(date)=>getDate(date,'exec_start_time')" @eT="(date)=>getDate(date,'exec_stop_time')"></dataSelect>
                <div class="flex m-bottom-25 fs-0" style="width:100%;" >
                    <FormItem prop="exec_start_time" class="margin-0" style="width:180px;height:1px"></FormItem>
                    <span class="hold_stay" style="width:34px;"></span>
                    <FormItem prop="exec_stop_time" class="margin-0" style="width:180px;height:1px"></FormItem>
                </div>
            </FormItem>
            <FormItem label="标签规则" :label-width="100">
                <div>1.在左侧指标选择栏内点击选择需要需要设置的指标内容，点击后右侧条件设定栏将显示对应的条件设定卡片。</div>
                <div>2.在条件设定卡片中填写筛选条件的值。</div>
                <div>3.点击保存完成自动标签新建。系统将在统计周期内，每日更新符合指标条件的会员标签。（为符合条件的会员新增标签，为不符合条件的会员移除标签）</div>
            </FormItem>
                <div class="operate-module">
                    <div class="flex operate-area f-just-between">
                        <div class="operare-l f-shrink0">
                            <div class="operate-title text-c">指标选择</div>
                            <div class="o-area-l o-area">
                                <div class="o-area-stay">
                                    <div class="o-item" v-for="(lItem, lIndex) in labelList" :key="lIndex">
                                        <div class="o-t-title">{{lItem.tip}}</div>
                                        <div>
                                            <div v-for="(item, index) in lItem.list" :key="index" class="inline-b">
                                                <Button class="m-top-10" @click="labelClick(item.key)" :type="formData[item.key] ? 'primary' : 'default'" >{{ item.name }}</Button>&nbsp;&nbsp;
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    <div class="f-shrink0 flex f-align-center">
                        <Icon size="40" type="md-arrow-round-forward" />
                    </div>
                    <div class="flex1 operare-r">
                        <div class="operate-title text-c">条件设置</div>
                        <div class="o-area-l o-area">
                            <div class="o-area-stay">
                                <div class="m-bottom-10">*系统将为符合所有条件设置的会员更新标签</div>
                                <!-- <div v-for="(item, index) in selectLabel" :key="index"> -->
                                    <labelCard title="选择优惠券" v-if="formData.is_coupon_ids" @on-hideCard="labelClick('is_coupon_ids')">
                                        <FormItem prop="coupon_ids">
                                            <a @click="selectCoupon(formData.bouns_data)" style="width:150px;">{{ formData.bouns_data.length > 0 ? '已选择'+ formData.bouns_data.length +'优惠券' : '未选择优惠券，请选择优惠券' }}</a>
                                        </FormItem>
                                    </labelCard>
                                    <labelCard title="领取时间" v-if="formData.is_get_time" @on-hideCard="labelClick('is_get_time')">
                                        <dataSelect :customDate="getTimeRange" @sT="(date)=>getDate(date,'get_begin_time')" @eT="(date)=>getDate(date,'get_end_time')"></dataSelect>
                                        <div class="flex f-just-end text-r m-bottom-25 fs-0" style="width:100%;" >
                                            <div>
                                                <FormItem prop="get_begin_time" class="margin-0" style="width:180px;"></FormItem>
                                                <span class="hold_stay"></span>
                                                <FormItem prop="get_end_time" class="margin-0" style="width:180px;"></FormItem>
                                            </div>
                                        </div>
                                    </labelCard>
                                    <labelCard title="优惠券状态" v-if="formData.is_coupon_status" @on-hideCard="labelClick('is_coupon_status')">
                                        <FormItem prop="coupon_status" >
                                            <RadioGroup v-model="formData.coupon_status" @on-change="changeStatus">
                                                <Radio border :label="item.key" v-for="item in statusList" :key="item.key">{{item.name}}</Radio>
                                            </RadioGroup>
                                        </FormItem>
                                        <div v-if="formData.coupon_status == 2">
                                            <dataSelect :customDate="getUsedTimeRange" @sT="(date)=>getDate(date,'used_begin_time')" @eT="(date)=>getDate(date,'used_end_time')"></dataSelect>
                                            <div class="flex f-just-end text-r m-bottom-25 fs-0" style="width:100%;" >
                                                <div>
                                                    <FormItem prop="used_begin_time" class="margin-0" style="width:180px;"></FormItem>
                                                    <span class="hold_stay"></span>
                                                    <FormItem prop="used_end_time" class="margin-0" style="width:180px;"></FormItem>
                                                </div>
                                            </div>
                                        </div>
                                    </labelCard>
                                    <labelCard title="选择到期时间" v-if="formData.is_expire_in_day" @on-hideCard="labelClick('is_expire_in_day')">
                                        <FormItem prop="expire_in_day">
                                            <Input type="text" placeholder="天数" style="width:100px;" v-model="formData.expire_in_day"/>&nbsp;天即将到期
                                        </FormItem>
                                    </labelCard>
                                    <labelCard title="积分范围设定" v-if="formData.is_point" @on-hideCard="labelClick('is_point')">
                                        <FormItem prop="point_start">
                                            <Input type="text" placeholder="最小积分" style="width:100px;" v-model="formData.point_start"/>
                                        </FormItem>
                                        <FormItem>至</FormItem>
                                        <FormItem prop="point_end">
                                            <Input type="text" placeholder="最大积分" style="width:100px;" v-model="formData.point_end"/>&nbsp;&nbsp;
                                        </FormItem>
                                    </labelCard>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
          </Form>
          <spin fix v-if="showSpan"></spin>
      </page-top>
</template>

<script>
import util from '@/libs/util.js';
import pageTop from "@/views/my-components/page-top-base/index";
import dataSelect from "@/views/my-components/date-select/index";
import addressSelect from "@/views/my-components/address/index";
import labelCard from "@/views/smart-sale/label-system/components/label-card.vue";
export default {
  name: 'addBaseLabel',
  components: { pageTop, dataSelect, labelCard, addressSelect},
  data () {
    return {
        statusList: [
            {key: "2", name:"已使用"},
            {key: "1", name:"未使用"},
            {key: "3", name:"已失效"}
        ],
        labelList:{
            coupon: {
                tip: "优惠券",
                list:[
                    {key: "is_coupon_ids", name: "选择优惠券"},
                ], 
            },
            receive: {
                tip: "领取时间",
                list:[
                    {key: "is_get_time", name: "领取时间"},
                ], 
            },
            status: {
                tip: "优惠券状态",
                list:[
                    {key: "is_coupon_status", name: "状态选择"}
                ], 
            },
            expireTime: {
                tip: "到期时间",
                list:[
                    {key: "is_expire_in_day", name: "到期时间"},
                ], 
            },
            pointRange: {
                tip: "会员积分范围",
                list:[
                    {key: "is_point", name: "范围设定"}
                ],
            }
        },
        selectLabelKey: {
            is_coupon_ids: 0,
            is_get_time: 0,
            is_coupon_status: 0,
            is_expire_in_day: 0,
            is_point: 0
        },
        formData: {
            tag_name:'',	//名称
            cat_id: '',	//分组id
            remark: '',	//备注
            is_auto_label:'', //自动标签
            exec_start_time:'', //统计周期开始
            exec_stop_time:'', //统计周期结束
        },
        ruleValidate: {
            tag_name: [{required: true, message: '请填写标签名', trigger: 'blur'}],
            cat_id: [{required: true, type:'number', message: '请填选择分组', trigger: 'change'}],
            remark: [{required: true, message: '请填写备注', trigger: 'blur'}],
            exec_start_time: [{required: true, message: '请选择统计开始时间', trigger: 'blur'}],
            exec_stop_time: [{required: true, message: '请选择统计结束时间', trigger: 'blur'}],
            coupon_ids: [{required: true, message: '请选择优惠券', trigger: 'blur'}],
            get_begin_time:[{required: true, message: '请选择领取开始时间', trigger: 'blur'}],
            get_end_time:[{required: true, message: '请选择领取结束时间', trigger: 'blur'}],
            coupon_status:[{required: true, message: '请选择优惠券状态', trigger: 'blur'}],
            used_begin_time:[{required: true, message: '请选择已使用开始时间', trigger: 'blur'}],
            used_end_time:[{required: true, message: '请选择已使用结束时间', trigger: 'blur'}],
            expire_in_day:[
                {required: true, message: '请选择到期时间', trigger: 'blur'},
                { type: 'string', pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/, message:'应为正浮点数', trigger:'blur' }
            ],
            point_start:[
                {required: true, message: '请填写最小积分', trigger: 'blur'},
                { type: 'string', pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/, message:'应为正浮点数', trigger:'blur' }
            ],
            point_end:[
                {required: true, message: '请填写最大积分', trigger: 'blur'},
                { type: 'string', pattern: /^(?!(0[0-9]{0,}$))[0-9]{1,}[.]{0,}[0-9]{0,}$/, message:'应为正浮点数', trigger:'blur' }
            ],
        },
        groupList:[],
        showSpan:false,
    }
  },
  computed:{
      execTimeRange(){
          let formData = this.formData || {};
          return [formData.exec_start_time, formData.exec_stop_time]
      },
      getTimeRange(){
          let formData = this.formData || {};
          return [formData.get_end_time, formData.get_begin_time]
      },
      getUsedTimeRange(){
          let formData = this.formData || {};
          return [formData.used_begin_time, formData.used_end_time]
      }
  },
  mounted(){
      this.initParams();
      this.getSelectGroup();
      this.getLabelInfo();
  },
  methods: {
      initParams(){
          let query = this.$route.query || {};
          this.tag_id = query.tag_id;
        },
      getLabelInfo(){
        if(!this.tag_id) return;
        this.showSpan = true;
        return util.ajax.post(util.apiUrl.MarketingLabelInfo, {
            id: this.tag_id
        }).then(e =>{
            let res = e.data || {};
            if(res.code) {
                let formData = (res.data && res.data.items) || {};
                this.getFormDataKey(formData);
                console.log("this.formData", this.formData);
            }
        }).finally(()=>{
            this.showSpan = false
        })
      },
      getSelectGroup(){
        this.showSpan = true;
        return util.ajax.post(util.apiUrl.MarketingLabelCateDate).then(e =>{
            let res = e.data || {};
            if(res.code && res.data) {
                this.groupList = (res.data && res.data.items) || []
            }
        }).finally(()=>{
            this.showSpan = false
        })
      },
      //初始化数据
      getFormDataKey(formData){
        formData = JSON.parse(JSON.stringify(formData));
        formData.cat_id = parseInt(formData.cat_id);
        this.formData = formData;
      },
      labelClick(key){
          if(!key) return;
          let formData = this.formData || {};
          let val = 0;
          if(formData[key]){
              val = 0;
              this.formDataHandle(key, 'remove');
          } else {
              val = 1;
          }
          this.$set(formData, key, val);
      },
      changeStatus(value){
          if(value != 2){
              this.formDataHandle('is_coupon_status', 'remove');
          }
      },
      formDataHandle(key, type){
          let formData = this.formData || {};
            switch(key){
            case"is_coupon_ids":
                formData.coupon_ids = "";
                formData.bouns_data = [];
                break;
            case"is_get_time":
                formData.get_begin_time = "";
                formData.get_end_time = "";
                break;
            case"is_coupon_status":
                formData.used_begin_time = "";
                formData.used_end_time = "";
                formData.coupon_status = "";
                break;
            case"is_expire_in_day":
                formData.expire_in_day = "";
                break;
            case"is_point":
                formData.point_start = "";
                formData.point_end = "";
                break;
        }
          
      },
      getDate(date, type){
          this.formData[type] = date;
      },
      selectCoupon(bouns_data){
          this.$selectContent({
				mode: 'coupon',
				type: 'checkbox',
				data: bouns_data,
				getList: (data) => {
                    console.log("选择的", data);
                    let bouns_data = [],idsStr = "";
                    for(let i = 0; i < data.length; i++){
                        bouns_data.push({
                            id: data[i].id,
                            name: data[i].name
                        })
                        idsStr = idsStr ? idsStr + "," + data[i].id : data[i].id;
                    }
                    this.formData.coupon_ids = idsStr;
                    this.formData.bouns_data = bouns_data;
				}
			});
      },
      checkData(callback){
        this.$refs["label-form"].validate((valid)=>{
            console.log("检验",valid)
            if(valid){
                typeof(callback) == 'function' && callback();
            } else {
                this.$Message.error('填写完整信息!');
            }
        })
      },
      //拼装数据
      getPostParams(data){
          data = JSON.parse(JSON.stringify(data || {}));
          console.log("data",data);
          return data;
      },
      saveLabelEvent(){
          this.checkData(()=>{
            let params = this.getPostParams(this.formData);
            console.log("提交的params", params);
            if(this.tag_id){
                this.editLabelEvent(params);
            } else {
                this.addLabelEvent(params);
            }
          })
      },
      addLabelEvent(params){
        this.showSpan = true;
        return util.ajax.post(util.apiUrl.MarketingLabelAdd,params).then(e =>{
            let res = e.data || {};
            if(res.code && res.data) {
                this.$Message.info(res.message || '添加成功');
                this.$router.go(-1);
            }
        }).finally(()=>{
            this.showSpan = false
        })
      },
      editLabelEvent(params){
        this.showSpan = true;
        console.log("编辑params", params);
        return util.ajax.post(util.apiUrl.MarketingLabelEdit,{
            id: this.tag_id,
            type: 2,
            ...params
        }).then(e =>{
            let res = e.data || {};
            if(res.code && res.data) {
                this.$Message.info(res.message || '编辑成功');
                this.$router.go(-1);
            }
        }).finally(()=>{
            this.showSpan = false
        })
      },
      
  },
}
</script>
<style lang="less">
    .add-label-page{
        max-width:1200px;
        width:100%;
        .limit-width{
            max-width:300px;
        }
        .operate-module{
            margin-left:50px;
            .flex1{
                flex-shrink: 0;
                box-sizing: border-box;
            }
            .operate-area{
                width:100%;
            }
            .operare-l{
                width:400px;
            }
            .operare-r{
                width:100%;
            }
        }
        .operate-title{
            font-size: 16px;
            font-weight: bold;
            padding:10px 0px;
        }
        .o-area{
            width:100%;
            box-sizing: border-box;
            height:500px;
            padding:20px;
            background: #F7F7F7;
            box-shadow: inset 0 1px 1px rgba(0,0,0,.075);
            border-radius: 10px;
            padding-right:0px;
            .o-area-stay{
                height:100%;
                padding-right:20px;
                overflow-y:auto;
                overflow-x: hidden;
            }
            .o-item{
                // padding:0px 10px;
                .o-t-title{
                    padding-top:15px;
                    padding-bottom:5px;
                    font-size:12px;
                }
            }
            .ivu-form-item{
                display: inline-block;
            }
            .ivu-form-item.margin-0{
                margin:0px;
            }
            .ivu-radio-group{
                .ivu-form-item-error-tip{
                    white-space: nowrap;
                }
            }
            .hold_stay{
                opacity: 0;
                width: 1em;
            }
        
        }
    }
</style>