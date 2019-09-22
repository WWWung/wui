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

var css = "body {\r\n    margin: 0;\r\n}\r\n\r\nul, ol, li {\r\n    margin: 0;\r\n    list-style: none;\r\n    padding: 0;\r\n}\r\n\r\ninput, textarea {\r\n    margin: 0;\r\n    padding: 0;\r\n    border: none;\r\n    outline: none;\r\n}\r\n\r\n.wui-scroll-y {\r\n    height: 100%;\r\n    overflow-y: auto; \r\n}\r\n\r\n@keyframes zoom-in-y {\r\n    0% {\r\n        transform: scaleY(0);\r\n    }\r\n    100% {\r\n        transform: scaleY(1);\r\n    }\r\n}\r\n\r\n.zoom-in-y {\r\n    animation: zoom-in-y .2s;\r\n    transform-origin: 50% 0;\r\n}\r\n\r\n@keyframes zoom-out-y {\r\n    0% {\r\n        transform: scaleY(1);\r\n    }\r\n    100% {\r\n        transform: scaleY(0);\r\n    }\r\n}\r\n\r\n.zoom-out-y {\r\n    animation: zoom-out-y .2s;\r\n    transform-origin: 50% 0;\r\n    animation-fill-mode: forwards;\r\n}";
styleInject(css);

