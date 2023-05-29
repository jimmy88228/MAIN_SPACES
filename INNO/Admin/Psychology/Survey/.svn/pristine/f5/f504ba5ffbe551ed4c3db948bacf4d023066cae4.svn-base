<template>
    <div>
        <rewrite-drawer class="edit-admin-drawer" :inner="true" v-model="drawerShow" :width="530">
            <div class="bold" slot="header">{{title}}</div>
            <div class="edit-cont-area">
                <Form :label-width="100" :model="studentInfo" ref="studentInfoForm" :rules="ruleValidate">
                    <FormItem label="姓名" prop="name">
                        <custom-input placeholder="请输入姓名" regType="name" class="base-320" v-model="studentInfo.name"></custom-input>
                    </FormItem>
                    <FormItem label="学号" prop="new_student_number">
                        <custom-input placeholder="请输入学号" regType="studentId" class="base-320" v-model="studentInfo.new_student_number"></custom-input>
                    </FormItem>
                    <FormItem label="性别" prop="sex">
                        <RadioGroup v-model="studentInfo.sex">
                            <Radio :label="item.id" v-for="item in sexGroup" :key="item.key">{{item.name}}</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="校区" prop="campus_id">
                        <campusSelect placeholder="请选择校区" class="base-320" v-model="studentInfo.campus_id" :schoolId="studentInfo.school_id" @change="changeCampus"></campusSelect>
                    </FormItem>
                    <FormItem label="学年" prop="school_year">
                        <date-time placeholder="选择学年" format="yyyy" v-model="studentInfo.school_year" type="year"></date-time>
                    </FormItem>
                    <FormItem label="班级" prop="grade_id" v-if="drawerShow">
                        <data-select placeholder="选择班级" class="base-320" type="grade" ref="gradeSelectRef" :value="studentInfo.grade_id" :params="{ campus_id: studentInfo.campus_id }" @change="changeClass" valueKey="class_id" nameKey="class_name"></data-select>
                    </FormItem>
                </Form>
            </div>
            <div slot="footer">
                <Button class="m-r-10" type="primary" @click="checkStudentInfo">保存</Button>
                <Button @click="drawerShow = false">取消</Button>
            </div>
        </rewrite-drawer>
        <!-- <Drawer class="page-drawer-area" :transfer="false" :inner="true" :closable="false" v-model="drawerShow" :width="530">
            <div class="class-edit-area" :style="'padding-top:' +  _pageScrollTop + 'px;'" v-bar>
                <div>
                    <div class="edit-title bold">{{title}}</div>
                    <div class="edit-cont">
                        <div class="edit-cont-area">
                            <Form :label-width="100" :model="studentInfo" ref="studentInfoForm" :rules="ruleValidate">
                                <FormItem label="姓名" prop="name">
                                    <custom-input placeholder="请输入姓名" regType="name" class="base-320" v-model="studentInfo.name"></custom-input>
                                </FormItem>
                                <FormItem label="学号" prop="new_student_number">
                                    <custom-input placeholder="请输入学号" regType="studentId" class="base-320" v-model="studentInfo.new_student_number"></custom-input>
                                </FormItem>
                                <FormItem label="性别" prop="sex">
                                    <RadioGroup v-model="studentInfo.sex">
                                        <Radio :label="item.id" v-for="item in sexGroup" :key="item.key">{{item.name}}</Radio>
                                    </RadioGroup>
                                </FormItem>
                                <FormItem label="校区" prop="campus_id">
                                    <campusSelect placeholder="请选择校区" class="base-320" v-model="studentInfo.campus_id" :schoolId="studentInfo.school_id" @change="changeCampus"></campusSelect>
                                </FormItem>
                                <FormItem label="学年" prop="school_year">
                                    <date-time placeholder="选择学年" format="yyyy" v-model="studentInfo.school_year" type="year"></date-time>
                                </FormItem>
                                <FormItem label="班级" prop="grade_id" v-if="drawerShow">
                                    <data-select placeholder="选择班级" class="base-320" type="grade" ref="gradeSelectRef" :value="studentInfo.grade_id" :params="{ campus_id: studentInfo.campus_id }" @change="changeClass" valueKey="class_id" nameKey="class_name"></data-select>
                                </FormItem>
                            </Form>
                            <div class="edit-foot">
                                <Button class="m-r-10" type="primary" @click="checkStudentInfo">保存</Button>
                                <Button @click="drawerShow = false">取消</Button>
                            </div>
                            <Spin fix v-if="pageLoading"></Spin>
                        </div>
                    </div>
                </div>
            </div>
        </Drawer> -->
    </div>
