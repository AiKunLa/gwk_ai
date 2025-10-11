# LRU 内存分配原则

lease recently used 最近最少使用原则，内存上线

内存上线为n
A -> [A]
B -> [A,B]
C -> [A,B,C]
A -> [B,C,A]
D -> [C,A,D]

使用双向队列 与Map
