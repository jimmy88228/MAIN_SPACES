
import BehaviorField from "./behavior-field"

export default Behavior({
    behaviors: [BehaviorField],
    properties: {
        canCancel: {
            type: Boolean,
            value: false
        },
        value: {
            type: [Number, String, Object],
            observer(val) {
                this.matchChild(val);
            }
        }
    },
    canCancel: false,
    data: {
    },
    ready() {
        this.isReady = true;
        this.matchChild(this.data.value);
    },
    methods: {
        callChange() {
            this.triggerEvent("change", {
                value: this.getValue()
            });
        },
        unlinked(target) {
            if (this.current == target) {
                delete this.current;
            }
        },
        childChose(child) {
            this.onChildChose();
            this.chose(child, true);
        },
        chose(child, call = true) {
            if (this.current) {
                if (this.current == child) {
                    if (!this.data.canCancel) {
                        return;
                    }
                    this.current.unChoose();
                    delete this.current;
                    this.onChangeCurrent();
                    call && this.callChange();
                    return;
                }
                this.current.unChoose();
            }
            this.current = child;
            this.current.choose();
            this.onChangeCurrent();
            call && this.callChange();
        },
        unChoose(call = false) {
            if (this.current) {
                this.current.unChoose();
                delete this.current;
                this.onChangeCurrent();
                call && this.callChange();
            }
        },
        matchChild(value) {
            if (!this.isReady) {
                return;
            }
            if (value === undefined || value === null) {
                this.unChoose(false);
                return;
            }
            let nodes = this.getNodes();
            if (nodes && nodes.length > 0) {
                for (let i = 0, n = nodes.length; i < n; i++) {
                    let node = nodes[i];
                    if (node.getValue() == value) {
                        this.chose(node, false);
                        return;
                    }
                }
            }
        },
        getValue() {
            return this.current && this.current.getValue();
        },
        getContent() {
            return (this.current && this.current.getContent()) || "";
        },
        getNodes() {

        },
        onChildChose() {
        },
        onChangeCurrent() {
        }
    }
})