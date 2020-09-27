const app = getApp();
Page.BasePage({
    onLoad(options) {
        let id = options.id;
        let name = options.name;
        let url = options.url;
        if (url) {
            this.setData({
                url: decodeURIComponent(url)
            });
        } else if (name) {
            this.setData({
                url: app.WebApi.redirectArt.getUrl({
                    name
                })
            });
        } else if (id) {
            this.setData({
                url: app.WebApi.redirectArt.getUrl({
                    id
                })
            });
        }
    }
});