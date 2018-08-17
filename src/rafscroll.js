/**
 * Eased (smooth) scrolling using requestAnimationFrame.
 *
 * @param  {Element} el
 * @param  {options}
 */
class RequestAnimationFrameScroll {
  /**
   * Instantiate a new scroll RequestAnimationFrameScroll instance.
   *
   * @param {DOMElement} el
   * @param {Object} options
   */
  constructor (el, options = {}) {
    this.options = Object.assign({
      duration: 500,
      easing: 'quadratic'
    }, options)
    this.el = el
    this._ticking = false
    this.scrolls = {
      x: {},
      y: {}
    }
    this._complete = () => {}
    this._promise = Promise.resolve()
  }

  /**
   * Perform the scroll animation and return a promise to indicate when the
   * scroll is complete.
   *
   * @return {Promise}
   */
  animate () {
    if (!this._ticking) {
      this._promise = new Promise((resolve, reject) => {
        this._complete = resolve
        this._ticking = window.performance.now()
        this._tick(this._ticking)
      })
    }
    return this._promise
  }

  /**
   * Scroll the X coordinate.
   *
   * @param {Number} target 
   * @param {Number} duration 
   */
  scrollLeft (target, duration) {
    return this.createScroll(target, duration, 'x')
  }

  /**
   * Scroll the Y coordinate.
   *
   * @param {Number} target 
   * @param {Number} duration 
   */
  scrollTop (target, duration) {
    return this.createScroll(target, duration)
  }

  /**
   * Create a scroll "object" that describes all the information about our
   * scroll animation.
   *
   * @param {Number} target
   * @param {Number} duration
   * @param {String} axis
   */
  createScroll (target, duration, axis = 'y') {
    let prop = axis === 'x' ? 'scrollLeft' : 'scrollTop'
    let start = this.el[prop]
    let timeStart = window.performance.now()
    this.scrolls[axis] = {
      posStart: start,
      posTarget: target,
      posDelta: target - start,
      timeStart: timeStart,
      timeEnd: timeStart + (duration || this.options.duration),
      duration: duration || this.options.duration,
      ease: this.getEasing(),
      prop: prop
    }
    return this.animate()
  }

  /**
   * Get the easing function.
   * 
   * @return {Function}
   */
  getEasing () {
    let map = {
      quadratic: this._quadratic,
      linear: this._linear,
      none: this._noease
    }
    if (typeof this.options.easing === 'string') {
      if (Object.keys(map).includes(this.options.easing)) {
        return map[this.options.easing]
      }
    }
    if (typeof this.options.easing === 'function') {
      return this.options.easing
    }
    return this._quadratic
  }

  /**
   * Set the easing function.
   *
   * @param {Function} easing
   * @return {self}
   */
  setEasing (easing) {
    this.options.easing = easing
    return this
  }

  /**
   * Set the duration in milliseconds.
   *
   * @param {Number} duration
   * @return {self}
   */
  setDuration (duration) {
    this.options.duration = duration
    return this
  }

  /**
   * Recursively tick through our duration with eased scrolling.
   *
   * @param {Function} ticker
   * @return {null}
   */
  _tick (ticker) {
    if (this._ticking) {
      window.requestAnimationFrame(() => {
        Object.keys(this.scrolls).map(axis => {
          return this._setprop(this.scrolls[axis], ticker)
        })
        this._tick(window.performance.now())
        if (this._expired(ticker)) {
          this._ticking = false
        }
      })
    } else {
      this._complete()
    }
  }

  /**
   * Determine if the scroll is complete.
   *
   * @param {Number} ticker
   * @return {Boolean}
   */
  _expired (ticker) {
    let y = !this.scrolls.y.timeEnd || this.scrolls.y.timeEnd < ticker
    let x = !this.scrolls.x.timeEnd || this.scrolls.x.timeEnd < ticker
    return y && x
  }

  /**
   * Set a property on the element for the given axis. Typically this is
   * either the top or left properties.
   *
   * @param {Object} scroll
   * @param {Number} ticker 
   */
  _setprop (scroll, ticker) {
    if (!scroll.timeEnd) {
      return false
    }
    if (scroll.timeEnd > ticker) {
      scroll.current = ticker - scroll.timeStart
      this.el[scroll.prop] = scroll.ease(scroll)
    } else {
      this.el[scroll.prop] = scroll.posTarget
    }
  }

  /**
   * Linear easing function.
   *
   * @param {Object} object 
   */
  _linear ({current, duration, posDelta, posStart}) {
    return (current / duration) * posDelta + posStart
  }

  /**
   * Quadratic easing function.
   *
   * @param {Object} object 
   */
  _quadratic ({current, duration, posDelta, posStart}) {
    var r = current / (duration / 2)
    if (r < 1) {
      return posDelta / 2 * r * r + posStart
    }
    r--
    return -posDelta / 2 * (r * (r - 2) - 1) + posStart
  }

  /**
   * No easing function.
   *
   * @param {Object} object 
   */
  _noease ({current, duration, posDelta, posStart}) {
    return posDelta + posStart
  }
}

export default function (el) {
  return new RequestAnimationFrameScroll(el || document.body)
}
