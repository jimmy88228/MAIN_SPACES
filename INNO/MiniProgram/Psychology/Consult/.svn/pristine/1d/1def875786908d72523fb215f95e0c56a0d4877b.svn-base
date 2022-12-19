// #ifdef APP-NVUE
import { sleep, getImageInfo, isBase64, useNvue } from './utils';
const dom = weex.requireModule('dom')
import {version } from '../../package.json'
export default {
	data() {
		return {
			tempFilePath: [],
			isInitFile: false
		}
	},
	created() {
		// if (this.hybrid) return
		// useNvue('_doc/uni_modules/lime-painter/', version, this.timeout).then(res => {
		// 	this.isInitFile = true
		// })
	},
	methods: {
		getParentWeith() {
			return new Promise(resolve => {
				dom.getComponentRect(this.$refs.limepainter, (res) => {
					this.canvasWidth = this.canvasWidth || Math.ceil(res.size.width)||300
					this.canvasHeight = res.size.height || this.canvasHeight||150
					resolve(res.size)
				})
			})
		},
		onPageFinish() {
			this.webview = this.$refs.webview
			this.webview.evalJS(`init(${this.dpr})`)
		},
		onMessage(e) {
			const res = e.detail.data[0] || null;
			if (res.event) {
				if (res.event == 'inited') {
					this.inited = true
				}
				if(res.event == 'fail'){
					this.$emit('fail', res)
				}
				if (res.event == 'layoutChange') {
					const data = typeof res.data == 'string' ? JSON.parse(res.data) : res.data
					this.canvasWidth = Math.ceil(data.width);
					this.canvasHeight = Math.ceil(data.height);
				}
				if (res.event == 'progressChange') {
					this.progress = res.data * 1
				}
				if (res.event == 'file') {
					this.tempFilePath.push(res.data)
					if (this.tempFilePath.length > 7) {
						this.tempFilePath.shift()
					}
					return
				}
				if (res.event == 'success') {
					if (res.data) {
						this.tempFilePath.push(res.data)
						if (this.tempFilePath.length > 8) {
							this.tempFilePath.shift()
						}
						if (this.isCanvasToTempFilePath) {
							this.setFilePath(this.tempFilePath.join(''), true)
						}
					} else {
						this.$emit('fail', 'canvas no data')
					}
					return
				}
				this.$emit(res.event, JSON.parse(res.data));
			} else if (res.file) {
				this.file = res.data;
			} else{
				console.info(res[0])
			}
		},
		getWebViewInited() {
			if (this.inited) return Promise.resolve(this.inited);
			return new Promise((resolve) => {
				this.$watch(
					'inited',
					async val => {
						if (val) {
							resolve(val)
						}
					}, {
						immediate: true
					}
				);
			})
		},
		getTempFilePath() {
			if (this.tempFilePath.length == 8) return Promise.resolve(this.tempFilePath)
			return new Promise((resolve) => {
				this.$watch(
					'tempFilePath',
					async val => {
						if (val.length == 8) {
							resolve(val.join(''))
						}
					}
				);
			})
		},
		getWebViewDone() {
			if (this.progress == 1) return Promise.resolve(this.progress);
			return new Promise((resolve) => {
				this.$watch(
					'progress',
					async val => {
						if (val == 1) {
							this.$emit('done')
							resolve(val)
						}
					}, {
						immediate: true
					}
				);
			})
		},
		async render(args) {
			try {
				await this.getSize(args)
				const newNode = await this.calcImage(args);
				await this.getWebViewInited()
				this.webview.evalJS(`source(${JSON.stringify(newNode)})`)
				await this.getWebViewDone()
				await sleep(this.afterDelay)
				if (this.isCanvasToTempFilePath) {
					const params = {
						fileType: this.fileType,
						quality: this.quality
					}
					webview.evalJS(`save(${JSON.stringify(params)})`)
				}
				return Promise.resolve()
			} catch (e) {
				this.$emit('fail', e)
			}
		},
		getfile(e){
			let url = plus.io.convertLocalFileSystemURL( e )
			return new Promise((resolve,reject)=>{
				plus.io.resolveLocalFileSystemURL(url, entry => {
					var reader = null;
					entry.file( file => {
						reader = new plus.io.FileReader();
						reader.onloadend =  ( read )=> {
							resolve(read.target.result)
						};
						reader.readAsDataURL( file );
					}, function ( error ) {
						alert( error.message );
					} );
				},err=>{
					resolve(e)
				})
			})
		},
		async calcImage(args) {
			let node = JSON.parse(JSON.stringify(args))
			const urlReg = /url\((.+)\)/
			const isBG = node.css.backgroundImage && urlReg.exec(node.css.backgroundImage)?.[1]
			const url = node.url || node.src || isBG
			if ((node.type === "image" || isBG) && url && !isBase64(url)) {
				const {path, type} = await getImageInfo(url)
				// const src = await this.getfile(path)
				if (isBG) {
					node.css.backgroundImage = `url(${path})`
				} else {
					node.src = path
				}
			} else if (node.views && node.views.length) {
				for (let i = 0; i < node.views.length; i++) {
					node.views[i] = await this.calcImage(node.views[i])
				}
			}
			return node
		},
		async canvasToTempFilePath(args = {}) {
			if (!this.inited) {
				return this.$emit('fail', 'no init')
			}
			this.tempFilePath = []
			if (args.fileType == 'jpg') {
				args.fileType = 'jpeg'
			}
			this.$refs.webview.evalJS(`save(${JSON.stringify(args)})`)
			try {
				let tempFilePath = await this.getTempFilePath()
				tempFilePath = await this.setFilePath(tempFilePath)
				args.success({
					errMsg: "canvasToTempFilePath:ok",
					tempFilePath
				})
			} catch (e) {
				args.fail({
					error: e
				})
			}
		}
	}
}
// #endif