

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
                                            <Button class="m-top-10" @click="labelClick(item.key, lItem.type, lIndex)" :type="formData[item.key] ? 'primary' : 'default'" >{{ item.name }}</Button>&nbsp;&nbsp;
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
                                    <labelCard title="近度指标" v-if="formData.is_recency_kind" @on-hideCard="labelClick('is_recency_kind')">
                                        <div class="m-bottom-15">最后一次购买时间</div>
                                        <relativeTime
                                        ref="buyDays"
                                        title="近度指标"
                                        :timeType.sync="formData.recency_kind"
                                        :minDate.sync="formData.recency_from_date"
                                        :maxDate.sync="formData.recency_to_date"
                                        :minVal.sync="formData.recency_from_date"
                                        :maxVal.sync="formData.recency_to_date"
                                        :shareVal="true"
                                        unit="天"
                                        >
                                            <span slot="tip">距离执行</span>
                                        </relativeTime>
                                    </labelCard>
                                    <labelCard title="近度指标" v-if="formData.is_has_buy_time_type" @on-hideCard="labelClick('is_has_buy_time_type')">
                                        <div class="m-bottom-15">购买时间</div>
                                        <relativeTime
                                        ref="hasBuyDays"
                                        title="购买时间"
                                        :timeType.sync="formData.has_buy_time_type"
                                        :minDate.sync="formData.has_buy_time_from"
                                        :maxDate.sync="formData.has_buy_time_to"
                                        :minVal.sync="formData.has_buy_time_from"
                                        :maxVal.sync="formData.has_buy_time_to"
                                        :shareVal="true"
                                        unit="天"
                                        >
                                        <span slot="tip">距离执行</span>
                                        </relativeTime>
                                    </labelCard>
                                    <labelCard title="近度指标" v-if="formData.is_no_buy_time_type" @on-hideCard="labelClick('is_no_buy_time_type')">
                                        <div class="m-bottom-15">未购买时间</div>
                                        <relativeTime
                                        ref="noBuyDays"
                                        title="未购买时间"
                                        :timeType.sync="formData.no_buy_time_type"
                                        :minDate.sync="formData.no_buy_time_from"
                                        :maxDate.sync="formData.no_buy_time_to"
                                        :minVal.sync="formData.no_buy_time_from"
                                        :maxVal.sync="formData.no_buy_time_to"
                                        :shareVal="true"
                                        unit="天"
                                        >
                                            <span slot="tip">距离执行</span>
                                        </relativeTime>
                                    </labelCard>
                                    <labelCard title="频度指标" v-if="formData.is_frequency_kind" @on-hideCard="labelClick('is_frequency_kind')">
                                        <relativeTime
                                        ref="frequencyDays"
                                        title="频度指标"
                                        :timeType.sync="formData.frequency_kind"
                                        :minDate.sync="formData.frequency_from_date"
                                        :maxDate.sync="formData.frequency_to_date"
                                        :minVal.sync="formData.frequency_from_date"
                                        :maxVal.sync="formData.frequency_to_date"
                                        :shareVal="true"
                                        unit="天"
                                        >
                                            <span slot="tip">距离执行</span>
                                        </relativeTime>
                                        <div class="border-t">
                                            <rangeArea 
                                            ref="buyFrequencyRange"
                                            unit="次"
                                            :minData.sync="formData.frequency_from_buytimes"
                                            :maxData.sync="formData.frequency_to_buytimes"
                                            >
                                                <div slot="middle">&lt; 购买次数 &lt;=</div>
                                            </rangeArea>
                                        </div>
                                    </labelCard>
                                    <labelCard title="金额指标" v-if="formData.is_money_kind" @on-hideCard="labelClick('is_money_kind')">
                                        <relativeTime
                                        ref="money"
                                        title="金额指标"
                                        :timeType.sync="formData.money_kind"
                                        :minDate.sync="formData.money_from_date"
                                        :maxDate.sync="formData.money_to_date"
                                        :minVal.sync="formData.money_from_date"
                                        :maxVal.sync="formData.money_to_date"
                                        :shareVal="true"
                                        unit="天"
                                        >
                                            <span slot="tip">距离执行</span>
                                        </relativeTime>
                                        <div class="border-t">
                                            <rangeArea 
                                            ref="moneyRange"
                                            unit="元"
                                            :minData.sync="formData.money_from_section"
                                            :maxData.sync="formData.money_to_section"
                                            >
                                                <div slot="middle">&lt; 购买金额 &lt;=</div>
                                            </rangeArea>
                                        </div>
                                    </labelCard>
                                    <labelCard title="平均回购周期" v-if="formData.is_buy_back_cycle_day" @on-hideCard="labelClick('is_buy_back_cycle_day')">
                                        <rangeArea 
                                        ref="buyCycleRange"
                                        unit="天"
                                        :minData.sync="formData.from_buy_back_cycle_day"
                                        :maxData.sync="formData.to_buy_back_cycle_day"
                                        >
                                            <div slot="middle">&lt; 回购周期 &lt;=</div>
                                        </rangeArea>
                                    </labelCard>
                                    <labelCard title="其他订单指标" v-if="formData.is_order_time_type" @on-hideCard="labelClick('is_order_time_type')">
                                        <relativeTime
                                        ref="other"
                                        title="其他订单指标"
                                        :timeType.sync="formData.order_time_type"
                                        :minDate.sync="formData.from_order_time"
                                        :maxDate.sync="formData.to_order_time"
                                        :minVal.sync="formData.from_order_time"
                                        :maxVal.sync="formData.to_order_time"
                                        :shareVal="true"
                                        unit="天"
                                        >
                                            <span slot="tip">距离执行</span>
                                        </relativeTime>
                                        <div class="border-t">
                                            <rangeArea 
                                            ref="orderCountRange"
                                            unit="单"
                                            :minData.sync="formData.from_order_count"
                                            :maxData.sync="formData.to_order_count"
                                            >
                                                <div slot="title">订单数量</div>
                                                <div slot="middle">&lt; 购买次数 &lt;=</div>
                                            </rangeArea>
                                            <rangeArea 
                                            ref="orderClientPriceRange"
                                            unit="元"
                                            :minData.sync="formData.from_client_unit_price"
                                            :maxData.sync="formData.to_client_unit_price"
                                            >
                                                <div slot="title">客单价</div>
                                                <div slot="middle">&lt; 购买金额 &lt;=</div>
                                            </rangeArea>
                                            <rangeArea 
                                            ref="orderPriceRange"
                                            unit="元"
                                            :minData.sync="formData.from_unit_price"
                                            :maxData.sync="formData.to_unit_price"
                                            >
                                                <div slot="title">单品价格区间</div>
                                                <div slot="middle">&lt; 购买金额 &lt;=</div>
                                            </rangeArea>
                                            <rangeArea 
                                            ref="orderDiscountPriceRange"
                                            unit="%"
                                            :minData.sync="formData.from_discount_price"
                                            :maxData.sync="formData.to_discount_price"
                                            >
                                                <div slot="title">折扣区间</div>
                                                <div slot="middle">&lt; 商品折扣率 &lt;=</div>
                                            </rangeArea>
                                            <rangeArea 
                                            ref="orderLiandaiRange"
                                            unit=""
                                            :minData.sync="formData.from_liandai_rate"
                                            :maxData.sync="formData.to_liandai_rate"
                                            >
                                                <div slot="title">连带率</div>
                                                <div slot="middle">&lt; 连带率 &lt;=</div>
                                            </rangeArea>
                                        </div>
                                    </labelCard>
                                    <labelCard title="消费门店" v-if="formData.is_shopping_kind" @on-hideCard="labelClick('is_shopping_kind')">
                                        <FormItem prop="shopping_kind">
                                            <RadioGroup v-model="formData.shopping_kind" @on-change="formDataHandle('is_shopping_kind', 'change')">
                                                <Radio label="wechat" border>微商城消费</Radio>
                                                <Radio label="store" border>店铺消费</Radio>
                                                <Radio label="0" border>微商城或者店铺消费</Radio>
                                            </RadioGroup>
                                        </FormItem>
                                        <div v-if="formData.shopping_kind == 'store'">
                                            <FormItem prop="shopping_shop">
                                                <a @click="changeStore(formData.store_data)">{{formData.shopping_shop ? '已经选择'+ formData.store_data.length +'间消费门店':'点击此处选择消费门店'}}</a>
                                            </FormItem>
                                        </div>
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
  components: { pageTop, dataSelect, addressSelect, labelCard, rangeArea, relativeTime},
  data () {
    return {
        labelList:[
            {
                tip: "进度指标",
                type: "radio",
                list:[
                    {key: "is_recency_kind", name: "最近购买时间"},
                    {key: "is_has_buy_time_type", name: "购买时间"},
                    {key: "is_no_buy_time_type", name: "未购买时间"}
                ], 
            },
            {
                tip: "频度指标",
                list:[
                    {key: "is_frequency_kind", name: "频度指标"}
                ], 
            },
            {
                tip: "金额指标",
                list:[
                    {key: "is_money_kind", name: "金额指标"}
                ], 
            },
            {
                tip: "回购周期",
                list:[
                    {key: "is_buy_back_cycle_day", name: "回购周期"}
                ], 
            },
            {
                tip: "其他订单指标",
                list:[
                    {key: "is_order_time_type", name: "其他指标"}
                ],
            },
            {
                tip: "消费门店",
                list:[
                    {key: "is_shopping_kind", name: "消费门店"}
                ],
            }
        ],
        selectLabelKey: {
            is_recency_kind: 0,
            is_has_buy_time_type: 0,
            is_no_buy_time_type: 0,
            is_frequency_kind: 0,
            is_money_kind: 0,
            is_buy_back_cycle_day: 0,
            is_order_time_type: 0,
            is_shopping_kind: 0
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
            exec_start_time: [{required: true, message: '请填写周期开始时间', trigger: 'blur'}],
            exec_stop_time: [{required: true, message: '请填写周期结束时间', trigger: 'blur'}],
            shopping_kind: [{required: true, message: '请选择消费门店', trigger: 'blur'}],
            shopping_shop: [{required: true, message: '请选择消费门店', trigger: 'blur'}]
        },
        groupList:[]
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
        return util.ajax.post(util.apiUrl.ConsumeLabelInfo, {
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
        return util.ajax.post(util.apiUrl.ConsumeLabelCateDate).then(e =>{
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
        if(formData.recency_kind > 0){
            formData.is_recency_kind = 1;
        }
        if(formData.has_buy_time_type > 0){
            formData.is_has_buy_time_type = 1;
        }
        if(formData.no_buy_time_type > 0){
            formData.is_no_buy_time_type = 1;
        }
        if(formData.frequency_kind > 0){
            formData.is_frequency_kind = 1;
        }
        if(formData.money_kind > 0){
            formData.is_money_kind = 1;
        }
        if(formData.from_buy_back_cycle_day || formData.to_buy_back_cycle_day){
            formData.is_buy_back_cycle_day = 1;
        }
        if(formData.order_time_type > 0){
            formData.is_order_time_type = 1;
        }
        if(formData.shopping_kind || formData.shopping_kind == 0){
            formData.is_shopping_kind = 1;
        }
        this.formData = formData;
      },
      labelClick(key, type, pIndex){
          if(!key) return;
          let formData = this.formData || {};
          let val = 0;
          if(type == 'radio'){
              let list = this.labelList &&  this.labelList[pIndex].list;
              for(let i = 0; i < list.length; i++){
                  let _key = list[i].key;
                if(key != list[i].key && formData[_key]){
                    this.formDataHandle(_key, 'remove');
                    this.$set(formData, _key, 0);
                } else if(key == _key && !formData[_key]){
                    this.$set(formData, _key, 1);
                }
              }
              return;
          }
          //
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
                case"is_recency_kind":
                    formData.recency_kind = "";
                    formData.recency_from_date = "";
                    formData.recency_to_date = "";
                    break;
                case"is_has_buy_time_type":
                
                    formData.has_buy_time_type = "";
                    formData.has_buy_time_from = "";
                    formData.has_buy_time_to = "";
                    break;
                case"is_no_buy_time_type":
                    formData.no_buy_time_type = ""
                    formData.no_buy_time_from = "";
                    formData.no_buy_time_to = "";
                    break;
                case"is_frequency_kind":
                    formData.frequency_kind = "";
                    formData.frequency_from_date = "";
                    formData.frequency_to_date = "";
                    formData.frequency_from_buytimes = "";
                    formData.frequency_to_buytimes = "";
                    break;
                case"is_money_kind":
                    formData.money_kind = "";
                    formData.money_from_date = "";
                    formData.money_to_date = "";
                    formData.money_from_section = "";
                    formData.money_to_section = "";
                    break;
                case"is_buy_back_cycle_day":
                    formData.from_buy_back_cycle_day = "";
                    formData.to_buy_back_cycle_day = "";
                    break;
                case"is_order_time_type":
                    formData.order_time_type = ""
                    formData.from_order_time = ""
                    formData.to_order_time = ""
                    formData.from_order_count = ""
                    formData.to_order_count = ""
                    formData.from_client_unit_price = ""
                    formData.to_client_unit_price = ""
                    formData.from_unit_price = ""
                    formData.to_unit_price = ""
                    formData.from_discount_price = ""
                    formData.to_discount_price = ""
                    formData.from_liandai_rate = ""
                    formData.to_liandai_rate = ""
                    break;
                case"is_shopping_kind":
                    if(type == "change"){
                        if(formData.shopping_kind != 'store'){
                            formData.shopping_shop = ''
                            formData.store_data = []
                        }
                    } else {
                        formData.shopping_kind = ''
                        formData.shopping_shop = ''
                        formData.store_data = []
                    }
                    
                    break;
            }
          
      },
      getDate(date, type){
          this.formData[type] = date;
      },
      changeStore(storeData){
          this.$selectContent({
				mode: 'store',
				type: 'checkbox',
				data: storeData,
				getList: (data) => {
                    let storeList = [],idsStr = "";
                    for(let i = 0; i < data.length; i++){
                        storeList.push({
                            id: data[i].id,
                            name: data[i].name
                        })
                        idsStr = idsStr ? idsStr + "," + data[i].id : data[i].id;
                    }
                    this.formData.shopping_shop = idsStr;
                    this.formData.store_data = storeList;
				}
			});
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
          if(refs["buyDays"]) promiseList.push(refs["buyDays"].validate());
          if(refs["hasBuyDays"]) promiseList.push(refs["hasBuyDays"].validate());
          if(refs["noBuyDays"]) promiseList.push(refs["noBuyDays"].validate());
          if(refs["frequencyDays"]) promiseList.push(refs["frequencyDays"].validate());
          if(refs["buyFrequencyRange"]) promiseList.push(refs["buyFrequencyRange"].validate());
          if(refs["money"]) promiseList.push(refs["money"].validate());
          if(refs["moneyRange"]) promiseList.push(refs["moneyRange"].validate());
          if(refs["buyCycleRange"]) promiseList.push(refs["buyCycleRange"].validate());
          if(refs["other"]) promiseList.push(refs["other"].validate());
          if(refs["orderCountRange"]) promiseList.push(refs["orderCountRange"].validate());
          if(refs["orderClientPriceRange"]) promiseList.push(refs["orderClientPriceRange"].validate());
          if(refs["orderPriceRange"]) promiseList.push(refs["orderPriceRange"].validate());
          if(refs["orderDiscountPriceRange"]) promiseList.push(refs["orderDiscountPriceRange"].validate());
          if(refs["orderLiandaiRange"]) promiseList.push(refs["orderLiandaiRange"].validate());
          Promise.all(promiseList).then(()=>{
              typeof(callback) == 'function' && callback();
          }).catch(()=>{
              this.$Message.error('填写完整信息!');
          })
      },
      //拼装数据
      getPostParams(data){
          data = JSON.parse(JSON.stringify(data || {}));
          console.log("保存拼装数据", data);
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
        return util.ajax.post(util.apiUrl.ConsumeLabelAdd,params).then(e =>{
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
        return util.ajax.post(util.apiUrl.ConsumeLabelEdit,{
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