export default{
  data(){
    return {
      columns: [
        {
          title: "学校",
          slot: "structure_name",
          align: "left",
          minWidth: 150,
          renderHeader:(h, params)=>{
            return h('div', this._structureType == 'edu_school' ? '班级' : '学校')
          }
        },
        {
          title: "应参与人数",
          slot: "ought_member",
          minWidth: 200,
        },
        {
          title: "已提交人数",
          minWidth: 200,
          // key: "structure_record_count",
          slot: "structure_record_count",
          align: "left",
        }, 
        {
          title: "待提交人数",
          slot:"audit_member",
          align: "left",
          minWidth: 200,
        }, 
        {
          title: "待审核预警",
          slot:"warn_record_count",
          align: "left",
          minWidth: 200,
        },
        {
          title: "操作",
          width: 150,
          slot: "handle"
        }
      ]
    }
  }
}