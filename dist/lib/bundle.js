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
function preventDefault(event) {
    if (event.preventDefault) {
        event.preventDefault();
    }
    else {
        event.returnValue = false;
    }
}
/**
 * 根据事件参数获取冒泡的所有元素
 * @param {Event} e
 */
function eventPath(e) {
    /**
     * ie11 , edge
     */
    var target = e.target;
    return [target].concat(getParents(target), []);
}
/**
 * 找到某个元素的所有祖先元素
 * @param {HTMLElement} target
 * @param {null|Array} cache
 */
function getParents(target, cache) {
    var parents = cache || [];
    var parentNode = target.parentNode;
    if (parentNode) {
        return getParents(parentNode, parents.concat([parentNode]));
    }
    return parents;
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
    Dom.prototype.on = function (type, callback, context) {
        var _this = this;
        this.each(function (node) {
            var eventHandler = function (e) {
                if (!e) {
                    e = window.event;
                }
                callback.call(context || node, e);
            };
            if (!node["W_" + type]) {
                node["W_" + type] = [];
            }
            var hit = _this.hasHandler(node, type, callback);
            if (hit >= 0) {
                _this.removeHandler(node, type, callback);
            }
            node["W_" + type].push({
                callback: eventHandler,
                src: callback
            });
            node.addEventListener(type, eventHandler, false);
        });
        return this;
    };
    Dom.prototype.off = function (type, callback) {
        this.each(function (node) {
            node.removeEventListener(type, callback);
        });
        return this;
    };
    Dom.prototype.removeHandler = function (node, type, callback) {
        var handlers = node['W__' + type];
        if (!handlers) {
            return this;
        }
        var doRemove = function (type, callback) {
            node.removeEventListener(type, callback, false);
        };
        if (!callback) {
            for (var i = 0, len = handlers.length; i < len; i++) {
                var callback_1 = handlers[i].callback;
                doRemove(type, callback_1);
            }
            delete node['W__' + type];
            return this;
        }
        var hit = this.hasHandler(node, type, callback);
        if (hit < 0) {
            return this;
        }
        var hiter = handlers[hit];
        doRemove(type, hiter.callback);
    };
    Dom.prototype.hasHandler = function (node, type, callback) {
        var handlers = node['W__' + type];
        if (!node || !handlers || !callback) {
            return -1;
        }
        for (var i = 0; i < handlers.length; i++) {
            if (handlers.src === callback) {
                return i;
            }
        }
        return -1;
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
                    node.value = String(value);
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
function merge(o1, o2) {
    return Object.assign(o1, o2);
}
var canvas, ctx;
function getRgba(color) {
    if (!canvas || !ctx) {
        canvas = createElement('<canvas width=1 height=1></canvas>');
        ctx = canvas[0].getContext('2d');
    }
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    var colorData = ctx.getImageData(0, 0, 1, 1).data;
    var a = colorData[3] / 255;
    a = parseFloat(a.toFixed(2));
    return {
        r: colorData[0],
        g: colorData[1],
        b: colorData[2],
        a: a
    };
}
function toInt(value) {
    var int = parseInt(value);
    if (isNaN(int)) {
        return 0;
    }
    return int;
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

var css$2 = ".ew-cp-trigger {\r\n    box-sizing: border-box;\r\n    border: 1px solid #e6e6e6;\r\n    border-radius: 4px;\r\n    display: flex;\r\n    justify-content: center;\r\n    align-items: center;\r\n    padding: 3px;\r\n    cursor: pointer;\r\n}\r\n\r\n.ew-cp-alpha-bg, .ew-cp-color-bg {\r\n    width: 100%;\r\n    height: 100%;\r\n    border-radius: 2px;\r\n}\r\n\r\n.ew-cp-color-bg {\r\n    display: flex;\r\n    justify-content: center;\r\n    align-items: center;\r\n}\r\n\r\n.ew-cp-color-icon {\r\n    width: 100%;\r\n    height: 100%;\r\n    display: flex;\r\n    justify-content: center;\r\n    align-items: center;\r\n}\r\n\r\n.ew-cp-panel {\r\n    width: 220px;\r\n    height: auto;\r\n    padding: 10px;\r\n    box-sizing: border-box;\r\n    box-shadow: 0 3px 7px rgba(0, 0, 0, 0.3);\r\n    border-radius: 4px;\r\n    overflow: hidden;\r\n}\r\n\r\n.ew-hsvp {\r\n    position: relative;\r\n    cursor: crosshair;\r\n}\r\n\r\n.ew-hsvp-m1 {\r\n    position: absolute;\r\n    top: 0;\r\n    left: 0;\r\n    width: 100%;\r\n    height: 100%;\r\n    background: linear-gradient(180deg, transparent 0, #000);\r\n}\r\n\r\n.ew-hsvp-m2 {\r\n    position: absolute;\r\n    top: 0;\r\n    left: 0;\r\n    width: 100%;\r\n    height: 100%;\r\n    background: linear-gradient(90deg, #fff 0, transparent);\r\n}\r\n\r\n.ew-hsvc {\r\n    width: 8px;\r\n    height: 8px;\r\n    border-radius: 50%;\r\n    box-shadow: 0px 0px 2px rgb(0, 0, 0);\r\n    overflow: hidden;\r\n    border: 2px solid #fff;\r\n    position: absolute;\r\n    top: 0px;\r\n    left: 0px;\r\n}\r\n\r\n.ew-hp {\r\n    width: 100%;\r\n    height: 15px;\r\n    margin-top: 10px;\r\n    position: relative;\r\n    cursor: pointer;\r\n    background: linear-gradient(90deg, red 0, #f90 10%, #cdff00 20%, #35ff00 30%, #0f6 40%, #00fffd 50%, #06f 60%, #3200ff 70%, #cd00ff 80%, #f09 90%, red);\r\n}\r\n\r\n.ew-alpha {\r\n    width: 100%;\r\n    height: 15px;\r\n    margin-top: 10px;\r\n    position: relative;\r\n    cursor: pointer;\r\n    background: linear-gradient(to right, rgba(38, 18, 3, 0) 0%, rgb(38, 18, 3) 100%);\r\n    display: none;\r\n}\r\n\r\n.ew-cp-rgba .ew-alpha {\r\n    display: flex;\r\n}\r\n\r\n.ew-alpha-bg, .ew-cip-pre-bg {\r\n    width: 100%;\r\n    height: 100%;\r\n}\r\n\r\n.ew-cp-rgba .ew-alpha, .ew-cp-rgba .ew-cip-pre{\r\n    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==);\r\n    background-repeat: repeat;\r\n}\r\n\r\n.ew-hpc, .ew-alphac {\r\n    position: absolute;\r\n    height: 19px;\r\n    top: -2px;\r\n    left: -2px;\r\n    width: 4px;\r\n    border: 1px solid #000;\r\n    border-radius: 1px;\r\n    background-color: #fff;\r\n}\r\n\r\n.ew-cip-row {\r\n    display: flex;\r\n    align-items: center;\r\n    justify-content: space-between;\r\n    font-size: 12px;\r\n    height: 18px;\r\n    line-height: 18px;\r\n    margin-top: 10px;\r\n}\r\n\r\n.ew-cip-i {\r\n    height: 18px;\r\n    width: 30px;\r\n    border: 1px solid #e0e1e5;\r\n    line-height: 18px;\r\n    font-size: 12px;\r\n}\r\n\r\n.ew-cip-row-sub {\r\n    height: 30px;\r\n    line-height: 30px;\r\n    display: flex;\r\n    align-items: center;\r\n}\r\n\r\n.ew-cip-hex-input {\r\n    height: 18px;\r\n    width: 45px;\r\n    border: 1px solid #e0e1e5;\r\n    line-height: 18px;\r\n    font-size: 12px;\r\n}\r\n\r\n.ew-cip-pre {\r\n    display: inline-block;\r\n    width: 40px;\r\n    background: #f00;\r\n    height: 20px;\r\n    border-radius: 2px;\r\n    overflow: hidden;\r\n}\r\n\r\n.ew-cp-row-save {\r\n    height: 24px;\r\n    line-height: 24px;\r\n    width: auto;\r\n    padding: 0 10px;\r\n    border: 1px solid #dcdfe6;\r\n    cursor: pointer;\r\n    border-radius: 2px;\r\n    outline: none;\r\n}\r\n\r\n.ew-cp-row-save:hover {\r\n    border-color: #409eff;\r\n    color: #409eff;\r\n}";
styleInject(css$2);

//  颜色之间的相互转换
function rgbToHex(r, g, b) {
    r = r.toString(16);
    if (r.length == 1) {
        r = '0' + r;
    }
    g = g.toString(16);
    if (g.length == 1) {
        g = '0' + g;
    }
    b = b.toString(16);
    if (b.length == 1) {
        b = '0' + b;
    }
    return (r + g + b).toUpperCase();
}

function rgbToHsv(r, g, b) {
    r = toInt(r);
    g = toInt(g);
    b = toInt(b);
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0,
        s = 0,
        v = 0;

    const sub = max - min;
    if (max === min) {
        h = 0;
    } else {
        if (r === max) {
            if (g >= b) {
                h = 60 * (g - b) / sub;
            } else {
                h = 60 * (g - b) / sub + 360;
            }
        } else if (g === max) {
            h = 60 * (b - r) / sub + 120;
        } else {
            h = 60 * (r - g) / sub + 240;
        }
    }
    if (h > 360) {
        h -= 360;
    } else if (h < 0) {
        h += 360;
    }
    s = sub / max;
    v = max / 255;
    h /= 360;
    s = isNaN(s) ? 0 : s;
    return {
        h,
        s,
        v
    }
}

/**
 * 传入0-1
 */
function hsvToRgb(h, s, v) {
    h *= 360;
    let r = 0;
    let g = 0;
    let b = 0;
    const i = Math.floor(h / 60);
    const f = (h / 60) - i;
    const p = v * (1 - s);
    const q = v * (1 - (f * s));
    const t = v * (1 - (1 - f) * s);
    r = v;
    g = t;
    b = p;
    if (i === 0) {
        r = v;
        g = t;
        b = p;
    }
    if (i === 1) {
        r = q;
        g = v;
        b = p;
    }
    if (i === 2) {
        r = p;
        g = v;
        b = t;
    }
    if (i === 3) {
        r = p;
        g = q;
        b = v;
    }
    if (i === 4) {
        r = t;
        g = p;
        b = v;
    }
    if (i === 5) {
        r = v;
        g = p;
        b = q;
    }
    r = Math.round(r * 255);
    g = Math.round(g * 255);
    b = Math.round(b * 255);
    return {
        r,
        g,
        b
    }
}

var defaultOpts = {
    onChange: noop,
    alpha: true,
    value: '#f00'
};
var ColorPicker = /** @class */ (function () {
    function ColorPicker(opts) {
        this.option = merge(defaultOpts, opts);
        this.panelWidth = 200;
        this.panelHeight = 150;
        this.$el = $(opts.el);
        var _a = this.option, value = _a.value, alpha = _a.alpha;
        var _b = getRgba(value), r = _b.r, g = _b.g, b = _b.b, a = _b.a;
        this.option.value = "rgba(" + r + "," + g + "," + b + "," + (alpha ? a : 1) + ")";
        this.createIcon();
    }
    ColorPicker.prototype.setValue = function (color) {
        var _a = getRgba(color), r = _a.r, g = _a.g, b = _a.b, a = _a.a;
        var alpha = this.option.alpha;
        if (!alpha) {
            a = 1;
        }
        // this.rgba = { r, g, b, a }
        this.setRgba({ r: r, g: g, b: b, a: a });
        var _b = rgbToHsv(r, g, b), h = _b.h, s = _b.s, v = _b.v;
        this.setHsv({ h: h, s: s, v: v });
        var hex = rgbToHex(r, g, b);
        this.setHex(hex);
        this.setHcPos(h);
        this.setHsvcPos(s, v);
        this.setAlphacPos(a);
    };
    ColorPicker.prototype.getValue = function () {
        var _a = this.rgba, r = _a.r, g = _a.g, b = _a.b, a = _a.a;
        return "rgba(" + r + "," + g + "," + b + "," + a + ")";
    };
    ColorPicker.prototype.getHex = function () {
        return "#" + this.hex;
    };
    ColorPicker.prototype.destroy = function () {
    };
    ColorPicker.prototype.setHsv = function (_a) {
        var h = _a.h, s = _a.s, v = _a.v;
        this.hsv = { h: h, s: s, v: v };
    };
    ColorPicker.prototype.setHex = function (hex) {
        this.$hexInput.val(hex);
        this.hex = hex;
    };
    ColorPicker.prototype.setRgba = function (_a) {
        var _b = _a.r, r = _b === void 0 ? this.rgba.r : _b, _c = _a.g, g = _c === void 0 ? this.rgba.g : _c, _d = _a.b, b = _d === void 0 ? this.rgba.b : _d, _e = _a.a, a = _e === void 0 ? this.rgba.a : _e;
        this.rgba = { r: r, g: g, b: b, a: a };
        this.$rInput.val(r);
        this.$gInput.val(g);
        this.$bInput.val(b);
        this.$aInput.val(a);
        this.$alphaPanel.css('background', "linear-gradient(to right, rgba(" + r + "," + g + "," + b + ", 0) 0%, rgb(" + r + "," + g + "," + b + ") 100%)");
        this.$preview.css('backgroundColor', "rgba(" + r + "," + g + "," + b + "," + a + ")");
    };
    ColorPicker.prototype.setHcPos = function (h) {
        var panelWidth = this.panelWidth;
        var half = 2;
        var x = h * panelWidth - half;
        this.$hCursor.css('left', x + "px");
        var _a = hsvToRgb(h, 1, 1), r = _a.r, g = _a.g, b = _a.b;
        this.$hsvPanel.css('background', "rgb(" + r + "," + g + "," + b + ")");
    };
    ColorPicker.prototype.setAlphacPos = function (a) {
        var panelWidth = this.panelWidth;
        var half = 2;
        var x = a * panelWidth - half;
        this.$alphaCursor.css('left', x + "px");
        this.setRgba({ a: a });
    };
    ColorPicker.prototype.setHsvcPos = function (s, v) {
        var _a = this, panelWidth = _a.panelWidth, panelHeight = _a.panelHeight;
        var half = 6;
        var x = s * panelWidth - half;
        var y = (1 - v) * panelHeight - half;
        this.$hsvCursor.css('left', x + "px");
        this.$hsvCursor.css('top', y + "px");
    };
    ColorPicker.prototype.createIcon = function () {
        this.$el.css('display', 'none');
        var icon = this.$icon = $("\n        <div class=\"ew-cp-trigger\" style=\"width: 28px; height: 28px\">\n            <span class=\"ew-cp-alpha-bg\">\n                <span class=\"ew-cp-color-bg\" style=\"background-color:" + this.option.value + "\">\n                    <i class='ew-cp-color-icon'>\n                        <svg t=\"1569127389612\" class=\"icon\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"1109\" width=\"20\" height=\"20\"><path d=\"M512.726547 675.318646c-8.063653 0-15.790638-3.245927-21.435195-9.006118L231.175103 400.906809c-11.603269-11.837606-11.410887-30.840402 0.427742-42.442648 11.837606-11.601222 30.841426-11.410887 42.442648 0.427742l238.681054 243.534596L751.407602 358.891903c11.601222-11.839653 30.602995-12.033058 42.442648-0.427742 11.839653 11.603269 12.031011 30.605042 0.427742 42.442648L534.161742 666.312528C528.517185 672.072719 520.791224 675.318646 512.726547 675.318646z\" p-id=\"1110\" fill=\"#fff\"></path></svg>\n                    </i>\n                </span>\n            </span>\n        </div>");
        icon.on('click', this.show, this);
        icon.after(this.$el);
    };
    ColorPicker.prototype.show = function () {
        var _this = this;
        if (!this.$panel) {
            this.createPanel();
        }
        this.adjustPotion();
        this.$panel.append($(document.body));
        var handler = function (e) {
            var path = eventPath(e);
            for (var i = 0; i < path.length; i++) {
                var el = path[i];
                if (el.classList &&
                    el.classList.contains('ew-cp-panel')) {
                    return;
                }
            }
            window.removeEventListener('mousedown', handler);
            _this.$panel.remove();
        };
        window.addEventListener('mousedown', handler);
    };
    ColorPicker.prototype.adjustPotion = function () {
        var _a = this.$panel.getRect(), width = _a.width, height = _a.height;
        var rect = this.$icon.getRect();
        var _b = window.screen, availHeight = _b.availHeight, availWidth = _b.availWidth;
        var x = rect.left + rect.width / 2 - width / 2;
        if (x + width > availWidth) {
            x = availWidth - width;
        }
        if (x < 0) {
            x = 0;
        }
        var y = rect.top + 20;
        if (y + height > availHeight) {
            y = availHeight - height;
        }
        if (y < 0) {
            y = 0;
        }
        this.$panel.css('left', x + "px");
        this.$panel.css('top', y + "px");
    };
    ColorPicker.prototype.createPanel = function () {
        var wrap = this.$panel = $("<div class=\"ew-cp-panel\"></div>");
        if (this.option.alpha) {
            wrap.addClass('ew-cp-rgba');
        }
        var hsvPanel = this.createHsvPanel();
        var hPanel = this.createHPanel();
        var alphaPanel = this.createAlphaPanel();
        var inputPanel = this.createInputPanel();
        hsvPanel.append(wrap);
        hPanel.append(wrap);
        alphaPanel.append(wrap);
        inputPanel.append(wrap);
        this.setValue(this.option.value);
    };
    ColorPicker.prototype.createHPanel = function () {
        var hPanel = this.$hPanel = $("<div class=\"ew-hp\"></div>");
        var hCursor = this.$hCursor = $("<span class=\"ew-hpc\"></span>");
        hCursor.append(hPanel);
        function dragHc(e) {
            preventDefault(e);
            var _a = hPanel.getRect(), left = _a.left, width = _a.width;
            var half = 2;
            var x = e.pageX - left - half;
            if (x < -half) {
                x = -half;
            }
            if (x > width - half) {
                x = width - half;
            }
            var hsv = this.hsv;
            var h = hsv.h = (x + half) / width;
            var rgb = hsvToRgb(h, 1, 1);
            var color = "rgb(" + rgb.r + "," + rgb.g + "," + rgb.b + ")";
            this.$hsvPanel.css('backgroundColor', color);
            hCursor.css('left', x + "px");
            var _b = hsvToRgb(h, hsv.s, hsv.v), r = _b.r, g = _b.g, b = _b.b;
            this.setRgba({ r: r, g: g, b: b });
            var hex = rgbToHex(r, g, b);
            this.setHex(hex);
        }
        var handler = dragHc.bind(this);
        function off() {
            window.removeEventListener('mousemove', handler);
            window.removeEventListener('mouseup', off);
            window.removeEventListener('mouseleave', off);
        }
        hPanel.on('mousedown', function (e) {
            handler(e);
            window.addEventListener('mousemove', handler);
            window.addEventListener('mouseup', off);
            window.addEventListener('mouseleave', off);
        }, this);
        return hPanel;
    };
    ColorPicker.prototype.createAlphaPanel = function () {
        var alphaPanel = $("<div class=\"ew-alpha\"><div class=\"ew-alpha-bg\"></div></div>");
        var alphaCursor = this.$alphaCursor = $("<span class=\"ew-alphac\"></span>");
        this.$alphaPanel = alphaPanel.find('.ew-alpha-bg');
        alphaCursor.append(alphaPanel);
        function dragHc(e) {
            preventDefault(e);
            var _a = alphaPanel.getRect(), left = _a.left, width = _a.width;
            var half = 2;
            var x = e.pageX - left - half;
            if (x < -half) {
                x = -half;
            }
            if (x > width - half) {
                x = width - half;
            }
            alphaCursor.css('left', x + "px");
            var rgba = this.rgba;
            var a = rgba.a = (x + half) / width;
            a = parseFloat(a.toFixed(2));
            this.$aInput.val(a);
            this.rgba = merge(this.rgba, { a: a });
            var _b = this.rgba, r = _b.r, g = _b.g, b = _b.b;
            this.$preview.css('backgroundColor', "rgba(" + r + "," + g + "," + b + "," + a + ")");
        }
        var handler = dragHc.bind(this);
        function off() {
            window.removeEventListener('mousemove', handler);
            window.removeEventListener('mouseup', off);
            window.removeEventListener('mouseleave', off);
        }
        alphaPanel.on('mousedown', function (e) {
            handler(e);
            window.addEventListener('mousemove', handler);
            window.addEventListener('mouseup', off);
            window.addEventListener('mouseleave', off);
        }, this);
        return alphaPanel;
    };
    ColorPicker.prototype.createHsvPanel = function () {
        var hsvPanel = this.$hsvPanel = $("\n        <div style=\"width: " + this.panelWidth + "px; height:" + this.panelHeight + "px\" class=\"ew-hsvp\"><div class=\"ew-hsvp-m2\"></div><div class=\"ew-hsvp-m1\"></div></div>");
        var hsvCusor = this.$hsvCursor = $("<span class=\"ew-hsvc\"></span>");
        hsvCusor.append(hsvPanel);
        function dragHsvc(e) {
            var _this = this;
            preventDefault(e);
            var _a = hsvPanel.getRect(), top = _a.top, left = _a.left, width = _a.width, height = _a.height;
            var half = 6;
            var x = e.pageX - left - half;
            var y = e.pageY - top - half;
            if (x < -half) {
                x = -half;
            }
            if (x > width - half) {
                x = width - half;
            }
            if (y < -half) {
                y = -half;
            }
            if (y > height - half) {
                y = height - half;
            }
            var timer = setTimeout(function () {
                clearTimeout(timer);
                hsvCusor.css('top', y + "px");
                hsvCusor.css('left', x + "px");
                var s = _this.hsv.s = (x + half) / width;
                var v = _this.hsv.v = 1 - (y + half) / height;
                var _a = hsvToRgb(_this.hsv.h, s, v), r = _a.r, g = _a.g, b = _a.b;
                _this.setRgba({ r: r, g: g, b: b });
                var hex = rgbToHex(r, g, b);
                _this.setHex(hex);
            }, 10);
        }
        var handler = dragHsvc.bind(this);
        function off() {
            window.removeEventListener('mousemove', handler);
            window.removeEventListener('mouseup', off);
            window.removeEventListener('mouseleave', off);
        }
        hsvPanel.on('mousedown', function (e) {
            handler(e);
            window.addEventListener('mousemove', handler);
            window.addEventListener('mouseup', off);
            window.addEventListener('mouseleave', off);
        }, this);
        return hsvPanel;
    };
    ColorPicker.prototype.createInputPanel = function () {
        var wrap = $("<div class=\"ew-cip\"></div>");
        var row1 = $("\n        <div class=\"ew-cip-row1 ew-cip-row\">\n            <div class=\"ew-cip-row-sub\">R:<input value=255 class=\"ew-cip-i-r ew-cip-i\"></div>\n            <div class=\"ew-cip-row-sub\">G:<input value=0 class=\"ew-cip-i-g ew-cip-i\"></div>\n            <div class=\"ew-cip-row-sub\">B:<input value=0 class=\"ew-cip-i-b ew-cip-i\"></div>\n            <div class=\"ew-cip-row-sub\">A:<input value=0 class=\"ew-cip-i-a ew-cip-i\"></div>\n        </div>");
        row1.append(wrap);
        this.$rInput = row1.find('.ew-cip-i-r');
        this.$gInput = row1.find('.ew-cip-i-g');
        this.$bInput = row1.find('.ew-cip-i-b');
        this.$aInput = row1.find('.ew-cip-i-a');
        var row2 = $("\n        <div class=\"ew-cip-row2 ew-cip-row\">\n            <div class=\"ew-cip-row-sub\">\n                HEX:#<input value=\"FF0000\" maxlength=6 class=\"ew-cip-hex-input\">\n            </div>\n            <div class=\"ew-cip-row-sub ew-cip-pre\">\n                <div class=\"ew-cip-pre-bg\"></div>\n            </div>\n            <button class=\"ew-cp-row-save\">\u786E\u5B9A</button>\n        </div>");
        row2.append(wrap);
        this.$hexInput = row2.find('.ew-cip-hex-input');
        this.$preview = row2.find('.ew-cip-pre-bg');
        return wrap;
    };
    return ColorPicker;
}());
//# sourceMappingURL=ColorPicker.js.map

function select(option) {
    return new Select(option);
}
var index = {
    select: select
};
//# sourceMappingURL=index.js.map

export default index;
export { ColorPicker, select };
//# sourceMappingURL=bundle.js.map
