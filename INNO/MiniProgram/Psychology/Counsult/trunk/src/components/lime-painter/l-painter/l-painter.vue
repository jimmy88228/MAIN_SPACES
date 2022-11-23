<template>
	<view class="lime-painter" ref="limepainter">
		<view v-if="canvasId && size" :style="styles">
			<!-- #ifndef APP-NVUE -->
			<canvas class="lime-painter__canvas" v-if="use2dCanvas" :id="canvasId" type="2d" :style="size"></canvas>
			<canvas class="lime-painter__canvas" v-else :canvas-id="canvasId" :style="size" :id="canvasId"
				:width="boardWidth * dpr" :height="boardHeight * dpr"></canvas>

			<!-- #endif -->
			<!-- #ifdef APP-NVUE -->
			<web-view :style="size" ref="webview"
				src="/uni_modules/lime-painter/static/index.html"
				class="lime-painter__canvas" @pagefinish="onPageFinish" @error="onError" @onPostMessage="onMessage">
			</web-view>
			<!-- #endif -->
		</view>
		<slot />
	</view>
</template>


<script>
	import { parent } from '../common/relation'
	import props from './props'
	import {toPx, base64ToPath, pathToBase64, isBase64, sleep, getImageInfo}from './utils';
	//  #ifndef APP-NVUE
	import { compareVersion } from './utils';
	import Painter from './painter'
	const nvue = {}
	//  #endif
	//  #ifdef APP-NVUE
	import nvue from './nvue'
	//  #endif
	export default {
		name: 'lime-painter',
		mixins: [props, parent('painter'), nvue],
		data() {
			return {
				// #ifdef MP-WEIXIN || MP-TOUTIAO || MP-ALIPAY
				use2dCanvas: true,
				// #endif
				// #ifndef MP-WEIXIN || MP-TOUTIAO || MP-ALIPAY
				use2dCanvas: false,
				// #endif
				canvasHeight: 150,
				canvasWidth: null,
				isPC: false,
				inited: false,
				progress: 0,
				first: 0,
			};
		},
		computed: {
			styles() {
				return `${this.size}${this.customStyle||''}`
			},
			canvasId() {
				return `l-painter${this._uid || this._.uid}`
			},
			size() {
				if (this.boardWidth && this.boardHeight) {
					return `width:${this.boardWidth}px; height: ${this.boardHeight}px;`;
				}
			},
			dpr() {
				return this.pixelRatio || uni.getSystemInfoSync().pixelRatio;
			},
			boardWidth() {
				const {width = 0} = (this.board && this.board.css) || this.board || this
				return toPx(width) || Math.max(toPx(width), toPx(this.canvasWidth));
			},
			boardHeight() {
				const {height = 0} = (this.board && this.board.css) || this.board || this
				return toPx(height) || Math.max(toPx(height), toPx(this.canvasHeight));
			},
			elements() {
				return JSON.parse(JSON.stringify(this.el))
			}
		},
		watch: {
			canvasWidth(v) {
				if (this.el.css && !this.el.css.width) {
					this.el.css.width = v
				}
			},
			// #ifdef MP-WEIXIN ||  MP-ALIPAY
			size(v) {
				// #ifdef MP-WEIXIN
				if (this.use2dCanvas) {
					this.inited = false;
				}
				// #endif
				// #ifdef MP-ALIPAY
				this.inited = false;
				// #endif
			},
			// #endif
		},
		created() {
			const { SDKVersion, version, platform } = uni.getSystemInfoSync();
			// #ifdef MP-WEIXIN
			this.isPC = /windows/i.test(platform)
			this.use2dCanvas = this.type === '2d' && compareVersion(SDKVersion, '2.9.2') >= 0  && !this.isPC;
			// #endif
			// #ifdef MP-TOUTIAO
			this.use2dCanvas = this.type === '2d' && compareVersion(SDKVersion, '1.78.0') >= 0;
			// #endif
			// #ifdef MP-ALIPAY
			this.use2dCanvas = this.type === '2d' && compareVersion(my.SDKVersion, '2.7.0') >= 0;
			// #endif
		},
		async mounted() {
			await sleep(30)
			await this.getParentWeith()
			this.$nextTick(() => {
				setTimeout(() => {
					if (this.board && Object.keys(this.board).length) {
						this.$watch('board', this.watchRender, {
							deep: true,
							immediate: true
						});
					} else {
						this.$watch('elements', this.watchRender, {
							deep: true,
							immediate: true
						});
					}
				}, 30)
			})
		},
		methods: {
			async watchRender(val, old) {
				this.progress = 0
				if (!val || !val.views || (!this.first ? !val.views.length : !this.first) || JSON.stringify(val) === '{}' || JSON.stringify(val) == JSON.stringify(old)) return;
				this.first = 1
				clearTimeout(this.rendertimer)
				this.rendertimer = setTimeout(() => {
					this.render(val);
				}, this.beforeDelay)
			},
			async setFilePath(path, isEmit) {
				let filePath = path
				const {pathType} = this
				if (pathType == 'base64' && !isBase64(path)) {
					filePath = await pathToBase64(path)
				} else if (pathType == 'url' && isBase64(path)) {
					filePath = await base64ToPath(path)
				}
				if (isEmit) {
					this.$emit('success', filePath);
				}
				return filePath
			},
			async getSize(args) {
				if (!this.size) {
					const {width} = args.css || args
					const {height} = args.css || args
					if (width || height) {
						this.canvasWidth = width || this.canvasWidth
						this.canvasHeight = height || this.canvasHeight
						await sleep(30);
					} else {
						await this.getParentWeith()
					}
				}
			},
			canvasToTempFilePathSync(args) {
				this.$watch('progress', (v) => {
					if (v == 1) {
						this.canvasToTempFilePath(args)
					}
				}, {
					immediate: true
				})
			},
			// #ifndef APP-NVUE
			getParentWeith() {
				return new Promise(resolve => {
					uni.createSelectorQuery()
						.in(this)
						.select(`.lime-painter`)
						.boundingClientRect()
						.exec(res => {
							this.canvasWidth = Math.ceil(res[0].width)||300
							this.canvasHeight = res[0].height || this.canvasHeight||150
							resolve(res[0])
						})
				})
			},
			async render(args = {}) {
				await this.getSize(args)
				const ctx = await this.getContext();
				let {
					use2dCanvas,
					boardWidth,
					boardHeight,
					canvas,
					afterDelay
				} = this;
				if (use2dCanvas && !canvas) {
					return Promise.reject(new Error('render: fail canvas has not been created'));
				}
				this.boundary = {
					top: 0,
					left: 0,
					width: boardWidth,
					height: boardHeight
				};
				if (!this.painter) {
					const param = {
						context: ctx,
						canvas,
						width: boardWidth,
						height: boardHeight,
						pixelRatio: this.dpr,
						fixed: `${this.width?'width':''}${this.height?'height':''}`,
						listen: {
							onProgress: (v) => {
								this.progress = v
								this.$emit('progress', v)
							},
							onEffectFail: (err) => {
								this.$emit('faill', err)
							}
						}
					}
					if(!use2dCanvas) {
						param.createImage = getImageInfo
					}
					this.painter = new Painter(param, this)
				}
				const { width, height } = await this.painter.source(args)
				this.boundary.height = this.canvasHeight = height
				this.boundary.width = this.canvasWidth = width
				await sleep(this.sleep);
				await this.painter.render()
				await new Promise(resolve => this.$nextTick(resolve));
				if (!use2dCanvas) {
					await this.canvasDraw();
				}
				if (afterDelay && use2dCanvas) {
					await sleep(afterDelay);
				}
				this.$emit('done');
				if (this.isCanvasToTempFilePath) {
					this.canvasToTempFilePath()
						.then(res => {
							this.$emit('success', res.tempFilePath)
						})
						.catch(err => {
							this.$emit('fail', new Error(JSON.stringify(err)));
						});
				}
				return Promise.resolve({
					ctx,
					draw: this.painter,
					node: this.node
				});
			},
			canvasDraw(flag = false) {
				return new Promise((resolve, reject) => this.ctx.draw(flag, () => setTimeout(() => resolve(), this
					.afterDelay)));
			},
			async getContext() {
				if (!this.canvasWidth) {
					this.$emit('fail', 'painter no size')
					console.error('painter no size: 请给画板或父级设置尺寸')
					return Promise.reject();
				}
				if (this.ctx && this.inited) {
					return Promise.resolve(this.ctx);
				}
				const { type, use2dCanvas, dpr, boardWidth, boardHeight } = this;
				const _getContext = () => {
					return new Promise(resolve => {
						uni.createSelectorQuery()
							.in(this)
							.select(`#${this.canvasId}`)
							.boundingClientRect()
							.exec(res => {
								if (res) {
									const ctx = uni.createCanvasContext(this.canvasId, this);
									if (!this.inited) {
										this.inited = true;
										this.use2dCanvas = false;
										this.canvas = res;
									}
									if (this.isPC) {
										ctx.scale(1 / dpr, 1 / dpr);
									}
									// #ifdef MP-ALIPAY
									ctx.scale(dpr, dpr);
									// #endif
									this.ctx = ctx
									resolve(this.ctx);
								}
							});
					});
				};
				if (!use2dCanvas) {
					return _getContext();
				}
				return new Promise(resolve => {
					uni.createSelectorQuery()
						.in(this)
						.select(`#${this.canvasId}`)
						.node()
						.exec(res => {
							let {node: canvas} = res[0];
							if (!canvas) {
								this.use2dCanvas = false;
								resolve(this.getContext());
							}
							const ctx = canvas.getContext(type);
							if (!this.inited) {
								this.inited = true;
								this.use2dCanvas = true;
								this.canvas = canvas;
							}
							this.ctx = ctx
							resolve(this.ctx);
						});
				});
			},
			canvasToTempFilePath(args = {}) {
				return new Promise((resolve, reject) => {
					const { use2dCanvas, canvasId, dpr, fileType, quality } = this;
					let { top: y = 0, left: x = 0, width, height } = this.boundary || this;
						let destWidth = width * dpr;
						let destHeight = height * dpr;
						// #ifdef MP-ALIPAY
						width = destWidth;
						height = destHeight;
						// #endif
						const success = async (res) => {
							try {
								const tempFilePath = await this.setFilePath(res.tempFilePath||res)
								resolve(Object.assign(res, {tempFilePath}))
							} catch (e) {
								this.$emit('fail', e)
							}
						}
						const copyArgs = Object.assign({
							x,
							y,
							width,
							height,
							destWidth,
							destHeight,
							canvasId,
							fileType,
							quality,
							success,
							fail: reject
						}, args);
						
						// #ifdef MP-ALIPAY
						if (use2dCanvas && uni.canIUse('canvasToTempFilePath.object.canvas')) {
							delete copyArgs.canvasId;
							delete copyArgs.width;
							delete copyArgs.destWidth;
							delete copyArgs.height;
							delete copyArgs.destHeight;
							this.canvas.canvasToTempFilePath(copyArgs)
						} else {
							uni.canvasToTempFilePath(copyArgs);
						}
						uni.canvasToTempFilePath(copyArgs);
						// #endif
						// #ifndef MP-ALIPAY
						if (use2dCanvas) {
							delete copyArgs.canvasId;
							copyArgs.canvas = this.canvas;
						}
						uni.canvasToTempFilePath(copyArgs, this);
						// #endif
				})
			}
			// #endif
		}
	};
</script>
<style>
	.lime-painter,
	.lime-painter__canvas {
		// #ifndef APP-NVUE
		width: 100%;
		min-width: 1px;
		min-height: 1px;
		// #endif
		// #ifdef APP-NVUE
		flex: 1;
		// #endif
	}
</style>
