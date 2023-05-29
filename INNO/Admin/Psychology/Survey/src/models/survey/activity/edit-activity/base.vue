<template>
    <div slot="base">
        <Form class="edit-activity" :label-width="180" ref="actDetailForm" :model="actDetail" :rules="ruleValidate">
            <FormItem label="活动标题" prop="activity_name"><!--:disabled="!isCanEdit('activity_name')"-->
                <custom-input size="large"  class="base-320" v-model="actDetail.activity_name" type="text" placeholder="" maxlength="30" :show-word-limit="true"></custom-input>
            </FormItem>
            <FormItem label="宣传图片">
                <img-view uploadType="activity" :img="actDetail.logo" @selectImg="selectActImg" @delImg="removeImage"></img-view>
                <span class="notice">建议尺寸200*200px</span>
            </FormItem>
            <FormItem label="时间限制">
                <div class="radio-box flex-s-c">
                    <div v-for="item in limitType" :key="item.key" class="radio flex-c-c pointer" :class="[actDetail.limit_time == item.key?'active':'']" @click="radioClick(item.key, 'limit_time')">
                        <div class="radio-cir"></div>
                        <div class="radio-name">{{item.name}}</div>
                    </div>
                </div>
            </FormItem>
            <FormItem label="活动时间" prop="dateTime" v-if="actDetail.limit_time == 1">
                <date-time size="large" :disabled="!isCanEdit('dateTime')" placeholder="请选择时间"  style="width:320px;" type="datetimerange" v-model="actDetail.dateTime"></date-time>
            </FormItem>
            <FormItem label="活动说明">
                <custom-input size="large" :disabled="!isCanEdit('description')" class="base-320 base-textarea" v-model="actDetail.description" type="textarea" placeholder="" maxlength="150" :show-word-limit="true"></custom-input>
            </FormItem>
            <!-- <FormItem label="测评量表" prop="model_id">
                <data-select size="large" :disabled="!isCanEdit('model_id')" type="inventory" v-model="actDetail.model_id" class="base-320"></data-select>
            </FormItem> -->
            
            <FormItem label="测评量表" prop="selectData">
                <Button :disabled="!isCanEdit('selectData')" class="m-b-20" type="default" @click="addModelList">+添加量表</Button>
                <draggable ghost-class="ghost" :list="actDetail.selectData" :group="{name:'selectData'}" handle=".drag-name" v-bind="dragOptions">
                    <div v-for="(item,index) in actDetail.selectData" :name="index" :key="index" class="drag-box flex-s-c">
                        <div class="label flex-c-c">{{index+1}}</div>
                        <div class="drag-name flex-s-c">
                            {{item.name}}
                            <div class="delete" @click="removeSelect(index)" v-if="isCanEdit('selectData')">
                                <div class="row"></div>
                                <div class="col"></div>
                            </div>
                        </div>
                    </div>
                </draggable>
            </FormItem>
            <FormItem label="活动状态">
                <i-switch v-model="actDetail.state" :disabled="!isCanEdit('state')" size="large" :true-value="1" :false-value="0" >
                    <span slot="open">开启</span>
                    <span slot="close">关闭</span>
                </i-switch>
            </FormItem>
            <FormItem label="报告结果是否公开">
                <div class="radio-box flex-s-c">
                    <div v-for="item in is_report_open" :key="item.key" class="radio flex-c-c pointer" :class="[actDetail.is_report_open == item.key?'active':'',!isCanEdit('is_report_open') && actDetail.is_report_open != item.key?'bg_f3':'']" @click="radioClick(item.key,'is_report_open')">
                        <div class="radio-cir"></div>
                        <div class="radio-name">{{item.name}}</div>
                    </div>
                </div>
            </FormItem>
            <FormItem label="是否限制参与活动的平台">
                <i-switch v-model="actDetail.limit_platform" size="large" :true-value="1" :false-value="0">
                    <span slot="open">是</span>
                    <span slot="close">否</span>
                </i-switch>
            </FormItem>
            <FormItem label="选择限制参与活动的平台" prop="limit_platform_data"  v-if="actDetail.limit_platform == 1">
                <div  class="base-320">
                    <Select placement="top" v-model="actDetail.limit_platform_data" size="large" :multiple="true">
                        <Option :value="item.key" v-for="item in platformList" :key="item.key">{{item.name}}</Option>
                    </Select>
                </div>
            </FormItem>
        </Form>
    </div>
