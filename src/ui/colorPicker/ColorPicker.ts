import '../../global/global.css';
import './colorPicker.css'
import { noop, merge, getRgba } from '../../utils/utils';
import { $, Dom } from '../../dom/dom';
import { preventDefault, eventPath } from '../../dom/domUtils';
import { hsvToRgb, rgbToHex, rgbToHsv } from './colorUtils';

const defaultOpts = {
    onChange: noop,
    alpha: true,
    value: '#f00'
}

export class ColorPicker {
    private $panel: Dom
    private $el: Dom
    private $icon: Dom
    private hex: string
    private $rInput: Dom
    private $gInput: Dom
    private $bInput: Dom
    private $aInput: Dom
    private $hexInput: Dom
    private $preview: Dom
    private $hPanel: Dom
    private $hCursor: Dom
    private $hsvPanel: Dom
    private $hsvCursor: Dom
    private $alphaPanel: Dom
    private $alphaCursor: Dom
    private panelWidth: number
    private panelHeight: number
    private rgba: {
        r: number,
        g: number,
        b: number,
        a: number
    }
    private hsv: {
        h: number,
        s: number,
        v: number
    }
    private option: {
        el: HTMLElement|Element|string,
        onChange: (string) => void,
        alpha: boolean,
        value: string
    }
    constructor(opts:{
        el: HTMLElement|Element|string,
        onChange: (string) => void,
        alpha: boolean,
        value: string
    }) {
        this.option = merge(defaultOpts, opts)
        this.panelWidth = 200
        this.panelHeight = 150
        this.$el = $(opts.el)
        const {
            value,
            alpha
        } = this.option
        const {
            r,
            g,
            b,
            a
        } = getRgba(value)
        this.option.value = `rgba(${r},${g},${b},${alpha ? a : 1})`
        this.createIcon()
    }
    
    public setValue(color: string) {
        let {
            r,
            g,
            b,
            a
        } = getRgba(color)
        const {
            alpha
        } = this.option
        if (!alpha) {
            a = 1
        }
        // this.rgba = { r, g, b, a }
        this.setRgba({ r, g, b, a })
        const {
            h,
            s,
            v
        } = rgbToHsv(r, g, b)
        this.setHsv({ h, s, v })
        const hex = rgbToHex(r, g, b)
        this.setHex(hex)
        this.setHcPos(h)
        this.setHsvcPos(s, v)
        this.setAlphacPos(a)
    }

    public getValue() {
        const {
            r,
            g,
            b,
            a
        } = this.rgba
        return `rgba(${r},${g},${b},${a})`
    }

    public getHex() {
        return `#${this.hex}`
    }

    private destroy() {
        
    }

    private setHsv({ h, s, v }) {
        this.hsv = { h, s, v }
    }

    private setHex(hex: string) {
        this.$hexInput.val(hex)
        this.hex = hex
    }

    private setRgba({ 
        r = this.rgba.r, 
        g = this.rgba.g, 
        b = this.rgba.b, 
        a = this.rgba.a 
    }) {
        this.rgba = { r, g, b, a }
        this.$rInput.val(r)
        this.$gInput.val(g)
        this.$bInput.val(b)
        this.$aInput.val(a)
        this.$alphaPanel.css('background', `linear-gradient(to right, rgba(${r},${g},${b}, 0) 0%, rgb(${r},${g},${b}) 100%)`)
        this.$preview.css('backgroundColor', `rgba(${r},${g},${b},${a})`)
    }

    private setHcPos(h: number) {
        const {
            panelWidth
        } = this
        const half = 2
        const x = h * panelWidth - half
        this.$hCursor.css('left', `${x}px`)
        const { r, g, b } = hsvToRgb(h, 1, 1)
        this.$hsvPanel.css('background', `rgb(${r},${g},${b})`)
    }

    private setAlphacPos(a) {
        const {
            panelWidth
        } = this
        const half = 2
        const x = a * panelWidth - half
        this.$alphaCursor.css('left', `${x}px`)
        this.setRgba({ a })
    }

    private setHsvcPos(s: number, v: number) {
        const {
            panelWidth,
            panelHeight
        } = this
        const half = 6
        const x = s * panelWidth - half
        const y = (1 - v) * panelHeight - half
        this.$hsvCursor.css('left', `${x}px`)
        this.$hsvCursor.css('top', `${y}px`)
    }

