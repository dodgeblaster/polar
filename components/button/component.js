class AddButton extends HTMLElement {
    constructor() {
        super()
        this.text = this.getAttribute('text') || 'hello'
        this.shadow = this.attachShadow({ mode: 'open' })
        this.render()
        this.setupEvents()
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
                button {
                    border: none;
                    margin-bottom: 0.5rem;
                    border-radius: 0.75rem;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    background-color: #1e2836;
                    box-shadow: 0 0 #0000, 0 0 #0000, 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
                    width: 100%;
                    text-align: left;
                } 
                button:hover {
                    cursor: pointer;
                    background: #2b3749;
                }
                p {
                    padding: 20px;
                    flex: 1;
                    font-weight: bold;
                    color: white;
                }
                svg {
                    height: 30px;
                    margin-right: 20px;
                }
            </style>
            <button>
                <p>${this.text}</p>
                <svg viewBox="0 0 24 24">
                    <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z" clip-rule="evenodd" />
                </svg>
            </button>
        `
    }
    setupEvents() {
        this.shadow.querySelector('button').addEventListener('click', (e) => {
            const event = new CustomEvent('add-button-clicked', {
                bubbles: true,
                composed: true
            })
            this.dispatchEvent(event)
        })
    }
}

customElements.define('gj-add-button', AddButton)
