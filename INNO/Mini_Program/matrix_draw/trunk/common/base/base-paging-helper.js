export default {
    getPageData(init = false) {
        if (init || !this.pageData) {
            this.pageData = { index: 0 };
        }
        return this.pageData;
    },
    nextDataIndex(refresh) {
        if (refresh)
            return 1;
        let pageData = this.getPageData();
        return pageData.index + 1;
    },
    setDataList(refresh, data) {
        if (refresh) {
            let pageData = this.getPageData(true);
            if (data && data.length > 0) {
                pageData.index = 1;
            } else {
                pageData.index = 0;
            }
            pageData.list = [...data];
            this.setData({ list: pageData.list, isEnd: false });
        } else if (data && data.length > 0) {
            let pageData = this.getPageData();
            pageData.index = pageData.index + 1;
            pageData.list || (pageData.list = []);
            pageData.list.splice(pageData.list.length, 0, ...data);
            this.setData({ list: pageData.list, isEnd: false });
        } else {
            this.setData({ isEnd: true });
        }
    },
    clearDataList() {
        delete this.pageData;
        this.setData({ list: null, isEnd: false });
    }
}