// console.log(Math.random()) // 0-1之间的随机数
/**
 * 公平性
 * @param {number} total
 * @param {number} num
 * @returns {Array<number>}
 */
function honbao(total, num) {
  const res = []; // 存储结果
  for (let i = 0; i < num - 1; i++) {
    // 公平性 取剩下金额的平均值
    let money = Number((Math.random() * (total / (num - i))).toFixed(2));
    res.push(money); // 存储金额
    total -= money;
  }
  total = Number(total.toFixed(2));
  res.push(total); // 存储最后一个金额
  return res;
}
const num = honbao(100, 5);
console.log(num);
console.log(addNum(num));

function addNum(num) {
  let total = 0; // 存储结果
  for (let i = 0; i < num.length; i++) {
    total += num[i]; // 随机数
  }
  return total;
}
