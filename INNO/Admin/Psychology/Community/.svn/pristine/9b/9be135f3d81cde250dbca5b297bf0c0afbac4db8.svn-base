<template>
    <Form class="edit-task" :label-width="140" ref="taskDetailForm" :model="taskDetail" :rules="ruleValidate">
        <FormItem label="选择课程" prop="course_id">
            <Button size="large" :disabled="!isCanEdit('course_id')" :type="courseInfo.id ? 'primary' : 'default'" @click="chooseCourse">{{courseInfo.id ? '已选择 ' + courseInfo.title : '选择课程'}}</Button>
        </FormItem>
        <FormItem label="任务名称" prop="activity_name">
            <custom-input size="large"  class="base-320" v-model="taskDetail.activity_name" type="text" placeholder="" maxlength="50" :show-word-limit="true"></custom-input>
        </FormItem>
        <FormItem label="任务图" prop="logo">
            <img-view uploadType="task" :isDel="false" :img="taskDetail.logo || courseInfo.cover" @selectImg="selectActImg" @delImg="removeImage"></img-view>
            <span class="notice">建议尺寸200*200px</span>
        </FormItem>
        <FormItem label="任务期限">
          <div class="radio-box flex-s-c">
              <div v-for="item in limitType" :key="item.key" class="radio flex-c-c pointer" :class="[taskDetail.limit_time == item.key?'active':'']" @click="radioClick(item.key, 'limit_time')">
                  <div class="radio-cir"></div>
                  <div class="radio-name">{{item.name}}</div>
              </div>
          </div>
        </FormItem>
        <FormItem label="限期时间" prop="dateTime" v-if="taskDetail.limit_time == 1">
            <date-time size="large" placeholder="请选择限期时间"  style="width:320px;" @change="changeTime" type="datetimerange" v-model="taskDetail.dateTime" ></date-time>
        </FormItem>

        <FormItem label="谁可以参与" prop="join_data">
            <div class="radio-box flex-s-c">
                <div v-for="item in selectJoinDataView" :key="item.key" class="radio flex-c-c pointer" :class="[taskDetail.join_type == item.key?'active':'',!isCanEdit('join_type') && taskDetail.join_type != item.key?'bg_f3':'']" @click="radioClick(item.key,'join_type')">
                    <div class="radio-cir"></div>
                    <div class="radio-name">{{item.name}}</div>
                </div>
            </div>
        </FormItem>
        <FormItem class="organize-input-formitem" :label="joinName" v-show="taskDetail.join_type && taskDetail.join_type != 'everyone'">
            <organizeInput
                :tagData="(dataKey[taskDetail.join_type] && taskDetail[dataKey[taskDetail.join_type]]) || []"
                :nameKey="dataName[taskDetail.join_type]"
                :disabled-del="false"
                @handleSelect="handleSelect"
                @handleDeleteTag="handleDeleteTag">
            </organizeInput>
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
                join_type: '',
                member_type: '',
                // join_ids: [],
                dateTime: [],
                join_data:[],
                join_data_member:[],
                join_data_stc:[],
                join_data_group: []
            },
            courseInfo: {},
            limitType: [{key: 0,name: "不限制"},{key: 1,name: "限制"}],
            joinData:[{name:'指定组织',key:'structure', tip: "关联组织"},{name:'指定分组',key:'group'},{name:'指定人',key:'member'}],
            selectJoinData:[{name:'所有人',key:'everyone'},{name:'指定组织',key:'structure'},{name:'指定分组',key:'group'},{name:'指定人',key:'member'}],
            dataKey: {
                structure: 'join_data_stc',
                member: 'join_data_member',
                group: 'join_data_group'
            },
            dataName: {
                structure: 'structure_name',
                member: 'member_name',
                group: 'name'
            },
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
                        message: "选择参与类型",
                        trigger: "blur",
                    },
                ], 
                join_data: [
                    {
                        required: true,
                        validator: (rule, value, callback)=>{
                            const {
                                field
                            } = rule;
                            if(this.taskDetail.join_type == 'everyone' || (value.length > 0 && (value[0] || value[0] == 0))){
                                callback();
                            } else {
                                callback(field.message || '值不能为空');
                            }
                        },
                        message: `请先选择指定内容`,
                        trigger: "blur",
                    },
                ], 
            },
            taskCourseSelArr:[]
        };
    },
    computed: { 
        joinName(){
            let joinData = this.joinData;
            let join_type = this.taskDetail.join_type;
            for(let i = 0; i < joinData.length; i++){
                if(join_type == joinData[i].key){
                    return joinData[i].name;
                }
            }
        },
        selectJoinDataView(){
            let selectJoinData = this.selectJoinData || [];
            let selectJoinDataView = [];
            selectJoinData.map((item)=>{
                if(this._isSuperIds == 1 && item.key == 'everyone'){
                    return;
                }
                selectJoinDataView.push(item)
            })
            return selectJoinDataView;
        }
    },
    methods: {
        loadData() {
            let taskId = Number(this.pageQuery.taskId) || 0;
            if (!taskId) {
                return;
            }
            this.$MainApi.studyTaskInfo({
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
                        let joinData = this.filterJoinData(items.join_data, items.join_type) || [];
                        for(let i in this.dataKey){
                            items[this.dataKey[i]] = [];
                        }
                        if(this.dataKey[items.join_type]){
                            items[this.dataKey[items.join_type]] = joinData;
                        }
                        this.taskDetail = items;
                        this.courseInfo = course_data;
                    }
                });
        },
        filterJoinData(data,type){
            data && data.forEach(item=>{
                item.disabled = !this.isCanEdit('join_type');
                item.disableDel = !this.isCanEdit('join_type');
            })
            return data;
        },
        save() {
            this.$refs["taskDetailForm"].validate((valid) => {
                if (valid) {
                    let req = Number(this.pageQuery.taskId) ? 'studyTaskUpdate' : 'studyTaskAdd';
                    this.pageLoading = true;
                    let taskDetail = this.taskDetail||{};
                    this.$MainApi[req]({
                        data: {
                            // ...this.taskDetail,
                            id: taskDetail.id,
                            logo: taskDetail.logo,
                            activity_name: taskDetail.activity_name,
                            limit_time: taskDetail.limit_time,
                            start_time: taskDetail.start_time,
                            end_time: taskDetail.end_time,
                            course_id: taskDetail.course_id, 
                            member_type: taskDetail.member_type, 
                            dateTime: taskDetail.dateTime, 
                            join_ids:this.taskDetail.join_type == 'everyone' ? [] : this.getCurJoinData(),
                            // join_ids: join_ids,
                            join_type: this.taskDetail.join_type,
                            logo: this.taskDetail.logo || this.courseInfo.cover,
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
                        if(chooseData[0].id != this.taskDetail.course_id){
                            for(let i in this.dataKey){
                                this.taskDetail[this.dataKey[i]] = [];
                            }
                        }
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
        
        radioClick(cur,key){
            this.checkCanEdit(key);
            this.taskDetail[key] = cur;
            if(key == 'join_type'){
                this.taskDetail.join_data = this.getCurJoinData();
            }
            
        },
        checkCanEdit(type=''){
            if(!this.isCanEdit(type)){
                throw new Error('不可编辑该内容');
            }
        },
        getCurJoinData(type){
            let join_type = this.taskDetail.join_type;
            let temp = [];
            if(this.dataKey[join_type]){
                temp = this.taskDetail[this.dataKey[join_type]];
            }
            if(type == 'temp'){
                return temp
            }
            return temp.map(item=>Number(item.id))
        },
        handleSelect(){
            this.studyTaskCourseInfo().then(onlyCanSelArr=>{
                let mode = '',join_type = this.taskDetail.join_type;
                let props = {};
                if(join_type == 'member'){
                    mode = "group-member-view";
                    props.multiple=true;
                    props.isLImitMain = true;
                    props.isOnlyCanSel = true; 
                    props.assign_ids = onlyCanSelArr;
                    props.expandLevel = 1;
                }else if(join_type == "group"){
                    mode = "group-modal";
                    props.multiple=true;
                } else {
                    mode = "organize-modal";
                    props.multiple=true;
                    props.isShowAllBtn = true;
                    props.isLImitMain = true;
                    props.isOnlyCanSel = true;
                    props.onlyCanSelArr = onlyCanSelArr;
                    props.expandLevel = 1;
                } 
                this.$UIModule({
                    mode,
                    props,
                    options: this.getCurJoinData('temp'),
                    success:(data)=>{
                        if(data instanceof Array){
                            let selectData = JSON.parse(JSON.stringify(data || []));
                            if(this.dataKey[join_type]){
                                this.taskDetail[this.dataKey[join_type]] = selectData;
                            }
                            this.taskDetail.join_data = this.getCurJoinData('temp');
                        }
                    }
                });
            }).catch((error)=>{
                if(!error.course_id){
                    this.$Message.warning("请先选择课程")
                }
            })
        },
        handleDeleteTag(data){
            console.log("data", data);
            let join_type = this.taskDetail.join_type;
            if(this.dataKey[join_type]){
                this.taskDetail[this.dataKey[join_type]] = data;
            }
            this.taskDetail.join_data = this.getCurJoinData('temp');
        },
        studyTaskCourseInfo(){
            let course_id = this.courseInfo.course_id || this.taskDetail.course_id || 0;
            if(this.taskCourseSelArr[course_id]){
                return Promise.resolve(this.taskCourseSelArr[course_id])
            }
            if(!course_id){
                return Promise.reject({
                    course_id: course_id
                })
            }
            return this.$MainApi.studyTaskCourseInfo({
                data: {
                        id: course_id,
                    },
                    other: {
                        isShowLoad: true,
                        isErrorMsg: true
                    },
                }).then(res=>{
                    if(res.code){
                        let data = res.data||{};
                        let select_ids = data.select_ids||[];
                        this.taskCourseSelArr[course_id] || (this.taskCourseSelArr[course_id] = select_ids);
                        return select_ids;
                    }
                })
        },
    },
    mounted() {
        this.loadData();
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
<style lang="less" scoped>
.organize-input-formitem{
    /deep/.ivu-form-item-label{
        margin-top: 5px;
    }
}
</style>
