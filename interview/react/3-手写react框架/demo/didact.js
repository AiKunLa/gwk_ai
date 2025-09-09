/**
 * 创建一个虚拟 DOM 元素对象
 * @param {string|function} type - 元素的类型，可以是标签名或组件函数
 * @param {Object} props - 元素的属性对象
 * @param {...*} children - 元素的子节点，可以是多个
 * @returns {Object} 返回一个虚拟 DOM 元素对象
 */
function createElement(type, props, ...children) {
  // 返回一个虚拟 DOM 元素对象
  // 递归
  return {
    type,
    props: {
      // 展开传入的属性
      ...props,
      // 处理子节点，将非对象类型的子节点转换为文本节点
      // 这里的child 是createElement(type,props,...) 最后会形成一个树状结构
      children: children.map((child) =>
        typeof child === "object" ? child : createTextElement(child)
      ),
    },
  };
}

function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}
/**
 * 将虚拟 DOM 元素渲染为真实 DOM 并挂载到指定容器上
 * @param {Object} element - 虚拟 DOM 元素对象
 * @param {HTMLElement} container - 用于挂载真实 DOM 的容器元素
 */
function render(element, container) {
  // 根据虚拟 DOM 元素类型创建对应的真实 DOM 节点
  // 如果是文本节点类型，则创建文本节点；否则创建普通元素节点
  const dom =
    element.type === "TEXT_ELEMENT"
      ? document.createTextNode("") // 文本节点
      : document.createElement(element.type);

  // 定义一个函数，用于判断属性名是否为非 children 属性，即是否为 DOM 属性
  const isProperty = (key) => key !== "children";

  // 为创建的真实 DOM 节点添加属性
  // 过滤掉 children 属性，遍历其余属性并赋值给真实 DOM 节点
  Object.keys(element.props)
    .filter(isProperty)
    .forEach((name) => {
      dom[name] = element.props[name];
    });

  // 递归渲染当前节点的子节点
  // 遍历虚拟 DOM 元素的子节点数组，对每个子节点调用 render 函数并将当前创建的真实 DOM 节点作为容器
  element.props.children.forEach((child) => render(child, dom));

  // 将创建好的真实 DOM 节点挂载到指定的容器上
  container.appendChild(dom);
}


const Didact = {
  // 相当于 React
  createElement, // 生成VDOM ，一次生成在内存中
  render, // 真实的DOM并挂载
};

const element = Didact.createElement(
  "div",
  { id: "foo" },
  Didact.createElement("a", null, "bar"),
  Didact.createElement("b")
);

console.log(element);

Didact.render(element, document.getElementById("root"));
