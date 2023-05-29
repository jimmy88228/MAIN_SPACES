<template>
    <div>
        <rewrite-drawer class="edit-admin-drawer" :inner="true" v-model="drawerShow" :width="460">
            <div class="bold" slot="header">{{title}}</div>
            <div class="edit-cont-area">
                <Form :label-width="100" :model="studentInfo" ref="studentInfoForm" :rules="ruleValidate">
                    <drawerForm>
                        <div slot="title">
                            学生基本信息
                        </div>
                        <div slot="content">
                            <FormItem label="姓名" prop="name">
                                <custom-input placeholder="请输入姓名" regType="name" class="base-200"
                                    v-model="studentInfo.name"></custom-input>
                            </FormItem>
                            <FormItem label="学号" prop="student_number">
                                <custom-input :maxlength="20" placeholder="请输入学号" regType="studentId" class="base-200"
                                    v-model="studentInfo.student_number"></custom-input>
                            </FormItem>
                            <FormItem label="性别" prop="sex">
                                <RadioGroup v-model="studentInfo.sex">
                                    <Radio :label="item.id" v-for="item in sexGroup" :key="item.key">{{item.name}}
                                    </Radio>
                                </RadioGroup>
                            </FormItem>
                        </div>
                    </drawerForm>
                    <drawerForm layoutCustomStyle="border-top:none">
                        <div slot="title">
                            学生归属
                        </div>
                        <div slot="content">
                        <FormItem label="校区" prop="campus_id">
                            <campusSelect :disabled="!studentInfo.isAdd" placeholder="请选择校区" :hideEdit="true" class="base-200" v-model="studentInfo.campus_id"
                                :schoolId="studentInfo.school_id" @change="changeCampus"></campusSelect>
                        </FormItem>
                        <FormItem label="年级" prop="fullGrade" v-if="drawerShow">
                            <Select class="base-200" v-model="studentInfo.fullGrade" @on-change="changeSchoolYear">
                                    <Option :value="item.fullGrade" v-for="(item, id) in gradeData" :key="id">{{item.grade}}（{{item.school_year}}）</Option>
                                </Select>
                        </FormItem>
                        <FormItem label="班级" prop="class_id" v-if="drawerShow">
                            <data-select placeholder="选择班级" class="base-200" type="class" ref="gradeClassSelectRef"
                                :value="studentInfo.class_id" :params="{ campus_id: studentInfo.campus_id ,grade:studentInfo.class_grade,school_year:studentInfo.school_year,type: parseInt(studentInfo.user_id) ? 1 : 0}"
                                @change="changeClass" valueKey="class_id" nameKey="class"></data-select>
                        </FormItem>
                        </div>
                    </drawerForm>
                </Form>
            </div>
            <div slot="footer">
                <Button class="m-r-10" type="primary" @click="checkStudentInfo">保存</Button>
                <Button @click="drawerShow = false">取消</Button>
            </div>
        </rewrite-drawer>
    </div>
</template>

