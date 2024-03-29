import subIcon from "@/assets/images/sub.png";
const selectColor = "#0083CE"; 
export default{
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
                        paddingLeft: this.showCheckbox ? "40px" : "20px",
                        color: data.selected ? selectColor : ""
                    },
                },
                [
                    h("div", {
                        style: {
                            display: this.showCheckbox ? 'block' : 'none'
                        },
                        on: {
                            "click": ()=>{ 
                                event.stopPropagation();
                            },
                        }
                    },[
                        h("Checkbox", {
                            props: {
                                value: data.checked,
                                disabled: data.disabled || (this.isRelation && data.pChecked) || (this.limitMain && data.id == "0" && !data.checked)
                            },
                            attrs: {
                                title: (this.limitMain && data.id == "0" && !data.checked) ? '没有该组织权限' : ''
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
                          [
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
              display: "flex",
              alignItems: "center",
              color: data.selected ? selectColor : ""
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
                        disabled: data.disabled || (this.isRelation && data.pChecked)
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
                    // data.title + "(" + data.getson_count + ")"
              ),
          ])
        }
    }
  }
}