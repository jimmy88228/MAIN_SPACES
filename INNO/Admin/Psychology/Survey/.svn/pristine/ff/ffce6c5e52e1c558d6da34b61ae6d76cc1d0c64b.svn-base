<template>
    <Form class="edit-task" :label-width="140" ref="taskDetailForm" :model="taskDetail" :rules="ruleValidate">
        <FormItem label="选择课程" prop="course_id">
            <Button size="large" :disabled="!isCanEdit('course_id')" :type="courseInfo.id ? 'primary' : 'default'" @click="chooseCourse">{{courseInfo.id ? '已选择 ' + courseInfo.title : '选择课程'}}</Button>
        </FormItem>
        <FormItem label="任务名称" prop="activity_name">
            <custom-input size="large"  class="base-320" v-model="taskDetail.activity_name" type="text" placeholder="" maxlength="30" :show-word-limit="true"></custom-input>
        </FormItem>
        <FormItem label="任务图" prop="logo">
            <img-view uploadType="task" :isDel="false" :img="taskDetail.logo || courseInfo.cover" @selectImg="selectActImg" @delImg="removeImage"></img-view>
            <span class="notice">建议尺寸200*200px</span>
        </FormItem>
        <FormItem label="任务期限">
          <div class="radio-box flex-s-c">
              <div v-for="item in limitType" :key="item.key" class="radio flex-c-c pointer" :class="[taskDetail.limit_time == item.key ? 'active' : '']" @click="radioClick(item.key, 'limit_time')">
                  <div class="radio-cir"></div>
                  <div class="radio-name">{{item.name}}</div>
              </div>
          </div>
        </FormItem>
        <FormItem label="限期时间" prop="dateTime" v-if="taskDetail.limit_time == 1">
            <date-time size="large" placeholder="请选择限期时间"  style="width:320px;" @change="changeTime" type="datetimerange" v-model="taskDetail.dateTime" ></date-time>
        </FormItem>
        <FormItem label="是否需要关注公众号" v-if="offiaccountInfo">
            <rewrite-choose :data="followTabsData" v-model="taskDetail.subscribe_offiaccount"></rewrite-choose>
        </FormItem>
        <FormItem label="参与限制" prop="join_type">
            <rewrite-choose :disabled="isLimitJoinType" :data="joinLimitTabsDataView" v-model="taskDetail.join_type"></rewrite-choose>
            <Input v-model="taskDetail.join_type" v-show="false" />
        </FormItem>
        <!-- <FormItem label="谁可以参与" prop="join_type">
            <div class="radio-box flex-s-c">
                <div v-for="item in joinViewData" :key="item.key" class="radio flex-c-c pointer" :class="[taskDetail.join_type == item.key?'active':'',!isCanEdit('join_type') && taskDetail.join_type != item.key?'bg_f3':'']" @click="radioClick(item.key,'join_type', item)">
                    <div class="radio-cir"></div>
                    <div class="radio-name">{{item.name}}</div>
                </div>
            </div>
        </FormItem> -->
        <FormItem :label="joinName" v-if="taskDetail.join_type == 'special_school' || taskDetail.join_type == 'special_class'" prop="join_ids">
            <organizeInput
                :tagData="joinDatas"
                nameKey="name"
                :disabled-del="false"
                @handleSelect="handleSelect"
                @handleDeleteTag="handleDeleteTag">
            </organizeInput>
            <Select v-model="taskDetail.join_ids" v-show="false"></Select>
        </FormItem>
        <FormItem label="学习对象" prop="join_role">
            <rewrite-choose :disabled="!!taskDetail.id" :data="roleList" v-model="taskDetail.join_role"></rewrite-choose>
            <Input v-model="taskDetail.join_role" v-show="false"/>
        </FormItem>
        <FormItem>
            <Button size="large" type="primary" @click="save" :loading="pageLoading">&nbsp;&nbsp;保 存&nbsp;&nbsp;</Button>
        </FormItem>
    </Form>
</template>

