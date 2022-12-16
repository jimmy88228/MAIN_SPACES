export default{
  data(){
    return {
      columns: [
        {
          type:"selection",
          width: 54,
        },
        {
          key: "detail",
          renderHeader:(h, { column, index })=>{
            return h('div', {
              style: {
                fontSize: "16px",
                fontFamily: "PingFangSC-Regular, PingFang SC",
                fontWeight: 400,
                color: "#8E8E8E",
                lineHeight: "22px",
              }
            },[
              h('span',{ style: { "paddingRight": "37px" }  }, "全部"),
              h('span', "文章"),
              h('span', { attrs:{ class: "bold p-l-5"}, style: { color: "#333" } }, 10),
            ])
          },
          slot: "detail",
          minWidth: 300
        },
        {
          title: "操作",
          slot: "handle",
          renderHeader:(h, { column, index })=>{
            return h('div', {
              attrs:{ class: "flex-s-c" }
            }, [
              h('Button', {
                attrs: { type: "primary", size: "large"},
                style: { "marginRight": "10px" },
                on: {
                  click:()=>{
                    this.goAdd();
                  }
                }
              }, "添加文章"),
              h('Button', {
                attrs: { size: "large" },
                style: { "marginRight": "10px" }
              }, "分配资源"),
              h('Button',{
                attrs: { size: "large" },
                style: { "marginRight": "10px" },
                on:{
                  click:()=>{
                    this.batchChangeGroup();
                  }
                }
              }, "批量换组"),
            ])
          },
          align: "right",
          minWidth: 300
        }
      ]
    }
  }
}