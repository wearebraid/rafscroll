[![Build Status](https://travis-ci.com/wearebraid/rafscroll.svg?branch=master)](https://travis-ci.com/wearebraid/rafscroll)
![GitHub file size in bytes](https://img.shields.io/github/size/wearebraid/rafscroll/dist/rafscroll.esm.js?color=g)

# Rafscroll

Rafscroll is a small library (`<3kb` esm or `<4kb` umd) to smooth scroll windows and
DOM elements by using a browser’s native `requestAnimationFrame`, ensuring
optimal scrolling without impacting site performance. Rafscroll can operate on
both the x and y axis with various easing functions.

[Demo here](https://rafscroll.wearebraid.com/)

## Get Started

_Note: This readme assumes you are using a build tool like [webpack](https://webpack.js.org/)_

First install from NPM or yarn:

```sh
npm install @braid/rafscroll
- or -
yarn add @braid/rafscroll
```

Then import/require the library in your front end code:

```js
// main.js

import rafscroll from '@braid/rafscroll'
```

Rafscroll exports a function. Calling this function creates a new instance of
rafscroll.

```js
let scroller = rafscroll(element, {...options})
```

The returned object can then have it's X or Y axis animated by calling
`scrollTop()` or/and `scrollLeft()`. The return value of either of these
is a `Promise` that resolves when the scroll animation is complete.
For convenience rafscroll also uses some intelligent defaults — the window is
the default element, and the the default easing is quadratic.

A full example:

```js
import rafscroll from '@braid/rafscroll'

// Scroll 100px down the page after 1 second.
setTimeout(async () => {
    await rafscroll().scrollTop(100)
    alert('Finished scrolling')
}, 1000)
```

## Options

Available options to pass as a second argument to rafscroll:

Option   | Values                                        | Default
---------|-----------------------------------------------|----------------------------
duration | any `Number` in milliseconds                  | 500
easing   | 'quadratic', 'linear', or a custom `Function` | 'quadratic'

Custom easing functions receive an object containing 4 properties:

```js
{current, duration, posDelta, posStart}
```

They should return a numeric value representing the current position. For
example the linear easing function already included in rafscroll is:

```js
function ({current, duration, posDelta, posStart}) {
    return (current / duration) * posDelta + posStart
}
```

## Sponsor

Rafscroll is written and maintained by [Braid LLC](https://www.wearebraid.com),
and offered freely under an MIT license.

[<img src="https://assets.wearebraid.com/sig.png" title="Written and maintained by Braid LLC" alt="Braid LLC" width="150" height="44">](https://www.wearebraid.com)