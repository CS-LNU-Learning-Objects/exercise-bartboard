import './bart-board.js' // This could be done in index.html instead

// This is one way of creating our Custom Elements
let bb1 = document.createElement('bart-board')

// We set attribute using "setAttribute"-syntax
bb1.setAttribute('text', 'I will not pollute the global scope!')
bb1.setAttribute('speed', 2)

// Since the "bart-board" have a Custom Event, we can listen for that.
bb1.addEventListener('filled', () => {
  bb1.wipeBoard() // This might not be the prettiest, directly calling "wipeBoard"
})

// adding our created element to the DOM
document.querySelector('#board').appendChild(bb1)