    private createIcon() {
        this.$el.css('display', 'none')
        const icon = this.$icon = $(`
        <div class="ew-cp-trigger" style="width: 28px; height: 28px">
            <span class="ew-cp-alpha-bg">
                <span class="ew-cp-color-bg" style="background-color:${this.option.value}">
                    <i class='ew-cp-color-icon'>
                        <svg t="1569127389612" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1109" width="20" height="20"><path d="M512.726547 675.318646c-8.063653 0-15.790638-3.245927-21.435195-9.006118L231.175103 400.906809c-11.603269-11.837606-11.410887-30.840402 0.427742-42.442648 11.837606-11.601222 30.841426-11.410887 42.442648 0.427742l238.681054 243.534596L751.407602 358.891903c11.601222-11.839653 30.602995-12.033058 42.442648-0.427742 11.839653 11.603269 12.031011 30.605042 0.427742 42.442648L534.161742 666.312528C528.517185 672.072719 520.791224 675.318646 512.726547 675.318646z" p-id="1110" fill="#fff"></path></svg>
                    </i>
                </span>
            </span>
        </div>`
        )
        icon.on('click', this.show, this)
        icon.after(this.$el)
    }

    private show() {
        if (!this.$panel) {
            this.createPanel()
        }
        this.adjustPotion()
        this.$panel.append($(document.body))

        const handler = (e: MouseEvent) => {
            const path = eventPath(e)
            for (let i = 0; i < path.length; i++) {
                const el = path[i]
                if (el.classList &&
                    el.classList.contains('ew-cp-panel')) {
                    return
                }
            }
            window.removeEventListener('mousedown', handler)
            this.$panel.remove()
        }
        window.addEventListener('mousedown', handler)
    }

    private adjustPotion() {
        const {
            width,
            height
        } = this.$panel.getRect()
        const rect = this.$icon.getRect()
        const {
            availHeight,
            availWidth
        } = window.screen
        let x = rect.left + rect.width / 2 - width / 2
        if (x + width > availWidth) {
            x = availWidth - width
        }
        if (x < 0) {
            x = 0
        }
        let y = rect.top + 20
        if (y + height > availHeight) {
            y = availHeight - height
        }
        if (y < 0) {
            y = 0
        }
        this.$panel.css('left', `${x}px`)
        this.$panel.css('top', `${y}px`)
    }
    
    private createPanel() {
        const wrap = this.$panel = $(`<div class="ew-cp-panel"></div>`)
        if (this.option.alpha) {
            wrap.addClass('ew-cp-rgba')
        }
        const hsvPanel = this.createHsvPanel()
        const hPanel = this.createHPanel()
        const alphaPanel = this.createAlphaPanel()
        const inputPanel = this.createInputPanel()
        hsvPanel.append(wrap)
        hPanel.append(wrap)
        alphaPanel.append(wrap)
        inputPanel.append(wrap)
        this.setValue(this.option.value)
    }

    private createHPanel(): Dom {
        const hPanel = this.$hPanel = $(`<div class="ew-hp"></div>`)
        const hCursor = this.$hCursor = $(`<span class="ew-hpc"></span>`)
        hCursor.append(hPanel)

        function dragHc(e: MouseEvent) {
            preventDefault(e)
            const {
                left,
                width
            } = hPanel.getRect()
            const half = 2
            let x = e.pageX - left - half
            if (x < -half) {
                x = -half
            }
            if (x > width - half) {
                x = width - half
            }
            const hsv = this.hsv
            const h = hsv.h = (x + half) / width
            const rgb = hsvToRgb(h, 1, 1)
            const color = `rgb(${rgb.r},${rgb.g},${rgb.b})`
            this.$hsvPanel.css('backgroundColor', color)
            hCursor.css('left', `${x}px`)
    
            const { r, g, b } = hsvToRgb(h, hsv.s, hsv.v)
            this.setRgba({ r, g, b })
            const hex = rgbToHex(r, g, b)
            this.setHex(hex)
        }
        const handler = dragHc.bind(this)
        function off() {
            window.removeEventListener('mousemove', handler)
            window.removeEventListener('mouseup', off)
            window.removeEventListener('mouseleave', off)
        }
        hPanel.on('mousedown', function (e: MouseEvent) {
            handler(e)
            window.addEventListener('mousemove', handler)
            window.addEventListener('mouseup', off)
            window.addEventListener('mouseleave', off)
        }, this)

        return hPanel
    }

