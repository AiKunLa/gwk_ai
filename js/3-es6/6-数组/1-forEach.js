// 如何中断 forEach

function brearByTryCatch(arr) {
  try {
    arr.forEach((item, index) => {
      if (item === 2) throw new Error("中断循环");
    });
  } catch (e) {
    console.log(e);
  }
}

// every 方法 用于检测数组中所有元素是否都满足条件
function checkByEvery(arr) {
  // 检测数组中是否所有元素都大于0
  return arr.every((item) => item > 0);
}

console.log(checkByEvery([1, 2, 3, 4, 5]));

// some方法 用于检测数组中是否有元素满足条件
function checkBySome(arr) {
  // 检测数组中是否有元素大于0
  return arr.some((item) => item > 0);
}

console.log(checkBySome([0, 0, 0, 0, 0]));