</template>

<script>
import draggable from "vuedraggable";
export default {
    mixins: [],
    props: {
      actDetail: {
        type: Object,
        default:()=>{
          return {
            id: 0,
            activity_name: "",
            dateTime: [],
            state: 1,
            model_id: 0,
            logo: "",
            description: "",
            instruction: "",
            is_report_open:1,
            limit_platform: 0, // 0:否;1:是
            limit_platform_data: [],
            selectData:[],
            limit_time: 0, 
          }
        }
      },
      initStartTime: String
    },
    components: {
        draggable,
    },
    data() {
        return {
            init_start_time: "",
            tabsData: [
                {
                    name: 'base',
                    label: '基础信息'
                },
                {
                    name: 'custom',
                    label: '自定义编辑'
                }
            ],
            is_report_open:[{name:'公开',key:1},{name:'不公开',key:0}],
            ruleValidate: {
                activity_name: [
                    {
                        required: true,
                        validator: this._checkString,
                        message: "活动名称不能为空",
                        trigger: "blur",
                    },
                ],
                dateTime: [
                    {
                        required: true,
                        type: "array",
                        validator: this._checkEmptyArray,
                        message: "活动时间不能为空",
                        trigger: "change",
                    },
                ],
                model_id: [
                    {
                        required: true,
                        validator: this._checkThanInt,
                        message: "活动测评量表不能为空",
                        trigger: "blur",
                    },
                ],
                limit_platform_data: [
                    {
                        required: true,
                        validator: this._checkArray,
                        message: "请选择限制平台",
                        trigger: "change",
                    },
                ], 
                selectData: [
                    {
                        required: true,
                        validator: this._checkArray,
                        message: "活动测评量表不能为空",
                        trigger: "change",
                    },
                ],
            },
            platformList: [
                {
                    key: "WXAPP",
                    name: "小程序"
                },
                {
                    key: "H5",
                    name: "h5网页"
                }
            ],
            limitType: [
                { key: 0, name: "不限制" },
                { key: 1, name: "限制" },
            ],
        };
    },
    methods: {
        initData(){},
        isCanEdit(type) {
            let bool = true;
            let actDetail = this.actDetail || {};
            if (this.pageQuery.id != 0) {
                if (actDetail.is_state == 1) {
                    // 未开始
                    bool =
                        type == "limit_time" ||
                        type == "demographic" ||
                        type == "endTime" ||
                        type == "state" ||
                        type == "addOrgns" ||
                        type == "delOrgns" ||
                        type == "limit_time" ||
                        type == "dateTime" ||
                        false;
                } else if (actDetail.is_state == 2 || actDetail.is_state == 0) {
                    // 进行中
                    bool =
		    	        (type=='startTime' && !this.init_start_time) ||
                        type == "endTime" ||
                        type == "state" ||
                        type == "addOrgns" ||
                        type == "limit_time" ||
                        type == "dateTime" ||
                        false;
                } else {
                    // 已结束
                    bool = false;
                }
            }
            return bool;
        },
        save() {
          return new Promise((rs, rj)=>{
            this.$refs["actDetailForm"].validate((valid) => {
                if (valid) {
                    let req = Number(this.pageQuery.id)
                        ? (this.pageQuery.type == 'task' ? "assessmentTaskUpdate" : "appraisalActUpdate")
                        : (this.pageQuery.type == 'task' ? "assessmentTaskAdd" : "appraisalActAdd");
                    this.$MainApi[req]({
                        data: {
                            ...this.actDetail,
                            model_id:  this.actDetail.selectData && this.actDetail.selectData.map(item=>item.id),
                            startTime: this.actDetail.dateTime[0],
                            endTime: this.actDetail.dateTime[1],
                            start_time: this.actDetail.dateTime[0],
                            end_time: this.actDetail.dateTime[1],
                        },
                    }).then((res) => {
                        if (res.code) {
                          let data = res.data || {};
                          if(data.id){
                            this.$router.replace({
                              name: this.$route.name,
                              query: {
                                    ...this.pageQuery,
                                    ...this.pageParams,
                                    id: data.id || 0,
                                    $isReplace: true
                                },
                            })
                            this.$emit("saveCallback", data)
                          }
                          return rs();
                        } else {
                          this.$Message.warning(res.message||"数据异常");
                          return rj();
                        }
                    }).catch(()=>{
                      return rj();
                    })
                } else {
                    this.$Message.info("请完善活动信息");
                    return rj();
                }
            });
          })
        },
        selectActImg(img){
            this.actDetail.logo = img;
        },
        removeImage(){
           this.actDetail.logo = "";
        },
        radioClick(cur,key){
            this.checkCanEdit(key);
            this.actDetail[key] = cur;
        },
        checkCanEdit(type=''){
            if(!this.isCanEdit(type)){
                this.$Message.warning("不可编辑该内容");
                throw new Error('不可编辑该内容');
            }
        },
        addModelList(){
            this.$UIModule({
                mode:"list-modal",
                props:{
                    multiple:true,
                    title:"量表",
                    type:"inventory",
                    limitCount: 5
                },
                options: this.actDetail.selectData,
                success:(data)=>{
                    console.log('data',data)
                    this.actDetail.selectData = data;
                }
            });
        },
        removeSelect(index){
            this.$delete(this.actDetail.selectData,index);
        }
    },
    computed:{ 
        dragOptions() {
            return {
                animation: 200,
                group: "description",
                disabled: !this.isCanEdit('selectData'),
                ghostClass: "ghost",
            };
        },
    },
    mounted() {},
    watch: {
        initStartTime:{
            handler:function(nV){
                this.init_start_time = nV;
            },
            immediate: true
        }
    }
};
</script>

