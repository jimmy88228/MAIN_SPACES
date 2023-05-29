<template>
  <custom-modal ref="modal" :isSlotHeader="true" :isSlotFooter="true" :width="430">
    <div slot="header">
      学生迁移
    </div>
    <div>
      <rewrite-choose :data="migrateType" v-model="migrateInfo.migrateType" @on-change="changeMigrateType">
      </rewrite-choose>
      <div class="export-operate">
        <template v-if="migrateInfo.migrateType == 1">
          <div class="m-b-10">从“{{studentInfo.class_grade+studentInfo.class_class || ''}}”迁移至</div>
          <Form ref="studentInfoForm" :model="studentInfo" :label-width="40" class="no-tip flex-s-c" inline :rules="ruleValidate">
            <FormItem label="年级" prop="fullGrade">
              <Select style="min-width:160px;" v-model="studentInfo.fullGrade" @on-change="changeSchoolYear">
                <Option :value="item.fullGrade" v-for="(item, id) in gradeData" :key="id">{{item.grade}}（{{item.school_year}}）</Option>
              </Select>
            </FormItem>
            <FormItem label="班级" prop="class_id">
              <data-select placeholder="选择班级" class="base-100" type="class" ref="gradeClassSelectRef"
                :value="studentInfo.class_id"
                :params="{ campus_id: studentInfo.campus_id ,grade:studentInfo.class_grade,school_year:studentInfo.school_year,type:1}"
                @change="changeClass" valueKey="class_id" nameKey="class"></data-select>
            </FormItem>
          </Form>
        </template>
        <template v-else-if="migrateInfo.migrateType == 2">
          <div class="flex-s-c">
            <div class="m-r-10">设置状态</div>
             <RadioGroup v-model="leaveName" :model-value="leaveName" @on-change="changeLeaveType">
                <Radio v-for="(item,i) in leaveType" :key="i" :true-value="item.key" :label="item.name"></Radio>
            </RadioGroup>
          </div>
        </template>
      </div>
    </div>
    <div slot="footer">
      <Button type="default" @click="dismiss">取消</Button>
      <Button type="primary" @click="confirm">确定</Button>
    </div>
  </custom-modal>
</template>

<script>
  import linkageSelect from "@/models/components/linkage-select/index.vue";

  export default {
    components: {
      linkageSelect
    },
    data() {
      return {
        migrateType: [{
            key: 1,
            name: "迁移班级"
          },
          {
            key: 2,
            name: "迁移出校"
          },
        ],
        leaveType: [{
            key: 1,
            name: "已毕业"
          },
          {
            key: 2,
            name: "已转校"
          },
        ],
        gradeData: [],
        leaveName:"",
        migrateInfo: {
          migrateType: 0,
          leaveType: 0,
        },
        studentInfo: {
          user_id: 0,
          class_id: 0,
          campus_id: 0,
          school_year: "",
          class_grade: "",
          class_class: "",
          fullGrade: "",
        },
        ruleValidate: {
          fullGrade: [{
            required: false,
            type: "string",
            validator: this._checkString,
            message: "请选择年级",
            trigger: "change",
          }, ],

          class_id: [{
            required: false,
            type: "number",
            validator: this._checkThanInt,
            message: "请选择学生班级",
            trigger: "change",
          }, ],
        },
      }
    },
    methods: {
      showModal(detail = {}) {
        this.migrateInfo.migrateType = 0;
        this.leaveName = "";
        this.migrateInfo = {
          migrateType: 0,
          leaveType: 0,
        }
        this.$refs["studentInfoForm"] && this.$refs["studentInfoForm"].resetFields();
        this.$refs["modal"] && this.$refs["modal"].show();
          this.$nextTick(() => {
          let studentInfo = detail.studentInfo || {};
          let _studentInfo = {
            user_id: Number(studentInfo.user_id) || "",
            class_id: Number(studentInfo.class_id) || "",
            campus_id: Number(studentInfo.campus_id) || 0,
            school_year: studentInfo.school_year || 0,
            class_grade: studentInfo.class_grade || "",
            class_class: studentInfo.class_class || "",
            fullGrade: studentInfo.class_grade + studentInfo.school_year || ''
          };
          this.migrateInfo.migrateType = 1;
          this.$set(this, "studentInfo", _studentInfo);
          this.loadSchoolGradeData()
          
        })
      },
      loadSchoolGradeData() {
        return this.$MainApi
          .adminGradeData({
            data: {
              campus_id: this.studentInfo.campus_id,
              type:1
            },
          })
          .then((res) => {
            if (res.code) {
              let data = res.data || {};
              let gradeData = data.grade_data || [];
              gradeData.forEach(item => {
                item.fullGrade = item.grade + item.school_year;
              })
              this.gradeData = gradeData;
              return gradeData
            }
          });
      },
      changeSchoolYear(data) {
        let fullGrade = this.studentInfo.fullGrade || "";
        let gradeData = this.gradeData || [];
        let {
          school_year,
          grade
        } = gradeData.filter(item => {
          return item.grade + item.school_year == fullGrade
        })[0] || {}
        this.$set(this.studentInfo, "school_year", school_year || '')
        this.$set(this.studentInfo, "class_grade", grade || '')
        this.$set(this.studentInfo, "class_id", 0)
        this.$nextTick(() => {
          this.$refs["gradeClassSelectRef"] && this.$refs["gradeClassSelectRef"].getData();
        })
      },
      changeClass(data) {
        this.studentInfo.class_id = data || 0;
      },
      dismiss() {
        this.$refs["modal"] && this.$refs["modal"].dismiss();
      },

      changeMigrateType() {

      },
      changeLeaveType(e) {
        let leaveType = this.leaveType;
        let lIndex = leaveType.findIndex(item=>{return item.name == e})
        this.migrateInfo.leaveType = leaveType[lIndex].key;
      },
      confirm() {
        let migrateInfo = this.migrateInfo || {};
        let migrateType = migrateInfo.migrateType;
        let studentInfo = this.studentInfo || {};
        let value = 0;
        if(migrateType == 1){
          value = studentInfo.class_id
          !value && this.$Message.warning("请选择迁移到的班级");
        }else if(migrateType == 2){
          value = migrateInfo.leaveType
          !value && this.$Message.warning("请选择迁移状态");
        }
        if(value){
           return this.$MainApi
          .studentManagementMigration({
            data: {
              user_id:studentInfo.user_id,
              type:migrateType,
              value,
            },
          }).then((res) => {
            if(res.code){
              $Bus.$Message.success(res.message)
              this.$emit("confirm")
              this.dismiss()
            }else{
              $Bus.$Message.warning(res.message);
            }
          })
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  .export-operate {
    padding: 20px 0px;
  }
</style>