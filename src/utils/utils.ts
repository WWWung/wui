import { createElement } from "../dom/domUtils";

export function noop(data?: any) {
    return data;
}

export function wait(time:number) {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, time)
    })
}

export function merge(o1, o2) {
    return Object.assign(o1, o2)
}

let canvas, ctx
export function getRgba(color: string):{
    r:number,
    g:number,
    b:number,
    a:number
} {
    if (!canvas || !ctx) {
        canvas = createElement('<canvas width=1 height=1></canvas>')
        ctx = canvas[0].getContext('2d')
    }
    ctx.beginPath()
    ctx.fillStyle = color
    ctx.fillRect(0,0,1,1)
    const colorData = ctx.getImageData(0, 0, 1, 1).data
    let a = colorData[3] / 255
    a = parseFloat(a.toFixed(2))
    return {
        r: colorData[0],
        g: colorData[1],
        b: colorData[2],
        a
    }
}

export function toInt(value: any) {
    let int = parseInt(value)
    if (isNaN(int)) {
        return 0
    }
    return int
}