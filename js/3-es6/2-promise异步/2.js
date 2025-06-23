getData1(function (result1) {
  getData2(result1, function (result2) {
    getData3(result2, function (result3) {
      // 处理结果
    });
  });
});
