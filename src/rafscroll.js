/**
 * Eased (smooth) scrolling using requestAnimationFrame.
 *
 * @param  {Element} el
 * @param  {options}
 */
class RequestAnimationFrameScroll {
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

  scrollLeft (target, duration) {
    return this.createScroll(target, duration, 'x')
  }

  scrollTop (target, duration) {
    return this.createScroll(target, duration)
  }

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

  setEasing (easing) {
    this.options.easing = easing
    return this
  }

  setDuration (duration) {
    this.options.duration = duration
    return this
  }

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

  _expired (ticker) {
    let y = !this.scrolls.y.timeEnd || this.scrolls.y.timeEnd < ticker
    let x = !this.scrolls.x.timeEnd || this.scrolls.x.timeEnd < ticker
    return y && x
  }

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

  _linear ({current, duration, posDelta, posStart}) {
    return (current / duration) * posDelta + posStart
  }

  _quadratic ({current, duration, posDelta, posStart}) {
    var r = current / (duration / 2)
    if (r < 1) {
      return posDelta / 2 * r * r + posStart
    }
    r--
    return -posDelta / 2 * (r * (r - 2) - 1) + posStart
  }

  _noease ({current, duration, posDelta, posStart}) {
    return posDelta + posStart
  }
}

export default function (el) {
  return new RequestAnimationFrameScroll(el || document.body)
}
