const BaseDialog = {
    props: {
        value: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            toShow: false
        };
    },
    computed: {
        isShow() {
            return this.value || this.toShow;
        }
    },
    watch: {
        isShow(newVal) {
            newVal ? this.onShow() : this.onDismiss();
        }
    },
    methods: {
        input(value) {
            this.toShow = value;
            this.$emit("input", value);
        },
        show() {
            this.toShow = true;
            return this;
        },
        onShow() {

        },
        dismiss() {
            this.toShow = false;
            return this;
        },
        onDismiss() {

        }
    }
};

export default BaseDialog;
