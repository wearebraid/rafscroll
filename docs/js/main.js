import 'babel-polyfill'
import '../scss/main.scss'
import rafscroll from '../../lib/rafscroll'


/**
 * The link scroller
 */
let links = document.querySelector('.nav')
let scroller = rafscroll().setDuration(1000)

links.addEventListener('click', (e) => {
  if (e.target.tagName === "A") {
    e.preventDefault()
    var hash = e.target.href.match(/#([a-zA-Z0-9-]+)$/g)[0].replace('#', '')
    console.log(document.getElementById(hash))
    // Here is the actual rafscroll
    scroller.scrollTop(document.getElementById(hash).offsetTop - 60)
  }
})

/**
 * The headshot scroller
 */
let next = document.getElementById('next')
let name = document.getElementById('name')
let headshots = rafscroll(document.getElementById('headshots'))
let index = 0
let semaphore = true
let characters = [
  {name: 'Tom Sawyer', top: 210, left: 75},
  {name: 'Second Boy', top: 240, left: 255},
  {name: 'Third Boy', top: 220, left: 405},
  {name: 'Fourth Boy', top: 220, left: 310}
]

// Instantly set the initial character
headshots.setEasing('noease').setDuration(1)
headshots.scrollTop(characters[index].top)
headshots.scrollLeft(characters[index].left)
// Add our easing back in
headshots.setEasing('quadratic').setDuration(500)

function nextHeadshot () {
  index = (characters.length > index + 1) ? ++index : 0
  headshots.scrollTop(characters[index].top)
  headshots.scrollLeft(characters[index].left)
  name.innerHTML = characters[index].name
}

let rotate = function () {
  if (semaphore) {
    setTimeout(() => {
      if (semaphore) {
        nextHeadshot()
        rotate()
      }
    }, 2000)
  }
}
rotate()

next.addEventListener('click', function (e) {
  e.preventDefault();
  semaphore = false
  nextHeadshot()
})