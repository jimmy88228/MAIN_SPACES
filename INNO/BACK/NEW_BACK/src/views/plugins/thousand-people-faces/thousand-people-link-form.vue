<template>
  <PageTopBase isSave @save="confirm">
    <div class="birthday-love-form">
      <Form ref="formValidate" :model="formItem" :rules="ruleValidate" :label-width="140">

        <FormItem label="启用状态" prop="isEnabled">
          <i-switch v-model="formItem.isEnabled" size="large">
            <span slot="open">启用</span>
            <span slot="close">关闭</span>
          </i-switch>
        </FormItem>

        <FormItem label="活动名称" prop="name">
          <Input v-model.trim="formItem.name" placeholder="请输入活动名称" style="width: 300px;" clearable></Input>
        </FormItem>

        <FormItem id="select-page" label="选择页面">
          <div class="kwordSearch">
            <Input v-model.trim="formItem.kword" placeholder="请输入页面关键字" style="width: 150px;" clearable></Input>
            <Button type="primary" @click.native="searchPageList">搜索</Button>
          </div>

          <div class="page-list">
            <Select v-model="formItem.page_id" style="width:300px" filterable clearable transfer>
              <Option v-for="item in pageList" :key="item.page_id" :value="item.page_id">{{item.page_name}}</Option>
              <!--<Option v-if="formItem.thatRoom.page_id" :value="formItem.thatRoom.page_id">{{formItem.thatRoom.page_name}}</Option>-->
            </Select>
          </div>
        </FormItem>

        <FormItem label="选择标签" prop="labelLists" id="label-list">
          <ul>
            <li v-for="item in tagselectLists">{{item.tag_name}}</li>
          </ul>
          <Button shape="circle" style="margin-top: 6px;" @click.native="tagList" type="primary">+</Button>
        </FormItem>

        <FormItem label="排序" prop="sort">
          <InputNumber :min="0" :precesion="0" v-model="formItem.sort"></InputNumber> <span style="color:red;">数值越大，排序越靠前</span>
        </FormItem>

      </Form>

      <Modal v-model="bonusModal"
             title="选择标签"
             width=50
             @on-ok="handleOkArray"
             @on-cancel="handleCancelArray"
             class="bonus_list" :styles="{top:'20px'}">
        <template>
          <Tabs type="card">
            <TabPane v-for="item in this.tagTitles" :label="item.name" :key="item.key">
              <div class="tag-list">
                <li v-for="it in tagLists[item.key]" @click="checkTag(item.key,$event)" :key="it.id" :data-tagid="it.id" :class="{'tagSelected': it.selected}">{{it.tag_name}}</li>
              </div>
            </TabPane>
          </Tabs>
        </template>
      </Modal>

      <Modal v-model="tagsModal"
             title="已选中标签"
             width=50
             class="bonus_list" :styles="{top:'20px'}" :footer-hide="true">
        <template>
          <Tabs type="card">
            <TabPane v-for="(item, tagTitle) in this.showListTags" :label="tagTitle" :key="tagTitle">
              <div class="tag-list">
                <li v-for="tag_name in item" :key="tag_name" :class="{'tagSelected': true}">{{tag_name}}</li>
              </div>
            </TabPane>
          </Tabs>
        </template>
      </Modal>

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
                    id:'',
                    name:'',
                    page_id: 0,
                    isEnabled: false,
                    discountType:'',
                    discount_rate:0,
                    discount_amount:0,
                    is_start_VirtualGroup:false,
                    shipping_fee:0,
                    shipping_rule_enable:0,
                    free_shipping_rule:1,
                    is_show_sale_number:'0',
                    virtual_sale_number:0,
                    sort_order:0,
                    kword: '',
                    thatRoom:{page_name:'',page_id:''},
                },

                bonusModal:false,
                tagsModal:false,
                selectedBonus:{},
                bonusList:{},
                bonusListArray:[],
                formItemItem:{},
                formItemIndex:undefined,
                prizesList:[],
                pageList:[],//选择页面数据
                tagLists: [],//tag数据
                tagselectLists: {},//选中的tag数据
                tagTitles:[],//全部tag标题
                operation_type: -1, //操作类型
                showListTags:[],//点击列表标签来展示
                // 表单数据规则
                ruleValidate:{
                    /*path:[{ required: true, message: '小程序路径不能为空', trigger: 'blur' }],
                    remark:[{ required: true, message: '链接备注不能为空', trigger: 'blur' }],
                    is_expire:[{ required: true, message: '请选择有限期类型', trigger: 'blur' }],
                    expire_day:[{ validator: checkVal, trigger: 'blur' }],*/
                },
                spinShow: false
            }
        },
        methods: {
            handleCancelArray(){
                // this.$refs.selection.selectAll(false)
                this.selectedBonus = {}
                this.bonusModal = false
            },
            handleCloseTag(item,i){
                this.$delete(item.selectedBonus,i)
            },
            handleOkArray(){
                /*let selections = this.$refs.selection.getSelection()
                if(selections.length<1){

                    return false;
                }
                selections.forEach(item=>{
                    this.selectedBonus[item.type_id] = {type_id:item.type_id,type_name:item.type_name,create_number:item.create_number,stock:item.stock,send_type:item.send_type};
                })
                this.$set(this.prizesList[this.formItemIndex],'selectedBonus',this.selectedBonus)
                //this.$refs.selection.selectAll(false)
                this.selectedBonus = {}*/

            },
            searchPageList(){
                this.$ajax.post( this.$api.thousandPeopleGetCustomPages, {kword: this.formItem.kword})
                    .then( (response)=>{
                        this.pageList = response.data.data;
                    })
            },
            tagList(){
                this.bonusModal = true;
                //获取标签数据
                this.$ajax.post( this.$api.thousandPeopleGetUserTag, {})
                    .then( (response)=>{
                        //选中
                        // this.tagselectLists  basic_20
                        this.tagLists = response.data.data; //标题内容
                        this.tagTitles = response.data.tag_title; //标题

                        var selectedTagKeys = [];
                        for (var i in this.tagselectLists){
                            selectedTagKeys.push(i);
                        }

                        for (var k in this.tagLists) {
                            for (var j in this.tagLists[k]){
                                if (selectedTagKeys.includes(k+'_'+this.tagLists[k][j]['id'])){
                                    this.tagLists[k][j]['selected'] = true;
                                }
                            }
                        }

                    })
            },
            checkTag(tagTitleId, event){
                //选中选择标签
                var tag_id = event.srcElement.dataset.tagid, //标签id
                    tag_name = event.currentTarget.innerHTML,//标签名称
                    tag_data = this.tagLists[tagTitleId],
                    selectedResult = false,
                    flag = false;
                //选中tag值 tagselectLists  tag_id tag_name tag_type

                //选中的tag basic_20
                var selectedTagKeys = [];
                for (var i in this.tagselectLists){
                    selectedTagKeys.push(i);
                }


                for(var k in tag_data){
                    if (tag_data[k].id == tag_id) {
                        var key = tagTitleId+'_'+tag_id;
                        if (this.tagLists[tagTitleId][k].selected){
                            selectedResult = false;
                            delete this.tagselectLists[key];
                        } else {
                            selectedResult = true;
                            var tagValues = {"tag_id": tag_id, "tag_type": tagTitleId, "tag_name": tag_name };
                            if (selectedTagKeys.length > 0){
                                this.tagselectLists[key] = tagValues;
                            }else {
                                //新建活动
                                //this.tagselectLists = {key : tagValues};
                                this.tagselectLists[key] = tagValues;

                                console.log(this.tagselectLists);
                            }
                        }
                        this.tagLists[tagTitleId][k].selected = selectedResult;
                    }
                }
                console.log(this.tagselectLists);

            },
            loadData (page, data) {
                this.rewardArr = [];
                this.spinShow = true;
                let params = Object.assign({}, data);
                return this.$ajax.post(this.$api.thousandPeopleFacesInfo, {
                    id: this.id || 0
                })
                .then(response => {
                    const res = response.data;
                    if (res.code) {
                        let data = res.data;
                        let activitys = data.activitys;
                        this.pageList = data.act_pages;
                        this.tagselectLists = data.selected_tags; //选中的标签
                        this.formItem.id = activitys.id;
                        this.formItem.name = activitys.name;
                        this.formItem.sort = Number(activitys.sort);
                        this.formItem.isEnabled = activitys.is_enabled == 1 ? true : false;
                        this.formItem.page_id = Number(activitys.page_id);
                        this.formItem.thatRoom.page_id = activitys.page_id;
                        this.formItem.thatRoom.page_name = activitys.page_name;
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
                        this.$ajax.post(this.$api.thousandPeopleFacesSave, {
                            id: this.formItem.id,
                            name: this.formItem.name,
                            is_enabled: (this.formItem.isEnabled == true ? 1 : 0),
                            page_id: this.formItem.page_id,
                            sort: this.formItem.sort,
                            tags: this.tagselectLists
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
  #label-list li{
    display: inline-block;
    padding: 1px 10px;
    border: 1px solid #28a5ff;
    color: #28a5ff;
    text-align: center;
    float: left;
    margin: 5px;
    border-radius: 10px;
  }

  .tag-list li{
    display: inline-block;
    padding: 1px 10px;
    border: 1px solid #515a6e;;
    color: #515a6e;;
    text-align: center;
    float: left;
    margin: 5px;
    border-radius: 10px;
    cursor: pointer;
  }
  .tagSelected{
    border: 1px solid #28a5ff !important;
    color: #28a5ff !important;
  }

  .birthday-love-form{
    .kwordSearch{
      margin: 5px auto 10px;
    }
    #select-page label{
      margin: 30px auto;
    }

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