<script>
    import campusSelect from "@/components/view-components/campus-select/index";
    import drawerForm from "@/components/view-components/drawer-form/index.vue";
    export default {
        name: "editSchoolMaint",
        props: {
            title: {
                type: String,
                default: "学生信息编辑",
            },
        },
        components: {
            campusSelect,
            drawerForm
        },
        data() {
            return {
                drawerShow: false,
                structureId: 0,
                sexGroup: [{
                        key: "male",
                        id: 1,
                        name: "男",
                    },
                    {
                        key: "female",
                        id: 2,
                        name: "女",
                    },
                ],
                studentInfo: {
                    school_id: 0,
                    student_number: "",
                    user_id: "",
                    name: "",
                    sex: -1,
                    class_id: 0,
                    campus_id: 0,
                    school_year: '',
                    class_grade:'',
                    fullGrade:"",
                    isAdd:0,
                },
                adminList: [],
                ruleValidate: {
                    student_number: [{
                        required: true,
                        type: "string",
                        validator: this._checkString,
                        message: "请填写学生学号",
                        trigger: "blur",
                    }, ],
                    name: [{
                        required: true,
                        type: "string",
                        validator: this._checkString,
                        message: "请填写学生名称",
                        trigger: "blur",
                    }, ],
                    fullGrade: [{
                        required: true,
                        type: "string",
                        validator: this._checkString,
                        message: "请选择年级",
                        trigger: "blur",
                    }, ],
                    sex: [{
                        required: true,
                        type: "number",
                        validator: this._checkThanInt,
                        message: "请选择学生性别",
                        trigger: "blur",
                    }, ],
                    class_id: [{
                        required: true,
                        type: "number",
                        validator: this._checkThanInt,
                        message: "请选择学生班级",
                        trigger: "blur",
                    }, ],
                    campus_id: [{
                        required: true,
                        type: "number",
                        validator: this._checkThanInt,
                        message: "请选择学生校区",
                        trigger: "blur",
                    }, ],
                },
                gradeData:[]
            };
        },
        methods: {
            showDrawer(studentInfo = {}) {
                this.$refs["studentInfoForm"] && this.$refs["studentInfoForm"].resetFields();
                this.$nextTick(() => {
                    this.drawerShow = true;
                    let _studentInfo = {
                        school_id: studentInfo.school_id || this._getReqStructureId || 0,
                        student_number: studentInfo.student_number || "",
                        user_id: studentInfo.user_id || "",
                        name: studentInfo.student_name || "",
                        sex: studentInfo.student_sex || 1,
                        class_id: Number(studentInfo.class_id) || "",
                        campus_id: Number(studentInfo.campus_id) || 0,
                        school_year: studentInfo.school_year || 0,
                        class_grade: studentInfo.class_grade || "",
                        fullGrade:studentInfo.class_grade + studentInfo.school_year || '',
                        isAdd:studentInfo.isAdd || 0,
                    };
                    this.$set(this, "studentInfo", _studentInfo);
                    this.changeCampus();
                })
            },

            
            loadSchoolGradeData(){
                let studentInfo = this.studentInfo;
                return this.$MainApi
                .adminGradeData({
                    data: {
                        campus_id: this.studentInfo.campus_id,
                        type: parseInt(studentInfo.user_id) ? 1 : 0 // 1：全部权限，0：所属权限
                    },
                })
                .then((res) => {
                    if (res.code) {
                        let data = res.data || {};
                        let gradeData = data.grade_data || [];
                        gradeData.forEach(item=>{
                            item.fullGrade = item.grade + item.school_year;
                        })
                        this.gradeData = gradeData;
                        return gradeData
                    }
                });
            },
            changeCampus(change) {
                this.$nextTick(() => {
                        this.loadSchoolGradeData()
                    if (change){
                        this.studentInfo.class_id = 0;
                        this.studentInfo.fullGrade = "";
                        this.studentInfo.class_grade = "";
                        this.studentInfo.school_year = 0;
                    } 
                });
            },
            changeSchoolYear(data) {
                // if (data){
                let fullGrade = this.studentInfo.fullGrade || "";
                let gradeData = this.gradeData || [];
                let {school_year,grade} = gradeData.filter(item=>{ return item.grade + item.school_year == fullGrade})[0] || {}
                this.$set(this.studentInfo, "school_year", school_year || '')
                this.$set(this.studentInfo, "class_grade", grade || '')
                this.$set(this.studentInfo, "class_id", 0)
                    this.$nextTick(()=>{
                    this.$refs["gradeClassSelectRef"] && this.$refs["gradeClassSelectRef"].getData();
                })
                // }
            },
            changeClass(data) {
                this.studentInfo.class_id = data || 0;
            },
            checkStudentInfo() {
                this.$refs["studentInfoForm"].validate((valid) => {
                    if (valid) {
                        this.updateStudentInfo();
                    } else {
                        this.$Message.warning("请完善信息");
                    }
                });
            },
            updateStudentInfo() {
                let studentInfo = this.studentInfo || {};
                this.pageLoading = true;
                let req = studentInfo.user_id ? 'studentManagementUpdate' : 'studentManagementAdd';
                return this.$MainApi[req]({
                        data: {
                            ...studentInfo
                        },
                    })
                    .then((res) => {
                        if (res.code) {
                            this.$Message.success(res.message || "编辑成功");
                            this.confirmUpdate();
                        } else {
                            this.$Message.warning(res.message || "编辑失败");
                        }
                    })
                    .finally(() => {
                        this.pageLoading = false;
                    });
            },
            confirmUpdate() {
                this.drawerShow = false;
                this.$emit("confirm");
            },
        },
        mounted() {},
    };
</script>

<style lang="less" scoped>
    // @import "@/assets/css/variables.less";
</style>