

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
                                    <labelCard title="购买时间" v-if="formData.is_buy_time" @on-hideCard="labelClick('is_buy_time')">
                                        <relativeTime
                                        ref="buyTime"
                                        title="购买时间"
                                        :timeType.sync="formData.buy_time_kind"
                                        :minDate.sync="formData.buy_from_date"
                                        :maxDate.sync="formData.buy_to_date"
                                        :minVal.sync="formData.buy_from_date"
                                        :maxVal.sync="formData.buy_to_date"
                                        :shareVal="true"
                                        unit="天"
                                        >
                                            <span slot="tip">距离今天</span>
                                        </relativeTime>
                                    </labelCard>
                                    <labelCard title="商品指标" v-if="formData.is_buy_goods" @on-hideCard="labelClick('is_buy_goods')">
                                        <div class="flex">
                                            <div class="inline-b" style="width:140px">
                                                <Checkbox v-model="formData.is_show_buy_cat" :true-value="1" :false-value="0" border>选择分类</Checkbox>
                                            </div>
                                            <div class="inline-b" style="width:140px">
                                                <Checkbox v-model="formData.is_show_buy_goods" :true-value="1" :false-value="0" border>选择商品</Checkbox>
                                            </div>
                                        </div>
                                        <div class="flex">
                                            <FormItem prop="buy_cat_ids" v-if="formData.is_show_buy_cat" style="width:140px">
                                                <a @click="chooseCat(formData.buy_cat_data)" >{{ formData.buy_cat_ids ? '已选择' + selectCatNum + '种分类' : '点击此处选择分类' }}</a>
                                            </FormItem>
                                            <FormItem prop="buy_goods_ids" v-if="formData.is_show_buy_goods" style="width:140px">
                                                <a @click="chooseGoods(formData.goods_data)">{{ formData.buy_goods_ids ? '已选择' + selectGoodsNum + '个商品' : '点击此处选择商品' }}</a>
                                            </FormItem>
                                        </div>
                                    </labelCard>
                                    <labelCard title="尺码指标" v-if="formData.is_buy_size" @on-hideCard="labelClick('is_buy_size')">
                                        <FormItem prop="c_reg_stores">
                                            <a @click="chooseSize(formData.buy_size_data)" style="width:150px;">{{ formData.buy_size_data.length > 0 ? '已选择'+ formData.buy_size_data.length +'尺码' : '点击此处选择尺码' }}</a>
                                        </FormItem>
                                    </labelCard>
                                    <labelCard title="颜色指标" v-if="formData.is_buy_color" @on-hideCard="labelClick('is_buy_color')">
                                        <FormItem prop="c_reg_stores">
                                            <a @click="chooseColor(formData.buy_color_data)" style="width:150px;">{{ formData.buy_color_data.length > 0 ? '已选择'+ formData.buy_color_data.length +'颜色' : '点击此处选择颜色' }}</a>
                                        </FormItem>
                                    </labelCard>
                                    <labelCard title="数量指标" v-if="formData.is_buy_number" @on-hideCard="labelClick('is_buy_number')">
                                        <rangeArea 
                                        ref="buyNumberRange"
                                        unit="件"
                                        :minData.sync="formData.buy_number_from"
                                        :maxData.sync="formData.buy_number_to"
                                        >
                                            <div slot="middle">&nbsp;&lt; 购买件数 &lt;=&nbsp;</div>
                                            <span style="color:red;" slot="tip">（统计数不含退货）</span>
                                        </rangeArea>
                                    </labelCard>

                                <!-- </div> -->
                            </div>
                        </div>
                    </div>
                  </div>
              </div>
          </Form>
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
  components: { pageTop, dataSelect, labelCard, rangeArea, relativeTime, addressSelect},
  data () {
    return {
        labelList:{
            attrs: {
                tip: "时间指标",
                list:[
                    {key: "is_buy_time", name: "购买时间"}
                ], 
            },
            register: {
                tip: "商品指标",
                list:[
                    {key: "is_buy_goods", name: "商品选择"}
                ], 
            },
            active: {
                tip: "尺码指标",
                list:[
                    {key: "is_buy_size", name: "尺码选择"}
                ], 
            },
            staff: {
                tip: "颜色指标",
                list:[
                    {key: "is_buy_color", name: "颜色选择"}
                ], 
            },
            officialAccount: {
                tip: "数量指标",
                list:[
                    {key: "is_buy_number", name: "数量选择"}
                ],
            }
        },
        selectLabelKey: {
            is_buy_time: 0,
            is_buy_goods: 0,
            is_buy_size: 0,
            is_buy_color: 0,
            is_buy_number: 0,
        },
        formData: {
            tag_name:'',	//名称
            cat_id: '',	//分组id
            remark: '',	//备注
            is_auto_label:'', //自动标签
            exec_start_time:'', //统计周期开始
            exec_stop_time:'', //统计周期结束
            is_show_buy_cat: 0,
            is_show_buy_goods: 0,
        },
        ruleValidate: {
            tag_name: [{required: true, message: '请填写标签名', trigger: 'blur'}],
            cat_id: [{required: true, type:'number', message: '请填选择分组', trigger: 'change'}],
            remark: [{required: true, message: '请填写备注', trigger: 'blur'}],
            exec_start_time: [{required: true, message: '请填写周期开始时间', trigger: 'blur'}],
            exec_stop_time: [{required: true, message: '请填写周期结束时间', trigger: 'blur'}],
            buy_from_date: [{required: true, message: '请选择购买开始时间', trigger: 'change'}],
            buy_to_date: [{required: true, message: '请选择购买结束时间', trigger: 'change'}],
            buy_cat_ids: [{required: true, message: '请选择购买的商品分类', trigger: 'change'}],
            buy_goods_ids: [{required: true, message: '请选择购买的商品', trigger: 'change'}],
            buy_size_ids: [{required: true, message: '请选择购买的尺码', trigger: 'change'}],
            buy_color_cat_ids: [{required: true, message: '请选择购买的颜色', trigger: 'change'}],
            buy_number_from: [{required: true, message: '请选择购买最小件数', trigger: 'change'}],
            buy_number_to: [{required: true, message: '请选择购买最大件数', trigger: 'change'}],
        },
        groupList:[]
    }
  },
  computed:{
      getBuyTime(){
          let formData = this.formData || {};
          return [formData.buy_from_date, formData.buy_to_date]
      },
      execTimeRange(){
          let formData = this.formData || {};
          return [formData.exec_start_time, formData.exec_stop_time]
      },
      selectCatNum(){
          let formData = this.formData || {};
          let ca = (formData.buy_cat_data && formData.buy_cat_data.ca) || [];
          let vc = (formData.buy_cat_data && formData.buy_cat_data.vc) || [];
          return ca.length + vc.length;
      },
      selectGoodsNum(){
          let formData = this.formData || {};
          let num = (formData.buy_goods_ids && formData.buy_goods_ids.split(",")) || [];
          return num.length;
      },
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
        return util.ajax.post(util.apiUrl.SaleLabelInfo, {
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
        return util.ajax.post(util.apiUrl.SaleLabelCateDate).then(e =>{
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
        //补充
        if(formData.buy_cat_ids){
            formData.is_show_buy_cat = 1; 
        }
        if(formData.buy_goods_ids){
            formData.is_show_buy_goods = 1; 
        }
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
            case"is_buy_time":
                formData.buy_from_date = "";
                formData.buy_to_date = "";
                break;
            case"is_buy_goods":
                if(type == "change"){
                    if(formData.is_show_buy_cat == 0){
                        formData.buy_cat_ids = "";
                        formData.buy_cat_data = {};
                    }
                    if(formData.is_show_buy_goods == 0){
                        formData.buy_goods_ids = "";
                        formData.buy_goods_sn = "";
                    }
                } else {
                    formData.is_show_buy_cat = 0;
                    formData.buy_cat_ids = "";
                    formData.buy_cat_data = {};
                    formData.is_show_buy_goods = 0
                    formData.buy_goods_ids = "";
                    formData.buy_goods_sn = "";
                }
                break;
            case"is_buy_size":
                formData.buy_size_ids = "";
                formData.buy_size_data = [];
                break;
            case"is_buy_color":
                formData.buy_color_data = [];
                formData.buy_color_cat_ids = "";
                break;
            case"is_buy_number":
                formData.buy_number_from = "";
                formData.buy_number_to = "";
                break;
        }
      },
      getDate(date, type){
          this.formData[type] = date;
      },
      chooseSize(list){
          this.$selectContent({
              mode: 'size',
				type: 'checkbox',
				data: list,
				getList: (data) => {
                    console.log("选择门店",data);
                    let selectData = [], idsStr = "",nameStr = "";
                    for(let i = 0; i < data.length; i++){
                        selectData.push({
                            id: data[i].id,
                            name: data[i].name
                        })
                        idsStr = idsStr ? idsStr + "," + data[i].id : data[i].id;
                        nameStr = nameStr ? nameStr + "," + data[i].name : data[i].name;
                    }
                    this.formData.buy_size_ids = idsStr;
                    this.formData.buy_size_data = selectData;
                    this.formData.buy_size_names = nameStr;
				}
          })
      },
      chooseColor(list){
          this.$selectContent({
              mode: 'color',
				type: 'checkbox',
				data: list,
				getList: (data) => {
                    let selectData = [], idsStr = "",nameStr = "";
                    for(let i = 0; i < data.length; i++){
                        selectData.push({
                            id: data[i].id,
                            name: data[i].name
                        })
                        idsStr = idsStr ? idsStr + "," + data[i].id : data[i].id;
                        nameStr = nameStr ? nameStr + "," + data[i].name : data[i].name;
                    }
                    this.formData.buy_color_cat_ids = idsStr;
                    this.formData.buy_color_data = selectData;
                    this.formData.buy_color_names = nameStr;
				}
          })
      },
      chooseCat(catData){
          let list = []
          let ca = (catData && catData.ca) || [];
          let vc = (catData && catData.vc) || [];
          for(let i = 0;i < ca.length; i++){
              let id = ca[i].slice(-1)[0];
              list.push({
                  id: id,
                  cat_id: id
              })
          }
          for(let i = 0;i < vc.length; i++){
              let id = vc[i].slice(-1)[0];
              list.push({
                  id: id,
                  vcat_id: id
              })
          }
          this.$selectContent({
              mode: 'cat',
				type: 'checkbox',
				data: list,
				getList: (data) => {
                    let caList = [],vcList = [], caStr="", vcStr="";
                    for(let i = 0; i < data.length; i++){
                        if(data[i].cat_id){
                            caList.push([data[i].cat_id]);
                            caStr = caStr ? caStr + ',' + data[i].cat_id : "CA_" + data[i].cat_id;
                        }
                        if(data[i].vcat_id){
                            vcList.push([data[i].vcat_id]);
                            vcStr = vcStr ? vcStr + ',' + data[i].vcat_id : "VC_" + data[i].vcat_id
                        }
                    }
                    this.formData.buy_cat_data = {
                        ca: caList,
                        vc: vcList
                    }
										this.$set(this.formData, "buy_cat_ids", caStr + "|" + vcStr);
				}
          })
      },
      chooseGoods(list){
          this.$selectContent({
            mode: 'goods',
            type: 'checkbox',
            data: list,
            getList: (data) => {
                let selectList = [],idsStr = "";
                for(let i = 0; i < data.length; i++){
                    idsStr = idsStr ? idsStr + "," + data[i].id : data[i].id;
                    selectList.push({
                        id: data[i].id,
                        name: data[i].name || data[i].goods_name 
                    })
                }
                this.formData.buy_goods_ids = idsStr;
                this.formData.goods_data = selectList;
            }
          })
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
        if(refs["buyTime"]) promiseList.push(refs["buyTime"].validate());
        if(refs["buyNumberRange"]) promiseList.push(refs["buyNumberRange"].validate());
        Promise.all(promiseList).then(()=>{
            typeof(callback) == 'function' && callback();
        }).catch(()=>{
            this.$Message.error('填写完整信息!');
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
        return util.ajax.post(util.apiUrl.SaleLabelEdit,{
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