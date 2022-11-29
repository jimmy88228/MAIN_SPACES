export default {
  data () {
    return {
      columns: [
        {
          width: 60,
          type: "selection"
        },
        {
          key: "structure_name",
          title: "组织名称",
          minWidth: 100,
          align: "left",
        },
        {
          title: "联系方式",
          minWidth: 100,
          align: "left",
          render: (h, params)=>{
            return h('div', [
              h('p', params.row.contact),
              h('p', params.row.contact_way)
            ])
          }
        },
        {
          title: "学校管理者",
          minWidth: 200,
          align: "left",
          render: (h, params)=>{
            let html = [];
            let get_admin = params.row.get_admin || [];
            for(let i = 0; i < get_admin.length; i++){
              let get_user = get_admin[i].get_user || {};
              let txt = get_user.user_name;
              if(i < (get_admin.length - 1)){
                txt = txt + ' , '
              }
              html.push(h('span', txt))
            }
            return h('div', html)
          }
        }
      ]
    }
  }
}
