'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = function (el) {
  if (typeof window !== 'undefined' && !el) {
    var scrollElement = function scrollElement() {
      if ('scrollingElement' in document) {
        return document.scrollingElement;
      }
      var initial = document.documentElement.scrollTop;
      document.documentElement.scrollTop = initial + 1;
      var updated = document.documentElement.scrollTop;
      document.documentElement.scrollTop = initial;
      return updated > initial ? document.documentElement : document.body;
    };
    el = scrollElement();
    console.log(el);
  }
  return new RequestAnimationFrameScroll(el);
};

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Eased (smooth) scrolling using requestAnimationFrame.
 *
 * @param  {Element} el
 * @param  {options}
 */
var RequestAnimationFrameScroll = function () {
  /**
   * Instantiate a new scroll RequestAnimationFrameScroll instance.
   *
   * @param {DOMElement} el
   * @param {Object} options
   */
  function RequestAnimationFrameScroll(el) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, RequestAnimationFrameScroll);

    this.options = Object.assign({
      duration: 500,
      easing: 'quadratic'
    }, options);
    this.el = el;
    this._ticking = false;
    this.scrolls = {
      x: {},
      y: {}
    };
    this._complete = function () {};
    this._promise = Promise.resolve();
  }

  /**
   * Perform the scroll animation and return a promise to indicate when the
   * scroll is complete.
   *
   * @return {Promise}
   */


  _createClass(RequestAnimationFrameScroll, [{
    key: 'animate',
    value: function animate() {
      var _this = this;

      if (!this._ticking) {
        this._promise = new Promise(function (resolve, reject) {
          _this._complete = resolve;
          _this._ticking = window.performance.now();
          _this._tick(_this._ticking);
        });
      }
      return this._promise;
    }

    /**
     * Scroll the X coordinate.
     *
     * @param {Number} target
     * @param {Number} duration
     */

  }, {
    key: 'scrollLeft',
    value: function scrollLeft(target, duration) {
      return this.createScroll(target, duration, 'x');
    }

    /**
     * Scroll the Y coordinate.
     *
     * @param {Number} target
     * @param {Number} duration
     */

  }, {
    key: 'scrollTop',
    value: function scrollTop(target, duration) {
      return this.createScroll(target, duration);
    }

    /**
     * Create a scroll "object" that describes all the information about our
     * scroll animation.
     *
     * @param {Number} target
     * @param {Number} duration
     * @param {String} axis
     */

  }, {
    key: 'createScroll',
    value: function createScroll(target, duration) {
      var axis = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'y';

      var prop = axis === 'x' ? 'scrollLeft' : 'scrollTop';
      var start = this.el[prop];
      var timeStart = window.performance.now();
      this.scrolls[axis] = {
        posStart: start,
        posTarget: target,
        posDelta: target - start,
        timeStart: timeStart,
        timeEnd: timeStart + (duration || this.options.duration),
        duration: duration || this.options.duration,
        ease: this.getEasing(),
        prop: prop
      };
      return this.animate();
    }

    /**
     * Get the easing function.
     *
     * @return {Function}
     */

  }, {
    key: 'getEasing',
    value: function getEasing() {
      var map = {
        quadratic: this._quadratic,
        linear: this._linear,
        none: this._noease
      };
      if (typeof this.options.easing === 'string') {
        if (Object.keys(map).includes(this.options.easing)) {
          return map[this.options.easing];
        }
      }
      if (typeof this.options.easing === 'function') {
        return this.options.easing;
      }
      return this._quadratic;
    }

    /**
     * Set the easing function.
     *
     * @param {Function} easing
     * @return {self}
     */

  }, {
    key: 'setEasing',
    value: function setEasing(easing) {
      this.options.easing = easing;
      return this;
    }

    /**
     * Set the duration in milliseconds.
     *
     * @param {Number} duration
     * @return {self}
     */

  }, {
    key: 'setDuration',
    value: function setDuration(duration) {
      this.options.duration = duration;
      return this;
    }

    /**
     * Recursively tick through our duration with eased scrolling.
     *
     * @param {Function} ticker
     * @return {null}
     */

  }, {
    key: '_tick',
    value: function _tick(ticker) {
      var _this2 = this;

      if (this._ticking) {
        window.requestAnimationFrame(function () {
          Object.keys(_this2.scrolls).map(function (axis) {
            return _this2._setprop(_this2.scrolls[axis], ticker);
          });
          _this2._tick(window.performance.now());
          if (_this2._expired(ticker)) {
            _this2._ticking = false;
          }
        });
      } else {
        this._complete();
      }
    }

    /**
     * Determine if the scroll is complete.
     *
     * @param {Number} ticker
     * @return {Boolean}
     */

  }, {
    key: '_expired',
    value: function _expired(ticker) {
      var y = !this.scrolls.y.timeEnd || this.scrolls.y.timeEnd < ticker;
      var x = !this.scrolls.x.timeEnd || this.scrolls.x.timeEnd < ticker;
      return y && x;
    }

    /**
     * Set a property on the element for the given axis. Typically this is
     * either the top or left properties.
     *
     * @param {Object} scroll
     * @param {Number} ticker
     */

  }, {
    key: '_setprop',
    value: function _setprop(scroll, ticker) {
      if (!scroll.timeEnd) {
        return false;
      }
      if (scroll.timeEnd > ticker) {
        scroll.current = ticker - scroll.timeStart;
        this.el[scroll.prop] = scroll.ease(scroll);
      } else {
        this.el[scroll.prop] = scroll.posTarget;
      }
    }

    /**
     * Linear easing function.
     *
     * @param {Object} object
     */

  }, {
    key: '_linear',
    value: function _linear(_ref) {
      var current = _ref.current,
          duration = _ref.duration,
          posDelta = _ref.posDelta,
          posStart = _ref.posStart;

      return current / duration * posDelta + posStart;
    }

    /**
     * Quadratic easing function.
     *
     * @param {Object} object
     */

  }, {
    key: '_quadratic',
    value: function _quadratic(_ref2) {
      var current = _ref2.current,
          duration = _ref2.duration,
          posDelta = _ref2.posDelta,
          posStart = _ref2.posStart;

      var r = current / (duration / 2);
      if (r < 1) {
        return posDelta / 2 * r * r + posStart;
      }
      r--;
      return -posDelta / 2 * (r * (r - 2) - 1) + posStart;
    }

    /**
     * No easing function.
     *
     * @param {Object} object
     */

  }, {
    key: '_noease',
    value: function _noease(_ref3) {
      var current = _ref3.current,
          duration = _ref3.duration,
          posDelta = _ref3.posDelta,
          posStart = _ref3.posStart;

      return posDelta + posStart;
    }
  }]);

  return RequestAnimationFrameScroll;
}();