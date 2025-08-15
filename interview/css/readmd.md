# 定位 position

# 布局
- 响应式布局

# 居中
- 从水平居中开始

- 垂直居中
- 水平垂直居中
    1. 行内元素居中

    2. 块级元素居中
        ```css
        <!-- flexbox -->
        .parent {
            display: flex;
            justify-content: center;
            align-items: center;
        }
        ```
- 居中的优劣
    - 水平居中
    - 单行文本垂直居中 text-align: center;
    - 多行文本垂直居中 line-height

    - 固定宽高块级盒子水平居中 absolute + margin
        1.  
        ```css
        .parent {
            position: relative;
        }
        .child {
            position: absolute;
            top:0,
            left:0,
            bottom:0,
            right:0,
            width:200px,
            height:200px,
            <!-- 若没有指定宽高 则margin没有用 -->
            margin: auto;
        }
        ```
        2. 这种方式，需要频繁的计算，
        ```css
            .container {
                position: relative;
            }
            .child {
                position: absolute;
                top: calc(50% - 50px);    /* 50% 是父容器高度的一半，减去子元素高度的一半 (100px / 2) */
                left: calc(50% - 100px);  /* 50% 是父容器宽度的一半，减去子元素宽度的一半 (200px / 2) */
                width: 200px;
                height: 100px;
            }

        ```
        3. 
        ```css
            .container {
                line-height: 子元素高度
                text-align: center;
            }
            .child {
                display: inline-block;
                line-height:initial;
                vertical-align: middle;
            }

        ```
        4. vertical-align: ; line-height
            

        5. table-cell
        ```css
            .container {
                display: table-cell;
                <!-- 生效 -->
                vertical-align: middle;
                text-align: center;
            }
            .child {
                display: inline-block;
            }
        ```
        6. grid布局
        ```css
            .container {
                display:grid;
            }
            . child {
                ali-
            }
        ```




    - 不固定宽高块级盒子水平居中 


    