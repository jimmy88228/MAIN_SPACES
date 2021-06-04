import LM from "../../common/manager/login-manager";
Page.BasePage({
    onShow() {
        LM.login(false).ignore(() => this.checkLoginChange());
    },
    onAuthed() {
        this.checkLoginChange();
    }
});