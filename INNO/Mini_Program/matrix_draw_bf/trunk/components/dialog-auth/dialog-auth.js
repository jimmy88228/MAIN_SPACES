import { createBehavior } from "../window/anim-helper";
Component({
    behaviors: [createBehavior("fade")],
    properties: {
        title: {
            type: String,
            value: "",
            observer(val) {
                this.setTitle(val);
            }
        },
        content: {
            type: String,
            value: "",
            observer(val) {
                this.setContent(val);
            }
        }
    },
    data: {
        _title: "授权管理",
        _content: ""
    },
    methods: {
        onAuthed() {
            this.triggerEvent("authed")
            this.dismiss();
        },
        setTitle(title) {
            this.setData({
                _title: title
            });
            return this;
        },
        setContent(content) {
            this.setData({
                _content: content
            });
            return this;
        }
    }
});
