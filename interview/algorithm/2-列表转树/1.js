const sourceList = [
  {
    id: 1,
    title: "1",
    parentId: 0,
  },
  {
    id: 2,
    title: "1-1",
    parentId: 1,
  },
  {
    id: 3,
    title: "1-1-1",
    parentId: 2,
  },
  {
    id: 4,
    title: "1-2",
    parentId: 1,
  },
  {
    id: 5,
    title: "1-2-1",
    parentId: 4,
  },
  {
    id: 6,
    title: "1-2-2",
    parentId: 4,
  },
  {
    id: 7,
    title: "1-2-2-1",
    parentId: 6,
  },
  {
    id: 8,
    title: "1-2-2-2",
    parentId: 6,
  },
];

// 列表转树
/**
 * 将扁平列表转换为树形结构
 * @param {Array} list - 待转换的扁平列表，列表中的每个元素需包含 id 和 parentId 属性
 * @returns {Array} - 转换后的树形结构数据
 */
function listToTree(list) {
  // 用于存储最终生成的树结构
  const tree = [];
  // 创建一个映射表，用于快速通过 id 查找对应的元素
  const map = {};
  // 遍历列表，将每个元素存入映射表中，键为元素的 id
  list.forEach((item) => (map[item.id] = item));
  // 再次遍历列表，构建树结构
  list.forEach((item) => {
    // 通过当前元素的 parentId 从映射表中查找其父元素
    const parent = map[item.parentId];
    if (parent) {
      // 如果存在父元素，确保父元素有 children 属性，若没有则初始化为空数组
      parent.children = parent.children || [];
      // 将当前元素添加到父元素的 children 数组中
      parent.children.push(item);
    } else {
      // 如果不存在父元素，说明该元素是根节点，将其添加到树结构中
      tree.push(item);
    }
  });
  return tree;
}

const tree = listToTree(sourceList);
console.log(tree);
