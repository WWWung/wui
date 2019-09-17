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
        const {
            elem,
            placeholder
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
        let html = `<ul class='wui-select-body'>`;
        const children = this.elem.children();
        for (let i = 0; i < children.length; i++) {
            const option = $(children[i]);
            const value = option.attr('value');
            const label = option.text();
            this.options.push({
                value: <string>value,
                label: <string>label
            })
            html += `
                <li class='wui-select-item'>${label}</li>
            `
        }
        html += '</ul>';
        this.dom = $(html);
        this.dom.append(this.elem);
    }
}
