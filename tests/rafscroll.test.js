import rafscroll from '../src/rafscroll.js'

jest.spyOn(window, 'requestAnimationFrame').mockImplementation(callback => setTimeout(() => callback(), 5))

test('uses document as default element', () => {
    const scroller = rafscroll()
    expect(scroller.el.tagName).toBe('HTML')
})

test('can override default element', () => {
    const el = document.createElement('div')
    const scroller = rafscroll(el)
    expect(scroller.el).toBe(el)
})

test('can override default element', () => {
    const el = document.createElement('div')
    const scroller = rafscroll(el)
    expect(scroller.el).toBe(el)
})

test('can use object notation to set el', () => {
    const el = document.createElement('div')
    const scroller = rafscroll({ duration: 500, el: el })
    expect(scroller.el).toBe(el)
})

test('can use options as first argument', () => {
    const scroller = rafscroll({ duration: 200 })
    expect(scroller.el.tagName).toBe('HTML')
})

test('can override basic configuration options', () => {
    const scroller = rafscroll({ duration: 200 })
    expect(scroller.options.duration).toBe(200)
})

test('performs multiple raf calls', async () => {
    await rafscroll().scrollTop(100)
    expect(requestAnimationFrame).toBeCalled()
})
