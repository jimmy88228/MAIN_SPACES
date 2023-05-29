export default{
  data(){
    return {
      columns: [
        {
          // type: 'selection',
          title: " ",
          slot: "selectArea",
          align: 'left',
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
            }, '全选')
          }
        },
      ]
    }
  }
}