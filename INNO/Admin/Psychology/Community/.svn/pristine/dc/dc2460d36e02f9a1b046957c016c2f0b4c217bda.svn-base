<template>
    <div>
        <Form class="edit-activity" :label-width="140" ref="actDetailForm" :model="actDetail" :rules="ruleValidate" ><!--@click="adjust('toggleClose')"-->
            <FormItem label="活动标题" prop="name">
                <custom-input size="large" style="width: 320px;" v-model="actDetail.name" type="text" placeholder="请输入活动标题" maxlength="30" :show-word-limit="true"></custom-input>
            </FormItem>
            <FormItem label="开始时间" prop="start_time">
                <date-time 
                placeholder="请选择开始时间"
                type="datetime" 
                :disabled="timeState != 0"
                format="yyyy-MM-dd HH:mm" 
                :afterNow="true" 
                v-model="actDetail.start_time" 
                size="large" 
                style="width: 320px;"
                :limitDate="'after ' + actDetail.end_time"
                ></date-time>
            </FormItem>
            <FormItem label="结束时间" prop="end_time">
                <date-time 
                placeholder="请选择结束时间"
                type="datetime" 
                :disabled="timeState == 2"
                format="yyyy-MM-dd HH:mm" 
                :afterNow="true" 
                v-model="actDetail.end_time" 
                size="large" 
                style="width: 320px;"
                :limitDate="'before ' + actDetail.start_time"
                ></date-time>
            </FormItem>
            <FormItem label="讲座类型">
                {{actDetail.type == 'offline' ? '线下' : '线上'}}
            </FormItem>
            <FormItem label="活动归属组织" prop="bind_structure_id">
                <!-- <Tag size="large" class="course-tag" color="primary" type="dot" v-if="actDetail.get_structure && actDetail.get_structure.id">{{actDetail.get_structure && actDetail.get_structure.name}}</Tag>
                    <Button size="large" :disabled="timeState != 0" @click="chooseStructure()">绑定组织</Button> -->
                <div class="organize-belong-view base-320" >
                    <p>
                    <Tag type="dot" color="primary" v-if="actDetail.get_structure && actDetail.get_structure.id">{{actDetail.get_structure && actDetail.get_structure.name}}</Tag>
                    </p>
                    <span v-if="timeState == 0" class="organize-select-pointer" @click="chooseStructure()">选择</span>
                </div>
                <p class="m-t-10 desc-notice">活动讲座的数据归属组织设置</p>
            </FormItem>
            <template v-if="actDetail.type == 'offline'">
                <FormItem label="签到背景图" prop="sign_bg">
                    <div class="relative">
                        <img-view :isView="timeState == 2" uploadType="activity" :img="actDetail.sign_bg" @selectImg="selectActImg" @delImg="removeImage"></img-view>
                        <span class="notice">建议尺寸200*200px</span>
                    </div>
                </FormItem>
                <!-- <FormItem label="主办单位" prop="organizer">
                    <custom-input size="large" style="width: 320px;" v-model="actDetail.organizer" type="text" placeholder="" maxlength="30" :show-word-limit="true"></custom-input>
                </FormItem> -->
                <FormItem label="主讲人" prop="lecturer">
                    <custom-input size="large" style="width: 200px;" v-model="actDetail.lecturer" type="text" placeholder="" maxlength="16" :show-word-limit="true"></custom-input>
                </FormItem>
            </template>
            <template v-else-if="actDetail.type == 'online'">
                <FormItem label="讲座内容" prop="course_data">
                    <Tag size="large" class="course-tag" color="primary" type="dot" v-if="actDetail.course_data.id">{{actDetail.course_data.name}}</Tag>
                    <Button size="large" :disabled="timeState != 0" @click="chooseLecture()">选择内容</Button>
                </FormItem>
                <FormItem label="参与限制" prop="join_type">
                    <rewrite-choose v-model="actDetail.join_type" :data="selectJoinDataView"></rewrite-choose>
                    <Input v-model="actDetail.join_type" v-show="false"/>
                </FormItem>
                <FormItem prop="join_data" :label="joinName" v-show="actDetail.join_type == 'structure' || actDetail.join_type == 'member'">
                    <organizeInput 
                    :tagData="(actDetail.join_type == 'structure' ? actDetail.structure_list : actDetail.member_list) || []" 
                    nameKey="name" 
                    @handleSelect="handleSelect" 
                    @handleDeleteTag="handleDeleteTag"
                    :disabledSel="timeState == 2"
                    >
                    </organizeInput>
                </FormItem>
            </template>
        </Form>
    </div>
