import { createElement } from "./domUtils";

export class Dom {
    ele: HTMLElement
    nodes: Array<HTMLElement | Element>
    constructor(element: string
        | HTMLElement
        | Element
        | Dom
        | HTMLCollection) {
        if (element instanceof Dom) {
            return element;
        }
        var nodes: HTMLCollection;
        if (typeof element === 'string') {
            const reg: RegExp = /^</;
            if (reg.test(element)) {
                nodes = createElement(element);
            } else {
                nodes = document.getElementsByClassName(element);
            }
        }
        if (element instanceof HTMLCollection) {
            nodes = element
        }
        if (element instanceof Element) {
            this.nodes.push(element);
            return;
        }
        for (let i = 0; i < nodes.length; i++) {
            this.nodes.push(nodes[i])
        }
    }

    /**
     * get
     */
    public get(i: number): HTMLElement | Element {
        return this.nodes[i];
    }

    /**
     * on
     */
    public on(type: string, callback: EventListener): Dom {
        // const { nodes } = this;
        // for (let i = 0; i < nodes.length; i++) {
        //     const node = nodes[i];
        //     node.addEventListener(type, callback)
        // }
        this.each(node => {
            node.addEventListener(type, callback);
        })
        return this
    }

    public off(type: string, callback: EventListener): Dom {
        this.each(node => {
            node.removeEventListener(type, callback);
        })
        return this;
    }

    /**
     * each
     */
    public each(callback: (node: HTMLElement | Element, i?: number) => void): Dom {
        const { nodes } = this;
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            callback(node, i);
        }
        return this;
    }

    public children(): HTMLCollection {
        if (this.nodes.length) {
            const node = this.get(0);
            return node.children;
        }
        const div = document.createElement('div');
        return div.children;
    }

    public attr(name: string, value?: string | number): string | Dom {
        if (arguments.length === 2) {
            return this.each(node => {
                node.setAttribute(name, `${value}`);
            })
        }
        if (this.nodes.length) {
            return this.get(0).getAttribute(name);
        }
        return '';
    }

    public text(text?: string): string | Dom {
        if (arguments.length === 1) {
            return this.each(node => {
                node.innerHTML = text;
            })
        }
        return this.nodes.length ?
            this.get(0).innerHTML :
            '';
    }

    public append(parent: Dom): Dom {
        const p = parent.get(0);
        return this.each(node => {
            p.appendChild(node);
        })
    }

    public remove(): Dom {
        return this.each(node => {
            const parent = node.parentNode;
            parent.removeChild(node);
        })
    }

    public css(name:string, value?:string):Dom|string {
        if (arguments.length === 2) {
            return this.each(node => {
                if (node instanceof HTMLElement) {
                    node.style[name] = value;
                }
            })
        }
        if (this.nodes.length) {
            const htmlEles = this.filter(node => node instanceof HTMLElement);
            const first = htmlEles[0];
            return (<HTMLElement>first).style[name];
        }
        return '';
    }

    private filter(callback: (node:HTMLElement|Element) => boolean) : HTMLCollection {
        return Array.prototype.filter.call(this.nodes, callback);
    }
}

export function $(element: string
    | HTMLElement
    | Element
    | Dom
    | HTMLCollection): Dom {
    return new Dom(element)
}