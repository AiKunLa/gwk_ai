const oldTree = {
  type: "div",
  props: {
    id: "root",
  },
  children: [
    {
      type: "h1",
      props: {
        key: "desc",
      },
      children: ["hello"],
    },
    {
      type: "p",
      props: {
        key: "text",
      },
      children: ["world"],
    },
  ],
};

const newTree = {
  type: "div",
  props: {
    id: "root",
  },
  children: [
    {
      type: "h1",
      props: {
        key: "desc",
      },
      children: ["hello react"],
    },
    {
      type: "span",
      props: {
        key: "desc",
      },
      children: ["world"],
    },
  ],
};

// 补丁列表 描述如何把DOM从oldTree变成newTree，操作最少  通过diff算法生成
const patches = [{}];

function diff(oldTree, newTree, patches) {
  if (!newTree) {
    patches.push({ type: "REMOVE", oldTree });
  } else if (!oldTree || oldTree.type !== newTree.type) {
    patches.push({ type: "REPLACE", newTree });
  } else if (typeof oldTree === "string" && typeof newTree === "string") {
    if (oldTree !== newTree) {
      patches.push({ type: "TEXT", oldText: oldTree, newText: newTree });
    }
  } else {
    // 节点类型相同，props需要更新 , 属性融合 后面的覆盖前面的
    const allProps = { ...oldTree.props, ...newTree.props };
    const propsPatches = [];

    for (const key in allProps) {
      if (oldTree.props[key] !== newTree.props[key]) {
        propsPatches.push({
          key,
          value: newTree.props[key],
        });
      }
    }

    if (propsPatches.length) {
      patches.push({ type: "PROPS", node: oldTree, props: propsPatches });
    }

    // 递归比较children
    const oldChildren = oldTree.children || [];
    const newChildren = newTree.children || [];

    const maxLength = Math.max(oldChildren.length, newChildren.length);
    const oldKey = new Map();
    oldChildren.forEach((child, i) => {
      if (child.props?.key) {
        oldKey.set(child.props.key, i);
      }
    });

    for (let i = 0; i < newChildren.length; i++) {
      const newChild = newChildren[i];
      let oldChild = oldChildren[i];

      const key = newChild.props?.key;

      // 如果key存在，则从oldKey中获取对应的索引
      if (key && oldKey.has(key)) {
        oldChild = oldChildren[oldKey.get(key)];
      }

      diff(oldChild, newChild, patches);
    }

    // 如果oldChildren的长度大于newChildren的长度，则删除多余的节点
    if(oldChildren.length > newChildren.length) {
        for(let i = newChildren.length;i<oldChildren.length;i++) {
            patches.push({type:'REMOVE',oldChild:oldChildren[i]})
        }
    }

    // 如果newChildren的长度大于oldChildren的长度，则插入多余的节点
    if(newChildren.length > oldChildren.length) {
        for(let i = oldChildren.length;i<newChildren.length;i++) {
            patches.push({type:'INSERT',newChild:newChildren[i]})
        }
    }

    return patches;
  }
}

console.log(diff(oldTree,newTree,patches));