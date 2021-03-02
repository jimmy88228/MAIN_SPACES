Page.BasePage({
    data: {
        index: 0,
        current:0,
        isShow: false,
    },
    onShow() {
        this.setData({ isShow: true });
    },
    onHide() {
        this.setData({ isShow: false });
    },
    onTabTap(e) {
        let index = e.currentTarget.dataset.index;
        this.setData({
            current: index
        });
    },
    onPageChange(e) {
        let index = e.detail.current
        this.setData({
            index: index
        });
    }
});