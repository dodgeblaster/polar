class ListItem extends HTMLElement {
    constructor() {
        super()
        this.name = this.getAttribute('name')
        this.description = this.getAttribute('description')
        this.price = this.getAttribute('price')
    }

    connectedCallback() {
        this.innerHTML = /*html*/ `
            <div class='border border-zinc-200 rounded p-4 m-4'>
                <h2 class="font-bold">${this.name}</h2>
                <p class="item-description" x-text='description'>${this.description}</p>
                <p>Price: <span class="item-price" x-text='price'>${this.price}</span></p>
            </div>
        `
    }
}

customElements.define('list-item', ListItem)
