export { create, createNS, Dom }

function create (type, attrs, inner) {
  let dom = document.createElement(type);
  if (attrs) {
    for (key in attrs) {
      if (key === "style") {
        // style 属性需要特殊处理
        let value = attrs[key];
        if (typeof value === 'string') {
          dom.style[key] = value;
        } else {
          for (atr in attrs[key]) {
            dom.style[atr] = attrs[key][atr];
          }
        }
      } else if (key === "class") {
        // style 属性需要特殊处理
        let value = attrs[key];
        if (value instanceof Array) {
          value = value.join(' ');
        }
        dom.setAttribute(key, attrs[key]);
      } else {
        // 其它属性直接设置
        dom.setAttribute(key, attrs[key]);
      }
    }
  }
  if (inner) {
    dom.innerHTML = inner;
  }
  return dom;
}

function createNS (type, attrs, ns = "http://www.w3.org/2000/svg") {
  let xdom = document.createElementNS(ns, type);
  if (attrs) {
    for (key in attrs) {
      xdom.setAttributeNS(null, key, attrs[key]);
    }
  }
  return xdom;
}

class Dom {

  constructor (_dom) {
    if (_dom instanceof Dom) {
      return _dom;
    } else if (_dom instanceof Element) {
      if (_dom in Dom.cache) {
        return Dom.cache.get(_dom);
      } else {
      this.dom = _dom;
      this.event = new Event();
      Dom.cache.set(_dom, this);
      return this;
      }
    }
  }

  parent () {
    return new Dom(this.dom.parentNode);
  }

  children (index) {
    if (index == 0 || index) {
      let resul = this.dom.children[index];
      if (resul) {
        return new Dom(resul);
      }
      return null;
    }
    let resul = Array();
    for (let i = 0 ; i < this.dom.children.length; i ++) {
      resul.push(new Dom(this.dom.children[i]));
    }
    return resul;
  }

  append (...children) {
    if (children.length == 1) {
      if (children[0] instanceof Array) {
        children = children[0];
      }
    }
    children.forEach((child) => {
      if (child instanceof Dom) {
        // this.children.push(child);
        this.dom.appendChild(child.dom);
      } else if (child instanceof Element) {
        // this.children.push(Dom.create(child));
        this.dom.appendChild(child);
      }
    });
    return this;
  }

  mount (parent) {
    if (parent instanceof Dom) {
      parent.dom.appendChild(this.dom);
    } else if (parent instanceof Element) {
      parent.appendChild(this.dom);
    }
    return this;
  }

  unMount () {
    // 另一种写法
    // let parent = this.dom.parentNode;
    // parent.removeChild(this.dom);
    this.dom.remove();
    return this;
  }

  class() {
    return this.dom.classList;
  }

  attr (key, value) {
    if (value !== undefined) {
      if (this.dom instanceof HTMLElement) {
        this.dom.setAttribute(key, value);
      } else if (this.dom instanceof SVGElement) {
        this.dom.setAttributeNS(null, key, value);
      }
      return this;
    }
    if (this.dom instanceof HTMLElement) {
      return this.dom.getAttribute(key);
    } else if (this.dom instanceof SVGElement) {
      return this.dom.getAttributeNS(null, key);
    }
  }

  prop (key, value) {
    if (value !== undefined) {
      this.dom[key] = value;
      return this;
    }
    if (typeof key === 'string') {
      return this.dom[key];
    }
    for (let prop in key) {
      this.dom[prop] = key[prop];
    }
    return this;
  }

  style (key, value) {
    if (value !== undefined) {
      this.dom.style[key] = value;
      return this;
    }
    if (typeof key === 'string') {
      return this.dom.style[key];
    }
    for (let prop in key) {
      this.dom.style[prop] = key[prop];
    }
    return this;
  }

  get height () {
    return this.dom.offsetHeight;
  }

  get width () {
    return this.dom.offsetWidth;
  }

  prev (dom) {
    if (dom) {
      let parent = this.dom.parentNode;
      if (dom instanceof Dom) {
        parent.insertBefore(dom.dom, this.dom);
      } else if (dom instanceof Element) {
        parent.insertBefore(dom, this.dom);
      }
      return dom;
    } else {
      return new Dom(this.dom.previousSibling);
    }
  }

  next (dom) {
    let next = this.dom.nextSibling;
    if (dom) {
      let parent = this.dom.parentNode;
      if (dom instanceof Dom) {
        dom = dom.dom
      }
      if (next) {
        parent.insertBefore(dom, this.dom);
      } else {
        parent.appendChild(dom);
      }
      return dom;
    } else {
      return new Dom(next);
    }
  }

  listen (type, fn, option = false) {
    this.dom.addEventListener(type, fn, option);
  }

  clear (type, fn) {
    this.dom.removeEventListener(type, fn);
  }

  resize (fn) {
    this.event.on('resize', fn);
  }

  on (type, fn) {
    this.event.on(type, fn);
  }

  emit (type) {
    this.event.emit(type);
  }

  static create (type, attrs, text) {
    return new Dom(create(type, attrs, text));
  }

  static createNS (type, attrs) {
    return new Dom(createNS(type, attrs));
  }

  static select (query) {
    return new Dom(document.querySelector(query));
  }
}

Dom.cache = new WeakMap();
