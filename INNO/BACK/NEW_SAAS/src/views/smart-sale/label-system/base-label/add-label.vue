

<template>
      <page-top isSave @save="saveLabelEvent">
          <Form class="add-label-page" :model="formData" :rules="ruleValidate" ref="lableForm">
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
                    <div class="operare-l">
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
                                    <labelCard title="性别" v-if="formData.is_sex" @on-hideCard="labelClick('is_sex')">
                                        <FormItem prop="c_sex">
                                            <RadioGroup v-model="formData.c_sex">
                                                <Radio label="1">男</Radio>
                                                <Radio label="0">女</Radio>
                                            </RadioGroup>
                                        </FormItem>
                                    </labelCard>
                                    <labelCard title="生日" v-if="formData.is_birth_months" @on-hideCard="labelClick('is_birth_months')">
                                        <FormItem prop="c_birth_months">
                                            <CheckboxGroup v-model="formData.c_birth_months">
                                                <Checkbox :label="item.key" v-for="item in months" :key="item.key">
                                                    {{ item.name }}
                                                </Checkbox>
                                            </CheckboxGroup>
                                        </FormItem>
                                    </labelCard>
                                    <labelCard title="年龄" v-if="formData.is_age" @on-hideCard="labelClick('is_age')">
                                        <rangeArea 
                                        ref="ageRange"
                                        unit="岁"
                                        :minData.sync="formData.c_from_age"
                                        :maxData.sync="formData.c_to_age"
                                        >
                                            <div slot="middle">&nbsp;&nbsp;-&nbsp;&nbsp;</div>
                                        </rangeArea>
                                    </labelCard>
                                    <labelCard title="等级" v-if="formData.is_user_ranks" @on-hideCard="labelClick('is_user_ranks')">
                                        <FormItem prop="c_user_ranks">
                                            <CheckboxGroup v-model="formData.c_user_ranks" >
                                                <Checkbox :label="item.key" v-for="item in levels" border :key="item.key">{{ item.name }}</Checkbox>
                                            </CheckboxGroup>
                                        </FormItem>
                                    </labelCard>
                                    <labelCard title="会龄" v-if="formData.is_joins" @on-hideCard="labelClick('is_joins')">
                                        <rangeArea 
                                        ref="joinRange"
                                        unit="日"
                                        :minData.sync="formData.c_joins_from_ages"
                                        :maxData.sync="formData.c_joins_to_ages"
                                        >
                                            <div slot="middle">&nbsp;&nbsp;-&nbsp;&nbsp;</div>
                                        </rangeArea>
                                    </labelCard>
                                    <labelCard title="注册店铺" v-if="formData.is_reg_stores" @on-hideCard="labelClick('is_reg_stores')">
                                        <FormItem prop="c_reg_stores">
                                            <a @click="changeRegStore(formData.store_data)" style="width:150px;">{{ formData.store_data.length > 0 ? '已选择'+ formData.store_data.length +'门店' : '未选择门店，选择用户注册门店' }}</a>
                                        </FormItem>
                                    </labelCard>
                                    <labelCard title="注册时间" v-if="formData.is_reg" @on-hideCard="labelClick('is_reg')">
                                        <relativeTime
                                        ref="registerTime"
                                        title="注册时间"
                                        :timeType.sync="formData.s_regtime_type"
                                        :minDate.sync="formData.c_reg_from_date"
                                        :maxDate.sync="formData.c_reg_to_date"
                                        :minVal.sync="formData.c_reg_from_day"
                                        :maxVal.sync="formData.c_reg_to_day"
                                        unit="天"
                                        >
                                            <span slot="tip">距离执行</span>
                                        </relativeTime>
                                    </labelCard>
                                    <labelCard title="注册省份" v-if="formData.is_provinces" @on-hideCard="labelClick('is_provinces')">
                                        <FormItem prop="c_provinces">
                                            <addressSelect selectRange="prov" :initData='formData.is_provinces_data'  @selectArea="(data)=>{changeAddress('c_provinces', data)}"></addressSelect>
                                        </FormItem>
                                    </labelCard>
                                    <labelCard title="注册城市" v-if="formData.is_citys" @on-hideCard="labelClick('is_citys')">
                                        <FormItem prop="c_citys">
                                            <addressSelect selectRange="city" :initData='formData.is_citys_data' @selectArea="(data)=>{changeAddress('c_citys', data)}" ></addressSelect>
                                        </FormItem>
                                    </labelCard>
                                    <labelCard title="最近交互" v-if="formData.is_lately_activity_days" @on-hideCard="labelClick('is_lately_activity_days')">
                                        <FormItem prop="c_lately_activity_days">
                                            <RadioGroup v-model="formData.c_lately_activity_days">
                                                <Radio :label="item.key" v-for="item in activeTime" border :key="item.key">{{ item.name }}</Radio>
                                            </RadioGroup>
                                        </FormItem>
                                    </labelCard>
                                    <labelCard title="分销关系" v-if="formData.is_dstb_relation" @on-hideCard="labelClick('is_dstb_relation')">
                                        <FormItem  prop="dstb_relation">
                                            <RadioGroup v-model="formData.dstb_relation">
                                                <Radio :label="item.key" v-for="item in staffRelation" border :key="item.key">{{ item.name }}</Radio>
                                            </RadioGroup>
                                        </FormItem>
                                    </labelCard>
                                    <labelCard title="分销身份" v-if="formData.is_dstb_identity_type" @on-hideCard="labelClick('is_dstb_identity_type')">
                                        <FormItem  prop="dstb_relation">
                                            <CheckboxGroup v-model="formData.dstb_identity_type">
                                                <Checkbox :label="item.key" v-for="item in stayIdentity" border :key="item.key">{{ item.name }}</Checkbox>
                                            </CheckboxGroup>
                                        </FormItem>
                                    </labelCard>
                                    <labelCard title="关注时间" v-if="formData.is_subscribe_time" @on-hideCard="labelClick('is_subscribe_time')">
                                        <relativeTime
                                        ref="subscribeTime"
                                        title="关注时间"
                                        :timeType.sync="formData.subscribe_time_type"
                                        :minDate.sync="formData.subscribe_time_start"
                                        :maxDate.sync="formData.subscribe_time_end"
                                        :minVal.sync="formData.subscribe_time_start"
                                        :maxVal.sync="formData.subscribe_time_end"
                                        :shareVal="true"
                                        unit="天"
                                        >
                                        <span slot="tip">距离执行</span>
                                        </relativeTime>
                                    </labelCard>
                                <!-- </div> -->
                            </div>
                        </div>
                    </div>
                  </div>
              </div>
          </Form>
          <Spin size="large" fix v-if="showSpan"></Spin>
      </page-top>
