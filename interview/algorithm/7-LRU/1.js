class LRUCache {
  constructor(capacity) {
    // capacity表示容量
    this.capacity = capacity;
    // map表示缓存
    this.map = new Map();
  }
  //  从缓存中获取数据
  get(key) {
    if (this.map.has(key)) {
      const value = this.map.get(key);
      this.map.delete(key);
      this.map.set(key, value);
      return value;
    }
    return -1;
  }
  // 将数据添加到缓存
  put(key, value) {
    // 若存在 则更新
    if (this.map.has(key)) {
      this.map.delete(key);
      this.map.set(key, value);
      return;
    }
    // 若不存在 则添加
    // 若容量足够 则直接添加
    if (this.map.size < this.capacity) {
      this.map.set(key, value);
    } else {
      // 删除最久未使用的数据，也就是第一个数据
      this.map.delete(this.map.keys().next().value);
      this.map.set(key, value);
    }
  }
}

// 使用Map + 双向链表
class ListNode {
  constructor(value, key) {
    this.value = value;
    this.key = key;
    this.prev = null;
    this.next = null;
  }
}

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = new Map();
    this.head = new ListNode(null, null);
    this.tail = new ListNode(null, null);
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  // 访问了
  get(key) {
    if (!this.map.has(key)) return -1;
    const node = this.map.get(key);
    this.moveToTail(node);
    return node.value;
  }

  // 删除节点
  removeNode(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
    node.prev = null;
    node.next = null;
  }

  // 将节点移动到尾部
  moveToTail(node) {
    this.removeNode(node);
    this.addToTail(node);
  }

  addToTail(node) {
    this.tail.prev.next = node;
    node.prev = this.tail.prev;
    node.next = this.tail;
    this.tail.prev = node;
  }

  put(key, value) {
    if (this.map.has(key)) {
      const node = this.map.get(key);
      node.value = value;
      this.moveToTail(node);
    } else {
      const node = new ListNode(value, key);
      this.map.set(key, node);
      // 若满了
      if (this.map.size > this.capacity) {
        // 删除第一个 
        this.removeNode(this.head.next);
        this.map.delete(this.head.next.key);
      }
      // 并将节点插入到尾部
      this.addToTail(node);
    }
  }
}
