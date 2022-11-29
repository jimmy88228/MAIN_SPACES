export default{
  data(){
    return {
      filedBy:'asc',
      filed:'min_value',
      columns: [
        {
          title: "名称",
          key: "name",
          minWidth: 200
        },
        {
          title: "分值",
          slot: "scoring",
          minWidth: 140,
          renderHeader: (h, params)=>{
            return h('div', {}, [
              h('a', {
                props: { 
                },
                style: { 
                },
                on:{
                  click:()=>{
                    this.filedBy = this.filedBy == 'asc' ? 'desc':'asc';
                    this.loadData(this.page);
                  }
                }
              }, [
                h('span', {}, "分值"),
                h('icon', {
                  style: { 
                    marginLeft:'2px'
                  },
                  props: {
                    type: this.filedBy == 'asc' ? "ios-arrow-up" : 'ios-arrow-down'
                  }
                })
              ])
            ])
          },
        },
        {
          title: "类型",
          key: "related_key_str",
          minWidth: 100,
        },
        {
          title: "计算方式",
          key: "type_str",
          minWidth: 100,
        },
        {
          title: "描述",
          slot: "desc",
          minWidth: 200,
        },
        {
          title: "操作",
          slot: "handle",
          align: "center",
          width: 150
        }
      ]
    }
  }
}