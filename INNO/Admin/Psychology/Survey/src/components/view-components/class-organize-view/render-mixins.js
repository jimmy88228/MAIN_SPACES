import subIcon from "@/assets/images/sub.png";
const selectColor = "#0083CE"; 
const disabledColor = "#CACACC";
export default{
  data(){
      return {
        checkTimer: null
      }
  },
  methods: {
      setRender(hasChildren) {
        return hasChildren ? (h, { root, node, data }) => { // 父项
            return h(
                "div",
                {
                    style: {
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        paddingLeft: (this.isShowAllBtn && data.id == "0") ? "20px" : (this.showCheckbox ? "40px" : "20px"),
                        color: data.class_state == 2 ? disabledColor : (data.selected ? selectColor : "")
                    },
                },
                [
                    h("div", {
                        style: {
                            // 展示全选按钮时，主体的checkbox不可见，且增加全选按钮
                            display: (this.isShowAllBtn && data.id == "0") ? 'none' : (this.showCheckbox ? 'block' : 'none')
                        },
                        on: {"click": ()=>{ event.stopPropagation();}}
                    },[
                        h("Checkbox", {
                            props: {
                                value: data.checked,
                                disabled: data.disabled || (this.isRelation && data.pChecked) || (this.limitMain && (data.type == "school"))
                            },
                            attrs: {
                                title: (this.limitMain && data.type == "school") ? '没有该组织权限' : ''
                            },
                            on: {
                                "on-change":(state)=>{
                                    data.checked = state || false;
                                    this.toggleCheck(state, data);
                                }
                            }
                        }),
                    ]),
                    h("div", {
                        attrs: { class: "text-flow",title: data.title },
                        style: {
                          flex:1,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }
                    },[
                      h(
                          "div",
                          {
                              attrs: { class: "text-flow" },
                              style: {
                                  display: "flex",
                                  alignItems: "center",
                                  flex: 1,
                              },
                          },
                          [
                              h("img", {
                                  attrs: { src: data.selected ? data.selectIcon : data.icon },
                                  style: this.isModal ? {
                                      marginRight: "8px",
                                      width: "26px",
                                      height: "26px",
                                      flexShrink: 0,
                                      display: data.icon ? 'inline-block' : 'none'
                                  } : {
                                      marginRight: "8px",
                                      width: "17px",
                                      height: "17px",
                                      flexShrink: 0,
                                      display: data.icon ? 'inline-block' : 'none'
                                  },
                              }),
                              h(
                                  "span",
                                  { 
                                    attrs: { class: "text-flow" },
                                    style: { fontSize: "14px",flex: 1 } },
                                    data.title
                                //   data.title + "(" + data.getson_count + ")"
                              ),
                          ]
                      ),
                      h(
                          "div",
                          {
                              style: {
                                  display: this.isModal ? "flex" : "none",
                                  alignItems: "center",
                              },
                          },
                          (this.isShowAllBtn && data.id == "0") ? [
                            h("div", {on: {"click": ()=>{ event.stopPropagation();}}},[
                                h("Button", {
                                    props: { size: "small" },
                                    on: {
                                        click:()=>{
                                            if(this.checkTimer){
                                                clearTimeout(this.checkTimer);
                                                this.checkTimer = null;
                                            }
                                            this.checkTimer = setTimeout(()=>{
                                                this.toggleCheck(!data.checked, { ...data, checked: !data.checked })
                                            }, 300)
                                            
                                        }
                                    }
                              }, "全选")
                            ])
                          ]: [
                              h("img", {
                                  attrs: { src: subIcon },
                                  style: {
                                      marginRight: "3px",
                                      width: "20px",
                                      height: "20px",
                                  },
                              }),
                              h(
                                  "span",
                                  {style: { fontSize: "14px"} },
                                  "下级"
                              ),
                          ]
                      ),
                    ])
                    
                ]
            );
        } : (h, { root, node, data }) => { // 子项
          return h("div",{
            attrs: { class: "text-flow", title: data.title  },
            style: {
              width:"90%",
              marginLeft:"3px",
              paddingLeft: this.showCheckbox ? "35px" : "15px",
              display: "flex", //(data.class_state == 2 && !data.checked) ? "none" : "flex",
              alignItems: "center",
              color: data.class_state == 2 ? disabledColor : (data.selected ? selectColor : "")
            },
          }, [
            h("div", {
                style: {
                    display: this.showCheckbox ? 'block' : 'none'
                },
                on: {
                    "click": ()=>{ event.stopPropagation(); },
                }
            },[
                h("Checkbox", {
                    props: {
                        value: data.checked,
                        disabled: data.disabled || (this.isRelation && data.pChecked) || (this.limitMain && data.type == "school") || (data.class_state == 2 && !data.checked) // 已毕业不可勾选
                    },
                    on: {
                        "on-change":(state)=>{
                            data.checked = state || false;
                            this.toggleCheck(state, data);
                        }
                    }
                }),
            ]),
              h("img", {
                  attrs: { src: data.selected ? data.selectIcon : data.icon },
                  style: this.isModal ? {
                      marginRight: "8px",
                      width: "26px",
                      height: "26px",
                      flexShrink: 0,
                      display: data.icon ? 'none' : 'none'
                  } : {
                      marginRight: "8px",
                      width: "17px",
                      height: "17px",
                      flexShrink: 0,
                      display: data.icon ? 'none' : 'none'
                  },
              }),
              h(
                  "span",
                  { 
                    attrs: { class: "text-flow" },
                    style: { fontSize: "14px",flex: 1 } },
                    [
                        h("span", data.title),
                        data.class_state == 2 ? h("span", { 
                            style: {
                               color: "#AEAEAE",
                               backgroundColor: "#FBFBFB",
                               display: "inline-block",
                               padding: "1px 5px",
                               borderRadius: "3px",
                               marginLeft: "5px",
                               lineHeight: "20px"
                            },
                           }, "已毕业") : ''
                    ]
              ),
          ])
        }
    }
  }
}