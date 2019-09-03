/**
 * 设备限制开关
 *
 * @author Chenshuyao
 */

import $ from './lib/query.js';
import './sass/deviceSwitch.scss';

class Device {

  constructor() {
    let that = this;

    this.html = '<div id="__device"><div class="btn--device">设备限制</div></div>';
    this.$dom = null;

    this.switchPos = {
      x: 12, // left
      y: 12, // bottom
      startX: 0,
      startY: 0,
      endX: 0,
      endY: 0
    };

    let _onload = function () {
      that._render();
      that._bindEvent();
    };
    if (document !== undefined) {
      if (document.readyState == 'complete') {
        _onload();
      } else {
        window.onload = _onload()
      }
    } else {
      // if document does not exist, wait for it
      let _timer;
      let _pollingDocument = function () {
        if (document && document.readyState == 'complete') {
          _timer && clearTimeout(_timer);
          _onload();
        } else {
          _timer = setTimeout(_pollingDocument, 1);
        }
      };
      _timer = setTimeout(_pollingDocument, 1);
    }
  }

  /**
   * render DOM
   * @private
   */
  _render() {
    let id = '#__device';
    if (!$.one(id)) {
      let e = document.createElement('div');
      e.innerHTML = this.html;
      document.documentElement.appendChild(e.children[0]);
    }
    this.$dom = $.one(id);

    // reposition switch button
    let $box = this.$dom;
    let $btn = $.one('.btn--device', $box);
    let status = this._getStorage('switch_status') * 1;
    let switchX = this._getStorage('switch_x') * 1,
      switchY = this._getStorage('switch_y') * 1;
    if (switchX || switchY) {
      // check edge
      if (switchX + $btn.offsetWidth > document.documentElement.offsetWidth) {
        switchX = document.documentElement.offsetWidth - $box.offsetWidth;
      }
      if (switchY + $btn.offsetHeight > document.documentElement.offsetHeight) {
        switchY = document.documentElement.offsetHeight - $box.offsetHeight;
      }
      if (switchX < 0) {
        switchX = 0;
      }
      if (switchY < 0) {
        switchY = 0;
      }
      this.switchPos.x = switchX;
      this.switchPos.y = switchY;
      $box.style.left = switchX + 'px';
      $box.style.bottom = switchY + 'px';
    }
    window.closeDevice = status
    if (status == 0) { //0开启 1关闭
      $.removeClass($btn, 'close');
    } else {
      $.addClass($btn, 'close');
    }
  };

  /**
   * bind DOM events
   * @private
   */
  _bindEvent() {
    let that = this;
    let $btn = $.one('.btn--device', that.$dom);

    // 拖拽开关
    $.bind($btn, 'touchstart', function (e) {
      that.switchPos.startX = e.touches[0].pageX;
      that.switchPos.startY = e.touches[0].pageY;
    });
    $.bind($btn, 'touchend', function (e) {
      that.switchPos.x = that.switchPos.endX;
      that.switchPos.y = that.switchPos.endY;
      that.switchPos.startX = 0;
      that.switchPos.startY = 0;
      that.switchPos.endX = 0;
      that.switchPos.endY = 0;
      that._setStorage('switch_x', that.switchPos.x);
      that._setStorage('switch_y', that.switchPos.y);
    });
    $.bind($btn, 'touchmove', function (e) {
      if (e.touches.length > 0) {
        let offsetX = e.touches[0].pageX - that.switchPos.startX,
          offsetY = e.touches[0].pageY - that.switchPos.startY;
        let x = that.switchPos.x + offsetX,
          y = that.switchPos.y - offsetY;
        // check edge
        if (x + $btn.offsetWidth > document.documentElement.offsetWidth) {
          x = document.documentElement.offsetWidth - $btn.offsetWidth;
        }
        if (y + $btn.offsetHeight > document.documentElement.offsetHeight) {
          y = document.documentElement.offsetHeight - $btn.offsetHeight;
        }
        if (x < 0) {
          x = 0;
        }
        if (y < 0) {
          y = 0;
        }
        that.$dom.style.left = x + 'px';
        that.$dom.style.bottom = y + 'px';
        that.switchPos.endX = x;
        that.switchPos.endY = y;
        e.preventDefault();
      }
    });

    // 开关点击事件
    $.bind($btn, 'click', () => {
      if ($.hasClass($btn, 'close')) { //如果是关闭状态则开启
        $.removeClass($btn, 'close');
        window.closeDevice = 0 //开启
      } else {
        $.addClass($btn, 'close');
        window.closeDevice = 1 //关闭
      }
      this._setStorage('switch_status', window.closeDevice);
    });
  };

  /**
   * localStorage methods
   * @private
   */
  _setStorage(key, value) {
    key = 'device_' + key;
    if (window.localStorage) {
      localStorage.setItem(key, value);
    } else {
      var exp = new Date();
      exp.setTime(exp.getTime() + 15 * 24 * 60 * 60 * 1000);
      document.cookie = key + "=" + value + ";expires=" + exp.toGMTString();
    }
  }

  _getStorage(key) {
    key = 'device_' + key;
    if (window.localStorage) {
      return localStorage.getItem(key) || ''
    } else {
      var name = key + "=";
      var ca = document.cookie.split(';');
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    }
  }

} // END class

export default Device;
new Device();