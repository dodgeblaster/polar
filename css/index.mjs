import { getSize, staticSizes } from './src/size.mjs'
import { backgroundColors } from './src/backgroundColor.mjs'
import { borderColors } from './src/borderColor.mjs'
import { border } from './src/border.mjs'
import { flex } from './src/flex.mjs'
import { font } from './src/font.mjs'
import { layout } from './src/layout.mjs'
import { opacity } from './src/opacity.mjs'
import { textColors } from './src/textColor.mjs'
import { gradients } from './src/gradients.mjs'
import { animation } from './src/animation.mjs'
import { transform } from './src/transform.mjs'
import { shadow } from './src/shadow.mjs'
const staticStyles = {
    ...backgroundColors,
    ...border,
    ...borderColors,
    ...flex,
    ...font,
    ...layout,
    ...opacity,
    ...textColors,
    ...staticSizes,
    ...gradients,
    ...animation,
    ...transform,
    ...shadow
}

const keyframes = `
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(-25%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}
`
const sizeUnits = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32,
    34, 36, 38, 40, 42, 44, 46, 48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68, 70,
    72, 74, 76, 78, 80, 82, 84, 86, 88, 90, 92, 94, 96, 98, 100, 120, 140, 180,
    200, 220, 240, 260, 280, 300
]

const sizeDefs = [
    'w',
    'h',
    'p',
    'pt',
    'pb',
    'pr',
    'pl',
    'px',
    'py',
    'm',
    'mt',
    'mb',
    'mr',
    'ml',
    'mx',
    'my'
]

let css = ''
Object.keys(staticStyles).forEach((k) => {
    css = css + `.${k} { ${staticStyles[k]}} \n`
})

sizeDefs.forEach((pre) => {
    sizeUnits.forEach((unit) => {
        const str = `${pre}-${unit}`
        css = css + `.${str} { ${getSize(str)}} \n`
    })
})
console.log(css)
