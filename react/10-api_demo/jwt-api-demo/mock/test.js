export default [
  {
    url: "/todos",
    method: "GET",
    response: () => {
      const todos = [
        {
          id: 1,
          title: "学习react",
          description: '学习react的相关知识',
        },
        {
          id: 2,
          title: "学习vue",
          description: '学习vue的相关知识',
        },
      ];
      return {
        code: 0, // 0表示成功 1表示失败
        msg: "success",
        data: todos,
      };
    },
  },
  {
    url: "/login",
    method: "POST",
    response: () => {
      return {
        code: 0, // 0表示成功 1表示失败
        msg: "success",
        data: {
          token: "123456",
        },
      };
    },
  },
];
