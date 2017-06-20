import 'babel-polyfill'
import '../scss/main.scss'
import rafscroll from '../../lib/rafscroll'

let links = document.querySelector('.nav')
let scroller = rafscroll()

links.addEventListener('click', (e) => {
  if (e.target.tagName === "A") {
    e.preventDefault()
    var hash = e.target.href.match(/#([a-zA-Z0-9-]+)$/g)[0].replace('#', '')

    // Here is the actual rafscroll
    scroller.scrollTop(document.getElementById(hash).offsetTop - 60)
  }
})