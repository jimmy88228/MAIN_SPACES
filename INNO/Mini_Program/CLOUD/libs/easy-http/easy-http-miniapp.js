export default {
    install: function (host) {
        host.bindHandler(o => {
            let act = (o.action || "").toUpperCase();
            return new Promise((rs, rj) => {
                wx.request({
                    url: o.url,
                    data: o.data || "",
                    method: act,
                    header: o.header,
                    success: res => {
                        rs(res);
                    },
                    fail: (err) => {
                        rj(err);
                    },
                    complete:(complete)=>{
                        // console.log("微信请求：",complete)
                    }
                });
            });
        });
    }
};