<style lang="less">
.edit-activity{
    .ivu-input{
        padding-right: 45px;
    }
    .radio{
        padding: 2px 10px;
        border-radius: 2px;
        background-color: #fff;
        transition: all 0.2s;
        border: 1px solid #DDDDDD;
        margin-right: 10px;
        .radio-cir{
            width: 16px;
            height: 16px;
            background-color: #FFFFFF;
            border: 1px solid #B2B2B2;
            position: relative;
            border-radius: 50%;
            margin-right: 10px;
        }
        &.active{
            background-color: #EFFAFF;
            color: #008ACB;
            .radio-cir{
                background-color: #008ACB;
                border: 1px solid #008ACB;
                position: relative;
                &::after{
                    content: "";
                    position: absolute;
                    width: 7px;
                    height: 7px;
                    border-radius: 50%;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%,-50%);
                    background-color: #fff;
                }
            }   
        }
    }
    .bg_f3{
        background: #f3f3f3;
        div{
            opacity: 0.5;
            color: #7f7f7f;
        }
    }
    .fixed_click{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 2;
    }
}
</style>
<style lang="less" scoped> 
.edit-activity{ 
    .drag-box{
        margin-bottom: 8px;
    }
    .label{
        width: 40px;
        height: 38px;
        border: 1px solid #DDDDDD;
        margin-right: 7px;
    }
    .drag-name{
        display: inline-block;
        position: relative;
        min-width: 180px;
        padding: 0 15px;
        min-height: 38px;
        background: #EFFAFF;
        border-radius: 2px;
        border: 1px solid #DDDDDD; 
        color: #0083CE;
        cursor: move;
        .delete {
            cursor:pointer;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background-color: rgba(0, 0, 0, 0.8);
            position: absolute;
            top: -2px;
            right: -8px;    
            transform: rotate(-45deg) translateY(-50%);
            .row,.col{
                top: 50%;
                left: 50%;
                transform: translate(-50%,-50%);
                background-color: #fff;
                position: absolute;
            }
            .row{ 
                width: 80%;
                height: 1px;
            }
            .col{ 
                height: 80%;
                width: 1px; 
            }
        }
        &:hover { 
            .delete {
                display: block;
            }
        }
    }
}
</style>