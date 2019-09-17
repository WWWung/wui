export function createElement(html: string) : HTMLCollection {
    const wrap:HTMLElement = document.createElement('div');
    wrap.innerHTML = html;
    return wrap.children
}
