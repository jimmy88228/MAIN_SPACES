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
          minWidth: 150,
          align: "left",
        },
        {
          title: "联系方式",
          minWidth: 150,
          align: "left",
          render: (h, params)=>{
            let row = params.row || {};
            let getContact = row.get_contact || [];
            let contactHtml = [];
            getContact.map((item)=>{
              contactHtml.push(h('Tooltip', {
                props: {
                  placement: 'right'
                }
              }, [
                h('span',{
                  style: {
                    display: 'inline-block',
                    padding: '5px 15px',
                    borderRadius: '3px',
                    background: '#F8F8F8',
                    cursor: 'pointer'
                  }
                }, item.name),
                h('div',{
                  slot: 'content',
                }, [
                  h('p', item.name),
                  h('p', item.mobile_phone),
                  h('p', item.remark)
                ])
              ]))
            })
            return h('div', contactHtml)
          }
        },
        {
          title: "学校管理者",
          minWidth: 100,
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
