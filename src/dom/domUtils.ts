export function createElement(html: string) : HTMLCollection {
    const wrap:HTMLElement = document.createElement('div');
    wrap.innerHTML = html;
    return wrap.children
}

export function preventDefault(event: Event) {
    if (event.preventDefault) {
        event.preventDefault();
    } else {
        event.returnValue = false;
    }
}

/**
 * 根据事件参数获取冒泡的所有元素
 * @param {Event} e 
 */
export function eventPath(e: Event):Array<Element> {

    /**
     * ie11 , edge
     */
    const {
        target
    } = e
    return [<Element>target].concat(getParents(<Element>target), []);
}

/**
 * 找到某个元素的所有祖先元素
 * @param {HTMLElement} target 
 * @param {null|Array} cache 
 */
export function getParents(target, cache?:Array<Element>):Array<Element> {
    const parents = cache || [];
    const {
        parentNode
    } = target;
    if (parentNode) {
        return getParents(parentNode, parents.concat([parentNode]));
    }
    return parents;
}