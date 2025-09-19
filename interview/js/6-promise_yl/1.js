// 一堆任务
// 按顺序插入results []

const tasks = [
  {
    id: "A",
    run: () => new Promise((res) => setTimeout(() => res("A done"))),
    deps: [],
  },
  {
    id: "B",
    run: () => Promise.resolve("B done"),
    deps: [""],
  },
];
// 拓扑结构，拓扑排序
// 在每次循环中，讲deps.length === 0 的放入Promise.all()中进行执行
// 然后遍历tasks 数组，移除将每一项的deps中这次已经执行完毕task的id
// 进入下一次循环

async function runTask(tasks) {
  // Map可以接收一个数组来实例化 第一项为key 第二项为value
  const taskMap = new Map(tasks.map((t) => [t.id, t]));
  // 只统计有效依赖（存在于 taskMap 中的依赖）
  const indegress = new Map(
    tasks.map((t) => [t.id, t.deps.filter((d) => taskMap.has(d)).length])
  );
  const result = {};

  // 记录已经完成的task 的id
  const completed = new Set();

  let ready = tasks
    .filter((task) => indegress.get(task.id) === 0)
    .map((task) => task.id);

  async function run(id) {
    if (completed.has(id)) return; // 避免重复执行

    const curTask = taskMap.get(id);
    if (!curTask) return;

    const output = await curTask.run();
    result[id] = output;
    completed.add(id);

    // 仅处理依赖于当前任务的任务，且在入度减为 0 时入队
    for (const [curId, task] of taskMap) {
      if (task.deps.includes(id)) {
        // 当前执行的task 的id为当前循环的入度时，当前循环入度减一
        const prev = indegress.get(curId) ?? 0;
        const next = Math.max(0, prev - 1);
        indegress.set(curId, next);
        
        // 若当前遍历的task 入度为0，且没有执行过
        if (next === 0 && !completed.has(curId)) {
          ready.push(curId);
        }
      }
    }
  }

  while (ready.length > 0) {
    const currentBatch = [...ready];
    ready = [];
    await Promise.all(currentBatch.map(run));
  }

  return result;
}

runTask(tasks).then((res) => console.log(res));