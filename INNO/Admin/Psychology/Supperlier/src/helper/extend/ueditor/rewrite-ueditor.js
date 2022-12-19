let { UE } = window;
UE.Editor.prototype._bkGetActionUrl = UE.Editor.prototype.getActionUrl;
/**
         * 根据action名称获取请求的路径
         * @method  getActionUrl
         * @remind 假如没有设置serverUrl,会根据imageUrl设置默认的controller路径
         * @param { String } action action名称
         * @example
         * ```javascript
         * editor.getActionUrl('config'); //返回 "/ueditor/php/controller.php?action=config"
         * editor.getActionUrl('image'); //返回 "/ueditor/php/controller.php?action=uplaodimage"
         * editor.getActionUrl('scrawl'); //返回 "/ueditor/php/controller.php?action=uplaodscrawl"
         * editor.getActionUrl('imageManager'); //返回 "/ueditor/php/controller.php?action=listimage"
         * ```
         */
 UE.Editor.prototype.getActionUrl = function _getActionUrl(action) {
  console.log("action", action)
  if (action === 'uploadimage') {
    
      return 'xxx' // 图片接口地址
  }
  // ... 
  return this._bkGetActionUrl(action)
}