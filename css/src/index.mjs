import { getSize, staticSizes } from './size.js'
import { backgroundColors } from './backgroundColor.js'
import { borderColors } from './borderColor.js'
import { border } from './border.js'
import { flex } from './flex.js'
import { font } from './font.js'
import { layout } from './layout.js'
import { opacity } from './opacity.js'
import { textColors } from './textColor.js'
import { gradients } from './gradients.js'
import { animation } from './animation.js'
import { transform } from './transform.js'
import { shadow } from './shadow.js'
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

export function calculateStyles(selector, css) {
    const atoms = css.split(' ')
    let extra = ''
    let cssStyles = `${selector} {`
    atoms.forEach((s) => {
        if (staticStyles[s]) {
            cssStyles = cssStyles + staticStyles[s]
        } else if (getSize(s)) {
            cssStyles = cssStyles + getSize(s)
        }

        if (s.startsWith('animate-')) {
            extra = extra + keyframes
        }
    })

    cssStyles = cssStyles + '}' + extra
    return cssStyles
}
