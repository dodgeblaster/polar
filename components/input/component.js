class InputText extends HTMLElement {
    constructor() {
        super()
        this.id = this.getAttribute('id') || 'hello'
        this.name = this.getAttribute('name') || 'hello'
        this.value = this.getAttribute('value') || ''
        this.shadow = this.attachShadow({ mode: 'open' })
        this.submitting = this.getAttribute('submitting') === 'true'
        this.render()
        this.setupEvents()
    }

    /**
     * Reactive properties
     */
    static get observedAttributes() {
        return ['name', 'value', 'submitting']
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'value') {
            const input = this.shadowRoot.querySelector('input')
            input.value = newValue
        }
        if (name === 'submitting') {
            const input = this.shadowRoot.querySelector('input')
            if (newValue === 'true') {
                input.classList.add('input-submitting')
                input.setAttribute('disabled', '')
            } else {
                input.classList.remove('input-submitting')
                input.removeAttribute('disabled')
            }
        }
    }

    render() {
        this.shadow.innerHTML = /*html*/ `
            <style>
                * {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                }
                label {
                    display: block;
                    font-size: 0.75rem;
                    margin-bottom: 0.25rem;
                    font-weight: bold;
                }
                input {
                    display: block;
                    padding: 10px;
                    border: 1px solid #e8e8e8;
                    border-radius: 0.5rem;
                    margin-bottom: 0.75rem;
                    width: 100%;
                }
                input:focus {
                    border-color: green;
                    outline: solid green;
                }
                input::placeholder {
                    color: #9ca3af;
                }
                .input-submitting {
                    opacity: 0.5;
                    background: #e8e8e8;
                }
                .input-submitting:hover {
                    cursor: not-allowed;
                }
            </style>
            <div>
                <label for="${this.id}">${this.name}</label>
                <input
                    id="${this.id}"
                    class="${this.submitting && 'input-submitting'}"
                    ${this.submitting && 'disabled'}
                    placeholder='text goes here'
                    value='${this.value}'
                />
            </div>
        `
    }

    setupEvents() {
        this.shadow.querySelector('input').addEventListener('change', (e) => {
            const event = new CustomEvent('input-changed', {
                bubbles: true,
                composed: true,
                detail: { value: e.target.value }
            })
            this.dispatchEvent(event)
        })
    }
}

customElements.define('gj-input-text', InputText)
