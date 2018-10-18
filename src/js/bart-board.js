
const template = document.createElement('template')
template.innerHTML = /* html */`
<style>
  :host {
    background:#002418;
    font-size: 1.2em;
    color:white;
    width:500px;
    height:200px;
    padding:10px;
    border:6px solid #9b3b00;
    border-bottom:12px solid #9b3b00;
    overflow:hidden;
    margin:10px;
    float:left;
    border-radius: 3px;
  }

  p {
    margin: 0;
    padding: 0;
  }
</style>

<p id='text'></p>
`
/**
 * A BartBoard element that prints a message as the user presses the mouse button.
 *
 * @class BartBoard
 * @extends {window.HTMLElement}
 */
export class BartBoard extends window.HTMLElement {
  /**
   * Creates an instance of BartBoard.
   * @memberof BartBoard
   */
  constructor () {
    super()

    this.attachShadow({ mode: 'open' })
    this.shadowRoot.appendChild(template.content.cloneNode(true))
    this._p = this.shadowRoot.querySelector('#text')
    this._intervalID = null
    this._letter = 0
    this._text = 'Låt stå!'
    this._speed = 50
  }
  /**
   * Watches the attributes "text" and "speed" for changes on the element.
   *
   * @readonly
   * @static
   * @memberof BartBoard
   */
  static get observedAttributes () {
    return ['text', 'speed']
  }
  /**
   * Called by the browser engine when an attribute changes
   *
   * @param {any} name of the attribute
   * @param {any} oldValue
   * @param {any} newValue
   * @memberof BartBoard
   */
  attributeChangedCallback (name, oldValue, newValue) {
    if (name === 'text') {
      this._text = newValue
    } else if (name === 'speed') {
      this._speed = newValue
    }
  }
  /**
   * Called when connected to the DOM
   *
   * @memberof BartBoard
   */
  connectedCallback () {
    this.addEventListener('mousedown', this._onWrite)
    this.addEventListener('mouseup', this.stopWriting)
    this.addEventListener('mouseleave', this.stopWriting)
  }

  /**
   * Called when removed from the DOM. Clean-up here
   *
   * @memberof BartBoard
   */
  disconnectedCallback () {
    this.removeEventListener('mousedown', this._onWrite)
    this.removeEventListener('mouseup', this.stopWriting)
    this.removeEventListener('mouseleave', this.stopWriting)
    this.stopWriting()
  }

  /**
   * When the user clicks the mousebutton we should write letters on the board
   *
   * @param {any} event
   * @memberof BartBoard
   */
  _onWrite (event) {
    this._intervalID = setInterval(() => {
      if (this._p.offsetHeight >= this.offsetHeight) {
        this.dispatchEvent(new window.CustomEvent('filled'))
        this.stopWriting()
        return
      }

      this._p.textContent += this._text.charAt(this._letter++)
      if (this._letter >= this._text.length) {
        this._p.textContent += ' '
        this._letter = 0
      }
    }, this._speed)
  }
  /**
   * Stops the writing
   *
   * @memberof BartBoard
   */
  stopWriting () {
    clearTimeout(this._intervalID)
  }

  /**
   * Wipes the board clean and resets the letter counter.
   *
   * @memberof BartBoard
   */
  wipeBoard () {
    this._p.textContent = ''
    this._letter = 0
  }
}

// Registers the custom event
window.customElements.define('bart-board', BartBoard)
