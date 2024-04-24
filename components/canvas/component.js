const MODES = {
    DRAG: 'DRAG',
    CONNECT: 'CONNECT',
    NOTE: 'NOTE'
}

const CARD_WIDTH = 140
const CARD_HEIGHT = 40

/**
 * This is a web component
 */
class MyCanvas extends HTMLElement {
    state = {}
    edges = {}
    mode = MODES.DRAG
    containerElement = null
    noteElement = null
    connectState = false
    constructor() {
        super()
        this.attachShadow({ mode: 'open' })
        this.shadowRoot.innerHTML = `<style> * {box-sizing: border-box}</style><script src="https://cdn.tailwindcss.com"></script>`

        /**
         * Make canvas
         */
        const canvas = document.createElement('div')
        canvas.id = 'canva'
        canvas.style.position = 'absolute'
        canvas.style.left = '0px'
        canvas.style.top = '0px'
        canvas.style.width = '100%'
        canvas.style.height = '100%'
        canvas.style.backgroundColor = 'white'
        canvas.style.backgroundImage = `radial-gradient(rgb(0,0,0) 0.5px, transparent 0)`
        canvas.style.backgroundSize = '20px 20px'
        canvas.style.backgroundPosition = '-19px -19px'
        canvas.style.overflow = 'hidden'
        this.shadowRoot.appendChild(canvas)
        this.containerElement = canvas

        /**
         * Make lines container
         */
        const linesContainer = document.createElementNS(
            'http://www.w3.org/2000/svg',
            'svg'
        )
        linesContainer.id = 'lines'
        linesContainer.style.position = 'absolute'
        linesContainer.style.left = '0px'
        linesContainer.style.top = '0px'
        linesContainer.style.width = '100%'
        linesContainer.style.height = '100%'
        canvas.appendChild(linesContainer)

        const canvasContainer = document.createElement('div')
        canvasContainer.id = 'canvas'
        canvasContainer.style.position = 'absolute'
        canvasContainer.style.left = '0px'
        canvasContainer.style.top = '0px'
        canvasContainer.style.width = '100%'
        canvasContainer.style.height = '100%'
        canvasContainer.style.background = 'transparent'
        canvasContainer.style.overflow = 'hidden'
        canvas.appendChild(canvasContainer)

        let isNoteDragging = false
        let startingOffest = {
            x: 0,
            y: 0
        }

        let startPointDown = {
            x: 0,
            y: 0
        }
        canvasContainer.addEventListener('mousedown', (e) => {
            if (this.mode !== MODES.NOTE) return
            if (this.noteElement) {
                this.noteElement = null
                const note = this.shadowRoot.getElementById('note')
                note.remove()
                const noteInput = this.shadowRoot.getElementById('note-input')
                noteInput.remove()
            }

            isNoteDragging = true
            const notes = this.shadowRoot.getElementById('lines')
            const note = document.createElementNS(
                'http://www.w3.org/2000/svg',
                'rect'
            )
            note.id = 'note'
            note.setAttribute('x', e.offsetX - 0)
            note.setAttribute('y', e.offsetY - 0)
            note.setAttribute('width', 100)
            note.setAttribute('height', 100)
            note.setAttribute('fill', 'rgba(255,255,50,0.2)')
            note.setAttribute('style', 'z-index: 999px')
            note.setAttribute('stroke-width', '2')
            notes.appendChild(note)

            startPointDown = {
                x: e.offsetX,
                y: e.offsetY
            }
            startingOffest = {
                x: e.offsetX,
                y: e.offsetY
            }

            this.noteElement = note
        })
        canvasContainer.addEventListener('mouseup', (e) => {
            if (this.mode !== MODES.NOTE) return
            isNoteDragging = false

            const noteInput = document.createElement('input')
            noteInput.type = 'text'
            noteInput.style.position = 'absolute'
            noteInput.style.left = startPointDown.x + 'px'
            noteInput.style.top = startPointDown.y - 44 + 'px'
            noteInput.style.width = e.offsetX - startPointDown.x + 'px'
            noteInput.style.height = 20
            noteInput.style.border = 'none'
            noteInput.style.borderRadius = '5px'
            noteInput.style.background = 'rgba(255,255,50,0.5)'
            noteInput.style.color = 'black'
            noteInput.style.fontSize = '16px'
            noteInput.style.padding = '10px'
            noteInput.id = 'note-input'
            noteInput.style.outline = 'none'
            noteInput.addEventListener('input', (e) => {
                e.stopPropagation()
            })
            this.shadowRoot.appendChild(noteInput)
        })
        canvasContainer.addEventListener('mousemove', (e) => {
            if (this.mode !== MODES.NOTE) return
            if (!isNoteDragging) return
            this.noteElement.setAttribute('width', e.offsetX - startingOffest.x)
            this.noteElement.setAttribute(
                'height',
                e.offsetY - startingOffest.y
            )
        })

        /**
         * Make buttons
         */
        const makeButton = (x, y, text, mode) => {
            const addButton = document.createElement('button')
            addButton.textContent = text
            addButton.style.position = 'absolute'
            addButton.style.left = '10px'
            addButton.style.top = y + 'px'
            addButton.style.padding = '4px 10px'
            addButton.style.borderRadius = '4px'
            addButton.style.border = 'none'
            addButton.style.backgroundColor = '#eb7da4'
            addButton.style.cursor = 'pointer'
            addButton.style.fontSize = '8px'
            addButton.style.fontFamily = `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`
            addButton.style.color = 'white'
            addButton.style.userSelect = 'none'
            addButton.style.webkitUserSelect = 'none'
            addButton.style.mozUserSelect = 'none'
            addButton.style.msUserSelect = 'none'
            addButton.addEventListener('click', () => {
                this.mode = mode
            })
            this.shadowRoot.appendChild(addButton)
        }

        makeButton(0, 10, 'DRAG', MODES.DRAG)
        makeButton(0, 40, 'CONNECT', MODES.CONNECT)
        makeButton(0, 70, 'NOTE', MODES.NOTE)
    }

