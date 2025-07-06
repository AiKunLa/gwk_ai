# 对象Blob

## base64编码
1. 什么是base64编码
    base64编码是一种用于 将二进制数据编码为可打印ASCII字符的编码方案，它将每个6位的二进制数据组合为一个8位的ASCII字符。
    一种文件的另一种表达方式
2. base64编码的作用
    base64编码的作用是将二进制数据转换为文本数据，以便在文本协议中传输二进制数据。


3. base64转为Object URL的过程
base64编码（字符串）《——》 二进制字符串 《——》ASCII值（0-255）  8个二进制位《——》二进制 （6个二进制位）
    - 使用atob() 将base64编码的字符串转换为二进制字符串
        
    - new Uint8Array()
        将二进制字符串转换为ASCII值的数组

    - 二进制文件对象描述 new Blob([Uint8Array],{type:'image/jpeg'})
        - Uint8Array 二进制数组
        - type 文件类型

    - URL.createObjectURL(Blob)
        创建一个URL（地址）对象，该对象指向一个Blob对象，这个地址指向Blob
        访问该地址就可以获取文件