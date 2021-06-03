import SIH from "../helper/sys-infos-helper";
import MyStr from "../support/utils/string-util";
const LOG_TAG = "poster-util";
export default {
    /**
     * 
     * @param { ctx, canvas, rect, nodes, backgroundColor } data 
     */
    draw({ ctx, canvas, rect, nodes, backgroundColor }) {
        nodes || (nodes = []);
        const tt = { ctx, canvas, rect };
        return Promise.all(nodes.map(node => {
            if (!node) return;
            const HD = WIDGET_TYPES[node.type]
            return HD && HD.transformData(tt, node);
        })).then(nodes => {
            if (backgroundColor) {
                const { x, y, width, height } = rect;
                ctx.fillStyle = backgroundColor;
                ctx.fillRect(x, y, width * 2, height);
            }
            nodes.forEach(node => {
                if (!node) return;
                const HD = WIDGET_TYPES[node.type]
                return HD && HD.draw(tt, node);
            });
        }).catch(err => {
            console.debug(LOG_TAG, "渲染失败", err);
            return Promise.reject("渲染失败");
        });
    },
    /**
     * 
     * @param {*} options 画布保存为临时文件的参选选项
     * @param {*} target 可选。如果是使用canvasId，且在自定义组件内部，需要指定自定义组件
     */
    canvasToAlbum(options, target) {
        return new Promise((resolve, reject) =>
            wx.canvasToTempFilePath({
                ...options,
                success(res) {
                    resolve(res.tempFilePath);
                },
                fail(err) {
                    reject(err);
                }
            }, target)
        ).then(filePath => new Promise((resolve, reject) => {
            let timer = setTimeout(() => {
                timer && clearTimeout(timer) && (timer = null);
                reject();
            }, 5000);
            wx.saveImageToPhotosAlbum({
                filePath: filePath,
                success(res) {
                    timer && clearTimeout(timer) && (timer = null);
                    resolve(res);
                },
                fail(err) {
                    timer && clearTimeout(timer) && (timer = null);
                    reject(err);
                }
            })
        })).catch(err => {
            console.debug(LOG_TAG, "无法存入相册", err);
            return Promise.reject("无法存入相册");
        });
    }
}