    private createAlphaPanel(): Dom {
        const alphaPanel = $(`<div class="ew-alpha"><div class="ew-alpha-bg"></div></div>`)
        const alphaCursor = this.$alphaCursor = $(`<span class="ew-alphac"></span>`)
        this.$alphaPanel = alphaPanel.find('.ew-alpha-bg')
        alphaCursor.append(alphaPanel)

        function dragHc(e: MouseEvent) {
            preventDefault(e)
            const {
                left,
                width
            } = alphaPanel.getRect()
            const half = 2
            let x = e.pageX - left - half
            if (x < -half) {
                x = -half
            }
            if (x > width - half) {
                x = width - half
            }
            alphaCursor.css('left', `${x}px`)
            const rgba = this.rgba
            let a = rgba.a = (x + half) / width
            a = parseFloat(a.toFixed(2))
            this.$aInput.val(a)
            this.rgba = merge(this.rgba, { a })
            const {
                r,
                g,
                b
            } = this.rgba
            this.$preview.css('backgroundColor', `rgba(${r},${g},${b},${a})`)
        }
        const handler = dragHc.bind(this)
        function off() {
            window.removeEventListener('mousemove', handler)
            window.removeEventListener('mouseup', off)
            window.removeEventListener('mouseleave', off)
        }
        alphaPanel.on('mousedown', function (e:MouseEvent) {
            handler(e)
            window.addEventListener('mousemove', handler)
            window.addEventListener('mouseup', off)
            window.addEventListener('mouseleave', off)
        }, this)

        return alphaPanel
    }

    private createHsvPanel():Dom {
        const hsvPanel = this.$hsvPanel = $(`
        <div style="width: ${this.panelWidth}px; height:${this.panelHeight}px" class="ew-hsvp"><div class="ew-hsvp-m2"></div><div class="ew-hsvp-m1"></div></div>`)
        const hsvCusor = this.$hsvCursor = $(`<span class="ew-hsvc"></span>`)
        hsvCusor.append(hsvPanel)
        function dragHsvc(e:MouseEvent) {
            preventDefault(e)
            const {
                top,
                left,
                width,
                height
            } = hsvPanel.getRect()
            const half = 6
            let x = e.pageX - left - half
            let y = e.pageY - top - half
            if (x < -half) {
                x = -half
            }
            if (x > width - half) {
                x = width - half
            }
            if (y < -half) {
                y = -half
            }
            if (y > height - half) {
                y = height - half
            }
            const timer = setTimeout(() => {
                clearTimeout(timer)
                hsvCusor.css('top', `${y}px`)
                hsvCusor.css('left', `${x}px`)
    
                const s = this.hsv.s = (x + half) / width
                const v = this.hsv.v = 1 - (y + half) / height
                const {
                    r,
                    g,
                    b
                } = hsvToRgb(this.hsv.h, s, v)
                this.setRgba({ r, g, b })
    
                const hex = rgbToHex(r, g, b)
                this.setHex(hex)
    
    
            }, 10)
        }
        const handler = dragHsvc.bind(this)
        function off() {
            window.removeEventListener('mousemove', handler)
            window.removeEventListener('mouseup', off)
            window.removeEventListener('mouseleave', off)
        }
        hsvPanel.on('mousedown', function (e:MouseEvent) {
            handler(e)
            window.addEventListener('mousemove', handler)
            window.addEventListener('mouseup', off)
            window.addEventListener('mouseleave', off)
        }, this)
        return hsvPanel
    }

    private createInputPanel():Dom {
        const wrap = $(`<div class="ew-cip"></div>`)
        const row1 = $(`
        <div class="ew-cip-row1 ew-cip-row">
            <div class="ew-cip-row-sub">R:<input value=255 class="ew-cip-i-r ew-cip-i"></div>
            <div class="ew-cip-row-sub">G:<input value=0 class="ew-cip-i-g ew-cip-i"></div>
            <div class="ew-cip-row-sub">B:<input value=0 class="ew-cip-i-b ew-cip-i"></div>
            <div class="ew-cip-row-sub">A:<input value=0 class="ew-cip-i-a ew-cip-i"></div>
        </div>`)
        row1.append(wrap)
        this.$rInput = row1.find('.ew-cip-i-r')
        this.$gInput = row1.find('.ew-cip-i-g')
        this.$bInput = row1.find('.ew-cip-i-b')
        this.$aInput = row1.find('.ew-cip-i-a')
    
        const row2 = $(`
        <div class="ew-cip-row2 ew-cip-row">
            <div class="ew-cip-row-sub">
                HEX:#<input value="FF0000" maxlength=6 class="ew-cip-hex-input">
            </div>
            <div class="ew-cip-row-sub ew-cip-pre">
                <div class="ew-cip-pre-bg"></div>
            </div>
            <button class="ew-cp-row-save">确定</button>
        </div>`)
        row2.append(wrap)
        this.$hexInput = row2.find('.ew-cip-hex-input')
        this.$preview = row2.find('.ew-cip-pre-bg')
        return wrap
    }
}