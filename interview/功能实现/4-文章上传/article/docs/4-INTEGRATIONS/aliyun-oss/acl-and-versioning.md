# ACL 与版本控制

对象先以 `private` ACL 写入，服务端通过 HEAD、长度、Content-Type 和文件魔数检查后才切换为 `public-read`。

当前 Demo 要求 Bucket 从未开启版本控制并保持“未开启”状态。版本控制开启或暂停会改变覆盖和 `x-oss-forbid-overwrite` 的行为，不符合当前策略假设。
