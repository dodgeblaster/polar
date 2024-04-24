/**
 * Bindings
 */
const hydrateText = (data, tag) => (doc) => {
    const clickHandlers = doc.querySelectorAll(`[${tag}]`)
    clickHandlers.forEach((element) => {
        const v = element.getAttribute(`${tag}`)
        data.subscribe((x) => {
            element.textContent = x[v]
        })
    })
}

const hydrateClick = (actions, tag) => (doc) => {
    const clickHandlers = doc.querySelectorAll(`[${tag}]`)
    clickHandlers.forEach((element) => {
        const functionName = element.getAttribute(`${tag}`)
        const fn = actions[functionName]
        element.addEventListener('click', (event) => {
            fn(event)
        })
    })
}

const hydrateChange = (actions, tag) => (doc) => {
    const clickHandlers = doc.querySelectorAll(`[${tag}]`)
    clickHandlers.forEach((element) => {
        const functionName = element.getAttribute(`${tag}`)
        const fn = actions[functionName]
        element.addEventListener('keyup', (event) => {
            fn(event)
        })
    })
}

const hydrateList = (data, tag) => (doc) => {
    const lists = doc.querySelectorAll(`[${tag}]`)
    const l = Array.from(lists)

    l.forEach((element) => {
        data.subscribe((x) => {
            /**
             * descrtructive render,
             * will want to do a diff, and only add or remove on that diff
             */
            const fragment = document.createDocumentFragment()
            const listData = element.getAttribute(`${tag}`)

            const actualListData = x[listData]
            const itemTemplateId = element.getAttribute(`template-id`)
            const itemProps = JSON.parse(element.getAttribute(`template-props`))
            const itemTemplate = document.getElementById(itemTemplateId)

            actualListData.forEach((item, i) => {
                const itemElement = itemTemplate.content.cloneNode(true)
                // itemElement.setAttribute('id', item.id)
                const theRoot = itemElement.children[0]
                theRoot.id = item.id
                Object.keys(itemProps).forEach((k) => {
                    theRoot.setAttribute(k, item[itemProps[k]])
                })

                const clickHandlers = itemElement.querySelectorAll(`[x-text]`)
                clickHandlers.forEach((element) => {
                    const v = element.getAttribute(`x-text`)
                    data.subscribe((x) => {
                        element.textContent = x[listData][i][v] //item[v]
                    })
                })

                fragment.appendChild(itemElement)
            })
            element.innerHTML = ''
            element.appendChild(fragment)
        })
    })
}

export default (myComp) => {
    let compName = myComp().name
    class Comp extends HTMLElement {
        constructor() {
            super()
        }

        async connectedCallback() {
            const comp = myComp()
            compName = comp.name

            this.innerHTML = comp.render()

            comp.bindings.forEach((config) => {
                if (config.type === 'text') {
                    hydrateText(config.data, config.tag)(this)
                }

                if (config.type === 'click') {
                    hydrateClick(config.data, config.tag)(this)
                }

                if (config.type === 'change') {
                    hydrateChange(config.data, config.tag)(this)
                }

                if (config.type === 'list') {
                    hydrateList(config.data, config.tag)(this)
                }
            })
        }
    }
    customElements.define(compName, Comp)
}
