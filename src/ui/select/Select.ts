import '../../global/global.css';
import './select.css'

import { Dom, $ } from "../../dom/dom";
import { noop } from '../../utils/utils';

export class Select {
    private elem: Dom;
    list: Dom;
    title: Dom;
    placeholder: string;
    timer;
    selectValue: string
    options: Array<{
        label: string,
        value: string
    }>;
    onChange: (Object) => void;
    constructor(option: {
        //  选择器
        elem: string,
        //  占位符
        placeholder?: string,
        onChange?: (Object) => void
    }) {
        this.options = [];
        const {
            elem,
            placeholder = '请选择',
            onChange = noop
        } = option
        this.placeholder = placeholder;
        this.onChange = onChange;
        this.elem = $(elem);
        this.elem.css('display', 'none');
        this.render();
    }

    /**
     * render
     */
    private render() {
        let ulHtml = `<div class='wui-select-body'><div class='wui-scroll-y'><ul class='wui-select-list'>`;
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
        ulHtml += '</ul></div></div>';
        const list = this.list = $(ulHtml);
        list.on('click', e => {
            const { target } = e;
            if (target instanceof Element) {
                const items = list.find('.wui-select-item');
                const index = items.index($(target));
                this.select(index);
            }
        })
        // this.list.after(this.elem);
        const titleHtml = `
            <div class='wui-select-title'>
                <input type='text' readonly='readonly' autocompolete='off' placeholder='${this.placeholder}' class='wui-select-input' >
                <i class='wui-select-input-icon'>
                <svg t="1569127389612" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1109" width="20" height="20"><path d="M512.726547 675.318646c-8.063653 0-15.790638-3.245927-21.435195-9.006118L231.175103 400.906809c-11.603269-11.837606-11.410887-30.840402 0.427742-42.442648 11.837606-11.601222 30.841426-11.410887 42.442648 0.427742l238.681054 243.534596L751.407602 358.891903c11.601222-11.839653 30.602995-12.033058 42.442648-0.427742 11.839653 11.603269 12.031011 30.605042 0.427742 42.442648L534.161742 666.312528C528.517185 672.072719 520.791224 675.318646 512.726547 675.318646z" p-id="1110" fill="#707070"></path></svg>
                </i>
            </div>
        `
        const title = this.title = $(titleHtml);
        title.on('click', e => {
            if (e.stopPropagation) {
                e.stopPropagation();
            } else {
                e.cancelBubble = true;
            }
            this.toggleStatus(title);
        })
        title.after(this.elem);
    }

    private toggleStatus(title:Dom) {
        const isFocus = title.hasClass('wui-select-focus');
        if (isFocus) {
            this.hide(title);
        } else {
            this.show(title);
        }
    }

    private show(title:Dom) {
        title.addClass('wui-select-focus');
        const {
            left,
            top,
            height
        } = title.getRect();
        const body = $(document.body);
        const { list } = this;
        list.css('top', `${top + height + 12}px`);
        list.css('left', `${left}px`);
        list.append(body);
        list.removeClass('zoom-out-y');
        list.addClass('zoom-in-y');
        const cb = () => {
            window.removeEventListener('click', cb);
            this.hide(title);
        }
        window.addEventListener('click', cb);
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            list.removeClass('zoom-in-y');
        }, 200);
        // await wait(200);
        // list.removeClass('zoom-in-y');
    }

    private hide(title:Dom) {
        title.removeClass('wui-select-focus');
        const { list } = this;
        list.removeClass('zoom-in-y');
        list.addClass('zoom-out-y');
        // await wait(200);
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.list.remove();
            list.removeClass('zoom-out-y');
        }, 200)
    }

    private select(index:number) {
        const seleted = this.options[index];
        const value = this.selectValue = seleted.value;
        const input = this.title.find('.wui-select-input');
        input.val(value);
        this.onChange(seleted);
    }

    public getValue():string {
        return this.selectValue;
    }

    public setValue(value: string) {
        
    }
}
