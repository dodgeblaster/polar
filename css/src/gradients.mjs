import { colors } from './_colors.mjs'

const grandientStops = Object.keys(colors).reduce((a, x) => {
    if (x !== 'transparent') {
        a[`from-${x}`] = `
            --s-gradient-from: rgb(${colors[x]});
            --s-gradient-to: rgb(248 113 113 / 0);
            --s-gradient-stops: var(--s-gradient-from), var(--s-gradient-to);
        `
        a[`to-${x}`] = `
            --s-gradient-to:  rgb(${colors[x]});
        `
    } else {
        a[`from-${x}`] = `
            --s-gradient-from: transaprent;
            --s-gradient-to: rgb(248 113 113 / 0);
            --s-gradient-stops: var(--s-gradient-from), var(--s-gradient-to);
        `
        a[`to-${x}`] = `
            --s-gradient-to:  transparent;
        `
    }

    return a
}, {})

export const gradients = {
    ...grandientStops,
    'bg-gradient-to-r': `background-image: linear-gradient(to right, var(--s-gradient-stops));`,
    'bg-gradient-to-t': `background-image: linear-gradient(to top, var(--s-gradient-stops));`,
    'bg-gradient-to-tr': `background-image: linear-gradient(to top right, var(--s-gradient-stops));`,
    'bg-gradient-to-tl': `background-image: linear-gradient(to top left, var(--s-gradient-stops));`,
    'bg-gradient-to-l': `background-image: linear-gradient(to left, var(--s-gradient-stops));`,
    'bg-gradient-to-b': `background-image: linear-gradient(to bottom, var(--s-gradient-stops));`,
    'bg-gradient-to-bl': `background-image: linear-gradient(to bottom left, var(--s-gradient-stops));`,
    'bg-gradient-to-br': `background-image: linear-gradient(to bottom right,var(--s-gradient-stops));`
}

/* 

.bg-gradient-to-r {
    background-image: linear-gradient(to right, var(--gj-gradient-stops));
}
.bg-gradient-to-t {
    background-image: linear-gradient(to top, var(--gj-gradient-stops));
}
.bg-gradient-to-tr {
    background-image: linear-gradient(to top right, var(--gj-gradient-stops));
}
.bg-gradient-to-tl {
    background-image: linear-gradient(to top left, var(--gj-gradient-stops));
}
.bg-gradient-to-l {
    background-image: linear-gradient(to left, var(--gj-gradient-stops));
}
.bg-gradient-to-b {
    background-image: linear-gradient(to bottom, var(--gj-gradient-stops));
}
.bg-gradient-to-bl {
    background-image: linear-gradient(to bottom left, var(--gj-gradient-stops));
}
.bg-gradient-to-br {
    background-image: linear-gradient(
        to bottom right,
        var(--gj-gradient-stops)
    );
}


.from-fuchsia-400 {
    --gj-gradient-from: #e879f9;
    --gj-gradient-to: rgb(248 113 113 / 0);
    --gj-gradient-stops: var(--gj-gradient-from), var(--gj-gradient-to);
}


.to-fuchsia-50 {
    --gj-gradient-to: #fdf4ff;
}

*/
