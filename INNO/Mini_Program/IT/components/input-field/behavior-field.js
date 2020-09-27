export default Behavior({
    options: {
        styleIsolation: "apply-shared"
    },
    methods: {
        showError() {
            wx.MyAnims.error(this, ".input-field-input");
        }
    }
})