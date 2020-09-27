import BehaviorField from "../behavior-field"
Component({
    behaviors: [BehaviorField],
    properties: {
        type: String,
        name: String,
        placeHolder: String,
        value: {
            type: String,
            observer(val) {
                this.value = val || "";
            }
        }
    },
    created() {
        this.value = "";
    },
    methods: {
        onInput(e) {
            let value = e.detail.value || "";
            if (this.value != value) {
                this.value = value;
                this.triggerEvent("change", {
                    value: value
                });
            }
        }
    }
});