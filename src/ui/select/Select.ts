import '../../global/global.css';
import './select.css'

import { Dom, $ } from "../../dom/dom";

export class Select {
    private elem: Dom;
    dom: Dom;
    placeholder: string;
    options: Array<{
        label: string,
        value: string
    }>;
    constructor(option: {
        //  选择器
        elem: string,
        //  占位符
        placeholder?: string
    }) {
        this.options = [];
        const {
            elem,
            placeholder = '请选择'
        } = option
        this.placeholder = placeholder;
        this.elem = $(elem);
        this.elem.css('display', 'none');
        this.render();
    }

    /**
     * render
     */
    public render() {
        let ulHtml = `<ul class='wui-select-body'>`;
        const children = this.elem.children();
        for (let i = 0; i < children.length; i++) {
            const option = $(children[i]);
            const value = option.attr('value');
            const label = option.text();
            this.options.push({
                value: <string>value,
                label: <string>label
            })
            ulHtml += `
                <li class='wui-select-item'>${label}</li>
            `
        }
        ulHtml += '</ul>';
        this.dom = $(ulHtml);
        // this.dom.after(this.elem);
        const titleHtml = `<div class='wui-select-title'>
                <input type='text' readonly='readonly' autocompolete='off' placeholder='${this.placeholder}' class='wui-select-input' >
            </div>
        `
        const title = $(titleHtml);
        title.after(this.elem);
    }
}
