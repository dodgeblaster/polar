/**
 * Util
 */
function getStyleFromString(str) {
    return str.split('-')[0]
}

/**
 * Size
 */

function makeWidthStyle(str) {
    const num = Number(str.split('w-')[1])
    return `width: ${num * 4}px;`
}

function makeHeightStyle(str) {
    const num = Number(str.split('h-')[1])
    return `height: ${num * 4}px;`
}
/**
 * Padding
 */
function makePadding(str) {
    const num = Number(str.split('p-')[1])
    return `padding: ${num * 4}px;`
}

function makePaddingT(str) {
    const num = Number(str.split('pt-')[1])
    return `padding-top: ${num * 4}px;`
}

function makePaddingB(str) {
    const num = Number(str.split('pb-')[1])
    return `padding-bottom: ${num * 4}px;`
}

function makePaddingR(str) {
    const num = Number(str.split('pr-')[1])
    return `padding-right: ${num * 4}px;`
}

function makePaddingL(str) {
    const num = Number(str.split('pl-')[1])
    return `padding-left: ${num * 4}px;`
}

function makePaddingX(str) {
    const num = Number(str.split('px-')[1])
    return `padding-right: ${num * 4}px; padding-left: ${num * 4}px;`
}

function makePaddingY(str) {
    const num = Number(str.split('py-')[1])
    return `padding-top: ${num * 4}px; padding-bottom: ${num * 4}px;`
}

/**
 * Margin
 */
function makeMargin(str) {
    const num = Number(str.split('m-')[1])
    return `margin: ${num * 4}px;`
}

function makeMarginT(str) {
    const num = Number(str.split('mt-')[1])
    return `margin-top: ${num * 4}px;`
}

function makeMarginB(str) {
    const num = Number(str.split('mb-')[1])
    return `margin-bottom: ${num * 4}px;`
}

function makeMarginR(str) {
    const num = Number(str.split('mr-')[1])
    return `margin-right: ${num * 4}px;`
}

function makeMarginL(str) {
    const num = Number(str.split('ml-')[1])
    return `margin-left: ${num * 4}px;`
}

function makeMarginX(str) {
    const num = Number(str.split('mx-')[1])
    return `margin-right: ${num * 4}px; margin-left: ${num * 4}px;`
}

function makeMarginY(str) {
    const num = Number(str.split('my-')[1])
    return `margin-top: ${num * 4}px; margin-bottom: ${num * 4}px;`
}

const sizes = {
    // size
    w: (str) => makeWidthStyle(str),
    h: (str) => makeHeightStyle(str),
    // padding
    p: (str) => makePadding(str),
    pt: (str) => makePaddingT(str),
    pb: (str) => makePaddingB(str),
    pr: (str) => makePaddingR(str),
    pl: (str) => makePaddingL(str),
    px: (str) => makePaddingX(str),
    py: (str) => makePaddingY(str),
    // margin
    m: (str) => makeMargin(str),
    mt: (str) => makeMarginT(str),
    mb: (str) => makeMarginB(str),
    mr: (str) => makeMarginR(str),
    ml: (str) => makeMarginL(str),
    mx: (str) => makeMarginX(str),
    my: (str) => makeMarginY(str)
}

export const getSize = (x) => {
    return getStyleFromString(x) && sizes[getStyleFromString(x)]
        ? sizes[getStyleFromString(x)](x)
        : false
}

export const staticSizes = {
    'w-full': 'width: 100%;',
    'w-screen': 'width: 100vw;',
    'w-min': 'width: min-content;',
    'w-max': 'width: max-content;',
    'w-1-2': 'width: 50%;',
    'w-1-3': 'width: 33.333333%;',
    'w-2-3': 'width: 66.666667%;',
    'w-1-4': 'width: 25%;',
    'w-2-4': 'width: 50%;',
    'w-3-4': 'width: 75%;',
    'w-0': 'width: 0px;',
    'w-px': 'width: 1px;',

    'h-0': 'height: 0px;',
    'h-px': 'height: 1px;',
    'h-full': 'height: 100%;',
    'h-screen': 'height: 100vh;',
    'h-1-2': 'height: 50%;',
    'h-1-3': 'height: 33.333333%;',
    'h-2-3': 'height: 66.666667%;',
    'h-1-4': 'height: 25%;',
    'h-2-4': 'height: 50%;',
    'h-3-4': 'height: 75%;'
}
