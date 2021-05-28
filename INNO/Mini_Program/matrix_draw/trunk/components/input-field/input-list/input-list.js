import BehaviorOption from "../behavior-option";
Component({
    behaviors: [BehaviorOption],
    relations: {
        './input-list-item/input-list-item': {
            type: 'child',
            unlinked(target) {
                this.unlinked(target)
            }
        }
    },
    properties: {
        canCancel: {
            type: Boolean,
            value: false
        },
        type: String,
        name: String,
        placeHolder: String
    },
    data: {
        optionsShow: false,
        content: "",
    },
    methods: {
        showOption() {
            let sysInfo = wx.getSystemInfoSync();
            wx.createSelectorQuery()
                .in(this)
                .select(".input-list-btn")
                .fields({
                    rect: true,
                    size: true
                }, rectA => {
                    let maxHeight = 300;
                    let dBottom = sysInfo.windowHeight - rectA.bottom - 10;
                    let dTop = rectA.top - 10;
                    let ss = `left:${rectA.left}px; width:${rectA.width}px;`;
                    if (dTop >= maxHeight) {
                        ss += ` bottom:${sysInfo.windowHeight - rectA.top}px; max-height:${maxHeight}px;`;
                    } else if (dBottom >= maxHeight) {
                        ss += ` top:${rectA.bottom}px; max-height:${maxHeight}px;`;
                    } else if (dTop > dBottom) {
                        ss += ` bottom:${sysInfo.windowHeight - rectA.top}px; max-height:${dTop}px;`;
                    } else {
                        ss += ` top:${rectA.bottom}px; max-height:${dBottom}px;`;
                    }
                    this.setData({
                        listOptionsPos: ss,
                        optionsShow: true
                    });
                })
                .exec();
        },
        hideOption() {
            this.setData({
                optionsShow: false
            });
        },
        setContent(content) {
            this.setData({ content: content || "" })
        },
        onChildChose() {
            this.hideOption();
        },
        onChangeCurrent() {
            this.setContent(this.getContent());
        },
        getNodes() {
            return this.getRelationNodes("./input-list-item/input-list-item");
        },
        noAction() { }
    }
});