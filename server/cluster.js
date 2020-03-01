const cluster = require("cluster");
const os = require("os"); // 获取CPU 的数量
var numCPUs = os.cpus().length;
numCPUs = 2;
const process = require("process");

var workers = {};
if (cluster.isMaster) {
  // 主进程分支
  cluster.on("exit", (worker, code, signal) => {
    console.log(
      "工作进程 %d 关闭 (%s). 重启中...",
      worker.process.pid,
      signal || code
    );
    delete workers[worker.process.pid];
    worker = cluster.fork();
    workers[worker.process.pid] = worker;
  });

  for (let i = 0; i < numCPUs; i++) {
    const worker = cluster.fork();
    console.log("init ... pid", worker.process.pid);
    workers[worker.process.pid] = worker;
  }
} else {
  const app = require("./server.js");
  app.listen(4000);
}
// 当主进程被终止时，关闭所有工作进程
process.on("SIGTERM", function() {
  for (var pid in workers) {
    process.kill(pid);
  }
  process.exit(0);
});