/************************************************* 文本 **************************************************/
const Text = {
    //TextAlign: start, end, center, left, right
    //TextBaseline: alphabetic, top, hanging, middle, ideographic, bottom
    //FontStyle: normal, italic, oblique
    //FontVariant: normal, small-caps
    //fontWeight: normal, bold, bolder, lighter

    //生成数据
    transformData(_, node) {
        return Promise.resolve(node).then(node => {
            let {
                text, fontSize, color, backgroundColor,
                x, y, width, height,
                textAlign, textBaseline, lineHeight, letterSpacing,
                lineClamp, textOverflow,
                fontStyle, fontVariant, fontWeight, fontFamily, } = node;

            width = toUPx(width);
            height = toUPx(height);
            if (width === 0 || height === 0) return undefined;

            text = isSet(text) ? text.toString() : undefined;
            fontSize = toUPx(fontSize);
            x = toPx(x) || 0;
            y = toPx(y) || 0;

            textAlign = MyStr.trim(textAlign) || "";
            textBaseline = MyStr.trim(textBaseline) || "";
            lineHeight = toUPx(lineHeight); !isSet(lineHeight) && (lineHeight = fontSize);
            letterSpacing = toPx(letterSpacing) || 0;

            lineClamp = toCeilInt(lineClamp) || 0;
            textOverflow = MyStr.trim(textOverflow);
            if (textOverflow == "clip")
                textOverflow = undefined;
            else if (textOverflow == "ellipsis")
                textOverflow = "…";

            fontStyle = MyStr.trim(fontStyle) || "";
            fontVariant = MyStr.trim(fontVariant) || "";
            fontWeight = MyStr.trim(fontWeight) || "";
            fontFamily = MyStr.trim(fontFamily) || "";

            return {
                type: "text", text, fontSize, color, backgroundColor,
                x, y, width, height,
                textAlign, textBaseline, lineHeight, letterSpacing,
                lineClamp, textOverflow,
                fontStyle, fontVariant, fontWeight, fontFamily,
            }
        });
    },

    //渲染
    draw({ ctx }, {
        text, color, fontSize, backgroundColor,
        x, y, width, height,
        textAlign, verticalAlign, lineHeight, letterSpacing,
        lineClamp, textOverflow,
        fontStyle, fontVariant, fontWeight, fontFamily, }) {
        if (width === 0) return undefined;
        if ((!isSet(text) || !fontSize) && height && backgroundColor) {//无内容 有高度 设置了背景；画个背景后退出
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(x, y, width, height);
            return;
        }
        ctx.font = `${fontStyle} ${fontVariant} ${fontWeight} ${fontSize}px ${fontFamily}`;
        ctx.textAlign = textAlign;
        ctx.textBaseline = "alphabetic";

        const tm = ctx.measureText(text);

        let ry = (tm.actualBoundingBoxAscent || fontSize) + (lineHeight - fontSize) / 2;

        const textWidth = tm.width + (text.length - 1) * letterSpacing;
        const textLineNum = Math.ceil(textWidth / width);
        const lineNum = lineClamp > 0 ? Math.min(lineClamp, textLineNum) : textLineNum;
        const textHeight = lineNum * lineHeight
        if (height) {
            ry = ry + this.calculateTextRy(verticalAlign, textHeight, height);
        } else {
            height = textHeight
        }

        if (backgroundColor) {
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(x, y, width, height);
        }

        const tx = x;
        const ty = y + ry;

        ctx.fillStyle = color;

        //一行
        if (textWidth < width) {
            letterSpacing > 0
                ? this.drawTextLine(ctx, { chars: text.split(""), x: tx + this.calculateRowRx(textAlign, textWidth, width), y: ty, letterSpacing, textAlign })//有字间距
                : ctx.fillText(text, tx + this.calculateTextRx(textAlign, width), ty, textWidth);//无字间距
            return;
        }
        //多行
        const textOverflowWidth = isSet(textOverflow) ? ctx.measureText(textOverflow).width : 0;

        let lines = 0;
        let char, charWidth, tempWidth = 0;
        if (letterSpacing > 0) {//有字间距
            let chars = null;
            let charWidths = null;
            for (let i = 0; i < text.length; i++) {
                (chars === null) && (chars = []);
                (charWidths === null) && (charWidths = []);
                char = text.charAt(i);
                chars.push(char);
                charWidth = ctx.measureText(char).width;
                charWidths.push(charWidth);
                tempWidth = tempWidth + charWidth;

                const isOverflow = textLineNum > lineNum && lines >= (lineNum - 1) && (tempWidth + letterSpacing + textOverflowWidth) >= width;
                const isTextEnd = isOverflow || i == (text.length - 1);
                const isRowEnd = isTextEnd || tempWidth >= width;

                if (isRowEnd) {
                    const rowx = this.calculateRowRx(textAlign, isOverflow ? (tempWidth + letterSpacing + textOverflowWidth) : tempWidth, width);
                    const rowy = lines * lineHeight;
                    const to = isOverflow ? textOverflow : undefined;
                    this.drawTextLine(ctx, { x: tx + rowx, y: ty + rowy, chars, charWidths, letterSpacing, textOverflow: to, textAlign });
                    chars = null; charWidths = null; lines = lines + 1; tempWidth = 0;
                    if (isTextEnd) break;
                } else {
                    tempWidth = tempWidth + letterSpacing;
                }
            }
        } else {//无字间距
            let row = null;
            for (let i = 0; i < text.length; i++) {
                (row === null) && (row = "");
                char = text.charAt(i);
                row = row + char;
                charWidth = ctx.measureText(char).width;
                tempWidth = tempWidth + charWidth;

                const isOverflow = textLineNum > lineNum && lines >= (lineNum - 1) && (tempWidth + textOverflowWidth) >= width;
                const isTextEnd = isOverflow || i == (text.length - 1);
                const isRowEnd = isTextEnd || tempWidth >= width;

                if (isRowEnd) {
                    const rowx = this.calculateTextRx(textAlign, width);
                    const rowy = lines * lineHeight;
                    const to = isOverflow ? textOverflow : undefined;
                    ctx.fillText(row + (to || ""), tx + rowx, ty + rowy, isOverflow ? (tempWidth + textOverflowWidth) : tempWidth);
                    row = null; lines = lines + 1; tempWidth = 0;
                    if (isTextEnd) break;
                }
            }
        }
    },


    drawTextLine(ctx, { x, y, chars, charWidths, letterSpacing, textOverflow, textAlign }) {
        let offx = 0;
        if (charWidths) {
            for (let i = 0; i < chars.length; i++) {
                const char = chars[i];
                const charWidth = charWidths[i] + letterSpacing;
                ctx.fillText(char, x + offx + this.calculateTextRx(textAlign, charWidth), y, charWidth);
                offx = offx + charWidth;
            }
        }
        else {
            for (let i = 0; i < chars.length; i++) {
                const char = chars[i];
                const charWidth = ctx.measureText(char).width + letterSpacing;
                ctx.fillText(char, x + offx + this.calculateTextRx(textAlign, charWidth), y, charWidth);
                offx = offx + charWidth;
            }
        }
        if (textOverflow)
            ctx.fillText(textOverflow, x + offx, y);
    },

    calculateTextRy(verticalAlign, textHeight, height) {
        switch (verticalAlign) {
            case "middle":
                return (height - textHeight) / 2;
            case "bottom":
                return height - textHeight;
            case "top":
            default:
                return 0;
        }
    },

    calculateTextRx(textAlign, width) {
        switch (textAlign) {
            case "center":
                return width / 2;
            case "right":
                return width;
            case "left":
            default:
                return 0;
        }
    },

    calculateRowRx(textAlign, textWidth, width) {
        switch (textAlign) {
            case "center":
                return (width - textWidth) / 2;
            case "right":
                return width - textWidth;
            case "left":
            default:
                return 0;
        }
    }
};