    addLine(startId, endId) {
        const lines = this.shadowRoot.getElementById('lines')
        const createSvgLine = (id, points) => {
            const polyline = document.createElementNS(
                'http://www.w3.org/2000/svg',
                'polyline'
            )

            const pointsString = points
                .map((point) => point.join(','))
                .join(' ')
            polyline.id = id
            polyline.setAttribute('points', pointsString)
            polyline.setAttribute('fill', 'none')
            polyline.setAttribute('stroke', 'gray')
            polyline.setAttribute('stroke-width', '2')

            lines.appendChild(polyline)
            this.edges[id] = polyline
        }

        const makeLine = (startId, endId) => {
            const s = this.state[startId].element
            const sPosition = s.getClientRects()[0]

            const e = this.state[endId].element
            const ePosition = e.getClientRects()[0]

            const offset = this.containerElement.getClientRects()[0]
            const startPoint = {
                x: sPosition.x + CARD_WIDTH + 0 - offset.x,
                y: sPosition.y + CARD_HEIGHT / 2 - offset.y
            }

            const endPoint = {
                x: ePosition.x - 0 - offset.x,
                y: ePosition.y + CARD_HEIGHT / 2 - offset.y
            }

            const pointsArray = [
                [startPoint.x, startPoint.y],
                [startPoint.x + (endPoint.x - startPoint.x) / 2, startPoint.y],
                [startPoint.x + (endPoint.x - startPoint.x) / 2, endPoint.y],
                [endPoint.x, endPoint.y]
            ]

            const id = `${startId}-${endId}`
            createSvgLine(id, pointsArray)
        }

        makeLine(startId, endId)
    }

    updateLine(id) {
        const s = this.state[id.split('-')[0]].element
        const sPosition = s.getClientRects()[0]
        const e = this.state[id.split('-')[1]].element
        const ePosition = e.getClientRects()[0]

        const offset = this.containerElement.getClientRects()[0]
        const startPoint = {
            x: sPosition.x + CARD_WIDTH + 0 - offset.x,
            y: sPosition.y + CARD_HEIGHT / 2 - offset.y
        }

        const endPoint = {
            x: ePosition.x - 0 - offset.x,
            y: ePosition.y + CARD_HEIGHT / 2 - offset.y
        }

        const points = [
            [startPoint.x, startPoint.y],
            [startPoint.x + (endPoint.x - startPoint.x) / 2, startPoint.y],
            [startPoint.x + (endPoint.x - startPoint.x) / 2, endPoint.y],
            [endPoint.x, endPoint.y]
        ]

        const pointsString = points.map((points) => points.join(',')).join(' ')
        this.edges[id].setAttribute('points', pointsString)
    }

    clearState() {
        for (const id in this.state) {
            const element = this.state[id].element
            element.remove()
        }
        for (const id in this.edges) {
            const element = this.edges[id]
            element.remove()
        }
        const noteElement = this.noteElement
        noteElement.remove()
        const noteInput = this.shadowRoot.getElementById('note-input')
        noteInput.remove()

        this.noteElement = null
        this.state = {}
        this.edges = {}
    }