<script>
import organizeInput from '@/components/view-components/organize-input/index.vue';
export default {
    mixins: [],
    components: { organizeInput },
    data() {
        return {
            taskDetail: {
                id: 0,
                logo: '',
                activity_name: "",
                limit_time: 0,
                start_time: "",
                end_time: "",
                course_id: 0,
                subscribe_offiaccount: 0, // //公众号 0 不需要 1 需要
                join_type: '', // all_school, special_school, all_class, special_class
                member_type: '',
                join_ids: [],
                join_role: '', // parent,student
                dateTime: []
            },
            isLimitJoinType: false,
            courseInfo: {},
            offiaccountInfo: null,
            followTabsData: [
                {
                    key: 1,
                    name: "需要"
                },
                {
                    key: 0,
                    name: "不需要"
                }
            ],
            joinLimitTabsData: [
                {
                    key: "all_school",
                    name: "所有学校"
                },
                {
                    key: "special_school",
                    name: "指定学校"
                },
                {
                    key: "all_class",
                    name: "所有班级"
                },
                {
                    key: "special_class",
                    name: "指定班级"
                }
            ],
            limitType: [{key: 0,name: "不限制"},{key: 1,name: "限制"}],
            roleList: [{name:'学生',key:'student'},{name:'家长',key:'parent'}],
            selectIds: {
                school: [],
                class: [],
                // teacher: [],
                // student: [],
                // role: []
            },
            joinIds: [],
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
                        validator: this._checkArray,
                        message: "活动时间不能为空",
                        trigger: "change",
                    },
                ],
                course_id: [
                    {
                        required: true,
                        validator: this._checkThanInt,
                        message: "请选择课程",
                        trigger: "blur",
                    },
                ],
                join_type: [
                    {
                        required: true,
                        validator: this._checkString,
                        message: "选择参与限制类型",
                        trigger: "blur",
                    },
                ],
                join_ids: [
                    {
                        required: true,
                        validator: this._checkArray,
                        message: "选择关联组织",
                        trigger: "blur",
                    },
                ],
                join_role: [
                    {
                        required: true,
                        validator: this._checkString,
                        message: "选择学校对象",
                        trigger: "blur",
                    },
                ]
            },
        };
    },
    computed: {
        joinLimitTabsDataView(){
            let viewData = [];
            let screenKey = this._structureLimit(['edu_customer', 'edu_area', 'edu_street']) ? 'school' : 'class';
            this.joinLimitTabsData.map((item)=>{
                if(item.key.includes(screenKey)){
                    viewData.push(item);
                }
            })
            return viewData;
        },
        joinName(){
            let join_type = this.taskDetail.join_type;
            if(join_type.includes("school")){
                return "关联学校"
            } else if(join_type.includes("class")){
                return "关联班级"
            }
        },
        joinDatas(){
            let taskDetail = this.taskDetail || {};
            let data = [], joinIds = [];
            if(taskDetail.join_type){
               switch(taskDetail.join_type){
                case "all_school":
                case "special_school":
                    data = this.selectIds['school'];
                    break;
                case "all_class":
                case "special_class":
                    data = this.selectIds['class'];
                    break;
               }
            }
            if(data instanceof Array){
                data.map((item)=>{
                    if(item.id){
                        joinIds.push(item.id);
                    }
                })
            }
            this.taskDetail.join_ids = joinIds;
            this.joinIds = joinIds;
            return data;
        },
    },
    methods: {
        getOffiaccountInfo(){
            let structure_id = this.taskDetail.structure_id || 0;
            return this.$MainApi.getOffiaccountInfo({
                data:{
                    structure_id: structure_id
                }
            }).then((res)=>{
                let data = res.data || {};
                this.offiaccountInfo = data.info || null;
                if(!data.info){
                    this.taskDetail.subscribe_offiaccount = 0;
                }
            })
        },
        loadData() {
            let taskId = Number(this.pageQuery.taskId) || 0;
            if (!taskId) {
                return Promise.reject();
            }
            return this.$MainApi.studyTaskInfo({
                    data: {
                        id: taskId,
                    },
                    other: {
                        isShowLoad: true,
                        isErrorMsg: true
                    },
                })
                .then((res) => {
                    if (res.code) {
                        let data = res.data || {};
                        let items = data.items || {};
                        let course_data = items.course_data || {};
                        course_data.title = course_data.name || ''
                        course_data.cover = items.logo;
                        items.dateTime = [items.start_time, items.end_time];
                        this.taskDetail = items;
                        this.courseInfo = course_data;
                        this.initJoinData(items);
                    }
                });
        },
        initJoinData(items){
            let joinType = items.join_type || '';
            let joinData = items.join_data || [];
            if(joinData instanceof Array){
                joinData.map((item)=>{
                    item._disabled = true;
                })
            }
            switch(joinType){
                case 'special_school':
                    this.selectIds['school'] = joinData || [];
                    break;
                case 'special_class':
                    this.selectIds['class'] = joinData || [];
                    break;
            }
            if(joinType.includes("all") && items.id){
                this.isLimitJoinType = true;
            }
        },
        save() {
            this.$refs["taskDetailForm"].validate((valid) => {
                console.log("valid", this.taskDetail);
                if (valid) {
                    let req = Number(this.pageQuery.taskId) ? 'studyTaskUpdate' : 'studyTaskAdd';
                    this.pageLoading = true;
                    this.$MainApi[req]({
                        data: {
                            ...this.taskDetail,
                            logo: this.taskDetail.logo || this.courseInfo.cover
                        },
                        other: { isShowLoad: true },
                    }).then((res) => {
                        if (res.code) {
                            this.$Message.success(res.message);
                            this.$router.go(-1);
                        } else {
                            this.$Message.warning(res.message);
                        }
                    }).finally(()=>{
                        setTimeout(()=>{
                            this.pageLoading = false;
                        }, 200)
                    })
                } else {
                    this.$Message.info("请完善活动信息");
                }
            });
        },
        changeTime(date){
            this.$set(this.taskDetail, 'start_time', date[0]);
            this.$set(this.taskDetail, 'end_time', date[1]);
        },
        chooseCourse(){
            let type = "course";
            this.$UIModule({
                mode: "material-modal",
                props: {
                    type: type,
                    width:1080, 
                },
                options: {
                    selectedData: this.courseInfo.id ? { [type]: [this.courseInfo] } : {},
                }, //已选数据,接口传参
                success: (data,extra={}) => {
                    let chooseData = data[type] || [];
                    if(chooseData.length){
                        this.courseInfo = chooseData[0];
                        this.taskDetail.course_id = chooseData[0].id;
                        if(!this.taskDetail.activity_name){
                            this.taskDetail.activity_name = this.courseInfo.title
                        }
                    } else {
                        this.courseInfo = {};
                        this.taskDetail.course_id = 0;
                    }
                },
          });
        },
        handleSelect(){
            let join_type = this.taskDetail.join_type || "";
            // all_school, special_school, all_class, special_class
            switch(join_type){
                case "all_school":
                case "special_school":
                    this.$selectModule({
                        mode: "school-select",
                        props: {
                            type: "checkbox",
                            data: this.joinDatas
                        },
                        ok: (data)=>{
                            if(data.length){
                                let ids = [];
                                for(let i = 0; i < data.length; i++){
                                    if(data[i].id){
                                       ids.push(data[i].id) 
                                    }
                                }
                                this.selectIds['school'] = data;
                            }
                        }
                    })
                    break;
                case "all_class":
                case "special_class":
                    this.$selectModule({
                        mode: "class-select",
                        props: {
                            type: "checkbox",
                            data: this.joinDatas
                        },
                        ok: (data)=>{
                            if(data.length){
                                let ids = [];
                                for(let i = 0; i < data.length; i++){
                                    if(data[i].id){
                                       ids.push(data[i].id) 
                                    }
                                }
                                this.selectIds['class'] = data;
                            }
                        }
                    })
                    break;
            }
            
        },
        handleDeleteTag(data){
            let join_type = this.taskDetail.join_type || "";
            switch(join_type){
                case "all_school":
                case "special_school":
                    this.selectIds['school'] = data;
                    break;
                case "all_class":
                case "special_class":
                    this.selectIds['class'] = data;
                    break;
            }
        },
        selectActImg(img){
            this.$set(this.taskDetail, 'logo', img);
        },
        removeImage(){
           this.taskDetail.logo = ""; 
        },
        isCanEdit(type){
            let bool = true;
            let cantEdit = ['course_id', 'join_type', 'join_ids']; // join_ids只能新增
            if(Number(this.pageQuery.taskId)){
                if(type && cantEdit.indexOf(type) != -1){
                    bool = false
                }
            }
            return bool
        },
        radioClick(value, key, item){
            if(this.isCanEdit(key)){
                this.$set(this.taskDetail, key, value);
            }
        },
    },
    mounted() {
        this.loadData().finally(()=>{
            this.getOffiaccountInfo();
        })
    },
};
</script>

<style lang="less">
.edit-task{
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