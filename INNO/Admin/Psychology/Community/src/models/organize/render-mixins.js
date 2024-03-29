import PageHelper from "@/helper/page-helper";
export default{
  methods: {
    setRender() {
      return (h, { root, node, data }) => {
          let operateData = []
          let _parentIds = data._parentIds || [];
          if(data.id !== '0'){ // 主体不可编辑
            operateData.push(
              h("a", { 
              attrs: { class: "operate" },
              on: {
                click:()=>{
                  event.stopPropagation();
                  this.editOrganize(data);
                }
              },
              directives: [
                {
                  name: "hasAction",
                  value: "structure_structure_update"
                }
              ]
            }, "编辑"),)
          }
          // 单个组织权限，不可增加主体下组织，全部权限可以;
          // total_level < 4 只可编辑到3层
          if((this._isSuperIds == 1 && data.id !== '0' && data.total_level < 4) || (!this._isSuperIds && data.total_level < 4)){
            operateData.push(
              h("a", { 
                attrs: { class: "operate" },
                on: {
                  click:()=>{
                    event.stopPropagation();
                    this.editOrganize(data, "group");
                  }
                },
                directives: [
                  {
                    name: "hasAction",
                    value: "structure_structure_add"
                  }
                ]
              }, "增加小组")
            )
          }
          // 暂时不需要删除
          // if(Number(data.id)){
          //   // h("a", { attrs: { class: "operate" } }, "删除")
          //   operateData.push(h("Poptip", {
          //     props: { 
          //       confirm: true,
          //       title: "确定删除该组织吗？"
          //      },
          //      on: {
          //        "on-ok": ()=>{
  
          //        }
          //      } 
          //   }))
          // }
          return h(
              "div",
              {
                  attrs: { class: "tree-table-tr" },
                  style: {
                    marginLeft: (-(data._parentName.length + 1) * 35) + "px",
                    position: data.id == 0 ? "relative" : "unset",
                    zIndex: 2
                  }
              },
              [
                h("div", {
                  attrs: { class: "tree-table-td tree-t-l text-flow" },
                  style: {
                    paddingLeft: data.id == 0 ? ((data._parentName.length + 1) * 20) + "px" : ((data._parentName.length + 1) * 35) + "px"
                  }
                }, data.title),
                h("div", {
                  attrs: { class: "tree-table-td tree-t-l-m" },
                }, data.id || 0),
                h("div", {
                  attrs: { class: "tree-table-td tree-t-m" },
                }, data.getson_count || '--'),
                h("div", {
                  attrs: { class: "tree-table-td tree-t-r" },
                }, [
                  h("div", {
                    attrs: { class: "operate-area" }
                   }, operateData)
                ])
              ]
          );
      }
    }
  }
}