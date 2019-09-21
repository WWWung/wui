function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css = "body {\r\n    margin: 0;\r\n}\r\n\r\nul, ol, li {\r\n    margin: 0;\r\n    list-style: none;\r\n    padding: 0;\r\n}\r\n\r\ninput, textarea {\r\n    margin: 0;\r\n    padding: 0;\r\n    border: none;\r\n    outline: none;\r\n}";
styleInject(css);

var css$1 = ".wui-select-input {\r\n    padding: 0 20px;\r\n    height: 40px;\r\n    line-height: 40px;\r\n    width: 100%;\r\n    box-sizing: border-box;\r\n    border: 1px solid #dcdfe6;\r\n    border-radius: 4px;\r\n    overflow: hidden;\r\n    padding-left: 15px;\r\n    padding-right: 30px;\r\n    cursor: pointer;\r\n    position: relative;\r\n}\r\n\r\n.wui-select-input::before {\r\n    position: absolute;\r\n    content: \"1\";\r\n    width: 14px;\r\n    height: 14px;\r\n    background-color: #eee;\r\n    top: 0;\r\n    left: 0;\r\n}\r\n\r\n.wui-select-input:focus {\r\n    outline: none;\r\n    border-color: #409eff;\r\n}";
styleInject(css$1);

function createElement(html) {
    var wrap = document.createElement('div');
    wrap.innerHTML = html;
    return wrap.children;
}
//# sourceMappingURL=domUtils.js.map

var Dom = /** @class */ (function () {
    function Dom(element) {
        this.nodes = [];
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
                var nodeList = document.querySelectorAll(element);
                for (var i = 0; i < nodeList.length; i++) {
                    var node = nodeList[i];
                    if (node instanceof HTMLElement || node instanceof Element) {
                        this.nodes.push(node);
                    }
                }
                return;
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
    Dom.prototype.length = function () {
        return this.nodes.length;
    };
    Dom.prototype.parent = function () {
        return this.length() > 0 ?
            new Dom(this.get(0).parentElement) :
            null;
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
        if (!p) {
            return this;
        }
        return this.each(function (node) {
            p.appendChild(node);
        });
    };
    Dom.prototype.after = function (prev) {
        var nextNode = prev.next();
        var node = this.get(0);
        if (nextNode) {
            var parent = prev.parent();
            var parentNode = parent.get(0);
            parentNode.insertBefore(node, nextNode.get(0));
        }
        else {
            var parent = prev.parent();
            this.append(parent);
        }
        return this;
    };
    Dom.prototype.before = function (next) {
        var parent = next.parent().get(0);
        parent.insertBefore(this.get(0), parent);
        return this;
    };
    Dom.prototype.next = function () {
        var node = this.get(0);
        if (node) {
            var next = node.nextElementSibling;
            return next ? new Dom(next) : null;
        }
    };
    Dom.prototype.prev = function () {
        var node = this.get(0);
        if (node) {
            var prev = node.previousElementSibling;
            return prev ? new Dom(prev) : null;
        }
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
        this.options = [];
        var elem = option.elem, _a = option.placeholder, placeholder = _a === void 0 ? '请选择' : _a;
        this.placeholder = placeholder;
        this.elem = $(elem);
        this.elem.css('display', 'none');
        this.render();
    }
    /**
     * render
     */
    Select.prototype.render = function () {
        var ulHtml = "<ul class='wui-select-body'>";
        var children = this.elem.children();
        for (var i = 0; i < children.length; i++) {
            var option = $(children[i]);
            var value = option.attr('value');
            var label = option.text();
            this.options.push({
                value: value,
                label: label
            });
            ulHtml += "\n                <li class='wui-select-item'>" + label + "</li>\n            ";
        }
        ulHtml += '</ul>';
        this.dom = $(ulHtml);
        // this.dom.after(this.elem);
        var titleHtml = "<div class='wui-select-title'>\n                <input type='text' readonly='readonly' autocompolete='off' placeholder='" + this.placeholder + "' class='wui-select-input' >\n            </div>\n        ";
        var title = $(titleHtml);
        title.after(this.elem);
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
//# sourceMappingURL=index.js.map

export default index;
export { select };
//# sourceMappingURL=bundle.js.map
