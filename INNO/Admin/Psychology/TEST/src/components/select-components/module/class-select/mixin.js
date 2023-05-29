export default {
  data () {
    return {
      columns: [
        {
          width: 60,
          type: "selection",
        },
        {
          key: "grade",
          title: "年级",
          minWidth: 140,
          render:(h, params)=>{
            let row = params.row || {};
            return h('div', row.grade + ' (' + (row.school_year || '') + ')')
          },
          align: "left",
        },
        {
          key: "class",
          title: "班级",
          minWidth: 150,
          align: "left",
        },
        {
          key: "campus",
          title: "校区",
          minWidth: 100,
          align: "left",
        },
        {
          title: "班主任",
          minWidth: 180,
          render: (h, { row }) => {
            let html = [];
            let get_admin = row.get_admin || [];
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
        },
      ]
    }
  }
}
