export default{
  data(){
    return {
      columns: [
        {
          title: "因子",
          key: "rule_name",
          minWidth: 250,
        },
        {
          title: "原始分",
          slot: "points",
          minWidth: 120,
        },
        {
          title: "参考诊断",
          minWidth: 150,
          key: "range_name"
        }
      ]
    }
  }
}