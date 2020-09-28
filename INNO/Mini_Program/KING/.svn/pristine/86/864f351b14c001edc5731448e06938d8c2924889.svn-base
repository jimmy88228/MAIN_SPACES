const app = getApp();

Component({

    properties: {
        path: {
            type: String,
            value: ''
        },
        appid: {
            type: String,
            value: ''
        },
        showActiveTip: {
            type: Boolean,
            value: false,
            observer: function (newVal, oldVal) {
                this.setData({
                    show: newVal
                })
            }
        },
		hasJump: {
			type: Boolean,
			value: false
		}
    },

    data: {
        show: false
    },

    methods: {
        toggleTip() {
            if (this.data.show) {
                this.jumpMiniPro();
                return;
            }
            
            this.setData({
                show: !this.data.show
            })
        },

        hideTip(e) {
            if (e.target.id === 'touchBtn') {
                return;
            }
			
			this.setData({
				show: false
			});
        },
		jumpMiniPro() {
			if (this.properties.hasJump) {
				wx.navigateBackMiniProgram({
					success(res) {}
				})
			} else {
				// 跳转浮动按钮处于展开状态时点击才会跳转
				const appid = this.properties.appid;
				const path = this.properties.path;
				console.log(appid, path);
				wx.navigateToMiniProgram({
					appId: appid,
					path: path,
					// envVersion: 'trial',
					success(res) { }
				})
			}
		}
    }

})