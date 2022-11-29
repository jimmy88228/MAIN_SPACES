export default{
  data(){
    return {
      columns: [
        {
          // type: 'selection',
          title: " ",
          slot: "selectArea",
          width: 40,
          align: 'center',
          renderHeader:(h, { row })=>{
            return h('Checkbox', {
              props: {
                value: this.isSelectAll
              },
              on: {
                "on-change":(state)=>{
                  let list = this.list || [];
                  list.map((item)=>{
                    this.checkMember(state, item);
                  })
                  this.isSelectAll = state;
                }
              }
            })
          }
        },
        {
          // title: "全选",
          key: "member_name",
          minWidth: 100,
          renderHeader: (h, params)=>{
            return h('div', {
              style: {
                marginLeft: "-15px"
              },
            }, "全选")
          },
          render: (h, { row })=>{
            return h('div', {
              style: {
                marginLeft: "-15px"
              },
            }, row.member_name)
          }
        },
      ]
    }
  }
}