    addCard({ id, x = 150, y = 150, text }) {
        console.log('id ' + id + ' ' + y)

        if (id === 'MyFunction') {
            x = 100
            y = 200
        }

        let canvas = this.shadowRoot.getElementById('canvas')
        const card = document.createElement('div')
        card.classList.add('card')
        card.innerHTML = text
        card.id = id
        card.style.position = 'absolute'
        card.style.left = x + 'px'
        card.style.top = y + 'px'
        card.style.width = CARD_WIDTH + 'px'
        card.style.height = CARD_HEIGHT + 'px'
        card.style.backgroundColor = 'white'
        card.style.borderRadius = '10px'
        card.style.boxShadow =
            'rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px'
        card.style.padding = '10px'
        card.style.fontFamily = `ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`
        card.style.border = '1px solid rgb(241,241,241)'
        card.style.display = 'flex'
        card.style.alignItems = 'start'
        card.style.userSelect = 'none'
        card.style.webkitUserSelect = 'none'
        card.style.mozUserSelect = 'none'
        card.style.msUserSelect = 'none'
        card.style.oUserSelect = 'none'

        card.innerHTML = `      <svg
        width="20"
        height="20"
        viewBox="0 0 33 33"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line
          x1="5.5259"
          y1="8.11953"
          x2="18.5259"
          y2="1.11953"
          stroke="#EB7DA4"
          stroke-width="2"
        />
        <line
          x1="1.23806"
          y1="21.3524"
          x2="18.2381"
          y2="1.35235"
          stroke="#EB7DA4"
          stroke-width="2"
        />
        <line
          x1="1.4385"
          y1="21.1725"
          x2="29.4385"
          y2="2.17253"
          stroke="#EB7DA4"
          stroke-width="2"
        />
        <line
          x1="16.0824"
          y1="32.6024"
          x2="29.0824"
          y2="2.6024"
          stroke="#EB7DA4"
          stroke-width="2"
        />
        <line
          x1="16.4"
          y1="32.2"
          x2="32.4"
          y2="20.2"
          stroke="#EB7DA4"
          stroke-width="2"
        />
        <line
          x1="9.91337"
          y1="22.0038"
          x2="32.9134"
          y2="20.0038"
          stroke="#EB7DA4"
          stroke-width="2"
        />
      </svg><p style='margin: 0 0 0 10px; font-size: 12px'>${text}</p>`

        // make text unselectable with js
        card.onselectstart = function () {
            return false
        }

        canvas.appendChild(card)

        this.state[id] = {
            x,
            y,
            text,
            element: card
        }

        /**
         * add event listeners for mousedown, mousedrag, mouseup to faciliate drag and drop on this card
         */
        let isdragging = false
        let startx = 0
        let starty = 0

        const canvaElement = this.shadowRoot.getElementById('canva')
        card.addEventListener('mousedown', (e) => {
            if (this.mode === MODES.CONNECT) {
                if (this.connectState && this.connectState === id) {
                    return
                }

                if (!this.connectState) {
                    this.connectState = id
                    return
                }

                if (this.edges[`${this.connectState}-${id}`]) {
                    this.connectState = false
                    return
                }

                this.addLine(this.connectState, id)
                this.connectState = false
                return
            }
            if (this.mode !== MODES.DRAG) return

            console.log('mousedown')
            isdragging = true
            const cardPosition = card.getClientRects()[0]
            startx = e.clientX - cardPosition.x
            starty = e.clientY - cardPosition.y
        })
        document.addEventListener('mousemove', (e) => {
            if (this.mode !== MODES.DRAG) return
            console.log('mousemove')
            if (isdragging) {
                const offset = canvaElement.getClientRects()[0]

                card.style.left = `${e.clientX - startx - offset.x}px`
                card.style.top = `${e.clientY - starty - offset.y}px`

                let ids = Object.keys(this.edges).filter((x) => {
                    const s = x.split('-')[0]
                    const e = x.split('-')[1]
                    if (s === id || e === id) return true
                    return false
                })

                for (const id of ids) {
                    this.updateLine(id)
                }
            }
        })
        card.addEventListener('mouseup', (e) => {
            if (this.mode !== MODES.DRAG) return
            console.log('mouseup')
            isdragging = false

            this.state[id].x = e.clientX - startx
            this.state[id].y = e.clientY - starty
        })
    }

    removeCard(id) {
        let canvas = this.shadowRoot.getElementById('canvas')
        let card = canvas.querySelector(`#${id}`)
        card.remove()
        return true
    }

    getState() {
        function getCardsInsideNoteRectangle() {
            const note = this.shadowRoot.getElementById('note')
            if (!note) return []
            const notePosition = note.getClientRects()[0]
            const cards = Object.keys(this.state).map(
                (k) => this.state[k].element
            )
            const cardsInsideNoteRectangle = []
            for (const card of cards) {
                const cardPosition = card.getClientRects()[0]
                if (
                    cardPosition.x >= notePosition.x &&
                    cardPosition.x + cardPosition.width <=
                        notePosition.x + notePosition.width &&
                    cardPosition.y >= notePosition.y &&
                    cardPosition.y + cardPosition.height <=
                        notePosition.y + notePosition.height
                ) {
                    cardsInsideNoteRectangle.push(card.id)
                }
            }
            return cardsInsideNoteRectangle
        }

        const cardsInsideNoteRectangle = getCardsInsideNoteRectangle.call(this)
        const textInsideNoteInput =
            this.shadowRoot.getElementById('note-input')?.value

        return {
            nodes: Object.keys(this.state).map((k) => ({
                id: k,
                x: this.state[k].x,
                y: this.state[k].y,
                text: this.state[k].text
            })),
            edges: Object.keys(this.edges),
            note: {
                text: textInsideNoteInput,
                cards: cardsInsideNoteRectangle
            }
        }
    }
}

customElements.define('my-canvas', MyCanvas)
