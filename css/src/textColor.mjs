import { colors } from './_colors.mjs'

export const textColors = Object.keys(colors).reduce((a, x) => {
    a[`text-${x}`] =
        x === 'transparent'
            ? `color: ${colors[x]};`
            : `color: rgb(${colors[x]});`
    return a
}, {})
