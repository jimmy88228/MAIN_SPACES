

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
                                    <labelCard title="时间指标" v-if="formData.is_buy_time" @on-hideCard="labelClick('is_buy_time')">
                                        <relativeTime 
                                        ref="buyTime"
                                        title="时间指标"
                                        :timeType.sync="formData.buy_time_kind"
                                        :minDate.sync="formData.buy_from_date"
                                        :maxDate.sync="formData.buy_to_date"
                                        :minVal.sync="formData.buy_from_date"
                                        :maxVal.sync="formData.buy_to_date"
                                        :shareVal="true"
                                        unit="天"
                                        >
                                        </relativeTime>
                                    </labelCard>
                                    <labelCard title="商品指标" v-if="formData.is_goods_select" @on-hideCard="labelClick('is_goods_select')">
                                        <RadioGroup class="_flex" v-model="formData.select_goods_kind" @on-change="formDataHandle('is_goods_select', 'change')">
                                            <Radio :label="1" class="f-align-center " style="display:flex;" border>
                                                选择分类
                                            </Radio>
                                            <Radio :label="2" class="f-align-center " style="display:flex;" border>
                                                选择商品
                                            </Radio>
                                        </RadioGroup>
                                        <template v-if="formData.is_goods_select">
                                            <FormItem prop="cat_ids" class="margin-0 flex1" v-if="formData.select_goods_kind == 1">
                                                <div><a @click="chooseCat(formData.cat_ids_data)">{{ formData.cat_ids ? '已选择' + selectCatNum + '种分类' : '点击此处选择对应的分类' }}</a></div>
                                            </FormItem>
                                            <FormItem prop="goods_ids" class="margin-0 flex1" v-if="formData.select_goods_kind == 2">
                                                <div><a @click="chooseGoods(formData.goods_ids)">{{ formData.goods_ids ? '已选择' + selectGoodsNum + '个商品' : '点击此处选择对应的商品' }}</a></div>
                                            </FormItem>
                                        </template>
                                    </labelCard>
                                    <labelCard title="页面选择" v-if="formData.is_page_types" @on-hideCard="labelClick('is_page_types')">
                                        <FormItem prop="c_reg_stores">
                                            <a @click="changePage(formData.page_data)" style="width:150px;">{{ formData.page_types ? '已选择'+ formData.page_data.length +'个页面' : '点击此处选择页面' }}</a>
                                        </FormItem>
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
import labelCard from "@/views/smart-sale/label-system/components/label-card.vue";
import relativeTime from "@/views/smart-sale/label-system/components/edit-group/relative-time";
export default {
  name: 'addVisitLabel',
  components: { 
      pageTop, dataSelect, relativeTime, labelCard
  },
  data () {
    return {
        labelList:{
            attrs: {
                tip: "时间指标",
                list:[
                    {key: "is_buy_time", name: "访问时间"}
                ], 
            },
            register: {
                tip: "商品指标",
                list:[
                    {key: "is_goods_select", name: "商品选择"}
                ], 
            },
            active: {
                tip: "页面选择",
                list:[
                    {key: "is_page_types", name: "页面选择"}
                ], 
            }
        },
        selectLabelKey: {
            is_buy_time: 0,
            is_goods_select: 0,
            is_page_types: 0
        },
        formData: {
            tag_name:'',	//名称
            cat_id: '',	//分组id
            remark: '',	//备注
            is_auto_label:'', //自动标签
            exec_start_time:'', //统计周期开始
            exec_stop_time:'', //统计周期结束
            select_goods_kind: 0,
            page_types: "",
            page_data: [],
            goods_data:[],
            goods_ids:""
        },
        ruleValidate: {
            tag_name: [{required: true, message: '请填写标签名', trigger: 'blur'}],
            cat_id: [{required: true, type:'number', message: '请填选择分组', trigger: 'change'}],
            remark: [{required: true, message: '请填写备注', trigger: 'blur'}],
            exec_start_time: [{required: true, message: '请填写周期开始时间', trigger: 'blur'}],
            exec_stop_time: [{required: true, message: '请填写周期结束时间', trigger: 'blur'}],
            // buy_from_date: [{required: true, message: '请选择购买开始时间', trigger: 'change'}],
            // buy_to_date: [{required: true, message: '请选择购买结束时间', trigger: 'change'}],
            goods_ids: [{required: true, message: '请选择购选择商品', trigger: 'change'}],
            cat_ids: [{required: true, message: '请选择购选择商品', trigger: 'change'}],
            page_types: [{required: true, message: '请选择页面', trigger: 'change'}]
        },
        groupList:[]
    }
  },
  computed:{
      execTimeRange(){
          let formData = this.formData || {};
          return [formData.exec_start_time, formData.exec_stop_time]
      },
      selectCatNum(){
          let formData = this.formData || {};
          let cat_ids_data = formData.cat_ids_data || [];
          return cat_ids_data.length;
      },
      selectGoodsNum(){
          let formData = this.formData || {};
          let num = (formData.goods_ids && formData.goods_ids.split(",")) || [];
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
        return util.ajax.post(util.apiUrl.VisitLabelInfo, {
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
        return util.ajax.post(util.apiUrl.VisitLabelCateDate).then(e =>{
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
        if(formData.buy_time_kind) {
            formData.is_buy_time = 1;
        }
        formData.select_goods_kind = formData.cat_ids ? 1 : (formData.goods_ids ? 2 : 0);
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
                    formData.buy_to_date = "";
                    formData.buy_from_date = "";
                    break;
                case"is_goods_select":
                    if(type == "change"){
                        if(formData.select_goods_kind == 1){
                            formData.goods_data = [];
                            formData.goods_ids = "";
                        } else if(formData.select_goods_kind == 2){
                            formData.cat_ids = "";
                            formData.cat_ids_data = [];
                        }
                    } else {
                        formData.select_goods_kind = 0;
                        formData.cat_ids = "";
                        formData.cat_ids_data = [];
                        formData.goods_data = [];
                        formData.goods_ids = "";
                    }
                    break;
                case"is_page_types":
                    formData.page_data = [];
                    formData.page_types = "";
                    break;
            }
          
      },
      getDate(date, type){
          this.formData[type] = date;
      },
      chooseCat(list){
          let _list = [];
          for(let i = 0; i < list.length; i++){
              let item = list[i].slice(-1)[0];
              _list.push({
                  id: item
              })
          }
          this.$selectContent({
            mode: 'cat',
            type: 'checkbox',
            listKey: 'cat_id',
            data: _list,
            getList: (data) => {
                let dataList = [],idsStr = "";
                for(let i = 0; i < data.length; i++){
                    dataList.push([
                        data[i].id
                    ])
                    idsStr = idsStr ? idsStr + "," + data[i].id : data[i].id;
                }
                this.formData.cat_ids_data = dataList;
                this.formData.cat_ids = idsStr;
            }
          })
      },
      chooseGoods(oData, key){
          let list = [];
          if(typeof(oData) == "string" && oData){
              oData = oData.split(",");
              for(let i = 0; i < oData.length; i++){
                  list.push({
                      id: oData[i]
                  })
              }
          }
          this.$selectContent({
            mode: 'goods',
            type: 'checkbox',
            data: list,
            getList: (data) => {
                let dataList = [],idsStr = "";
                for(let i = 0; i < data.length; i++){
                    dataList.push({
                        id: data[i].id,
                        name: data[i].goods_name
                    })
                    idsStr = idsStr ? idsStr + "," + data[i].id : data[i].id;
                }
                this.formData.goods_data = dataList;
                this.formData.goods_ids = idsStr;
            }
          })
      },
      changePage(list){
          this.$selectContent({
				mode: 'pages',
				type: 'checkbox',
				data: list,
				getList: (data) => {
                    let selectList = [],idsStr = "";
                    for(let i = 0; i < data.length; i++){
                        selectList.push({
                            id: data[i].id,
                            name: data[i].name
                        })
                        idsStr = idsStr ? idsStr + "," + data[i].id : data[i].id;
                    }
                    this.formData.page_types = idsStr;
                    this.formData.page_data = selectList;
                    console.log("选择page",this.formData)
				}
			});
      },
      checkData(callback){
          let promiseList = [];
          if(this.$refs["lableForm"]){
              promiseList.push(new Promise((rs, rj)=>{
                  return this.$refs["lableForm"].validate(vaild=>{
                      return vaild ? rs() : rj()
                  })
              }))
          }
          if(this.$refs["buyTime"]) promiseList.push(this.$refs["buyTime"].validate());
          Promise.all(promiseList).then(()=>{
              typeof(callback) == 'function' && callback();
          }).catch(()=>{
              this.$Message.error('填写完整信息!');
          })
      },
      //拼装数据
      getPostParams(data){
          data = JSON.parse(JSON.stringify(data || {}));
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
        return util.ajax.post(util.apiUrl.VisitLabelAdd,params).then(e =>{
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
        return util.ajax.post(util.apiUrl.VisitLabelEdit,{
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