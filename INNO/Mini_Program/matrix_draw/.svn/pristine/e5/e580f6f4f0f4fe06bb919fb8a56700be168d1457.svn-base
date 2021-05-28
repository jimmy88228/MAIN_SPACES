
export default Behavior({
    properties: {
        value: { type: [Number, String, Object] },
        content: String
    },
    data: {
        isChose: false
    },
    methods: {
        linked(target) {
            if (this.parent) {
                delete this.parent;
            }
            this.parent = target;
        },
        unlinked(target) {
            if (this.parent == target) {
                delete this.parent;
            }
        },
        click() {
            this.parent && this.parent.childChose(this);
        },
        choose() {
            this.setData({ isChose: true });
        },
        unChoose() {
            this.setData({ isChose: false });
        },
        getValue() {
            return this.data.value;
        },
        getContent() {
            return this.data.content;
        }
    }
})