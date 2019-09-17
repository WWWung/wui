function createElement(html) {
    var wrap = document.createElement('div');
    wrap.innerHTML = html;
    return wrap.children;
}
//# sourceMappingURL=domUtils.js.map

var Dom = /** @class */ (function () {
    function Dom(element) {
        if (element instanceof Dom) {
            return element;
        }
        var nodes;
        if (typeof element === 'string') {
            var reg = /^</;
            if (reg.test(element)) {
                nodes = createElement(element);
            }
            else {
                nodes = document.getElementsByClassName(element);
            }
        }
        if (element instanceof HTMLCollection) {
            nodes = element;
        }
        if (element instanceof Element) {
            this.nodes.push(element);
            return;
        }
        for (var i = 0; i < nodes.length; i++) {
            this.nodes.push(nodes[i]);
        }
    }
    /**
     * get
     */
    Dom.prototype.get = function (i) {
        return this.nodes[i];
    };
    /**
     * on
     */
    Dom.prototype.on = function (type, callback) {
        // const { nodes } = this;
        // for (let i = 0; i < nodes.length; i++) {
        //     const node = nodes[i];
        //     node.addEventListener(type, callback)
        // }
        this.each(function (node) {
            node.addEventListener(type, callback);
        });
        return this;
    };
    Dom.prototype.off = function (type, callback) {
        this.each(function (node) {
            node.removeEventListener(type, callback);
        });
        return this;
    };
    /**
     * each
     */
    Dom.prototype.each = function (callback) {
        var nodes = this.nodes;
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            callback(node, i);
        }
        return this;
    };
    Dom.prototype.children = function () {
        if (this.nodes.length) {
            var node = this.get(0);
            return node.children;
        }
        var div = document.createElement('div');
        return div.children;
    };
    Dom.prototype.attr = function (name, value) {
        if (arguments.length === 2) {
            return this.each(function (node) {
                node.setAttribute(name, "" + value);
            });
        }
        if (this.nodes.length) {
            return this.get(0).getAttribute(name);
        }
        return '';
    };
    Dom.prototype.text = function (text) {
        if (arguments.length === 1) {
            return this.each(function (node) {
                node.innerHTML = text;
            });
        }
        return this.nodes.length ?
            this.get(0).innerHTML :
            '';
    };
    Dom.prototype.append = function (parent) {
        var p = parent.get(0);
        return this.each(function (node) {
            p.appendChild(node);
        });
    };
    Dom.prototype.remove = function () {
        return this.each(function (node) {
            var parent = node.parentNode;
            parent.removeChild(node);
        });
    };
    Dom.prototype.css = function (name, value) {
        if (arguments.length === 2) {
            return this.each(function (node) {
                if (node instanceof HTMLElement) {
                    node.style[name] = value;
                }
            });
        }
        if (this.nodes.length) {
            var htmlEles = this.filter(function (node) { return node instanceof HTMLElement; });
            var first = htmlEles[0];
            return first.style[name];
        }
        return '';
    };
    Dom.prototype.filter = function (callback) {
        return Array.prototype.filter.call(this.nodes, callback);
    };
    return Dom;
}());
function $(element) {
    return new Dom(element);
}
//# sourceMappingURL=dom.js.map

var Select = /** @class */ (function () {
    function Select(option) {
        var elem = option.elem, placeholder = option.placeholder;
        this.placeholder = placeholder;
        this.elem = $(elem);
        this.elem.css('display', 'none');
        this.render();
    }
    /**
     * render
     */
    Select.prototype.render = function () {
        var html = "<ul class='wui-select-body'>";
        var children = this.elem.children();
        for (var i = 0; i < children.length; i++) {
            var option = $(children[i]);
            var value = option.attr('value');
            var label = option.text();
            this.options.push({
                value: value,
                label: label
            });
            html += "\n                <li class='wui-select-item'>" + label + "</li>\n            ";
        }
        html += '</ul>';
        this.dom = $(html);
        this.dom.append(this.elem);
    };
    return Select;
}());
//# sourceMappingURL=Select.js.map

function select(option) {
    return new Select(option);
}
var index = {
    select: select
};

export default index;
export { select };
//# sourceMappingURL=bundle.js.map