</template>

<script>
import util from '@/libs/util.js';
import pageTop from "@/views/my-components/page-top-base/index";
import dataSelect from "@/views/my-components/date-select/index";
import addressSelect from "@/views/my-components/address/index";
import labelCard from "@/views/smart-sale/label-system/components/label-card.vue";
import rangeArea from "@/views/smart-sale/label-system/components/edit-group/range-area";
import relativeTime from "@/views/smart-sale/label-system/components/edit-group/relative-time";
export default {
  name: 'addBaseLabel',
  components: { pageTop, dataSelect, addressSelect,labelCard, rangeArea, relativeTime},
  data () {
    return {
        months:[
            {key:"1", name: "一月"},
            {key:"2", name: "二月"},
            {key:"3", name: "三月"},
            {key:"4", name: "四月"},
            {key:"5", name: "五月"},
            {key:"6", name: "六月"},
            {key:"7", name: "七月"},
            {key:"8", name: "八月"},
            {key:"9", name: "九月"},
            {key:"10", name: "十月"},
            {key:"11", name: "十一月"},
            {key:"12", name: "十二月"}
        ],
        levels: [
            {key: "1", name:"青铜"},
            {key: "2", name:"钻石"},
            {key: "3", name:"A"},
            {key: "4", name:"王者"}
        ],
        activeTime:[
            {key: "7", name:"7天内"},
            {key: "30", name:"30天内"},
            {key: "90", name:"90天内"},
            {key: "180", name:"180天内"}
        ],
        staffRelation:[
            {key: "1", name:"已绑定关系"},
            {key: "0", name:"无关系"}
        ],
        stayIdentity:[
            {key: "1", name:"一级分销"},
            {key: "2", name:"二级分销"},
            {key: "0", name:"普通会员"}
        ],
        labelList:{
            attrs: {
                tip: "会员属性",
                list:[
                    {key: "is_sex", name: "性别"},
                    {key: "is_birth_months", name: "生日"},
                    {key: "is_age", name: "年龄"},
                    {key: "is_user_ranks", name: "等级"},
                    {key: "is_joins", name: "会龄"}
                ], 
            },
            register: {
                tip: "注册指标",
                list:[
                    {key: "is_reg_stores", name: "注册门店"},
                    {key: "is_reg", name: "注册时间"},
                    {key: "is_provinces", name: "注册省份"},
                    {key: "is_citys", name: "注册城市"},
                ], 
            },
            active: {
                tip: "活跃度指标",
                list:[
                    {key: "is_lately_activity_days", name: "最近交互"}
                ], 
            },
            staff: {
                tip: "分销指标",
                list:[
                    {key: "is_dstb_relation", name: "分销关系"},
                    {key: "is_dstb_identity_type", name: "分销身份"}
                ], 
            },
            officialAccount: {
                tip: "公众号指标",
                list:[
                    {key: "is_subscribe_time", name: "关注时间"}
                ],
            }
        },
        selectLabelKey: {
            is_sex: 0,
            is_birth_months: 0,
            is_age: 0,
            is_user_ranks: 0,
            is_joins: 0,
            is_reg_stores: 0,
            is_reg: 0,
            is_provinces: 0,
            is_citys: 0,
            is_lately_activity_days: 0,
            is_dstb_relation: 0,
            is_dstb_identity_type: 0,
            is_subscribe_time: 0
        },
        formData: {
            tag_name:'',	//名称
            cat_id: '',	//分组id
            remark: '',	//备注
            is_auto_label:'', //自动标签
            exec_start_time:'', //统计周期开始
            exec_stop_time:'', //统计周期结束
            c_sex:'', //性别 0男 1女
            c_from_age:'',	//开始年龄
            c_to_age:'',	//结束年龄
            c_birth_months:[],//生日月份
            c_user_ranks:[],//会员等级	,分割
            c_reg_stores:'',//注册店铺
            c_lately_activity_days:'',//最近交互
            c_reg_from_date:'',//注册开始时间端
            c_reg_to_date:'',//注册结束时间端
            c_reg_from_day:'',//相对时间段开始
            c_reg_to_day:'',//相对时间段 结束
            c_joins_to_ages:'',//会龄 开始
            c_joins_from_ages:'', //会龄 结束
            c_provinces:'',//注册省份
            c_citys:'',//注册城市
            subscribe_time_type:'',//关注类型
            subscribe_time_start:'',//开始时间
            subscribe_time_end:'',//结束时间
            dstb_identity_type:[],	//分销身份  ,分割
            dstb_relation:''  //分销关系
        },
        ruleValidate: {
            tag_name: [{required: true, message: '请填写标签名', trigger: 'blur'}],
            cat_id: [{required: true, type:'number', message: '请填选择分组', trigger: 'change'}],
            remark: [{required: true, message: '请填写备注', trigger: 'blur'}],
            c_sex: [{required: true, message: '请选择性别', trigger: 'change'}],
            c_birth_months: [{required: true, type:'array', message: '请选择生日', trigger: 'change'}],
            c_user_ranks: [{required: true, type: 'array', message: '请填选择等级', trigger: 'change'}],
            c_reg_stores: [{required: true, message: '请选择注册店铺', trigger: 'change'}],
            c_provinces: [{required: true, message: '请选择注册省份', trigger: 'change'}],
            c_citys: [{required: true, message: '请选择注册城市', trigger: 'change'}],
            c_lately_activity_days: [{required: true, message: '请选择最近交互时间', trigger: 'change'}],
            dstb_identity_type: [{required: true,  type: 'array', message: '请选择分销身份类型', trigger: 'change'}],
            dstb_relation: [{required: true, message: '请选择分销关系', trigger: 'change'}],
        },
        groupList:[],
        showSpan:false,
    }
  },
  computed:{
      execTimeRange(){
          let formData = this.formData || {};
          return [formData.exec_start_time, formData.exec_stop_time]
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
        return util.ajax.post(util.apiUrl.BasicLabelInfo, {
            id: this.tag_id
        }).then(e =>{
            let res = e.data || {};
            if(res.code) {
                let formData = (res.data && res.data.items) || {};
                this.getFormDataKey(formData);
            }
        }).finally(()=>{
            this.showSpan = false
        })
      },
      getSelectGroup(){
        this.showSpan = true;
        return util.ajax.post(util.apiUrl.BasicLabelCateDate).then(e =>{
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
        formData.c_sex = formData.c_sex + "";
        if(formData.c_birth_months){
            formData.c_birth_months = formData.c_birth_months.split(",");
        }
        if(formData.c_user_ranks){
            formData.c_user_ranks = formData.c_user_ranks.split(",");
        } else {
            formData.c_user_ranks = [];
        }
        if(formData.c_reg_stores){
            formData.c_reg_stores = formData.c_reg_stores + "";
        }
        if(formData.dstb_identity_type){
            formData.dstb_identity_type = formData.dstb_identity_type.split(",");
        }
        formData.c_birth_months = formData.c_birth_months || [];
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
      formDataHandle(key, type){
          let formData = this.formData || {};
              switch(key){
                case"is_sex":
                    formData.c_sex = "";
                    break;
                case"is_age":
                    formData.c_from_age = "";
                    formData.c_to_age = "";
                    break;
                case"is_birth_months":
                    formData.c_birth_months = [];
                    break;
                case"is_user_ranks":
                    formData.c_user_ranks = [];
                    break;
                case"is_joins":
                    formData.c_joins_from_ages = "";
                    formData.c_joins_to_ages = "";
                    break;
                case"is_reg_stores":
                    formData.c_reg_stores = "";
                    formData.store_data = [];
                    break;
                case"is_reg":
                    if(type == 'change'){
                        if(formData.s_regtime_type == '1'){
                            formData.c_reg_from_day = "";
                            formData.c_reg_to_day = "";
                        } else if(formData.s_regtime_type == '2'){
                            formData.c_reg_from_date = "";
                            formData.c_reg_to_date = "";
                        }
                    } else {
                        formData.c_reg_from_date = "";
                        formData.c_reg_to_date = "";
                        formData.c_reg_from_day = "";
                        formData.c_reg_to_day = "";
                    }
                    break;
                case"is_provinces":
                    formData.c_provinces = "";
                    formData.is_provinces_data = [];
                    break;
                case"is_citys":
                    formData.c_citys = "";
                    formData.is_citys_data = [];
                    break;
                case"is_lately_activity_days":
                    formData.c_lately_activity_days = "";
                    break;
                case"is_dstb_relation":
                    formData.dstb_relation = "";
                    break;
                case"is_dstb_identity_type":
                    formData.dstb_identity_type = [];
                    break;
                case"subscribe_time":
                    formData.subscribe_time_start = "";
                    formData.subscribe_time_end = "";
                    break;
            }
          
      },
      getDate(date, type){
          this.formData[type] = date;
      },
      changeRegStore(storeData){
          this.$selectContent({
				mode: 'store',
				type: 'checkbox',
				data: storeData,
				getList: (data) => {
                    console.log("选择门店",data);
                    let storeList = [],idsStr = "";
                    for(let i = 0; i < data.length; i++){
                        storeList.push({
                            id: data[i].id,
                            name: data[i].name
                        })
                        idsStr = idsStr ? idsStr + "," + data[i].id : data[i].id;
                    }
                    this.formData.c_reg_stores = idsStr;
                    this.formData.store_data = storeList;
				}
			});
      },
      changeAddress(key, data = []){
          let _val = data.slice(-1)[0];
          this.formData[key] = _val.value;
      },
      checkData(callback){
        let refs = this.$refs || {};
        let promiseList = [], thisForm = null;
        if(refs["lableForm"]){
            promiseList.push(new Promise((rs, rj)=>{
                return refs["lableForm"].validate(vaild=>{
                    return vaild ? rs() : rj()
                })
            }))
        }
        if(refs["ageRange"]) promiseList.push(refs["ageRange"].validate());
        if(refs["joinRange"]) promiseList.push(refs["joinRange"].validate());
        if(refs["registerTime"]) promiseList.push(refs["registerTime"].validate());
        if(refs["subscribeTime"]) promiseList.push(refs["subscribeTime"].validate());
        Promise.all(promiseList).then(()=>{
            typeof(callback) == 'function' && callback();
        }).catch(()=>{
            this.$Message.error('填写完整信息!');
        })
      },
      //拼装数据
      getPostParams(data){
          data = JSON.parse(JSON.stringify(data || {}));
          
          if(data.c_user_ranks.length > 0){
              data.c_user_ranks = data.c_user_ranks.join(",");
          }
          if(data.c_birth_months.length > 0){
              data.c_birth_months = data.c_birth_months.join(",");
          }
          if(data.dstb_identity_type.length > 0){
              data.dstb_identity_type = data.dstb_identity_type.join(",");
          }
          return data;
      },
      saveLabelEvent(){
          this.checkData(()=>{
            let params = this.getPostParams(this.formData);  
            if(this.tag_id){
                this.editLabelEvent(params);
            } else {
                this.addLabelEvent(params);
            }
          })
      },
      addLabelEvent(params){
        this.showSpan = true;
        return util.ajax.post(util.apiUrl.BasicLabelAdd,params).then(e =>{
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
        return util.ajax.post(util.apiUrl.BasicLabelEdit,{
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
                width:430px;
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
            .v-item{
                position: relative;
                margin-bottom:10px;
               .close-icon{
                   opacity: 0;
                   cursor: pointer;
                   position: absolute;
                   top:0px;
                   right:0px;
                   transform: translate(40%,-40%);
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
               .ivu-card-body{
                   padding-bottom:5px;
               }
            }
            .v-item:hover{
                .close-icon{
                    opacity: 1;
                }
            }
            
        }
    }
</style>