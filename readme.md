# Polar

## Polar Store

### Install

```
curl https://raw.githubusercontent.com/dodgeblaster/polar/main/polar-store.js > polar-store.js
```

### Example

```js
import { atomDeep, listenKeys } from 'polar-store.js'

export const states = {
    READY: 'READY',
    SUBMITTING: 'SUBMITTING',
    ERROR: 'ERROR',
    SUCCESS: 'SUCCESS'
}

export const loginStore = atomDeep({
    username: '',
    state: states.READY,
    ui: {
        submitting: false,
        message: {
            active: false,
            text: '',
            type: 'info'
        }
    }
})

/**
 * Listening on store changes to change store
 */
listenKeys(loginStore, [`state`], async (x, key) => {
    if (x.state === states.SUBMITTING) {
        loginStore.setKey(`ui.submitting`, true)

        try {
            const res = await mockLoginCall()
            loginStore.setKey(`state`, states.SUCCESS)
            loginStore.setKey(`ui.message`, {
                active: true,
                text: 'Success',
                type: 'success'
            })

            setTimeout(() => {
                loginStore.setKey(`ui.message`, {
                    active: false,
                    text: '',
                    type: 'info'
                })
            }, 2000)
        } catch (e) {
            loginStore.setKey(`state`, states.ERROR)
            loginStore.setKey(`ui.message`, {
                active: true,
                text: 'There was an issue',
                type: 'error'
            })
        } finally {
            loginStore.setKey(`ui.submitting`, false)
        }
    }
})

/**
 * Listening store changes to change ui
 */
const setText = (ui, id, v) => (ui.querySelector(id).textContent = v)
const setAttr = (ui, id, att, v) => ui.querySelector(id).setAttribute(att, v)

const onStoreSubmittingUpdate = (ui, state) => {
    return listenKeys(loginStore, [`ui.submitting`], async (x, key) => {
        if (x.ui.submitting === true) {
            setAttr(ui, '#loginbutton', 'text', 'Logging in...')
            setAttr(ui, '#username', 'submitting', 'true')
            setAttr(ui, '#password', 'submitting', 'true')
        } else {
            setAttr(ui, '#loginbutton', 'text', 'Login')
            setAttr(ui, '#username', 'submitting', 'false')
            setAttr(ui, '#password', 'submitting', 'false')
        }
    })
}

const onStoreMessageStateUpdate = (ui, state) => {
    return listenKeys(loginStore, [`ui.message`], async (x, key) => {
        setAttr(ui, '#message', 'type', x.ui.message.type)
        setAttr(ui, '#message', 'active', x.ui.message.active)
        setText(ui, '#message', x.ui.message.text)
    })
}

/**
 * Listening on ui changes to change store
 */
const onAddClick = (ui, state) => {
    ui.querySelector('#loginbutton').addEventListener('s-click', (v) => {
        loginStore.setKey(`state`, states.SUBMITTING)
    })
}

const onInputChange = (ui, state) => {
    ui.querySelector('#username').addEventListener('s-change', (v) => {
        loginStore.setKey(`username`, v.detail.value)
    })
}
```

## Polar UI

### Install

```
curl https://raw.githubusercontent.com/dodgeblaster/polar/main/polar-ui.js > polar-ui.js
```

### Example

```js
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
        name: 'my-button',
        bindings,
        render
    }
}

ui(myComp)
```

## Polar CSS

### Install

```
curl https://raw.githubusercontent.com/dodgeblaster/polar/main/polar-css.css > polar-css.css
```