</template>

<script>
import campusSelect from "@/components/view-components/campus-select/index";
export default {
    name: "editSchoolMaint",
    props: {
        title: {
            type: String,
            default: "档案编辑",
        },
    },
    components: { campusSelect },
    data() {
        return {
            drawerShow: false,
            structureId: 0,
            sexGroup: [
                {
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
                old_student_number: "",
                new_student_number: "",
                name: "",
                sex: -1,
                grade_id: 0,
                campus_id: 0,
                school_year: ''
            },
            adminList: [],
            ruleValidate: {
                new_student_number: [
                    {
                        required: true,
                        type: "string",
                        validator: this._checkString,
                        message: "请填写学生学号",
                        trigger: "change",
                    },
                ],
                name: [
                    {
                        required: true,
                        type: "string",
                        validator: this._checkString,
                        message: "请填写学生名称",
                        trigger: "change",
                    },
                ],
                school_year: [
                    {
                        required: true,
                        type: "string",
                        validator: this._checkString,
                        message: "请选择学年",
                        trigger: "change",
                    },
                ],
                sex: [
                    {
                        required: true,
                        type: "number",
                        validator: this._checkThanInt,
                        message: "请选择学生性别",
                        trigger: "blur",
                    },
                ],
                grade_id: [
                    {
                        required: true,
                        type: "number",
                        validator: this._checkThanInt,
                        message: "请选择学生班级",
                        trigger: "change",
                    },
                ],
                campus_id: [
                    {
                        required: true,
                        type: "number",
                        validator: this._checkThanInt,
                        message: "请选择学生校区",
                        trigger: "change",
                    },
                ],
            },
        };
    },
    methods: {
        showDrawer(studentInfo = {}) {
            this.$nextTick(()=>{
                this.drawerShow = true;
                let _studentInfo = {
                    school_id: studentInfo.school_id || this._structureId || 0,
                    old_student_number: studentInfo.student_number || "",
                    new_student_number: studentInfo.student_number || "",
                    name: studentInfo.student_name || "",
                    sex: studentInfo.student_sex || 1,
                    grade_id: Number(studentInfo.class_id) || 0,
                    campus_id: Number(studentInfo.campus_id) || 0,
                    school_year: studentInfo.school_year ? studentInfo.school_year + '' : ""
                };
                this.$set(this, "studentInfo", _studentInfo);
                this.changeCampus();
                console.log("studentInfo campus_id", this.studentInfo.campus_id)
                console.log("studentInfo", this.studentInfo.grade_id)
                this.$refs["studentInfoForm"] && this.$refs["studentInfoForm"].resetFields();
            })
        },
        changeCampus(change) {
            console.log("变化 change")
            this.$nextTick(() => {
                this.$refs["gradeSelectRef"] && this.$refs["gradeSelectRef"].getData();
                if (change) this.studentInfo.grade_id = 0;
            });
        },
        changeClass(data){
            this.studentInfo.grade_id = data || 0;
            console.log("变化 grade_id")
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
            let req = studentInfo.old_student_number ? 'studentUpdate' : 'studentAdd';
            return this.$MainApi[req]({
                    data: {
                        ...studentInfo,
                        student_number: studentInfo.new_student_number
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