/************************************************* 图片 **************************************************/
const Image = {
    //生成数据
    transformData({ canvas }, node) {
        return Promise.resolve(node).then(node => {
            let { src, x, y, width, height, mode, holder, backgroundColor } = node;
            mode = MyStr.trim(mode || "").replace(/\s+/, " ");
            x = toPx(x) || 0;
            y = toPx(y) || 0;
            width = mode == "heightFix" ? undefined : toUPx(width);
            height = mode == "widthFix" ? undefined : toUPx(height);
            if (width === 0 || height === 0)
                return Promise.resolve(undefined);
            return getImage(canvas, { src: src }).ifcatch(holder, () => getImage(canvas, { src: holder }))
                .then(image => {
                    if (image.width <= 0 || image.height <= 0) //无效图片
                        return Promise.reject();
                    return {
                        type: "image", image, backgroundColor,
                        ...this.calculateMode(mode, {
                            x, y, width, height,
                            sWidth: image.width, sHeight: image.height
                        })
                    }
                }).catch(() => {
                    if (!backgroundColor || !width || !height)
                        return undefined;
                    return {
                        type: "image", backgroundColor,
                        x, y, width, height
                    }
                });
        });
    },
    //渲染
    draw({ ctx }, { image, backgroundColor,
        x, y, width, height,
        sx, sy, sWidth, sHeight,
        rx, ry, rWidth, rHeight }) {
        if (backgroundColor) {
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(x, y, width, height);
        }
        if (image)
            ctx.drawImage(image, sx, sy, sWidth, sHeight, x + rx, y + ry, rWidth, rHeight);
    },

    //图片缩放模式计算
    calculateMode(mode, { x, y, width, height, sWidth, sHeight }) {
        let sx = 0, sy = 0;
        let rx = 0, ry = 0, rWidth = width, rHeight = height;
        if (!width && !height) {
            rWidth = width = sWidth;
            rHeight = height = sHeight;
        } else {
            if (!width) {
                rWidth = width = height * sWidth / sHeight;
            } else if (!height) {
                rHeight = height = width * sHeight / sWidth;
            }
            switch (mode) {
                case "scaleToFill":
                    break;
                case "aspectFit":
                    if (sWidth / sHeight >= width / height) {
                        rHeight = width * (sHeight / sWidth);
                        ry = (height - rHeight) / 2;
                    }
                    else {
                        rWidth = height * (sWidth / sHeight);
                        rx = (width - rWidth) / 2;
                    }
                    break;
                case "aspectFill":
                    if (sWidth / sHeight >= width / height) {
                        const nsw = (sHeight / height) * width;
                        sx = (sWidth - nsw) / 2;
                        sWidth = nsw;
                    }
                    else {
                        const nsh = (sWidth / width) * height;
                        sy = (sHeight - nsh) / 2;
                        sHeight = nsh;
                    }
                    break;
                default:
                    const gm = this.gravityMode(mode);
                    if (!gm) break;
                    switch (gm.vm) {
                        case "top":
                            if (sHeight > height) {
                                sHeight = height;
                            } else {
                                rHeight = sHeight;
                            }
                            break;
                        case "bottom":
                            if (sHeight > height) {
                                sy = sHeight - height;
                                sHeight = height;
                            } else {
                                ry = height - sHeight;
                                rHeight = sHeight;
                            }
                            break;
                        case "center":
                            if (sHeight > height) {
                                sy = (sHeight - height) / 2;
                                sHeight = height;
                            } else {
                                ry = (height - sHeight) / 2;
                                rHeight = sHeight;
                            }
                            break;
                    }
                    switch (gm.hm) {
                        case "left":
                            if (sWidth > width) {
                                sWidth = width;
                            } else {
                                rWidth = sWidth;
                            }
                            break;
                        case "right":
                            if (sWidth > width) {
                                sx = sWidth - width;
                                sWidth = width;
                            } else {
                                rx = width - sWidth;
                                rWidth = sWidth;
                            }
                            break;
                        case "center":
                            if (sWidth > width) {
                                sx = (sWidth - width) / 2;
                                sWidth = width;
                            } else {
                                rx = (width - sWidth) / 2;
                                rWidth = sWidth;
                            }
                            break;
                    }
                    break;
            }
        }
        return {
            x, y, width, height, //指定位置
            sx, sy, sWidth, sHeight,//内容剪切
            rx, ry, rWidth, rHeight,//相对位置
        }
    },
    //图片重力模式计算
    gravityMode(mode) {
        let vm, hm;
        switch (mode) {
            case "top":
                vm = "top";
                hm = "center";
                break;
            case "bottom":
                vm = "bottom";
                hm = "center";
                break;
            case "left":
                vm = "center";
                hm = "left";
                break;
            case "right":
                vm = "center";
                hm = "right";
                break;
            case "center":
                vm = "center";
                hm = "center";
                break;
            case "top left":
                vm = "top";
                hm = "left";
                break;
            case "top right":
                vm = "top";
                hm = "right";
                break;
            case "bottom left":
                vm = "bottom";
                hm = "left";
                break;
            case "bottom right":
                vm = "bottom";
                hm = "right";
                break;
            default:
                return;
        }
        return { vm, hm };
    }
};




const WIDGET_TYPES = {
    "image": Image,
    "text": Text
}




/************************************************* 帮助函数 **************************************************/
function getImage(canvas, { src }) {
    return new Promise((rs, rj) => {
        const img = canvas.createImage();
        img.onload = () => {
            rs(img);
        };
        img.onerror = () => {
            rj();
        };
        img.src = src
    });
}

function toCeilInt(value) {
    value = Math.ceil(value);
    if (isNaN(value)) return undefined;
    return value;
}

function toPx(value) {
    value = SIH.toPx(value);
    if (!value) return value;
    return Math.round(value);
}

//rpx 转 px, 非负处理
function toUPx(value) {
    value = SIH.toPx(value);
    if (!isSet(value) || value < 0) return undefined;
    return Math.round(value);
}

//判断是否有值
function isSet(value) {
    return !(value === undefined || value === null);
}
