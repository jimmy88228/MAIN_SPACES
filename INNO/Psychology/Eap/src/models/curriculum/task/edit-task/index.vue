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
              <div v-for="item in limitType" :key="item.key" class="radio flex-c-c pointer" :class="[taskDetail.limit_time == item.key?'active':'']" @click="radioClick(item.key, 'limit_time')">
                  <div class="radio-cir"></div>
                  <div class="radio-name">{{item.name}}</div>
              </div>
          </div>
        </FormItem>
        <FormItem label="限期时间" prop="dateTime" v-if="taskDetail.limit_time == 1">
            <date-time size="large" placeholder="请选择限期时间"  style="width:320px;" @change="changeTime" type="datetimerange" v-model="taskDetail.dateTime" ></date-time>
        </FormItem>
        <!-- <FormItem label="谁可以参与" prop="join_type">
            <div class="radio-box flex-s-c">
                <div v-for="item in joinViewData" :key="item.key" class="radio flex-c-c pointer" :class="[taskDetail.join_type == item.key?'active':'',!isCanEdit('join_type') && taskDetail.join_type != item.key?'bg_f3':'']" @click="radioClick(item.key,'join_type', item)">
                    <div class="radio-cir"></div>
                    <div class="radio-name">{{item.name}}</div>
                </div>
            </div>
        </FormItem>
        <FormItem :label="joinName" v-show="taskDetail.join_type == 'structure' || taskDetail.join_type == 'member'">
            <organizeInput
                :tagData="tagData"
                nameKey="name"
                :disabled-del="!isCanEdit('join_ids')"
                @handleSelect="handleSelect"
                @handleDeleteTag="handleDeleteTag">
            </organizeInput>
        </FormItem>
        <FormItem label="指定角色" v-show="taskDetail.join_type == 'role'">
            <Select class="base-320" size="large" :multiple="true" v-model="selectIds.role">
                <Option :disabled="item._disabled" v-for="item in roleList" :key="item.key" :value="item.key">{{item.name}}</Option>
            </Select>
        </FormItem> -->

        <FormItem label="谁可以参与" prop="join_data">
            <div class="radio-box flex-s-c">
                <div v-for="item in selectJoinDataView" :key="item.key" class="radio flex-c-c pointer" :class="[taskDetail.join_type == item.key?'active':'',!isCanEdit('join_type') && taskDetail.join_type != item.key?'bg_f3':'']" @click="radioClick(item.key,'join_type')">
                    <div class="radio-cir"></div>
                    <div class="radio-name">{{item.name}}</div>
                </div>
            </div>
        </FormItem>
        <FormItem :label="joinName" v-show="taskDetail.join_type == 'structure' || taskDetail.join_type == 'member'">
            <organizeInput
                :tagData="taskDetail.join_type == 'member' ? taskDetail.join_data_member :  taskDetail.join_data_stc"
                :nameKey="taskDetail.join_type == 'member' ? 'member_name' : 'structure_name'"
                :disabled-del="!isCanEdit('join_ids')"
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
            },
            courseInfo: {},
            joinName: "",
            limitType: [{key: 0,name: "不限制"},{key: 1,name: "限制"}],
            joinData:[{name:'指定组织',key:'structure', tip: "关联组织"},{name:'指定人',key:'member'}, {name:'指定角色',key:'role'}],
            roleList: [{name:'学生',key:'student'},{name:'家长',key:'parent'},{name:'老师',key:'teacher'}],
            selectJoinData:[{name:'所有人',key:'everyone'},{name:'指定组织',key:'structure'},{name:'指定人',key:'member'}],
            selectIds: {
                school: [],
                class: [],
                teacher: [],
                student: [],
                role: []
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
        },
        // joinViewData(){
        //     let joinData = this.joinData || [];
        //     let joinViewData = [];
        //     let join_type = this.taskDetail.join_type || "";
        //     for(let i = 0; i < joinData.length; i++){
        //         if(this._structureType == 'edu_area' || this._structureType == 'edu_street'){
        //             if(joinData[i].key != 'member'){
        //                 joinViewData.push(joinData[i]);
        //             }
        //         } else {
        //             joinViewData.push(joinData[i]);
        //         }
        //         if(join_type == joinData[i].key){
        //             this.joinName = joinData[i].tip || joinData[i].name;
        //         }
        //     }
        //     return joinViewData || [];
        // },
        tagData(){
            let join_type = this.taskDetail.join_type || "";
            let selectIds = this.selectIds || {};
            let result = [];
            if(join_type){
                if(join_type == 'structure'){
                    if(this._structureType == 'edu_area' || this._structureType == 'edu_street'){
                        result = selectIds["school"] || [];
                    } else {
                        result = selectIds["class"] || [];
                    }
                } else if(join_type == 'member'){
                    let data = [...(selectIds["teacher"] || []), ...(selectIds["student"] || [])]
                    result = data || [];
                }
            }
            return result;
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
                        // items.dateTime = [items.start_time, items.end_time];
                        this.taskDetail = Object.assign(
                            {},
                            items,
                            {   join_data_stc:items.join_type == 'structure' ? this.filterJoinData(items.join_data,items.join_type) : [],
                                join_data_member:items.join_type == 'member' ? this.filterJoinData(items.join_data,items.join_type) : [],
                                dateTime:[items.start_time || "",items.end_time || ""],
                                // model_id: get_model.map(item=>item.model_id),
                                // selectData:get_model.sort((a,b)=>{return a.sort-b.sort})
                            }
                        ) 
                        this.courseInfo = course_data;
                        // this.initJoinData(items.join_type, items.join_data, items.join_ids);
                    }
                });
        },
        filterJoinData(data,type){
            data && data.forEach(item=>{
                item.disabled = !this.isCanEdit('join_type');
                item.disableDel = !this.isCanEdit('join_type');
            })
            console.log('filterJoinData',type,data)
            return data;
        },
        initJoinData(joinType, joinData, joinIds){
            if(joinType == 'structure'){
                if(joinData.length){ // 数据增加不可取消
                    joinData.map((item)=>{
                        item._disabled = true;
                    })
                }
                this.selectIds[(this._structureType == 'edu_area' || this._structureType == 'edu_street') ? 'school' : 'class'] = joinData || []
            } else if(joinType == 'role'){
                if(joinIds.length){
                    this.roleList.map((item)=>{
                        if(joinIds.indexOf(item.key) != -1){
                            this.$set(item, '_disabled', true)
                        }
                    })
                }
                console.log("roleList", this.roleList)
                this.selectIds['role'] = joinIds
            } else {
                if(joinData.student){
                    let student = joinData.student || [];
                    student.map((item)=>{
                        item.type = 'student';
                        item._disabled = true;
                    })
                }
                if(joinData.teacher){
                    let teacher = joinData.teacher || [];
                    teacher.map((item)=>{
                        item.type = 'teacher';
                        item._disabled = true;
                    })
                }
                this.selectIds = joinData;
            }
        },
        getJoinIds(){
            let taskDetail = this.taskDetail || {};
            let join_type = taskDetail.join_type;
            let data = [],teacher = [], student = [];
            let join_ids = [], hasData = false;
            switch(join_type){
                case "structure":
                    data = this.selectIds[(this._structureType == 'edu_area' || this._structureType == 'edu_street') ? 'school' : 'class']
                    data.map((item)=>{
                        if(item.id){
                            join_ids.push(item.id)
                        }
                    })
                    hasData = data.length > 0
                    break;
                case "member":
                    teacher = this.selectIds['teacher'] || [];
                    student = this.selectIds['student'] || [];
                    join_ids = { teacher: [], student: [] }
                    teacher.map((item)=>{
                        if(item.id){
                            join_ids.teacher.push(item.id)
                        }
                    })
                    student.map((item)=>{
                        if(item.id){
                            join_ids.student.push(item.id)
                        }
                    })
                    hasData = teacher.length > 0 || student.length > 0
                    break;
                case "role":
                    join_ids = this.selectIds['role'] || [];
                    hasData = join_ids.length > 0
                    break;
            }
            return hasData ? join_ids : false;
        },
        save() {
            this.$refs["taskDetailForm"].validate((valid) => {
                if (valid) {
                    // let join_ids = this.getJoinIds();                    
                    // let join_ids = this.getCurJoinData();                    
                    // if(!join_ids) {
                    //     this.$Message.warning("请选择可参与人员");
                    //     return;
                    // }
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
                            join_ids:this.taskDetail.join_type == 'EVERYONE' ? [] : this.getCurJoinData(),
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
                    console.log('success',data,chooseData)
                    if(chooseData.length){
                        this.courseInfo = chooseData[0];
                        if(chooseData[0].id != this.taskDetail.course_id){
                            this.taskDetail.join_data_member = [];
                            this.taskDetail.join_data_stc = []; 
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
        // handleSelect(){
        //     let join_type = this.taskDetail.join_type || "";
        //     switch(join_type){
        //         case "structure": // 区管理员选择学校组织，学校管理员选择班级组织
        //             this.$selectModule({
        //                 mode: (this._structureType == 'edu_area' || this._structureType == 'edu_street') ? "school-select" : "class-select",
        //                 props: {
        //                     type: "checkbox",
        //                     data: (this._structureType == 'edu_area' || this._structureType == 'edu_street') ? this.selectIds["school"] : this.selectIds["class"],
        //                 },
        //                 ok:(data)=>{
        //                     if(data.length){
        //                         let ids = [];
        //                         for(let i = 0; i < data.length; i++){
        //                             if(data[i].id){
        //                                ids.push(data[i].id) 
        //                             }
        //                         }
        //                         this.selectIds[(this._structureType == 'edu_area' || this._structureType == 'edu_street') ? 'school' : 'class'] = data;
        //                     }
        //                 }
        //             })
        //             break;
        //         case "member":
        //             this.$UIModule({
        //                 mode: "member-view",
        //                 props: {
        //                     isHideTabs: false,
        //                     multiple: true
        //                 },
        //                 options: {
        //                     selectData: [...(this.selectIds['teacher'] || []),...(this.selectIds['student'] || [])],
        //                 },
        //                 success:(data)=>{
        //                     let student = [], teacher = [];
        //                     for(let i = 0; i < data.length; i++){
        //                         let item = data[i] || {};
        //                         if(item.type == 'student'){
        //                             student.push(item);
        //                         } else if(item.type == 'teacher'){
        //                             teacher.push(item)
        //                         }
        //                     }
        //                     this.selectIds["student"] = student;
        //                     this.selectIds["teacher"] = teacher;
        //                 }
        //             })
        //             break;
        //     }
            
        // },
        // handleDeleteTag(data){
        //     let join_type = this.taskDetail.join_type || "";
        //     let teacher = [], student = [];
        //     switch(join_type){
        //         case "structure":
        //             this.selectIds[(this._structureType == 'edu_area' || this._structureType == 'edu_street') ? 'school' : 'class'] = data || [];
        //             break;
        //         case "member":
        //             if(data instanceof Array){
        //                 data.map((item)=>{
        //                     if(item.type == 'teacher'){
        //                         teacher.push(item)
        //                     } else if(item.type == 'student'){
        //                         student.push(item)
        //                     }
        //                 })
        //             }
        //             this.selectIds["teacher"] = teacher || [];
        //             this.selectIds["student"] = student || [];
        //             break;
        //     }
        // },
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
            // if(this.isCanEdit(key)){
            //     this.$set(this.taskDetail, key, value);
            //     // switch(key){
            //     //     case "join_type":
            //     //         this.joinName = item.name || "";
            //     //         break;
            //     // }
            // }
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
            let temp = this.taskDetail.join_type == 'member' ? this.taskDetail.join_data_member :  this.taskDetail.join_data_stc;
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
                    mode = "member-view";
                    props.multiple=true;
                    props.assign_ids = onlyCanSelArr;
                }else{
                    mode = "organize-modal";
                    props.isShowAllBtn = true;
                    props.isLImitMain = true;
                    props.isOnlyCanSel = true;
                    props.onlyCanSelArr = onlyCanSelArr;
                } 
                this.$UIModule({
                    mode,
                    props,
                    options: this.getCurJoinData('temp'),
                    success:(data)=>{
                        if(data instanceof Array){
                            this.taskDetail[`${join_type == 'member' ? 'join_data_member':'join_data_stc'}`] = JSON.parse(JSON.stringify(data));
                            this.taskDetail.join_data = join_type == 'member' ? this.taskDetail.join_data_member :  this.taskDetail.join_data_stc;
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
            this.checkCanEdit('join_type');
            this.taskDetail[`${this.taskDetail.join_type == 'member' ? 'join_data_member':'join_data_stc'}`] = data;
            this.taskDetail.join_data = this.getCurJoinData();
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