var css$1 = ".wui-select-title {\r\n    position: relative;\r\n}\r\n\r\n.wui-select-input {\r\n    padding: 0 20px;\r\n    height: 40px;\r\n    line-height: 40px;\r\n    width: 100%;\r\n    box-sizing: border-box;\r\n    border: 1px solid #dcdfe6;\r\n    border-radius: 4px;\r\n    overflow: hidden;\r\n    padding-left: 15px;\r\n    padding-right: 30px;\r\n    cursor: pointer;\r\n}\r\n\r\n.wui-select-body {\r\n    position: absolute;\r\n    min-width: 240px;\r\n    max-height: 200px;\r\n    box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);\r\n    background-color: #fff;\r\n    border-radius: 4px;\r\n    box-sizing: border-box;\r\n    overflow: hidden;\r\n    border: 1px solid #e4e7ed;\r\n}\r\n\r\n.wui-select-list {\r\n    padding: 6px 0;\r\n}\r\n\r\n.wui-select-item {\r\n    font-size: 14px;\r\n    padding: 0 20px;\r\n    height: 34px;\r\n    line-height: 34px;\r\n    white-space: nowrap;\r\n    color: #606266;\r\n    cursor: pointer;\r\n}\r\n\r\n.wui-select-item:hover {\r\n    background-color: #f5f7fa;\r\n}\r\n\r\n.wui-select-input-icon {\r\n    position: absolute;\r\n    line-height: 14px;\r\n    width: 20px;\r\n    height: 20px;\r\n    top: 10px;\r\n    right: 5px;\r\n    cursor: pointer;\r\n    transition: .3s;\r\n}\r\n\r\n.wui-select-input:focus {\r\n    outline: none;\r\n    border-color: #409eff;\r\n}\r\n\r\n.wui-select-focus .wui-select-input-icon {\r\n    transform: rotate(180deg);\r\n}";
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
            element = element.trim();
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
        if (element instanceof NodeList) {
            for (var i = 0; i < element.length; i++) {
                var node = element[i];
                if (node instanceof HTMLElement || node instanceof Element) {
                    this.nodes.push(node);
                }
            }
            return;
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
    Dom.prototype.val = function (value) {
        if (arguments.length === 1) {
            return this.each(function (node) {
                if (node instanceof HTMLInputElement) {
                    node.value = value;
                }
            });
        }
        var node = this.filter(function (node) { return node instanceof HTMLInputElement; })[0];
        return node.value;
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
    Dom.prototype.addClass = function (cls) {
        return this.each(function (node) {
            node.classList.add(cls);
        });
    };
    Dom.prototype.removeClass = function (cls) {
        return this.each(function (node) {
            node.classList.remove(cls);
        });
    };
    Dom.prototype.hasClass = function (cls) {
        for (var i = 0; i < this.nodes.length; i++) {
            var node = this.nodes[i];
            if (!node.classList.contains(cls)) {
                return false;
            }
        }
        return true;
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
    Dom.prototype.index = function (dom) {
        var node = dom.get(0);
        return this.nodes.indexOf(node);
    };
    Dom.prototype.find = function (selector) {
        var node = this.get(0);
        var nodelist = node.querySelectorAll(selector);
        return new Dom(nodelist);
    };
    Dom.prototype.getRect = function () {
        var node = this.get(0);
        var _a = node.getBoundingClientRect(), top = _a.top, left = _a.left, bottom = _a.bottom, right = _a.right, width = _a.width, height = _a.height;
        return {
            top: top,
            left: left,
            bottom: bottom,
            right: right,
            width: width,
            height: height
        };
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

function noop(data) {
    return data;
}
//# sourceMappingURL=utils.js.map

var Select = /** @class */ (function () {
    function Select(option) {
        this.options = [];
        var elem = option.elem, _a = option.placeholder, placeholder = _a === void 0 ? '请选择' : _a, _b = option.onChange, onChange = _b === void 0 ? noop : _b;
        this.placeholder = placeholder;
        this.onChange = onChange;
        this.elem = $(elem);
        this.elem.css('display', 'none');
        this.render();
    }
    /**
     * render
     */
    Select.prototype.render = function () {
        var _this = this;
        var ulHtml = "<div class='wui-select-body'><div class='wui-scroll-y'><ul class='wui-select-list'>";
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
        ulHtml += '</ul></div></div>';
        var list = this.list = $(ulHtml);
        list.on('click', function (e) {
            var target = e.target;
            if (target instanceof Element) {
                var items = list.find('.wui-select-item');
                var index = items.index($(target));
                _this.select(index);
            }
        });
        // this.list.after(this.elem);
        var titleHtml = "\n            <div class='wui-select-title'>\n                <input type='text' readonly='readonly' autocompolete='off' placeholder='" + this.placeholder + "' class='wui-select-input' >\n                <i class='wui-select-input-icon'>\n                <svg t=\"1569127389612\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"1109\" width=\"20\" height=\"20\"><path d=\"M512.726547 675.318646c-8.063653 0-15.790638-3.245927-21.435195-9.006118L231.175103 400.906809c-11.603269-11.837606-11.410887-30.840402 0.427742-42.442648 11.837606-11.601222 30.841426-11.410887 42.442648 0.427742l238.681054 243.534596L751.407602 358.891903c11.601222-11.839653 30.602995-12.033058 42.442648-0.427742 11.839653 11.603269 12.031011 30.605042 0.427742 42.442648L534.161742 666.312528C528.517185 672.072719 520.791224 675.318646 512.726547 675.318646z\" p-id=\"1110\" fill=\"#707070\"></path></svg>\n                </i>\n            </div>\n        ";
        var title = this.title = $(titleHtml);
        title.on('click', function (e) {
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            else {
                e.cancelBubble = true;
            }
            _this.toggleStatus(title);
        });
        title.after(this.elem);
    };
    Select.prototype.toggleStatus = function (title) {
        var isFocus = title.hasClass('wui-select-focus');
        if (isFocus) {
            this.hide(title);
        }
        else {
            this.show(title);
        }
    };
    Select.prototype.show = function (title) {
        var _this = this;
        title.addClass('wui-select-focus');
        var _a = title.getRect(), left = _a.left, top = _a.top, height = _a.height;
        var body = $(document.body);
        var list = this.list;
        list.css('top', top + height + 12 + "px");
        list.css('left', left + "px");
        list.append(body);
        list.removeClass('zoom-out-y');
        list.addClass('zoom-in-y');
        var cb = function () {
            window.removeEventListener('click', cb);
            _this.hide(title);
        };
        window.addEventListener('click', cb);
        clearTimeout(this.timer);
        this.timer = setTimeout(function () {
            list.removeClass('zoom-in-y');
        }, 200);
        // await wait(200);
        // list.removeClass('zoom-in-y');
    };
    Select.prototype.hide = function (title) {
        var _this = this;
        title.removeClass('wui-select-focus');
        var list = this.list;
        list.removeClass('zoom-in-y');
        list.addClass('zoom-out-y');
        // await wait(200);
        clearTimeout(this.timer);
        this.timer = setTimeout(function () {
            _this.list.remove();
            list.removeClass('zoom-out-y');
        }, 200);
    };
    Select.prototype.select = function (index) {
        var seleted = this.options[index];
        var value = this.selectValue = seleted.value;
        var input = this.title.find('.wui-select-input');
        input.val(value);
        this.onChange(seleted);
    };
    Select.prototype.getValue = function () {
        return this.selectValue;
    };
    Select.prototype.setValue = function (value) {
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
