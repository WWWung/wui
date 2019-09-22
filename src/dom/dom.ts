import { createElement } from "./domUtils";

export class Dom {
    ele: HTMLElement
    nodes: Array<HTMLElement | Element>
    constructor(element: string
        | HTMLElement
        | Element
        | Dom
        | HTMLCollection
        | NodeList) {
        this.nodes = [];
        if (element instanceof Dom) {
            return element;
        }
        var nodes: HTMLCollection;
        if (typeof element === 'string') {
            element = element.trim();
            const reg: RegExp = /^</;
            if (reg.test(element)) {
                nodes = createElement(element);
            } else {
                const nodeList = document.querySelectorAll(element);
                for (let i = 0; i < nodeList.length; i++) {
                    const node = nodeList[i];
                    if (node instanceof HTMLElement || node instanceof Element) {
                        this.nodes.push(node);
                    }
                }
                return;
            }
        }
        if (element instanceof NodeList) {
            for (let i = 0; i < element.length; i++) {
                const node = element[i];
                if (node instanceof HTMLElement || node instanceof Element) {
                    this.nodes.push(node);
                }
            }
            return;
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

    public length(): number {
        return this.nodes.length
    }
    
    public parent():Dom {
        return this.length() > 0 ?
        new Dom(this.get(0).parentElement) :
        null
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

    public val(value?: string): string | Dom {
        if (arguments.length === 1) {
            return this.each(node => {
                if (node instanceof HTMLInputElement) {
                    node.value = value;
                }
            })
        }
        const node = this.filter(node => node instanceof HTMLInputElement)[0];
        return (<HTMLInputElement>node).value;
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
        if (!p) {
            return this;
        }
        return this.each(node => {
            p.appendChild(node);
        })
    }

    public after(prev: Dom): Dom {
        const nextNode = prev.next();
        const node = this.get(0);
        if (nextNode) {
            const parent = prev.parent();
            const parentNode = parent.get(0);
            parentNode.insertBefore(node, nextNode.get(0));
        } else {
            const parent = prev.parent();
            this.append(parent);
        }
        return this
    }

    public before(next: Dom):Dom {
        const parent = next.parent().get(0);
        parent.insertBefore(this.get(0), parent);
        return this;
    }

    public next(): Dom {
        const node = this.get(0);
        if (node) {
            const next = node.nextElementSibling;
            return next ? new Dom(next) : null;
        }
    }

    public prev(): Dom {
        const node = this.get(0);
        if (node) {
            const prev = node.previousElementSibling;
            return prev ? new Dom(prev) : null;
        }
    }

    public remove(): Dom {
        return this.each(node => {
            const parent = node.parentNode;
            parent.removeChild(node);
        })
    }

    public addClass(cls:string):Dom {
        return this.each(node => {
            node.classList.add(cls);
        })
    }

    public removeClass(cls:string):Dom{
        return this.each(node => {
            node.classList.remove(cls);
        })
    }

    public hasClass(cls:string):boolean{
        for (let i = 0; i < this.nodes.length; i++) {
            const node = this.nodes[i];
            if (!node.classList.contains(cls)) {
                return false;
            }
        }
        return true;
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

    public index(dom: Dom):number {
        const node = dom.get(0);
        return this.nodes.indexOf(node);
    }

    public find(selector:string): Dom{
        const node = this.get(0);
        const nodelist = node.querySelectorAll(selector);
        return new Dom(nodelist);
    }

    public getRect(): {
        top: number,
        left: number,
        bottom: number,
        right: number,
        width: number,
        height: number
    } {
        const node = this.get(0);
        const {
            top,
            left,
            bottom,
            right,
            width,
            height
        } = node.getBoundingClientRect();
        return {
            top,
            left,
            bottom,
            right,
            width,
            height
        }
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