// 假设有两个非常大的有序文件（内容已按从小到大排序），由于内存限制（只有 2GB），无法一次性将它们全部读入。
// 请问如何利用**双指针（或类似流式处理）**的思想，将它们高效地合并为一个新的有序大文件？

/**
 * 归并算法
 */

import fs from 'fs'
import readline from 'readline'
import { finished } from 'stream/promises'; // ES6 引入 stream 的 promise 版本

/**
 * 创建一个异步行迭代器工厂
 * 利用 ES6 Generator 思想封装 readline，返回一个可 await 的对象
 * @param {string} filePath - 要读取的文件路径
 * @param {number} highWaterMark - 读取流的高水位标记，默认 1MB，用于控制内存使用
 * @returns {AsyncIterator<string>} 返回一个异步迭代器，可以逐行读取文件
 */
const createLineIterator = (filePath, highWaterMark = 1024 * 1024) => {
    // 创建一个读取流，使用指定的编码和缓冲区大小
    const stream = fs.createReadStream(filePath, {
        encoding: 'utf-8',
        highWaterMark
    })

    // 创建 readline 接口，用于逐行读取流
    const r1 = readline.createInterface({
        input: stream,
        crlfDelay: Infinity  // 处理不同换行符的延迟
    })

    // 返回异步迭代器，允许使用 for-await-of 循环逐行处理
    return r1[Symbol.asyncIterator]();

}

/**
 * 合并两个有序文件，使用双指针思想
 * @param {string} file1 - 第一个文件路径
 * @param {string} file2 - 第二个文件路径
 * @param {string} outputFile - 输出文件路径
 */
const mergeFiles = async (file1, file2, outputFile) => {
    // 创建两个文件的异步迭代器
    const iter1 = createLineIterator(file1);
    const iter2 = createLineIterator(file2);

    // 创建写入流
    const writeStream = fs.createWriteStream(outputFile, { encoding: 'utf-8' });

    try {
        // 获取第一个元素
        let result1 = await iter1.next();
        let result2 = await iter2.next();

        // 双指针合并：比较两个文件当前行，选择较小的写入输出文件
        while (!result1.done || !result2.done) {
            if (result1.done) {
                // 文件1已读完，写入文件2剩余内容
                writeStream.write(result2.value + '\n');
                result2 = await iter2.next();
            } else if (result2.done) {
                // 文件2已读完，写入文件1剩余内容
                writeStream.write(result1.value + '\n');
                result1 = await iter1.next();
            } else {
                // 比较当前行，写入较小的
                if (result1.value <= result2.value) {
                    writeStream.write(result1.value + '\n');
                    result1 = await iter1.next();
                } else {
                    writeStream.write(result2.value + '\n');
                    result2 = await iter2.next();
                }
            }
        }
    } finally {
        // 确保写入流关闭
        writeStream.end();
        await finished(writeStream);
    }
}

// 示例使用（假设有 file1.txt 和 file2.txt）
// mergeFiles('file1.txt', 'file2.txt', 'merged.txt');