</template>

<script>
import organizeInput from "@/components/view-components/organize-input/index.vue";
import draggable from "vuedraggable";
import noneCoverImg from "@/assets/images/none-cover.png"
export default {
    mixins: [],
    components: {
        organizeInput,
        draggable
    },
    props: {
        timeState: {
            type: Number,
            default: 0
        },
        actDetail:{
            type: Object,
            default:()=>{
                return {}
            }
        },
        initStartTime: String
    },
    data() {
        return {
            
            selectJoinData: [
                { name: "所有人", key: "everyone" },
                { name: "指定组织", key: "structure" },
                { name: "指定人", key: "member" },
            ],
            dataKey: {
                structure: 'structure_list',
                member: 'member_list',
                group: 'group_list'
            },
            dataName: {
                structure: 'structure_name',
                member: 'member_name',
                group: 'name'
            },
            ruleValidate: {
                name: [
                    {
                        required: true,
                        validator: this._checkString,
                        message: "活动名称不能为空",
                        trigger: "blur",
                    },
                ],
                start_time: [
                    {
                        required: true,
                        validator: this._checkString,
                        message: "请选择活动开始时间",
                        trigger: "change",
                    },
                ],
                end_time: [
                    {
                        required: true,
                        validator: this._checkString,
                        message: "请选择活动结束时间",
                        trigger: "change",
                    },
                ],
                bind_structure_id:[
                    {
                        required: true,
                        validator: this._checkThanInt,
                        message: "请选择绑定组织",
                        trigger: "blur",
                    },
                ],
                course_data: [
                    {
                        required: true,
                        validator: this._checkObject,
                        message: "请选择讲座内容",
                        trigger: "blur",
                    },
                ],
                join_type:[
                    {
                        required: true,
                        validator: this._checkString,
                        message: "请选择参与限制",
                        trigger: "blur",
                    },
                ],
                join_data: [
                    {
                        required: true,
                        validator: (rule, value, callback) => {
                            const { field } = rule;
                            let data = this.getCurJoinData();
                            if (this.actDetail.join_type == "everyone" || (data.length > 0 && (data[0] || data[0] == 0))) {
                                callback();
                            } else {
                                callback(field.message || "值不能为空");
                            }
                        },
                        message: `请先选择指定内容`,
                        trigger: "blur",
                    },
                ]
            },
            taskCourseSelArr: {},
            // isShowAdjustBox: false,
            // isShowJoinMembers: false,
            // curJoinMsg: {},
            noneCoverImg,
        };
    },
    computed: {
        joinName() {
            let actDetail = this.actDetail || {};
            let joinName = "";
            if(!actDetail.id && !actDetail.join_type && this._isSuperIds != 1){
                actDetail.join_type = "everyone"
            }
            let selectJoinData = this.selectJoinData || [];
            for(let i = 0; i < selectJoinData.length; i++){
                if(selectJoinData[i].key == actDetail.join_type){
                    joinName = selectJoinData[i].name;
                    break;
                }
            }
            return joinName;
        },
        selectJoinDataView() {
            let selectJoinData = this.selectJoinData || [];
            let timeState = this.timeState;
            let selectJoinDataView = [];
            selectJoinData.map((item) => {
                if(this._isSuperIds == 1 && item.key == 'everyone'){
                    return;
                }
                timeState > 0 && this.$set(item, "disabled", true)
                selectJoinDataView.push(item);
            });
            return selectJoinDataView;
        },
    },
    methods: {
        initData(){
        },
        clearLecture(index){
            this.actDetail.course_data = {}
        },
        chooseStructure(){
            let get_structure = this.actDetail.get_structure || {};
            let structureData = get_structure.id ? [get_structure] : [];
            this.$UIModule({
                mode: "organize-modal",
                props: {
                    isShowAllBtn: false,
                    multiple: false,
                    isLImitMain: true
                },
                options: structureData,
                success: (data) => {
                    if (data instanceof Array) {
                        let detail = data[0] || {}
                        this.actDetail.bind_structure_id = detail.id || 0
                        this.actDetail.get_structure = {
                            id: detail.id || 0,
                            name: detail.title || ""
                        }
                    }
                },
            });
        },
        chooseLecture(){
            let actDetail = this.actDetail;
            let course_data = actDetail.course_data || {};
            let selectedData = course_data.id ? [course_data] : [], type = "course";
            this.$UIModule({
                mode: "material-modal",
                props: {
                    isMulti: false,
                    type: type,
                    width: 900,
                    showTabs: [ type ]
                },
                options: {selectedData: {
                    course: selectedData
                }}, //已选数据,接口传参
                success: (data,extra={}) => {
                    let type = extra.type || "";
                    let arr = [].concat(data[type] || []);
                    this.actDetail.course_data = {
                        id: (arr[0] && arr[0].id) || 0,
                        name: (arr[0] && arr[0].title) || ''
                    }
                },
            });
        },
        save() {
            return new Promise((rs, rj)=>{
              this.$refs["actDetailForm"].validate((valid) => {
                if (valid) {
                    let req = Number(this.pageQuery.id) ? "updateSpecialLecture" : "addSpecialLecture";
                    let actDetail = this.actDetail || {};
                    let course_data = actDetail.course_data || {};
                    this.$MainApi[req]({
                        data: {
                            id: actDetail.id || 0,
                            name: actDetail.name,
                            start_time: actDetail.start_time,
                            end_time: actDetail.end_time,
                            type: actDetail.type,
                            sign_bg: actDetail.sign_bg || "",
                            organizer: actDetail.organizer,
                            lecturer: actDetail.lecturer,
                            lecture_content_id: course_data.id || "",
                            lecture_content_title: course_data.name || "",
                            join_type: actDetail.join_type,
                            join_ids: actDetail.join_type == "everyone" ? [] : this.getCurJoinData(),
                            bind_structure_id: actDetail.bind_structure_id
                        },
                        other: { 
                            isShowLoad: true,
                            // isMsg: true
                         },
                    }).then((res) => {
                        if (res.code) {
                          return rs();
                        } else {
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
        selectActImg(img) {
            this.actDetail.sign_bg = img;
        },
        removeImage() {
            this.actDetail.sign_bg = "";
        },
        handleSelect() {
            this.studyTaskCourseInfo().then((onlyCanSelArr)=>{
                this.handleSelectHandle(onlyCanSelArr);
            })
        },
        handleSelectHandle(onlyCanSelArr){
            let mode = "",
                join_type = this.actDetail.join_type;
            let props = {};
            if (join_type == "member") {
                mode = "group-member-view";
                props.multiple = true;
                // props.isOnlyCanSel = true;
                // props.assign_ids = onlyCanSelArr;
            } else if(join_type == "structure"){
                mode = "organize-modal";
                props.isShowAllBtn = true;
                props.multiple = true;
                props.isLImitMain = true;
                props.isOnlyCanSel = true;
                props.onlyCanSelArr = onlyCanSelArr;
                props.expandLevel = 1;
            } else if(join_type == ""){
                mode = "group-modal";
                props.multiple = true;
            }
            this.$UIModule({
                mode,
                props,
                options: this.getCurJoinData("temp"),
                success: (data) => {
                    if (data instanceof Array) {
                        if(join_type == "member"){
                            this.actDetail.member_list = data;
                        } else if(join_type == "structure"){
                            data.map((item)=>{
                                if(!item.name){
                                    item.name = item.title
                                }
                            })
                            this.actDetail.structure_list = data;
                        } else {

                        }
                    }
                },
            });
        },
        getCurJoinData(type) {
            let temp = [];
            let join_type = this.actDetail.join_type || "";
            if(this.dataKey[join_type]){
                temp = this.actDetail[this.dataKey[join_type]] || [];
            }
            if (type == "temp") {
                return temp;
            }
            return temp.map((item) => Number(item.id));
        },
        handleDeleteTag(data) {
            data = JSON.parse(JSON.stringify(data || []));
            let join_type = this.actDetail.join_type || "";
            if(this.dataKey[join_type]){
                this.actDetail[this.dataKey[join_type]] = data;
            }
            this.actDetail.join_data = data;
        },
        studyTaskCourseInfo(){
            let course_data = this.actDetail.course_data || {};
            let course_id = course_data.id || 0;
            if(!course_id){
                this.$Message.warning("请选择课程");
                return Promise.reject({
                    course_id: course_id
                })
            }
            if(this.taskCourseSelArr[course_id]){
                return Promise.resolve(this.taskCourseSelArr[course_id])
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

    },
    watch: {
    }
};
</script>

<style lang="less" scoped>
.edit-activity {
    .ivu-input {
        padding-right: 45px;
    }
    .radio {
        padding: 2px 10px;
        border-radius: 2px;
        background-color: #fff;
        transition: all 0.2s;
        border: 1px solid #dddddd;
        margin-right: 10px;
        .radio-cir {
            width: 16px;
            height: 16px;
            background-color: #ffffff;
            border: 1px solid #b2b2b2;
            position: relative;
            border-radius: 50%;
            margin-right: 10px;
        }
        &.active {
            background-color: #effaff;
            color: #008acb;
            .radio-cir {
                background-color: #008acb;
                border: 1px solid #008acb;
                position: relative;
                &::after {
                    content: "";
                    position: absolute;
                    width: 7px;
                    height: 7px;
                    border-radius: 50%;
                    left: 50%;
                    top: 50%;
                    transform: translate(-50%, -50%);
                    background-color: #fff;
                }
            }
        }
    }
    .bg_f3 {
        background: #f3f3f3;
        div {
            opacity: 0.5;
            color: #7f7f7f;
        }
    }
    .fixed_click {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 2;
    }
    .drag-box {
        margin-bottom: 8px;
    }
    .label {
        width: 49px;
        height: 49px;
        border: 1px solid #dddddd;
        margin-right: 7px;
    }
    .drag-name {
        // display: inline-block;
        position: relative;
        min-width: 180px;
        padding:0 5px;
        min-height: 49px;
        background: #effaff;
        border-radius: 2px;
        border: 1px solid #dddddd;
        color: #0083ce;
        line-height: normal;
        font-size: 13px;
        cursor: move;
        .delete {
            cursor: pointer;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background-color: rgba(0, 0, 0, 0.8);
            position: absolute;
            top: -6px;
            right: -8px;
            // transform: rotate(-45deg) translateY(-50%);
            .row,
            .col {
                top: 50%;
                left: 50%;
                transform:translate(-50%, -50%) rotate(45deg);
                background-color: #fff;
                position: absolute; 
            }
            .row {
                width: 70%;
                height: 1px;
            }
            .col {
                height: 70%;
                width: 1px;
            }
        }
        &:hover {
            .delete {
                display: block;
            }
        }
    }
    .img-gauge{
        width: 37px;
        height: 37px;
        margin-right: 6px;
    }
    .use-tip{
        cursor: pointer;
        text-decoration: underline;
        font-size: 12px;
        margin-top: 3px;
        &.used{
            cursor: unset;
            color:#7f7f7f;
            text-decoration: unset;
        }
    }
    .graphic-checkboxs {
        .graphic-checkbox {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #515a6e;
            line-height: 20px;
        }
    }
    .join-count-box {
        margin-top: 15px;
        height: 44px;
        position: relative;
    }
    .join-count-msg {
        position: relative;
        display: inline-flex;
        height: 100%;
        background: #ffffff;
        border-radius: 2px;
        border: 1px solid #dddddd;
        box-sizing: border-box;
        padding: 0 15px;
    }
    .join-count-cur {
        width: 170px;
    }
    .adjust-bg-box {
        z-index: 1;
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translate(-50%, 105%);
        background-color: rgba(0, 0, 0, 0.34);
        padding: 12px;
        border-radius: 4px;
        &::after {
            content: "";
            position: absolute;
            top: 0;
            right: 50px;
            transform: translateY(-97%);
            width: 0;
            height: 0;
            border: 8px solid transparent;
            border-bottom-color: rgba(0, 0, 0, 0.34);
        }
    }
    .adjust-box {
        background-color: #fff;
        padding: 7px 8px;
        border-radius: 6px;
    }
    .adjust-input {
        width: 170px;
        border: none;
        font-size: 14px;
    }
    .btn-confirm,
    .btn-adjust {
        width: 56px;
        height: 30px;
        border-radius: 2px;
        padding: 0;
    }
    .btn-adjust {
        // border: 1px solid #DDDDDD;
        color: rgb(45, 140, 240);
    }
    .course-tag{
        line-height: 40px;
        height: 40px;
    }
}
.organize-belong-view{
  min-height: 38px;
  background: #FFFFFF;
  border-radius: 2px;
  border: 1px solid #DDDDDD;
  display: flex;
  justify-content: space-between;
  padding: 4px 0px 4px 10px;
  line-height: 30px;
}
.organize-select-pointer{
  padding: 0px 10px;
  line-height: 30px;
  display: flex;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #0083CE;
  cursor: pointer;
  flex-shrink: 0;
}
</style>