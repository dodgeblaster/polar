import { atomDeep, listenKeys } from './polar-store.js'
import ui from './ui.js'

/**
 * Store
 */
const store = () => {
    const data = atomDeep({
        inventoryCount: 12,
        storeName: 'StoreB',
        items: [
            {
                id: '100',
                name: 'Item 1',
                description: 'This is the first item',
                price: 10
            },
            {
                id: '101',
                name: 'Item 2',
                description: 'This is the second item',
                price: 15
            },
            {
                id: '102',
                name: 'Item 3',
                description: 'This is the third item',
                price: 20
            }
        ]
    })

    setTimeout(() => {
        data.setKey(`items.3`, {
            id: '103',
            name: 'Item 4',
            description: 'This is the four item',
            price: 200
        })
    }, 4000)

    const actions = {
        setStoreName: (x) => {
            data.setKey(`storeName`, x)
        },
        addInventory: () => {
            const existing = data.get().inventoryCount
            data.setKey('inventoryCount', existing + 1)
        },
        updateName: (e) => {
            const v = e.target.value
            data.setKey('items.1.name', v)
        }
    }

    return {
        data,
        actions
    }
}

/**
 * Component
 */
const myComp = () => {
    const s = store()
    const bindings = [
        { type: 'text', tag: 's-text', data: s.data },
        { type: 'click', tag: 's-click', data: s.actions },
        { type: 'change', tag: 's-change', data: s.actions },
        { type: 'list', tag: 's-list', data: s.data }
    ]

    const render = () => /*html*/ `
        <div>
            <p>Store</p>
            <p s-text='storeName'></p>
            <p s-text='inventoryCount'></p>
            <input s-change='updateName'/>
            <button s-click='addInventory'>Update</button>

            <ul s-list='items' template-id='item-template' template-props='{
                "name": "name",
                "description": "description",
                "price": "price"
            }'></ul>
            <template id="item-template"><list-item></list-item></template> 
        </div>
    `
    return {
        name: 'gj-button',
        bindings,
        render
    }
}

ui(myComp)
