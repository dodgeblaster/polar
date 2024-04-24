import { colors } from './_colors.mjs'

export const borderColors = Object.keys(colors).reduce((a, x) => {
    a[`border-${x}`] =
        x === 'transparent'
            ? `border-color: ${colors[x]};`
            : `border-color: rgb(${colors[x]});`
    return a
}, {})
