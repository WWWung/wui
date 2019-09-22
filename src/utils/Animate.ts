import { noop } from "./utils";

const requestAnimate = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        function (callback) {
            setTimeout(callback, 1000 / 60);
        }
})()


export class Animate {
    now:number
    step:number
    constructor(option: {
        to?: number,
        from?: number,
        during?: number,
        onUpdate?: (value: number) => void,
        onDone?: (value: number) => void,
        onPlay?: (value: number) => void
    }) {
        this.init(option);
    }

    private init(option: {
        to?: number,
        from?: number,
        during?: number,
        onUpdate?: (value?: number) => void,
        onDone?: (value?: number) => void,
        onPlay?: (value?: number) => void
    }) {
        const {
            to = 1,
            from = 0,
            during = 1000,
            onUpdate = noop,
            onDone = noop,
            onPlay = noop
        } = option;
        const count = during / (1000 / 60)
        const step = (to - from) / count;
        let now = from;
        const cb = () => {
            if (now > to) {
                onDone();
                return;
            }
            onUpdate(now);
            now += step;
            requestAnimate(cb);
        }
        onPlay();
        requestAnimate(cb);
    }

}