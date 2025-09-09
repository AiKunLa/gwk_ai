/**
 *  @jsx Didact.createElement
 */

const element = Didact.createElement("div", {
  id: "foo"
}, Didact.createElement("a", {
  href: ""
}, "bar"), Didact.createElement("b", null));

// 上面的注释表示：告诉 Babel 在编译时使用``Didact.createElement`` 而不是默认的``React.createElement``
